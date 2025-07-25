import Data from './data.json';

// Function to aggregate totals for donut chart
export const getDonutChartData = () => {
  let totalElectricity = 0;
  let totalFuel = 0;
  let totalHeatingCooling = 0;

  // Iterate through each block in the data
  Object.keys(Data).forEach(blockName => {
    const block = Data[blockName];
    
    // Sum up heating_cooling (all daily values)
    if (block.heating_cooling && typeof block.heating_cooling === 'object') {
      totalHeatingCooling += Object.values(block.heating_cooling).reduce((sum, value) => sum + value, 0);
    }
    
    // Sum up fuel (all daily values)
    if (block.fuel && typeof block.fuel === 'object') {
      totalFuel += Object.values(block.fuel).reduce((sum, value) => sum + value, 0);
    }
    
    // Sum up electricity (all daily values)
    if (block.Electricity && typeof block.Electricity === 'object') {
      totalElectricity += Object.values(block.Electricity).reduce((sum, value) => sum + value, 0);
    }
  });

  // Return data formatted for donut chart
  return [
    {
      name: 'Electricity',
      value: Math.round(totalElectricity * 10) / 10,
      color: '#FF6B6B'
    },
    {
      name: 'Heating & Cooling',
      value: Math.round(totalHeatingCooling * 10) / 10,
      color: '#4ECDC4'
    },
    {
      name: 'Fuel',
      value: Math.round(totalFuel * 10) / 10,
      color: '#45B7D1'
    }
  ];
};

// Function to get heatmap data (12 months x 7 weekdays)
export const getHeatmapData = () => {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const heatmapData = [];
  let currentDay = 1;
  
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const daysInMonth = monthDays[monthIndex];
    const monthName = monthNames[monthIndex];
    
    // Initialize weekday totals and counts for this month
    const weekdayTotals = new Array(7).fill(0);
    const weekdayCounts = new Array(7).fill(0);
    
    // Process each day in the month
    for (let dayInMonth = 0; dayInMonth < daysInMonth && currentDay <= 365; dayInMonth++) {
      // Calculate which weekday this is (assuming Jan 1st is a Monday)
      const weekdayIndex = (currentDay - 1) % 7;
      
      // Sum emissions for this day across all blocks
      let dayTotal = 0;
      Object.keys(Data).forEach(blockName => {
        const block = Data[blockName];
        
        if (block.Electricity && block.Electricity[currentDay]) {
          dayTotal += block.Electricity[currentDay];
        }
        if (block.heating_cooling && block.heating_cooling[currentDay]) {
          dayTotal += block.heating_cooling[currentDay];
        }
        if (block.fuel && block.fuel[currentDay]) {
          dayTotal += block.fuel[currentDay];
        }
      });
      
      weekdayTotals[weekdayIndex] += dayTotal;
      weekdayCounts[weekdayIndex]++;
      currentDay++;
    }
    
    // Calculate averages for each weekday in this month
    for (let weekdayIndex = 0; weekdayIndex < 7; weekdayIndex++) {
      const average = weekdayCounts[weekdayIndex] > 0 
        ? weekdayTotals[weekdayIndex] / weekdayCounts[weekdayIndex] 
        : 0;
      
      heatmapData.push({
        month: monthName,
        monthIndex: monthIndex,
        weekday: weekDays[weekdayIndex],
        weekdayIndex: weekdayIndex,
        value: Math.round(average * 10) / 10
      });
    }
  }
  
  return heatmapData;
};

// Function to get weekly trend data for line chart (52 weeks)
export const getWeeklyTrendData = () => {
  const weeks = [];
  
  for (let week = 1; week <= 52; week++) {
    const startDay = (week - 1) * 7 + 1;
    const endDay = Math.min(week * 7, 365);
    
    let weeklyTotal = 0;
    
    // Sum up all categories for this week across all blocks
    for (let day = startDay; day <= endDay; day++) {
      Object.keys(Data).forEach(blockName => {
        const block = Data[blockName];
        
        // Add electricity for this day
        if (block.Electricity && block.Electricity[day]) {
          weeklyTotal += block.Electricity[day];
        }
        
        // Add heating_cooling for this day
        if (block.heating_cooling && block.heating_cooling[day]) {
          weeklyTotal += block.heating_cooling[day];
        }
        
        // Add fuel for this day
        if (block.fuel && block.fuel[day]) {
          weeklyTotal += block.fuel[day];
        }
      });
    }
    
    weeks.push({
      week: week,
      total: Math.round(weeklyTotal * 10) / 10
    });
  }
  
  return weeks;
};

// Function to get monthly trend data for line chart (12 months)
export const getMonthlyTrendData = () => {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = [];
  
  let currentDay = 1;
  
  for (let month = 0; month < 12; month++) {
    const daysInMonth = monthDays[month];
    let monthlyTotal = 0;
    
    // Sum up all days in this month across all blocks
    for (let day = currentDay; day < currentDay + daysInMonth && day <= 365; day++) {
      Object.keys(Data).forEach(blockName => {
        const block = Data[blockName];
        
        // Add electricity for this day
        if (block.Electricity && block.Electricity[day]) {
          monthlyTotal += block.Electricity[day];
        }
        
        // Add heating_cooling for this day
        if (block.heating_cooling && block.heating_cooling[day]) {
          monthlyTotal += block.heating_cooling[day];
        }
        
        // Add fuel for this day
        if (block.fuel && block.fuel[day]) {
          monthlyTotal += block.fuel[day];
        }
      });
    }
    
    months.push({
      month: monthNames[month],
      total: Math.round(monthlyTotal * 10) / 10
    });
    
    currentDay += daysInMonth;
  }
  
  return months;
};

// Function to get individual totals
export const getTotals = () => {
  let totalElectricity = 0;
  let totalFuel = 0;
  let totalHeatingCooling = 0;

  Object.keys(Data).forEach(blockName => {
    const block = Data[blockName];
    
    // Handle daily structure
    if (block.heating_cooling && typeof block.heating_cooling === 'object') {
      totalHeatingCooling += Object.values(block.heating_cooling).reduce((sum, value) => sum + value, 0);
    }
    
    if (block.fuel && typeof block.fuel === 'object') {
      totalFuel += Object.values(block.fuel).reduce((sum, value) => sum + value, 0);
    }
    
    if (block.Electricity && typeof block.Electricity === 'object') {
      totalElectricity += Object.values(block.Electricity).reduce((sum, value) => sum + value, 0);
    }
  });

  return {
    electricity: Math.round(totalElectricity * 10) / 10,
    fuel: Math.round(totalFuel * 10) / 10,
    heating_cooling: Math.round(totalHeatingCooling * 10) / 10,
    total: Math.round((totalElectricity + totalFuel + totalHeatingCooling) * 10) / 10
  };
};


