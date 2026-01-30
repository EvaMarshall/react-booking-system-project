// connector.ts
//
// This module establishes and exports a reusable database connector.
// It creates a connection pool, and provides query and connection methods.
// CHANGED: Connection initialisation with `requireEnv` guards
// CHANGED: Promise-wrapped pool exposed through modular connector

import mysql from 'mysql2';
import type { RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Retrieves the value of a required environment variable.
 * Throws an error if the variable is not defined.
 *
 * @param key - The name of the environment variable to fetch
 * @returns The corresponding value as a string
 *
 * CHANGED: Environment guard implemented for config safety
 */
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}

// Create a MySQL connection pool using validated environment values
const pool = mysql.createPool({
  host: requireEnv('DB_HOST'),      // CHANGED: Secure access to host configuration
  user: requireEnv('DB_USER'),
  password: requireEnv('DB_PASS'),
  database: requireEnv('DB_NAME'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Wrap the pool using MySQL2’s promise-based interface
const promisedPool = pool.promise();

/**
 * Modular connector exposing query and connection methods.
 *
 * CHANGED: Promise-enabled query method supports generic result typing
 * CHANGED: Connection method exposed for transaction support or advanced handling
 */
export const connector = {
  query: <T extends RowDataPacket[] | ResultSetHeader = RowDataPacket[]>(
    sql: string,
    params?: any[]
  ): Promise<[T, FieldPacket[]]> => {
    return promisedPool.query(sql, params);
  },

  getConnection: () => promisedPool.getConnection()
};

/**
 * Type representing the shape and capabilities of the connector
 *
 * CHANGED: Exported as reference type for controller and service consistency
 */
export type DBConnector = typeof connector;
