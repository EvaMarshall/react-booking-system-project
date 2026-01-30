/**
 * utils/errors.ts
 * 
 * Centralised module for reusable custom error types and error detection logic.
 * Promotes cleaner controller handling and clearer semantic responses across the backend.
 * Tailored to support validation, service, and data integrity concerns.
 *
 */

// Triggered when input fails schema or format validation (e.g., missing or malformed fields)
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Raised when a database lookup or update cannot find the expected record
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Represents unexpected exceptions within the service layer, often DB-related
export class ServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceError';
  }
}

// Checks if an error matches the database constraint for email uniqueness
// Used to cleanly detect and respond to MySQL-style 'Duplicate email entry' violations
export function isDuplicateEmailError(error: any): boolean {
  return error.message?.includes('Duplicate entry') && error.message.includes('guest.email');
}
