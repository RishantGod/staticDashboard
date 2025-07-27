import React, { useMemo, useRef, useEffect, useState } from 'react';
import { scaleLinear, scaleBand, max } from 'd3';
import { getTotals, getBuildingDonutChartData } from './aggregate.jsx';
import { ImLeaf } from "react-icons/im";

export default function BarChart({ selectedCategory, selectedBuilding }) {
    const totals = getTotals();
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
    
    // Update dimensions when container size changes
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                // Leave space for padding and title
                const availableWidth = rect.width - 32; // 16px padding on each side
                const availableHeight = rect.height - 80; // Space for title and padding
                
                setDimensions({
                    width: Math.max(300, availableWidth), // Minimum width
                    height: Math.max(200, availableHeight) // Minimum height
                });
            }
        };
        
        updateDimensions();
        
        const resizeObserver = new ResizeObserver(updateDimensions);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        
        return () => {
            resizeObserver.disconnect();
        };
    }, []);
    
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
        // Dynamic margins based on chart size
        const baseMargin = { top: 30, right: 30, bottom: 50, left: 70 };
        const margin = {
            top: Math.max(20, Math.min(baseMargin.top, dimensions.height * 0.08)),
            right: Math.max(20, Math.min(baseMargin.right, dimensions.width * 0.05)),
            bottom: Math.max(40, Math.min(baseMargin.bottom, dimensions.height * 0.15)),
            left: Math.max(50, Math.min(baseMargin.left, dimensions.width * 0.1))
        };
        
        const chartWidth = dimensions.width;
        const chartHeight = dimensions.height;
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
    }, [depreciationData, currentTotal, dimensions]);
    
    return (
        <div className='bar-chart' ref={containerRef}>
            {/* Chart heading */}
            <div className="chart-header">
                <h3 style={{
                    textAlign: 'center',
                    fontSize: `${Math.max(14, Math.min(20, chartWidth * 0.025))}px`,
                    fontWeight: '600',
                    color: '#333',
                    margin: '8px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }}>
                    {getChartTitle()}
                </h3>
            </div>
            
            <div className="chart-content">
                <svg 
                    width="100%" 
                    height="100%"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}
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
                        fontSize={Math.max(10, Math.min(16, chartWidth * 0.02))}
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
                        fontSize={Math.max(10, Math.min(14, chartWidth * 0.018))}
                        fill="#9a9a9a"
                    >
                        {tick.toLocaleString()}
                    </text>
                ))}
                
                {/* Y-axis title */}
                <text
                    x={15}
                    y={chartHeight / 2 - 3}
                    textAnchor="middle"
                    fontSize={Math.max(12, Math.min(16, chartWidth * 0.02))}
                    fill="#333"
                    fontWeight="500"
                    transform={`rotate(-90, 15, ${chartHeight / 2})`}
                >
                    Total Emissions (tCO2e)
                </text>
                
                {/* Annual Reduction Banner */}
                <g>
                    {/* Calculate responsive banner dimensions and position */}
                    {(() => {
                        const bannerWidth = Math.max(150, Math.min(250, chartWidth * 0.25));
                        const bannerHeight = Math.max(100, Math.min(150, chartHeight * 0.25));
                        const bannerX = chartWidth - margin.right - bannerWidth - 10;
                        const bannerY = margin.top + 20;
                        const fontSize = Math.max(12, Math.min(20, bannerWidth * 0.08));
                        const valueFontSize = Math.max(20, Math.min(40, bannerWidth * 0.16));
                        const subtitleFontSize = Math.max(10, Math.min(16, bannerWidth * 0.064));
                        
                        return (
                            <>
                                {/* Banner background */}
                                <rect
                                    x={bannerX}
                                    y={bannerY}
                                    width={bannerWidth}
                                    height={bannerHeight}
                                    fill="#f8f9fa"
                                    stroke="#4CAF50"
                                    strokeWidth="2"
                                    rx="8"
                                    ry="8"
                                    fillOpacity="0.95"
                                />
                                
                                {/* Banner title */}
                                <text
                                    x={bannerX + bannerWidth / 2}
                                    y={bannerY + bannerHeight * 0.25}
                                    textAnchor="middle"
                                    fontSize={fontSize}
                                    fill="#333"
                                    fontWeight="600"
                                    dominantBaseline="middle"
                                >
                                    Annual Reduction
                                </text>
                                
                                {/* Banner value */}
                                <text
                                    x={bannerX + bannerWidth / 2}
                                    y={bannerY + bannerHeight * 0.5}
                                    textAnchor="middle"
                                    fontSize={valueFontSize}
                                    fill="#4CAF50"
                                    fontWeight="700"
                                    dominantBaseline="middle"
                                >
                                    {Math.round((annualReduction * 10) / 10)} 
                                    <tspan fontSize={valueFontSize * 0.6}> tCO</tspan>
                                    <tspan fontSize={valueFontSize * 0.4} dy="4">2</tspan>
                                    <tspan fontSize={valueFontSize * 0.6} dy="-2">e</tspan>
                                </text>
                                
                                {/* Banner subtitle */}
                                <text
                                    x={bannerX + bannerWidth / 2}
                                    y={bannerY + bannerHeight * 0.75}
                                    textAnchor="middle"
                                    fontSize={subtitleFontSize}
                                    fill="#666"
                                    fontWeight="500"
                                    dominantBaseline="middle"
                                >
                                    per year to reach net zero
                                </text>
                            </>
                        );
                    })()}
                </g>
                </svg>
            </div>
        </div>
    );
}