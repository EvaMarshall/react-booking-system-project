/*
   AvailabilityCalendar Component

   This component manages an interactive booking calendar that:
   - Displays availability while preventing blocked date selection.
   - Enforces consecutive date selection for a structured booking flow.
   - Dynamically adapts between single and double month views based on screen size.
   - Highlights selected dates and displays pricing information when available.
*/

import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function AvailabilityCalendar({ blockedDates, selectedRange, setSelectedRange, pricingData }) {
    //  Controls whether calendar shows one or two months based on screen width
    const [isSingleMonthView, setIsSingleMonthView] = useState(window.innerWidth < 768);

    //  Updates calendar view responsively on window resize
    useEffect(() => {
        const handleResize = () => {
            setIsSingleMonthView(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    /**
     * handleDateClick
     *
     * Handles user interaction with calendar tiles.
     * - Prevents selection of blocked dates.
     * - Enforces minimum two-night booking by auto-selecting next night.
     * - Allows extension of range by one day at a time.
     */
    const handleDateClick = (date) => {
        const formattedDate = date.toLocaleDateString("en-CA"); // 'YYYY-MM-DD' in local time

        if (!blockedDates.includes(formattedDate)) {
            if (selectedRange.length === 0) {
                //  Attempt to auto-select two consecutive nights
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);
                const nextFormatted = nextDate.toLocaleDateString("en-CA");

                if (!blockedDates.includes(nextFormatted)) {
                    setSelectedRange([formattedDate, nextFormatted]);
                } else {
                    //  Prevent single-night bookings
                    setSelectedRange([]);
                }
            } else {
                //  Extend selection by one day if it's consecutive
                const lastSelected = new Date(selectedRange[selectedRange.length - 1]);
                const diffDays = (new Date(formattedDate) - lastSelected) / (1000 * 60 * 60 * 24);

                if (diffDays === 1 && !blockedDates.includes(formattedDate)) {
                    setSelectedRange([...selectedRange, formattedDate]);
                }
            }
        }
    };

    return (
        <Calendar
            onClickDay={handleDateClick}
            minDate={new Date()} //  Prevents selection of past dates
            tileContent={({ date }) => {
                const formattedDate = date.toLocaleDateString("en-CA");
                const isBlocked = blockedDates.includes(formattedDate);
                const isSelected = selectedRange.includes(formattedDate);

                //  Highlights the visual check-out day (not part of stay)
                let isVisualCheckoutDay = false;
                if (selectedRange.length > 0) {
                    const lastSelected = new Date(selectedRange[selectedRange.length - 1]);
                    const checkoutDate = new Date(lastSelected);
                    checkoutDate.setDate(checkoutDate.getDate() + 1);
                    const checkoutFormatted = checkoutDate.toLocaleDateString("en-CA");
                    isVisualCheckoutDay = formattedDate === checkoutFormatted;
                }

                return (
                    <div
                        className={`text-sm p-2 rounded flex flex-col items-center justify-end w-full h-[50px]
                        ${isBlocked ? "bg-red-500 text-white pointer-events-none" : ""}
                        ${isSelected ? "bg-green-700 text-white" : ""}
                        ${isVisualCheckoutDay ? "bg-green-200 border border-green-600" : ""}
                    `}
                    >
                        {/*  Displays pricing if available and not blocked */}
                        {!isBlocked && pricingData[formattedDate] && (
                            <span
                                className={`text-xs mb-3 ${isSelected ? "text-white" : "text-gray-700"}`}
                            >
                                {`£${pricingData[formattedDate]}`}
                            </span>
                        )}
                    </div>
                );
            }}
            className="w-full max-w-lg"
            showDoubleView={!isSingleMonthView} //  Responsive calendar layout
        />
    );
}

export default AvailabilityCalendar;
