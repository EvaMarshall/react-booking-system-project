/*  Route map for booking-related endpoints.
     Declares the `/booking` GET route.
     Connects incoming requests to the booking retrieval controller.
     Maintains modular route definitions for scalability and ease of maintenance. 
*/

import { Router } from 'express'; // Express router for modular route handling.
import { getBookingHandler, createBookingHandler } from '../controllers/bookingController'; //  Handles logic to retrieve booking data.

const router = Router();

/* 
  Booking retrieval route (GET /booking).
  - Enables flexible queries via optional params: cottage_name, guest_id, booking_id.
  - Designed for scalable read operations with potential for:
    • Date-based filtering (e.g., check-in ranges)*/
router.get('/booking', getBookingHandler);

/* 
  Booking creation route (POST /booking).
  - Handles full booking payload including guest details, cottage info, and stay duration.
  - Validates data and manages availability conflicts.
  - Modularised for traceability and alignment with compliance protocols (e.g., GDPR).
  - Future enhancement: link to notification services or transactional audit trail.
*/
router.post('/booking', createBookingHandler);


export default router; //  Exports router to be mounted in the main Express app.
