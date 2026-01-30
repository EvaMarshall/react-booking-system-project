import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

function LoginPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col">
            <Header /> {/* Add the header at the top */}
            <main className="flex flex-col items-center justify-center flex-grow p-6">
                <h1 className="text-4xl font-semibold text-green-800 mb-8 text-center">
                    Please Login or Register to See Our Availability 
                </h1>
                <div className="space-y-6 w-full max-w-sm">
                    <button 
                        onClick={() => navigate("/guest-search")} 
                        className="button w-full py-3 text-lg"
                    >
                        Enter as Guest
                    </button>
                    <button 
                        onClick={() => navigate("/admin-dashboard")} 
                        className="button w-full py-3 text-lg"
                    >
                        Enter as Admin
                    </button>
                </div>
            </main>
            <Footer /> {/* Add the footer at the bottom */}
        </div>
    );
}

export default LoginPage;
