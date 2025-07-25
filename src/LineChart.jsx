import React from 'react';
import { getMonthlyTrendData } from './aggregate.jsx';

export default function LineChart({ width = 120, height = 40, showAxes = false }) {
    const data = getMonthlyTrendData();
    
    // Find min and max values for scaling
    const values = data.map(d => d.total);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue;
    
    // Create SVG path
    const createPath = () => {
        const points = data.map((point, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((point.total - minValue) / range) * height;
            return `${x},${y}`;
        });
        
        return `M ${points.join(' L ')}`;
    };
    
    // Create area path for fill
    const createAreaPath = () => {
        const points = data.map((point, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((point.total - minValue) / range) * height;
            return `${x},${y}`;
        });
        
        return `M 0,${height} L ${points.join(' L ')} L ${width},${height} Z`;
    };
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width={width} height={height} style={{ overflow: 'visible' }}>
                {/* Background gradient area */}
                <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4CAF50" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                
                {/* Area fill */}
                <path
                    d={createAreaPath()}
                    fill="url(#areaGradient)"
                    stroke="none"
                />
                
                {/* Main line */}
                <path
                    d={createPath()}
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Data points */}
                {data.map((point, index) => {
                    const x = (index / (data.length - 1)) * width;
                    const y = height - ((point.total - minValue) / range) * height;
                    
                    return (
                        <circle
                            key={point.month}
                            cx={x}
                            cy={y}
                            r="2"
                            fill="#4CAF50"
                            stroke="white"
                            strokeWidth="1"
                        />
                    );
                })}
            </svg>
            
            {showAxes && (
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    width: width,
                    fontSize: '10px',
                    color: '#666',
                    marginTop: '4px'
                }}>
                    <span>{data[0]?.month}</span>
                    <span>{data[data.length - 1]?.month}</span>
                </div>
            )}
        </div>
    );
}