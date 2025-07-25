import React from 'react';
import LineChart from './LineChart.jsx';
import { getTotals } from './aggregate.jsx';

export default function TotalBAN(){
    const totals = getTotals();
    
    return(
        <div className="total-ban">
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                position: 'relative'
            }}>
                {/* Main content centered */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '4px' 
                }}>
                    <span className="total-ban-value">{totals.total}</span>
                    <p>Total Emissions</p>
                </div>
                
                {/* Line chart positioned at bottom */}
                <div style={{ 
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                }}>
                    <LineChart width={250} height={80} showAxes={true} />
                </div>
            </div>
        </div>
    )
}