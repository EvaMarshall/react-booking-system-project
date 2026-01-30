

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import GuestSearchAvailability from "./pages/GuestSearchAvailability";
import GuestDetails from "./pages/GuestDetails";
import GuestBookingOverview from "./pages/GuestBookingOverview";

/* App Component
   This component defines the main application structure and routing.
   - Uses React Router to manage navigation between different pages.
   - Provides routes for user login, searching for availability, entering booking details, and reviewing a booking.
   - Wraps all routes in a <Router> component to enable seamless client-side navigation */

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                {/* Defines available routes in the application */}
                <Routes>
                    {/* Login Page - Default route */}
                    <Route path="/loginPage" element={<LoginPage />} />

                    {/* Guest booking process */}
                    <Route path="/guest-search" element={<GuestSearchAvailability />} />
                    <Route path="/guest-details" element={<GuestDetails />} />
                    <Route path="/guest-booking-overview" element={<GuestBookingOverview />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
