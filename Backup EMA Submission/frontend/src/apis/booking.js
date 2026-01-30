import axios from "axios";

//  Base URL for API requests.
// Uses environment variable for deployment flexibility.
// Falls back to localhost for local development.
const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * createBooking
 *
 * Sends a booking creation request to the backend API.
 * 
 * @param {Object} bookingData - Structured booking payload containing:
 *   - guest_id
 *   - cottage_name
 *   - check_in_date (YYYY-MM-DD)
 *   - check_out_date (YYYY-MM-DD)
 *   - total_price
 *   - status
 *
 * @returns {Promise<Object>} - Resolves with booking confirmation data (e.g. bookingId).
 *
 * @throws {AxiosError} - If the request fails (e.g. 503, validation error).
 *
 * Dev Notes:
 * - Assumes backend handles validation and sanitization.
 * - Consider adding headers (e.g. auth token) if booking is tied to user sessions.
 * - Wrap in try/catch at call site to handle errors gracefully.
 */
export const createBooking = async (bookingData) => {
  const response = await axios.post(`${BASE_URL}/api/booking`, bookingData);
  return response.data;
};
