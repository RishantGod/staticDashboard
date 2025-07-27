import LineChart from './LineChart.jsx';

export default function BAN({ heading, value, showTrend = false, icon }) {
  return (
    <div className="ban">
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
