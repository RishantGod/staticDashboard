import React, { useMemo } from 'react';
import { scaleLinear, scaleBand, max } from 'd3';
import { getTotals, getBuildingDonutChartData } from './aggregate.jsx';
import { ImLeaf } from "react-icons/im";

export default function BarChart({ selectedCategory, selectedBuilding }) {
    const totals = getTotals();
    
    // Calculate current total based on selection
    const currentTotal = useMemo(() => {
        if (selectedBuilding) {
            // Get building-specific data and sum all categories
            const buildingData = getBuildingDonutChartData(selectedBuilding);
            return buildingData.reduce((sum, category) => sum + category.value, 0);
        } else if (selectedCategory && selectedCategory !== 'all') {
            // Get category-specific total across all buildings
            return totals[selectedCategory] || 0;
        } else {
            // Get total across all buildings and categories
            return totals.total;
        }
    }, [selectedCategory, selectedBuilding, totals]);
    
    // Get title based on selection
    const getChartTitle = () => {
        if (selectedBuilding) {
            return `${selectedBuilding} - Pathway to Net Zero`;
        } else if (selectedCategory && selectedCategory !== 'all') {
            const categoryNames = {
                electricity: 'Electricity',
                fuel: 'Fuel',
                heating_cooling: 'Heating & Cooling'
            };
            return `${categoryNames[selectedCategory]} - Pathway to Net Zero`;
        } else {
            return 'Pathway to Net Zero';
        }
    };
    
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
    const { xScale, yScale, chartWidth, chartHeight, margin, annualReduction } = useMemo(() => {
        const margin = { top: 30, right: 30, bottom: 50, left: 70 };
        const chartWidth = 950;
        const chartHeight = 520;
        const innerWidth = chartWidth - margin.left - margin.right;
        const innerHeight = chartHeight - margin.top - margin.bottom;
        
        // Calculate annual reduction
        const startYear = 2021;
        const endYear = 2050;
        const yearsToZero = endYear - startYear;
        const annualReduction = currentTotal / yearsToZero;
        
        // Create scales
        const xScale = scaleBand()
            .domain(depreciationData.map(d => d.year))
            .range([0, innerWidth])
            .padding(0.3);
            
        const yScale = scaleLinear()
            .domain([0, max(depreciationData, d => d.value)])
            .range([innerHeight, 0]);
            
        return { xScale, yScale, chartWidth, chartHeight, margin, annualReduction };
    }, [depreciationData, currentTotal]);
    
    return (
        <div className='bar-chart'>
            {/* Chart heading */}
            <h3 style={{
                textAlign: 'center',
                fontSize: '20px',
                fontWeight: '600',
                color: '#333',
                margin: '14px 0 10px 30px'
            }}>
                {getChartTitle()}
            </h3>
            
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
                        strokeWidth="0.5"
                    />
                ))}
                
                
                
                {/* Y-axis line */}
                <line
                    x1={margin.left}
                    x2={margin.left}
                    y1={margin.top}
                    y2={chartHeight - margin.bottom}
                    stroke="#333"
                    strokeWidth="1"
                />
                
                {/* X-axis ticks */}
                {depreciationData.filter((d, index) => index % 5 === 0 || d.year === 2050).map(d => (
                    <line
                        key={`x-tick-${d.year}`}
                        x1={margin.left + xScale(d.year) + xScale.bandwidth() / 2}
                        x2={margin.left + xScale(d.year) + xScale.bandwidth() / 2}
                        y1={chartHeight - margin.bottom}
                        y2={chartHeight - margin.bottom + 5}
                        stroke="#333"
                        strokeWidth="1"
                    />
                ))}
                
                {/* Y-axis ticks */}
                {yScale.ticks(5).map(tick => (
                    <line
                        key={`y-tick-${tick}`}
                        x1={margin.left - 5}
                        x2={margin.left}
                        y1={margin.top + yScale(tick)}
                        y2={margin.top + yScale(tick)}
                        stroke="#333"
                        strokeWidth="1"
                    />
                ))}
                
                {/* Bars */}
                {depreciationData.map((d, index) => {
                    const barHeight = (chartHeight - margin.top - margin.bottom) - yScale(d.value);
                    
                    // Create gradient from dark red to light red based on index
                    let barColor;
                    let barFill;
                    let barStroke;
                    let fillOpacity;

                    if (index <= 3) {
                        barColor = '#4CAF50'; 
                        barStroke = '#4CAF50'; 
                        barFill = barColor;
                        fillOpacity = 0.3;
                    } else if (index === 4) {
                        barColor = '#4CAF50'; // Base red color for index 1
                        barFill = barColor;
                        barStroke = '#4CAF50';
                        fillOpacity = 0.6;
                    } else if (index > 4) {
                        // Regular bar for index 4 
                        barColor = '#e9e9e9ff';
                        barFill = barColor;
                        barStroke = '#b1b1b1ff';
                        fillOpacity = 1;
                    } 
                    
                    return (
                        <g key={d.year}>
                            <rect
                                x={margin.left + xScale(d.year)}
                                y={margin.top + yScale(d.value)}
                                width={xScale.bandwidth()}
                                height={barHeight}
                                fill={barFill}
                                fillOpacity={fillOpacity}
                                stroke={barStroke}
                                strokeWidth="1.5"
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
                                            color: '#4CAF50', 
                                            fontSize: '24px', 
                                            transform: 'translateY(10px)'
                                        }} />
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    );
                })}

                {/* X-axis line */}
                <line
                    x1={margin.left}
                    x2={chartWidth - margin.right}
                    y1={chartHeight - margin.bottom}
                    y2={chartHeight - margin.bottom}
                    stroke="#333"
                    strokeWidth="1"
                />
                
                {/* X-axis labels - show every 5 years */}
                {depreciationData.filter((d, index) => index % 5 === 0 || d.year === 2050).map(d => (
                    <text
                        key={d.year}
                        x={margin.left + xScale(d.year) + xScale.bandwidth() / 2}
                        y={chartHeight - margin.bottom + 20}
                        textAnchor="middle"
                        fontSize="16"
                        fill="#9a9a9a"
                        fontWeight="400"
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
                        fontSize="14"
                        fill="#9a9a9a"
                    >
                        {tick.toLocaleString()}
                    </text>
                ))}
                
                
                <text
                    x={15}
                    y={chartHeight / 2 - 3}
                    textAnchor="middle"
                    fontSize="16"
                    fill="#333"
                    fontWeight="500"
                    transform={`rotate(-90, 15, ${chartHeight / 2})`}
                >
                    Total Emissions (tCO2e)
                </text>
                
                {/* Annual Reduction Banner */}
                <g>
                    {/* Banner background */}
                    <rect
                        x={chartWidth - margin.right - 300}
                        y={margin.top + 50}
                        width="250"
                        height="150"
                        fill="#f8f9fa"
                        stroke="#4CAF50"
                        strokeWidth="2"
                        rx="8"
                        ry="8"
                        fillOpacity="0.95"
                    />
                    
                    {/* Banner title - centered horizontally, 1/4 from top */}
                    <text
                        x={chartWidth - margin.right - 175} // Center of banner (300/2 = 150, so 300-125 = 175)
                        y={margin.top + 50 + 25} // 1/4 down from top (150/4 = 37.5)
                        textAnchor="middle"
                        fontSize="20"
                        fill="#333"
                        fontWeight="600"
                        dominantBaseline="middle"
                    >
                        Annual Reduction
                    </text>
                    
                    {/* Banner value - centered horizontally, 1/2 from top */}
                    <text
                        x={chartWidth - margin.right - 175} // Center of banner
                        y={margin.top + 50 + 75} // 1/2 down from top (150/2 = 75)
                        textAnchor="middle"
                        fontSize="40"
                        fill="#4CAF50"
                        fontWeight="700"
                        dominantBaseline="middle"
                    >
                        {Math.round((annualReduction * 10) / 10)} 
                        <tspan fontSize="24"> tCO</tspan>
                        <tspan fontSize="16" dy="8">2</tspan>
                        <tspan fontSize="24" dy="-5">e</tspan>
                    </text>
                    
                    {/* Banner subtitle - centered horizontally, 3/4 from top */}
                    <text
                        x={chartWidth - margin.right - 175} // Center of banner
                        y={margin.top + 50 + 112.5} // 3/4 down from top (150 * 3/4 = 112.5)
                        textAnchor="middle"
                        fontSize="16"
                        fill="#666"
                        fontWeight="500"
                        dominantBaseline="middle"
                    >
                        per year to reach net zero
                    </text>
                </g>
            </svg>
        </div>
    );
}