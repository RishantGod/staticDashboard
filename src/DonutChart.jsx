import React, { useMemo } from 'react';
import { pie, arc, scaleOrdinal } from 'd3';
import { getDonutChartData, getBuildingDonutChartData } from './aggregate.jsx';

export default function DonutChart({ selectedBuilding }) {
    // Get data based on whether a building is selected
    const data = selectedBuilding ? getBuildingDonutChartData(selectedBuilding) : getDonutChartData();
    
    // Chart dimensions
    const width = 350;
    const height = 320; // Reduced height to make room for legend
    const margin = 20; // Reduced margin
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.6; // Creates the donut hole
    
    // D3 calculations
    const { arcs, colorScale, total } = useMemo(() => {
        // Create pie generator with padding for gaps
        const pieGenerator = pie()
            .value(d => d.value)
            .sort(null) // Maintain original order
            .padAngle(0.03); // Add small gaps between arcs
        
        // Create arc generator
        const arcGenerator = arc()
            .innerRadius(innerRadius)
            .outerRadius(radius)
            .cornerRadius(4); // Optional: rounded corners
            
        // Create arc generator for icon positioning (middle of the arc)
        const iconArcGenerator = arc()
            .innerRadius((innerRadius + radius) / 2)
            .outerRadius((innerRadius + radius) / 2);
        
        // Generate arcs data
        const arcsData = pieGenerator(data).map(d => ({
            ...d,
            path: arcGenerator(d),
            iconPosition: iconArcGenerator.centroid(d)
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
        <div className="donut-chart" style={{ position: 'relative' }}>
            <h3 style={{ margin: '14px 0 10px 30px', fontSize: '20px', textAlign: 'center' }}>
                {selectedBuilding ? `${selectedBuilding} - Emissions by Category` : 'Carbon Emissions by Category'}
            </h3>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1px',
                height: 'calc(100% - 60px)',
                overflow: 'visible'
            }}>
                {/* SVG Chart */}
                <svg width={width} height={height} style={{ marginBottom: '10px' }}>
                    <g transform={`translate(${width/2}, ${height/2 - 20})`}>
                        {arcs.map((arc, index) => (
                            <g key={arc.data.name}>
                                {/* Arc path */}
                                <path
                                    d={arc.path}
                                    fill={arc.data.color}
                                    fillOpacity={0.5}
                                    stroke={arc.data.color}
                                    strokeWidth={1}
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
                                
                                {/* Icons */}
                                <foreignObject
                                    x={arc.iconPosition[0] - 12}
                                    y={arc.iconPosition[1] - 12}
                                    width="24"
                                    height="24"
                                    style={{ pointerEvents: 'none' }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        width: '100%',
                                        height: '100%'
                                    }}>
                                        {arc.data.icon}
                                    </div>
                                </foreignObject>
                            </g>
                        ))}
                    </g>
                </svg>
                
                {/* Legend positioned in bottom right */}
                <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    right: '15px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {data.map((item, index) => (
                        <div key={item.name} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            fontWeight: '500'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {item.icon}
                            </div>
                            <span style={{ color: '#333' }}>
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
                    
            </div>
        </div>
    );
}