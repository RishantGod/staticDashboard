import React from 'react'
import BAN from './BAN.jsx'
import TotalBAN from './TotalBAN.jsx'
import LineChart from './LineChart.jsx'
import DonutChart from './DonutChart.jsx'
import Heatmap from './Heatmap.jsx'
import Map from './Map.jsx'
import BarChart from './BarChart.jsx'
import thermostat from './assets/thermostat.svg'
import infrastructure from './assets/infrastructure.svg'
import fuel from './assets/fuel.svg'


// TODO: Heatmap
// * Adding a tooltip on hover


// TODO: Donuts
// * Adding a tooltip on hover


// TODO: Bar Chart
// * Adding a leaf icon on top of 2050
// * Add a x and y axis
// * Changing the font size of the x and y axis
// * Changing the font size of the heading
// * Adding a tooltip on hover




// TODO: BAN



export default function Dashboard() {
  return (
    <div className='dashboard'>
        <div className='top-row'>
            <TotalBAN />
            <DonutChart />
            <Heatmap />
        </div>
        <div className='bottom-row'>
            <div className='ban-group'>
                <BAN 
                    heading="Electricity" 
                    value="1000" 
                    icon={infrastructure} 
                />
                <BAN 
                    heading="Fuel" 
                    value="2000" 
                    icon={fuel} 
                />
                <BAN 
                    heading="Heating & Cooling" 
                    value="3000" 
                    icon={thermostat} 
                />
            </div>
             <Map />
             <BarChart />
        </div>
    </div>
  )
}
