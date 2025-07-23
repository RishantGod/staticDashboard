import React from 'react';
import LineChart from './LineChart.jsx';

export default function TotalBAN(){
    return(
        <div className="total-ban">
            <span className="total-ban-value">250</span>
            <p>Total</p>
            <LineChart />
        </div>
    )
}