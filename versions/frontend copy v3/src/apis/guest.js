import axios from 'axios';

const BASE_URL = 'http://localhost:5001';

/**
 * Fetches a guest by name and email.
 * Used for exact match lookup.
 */
export const fetchGuestByNameAndEmail = async (query) => {
  const response = await axios.get(`${BASE_URL}/api/guest`, {
    params: {
      guest_name: query.name,
      guest_email: query.email,
    },
  });
  return response.data;
};


/**
 * creates a gues.
 * Returns the full guest record including guest_id.
 */
export const createGuest = async (guestData) => {
  const response = await axios.post(`${BASE_URL}/api/guest`, guestData);
  return response.data;
};
