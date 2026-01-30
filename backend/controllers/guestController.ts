/* 
   Guest Controller
   =============================================================

   Handles HTTP requests related to guest creation and updates.
   Connects client-facing routes 
   POST /guest, 
   PUT /guest/:id

   to the underlying service layer that manages database logic.

   Each handler:
   - Extracts payload and route parameters
   - Delegates to validated service functions
   - Handles known error types and responds with semantic status codes

   Dev notes:
   - Uses asynchronous structure for non-blocking operations
   - Errors are handled through modular utils for cleaner separation
   ============================================================= */

import { updateGuest, createGuest, fetchGuestByNameAndEmail } from '../services/guestService';     // Core business logic
import { Request, Response } from 'express';                             // Typed request/response for safety
import { connector } from '../db/connector';                                       // DB connector instance

import {
  ValidationError,              // Raised when payload violates expected structure
  NotFoundError,                // Raised when target ID isn’t found in DB
  ServiceError,                 // Generalised service exception wrapper
  isDuplicateEmailError         // Predicate for identifying DB constraint violation on unique email
} from '../utils/errors';       // Reusable error utilities



//  GET /guest — Fetch existing guest by name and email
export async function GetExistingGuestHandler(req: Request, res: Response): Promise<void> {
  try {
    const { guest_name, guest_email } = req.query; // Extract query parameters

    // Validate query inputs before DB call
    if (!guest_name || !guest_email) {
      throw new ValidationError("Guest name and email must be provided.");
    }

    const results = await fetchGuestByNameAndEmail(
      connector,
      guest_name as string,
      guest_email as string,
    ); // Call service to find guest

    if (!results) {
      res.status(404).json({ error: "Guest not found." }); // Guest not found
      return;
    }

    res.status(200).json(results); // Success response
  } catch (error: any) {
    console.error("Error in GetExistingGuestHandler:", error.message); // For traceability

    switch (true) {
      case error instanceof ValidationError:
        res.status(422).json({ error: error.message }); // Input issue
        return;
      case error instanceof ServiceError:
        res.status(503).json({ error: "Service unavailable. Please try again later." }); // DB/service layer failure
        return;
      default:
        res.status(500).json({ error: "Internal server error." }); // Fallback error
        return;
    }
  }
};

// 
//  POST /guest — Creates new guest entry
// 
export async function createGuestHandler(req: Request, res: Response): Promise<void> {
  console.log("Incoming guest payload:", req.body);
  const guest = req.body; // Retrieves guest creation data from client

  // try {
  //  await createGuest(connector, guest); // Calls service-layer logic to insert new guest
  //   res.status(200).json({ message: 'Guest created successfully.' }); // Returns success
  //  return;
  try {
    const guest_id = await createGuest(connector, guest); // ✅ capture returned ID
    res.status(201).json({ guest_id }); // ✅ send it back to frontend
    return;

  } catch (error: any) {
  console.error('Error in createGuestHandler:', error.message); // Logs error cause

  switch (true) {
    case error instanceof ValidationError: // Catch input schema mismatch
      res.status(422).json({ error: error.message });
      return;
    case isDuplicateEmailError(error):     // Cleanly captures DB constraint violation (unique email)
      res.status(409).json({ error: 'Email already exists.' });
      return;
    case error instanceof ServiceError:
      // General service-layer failure
      res.status(503).json({ error: error.message });
      return;

    default:                               // Catches all other failure modes
      res.status(500).json({ error: 'Internal server error.' });
      return;
  }
}
};



//
//  PUT /guest/:id — Updates guest by ID
// 

export async function updateGuestHandler(req: Request, res: Response): Promise<void> {
  const guestId = req.params.id;   // Extracts ID from route parameter
  const input = req.body;          // Retrieves updated data from request body

  try {
    await updateGuest(connector, guestId, input); // Delegates update logic to service layer
    res.status(200).json({ message: 'Guest updated successfully.' }); // Sends success response
    return;
  } catch (error: any) {
    console.error('Error in updateGuestHandler:', error.message); // Logs error for debugging

    switch (true) {
      case error instanceof ValidationError:      // Handles malformed input
        res.status(422).json({ error: error.message });
        return;
      case error instanceof NotFoundError:        // Handles case when ID does not match any record
        res.status(404).json({ error: error.message });
        return;
      case error instanceof ServiceError:         // Catches internal service-layer anomalies
        res.status(503).json({ error: error.message });
        return;
      default:                                    // Fallback for unexpected errors
        res.status(500).json({ error: 'Internal server error.' });
        return;
    }
  }
};
