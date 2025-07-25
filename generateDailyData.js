// Helper script to generate daily data for the year
function generateDailyData(minValue, maxValue, days, type) {
  const data = {};
  
  for (let day = 1; day <= days; day++) {
    // Create seasonal variation
    const seasonalFactor = Math.sin((day / 365) * 2 * Math.PI);
    
    // Different patterns for different types
    let dailyVariation = 0;
    if (type === "heating") {
      // Higher in winter (inverse seasonal)
      dailyVariation = -seasonalFactor * 0.3;
    } else if (type === "electricity") {
      // Higher in summer (cooling) and winter (heating)
      dailyVariation = Math.abs(seasonalFactor) * 0.4;
    } else if (type === "fuel") {
      // Slightly higher in winter
      dailyVariation = -seasonalFactor * 0.2;
    }
    
    // Add some random daily variation
    const randomVariation = (Math.random() - 0.5) * 0.3;
    
    // Calculate base value
    const baseValue = (minValue + maxValue) / 2;
    const range = (maxValue - minValue) / 2;
    
    // Final value
    const value = baseValue + (range * dailyVariation) + randomVariation;
    
    // Round to 1 decimal place and ensure it's within bounds
    data[day] = Math.round(Math.max(minValue, Math.min(maxValue, value)) * 10) / 10;
  }
  
  return data;
}

// Generate data for all blocks
const dailyData = {
  "Block A": {
    "heating_cooling": generateDailyData(2.0, 3.5, 365, "heating"),
    "fuel": generateDailyData(1.5, 2.8, 365, "fuel"),
    "Electricity": generateDailyData(7.0, 9.5, 365, "electricity")
  },
  "Block B": {
    "heating_cooling": generateDailyData(2.2, 3.8, 365, "heating"),
    "fuel": generateDailyData(1.7, 3.0, 365, "fuel"),
    "Electricity": generateDailyData(7.3, 9.8, 365, "electricity")
  },
  "Block C": {
    "heating_cooling": generateDailyData(2.4, 4.0, 365, "heating"),
    "fuel": generateDailyData(1.9, 3.2, 365, "fuel"),
    "Electricity": generateDailyData(7.5, 10.0, 365, "electricity")
  },
  "Block D": {
    "heating_cooling": generateDailyData(2.5, 4.2, 365, "heating"),
    "fuel": generateDailyData(2.0, 3.4, 365, "fuel"),
    "Electricity": generateDailyData(7.8, 10.3, 365, "electricity")
  }
};

console.log(JSON.stringify(dailyData, null, 2));
