/**
 * Handles HTTP requests for cottage availability workflows.
 *
 * Validates query parameters before delegating to the availability service for data retrieval.
 * Structures responses based on validation outcomes, service-level errors, or unexpected failures.
 * Maintains separation of concerns and supports modular integration with booking logic and calendar views.
 */

import { Request, Response } from 'express'; // Express interfaces for incoming requests and outgoing responses
import { fetchAvailability } from '../services/availabilityService'; // Service function to query availability data
import { connector } from '../db/connector'; // Pooled database connector
import { ValidationError, ServiceError } from '../utils/errors'; // Custom error types for structured failure handling


/**
 * Handles GET requests for cottage availability.
 * Expects 'start_date' and 'end_date' as required query parameters.
 * Optional filter 'cottage_name' may be included to scope results.
 *
 * Returns JSON-formatted availability records or a relevant error response.
 */
export async function getAvailabilityHandler(req: Request, res: Response): Promise<void> {
  try {
    // Extract query parameters from the incoming request
    const { start_date, end_date, cottage_name } = req.query;

    // Enforce required date filters for valid availability lookups
    if (!start_date || !end_date) {
      throw new ValidationError('Start date and end date are required.');
    }

    // Fetch availability results from service layer
    const results = await fetchAvailability(
      connector,                            // Active DB connection
      start_date as string,                // Cast query strings to expected types
      end_date as string,
      cottage_name as string | undefined   // Optional cottage filter
    );

    // Respond with successful result payload
    res.status(200).json(results);

  } catch (error: any) {
    // Structured error handling with consistent status codes
    switch (true) {
      case error instanceof ValidationError:
        res.status(422).json({ error: error.message }); // Input validation failure
        return;
      case error instanceof ServiceError:
        res.status(503).json({ error: error.message }); // Service layer failure
        return;
      default:
        res.status(500).json({ error: 'Unexpected server error.' }); // Fallback for uncaught exceptions
        return;
    }
  }
};
