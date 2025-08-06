import React, { useMemo, useState, useEffect } from 'react';
import { pie, arc, scaleOrdinal } from 'd3';
import { getDonutChartData, getBuildingDonutChartData } from './aggregate.jsx';

export default function DonutChart({ selectedBuilding }) {
    // Get data based on whether a building is selected
    const data = selectedBuilding ? getBuildingDonutChartData(selectedBuilding) : getDonutChartData();
    
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate responsive sizes based on screen width
    const getResponsiveScale = () => {
        if (screenWidth >= 1440) return 1;      // Large screens - normal size
        if (screenWidth >= 1024) return 0.9;   // Medium screens - slightly smaller
        if (screenWidth >= 768) return 0.8;    // Tablets - smaller
        if (screenWidth >= 480) return 0.7;    // Small tablets - much smaller
        return 0.6;                             // Mobile - smallest
    };

    const scale = getResponsiveScale();
    
    // Chart dimensions with responsive scaling
    const width = Math.max(180, 315 * scale); 
    const height = Math.max(160, 290 * scale);
    const margin = Math.max(8, 15 * scale); // Reduced margin
    const radius = Math.min(width, height) / 2 - margin;
    const innerRadius = radius * 0.55; // Made the donut thinner
    
    // Responsive font sizes
    const titleFontSize = Math.max(11, 16 * scale); // Reduced font size
    const percentageFontSize = Math.max(6, 10 * scale); // Reduced font size
    const legendFontSize = Math.max(6, 10 * scale); // Reduced font size
    const iconSize = Math.max(12, 20 * scale); // Reduced icon size
    
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
    }, [data, radius, innerRadius, scale]);
    
    return (
        <div className="donut-chart" style={{ position: 'relative' }}>
            <h3 style={{ 
                margin: `${Math.max(5, 10 * scale)}px 0`, // Simplified and reduced margin
                fontSize: `${titleFontSize}px`, 
                textAlign: 'center',
                height: `${titleFontSize * 1.5}px` // Explicit height to reserve space
            }}>
                {selectedBuilding ? `${selectedBuilding} - Emissions by Category` : 'Carbon Emissions by Category'}
            </h3>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '1px',
                height: `calc(100% - ${titleFontSize * 1.5}px)`, // Dynamically calculate height
                overflow: 'visible'
            }}>
                {/* SVG Chart */}
                <svg width={width} height={height} style={{ overflow: 'visible', marginBottom: `${Math.max(5, 10 * scale)}px` }}>
                    <g transform={`translate(${width/2}, ${height/2})`}> {/* Centered the chart */}
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
                                    fontSize={percentageFontSize}
                                    fill="white"
                                    fontWeight="bold"
                                    pointerEvents="none"
                                >
                                    {((arc.data.value / total) * 100).toFixed(1)}%
                                </text>
                                
                                {/* Icons */}
                                <foreignObject
                                    x={arc.iconPosition[0] - iconSize/2}
                                    y={arc.iconPosition[1] - iconSize/2}
                                    width={iconSize}
                                    height={iconSize}
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
                    bottom: `${Math.max(8, 15 * scale)}px`,
                    right: `${Math.max(8, 15 * scale)}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: `${Math.max(4, 8 * scale)}px`,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    padding: `${Math.max(5, 10 * scale)}px`,
                    borderRadius: `${Math.max(4, 8 * scale)}px`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    {data.map((item, index) => (
                        <div key={item.name} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: `${Math.max(4, 8 * scale)}px`,
                            fontSize: `${legendFontSize}px`,
                            fontWeight: '500'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transform: `scale(${scale})`
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