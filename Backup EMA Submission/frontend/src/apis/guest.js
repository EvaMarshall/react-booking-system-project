// guestService.js
// This module handles guest-related API operations including lookup, creation, and resolution.
// It provides functions to fetch a guest by name/email, create a new guest, and resolve a guest
// by either retrieving an existing record or creating a new one if none is found.

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';

/**
 * Fetches a guest by name and email.
 * Used for exact match lookup to determine if a guest already exists.
 *
 * @param {Object} query - The search parameters.
 * @param {string} query.name - The guest's full name.
 * @param {string} query.email - The guest's email address.
 * @returns {Promise<Object>} - Resolves with the guest record if found.
 * @throws {Error} - Throws if the request fails for reasons other than 404.
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
 * Creates a new guest record in the database.
 * Returns the full guest object including the generated guest_id.
 *
 * @param {Object} guestData - The guest details to be saved.
 * @param {string} guestData.name - Guest's full name.
 * @param {string} guestData.email - Guest's email address.
 * @param {string} [guestData.phone_number] - Optional phone number.
 * @param {string} [guestData.address] - Optional address.
 * @param {boolean} [guestData.isAdmin=false] - Optional admin flag.
 * @returns {Promise<Object>} - Resolves with the newly created guest record.
 * @throws {Error} - Throws if the creation fails.
 */
export const createGuest = async (guestData) => {
    const response = await axios.post(`${BASE_URL}/api/guest`, guestData);
    return response.data;
};

/**
 * Resolves a guest by name and email.
 * If a matching guest exists, returns their guest_id and marks them as "existing".
 * If no match is found, creates a new guest and returns their guest_id marked as "new".
 *
 * @param {Object} guestInfo - The guest information to resolve.
 * @param {string} guestInfo.name - Guest's full name.
 * @param {string} guestInfo.email - Guest's email address.
 * @param {string} [guestInfo.phone_number] - Optional phone number.
 * @param {string} [guestInfo.address] - Optional address.
 * @param {boolean} [guestInfo.isAdmin=false] - Optional admin flag.
 * @returns {Promise<Object>} - Resolves with an object containing guest_id and guestType ("existing" or "new").
 * @throws {Error} - Throws if lookup or creation fails unexpectedly.
 */
export const resolveGuest = async (guestInfo) => {
    try {
        const existingGuest = await fetchGuestByNameAndEmail({
            name: guestInfo.name,
            email: guestInfo.email,
        });

        if (existingGuest?.guest_id) {
            return {
                guest_id: existingGuest.guest_id,
                guestType: "existing",
            };
        }
    } catch (err) {
        // Only ignore 404 errors (guest not found); rethrow others
        if (err.response?.status !== 404) {
            console.error("Unexpected error during guest lookup:", err);
            throw err;
        }
    }

    const newGuest = await createGuest({
        name: guestInfo.name,
        email: guestInfo.email,
        phone_number: guestInfo.phone_number,
        address: guestInfo.address,
        isAdmin: guestInfo.isAdmin ?? false, // DEV NOTE Ensure this is controlled server-side in production to prevent privilege escalation
    });

    if (!newGuest?.guest_id) {
        throw new Error("Guest creation failed: missing guest_id");
    }

    return {
        guest_id: newGuest.guest_id,
        guestType: "new",
    };
};
