/**
 * Manages database operations for guest-related workflows.
 *
 * Supports guest creation, retrieval, and updates with type-safe input handling.
 * Recent changes include improved creation logic with parameter safety and input sanitisation (e.g. trimming).
 * Centralised for reuse across controllers and designed to align with modular service structure.
 */
import { GuestRow, GuestInput } from '../types/types'; // Interface definitions for guest record structure
import { validateGuestInput } from '../utils/validateGuestInput'; // Input validation function for guest data
import type { ResultSetHeader } from 'mysql2';
import { DBConnector } from '../db/connector';
import { ValidationError, NotFoundError, ServiceError, isDuplicateEmailError} from '../utils/errors';


/**
 * Retrieves a single guest record based on an exact name and email match.
 *
 * Constructs and executes a parameterised SQL query to safely filter guest records.
 * Returns the first match if both fields align with a stored entry.
 *
 * @param connector - Active database connector using pooled connections
 * @param guest_name - Full name of the guest to search for
 * @param guest_email - Email of the guest to match against
 * 
 * @returns The matched guest row or null if no record found
 * 
 * @throws ServiceError - If database lookup fails or query execution errors
 */

export const fetchGuestByNameAndEmail = async (
  connector: DBConnector,           // Database connector with pooled connection support
  guest_name: string,               // Full name of the guest to look up
  guest_email: string              // Email of the guest to match
): Promise<GuestRow | null> => {
  try {
    // Construct parameterised SQL query for safe lookup
    const sql = `
      SELECT 
        pk_guest_id AS guest_id,    -- Maps primary key to expected return format
        name AS guest_name,         -- Returns guest name
        email AS guest_email,       -- Returns guest email
        phone_number,               -- Optional fields for richer context
        address
      FROM guest
      WHERE name = ? AND email = ?  -- Strict filter: both must match
    `;

    // Inject filter values as safe parameters to prevent SQL injection
    const params = [guest_name, guest_email];

    // Execute query and unpack result set
    const [rows] = await connector.query(sql, params);

    // Return first match or null if no record found
    return rows[0] as GuestRow ?? null;
    
  } catch (err) {
    // Fast failure for traceability in service layer
    throw new ServiceError("Failed to fetch guest by name and email");
  }
};





/**
 * Creates a new guest record in the database.
 * 
 * Validates input, sanitises fields, and inserts the guest into the database with a secure, parameterised query.
 *
 * @param connector - Active database connection used for execution
 * @param guest - Guest input object containing required fields
 * 
 * @returns The primary key of the newly created guest
 * 
 * @throws ValidationError - If guest input fails structural or semantic validation
 * @throws DuplicateEntryError - If the email already exists in the database
 * @throws ServiceError - For unexpected database execution failures
 */

export async function createGuest(
  connector: DBConnector,
  guest: GuestInput
): Promise<number> {

  // Step 1: Validate input data before proceeding
  const validation = validateGuestInput(guest);
  if (!validation.isValid) {
    throw new ValidationError(validation.error ?? 'Guest validation failed');
  }

  // Step 2: Sanitise inputs to ensure uniformity
  const params = [
    guest.name.trim(),
    guest.email.trim(),
    guest.phone_number.trim(),
    guest.address.trim(),
    guest.isAdmin,
  ];

// Step 3: Perform parameterised SQL INSERT using connector
try {
  const sql = `
    INSERT INTO guest (name, email, phone_number, address, isAdmin)
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await connector.query<ResultSetHeader>(sql, params);

  // Step 4: Return auto-generated guest ID from DB insert
  return result.insertId;
} catch (err: any) {
  if (isDuplicateEmailError(err)) {
    throw err; // Allow handler to catch and return 409
  }

  // Wrap all other DB errors in a generic service-level exception
  throw new ServiceError('Guest creation failed');
}
}

/**
 * Updates the details of an existing guest by their unique identifier.
 * Performs input validation and ensures the guest exists before attempting an update.
 *
 * @param connector - Active database connection used for querying
 * @param id - Unique guest identifier (primary key)
 * @param guestDetails - New data to update the guest record
 * 
 * @returns An object representing the result, including success state, status code and optional message
 *
 * @throws ValidationError - If guest input fails structural or semantic validation
 * @throws NotFoundError - If no matching guest record is found for the provided ID
 * @throws ServiceError - If database update execution fails unexpectedly
 */

export async function updateGuest(
  connector: DBConnector,
  id: string,
  guestDetails: GuestRow
) {
  const validation = validateGuestInput(guestDetails); // CHANGED: Validation added for structural and type integrity
  if (!validation.isValid) {
    throw new ValidationError(validation.error ?? 'Guest validation failed');
  }


  try {
    const [rows] = await connector.query<GuestRow[]>(
      'SELECT * FROM guest WHERE pk_guest_id = ?',
      [id] // Parameterised to prevent SQL injection
    );

    if (rows.length === 0) {
      throw new NotFoundError('Guest not found');
    }

    const updateSql = `
      UPDATE guest
      SET name = ?, email = ?, phone_number = ?, address = ?, isAdmin = ?
      WHERE pk_guest_id = ?
    `;

    const params = [
      guestDetails.name.trim(),         // Whitespace removed to maintain data cleanliness
      guestDetails.email.trim(),
      guestDetails.phone_number.trim(),
      guestDetails.address.trim(),
      guestDetails.isAdmin,
      id,
    ];

    await connector.query(updateSql, params); // CHANGED: Parameterised update query executed

    return;
  } catch (err) {
    throw new ServiceError('Database update failed');
  }
}
