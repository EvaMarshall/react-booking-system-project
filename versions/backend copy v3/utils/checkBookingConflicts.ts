/**
 * Verifies that a cottage is available across the requested booking dates.
 * Throws a ServiceError if a conflict arises—i.e. if any existing booking overlaps the provided date range.
 * 
 * This function is intended to uphold booking integrity by preventing double bookings.
 * To be invoked within the createBooking flow inside the bookingService.ts file after input validation.
 */

import { connector } from '../db/connector';        // Utilises pooled database connection for efficiency
import { ServiceError } from './errors';            // Standardised error handling structure
import type { BookingInput } from '../types/types'; // Expected shape of booking data (typed interface)

/**
 * Checks if any existing bookings overlap the requested stay dates for a specific cottage.
 * 
 * A conflict is determined if an existing booking's date range intersects with the requested range.
 * Note: This assumes inclusive overlap — even one shared date is considered a conflict.
 * 
 * @param input - Full booking payload object
 * @param input.cottage_name - The cottage to check for overlapping reservations
 * @param input.check_in_date - Proposed arrival date for the booking
 * @param input.check_out_date - Proposed departure date for the booking
 * 
 * @returns void (throws on conflict; no return payload)
 * 
 * @throws ServiceError - Raised if any overlapping bookings are found
 */

export async function checkBookingConflicts(input: BookingInput): Promise<void> {
  const { cottage_name, check_in_date, check_out_date } = input;

  const sql = `
    SELECT pk_booking_id FROM booking
    WHERE fk_cottage_name = ?
    AND (
      check_in_date <= ? AND check_out_date >= ?
    )
  `;

  // Injects the requested date range safely into the query
  const params = [cottage_name, check_out_date, check_in_date];
  const [conflicts] = await connector.query(sql, params);

  // Throws an error if any overlap is found — indicating a scheduling conflict
  if (conflicts.length > 0) {
    throw new ServiceError('Booking conflict detected for the selected dates');
  }
}
