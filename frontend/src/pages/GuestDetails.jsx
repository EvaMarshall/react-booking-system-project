/*
  GuestDetails Component

  This page collects and validates guest information as part of the cottage booking flow.
  It displays a booking summary, captures guest input, and handles guest resolution logic
  (checking for existing guests or creating new ones). Once resolved, it passes the full
  booking and guest data to the next stage for confirmation.

  Key Features:
  - Retrieves booking details from navigation state
  - Displays booking summary and guest input form
  - Validates guest data before enabling progression
  - Resolves guest identity via backend API
  - Navigates to booking overview with enriched guest data
*/

import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import GuestNavbar from "../components/GuestNavbar";
import BookingSummary from "../components/BookingSummary";
import Footer from "../components/Footer";
import HandleGuestInput from "../components/HandleGuestInput";
import { useGuestResolution } from "../libraries/useGuestResolution";

function GuestDetails() {
    // Retrieves booking details passed from the previous page
    const location = useLocation();
    const { selectedRange, totalPrice, selectedCottage } = location.state || {};
    const navigate = useNavigate();// Enables navigation between pages
    /**
     * Stores guest input data and validation status.
     * guestInfo is updated by the HandleGuestInput component.
     * formIsValid is true only when all required fields pass validation.
     */
    const [guestInfo, setGuestInfo] = useState({});
    const [formIsValid, setFormIsValid] = useState(false);
    /**
     * Custom hook to resolve guest identity.
     * - guestId: unique identifier returned from backend
     * - guestType: "new" or "existing"
     * - guestResolved: flag indicating resolution success
     * - checkGuestDetails: function to trigger resolution
     */
    const {
        guestId,
        guestType,
        guestResolved,
        checkGuestDetails,
    } = useGuestResolution();

    
    // Scrolls to top on page load for consistent UX
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <GuestNavbar />
            <main className="flex flex-col items-center justify-center flex-grow p-6">
                <h1 className="text-3xl font-semibold text-green-800 mb-6">Property Details:</h1>

                {/* Booking Summary Section */}
                {selectedRange ? (
                    <div className="flex flex-col md:flex-row items-start md:space-x-8 w-full max-w-3xl bg-gray-100 rounded-lg shadow-lg">
                        <BookingSummary
                            selectedRange={selectedRange}
                            selectedCottage={selectedCottage}
                            totalPrice={totalPrice}
                        />
                    </div>
                ) : (
                    <p className="text-red-500">No selection found.</p>
                )}

                <h2 className="text-3xl font-semibold text-green-800 m-6">Guest Details: </h2>

                {/* Guest Input Form Section */}
                <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
                    <HandleGuestInput
                        onDataChange={(data, isValid) => {
                            setGuestInfo(data);       // Updates guestInfo state
                            setFormIsValid(isValid);  // Tracks form validity
                        }}
                    />
                </div>

                {/* Inline validation message if required fields are missing */}
                {(!guestInfo.name || !guestInfo.email || !guestInfo.phone_number || !guestInfo.numOfGuests) && (
                    <p className="text-green-700 text-sm mt-2 text-center">
                        Please fill in all guest details before proceeding.
                    </p>
                )}

                {/* Navigation Buttons */}
                <div className="mt-6 flex space-x-4 w-full max-w-sm">
                    {/* Navigate back to change booking dates */}
                    <button
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg text-lg w-full"
                        onClick={() => navigate("/guest-search")}
                    >
                        Change Dates
                    </button>

                    {/* Trigger guest resolution (lookup or creation) */}
                    <button
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg w-full"
                        disabled={!formIsValid}
                        onClick={() => checkGuestDetails(guestInfo)}
                    >
                        Check Guest Details
                    </button>

                    {/* Feedback messages based on resolution outcome */}
                    {guestType === "new" && (
                        <p className="text-green-700 text-sm mt-2 text-center">
                            Welcome! We've created a new guest profile for you.
                        </p>
                    )}
                    {guestType === "existing" && (
                        <p className="text-blue-700 text-sm mt-2 text-center">
                            Welcome back! We've found your existing guest profile.
                        </p>
                    )}

                    {/* Proceed to booking overview if guest is resolved */}
                    <button
                        className={`px-6 py-3 rounded-lg text-lg ${!guestResolved ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white"} w-full`}
                        disabled={!guestResolved}
                        onClick={() => {
                            navigate("/guest-booking-overview", {
                                state: {
                                    selectedRange,
                                    totalPrice,
                                    guestInfo: { ...guestInfo, guest_id: guestId },
                                    selectedCottage,
                                },
                            });
                        }}
                    >
                        Confirm Details
                    </button>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default GuestDetails;
