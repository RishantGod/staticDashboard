import LineChart from './LineChart.jsx';

export default function BAN({ heading, value, showTrend = false }) {
  return (
    <div className="ban">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <span className="ban-value">{value}</span>
        <p>{heading}</p>
        {showTrend && (
          <div style={{ marginTop: '8px' }}>
            <LineChart width={100} height={30} />
          </div>
        )}
      </div>
    </div>
  )
}
