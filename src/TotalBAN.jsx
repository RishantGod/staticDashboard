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
    const iconSize = Math.max(25, 50 * scale); // Min 25%, max 50%
    const titleFontSize = Math.max(10, 24 * scale); // Title font
    const valueFontSize = Math.max(14, 56 * scale); // Large value font - reduced more aggressively
    const unitFontSize = Math.max(6, 19 * scale); // Unit font
    
    // Make chart width much larger on mobile (80% of container width)
    const chartWidth = screenWidth <= 480 ? 
        Math.max(250, window.innerWidth * 0.8 * 0.8) : // Mobile: 80% of 80% of screen width
        Math.max(120, 280 * scale); // Other screens: existing logic
    const chartHeight = Math.max(30, 100 * scale); // Reduced height more aggressively
    
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