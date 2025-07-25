import React from 'react'
import BAN from './BAN.jsx'
import TotalBAN from './TotalBAN.jsx'
import LineChart from './LineChart.jsx'
import DonutChart from './DonutChart.jsx'
import Heatmap from './Heatmap.jsx'
import Map from './Map.jsx'
import BarChart from './BarChart.jsx'










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
                <BAN heading="Electricity" value="1000" />
                <BAN heading="Fuel" value="2000" />
                <BAN heading="Heating & Cooling" value="3000" />
            </div>
             <Map />
             <BarChart />
        </div>
    </div>
  )
}
