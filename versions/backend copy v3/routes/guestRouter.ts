/* Route map for guest-related endpoints:
   Declares the /guest/:id route
   Directs requests to updateGuestHandler
   Keeps route declarations structured and distinct
   Facilitates future expansion and maintenance of guest functionality
*/

import { Router } from 'express';
import { updateGuestHandler, createGuestHandler, GetExistingGuestHandler} from '../controllers/guestController';

const router = Router();

/* 
  Guest retrieval route (GET /guest).
  - Supports lookup using guest_name and guest_email for identity verification.
*/
router.get('/guest', GetExistingGuestHandler);

/* 
  Guest creation route (POST /guest).
  - Accepts validated guestInput payload with required identity fields.
  - Stores structured guest data for downstream booking association.
*/
router.post('/guest', createGuestHandler);

/* 
  Guest update route (PUT /guest/:id).
  - Updates an existing guest record identified by guest_id.
  - Requires guestInput payload for field updates and integrity checks.
*/
router.put('/guest/:id', updateGuestHandler);


export default router;
