const availabilityData = {
    "Llys y Coed": {
        blockedDates: ["2025-06-06", "2025-06-07", "2025-06-13"],
        pricing: generatePricing(),
    },
    "Bryngolau": {
        blockedDates: ["2025-06-20", "2025-06-21", "2025-06-27"],
        pricing: generatePricing(),
    },
};

// Helper function to generate random pricing
function generatePricing() {
    const pricingData = {};
    for (let month = 5; month <= 6; month++) {
        for (let day = 1; day <= 31; day++) {
            const date = new Date(2025, month, day).toISOString().split("T")[0];
            pricingData[date] = Math.floor(Math.random() * 100) + 50; // Random price £50-£150
        }
    }
    return pricingData;
}

export default availabilityData;
