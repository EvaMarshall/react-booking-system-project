/**
 * Validates the provided booking input for completeness and logical consistency.
 *
 * Invoked before booking creation or update to ensure that the payload contains valid
 * field types, date logic, and accepted status values. Throws a ValidationError for
 * malformed or inconsistent data — maintaining system integrity and aiding traceability.
 *
 * Dev Note:
 * This utility enforces strict checks across core booking attributes, helping prevent
 * faulty state propagation and improving client-side debugging via clear messaging.
 * 
 * Strict validation strategy designed for pre-processed booking payloads.
 * Throws exceptions immediately to enforce fail-fast service execution.
 * Optimised for modular flows where upstream integrity checks are already in place.
 */

import { ValidationError } from './errors';
import type { BookingInput } from '../types/types';

/**
 * Performs booking-level input validation.
 * 
 * Ensures all required fields are present, types are correct, and booking dates are logically ordered.
 * Designed for strict backend enforcement in coordinated booking workflows.
 *
 * @param input - Full booking payload submitted via POST/PUT
 * @param input.guest_id - Unique guest identifier (must be a number)
 * @param input.cottage_name - Name of the selected cottage (must be a string)
 * @param input.check_in_date - Intended start date for the booking
 * @param input.check_out_date - Intended end date for the booking
 * @param input.total_price - Booking cost (must be a number)
 * @param input.status - Booking status, must be one of: 'confirmed', 'pending', 'cancelled'
 * 
 * @returns void (successful validation passes silently with no return payload)
 * 
 * @throws ValidationError - If any field is missing, malformed, or logically invalid
 */

export function validateBookingInput(input: BookingInput): void {
  const { guest_id, cottage_name, check_in_date, check_out_date } = input;

  //  Required fields + type assertions
  if (!guest_id || typeof guest_id !== 'number') {
    throw new ValidationError('Invalid or missing guest_id');
  }

  if (!cottage_name || typeof cottage_name !== 'string') {
    throw new ValidationError('Invalid or missing cottage_name');
  }

  if (!check_in_date || !check_out_date) {
    throw new ValidationError('Missing booking dates');
  }

  if (!input.total_price || typeof input.total_price !== 'number') {
    throw new ValidationError('Invalid or missing total_price');
  }

  if (!['confirmed', 'pending', 'cancelled'].includes(input.status)) {
    throw new ValidationError('Invalid booking status');
  }

  // Date validation
  const start = new Date(check_in_date);
  const end = new Date(check_out_date);

  // Ensuring dates are valid Date objects.
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new ValidationError('Invalid date format');
  }

  if (start > end) {
    throw new ValidationError('Start date cannot be after end date');
  }
}
