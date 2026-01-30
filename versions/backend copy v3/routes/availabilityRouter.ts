
/*  Route map for availability-related endpoints.
     Declares the `/availability` GET route.
     Connects incoming requests to the availabilityController.
     Maintains modular route definitions for scalability and ease of maintenance. 
*/

import { Router } from 'express';
import { getAvailabilityHandler } from '../controllers/availabilityController';

const router = Router();

/* 
  Availability retrieval route (GET /availability).
  - Requires start_date and end_date to define the query range.
  - Supports optional filtering by cottage_name to narrow results.
*/
router.get('/availability', getAvailabilityHandler);

export default router;


