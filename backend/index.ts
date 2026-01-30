/**
 * Boots up the server by linking the configured Express app to a runtime port.
 *
 * Loads core application from './app', defines dynamic port binding,
 * and initiates listening with a startup log — enabling backend access for client-side integrations.
 */

// Imports the configured Express application from the local module
import app from './app';

// Defines the port number to use — sourced from environment variables, with a fallback
const PORT = process.env.PORT || 5001;

// Starts the Express server and confirms it's running via a console message
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
