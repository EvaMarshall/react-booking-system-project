import { useState } from "react";
import { useLocation } from "react-router-dom"; 
import BookingSummary from "../components/BookingSummary"; 
import PaymentInfo from "../components/PaymentInfo";

/*
   GuestBookingConfirmed 

   This component provides the final confirmation step before completing a booking.
   - Displays booking details, payment breakdown, and reservation terms.
   - Requires users to acknowledge terms before proceeding.
   - Redirects users to the property details page after confirmation.
   - Prevents proceeding without selecting a cottage or accepting terms.
*/

function GuestBookingConfirmed({ onClose }) {
    const location = useLocation(); // Access booking details from previous page
    const { selectedRange, selectedCottage, totalPrice } = location.state || {};

    // Tracks whether the user has accepted the booking terms
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Handles confirmation logic
    const handleConfirm = () => {
        if (!selectedCottage) {
            alert("Please search and select a cottage before proceeding.");
            return; // Prevents execution if no cottage is selected
        }

        if (termsAccepted) {
            alert("Booking confirmed! You are being redirected to view property details.");

            // Determines redirect URL based on selected cottage
            const redirectUrl = selectedCottage === "Llys y Coed"
                ? "https://www.brechfaforest.com/llys-y-coed"
                : "https://www.brechfaforest.com/bryngolau";

            window.location.href = redirectUrl;
        } else {
            alert("Please accept the terms before proceeding.");
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 px-4 py-6">
            <div className="bg-white p-6 rounded-lg w-full max-w-screen-md lg:max-w-screen-lg max-h-[90vh] overflow-auto">

                {/* Booking Confirmation Header */}
                <h2 className="text-2xl font-semibold text-green-700 text-center mb-4">Booking Provisionally Confirmed</h2>
                <p className="text-gray-700 text-center mb-6">
                    Your booking will be reserved for 24 hours free of charge. A 25% deposit must be paid to complete the booking.
                </p>

                {/* Booking Details & Payment Breakdown */}
                <div className="bg-white p-6 rounded-lg w-full space-y-6 flex flex-col items-center">

                    {/* Booking Summary Section */}
                    <div className="bg-white rounded-lg max-w-3xl">
                        <BookingSummary selectedRange={selectedRange} selectedCottage={selectedCottage} totalPrice={totalPrice} />
                    </div>

                    {/* Reservation Reminder */}
                    <h2 className="text-2xl font-semibold text-green-700 text-center mb-4">Your booking will be reserved for 24 hours</h2>
                    <p className="text-gray-700 text-center mb-6">
                        The 25% deposit must be paid within 24 hours to confirm your booking.
                    </p>

                    {/* Payment Details */}
                    <div className="bg-white rounded-lg w-full max-w-3xl text-center">
                        <PaymentInfo totalPrice={totalPrice} />
                    </div>
                </div>

                {/* Terms Acknowledgement Checkbox */}
                <div className="mt-6 text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <input type="checkbox" id="acceptTerms" checked={termsAccepted} onChange={() => setTermsAccepted(!termsAccepted)} className="w-5 h-5" />
                        <label htmlFor="acceptTerms" className="text-green-800">
                            I acknowledge the booking terms and payment details.
                        </label>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex flex-col items-center space-y-4 mt-6">
                    {/* Confirm Booking Button - Disabled if terms are not accepted */}
                    <button
                        onClick={handleConfirm}
                        className={`w-full max-w-xs px-6 py-3 rounded-lg text-lg ${termsAccepted ? "bg-green-600 text-white" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
                        disabled={!termsAccepted}
                    >
                        Confirm & Proceed
                    </button>

                    {/* Close Button - Allows users to exit confirmation modal */}
                    <button onClick={onClose} className="w-full max-w-xs px-6 py-2 bg-gray-600 text-white rounded-lg text-lg">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GuestBookingConfirmed;
