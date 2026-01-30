import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react"; 
import Header from "../components/Header";
import GuestNavbar from "../components/GuestNavbar";
import Footer from "../components/Footer";
import GuestBookingConfirmed from "./GuestBookingConfirmed";
import BookingSummary from "../components/BookingSummary"; 
import PaymentInfo from "../components/PaymentInfo"; 
import { useNavigate } from "react-router-dom";

/*
   GuestBookingOverview 
  
   This component presents a final review of the booking details before confirmation.
   - Displays a summary of selected booking dates, guest details, and total price.
   - Provides an interactive confirmation checkbox to ensure user review before finalising the booking.
   - Implements navigation options to return to previous steps or confirm the booking.
   - Handles real-time validation to prevent confirmation without guest approval.
   - Shows a confirmation pop-up upon successful booking.
*/

function GuestBookingOverview() {
    // Retrieves selected booking details from previous page's state
    const location = useLocation();
    const navigate = useNavigate();
    const { selectedRange, totalPrice, guestInfo, selectedCottage } = location.state || {};

    // Controls confirmation pop-up visibility
    const [showConfirmation, setShowConfirmation] = useState(false);
    // Tracks whether the user has confirmed booking details
    const [isConfirmed, setIsConfirmed] = useState(false);

    // Ensures page always starts at the top when loaded
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <GuestNavbar />
            <main className="flex flex-col items-center justify-center flex-grow p-6">
                <h1 className="text-3xl font-semibold text-green-800 mb-6">Booking Overview</h1>

                {/* Booking Summary Section */}
                {selectedRange ? (
                    <div className="flex flex-col md:flex-row items-start md:space-x-8 w-full max-w-3xl rounded-lg shadow-sm">
                        <BookingSummary
                            selectedRange={selectedRange}
                            selectedCottage={selectedCottage}
                            totalPrice={totalPrice}
                        />
                    </div>
                ) : (
                    <p className="text-red-500">No selection found.</p>
                )}

                {/* Guest Information Section */}
                <div className="bg-gray-100 rounded-lg shadow-sm w-full max-w-3xl mt-6 mb-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl flex flex-col md:flex-row items-start md:space-x-8">

                        {/* Left Column: Basic Guest Info */}
                        <div className="w-full md:w-1/2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Guest Details</h2>
                            <div className="space-y-2"> 
                                <p><strong>Name:</strong> {guestInfo?.name}</p>
                                <p><strong>Email:</strong> {guestInfo?.email}</p>
                                <p><strong>Phone:</strong> {guestInfo?.phone_number}</p>
                                <p><strong>Address:</strong> {guestInfo?.address}</p>
                            </div>
                        </div>

                        {/* Right Column: Number of Guests & Requests */}
                        <div className="w-full md:w-1/2">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
                            <p><strong>Number of Guests:</strong> {guestInfo?.num_of_guests}</p>
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg min-h-[100px] border border-gray-300">
                                <p className="text-gray-700"><strong>Special Requests:</strong></p>
                                <p>{guestInfo?.special_requests || "No requests provided"}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Summary Section */}
                <PaymentInfo totalPrice={totalPrice} />

                {/* Booking Confirmation Checkbox */}
                <div className="mt-4 flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="confirmDetails"
                        checked={isConfirmed}
                        onChange={() => setIsConfirmed(!isConfirmed)}
                        className="w-5 h-5"
                    />
                    <label htmlFor="confirmDetails" className="text-green-800 text-sm">
                        I confirm that my booking details are correct
                    </label>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-6 flex space-x-4 w-full max-w-sm">
                    {/* Return to Date Selection */}
                    <button
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg text-lg w-full"
                        onClick={() => navigate("/guest-search")}
                    >
                        Change Dates
                    </button>

                    {/* Confirm Booking Button - Disabled until checkbox is checked */}
                    <button
                        className={`px-6 py-3 rounded-lg text-lg ${
                            !isConfirmed ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white"
                        } w-full`}
                        disabled={!isConfirmed}
                        onClick={() => setShowConfirmation(true)}
                    >
                        Confirm Booking
                    </button>
                </div>

                {/* Booking Confirmation Pop-up */}
                {showConfirmation && (
                    <GuestBookingConfirmed onClose={() => setShowConfirmation(false)} />
                )}
            </main>
            <Footer />
        </div>
    );
}

export default GuestBookingOverview;
