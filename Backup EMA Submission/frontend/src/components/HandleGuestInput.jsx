import { useState, useEffect } from "react";

// Full name validator
// Allows letters, spaces, apostrophes, and hyphens only
const validateName = (name) => /^[a-zA-Z\s'-]{2,50}$/.test(name);

// Validator for email format
// Checks that the input contains an '@' symbol and no spaces
const validateEmail = (email) => /^[^\s]+@[^\s]+$/.test(email);

// Generic international phone number validator
// Allows optional '+' at the start and checks for 10 to 15 digits total
const validatePhone = (phone) =>
    /^\+?\d{10,15}$/.test(phone);

// Address validator
// Allows letters, numbers, commas, full stops, hyphens, and spaces
const validateAddress = (address) =>
    /^[a-zA-Z0-9\s,'-]{5,100}$/.test(address.trim());


// Guest count check
// Must be a number between 1 and 6 (max allowed guests)
const validateGuestCount = (count) => {
    const num = parseInt(count);
    return !isNaN(num) && num >= 1 && num <= 6;
};

// Text cleaner for free entry fields like special requests
// Removes any HTML tags and trims to 300 characters
const cleanSpecialRequest = (text) =>
    text.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 300);


function HandleGuestInput({ onDataChange }) {
    // Main form data
    const [guestInfo, setGuestInfo] = useState({
        name: "",
        email: "",
        phone_number: "",
        address: "",
        num_of_guests: "",
        special_requests: ""
    });

    // Stores any error messages per field
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone_number: "",
        address: "",
        num_of_guests: "",
        special_requests: ""
    });


    // Called whenever guestInfo is updated — passes data and validation status to parent
    useEffect(() => {
        const allValid =
            guestInfo.name.trim() &&
            validateEmail(guestInfo.email) &&
            validatePhone(guestInfo.phone_number) &&
            guestInfo.address.trim() &&
            validateGuestCount(guestInfo.num_of_guests);

        onDataChange?.(guestInfo, allValid);
    }, [guestInfo]);



    const handleChange = (e) => {
        const { name, value } = e.target;

        //  Clean the raw input depending on the field
        // For special_requests: limit length, remove tags
        // For everything else: just remove any HTML tags
        const cleaned =
            name === "special_requests"
                ? cleanSpecialRequest(value)
                : value.replace(/<\/?[^>]+(>|$)/g, "");

        //  Create a trimmed version of the cleaned input
        // Used for validation to ignore extra spaces
        const trimmed = cleaned.trim();

        //  Set up a variable to hold any validation error
        let error = "";

        // 1. Basic required check (applies to all but special_requests)
        if (trimmed === "" && name !== "special_requests") {
            error = "This field is required.";
        }

        //  2. Field-specific validation if required check passed
        if (!error) {
            if (name === "name" && !validateName(trimmed)) {
                error = "Name can only include letters, spaces, hyphens, and apostrophes.";
            } else if (name === "email" && !validateEmail(trimmed)) {
                error = "Please enter a valid email address.";
            } else if (name === "phone_number" && !validatePhone(trimmed)) {
                error = "Please enter a valid UK phone number.";
            } else if (name === "address" && !validateAddress(trimmed)) {
                error = "Address can only include letters, numbers, commas and hyphens.";
            } else if (name === "num_of_guests" && !validateGuestCount(trimmed)) {
                error = "Please enter a number between 1 and 6.";
            }
        }

        // Update the form data in state
        // Stores the cleaned (but not trimmed) value so user input stays natural
        setGuestInfo((prev) => ({ ...prev, [name]: cleaned }));

        //  Update the error message for the current input
        setErrors((prev) => ({ ...prev, [name]: error }));
    };





    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Guest Details</h2>

            {/* Full Name Input */}
            <label htmlFor="name" className="block mb-1">Full Name</label>

            <input
                type="text"
                id="name"
                name="name"
                value={guestInfo.name}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-1"
            />
            {errors.name && <p className="text-sm text-red-500 mb-2">{errors.name}</p>}

            {/* Email Input */}
            <label htmlFor="email" className="block mb-1">Email Address</label>
            <input
                type="email"
                id="email"
                name="email"
                value={guestInfo.email}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-1"
            />
            {errors.email && <p className="text-sm text-red-500 mb-2">{errors.email}</p>}

            {/* Phone Number Input */}
            <label htmlFor="phone_number" className="block mb-1">Phone Number</label>
            <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={guestInfo.phone_number}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-1"
            />
            {errors.phone_number && <p className="text-sm text-red-500 mb-2">{errors.phone_number}</p>}

            {/* Address Input */}
            <label htmlFor="address" className="block mb-1">Address</label>
            <input
                type="text"
                id="address"
                name="address"
                value={guestInfo.address}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-1"
            />
            {errors.address && <p className="text-sm text-red-500 mb-2">{errors.address}</p>}

            {/* Number of Guests Input */}
            <label htmlFor="num_of_guests" className="block mb-1">Number of Guests (1–6)</label>
            <input
                type="number"
                id="num_of_guests"
                name="num_of_guests"
                value={guestInfo.num_of_guests}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-1"
            />
            {errors.num_of_guests && (
                <p className="text-sm text-red-500 mb-2">{errors.num_of_guests}</p>
            )}

            {/* Special Requests Input */}
            <label htmlFor="special_requests" className="block mb-1">Special Requests (optional)</label>
            <textarea
                id="special_requests"
                name="special_requests"
                value={guestInfo.special_requests}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-1 resize-none h-24"
                maxLength={300}
                placeholder="Let us know if you have any specific needs"
            />
            {errors.special_requests && (
                <p className="text-sm text-red-500 mb-2">{errors.special_requests}</p>
            )}
        </div>
    );
}

export default HandleGuestInput;
