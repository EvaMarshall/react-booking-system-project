import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import GuestNavbar from "../components/GuestNavbar";
import BookingSummary from "../components/BookingSummary";
import Footer from "../components/Footer";
import HandleGuestInput from "../components/HandleGuestInput";


/*
   GuestDetails 
   
   This component collects guest information for a cottage booking.
   - Retrieves selected booking details from state (dates, property, price).
   - Displays booking summary and ensures guest information is entered before confirmation.
   - Provides navigation options to modify dates or proceed to the next stage.
   - Uses state management to capture user input for name, email, phone, number of guests, and special requests.
*/

function GuestDetails() {
    // Retrieves booking details from location state (sent from previous page)
    const location = useLocation();
    const { selectedRange, totalPrice, selectedCottage } = location.state || {};

    // Enables navigation between pages
    const navigate = useNavigate();

    //comment here 
    const [guestInfo, setGuestInfo] = useState({});
    const [formIsValid, setFormIsValid] = useState(false);


    // Ensures the page always starts at the top when loaded
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
                            totalPrice={totalPrice} />
                    </div>
                ) : (
                    <p className="text-red-500">No selection found.</p>
                )}

                <h2 className="text-3xl font-semibold text-green-800 m-6">Guest Details: </h2>

                {/* Guest Information Section */}
                <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl">
                    
                    {/* Guest detials Section, calling the HandleGuestInput Component*/}
                    <HandleGuestInput
                        onDataChange={(data, isValid) => {
                            setGuestInfo(data);
                            setFormIsValid(isValid);
                        }}
                    />

                </div>

                {/* Validation Message - Ensures all fields are completed before proceeding */}
                {(!guestInfo.name || !guestInfo.email || !guestInfo.phone || !guestInfo.numOfGuests) && (
                    <p className="text-green-700 text-sm mt-2 text-center">
                        Please fill in all guest details before proceeding.
                    </p>
                )}

                {/* Navigation Buttons */}
                <div className="mt-6 flex space-x-4 w-full max-w-sm">
                    {/* Button to go back and change selected dates */}
                    <button
                        className="px-6 py-3 bg-gray-600 text-white rounded-lg text-lg w-full"
                        onClick={() => navigate("/guest-search")}
                    >
                        Change Dates
                    </button>

                    {/* Confirmation Button - Disabled until frontend validation is met */}
                    <button
                        className={`px-6 py-3 rounded-lg text-lg ${!formIsValid ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white"
                            } w-full`}
                        disabled={!formIsValid}
                        onClick={() => {
                            if (!formIsValid) return;

                            navigate("/guest-booking-overview", {
                                state: {
                                    selectedRange,
                                    totalPrice,
                                    guestInfo,
                                    selectedCottage
                                }
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
