import React, { useMemo } from 'react';
import { pie, arc, scaleOrdinal } from 'd3';
import { getDonutChartData } from './aggregate.jsx';

export default function DonutChart() {
    const data = getDonutChartData();
    
    // Chart dimensions
    const width = 300;
    const height = 300;
    const margin = 40;
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.6; // Creates the donut hole
    
    // D3 calculations
    const { arcs, colorScale, total } = useMemo(() => {
        // Create pie generator
        const pieGenerator = pie()
            .value(d => d.value)
            .sort(null); // Maintain original order
        
        // Create arc generator
        const arcGenerator = arc()
            .innerRadius(innerRadius)
            .outerRadius(radius);
        
        // Generate arcs data
        const arcsData = pieGenerator(data).map(d => ({
            ...d,
            path: arcGenerator(d)
        }));
        
        // Create color scale
        const colors = scaleOrdinal()
            .domain(data.map(d => d.name))
            .range(data.map(d => d.color));
        
        // Calculate total
        const totalValue = data.reduce((sum, d) => sum + d.value, 0);
        
        return {
            arcs: arcsData,
            colorScale: colors,
            total: totalValue
        };
    }, [data, radius, innerRadius]);
    
    return (
        <div className="donut-chart">
            <h3>Carbon Emissions by Category</h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                {/* SVG Chart */}
                <svg width={width} height={height}>
                    <g transform={`translate(${width/2}, ${height/2})`}>
                        {arcs.map((arc, index) => (
                            <g key={arc.data.name}>
                                {/* Arc path */}
                                <path
                                    d={arc.path}
                                    fill={arc.data.color}
                                    stroke="white"
                                    strokeWidth={2}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'opacity 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.opacity = '0.8';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.opacity = '1';
                                    }}
                                />
                                
                                {/* Labels */}
                                <text
                                    transform={`translate(${arc.path.split('A')[0].split(',').slice(-2).join(',').replace('L', '')})`}
                                    textAnchor="middle"
                                    dy="0.35em"
                                    fontSize="12"
                                    fill="white"
                                    fontWeight="bold"
                                    pointerEvents="none"
                                >
                                    {((arc.data.value / total) * 100).toFixed(1)}%
                                </text>
                            </g>
                        ))}
                        
                        {/* Center text showing total */}
                        <text
                            textAnchor="middle"
                            dy="-0.5em"
                            fontSize="18"
                            fontWeight="bold"
                            fill="#333"
                        >
                            Total
                        </text>
                        <text
                            textAnchor="middle"
                            dy="1em"
                            fontSize="24"
                            fontWeight="bold"
                            fill="#333"
                        >
                            {total.toFixed(1)}
                        </text>
                        <text
                            textAnchor="middle"
                            dy="2.2em"
                            fontSize="14"
                            fill="#666"
                        >
                            tCO2e
                        </text>
                    </g>
                </svg>
                
                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {data.map((item, index) => (
                        <div 
                            key={item.name}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '8px',
                                fontSize: '14px'
                            }}
                        >
                            <div
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    backgroundColor: item.color,
                                    borderRadius: '3px'
                                }}
                            />
                            <span style={{ fontWeight: '500' }}>{item.name}</span>
                            <span style={{ color: '#666' }}>
                                {item.value} tCO2e ({((item.value / total) * 100).toFixed(1)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}