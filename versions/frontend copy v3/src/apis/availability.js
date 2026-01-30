import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

/**
 * Fetches availability data from the backend.
 * Accepts a date range and optional cottage name.
 */
export const fetchAvailability = async (query) => {
  const response = await axios.get(`${BASE_URL}/api/availability`, {
    params: query,
  });
  return response.data;
};
