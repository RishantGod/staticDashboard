import React, { useMemo } from 'react';
import { scaleLinear, scaleBand, max } from 'd3';
import { getTotals } from './aggregate.jsx';
import { ImLeaf } from "react-icons/im";

export default function BarChart() {
    const totals = getTotals();
    const currentTotal = totals.total;
    
    // Calculate depreciation data from 2025 to 2050
    const depreciationData = useMemo(() => {
        const startYear = 2021;
        const endYear = 2050;
        const yearsToZero = endYear - startYear; // 25 years
        const annualReduction = currentTotal / yearsToZero;
        
        const data = [];
        for (let year = startYear; year <= endYear; year++) {
            const yearsElapsed = year - startYear;
            const value = Math.max(0, currentTotal - (annualReduction * yearsElapsed));
            data.push({
                year: year,
                value: Math.round(value * 10) / 10
            });
        }
        return data;
    }, [currentTotal]);
    
    // D3 calculations for chart dimensions and scales
    const { xScale, yScale, chartWidth, chartHeight, margin } = useMemo(() => {
        const margin = { top: 30, right: 30, bottom: 50, left: 70 };
        const chartWidth = 950;
        const chartHeight = 550;
        const innerWidth = chartWidth - margin.left - margin.right;
        const innerHeight = chartHeight - margin.top - margin.bottom;
        
        // Create scales
        const xScale = scaleBand()
            .domain(depreciationData.map(d => d.year))
            .range([0, innerWidth])
            .padding(0.3);
            
        const yScale = scaleLinear()
            .domain([0, max(depreciationData, d => d.value)])
            .range([innerHeight, 0]);
            
        return { xScale, yScale, chartWidth, chartHeight, margin };
    }, [depreciationData]);
    
    return (
        <div className='bar-chart'>
            
            <svg 
                width={chartWidth} 
                height={chartHeight}
                style={{ display: 'block', margin: '0 auto' }}
            >
                
                {/* Y-axis grid lines */}
                {yScale.ticks(5).map(tick => (
                    <line
                        key={tick}
                        x1={margin.left}
                        x2={chartWidth - margin.right}
                        y1={margin.top + yScale(tick)}
                        y2={margin.top + yScale(tick)}
                        stroke="#e0e0e0"
                        strokeWidth="1"
                    />
                ))}
                
                {/* Bars */}
                {depreciationData.map((d, index) => {
                    const barHeight = (chartHeight - margin.top - margin.bottom) - yScale(d.value);
                    
                    // Create gradient from dark red to light red based on index
                    let barColor;
                    if (index === 0) {
                        barColor = 'rgb(200, 5, 6)'; // Slightly darker than base for index 0
                    } else if (index === 1) {
                        barColor = 'rgb(220, 10, 11)'; // Base red color for index 1
                    } else {
                        // Calculate lighter shades for subsequent indices
                        const lightnessFactor = Math.min(0.8, (index - 1) * 0.08); // Gradually increase lightness
                        const r = Math.min(255, Math.round(220 + (255 - 220) * lightnessFactor));
                        const g = Math.min(255, Math.round(10 + (255 - 10) * lightnessFactor));
                        const b = Math.min(255, Math.round(11 + (255 - 11) * lightnessFactor));
                        barColor = `rgb(${r}, ${g}, ${b})`;
                    }
                    
                    return (
                        <g key={d.year}>
                            <rect
                                x={margin.left + xScale(d.year)}
                                y={margin.top + yScale(d.value)}
                                width={xScale.bandwidth()}
                                height={barHeight}
                                fill={index < 4 ? barColor : '#e9e9e9ff'}
                                fillOpacity={0.7}
                                stroke={index < 4 ? barColor : '#b8b8b8ff'}
                                strokeWidth="1"
                            >
                                <title>{`${d.year}: ${d.value} tCO2e`}</title>
                            </rect>
                            
                            {/* Add leaf icon for 2050 (net zero) */}
                            {d.year === 2050 && (
                                <foreignObject
                                    x={margin.left + xScale(d.year) + xScale.bandwidth() / 2 - 15}
                                    y={margin.top + yScale(d.value) - 40}
                                    width="30"
                                    height="30"
                                    style={{ pointerEvents: 'none', overflow: 'visible' }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        margin: 0,
                                        padding: 0
                                    }}>
                                        <ImLeaf style={{ 
                                            color: '#4caf50', 
                                            fontSize: '24px', 
                                            transform: 'translateY(10px)'
                                        }} />
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    );
                })}
                
                {/* X-axis labels - show every 5 years */}
                {depreciationData.filter((d, index) => index % 5 === 0 || d.year === 2050).map(d => (
                    <text
                        key={d.year}
                        x={margin.left + xScale(d.year) + xScale.bandwidth() / 2}
                        y={chartHeight - margin.bottom + 15}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#666"
                    >
                        {d.year}
                    </text>
                ))}
                
                {/* Y-axis labels */}
                {yScale.ticks(5).map(tick => (
                    <text
                        key={tick}
                        x={margin.left - 10}
                        y={margin.top + yScale(tick)}
                        textAnchor="end"
                        dy="0.35em"
                        fontSize="10"
                        fill="#666"
                    >
                        {tick}
                    </text>
                ))}
                
                {/* Axis titles */}
                <text
                    x={chartWidth / 2}
                    y={chartHeight - 5}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#333"
                    fontWeight="500"
                >
                    Year
                </text>
                
                <text
                    x={15}
                    y={chartHeight / 2}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#333"
                    fontWeight="500"
                    transform={`rotate(-90, 15, ${chartHeight / 2})`}
                >
                    Total Emissions (tCO2e)
                </text>
            </svg>
        </div>
    );
}