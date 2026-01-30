/**
 * Handles cottage availability and pricing queries for booking workflows.
 *
 * Provides database-level access to availability information, supporting features
 * like calendar rendering, date-based filtering, and conflict detection.
 * Modularised for scalability and used across booking and availability endpoints.
 */

import { DBConnector } from '../db/connector'; // Database connector supporting pooled queries
import { ServiceError } from '../utils/errors'; // Error class used for consistent failure handling
import type { AvailabilityResult } from '../types/types'; // Defines expected shape of result records


/**
 * Fetches availability and pricing data from the database based on date range,
 * optionally filtering by a specific cottage name.
 *
 * Used to populate frontend calendars for booking workflows.
 *
 * @param connector - Active DB connection used for querying
 * @param start_date - ISO-formatted string marking beginning of range
 * @param end_date - ISO-formatted string marking end of range
 * @param cottage_name - Optional cottage filter (exact match required)
 * @returns Array of availability results with metadata
 */
export const fetchAvailability = async (
  connector: DBConnector,
  start_date: string,
  end_date: string,
  cottage_name?: string
): Promise<AvailabilityResult[]> => {
  try {
    // Construct core query to join availability and cottage metadata
    let sql = `
      SELECT 
        DATE_FORMAT(a.pk_available_date, '%Y-%m-%d') AS available_date,  -- Ensures consistent date formatting
        a.fk_cottage_name,
        c.location,
        c.capacity,
        a.price,
        a.is_available
      FROM availability a
      JOIN cottage c ON a.fk_cottage_name = c.pk_cottage_name           -- Matches availability with cottage details
      WHERE a.pk_available_date BETWEEN ? AND ?                         -- Date filter for range selection
        AND a.is_available = TRUE                                       -- Restrict to active dates only
    `;

    const params: any[] = [start_date, end_date]; // Prepare base filter parameters

    // If filtering by a single cottage, append the WHERE clause
    if (cottage_name) {
      sql += ' AND a.fk_cottage_name = ?';       // Cottage match condition
      params.push(cottage_name);                 // Append cottage name to parameter list
    }

    // Order results for predictable calendar display
    sql += ' ORDER BY a.pk_available_date ASC, a.fk_cottage_name ASC';

    // Execute query and return results as array
    const [rows] = await connector.query(sql, params);
    return rows as AvailabilityResult[];

  } catch (err) {
    // Failure signals surfaced using service layer error structure
    throw new ServiceError('Failed to retrieve availability');
  }
};
