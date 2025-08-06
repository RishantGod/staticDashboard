import React, { useState } from 'react'
import greenScaleLogo from './assets/greenScaleLogo.png'
import BAN from './BAN.jsx'
import TotalBAN from './TotalBAN.jsx'
import LineChart from './LineChart.jsx'
import DonutChart from './DonutChart.jsx'
import Heatmap from './Heatmap.jsx'
import Map from './MAP.jsx'
import BarChart from './BarChart.jsx'
import thermostat from './assets/thermostat.svg'
import infrastructure from './assets/infrastructure.svg'
import fuel from './assets/fuel.svg'
import { 
  getTotals, 
  getHeatmapData, 
  getElectricityHeatmapData, 
  getFuelHeatmapData, 
  getHeatingCoolingHeatmapData,
  getBuildingHeatmapData,
  getBuildingDonutChartData 
} from './aggregate.jsx'



// TODO: Heatmap 
// * Adding a tooltip on hover


// TODO: Donuts
// * Transition effects when data changes
// * Adding a tooltip on hover


// TODO: Bar Chart
// * Adding a tooltip on hover





export default function Dashboard() {
  // Get the calculated totals from aggregate functions
  const totals = getTotals();
  
  // State to track which category is selected for the heatmap
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // State to track which building is selected for the heatmap
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  
  // Function to get heatmap data based on selected category and building
  const getHeatmapDataForCategory = () => {
    // If a building is selected, show building-specific data regardless of category
    if (selectedBuilding) {
      return getBuildingHeatmapData(selectedBuilding);
    }
    
    // Otherwise, show category-based data for all buildings
    switch (selectedCategory) {
      case 'electricity':
        return getElectricityHeatmapData();
      case 'fuel':
        return getFuelHeatmapData();
      case 'heating_cooling':
        return getHeatingCoolingHeatmapData();
      default:
        return getHeatmapData();
    }
  };
  
  // Function to get heatmap title based on selected category and building
  const getHeatmapTitle = () => {
    // If a building is selected, show building-specific title
    if (selectedBuilding) {
      return `${selectedBuilding} - Total Emissions Heatmap`;
    }
    
    // Otherwise, show category-based title
    switch (selectedCategory) {
      case 'electricity':
        return 'Electricity Emissions Heatmap';
      case 'fuel':
        return 'Fuel Emissions Heatmap';
      case 'heating_cooling':
        return 'Heating & Cooling Emissions Heatmap';
      default:
        return 'Total Emissions Intensity Heatmap';
    }
  };

  // Function to handle building selection from map
  const handleBuildingSelect = (buildingName) => {
    setSelectedBuilding(buildingName);
    // Reset category selection when a building is selected
    setSelectedCategory('all');
  };

  // Function to handle category selection (resets building selection)
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedBuilding(null);
  };

  return (
    <div className='dashboard'>
        <div className='title'>
          <h1>Carbon Dashboard</h1>
        </div>
        <div className='top-row'>
            <TotalBAN 
              onClick={() => handleCategorySelect('all')}
              isSelected={selectedCategory === 'all' && !selectedBuilding}
            />
            <DonutChart selectedBuilding={selectedBuilding} />
            <Heatmap 
              data={getHeatmapDataForCategory()} 
              title={getHeatmapTitle()}
            />
        </div>
        <div className='bottom-row'>
            <div className='ban-group'>
                <BAN 
                    heading="Electricity" 
                    value={Math.round(totals.electricity).toLocaleString()} 
                    icon={infrastructure}
                    onClick={() => handleCategorySelect(selectedCategory === 'electricity' ? 'all' : 'electricity')}
                    isSelected={selectedCategory === 'electricity' && !selectedBuilding}
                />
                <BAN 
                    heading="Fuel" 
                    value={Math.round(totals.fuel).toLocaleString()} 
                    icon={fuel}
                    onClick={() => handleCategorySelect(selectedCategory === 'fuel' ? 'all' : 'fuel')}
                    isSelected={selectedCategory === 'fuel' && !selectedBuilding}
                />
                <BAN 
                    heading="Heating & Cooling" 
                    value={Math.round(totals.heating_cooling).toLocaleString()} 
                    icon={thermostat}
                    onClick={() => handleCategorySelect(selectedCategory === 'heating_cooling' ? 'all' : 'heating_cooling')}
                    isSelected={selectedCategory === 'heating_cooling' && !selectedBuilding}
                />
            </div>
             <Map onBuildingSelect={handleBuildingSelect} selectedBuilding={selectedBuilding} />
             <BarChart selectedCategory={selectedCategory} selectedBuilding={selectedBuilding} />
        </div>
    </div>
  )
}
