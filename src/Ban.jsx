import LineChart from './LineChart.jsx';

export default function BAN({ heading, value, showTrend = false, icon, onClick, isSelected = false }) {
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
                width: '40%',
                height: '40%',
                objectFit: 'contain'
              }}
            />
        
        )}
        <div className='ban-text'>
          <p>{heading}</p>
          <div className='value'>
          <span className="ban-value">{value}</span>
          <span className='ban-value-unit'> tCO<sub>2</sub>e</span>
          </div>
        </div>
    </div>
  )
}
