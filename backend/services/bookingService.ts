/* 
  Booking service module.

  Provides core functionality for creating and retrieving booking records.
  - createBookingFlow orchestrates a validation pipeline for secure, conflict-free booking creation:
    • Validates incoming data
    • Verifies guest and cottage existence
    • Checks for date logic errors and booking conflicts
    • Inserts booking into the database
    • Reserves availability dates post-confirmation

  - fetchBookingDetails dynamically retrieves booking records based on optional filters:
    • Filters include booking_id, guest_id, or cottage_id
    • Joins booking, guest, and cottage tables to form structured BookingDetails objects
    • Safely executes queries using a pooled connection for performance and reliability

  Future enhancement opportunities:
    • Integration with notification or billing workflows
*/

import { DBConnector } from '../db/connector'; // Custom DB abstraction layer to handle pooled connections.
import { ServiceError } from '../utils/errors'; // Standardised error handling for service-level failures.
import type { BookingDetails, BookingInput } from '../types/types'; // Type safety for booking payloads and returned booking data.

// Booking validation and logic utilities — modularised for readability and compliance;
import { validateBookingInput } from '../utils/validateBookingInput'; // Validates structure and consistency of booking input.
import { checkDateValidity } from '../utils/checkDateValidity'; // Ensures booking dates are in the future and logically ordered.
import { checkBookingConflicts } from '../utils/checkBookingConflicts'; // Detects overlapping bookings to prevent double-booking.
import { verifyGuestAndCottage } from '../utils/verifyGuestAndCottage'; // Confirms existence of guest and cottage entries.

// Database operations — abstracts write logic for booking creation and availability tracking
import { insertBooking, blockAvailabilityDates } from '../db/booking'; // Handles booking record insertion and updates availability table.

/**
 * Creates a new booking record after validating input and resolving conflicts.

 * Validates booking payload and confirms guest/cottage existence before insertion.
 * Ensures booking dates are logically sound and conflict-free across availability records.
 * Writes booking to the database and reserves the associated dates.
 *
 * @param input - Structured booking payload conforming to BookingInput type.
 * @returns The ID of the newly created booking, for downstream referencing.
 * 
 * Error handled inside the uitlity functions. 
 */
export async function createBookingFlow(input: BookingInput) {
  validateBookingInput(input);        //  Step 1: Sanity check inputs
  await verifyGuestAndCottage(input); //  Step 2: Ensure guest/cottage IDs exist
  await checkDateValidity(input);     //  Step 3: Prevent invalid date logic
  await checkBookingConflicts(input); //  Step 4: Avoid double booking
  const bookingId = await insertBooking(input); //  Step 5: DB write — returns ID
  await blockAvailabilityDates(input); //  Step 6: Reserve dates post-booking
  return bookingId;
}



/**
 * Returns the details of existing bookings, can be filtered by booking_id, guest_id or cottage_id.
 *
 * @param connector - Active database connection used for querying
 * @param cottage_id - Unique cottage identifier (optional)
 * @param guest_id -  Unique guest identifier (optional)
 * @param booking_id -  Unique booking identifier (optional)
 * 
 * @returns A list of objects representing exsisitng bookings. 
 * 
 * @throws ServiceError - If database update execution fails unexpectedly

 */
export const fetchBookingDetails = async (
    connector: DBConnector,
    cottage_id?: string,
    guest_id?: string,
    booking_id?: string,
): Promise<BookingDetails[]> => {
    try {
        let sql = `
        SELECT 
            b.pk_booking_id AS booking_id,
            DATE_FORMAT(b.check_in_date, '%Y-%m-%d') AS check_in_date,
            DATE_FORMAT(b.check_out_date, '%Y-%m-%d') AS check_out_date,
            b.total_price,
            b.status,
            b.guest_count,
            b.special_requests,
            g.pk_guest_id AS guest_id,
            g.name AS guest_name,
            g.email,
            g.phone_number,
            g.address,
            c.pk_cottage_name AS cottage_id,
            c.location,
            c.capacity 
        FROM booking b
        JOIN guest g ON b.fk_guest_id = g.pk_guest_id --  Inner join brings in guest details.
        JOIN cottage c ON b.fk_cottage_name = c.pk_cottage_name --  Inner join brings in cottage details.
    `;

        const filters = []; // Dynamic WHERE clause conditions added based on available filters.
        const params = [];  //  Parameter list to be safely injected into the query.

        if (cottage_id) {
            filters.push('c.pk_cottage_name = ?'); //  Filter by specific cottage.
            params.push(cottage_id);
        }

        if (guest_id) {
            filters.push('g.pk_guest_id = ?'); //  Filter by specific guest.
            params.push(guest_id);
        }

        if (booking_id) {
            filters.push('b.pk_booking_id = ?'); //  Filter by specific booking.
            params.push(booking_id);
        }

        if (filters.length > 0) {
            sql += ' WHERE ' + filters.join(' AND '); //  Adds conditional filtering.
        }

        sql += ' ORDER BY b.check_in_date ASC'; //  Sorts results chronologically by check-in date.

        const [rows] = await connector.query(sql, params); //  Executes safely with pooled DB connection.
        return rows as BookingDetails[]; //  Casts to expected return type.

    } catch (err) {
        throw new ServiceError('Failed to get booking details'); 
    }
};
