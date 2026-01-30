// useGuestResolution.js

// Custom React hook for resolving guest identity based on name and email.
// It uses the resolveGuest API to either fetch an existing guest or create a new one,
// and stores the resulting guest_id and type in local state for downstream use.

import { useState } from "react";
import { resolveGuest } from "../apis/guest";

/**
 * useGuestResolution
 * Handles guest lookup and creation logic, storing resolution results in state.
 * Useful for booking flows or any feature that requires guest identity resolution.
 *
 * @returns {Object} - Contains guestId, guestType, guestResolved flag, and checkGuestDetails function.
 *   @property {string|null} guestId - The resolved guest's unique ID.
 *   @property {string|null} guestType - Either "existing" or "new" depending on resolution outcome.
 *   @property {boolean} guestResolved - Indicates whether resolution succeeded.
 *   @property {Function} checkGuestDetails - Triggers guest resolution based on provided info.
 */
export function useGuestResolution() {
  const [guestId, setGuestId] = useState(null); // Stores the resolved guest ID
  const [guestType, setGuestType] = useState(null); // Tracks whether guest is new or existing
  const [guestResolved, setGuestResolved] = useState(false); // Flags resolution success

  /**
   * checkGuestDetails
   * Resolves guest identity by calling the backend API.
   * Updates local state with guest ID and type.
   *
   * @param {Object} guestInfo - Guest details used for resolution.
   * @param {string} guestInfo.name - Guest's full name.
   * @param {string} guestInfo.email - Guest's email address.
   * @param {string} [guestInfo.phone_number] - Optional phone number.
   * @param {string} [guestInfo.address] - Optional address.
   * @param {boolean} [guestInfo.isAdmin=false] - Optional admin flag.
   * @returns {Promise<void>}
   */
  const checkGuestDetails = async (guestInfo) => {
    try {
      const { guest_id, guestType } = await resolveGuest({
        ...guestInfo,
        isAdmin: guestInfo.isAdmin ?? false, // DEV NOTE-  Ensure this is validated server-side in production
      });
      console.log("Guest resolution result:", { guest_id, guestType }); //DEV NOTE - remove before deployment. debugging tool 

      setGuestId(guest_id);
      setGuestType(guestType);
      setGuestResolved(true);

      console.log("Guest ID stored in state:", guest_id);
    } catch (err) {
      console.error("Error resolving guest:", err);
      setGuestResolved(false);
    }
  };
  return { guestId, guestType, guestResolved, checkGuestDetails,
  };
}

