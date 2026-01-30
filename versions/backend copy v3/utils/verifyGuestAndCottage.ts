/**
 * Verifies the existence of both the specified guest and cottage records in the database.
 *
 * Intended to be used within the booking creation flow, this function ensures that all
 * foreign key references are valid before any insert or conflict check is attempted.
 *
 * Throws a ServiceError if either the guest or cottage is missing—preserving data integrity
 * and preventing invalid relationships from reaching the database layer.
 *
 * Dev Note:
 * Consider how guest lifecycle is managed— are users submitting new guest details
 * before booking begins, or are they selected from existing records?
 * This affects when and how you might call this utility in the flow.
 */

import { connector } from '../db/connector';               // Pooled DB connection for reliable performance
import { ServiceError } from './errors';                   // Centralised error wrapper for service failures
import type { BookingInput } from '../types/types';        // Booking payload shape for consistent input access

/**
 * Ensures the provided guest ID and cottage name both correspond to existing database entries.
 * 
 * Validates foreign key references prior to booking logic to safeguard consistency.
 *
 * @param input - Full booking payload containing required identifiers
 * @param input.guest_id - Guest ID to verify against the database
 * @param input.cottage_name - Cottage name to verify against the database
 * 
 * @returns void (throws on failure; no return data)
 * 
 * @throws ServiceError - If either the guest or cottage does not exist
 */

export async function verifyGuestAndCottage(input: BookingInput): Promise<void> {
  const { guest_id, cottage_name } = input;

  // Check guest existence
  const [guestRows] = await connector.query(
    'SELECT 1 FROM guest WHERE pk_guest_id = ?',
    [guest_id]
  );
  if (guestRows.length === 0) {
    throw new ServiceError(`Guest with ID ${guest_id} does not exist`);
  }

  // Check cottage existence
  const [cottageRows] = await connector.query(
    'SELECT 1 FROM cottage WHERE pk_cottage_name = ?',
    [cottage_name]
  );
  if (cottageRows.length === 0) {
    throw new ServiceError(`${cottage_name} cottage does not exist`);
  }
}
