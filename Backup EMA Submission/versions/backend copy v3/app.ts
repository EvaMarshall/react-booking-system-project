/**
 * Entry point of the server-side application.
 * 
 * Sets up and configures core middleware (JSON parser, CORS),
 * and mounts feature routers for guest, booking, and availability flows.
 * Designed for modular expansion and aligned with Express best practices.
 */

import express from 'express'; // Imports the Express framework to handle HTTP requests and routing
import guestRouter from './routes/guestRouter'; // Imports the guest-related routing logic from the designated module
import bookingRouter from './routes/bookingRouter'; // Imports the booking-related routing logic from the designated module
import availabiliyRouter from './routes/availabilityRouter'; // Imports the availability-related routing logic from the designated module

import cors from 'cors'; // Enables Cross-Origin Resource Sharing (CORS) for flexibility across domains

// Initialises the Express application
const app = express();

// Parses incoming JSON payloads into accessible request objects
app.use(express.json());

// Mounts the guest router under the '/api' path for scoped routing
// Dev Note - more to be added here as project expaonds. 
app.use('/api', guestRouter);
app.use('/api', bookingRouter);
app.use('/api', availabiliyRouter);

// Activates CORS middleware globally — ideal for development or open APIs
app.use(cors());

// Exports the configured Express application for use elsewhere in the codebase
export default app;
