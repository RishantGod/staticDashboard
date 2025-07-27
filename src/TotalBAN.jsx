import React from 'react';
import LineChart from './LineChart.jsx';
import { getTotals } from './aggregate.jsx';
import totalCarbonIcon from './assets/carbon.svg'

export default function TotalBAN(){
    const totals = getTotals();
    
    return(
        <div className="total-ban">
            <h4> Total Emissions </h4>
            <div className="total-ban-upper">
                <img 
                    src={totalCarbonIcon} 
                    alt="Total Carbon Emissions Icon"
                    style={{
                        width: '50%',
                        height: '50%',
                        objectFit: 'contain',
                    }}
                />
                <div className='total-ban-text'>
                    
                    <div className='total-ban-value-box'>
                        <span className="total-ban-value">{Math.round(totals.total).toLocaleString()}</span>
                        <span className="total-ban-value-unit">  tCO<sub>2</sub>e</span>
                    </div>
                </div>
            </div>
                
                <div>
                    <LineChart width={280} height={100} showAxes={true} />
                </div>
            
        </div>
    )
}