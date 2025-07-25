import React, { useMemo } from 'react';
import { scaleLinear, scaleOrdinal, max, min } from 'd3';
import { getHeatmapData } from './aggregate.jsx';

export default function Heatmap() {
    const data = getHeatmapData();
    
    // Make dimensions responsive to actual CSS container
    // Remove fixed assumptions and let CSS control the size
    const cellSize = 25; // Fixed reasonable cell size
    const margin = { top: 20, right: 80, bottom: 20, left: 40 }; // More space on right for legend
    const width = 12 * cellSize + margin.left + margin.right;
    const height = 7 * cellSize + margin.top + margin.bottom;
    
    // D3 calculations
    const { colorScale, minValue, maxValue, monthNames, weekdayNames } = useMemo(() => {
        const values = data.map(d => d.value);
        const minVal = min(values);
        const maxVal = max(values);
        
        // Create color scale from light to dark
        const colorScale = scaleLinear()
            .domain([minVal, maxVal])
            .range(['#e8f5e8', '#2d5016']);
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        return {
            colorScale,
            minValue: minVal,
            maxValue: maxVal,
            monthNames: months,
            weekdayNames: weekdays
        };
    }, [data]);
    
    return (
        <div className="heatmap">
            
            <svg 
                width="100%" 
                height="100%" 
                style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%'
                }}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Month labels (top) */}
                {monthNames.map((month, monthIndex) => (
                    <text
                        key={month}
                        x={margin.left + monthIndex * cellSize + cellSize / 2}
                        y={margin.top - 5}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#333"
                        fontWeight="500"
                    >
                        {month}
                    </text>
                ))}
                
                {/* Weekday labels (left) */}
                {weekdayNames.map((weekday, weekdayIndex) => (
                    <text
                        key={weekday}
                        x={margin.left - 5}
                        y={margin.top + weekdayIndex * cellSize + cellSize / 2}
                        textAnchor="end"
                        dy="0.35em"
                        fontSize="9"
                        fill="#333"
                        fontWeight="500"
                    >
                        {weekday}
                    </text>
                ))}
                
                {/* Heatmap cells */}
                {data.map((cell, index) => {
                    const x = margin.left + cell.monthIndex * cellSize;
                    const y = margin.top + cell.weekdayIndex * cellSize;
                    
                    return (
                        <rect
                            key={`${cell.month}-${cell.weekday}`}
                            x={x}
                            y={y}
                            width={cellSize - 2}
                            height={cellSize - 2}
                            fill={colorScale(cell.value)}
                            stroke="#fff"
                            strokeWidth="2"
                            rx="3"
                            style={{
                                cursor: 'pointer',
                                transition: 'opacity 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.opacity = '0.8';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.opacity = '1';
                            }}
                        >
                            <title>{`${cell.weekday}, ${cell.month}: ${cell.value.toFixed(1)} tCO2e`}</title>
                        </rect>
                    );
                })}
                
                {/* Legend */}
                <g transform={`translate(${margin.left + 12 * cellSize + 15}, ${margin.top})`}>
                    {/* Legend title */}
                    <text
                        x={0}
                        y={0}
                        fontSize="10"
                        fill="#333"
                        fontWeight="600"
                    >
                        tCO2e
                    </text>
                    
                    {/* Legend gradient (vertical) */}
                    <defs>
                        <linearGradient id="heatmapLegendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#2d5016" />
                            <stop offset="25%" stopColor="#4a8f4a" />
                            <stop offset="50%" stopColor="#68b568" />
                            <stop offset="75%" stopColor="#a8d5a8" />
                            <stop offset="100%" stopColor="#e8f5e8" />
                        </linearGradient>
                    </defs>
                    
                    <rect
                        x={0}
                        y={15}
                        width={12}
                        height={7 * cellSize - 20}
                        fill="url(#heatmapLegendGradient)"
                        stroke="#ccc"
                        strokeWidth="1"
                        rx="2"
                    />
                    
                    {/* Legend scale marks */}
                    {[0, 0.5, 1].map((ratio, index) => (
                        <g key={index}>
                            <text
                                x={18}
                                y={15 + (1 - ratio) * (7 * cellSize - 20) + 3}
                                fontSize="9"
                                fill="#666"
                                textAnchor="start"
                                fontWeight="500"
                            >
                                {(minValue + ratio * (maxValue - minValue)).toFixed(1)}
                            </text>
                        </g>
                    ))}
                    
                    {/* Legend labels */}
                    <text
                        x={18}
                        y={12}
                        fontSize="8"
                        fill="#666"
                        textAnchor="start"
                        fontStyle="italic"
                    >
                        High
                    </text>
                    
                    <text
                        x={18}
                        y={7 * cellSize + 5}
                        fontSize="8"
                        fill="#666"
                        textAnchor="start"
                        fontStyle="italic"
                    >
                        Low
                    </text>
                </g>
            </svg>
        </div>
    );
}