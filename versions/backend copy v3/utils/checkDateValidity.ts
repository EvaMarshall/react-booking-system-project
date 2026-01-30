/**
 * Validates a booking date range.
 *
 * Applied in booking flows to ensure both start and end dates:
 * - Fall in the future relative to the system clock
 * - Follow a correct chronological order (check-in precedes check-out)
 *
 * Throws a ServiceError for any violations to prevent bad state propagation and
 * ensure booking logic remains sound.
 *
 * Dev Note:
 * This utility focuses purely on time-based validity — format and presence checks
 *  handled separately via input validation layers. Timestamp logic prevents
 * edge case bugs caused by invalid comparisons or user-submitted past dates.
 */

import { ServiceError } from './errors';
import type { BookingInput } from '../types/types';

/**
 * Checks that the booking start date is in the future and precedes the end date.
 * 
 * Validates date logic to prevent invalid or retroactive bookings.
 *
 * @param input - Full booking payload object
 * @param input.check_in_date - Start date of the booking, expected to be in the future
 * @param input.check_out_date - End date of the booking, must follow the start date
 * 
 * @returns void (throws on invalid date logic; no return data)
 * 
 * @throws ServiceError - If dates are in the past or chronologically inconsistent
 */

export async function checkDateValidity(input: BookingInput): Promise<void> {
  const now = Date.now();
  const start = new Date(input.check_in_date).getTime();
  const end = new Date(input.check_out_date).getTime();

  // Ensure check-in is in the future
  if (start < now) {
    throw new ServiceError('Start date cannot be in the past');
  }

  // Ensure check-out follows check-in
  if (end < start) {
    throw new ServiceError('End date cannot precede start date');
  }
}
