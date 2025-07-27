import React, { useState, useEffect } from 'react';
import LineChart from './LineChart.jsx';

export default function BAN({ heading, value, showTrend = false, icon, onClick, isSelected = false }) {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate responsive sizes based on screen width
  const getResponsiveSize = () => {
    if (screenWidth >= 1440) return 1;      // Large screens - normal size
    if (screenWidth >= 1024) return 0.9;   // Medium screens - slightly smaller
    if (screenWidth >= 768) return 0.8;    // Tablets - smaller
    if (screenWidth >= 480) return 0.7;    // Small tablets - much smaller
    return 0.6;                             // Mobile - smallest
  };

  const scale = getResponsiveSize();
  const iconSize = Math.max(20, 40 * scale); // Min 20%, max 40%
  const fontSize = Math.max(12, 24 * scale); // Min 12px, scales with screen
  return (
    <div 
      className={`ban ${isSelected ? 'ban-selected' : ''}`}
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
        border: isSelected ? '2px solid #007acc' : '2px solid transparent'
      }}
    >
        {/* Icon positioned on the left */}
        {icon && (
            <img 
              src={icon} 
              alt={`${heading} icon`}
              style={{
                width: `${iconSize}%`,
                height: `${iconSize}%`,
                objectFit: 'contain'
              }}
            />
        
        )}
        <div className='ban-text' style={{ fontSize: `${fontSize}px` }}>
          <p style={{ fontSize: `${fontSize * 0.8}px`, margin: 0 }}>{heading}</p>
          <div className='value'>
          <span className="ban-value" style={{ fontSize: `${fontSize * 1.2}px` }}>{value}</span>
          <span className='ban-value-unit' style={{ fontSize: `${fontSize * 0.6}px` }}> tCO<sub>2</sub>e</span>
          </div>
        </div>
    </div>
  )
}
