import React, { useMemo } from 'react';
import { scaleLinear, scaleBand, max } from 'd3';
import { getTotals } from './aggregate.jsx';

export default function BarChart() {
    const totals = getTotals();
    const currentTotal = totals.total;
    
    // Calculate depreciation data from 2025 to 2050
    const depreciationData = useMemo(() => {
        const startYear = 2025;
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
        const chartWidth = 900;
        const chartHeight = 450;
        const innerWidth = chartWidth - margin.left - margin.right;
        const innerHeight = chartHeight - margin.top - margin.bottom;
        
        // Create scales
        const xScale = scaleBand()
            .domain(depreciationData.map(d => d.year))
            .range([0, innerWidth])
            .padding(0.1);
            
        const yScale = scaleLinear()
            .domain([0, max(depreciationData, d => d.value)])
            .range([innerHeight, 0]);
            
        return { xScale, yScale, chartWidth, chartHeight, margin };
    }, [depreciationData]);
    
    return (
        <div className='bar-chart'>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', textAlign: 'center' }}>
                Net Zero Path (2025-2050)
            </h3>
            <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#666', textAlign: 'center' }}>
                Linear depreciation to reach zero emissions by 2050
            </p>
            
            <svg 
                width={chartWidth} 
                height={chartHeight}
                style={{ display: 'block', margin: '0 auto' }}
            >
                {/* Chart background
                <rect 
                    x={margin.left} 
                    y={margin.top} 
                    width={chartWidth - margin.left - margin.right} 
                    height={chartHeight - margin.top - margin.bottom}
                    fill="#fafafa"
                    stroke="#e0e0e0"
                    strokeWidth="1"
                /> */}
                
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
                    const barColor = index === 0 ? '#f44336' : // Current year - red
                                   d.value === 0 ? '#4caf50' : // Zero emissions - green
                                   '#2196f3'; // Future years - blue
                    
                    return (
                        <rect
                            key={d.year}
                            x={margin.left + xScale(d.year)}
                            y={margin.top + yScale(d.value)}
                            width={xScale.bandwidth()}
                            height={barHeight}
                            fill={barColor}
                            stroke="#fff"
                            strokeWidth="1"
                            opacity={0.8}
                        >
                            <title>{`${d.year}: ${d.value} tCO2e`}</title>
                        </rect>
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
            
            {/* Legend */}
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '15px', 
                marginTop: '10px',
                fontSize: '10px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#f44336',
                        borderRadius: '2px'
                    }}></div>
                    <span>Current (2025)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#2196f3',
                        borderRadius: '2px'
                    }}></div>
                    <span>Reduction Path</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        backgroundColor: '#4caf50',
                        borderRadius: '2px'
                    }}></div>
                    <span>Net Zero (2050)</span>
                </div>
            </div>
        </div>
    );
}