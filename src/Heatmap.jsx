import React, { useMemo } from 'react';
import { scaleLinear, max, min } from 'd3';
import { interpolateBlues } from 'd3-scale-chromatic';
import { getHeatmapData } from './aggregate.jsx';



export default function Heatmap() {
    const data = getHeatmapData();
    
    // Make dimensions responsive to actual CSS container
    const cellWidth = 40; // Wider cells for rectangular shape
    const cellHeight = 22; // Keep height same as before
    const margin = { top: 20, right: 80, bottom: 50, left: 40 }; // More space on right for legend
    const width = 12 * cellWidth + margin.left + margin.right;
    const height = 7 * cellHeight + margin.top + margin.bottom;
    
    // D3 calculations
    const { colorScale, minValue, maxValue, monthNames, weekdayNames } = useMemo(() => {
        const values = data.map(d => d.value);
        const minVal = min(values);
        const maxVal = max(values);
        
        // Create color scale using RdPu (Red-Purple) color scheme
        const colorScale = scaleLinear()
            .domain([minVal, maxVal])
            .range([0, 1])
            .interpolate(() => (t) => interpolateBlues(t));
        
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
            <h3 style={{ margin: '14px 0 10px 30px', fontSize: '20px', textAlign: 'center', fontWeight: '600', color: '#333' }}>
                Emissions Intensity Heatmap
            </h3>
            
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
                        x={margin.left + monthIndex * cellWidth + cellWidth / 2}
                        y={margin.top - 5}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#9a9a9a"
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
                        y={margin.top + weekdayIndex * cellHeight + cellHeight / 2}
                        textAnchor="end"
                        dy="0.35em"
                        fontSize="8"
                        fill="#9a9a9a"
                        fontWeight="500"
                    >
                        {weekday}
                    </text>
                ))}
                
                {/* Heatmap cells */}
                {data.map((cell, index) => {
                    const x = margin.left + cell.monthIndex * cellWidth;
                    const y = margin.top + cell.weekdayIndex * cellHeight;
                    
                    return (
                        <rect
                            key={`${cell.month}-${cell.weekday}`}
                            x={x}
                            y={y}
                            width={cellWidth - 2}
                            height={cellHeight - 2}
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
                            <title>{`${cell.weekday}, ${cell.month}: ${Math.round(cell.value)} tCO2e`}</title>
                        </rect>
                    );
                })}
                
                {/* Legend */}
                <g transform={`translate(${margin.left + 12 * cellWidth + 15}, ${margin.top})`}>
                    {/* Legend title */}
                    <text
                        x={-5}
                        y={0}
                        fontSize="10"
                        fill="#333"
                        fontWeight="400"
                    >
                        tCO2e
                    </text>
                    
                    {/* Legend gradient (vertical) */}
                    <defs>
                        <linearGradient id="heatmapLegendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={interpolateBlues(1)} />
                            <stop offset="25%" stopColor={interpolateBlues(0.75)} />
                            <stop offset="50%" stopColor={interpolateBlues(0.5)} />
                            <stop offset="75%" stopColor={interpolateBlues(0.25)} />
                            <stop offset="100%" stopColor={interpolateBlues(0)} />
                        </linearGradient>
                    </defs>
                    
                    <rect
                        x={0}
                        y={15}
                        width={12}
                        height={7 * cellHeight - 20}
                        fill="url(#heatmapLegendGradient)"
                        stroke="#ccc"
                        strokeWidth="1"
                        rx="2"
                    />
                    
                    {/* Legend scale marks */}
                    {[0, 0.5, 1].map((ratio, index) => (
                        <g key={index}>
                            <text
                                x={22}
                                y={17 + (1 - ratio) * (7 * cellHeight - 20) + 3}
                                fontSize="9"
                                fill="#666"
                                textAnchor="start"
                                fontWeight="500"
                            >
                                {Math.round(minValue + ratio * (maxValue - minValue))}
                            </text>
                        </g>
                    ))}
                    
                    {/* Legend labels */}
                    <text
                        x={0}
                        y={12}
                        fontSize="8"
                        fill="#666"
                        textAnchor="start"
                        fontStyle="italic"
                    >
                        High
                    </text>
                    
                    <text
                        x={0}
                        y={7 * cellHeight + 5}
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