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
    //  State to control whether the calendar shows a single or double month view
    const [isSingleMonthView, setIsSingleMonthView] = useState(window.innerWidth < 768);

    // Effect to dynamically update the calendar view based on screen size
    useEffect(() => {
        const handleResize = () => {
            setIsSingleMonthView(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    //  Handles date selection while enforcing consecutive booking days
    const handleDateClick = (date) => {
        const formattedDate = date.toISOString().split("T")[0];

        //  Only allow selection if the date is not blocked
        if (!blockedDates.includes(formattedDate)) {
            if (selectedRange.length === 0) {
                //  Automatically selects the next day if no prior selection exists
                const nextDate = new Date(date);
                nextDate.setDate(nextDate.getDate() + 1);
                const nextFormatted = nextDate.toISOString().split("T")[0];

                if (!blockedDates.includes(nextFormatted)) {
                    setSelectedRange([formattedDate, nextFormatted]);
                }
            } else {
                const lastSelected = new Date(selectedRange[selectedRange.length - 1]);
                const newRange = [...selectedRange];

                //  Ensures users select only consecutive dates (no gaps allowed)
                // new updated because of ts error 
                if (
                    (new Date(formattedDate).getTime() - new Date(lastSelected).getTime()) / (1000 * 60 * 60 * 24) === 1
                ) {
                    newRange.push(formattedDate);
                    setSelectedRange(newRange);
                }
            }
        }
    };

    return (
        <Calendar
            onClickDay={handleDateClick} // Handles date click logic
            minDate={new Date()} //  Prevents selecting past dates

            // Custom styling logic for blocked and selected dates
            tileContent={({ date }) => {
                const formattedDate = date.toISOString().split("T")[0];
                const isBlocked = blockedDates.includes(formattedDate);
                const isSelected = selectedRange.includes(formattedDate);

                return (
                    <div className={`text-sm p-2 rounded flex flex-col items-center justify-end w-full h-[50px] ${isSelected ? "bg-green-700 text-white" : ""
                        } ${isBlocked ? "bg-red-500 text-white pointer-events-none" : ""}`}>
                        {!isBlocked && pricingData[formattedDate] && (
                            <span className={`text-xs mb-3 ${isSelected ? "text-white" : "text-gray-700"}`}>
                                {`£${pricingData[formattedDate]}`}
                            </span>
                        )}
                    </div>
                );
            }}

            className="w-full max-w-lg"
            showDoubleView={!isSingleMonthView} // Dynamically toggle single or double month view
        />
    );
}

export default AvailabilityCalendar;
