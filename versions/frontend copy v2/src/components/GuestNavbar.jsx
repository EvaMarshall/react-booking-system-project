import { Link, useLocation } from "react-router-dom";

function GuestNavbar() {
    const location = useLocation(); // Get current page

    // Define steps in the correct order
    const steps = [
        { path: "/guest-search", label: "1. Search" },
        { path: "/guest-details", label: "2. Add Details" },
        { path: "/guest-booking-overview", label: "3. Confirm" },
    ];

    // Find current step index
    const currentStepIndex = steps.findIndex(step => step.path === location.pathname);

    return (
        <nav className="w-full p-4 border-b border-gray-300 flex justify-between items-center">
            {/* Centered Progress Steps (Only Show Numbers on Small Screens) */}
            <div className="flex-grow flex justify-center flex-wrap space-x-3 md:space-x-6">
                {steps.map((step, index) => (
                    <span
                        key={step.path}
                        className={`text-sm md:text-lg font-medium px-2 md:px-4 py-1 md:py-2 rounded-md ${
                            index <= currentStepIndex
                                ? "bg-green-600 text-white" // Completed Steps: Green
                                : "bg-gray-300 text-gray-700" // Future Steps: Gray
                        }`}
                    >
                        {/* Always Show Number, Hide Text on Small Screens */}
                        <span className="inline-block">{step.label.split(".")[0]}.</span>
                        <span className="hidden md:inline-block">{step.label.split(".")[1]}</span>
                    </span>
                ))}
            </div>

            {/*  Login Button (Still Aligned to Right) */}
            <Link to="/loginPage" className="text-sm md:text-lg font-medium hover:text-green-700 px-2 py-1 md:px-4 md:py-2">
                Log in or Register
            </Link>
        </nav>
    );
}

export default GuestNavbar;
