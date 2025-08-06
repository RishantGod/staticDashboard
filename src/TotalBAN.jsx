import React, { useState, useEffect } from 'react';
import LineChart from './LineChart.jsx';
import { getTotals } from './aggregate.jsx';
import totalCarbonIcon from './assets/carbon.svg'

export default function TotalBAN({ onClick, isSelected }){
    const totals = getTotals();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate responsive sizes based on screen width
    const getResponsiveSize = () => {
        if (screenWidth >= 1440) return 1;      // Large screens - normal size
        if (screenWidth >= 1024) return 0.9;   // Medium screens - slightly smaller
        if (screenWidth >= 768) return 0.8;    // Tablets - smaller
        if (screenWidth >= 480) return 0.7;    // Small tablets - much smaller
        return 0.6;                             // Mobile - smallest
    };

    const scale = getResponsiveSize();
    const iconSize = Math.max(22, 40 * scale); // Reduced from 25, 45
    const titleFontSize = Math.max(9, 22 * scale); // Reduced from 10, 24
    const valueFontSize = Math.max(12, 40 * scale); // Reduced from 14, 45
    const unitFontSize = Math.max(5, 14 * scale); // Reduced from 6, 16
    
    // Make chart width much larger on mobile (80% of container width)
    const chartWidth = screenWidth <= 480 ? 
        Math.max(220, window.innerWidth * 0.8 * 0.8) : // Reduced from 250
        Math.max(100, 250 * scale); // Reduced from 120, 280
    const chartHeight = screenWidth <= 480 ?
        Math.max(40, 80 * scale) : // Reduced from 50, 100
        Math.max(30, 80 * scale); // Reduced from 30, 100
    
    return(
        <div 
            className={`total-ban ${isSelected ? 'ban-selected' : ''}`}
            onClick={onClick}
            style={{ cursor: 'pointer' }}
        >
            <p style={{ 
                fontSize: `${titleFontSize}px`, 
                margin: 0,
                fontWeight: '500'
            }}> 
                Total Emissions 
            </p>
            <div className="total-ban-upper">
                <img 
                    src={totalCarbonIcon} 
                    alt="Total Carbon Emissions Icon"
                    style={{
                        width: `${iconSize}%`,
                        height: `${iconSize}%`,
                        objectFit: 'contain',
                    }}
                />
                <div className='total-ban-text'>
                    
                    <div className='total-ban-value-box'>
                        <span 
                            className="total-ban-value"
                            style={{ fontSize: `${valueFontSize}px` }}
                        >
                            {Math.round(totals.total).toLocaleString()}
                        </span>
                        <span 
                            className="total-ban-value-unit"
                            style={{ fontSize: `${unitFontSize}px` }}
                        >
                            tCO<sub>2</sub>e
                        </span>
                    </div>
                </div>
            </div>
                
                <div>
                    <LineChart 
                        width={chartWidth} 
                        height={chartHeight} 
                        showAxes={true} 
                    />
                </div>
            
        </div>
    )
}