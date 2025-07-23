export default function BAN({ heading, value }) {
  return (
    <div className="ban">
      <span className="ban-value">{value}</span>
      <p>{heading}</p>
    </div>
  )
}
