/**
 * Booking Utilities
 *
 * This module handles booking-related persistence:
 * - `insertBooking` creates new booking records in the database.
 * - `blockAvailabilityDates` marks specific cottage dates as unavailable.
 *
 * Designed to maintain integrity and prevent double bookings,
 * while supporting clear, readable logic for traceability and expansion.
 */

import { connector } from './connector';
import type { BookingInput } from '../types/types';
import { ServiceError } from '../utils/errors';
import { ResultSetHeader } from 'mysql2';

/**
 * Marks the availability range of a cottage as unavailable, one day at a time.
 *
 * Used after successful booking creation to prevent overlaps or repeat assignments.
 * Adjusts check-out date by subtracting one day to maintain exclusivity boundaries.
 *
 * Dev Note:
 * This iteration logic could be further optimised with `date-fns` or similar,
 * but retains readability for direct date manipulation at the DB level.
 *
 * @param input - Booking payload with cottage name and date range
 * @throws ServiceError - If DB update fails or loop encounters a runtime error
 */
export async function blockAvailabilityDates(input: BookingInput): Promise<void> {
  const { cottage_name, check_in_date, check_out_date } = input;

  const start = new Date(check_in_date);
  const end = new Date(check_out_date);
  end.setDate(end.getDate() - 1); // Prevent blocking the check-out date

  const sql = `
    UPDATE availability 
    SET is_available = false 
    WHERE pk_available_date = ? AND fk_cottage_name = ?
  `;

  try {
    for (
      let date = new Date(start);      // Initialise 'date' to the check-in day
      date <= end;                     // Continue until the day before check-out
      date.setDate(date.getDate() + 1) // Increment 'date' by 1 day each loop
    ) {
      const formattedDate = date.toISOString().split('T')[0]; // Normalised 'YYYY-MM-DD'
      const params = [formattedDate, cottage_name];
      await connector.query(sql, params);
    }
  } catch (error) {
    console.error('Block failed:', error); // Helpful for debugging
    throw new ServiceError('Failed to block availability dates');
  }
}

/**
 * Inserts a new booking record into the database and returns its ID.
 *
 * Used during initial booking flow after all validations and date checks are complete.
 * Fields are mapped explicitly for clarity and consistency with table column names.
 *
 * Dev Note:
 * Switched to cottage name reference rather than ID to align with external FK handling.
 * Input should be fully validated prior to invocation to ensure safety.
 *
 * @param input - BookingInput object containing all required booking fields
 * @returns `number` - ID of newly created booking row
 * @throws ServiceError - If insertion fails or DB connection errors occur
 */
export async function insertBooking(input: BookingInput): Promise<number> {
  const {
    guest_id,
    cottage_name,
    check_in_date,
    check_out_date,
    total_price,
    status,
  } = input;

  const sql = `
    INSERT INTO booking (
      fk_guest_id,
      fk_cottage_name,
      check_in_date,
      check_out_date,
      total_price,
      status
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const params = [
    guest_id,
    cottage_name,
    check_in_date,
    check_out_date,
    total_price,
    status,
  ];

  try {
    // Execute SQL query and extract the first result (typically ResultSetHeader)
    const [result] = await connector.query<ResultSetHeader>(sql, params);

    // Return the ID of the newly inserted record
    return result.insertId;
  } catch (error) {
    // Log the error for debugging or monitoring
    console.error('DB Insert Error:', error);

    // Throw a custom error to signal failure to the service layer
    throw new ServiceError('Failed to create booking record');
  }
}