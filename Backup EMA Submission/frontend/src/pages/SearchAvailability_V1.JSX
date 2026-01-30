import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import GuestNavbar from "../components/GuestNavbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";





const generatePricing = () => {
    const pricingData = {};
    for (let month = 5; month <= 6; month++) {
        for (let day = 1; day <= 31; day++) {
            const date = new Date(2025, month, day).toISOString().split("T")[0];
            pricingData[date] = Math.floor(Math.random() * 100) + 50; // Random price £50-£150
        }
    }
    return pricingData;
};

const pricingData = generatePricing();
const blockedDates = ["2025-06-06", "2025-06-07", "2025-06-13", "2025-06-14", "2025-06-20", "2025-06-21", "2025-06-27", "2025-06-28"];

function GuestSearchAvailability() {
    const navigate = useNavigate();
    const [selectedRange, setSelectedRange] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedRange]); // Auto-update total price on selection change

    const handleDateClick = (date) => {
        const formattedDate = date.toISOString().split("T")[0];

        if (!blockedDates.includes(formattedDate)) {
            if (selectedRange.length === 0) {
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);
                const nextFormatted = nextDate.toISOString().split("T")[0];

                if (!blockedDates.includes(nextFormatted)) {
                    setSelectedRange([formattedDate, nextFormatted]);
                }
            } else {
                const lastSelected = new Date(selectedRange[selectedRange.length - 1]);
                const newRange = [...selectedRange];

                if ((new Date(formattedDate) - lastSelected) / (1000 * 60 * 60 * 24) === 1) {
                    newRange.push(formattedDate);
                    setSelectedRange(newRange);
                }
            }
        }
    };

    const calculateTotalPrice = () => {
        let total = selectedRange.reduce((sum, date) => sum + (pricingData[date] || 0), 0);
        setTotalPrice(total);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <GuestNavbar />
            <main className="flex flex-col items-center justify-center flex-grow p-6">
                <h1 className="text-3xl font-semibold text-green-800 mb-6">
                    Search & Select Dates (Min. 2 Nights)
                </h1>
                <Calendar
                    onClickDay={handleDateClick}
                    tileContent={({ date }) => {
                        const formattedDate = date.toISOString().split("T")[0];
                        return (
                            <div className={`text-sm p-1 rounded ${selectedRange.includes(formattedDate) ? "bg-green-700 text-white" : ""}
                                ${blockedDates.includes(formattedDate) ? "bg-red-500 text-white pointer-events-none" : ""}`}>
                                {pricingData[formattedDate] ? `£${pricingData[formattedDate]}` : ""}
                            </div>
                        );
                    }}
                    className="w-full max-w-lg"
                    showDoubleView={true}
                />

                {/* Booking Details Section */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 mt-6">

                    {/* Booking Summary - Now positioned on the left */}
                    {selectedRange.length > 0 && (
                        <div className="p-4 bg-gray-100 rounded-lg text-center w-full max-w-md">
                            <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
                            <p>Check-in: <strong>{selectedRange[0]}</strong></p>
                            <p>Check-out: <strong>{selectedRange[selectedRange.length - 1]}</strong></p>
                            <p>Duration: <strong>{selectedRange.length} nights</strong></p>
                            <p>Total Price: <strong>£{totalPrice}</strong></p>
                        </div>
                    )}

                    {/* Buttons - Now positioned on the right */}
                    <div className="flex flex-col space-y-4 w-full max-w-sm">
                        <button
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg text-lg"
                            onClick={() => setSelectedRange([])}
                        >
                            Clear Selection
                        </button>
                        <button
                            className="px-6 py-3 bg-green-600 text-white rounded-lg text-lg"
                            onClick={() => navigate("/guest-details", { state: { selectedRange, totalPrice } })}
                        >
                            Confirm Selection
                        </button>
                    </div>
                </div>


            </main>
            <Footer />
        </div>
    );
}

export default GuestSearchAvailability;
