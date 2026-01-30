import { FaPhoneAlt, FaUniversity, FaPaypal, FaCreditCard, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa"; 

/*
   PaymentInfo

   This component displays payment details for the booking.
   - Calculates the required deposit (25% of total price).
   - Shows the deadline for deposit payment.
   - Lists different payment methods available.
*/

function PaymentInfo({ totalPrice = 0 }) {
    const depositAmount = totalPrice * 0.25; // Calculates 25% deposit
    const remainingBalance = totalPrice - depositAmount; // Calculates balance due upon arrival

    // Get the current date and add 24 hours for deposit deadline
    const deadlineDate = new Date();
    deadlineDate.setHours(deadlineDate.getHours() + 24);

    // Formats deadline in British date format (DD/MM/YYYY)
    const formattedDeadline = deadlineDate.toLocaleString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });

    return (
        <div className="flex flex-col md:flex-row items-start md:space-x-8 w-full max-w-3xl bg-gray-100 rounded-lg shadow-lg">

            {/* Payment Details Section */}
            <div className="w-full rounded-lg flex flex-col space-y-6">
                <div className="w-full bg-gray-100 rounded-lg shadow-md">

                    {/* Two-Column Layout for Payment Breakdown */}
                    <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Left Column: Total & Deposit */}
                        <div className="flex flex-col space-y-4">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h2>
                            <div className="flex space-x-3">
                                <FaCreditCard className="text-green-700 text-2xl" />
                                <p className="text-gray-700"><strong>Total Amount Due:</strong> £{totalPrice}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <FaMoneyBillWave className="text-green-700 text-2xl" />
                                <p className="text-gray-700"><strong>Deposit Amount:</strong> £{depositAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Right Column: Due Date & Balance */}
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg border border-gray-300 w-full text-center">
                                <FaCalendarAlt className="text-red-600 text-2xl mb-2" />
                                <p className="font-semibold text-red-600">Deposit Due By:</p>
                                <p className="text-gray-800">{formattedDeadline}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <p className="text-gray-700">Remaining Balance: £{remainingBalance.toFixed(2)} due upon arrival.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Section */}
                <h2 className="text-lg font-semibold text-gray-800 text-center mt-4">Ways to Pay</h2>

                {/* Three Payment Methods Displayed Side by Side */}
                <div className="w-full flex flex-col md:flex-row justify-between space-y-6 md:space-y-0 md:space-x-6">
                    
                    {/* Call Us for Payment */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center w-full md:w-1/3">
                        <FaPhoneAlt className="text-green-700 text-5xl mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
                        <p className="text-gray-800 ">012345678</p>
                    </div>

                    {/* Bank Transfer Payment Option */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center w-full md:w-1/3">
                        <FaUniversity className="text-green-700 text-5xl mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">Bank Transfer</h3>
                        <p className="text-gray-800 ">Brechfa Forest Cottages LTD</p>
                        <p className="text-gray-800">Sort: 24-56-54</p>
                        <p className="text-gray-800">Account: 9032345</p>
                    </div>

                    {/* PayPal Payment Option */}
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center w-full md:w-1/3">
                        <FaPaypal className="text-green-700 text-5xl mb-2" />
                        <h3 className="text-lg font-semibold text-gray-800">PayPal</h3>
                        <p className="text-gray-800 ">BrechfaForestCottages</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentInfo;
