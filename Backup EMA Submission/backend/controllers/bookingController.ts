/* 
   Booking Controller
   =============================================================

   Handles HTTP requests related to exsisitng bookings, booking creation and updating.
   Connects client-facing routes 
   GET /booking, 

   to the underlying service layer that manages database logic.

   Each handler:
   - Extracts payload and route parameters
   - Delegates to validated service functions
   - Handles known error types and responds with semantic status codes
   - Express handler to respond with booking details based on optional query filters.
   - Utilises booking service logic and centralised error handling

   Dev notes:
   - Uses asynchronous structure for non-blocking operations
   - Errors are handled through modular utils for cleaner separation
   ============================================================= */

import { Request, Response } from 'express'; //  HTTP request and response types.
import { fetchBookingDetails, createBookingFlow } from '../services/bookingService'; //  Service method for retrieving booking data.
import { connector } from '../db/connector'; //  Pooled DB connector instance.
import { ValidationError, NotFoundError, ServiceError } from '../utils/errors'; //  Central error classes for structured failure responses.


/**
 * Handles booking creation request from client.
 * Delegates logic to `createBookingFlow` and responds with booking ID.
 */
export async function createBookingHandler(req: Request, res: Response): Promise<void> {
  try {
    const bookingId = await createBookingFlow(req.body);
    res.status(201).json({ bookingId });
  } catch (err: any) {
    console.error('Error in createBookingHandler:', err.message);

    switch (true) {
      case err instanceof NotFoundError:
        res.status(404).json({ error: err.message });
        return;
      case err instanceof ServiceError:
        res.status(503).json({ error: err.message }); 
        return;
      case err instanceof ValidationError:
        res.status(422).json({ error: err.message });
        return;
      default:
        res.status(500).json({ error: 'Unexpected server error.' });
        return;
    }
  }
}


/**
 * Handles GET requests for bookings.
 * TODO: Currently retuns all bookings if no optional filter is input. CHANGE FOR DEPLOYMENT.
 * Optional filter 'cottage_name, guest_id, booking_id' may be included to scope results.
 *
 * Returns JSON-formatted availability records or a relevant error response.
 */

export const getBookingHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { cottage_name, guest_id, booking_id } = req.query;

    // Uncomment this if you want to enforce filtering
    // if (!cottage_name && !guest_id && !booking_id) {
    //   throw new ValidationError("At least one filter must be provided.");
    // }

    const results = await fetchBookingDetails(
      connector,
      cottage_name as string,
      guest_id as string,
      booking_id as string
    );

    if (!results.length) {
      throw new NotFoundError("No bookings found.");
    }

    res.status(200).json(results);
  } catch (err: any) {
    console.error("Error in getBookingHandler:", err.message);

    switch (true) {

      // add in later if needed. 
      //case err instanceof ValidationError:
      //   res.status(422).json({ error: err.message });
      //   break;

      case err instanceof NotFoundError:
        res.status(404).json({ error: err.message });
        return;
      case err instanceof ServiceError:
        res.status(503).json({ error: err.message });
        return;
      default:
        res.status(500).json({ error: "Unexpected server error." });
        return;
    }
  }
};
