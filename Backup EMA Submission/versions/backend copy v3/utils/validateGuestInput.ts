/**
 * Validates the provided guest input for completeness and formatting consistency.
 *
 * Typically used in PUT and POST guest routes to ensure the backend adheres to
 * frontend expectations, and to block malformed data before service logic executes.
 *
 * Designed to support graceful error handling via a structured return object, helping
 *  debug quickly and enforce frontend-backend alignment.
 *
 * Dev Notes:
 * 
 * Soft validation strategy designed for direct user input.
 * Returns structured result for graceful controller handling and error messaging.
 * Ideal for form-bound data with unpredictable shape and completeness.
 */

import { GuestInput } from '../types/types';

/**
 * Performs presence and format checks on guest fields.
 *
 * @param input - Partial guest object with optional fields: name, email, phone_number, address, isAdmin
 * @returns `{ isValid: boolean, error?: string }`
 */

export function validateGuestInput(input: Partial<GuestInput>) {
  const { name, email, phone_number, address, isAdmin } = input;

  // Required field check
  if (!name || !email || !phone_number || !address || isAdmin === undefined) {
    return { isValid: false, error: 'Missing required guest fields.' };
  }

  // Format validations
  const isValidName = /^[a-zA-Z\s'-]{2,50}$/.test(name.trim());
  const isValidEmail = /^[^\s]+@[^\s]+$/.test(email.trim());
  const isValidPhone = /^\+?\d{10,15}$/.test(phone_number.trim());
  const isValidAddress = /^[a-zA-Z0-9\s,'-]{5,100}$/.test(address.trim());

  if (!isValidName || !isValidEmail || !isValidPhone || !isValidAddress) {
    return { isValid: false, error: 'One or more fields failed format validation.' };
  }

  // All validations passed
  return { isValid: true };
}
