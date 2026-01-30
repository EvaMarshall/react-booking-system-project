import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import GuestNavbar from "../components/GuestNavbar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
// import availabilityData from "../data/availabilityData"; // Import availability data - static 
import BookingSummary from "../components/BookingSummary"; // Import the booking summary component
import AvailabilityCalendar from "../components/AvailabilityCalendar"; // Import availability calendar component
import { FaBed, FaUsers, FaCar, FaMapMarkerAlt } from "react-icons/fa";

//new
import { fetchAvailability } from "../apis/availability";
/*
   GuestSearchAvailability 

   This allows users to select dates for a cottage booking.
   - Displays property details including images, description, and features.
   - Integrates an interactive calendar to select available dates.
   - Prevents selection of blocked dates and calculates the total price.
   - Provides booking summary and confirmation functionality.
*/

//static data that is used for the frontend implmentation phase. 
// here because icons wont load if pulled as raw data. 
const propertyInfo = {
    "Llys y Coed": {
        name: "Llys y Coed",
        description: "A three-bedroom cottage tucked away in the sleepy village of Brechfa.",
        image: "/images/llys-y-coed.jpg",
        features: [
            { icon: <FaMapMarkerAlt className="text-green-700 text-lg" />, text: "SA32 7RA" },
            { icon: <FaBed className="text-green-700 text-lg" />, text: "3 Bedrooms" },
            { icon: <FaUsers className="text-green-700 text-lg" />, text: "Sleeps 5" },
            { icon: <FaCar className="text-green-700 text-lg" />, text: "Private Parking" },
        ],
    },
    "Bryngolau": {
        name: "Bryngolau",
        description: "Traditional Welsh cottage set high up in the rolling Carmarthenshire hills.",
        image: "/images/bryngolau.jpg",
        features: [
            { icon: <FaMapMarkerAlt className="text-green-700 text-lg" />, text: "SA32 7PY" },
            { icon: <FaBed className="text-green-700 text-lg" />, text: "3 Bedrooms" },
            { icon: <FaUsers className="text-green-700 text-lg" />, text: "Sleeps 6" },
            { icon: <FaCar className="text-green-700 text-lg" />, text: "Private Parking" },
        ],
    },
};

function GuestSearchAvailability() {
    const navigate = useNavigate();
    const [selectedCottage, setSelectedCottage] = useState("Llys y Coed"); // Default selection
    const [selectedRange, setSelectedRange] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    // Extract blocked dates and pricing based on the selected cottage
    // const blockedDates = availabilityData[selectedCottage].blockedDates;
    // const pricingData = availabilityData[selectedCottage].pricing;

    //new 
    const [availability, setAvailability] = useState([]);
    const [blockedDates, setBlockedDates] = useState([]);
    const [pricingData, setPricingData] = useState({});

    useEffect(() => {
        const loadAvailability = async () => {
            try {
                const today = new Date();
                const future = new Date();
                future.setDate(today.getDate() + 60); // Load 2 months ahead

                const start_date = today.toISOString().split("T")[0];
                const end_date = future.toISOString().split("T")[0];

                const data = await fetchAvailability({
                    start_date,
                    end_date,
                    cottage_name: selectedCottage,
                });
                console.log("Fetched availability:", data); // Debug log
                data.forEach((entry) => {
                });

                setAvailability(data);

                // Extract blocked dates and pricing
                // Extract blocked dates and pricing
                const blocked = [];
                const pricing = {};

                data.forEach((entry) => {
                    // Coerce is_available to a number to handle any truthy/falsy inconsistencies
                    if (Number(entry.is_available) === 0) {
                        blocked.push(entry.available_date);
                    } else {
                        pricing[entry.available_date] = Number(entry.price); // Optional: coerce price to number
                    }
                });

                setBlockedDates(blocked);
                setPricingData(pricing);
            } catch (error) {
                console.error("Failed to load availability:", error.message);
            }
        };

        loadAvailability();
    }, [selectedCottage]);

    useEffect(() => {
        calculateTotalPrice();
    }, [selectedRange]);

    // Calculates the total price based on selected dates
    const calculateTotalPrice = () => {
        let total = selectedRange.reduce((sum, date) => sum + (pricingData[date] || 0), 0);
        setTotalPrice(total);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <GuestNavbar />
            <main className="flex flex-col items-center justify-center flex-grow p-6">
                <h1 className="text-3xl font-semibold text-green-800 m-6">
                    Search & Select Dates
                </h1>

                {/* Cottage Selector */}
                <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-md mb-6">
                    <label className="text-lg font-semibold text-gray-800">Choose a Cottage:</label>
                    <select
                        value={selectedCottage}
                        onChange={(e) => setSelectedCottage(e.target.value)}
                        className="p-2 border rounded-md mt-2 w-full"
                    >
                        <option value="Llys y Coed">Llys y Coed</option>
                        <option value="Bryngolau">Bryngolau</option>
                    </select>
                </div>

                {/* Property Information and Calendar */}
                <div className="flex flex-col w-full max-w-3xl bg-white p-6 rounded-lg shadow-md">
                    <div className="flex md:flex-row items-center space-x-6">
                        {/* Property Image */}
                        <div className="w-1/3">
                            <img
                                src={`/images/${selectedCottage === "Bryngolau" ? "Bryn.jpg" : "Llys.jpg"}`}
                                alt={selectedCottage}
                                className="w-full rounded-lg shadow-md"
                            />
                        </div>

                        {/* Property Details */}
                        <div className="w-2/3 flex flex-col">
                            <h2 className="text-xl font-semibold text-gray-800">{propertyInfo[selectedCottage].name}</h2>
                            <p className="text-gray-600 mb-4">{propertyInfo[selectedCottage].description}</p>

                            {/* Feature Icons */}
                            <div className="space-y-2">
                                {propertyInfo[selectedCottage].features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        {feature.icon}
                                        <span className="text-gray-800">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Availability Calendar */}
                    <div className="mt-4 w-full flex justify-center">
                        <AvailabilityCalendar
                            blockedDates={blockedDates}
                            selectedRange={selectedRange}
                            setSelectedRange={setSelectedRange}
                            pricingData={pricingData}
                        />
                    </div>

                    {/* Clear Selection Button */}
                    <div className="flex justify-center mt-4">
                        <button
                            className="px-2 py-2 bg-gray-600 text-white rounded-lg text-lg w-1/2"
                            onClick={() => setSelectedRange([])}
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>

                {/* Booking Summary Section */}
                <div className="flex flex-col items-center w-full max-w-3xl mt-6">
                    <BookingSummary selectedRange={selectedRange} selectedCottage={selectedCottage} totalPrice={totalPrice} />

                    {/* Confirmation Button */}
                    <div className="flex flex-col space-y-4 w-full max-w-sm mt-4">
                        <button
                            className={`px-6 py-3 rounded-lg text-lg ${selectedRange.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 text-white"
                                }`}
                            disabled={selectedRange.length === 0}
                            onClick={() => {
                                if (selectedRange.length === 0) return;
                                navigate("/guest-details", { state: { selectedRange, totalPrice, selectedCottage } });
                            }}
                        >
                            Confirm Selection
                        </button>

                        {/* Error Message - Appears if no dates are selected */}
                        {selectedRange.length === 0 && (
                            <p className="text-green-600 text-sm mt-2 text-center">Please select dates using the calendar above.</p>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default GuestSearchAvailability;
