import { FaBed, FaUsers, FaCar, FaMapMarkerAlt } from "react-icons/fa";

/*
   Property Information Object

   Stores static details of each cottage, including name, description, image, and key features.
   - Features include location, number of bedrooms, capacity, and parking availability.
   - Will later be replaced by dynamic data from the database when Phase 3 is implemented.
*/
const propertyInfo = {
    "Llys y Coed": {
        name: "Llys y Coed",
        description: "A three-bedroom cottage tucked away in the sleepy village of Brechfa.",
        image: "/images/Llys.jpg",
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
        image: "/images/Bryn.jpg",
        features: [
            { icon: <FaMapMarkerAlt className="text-green-700 text-lg" />, text: "SA32 7PY" },
            { icon: <FaBed className="text-green-700 text-lg" />, text: "3 Bedrooms" },
            { icon: <FaUsers className="text-green-700 text-lg" />, text: "Sleeps 6" },
            { icon: <FaCar className="text-green-700 text-lg" />, text: "Private Parking" },
        ],
    },
};

/*
   BookingSummary Component

   Displays a summary of the selected booking, including:
   - Cottage details and features.
   - Check-in and check-out dates.
   - Duration of stay and total price.
   - Ensures booking details are present before rendering.
*/
function BookingSummary({ selectedRange = [], selectedCottage = "Not Selected", totalPrice = 0 }) {
    if (!selectedRange.length) return null; //  Prevents rendering if no dates are selected

    //  Extract check-in and calculate check-out (day after last night)
    const checkInDate = selectedRange[0];
    const lastNightDate = new Date(selectedRange[selectedRange.length - 1]);
    const checkOutDate = new Date(lastNightDate);
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    const formattedCheckOut = checkOutDate.toISOString().split("T")[0];

    return (
        <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            {/*  Property Details & Image */}
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
                <div className="w-full md:w-1/2 flex flex-col space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {propertyInfo[selectedCottage]?.name || "Property Details"}
                    </h2>

                    {/*  Image selection using propertyInfo[selectedCottage].image */}
                    <div>
                        <img
                            src={propertyInfo[selectedCottage]?.image || "/images/default.jpg"}
                            alt={selectedCottage}
                            className="w-full rounded-lg shadow-md"
                        />
                    </div>

                    <p className="text-gray-700">
                        {propertyInfo[selectedCottage]?.description || "No details available"}
                    </p>
                </div>

                {/*  Booking Summary Box */}
                <div className="p-4 bg-gray-100 rounded-lg text-center w-full max-w-md">
                    <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
                    <p>Property: <strong>{selectedCottage}</strong></p>
                    <p>Check-in: <strong>{checkInDate}</strong></p>
                    <p>Check-out: <strong>{formattedCheckOut}</strong></p>
                    <p>Duration: <strong>{selectedRange.length} nights</strong></p>
                    <p>Total Price: <strong>£{totalPrice}</strong></p>
                </div>
            </div>

            {/*  Features Section */}
            <div className="flex justify-center bg-white p-3 mt-4 rounded-lg">
                <div className="flex justify-between w-full max-w-xl">
                    {propertyInfo[selectedCottage]?.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-1 w-1/4">
                            {feature.icon}
                            <span className="text-gray-800 text-sm">{feature.text}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default BookingSummary;
