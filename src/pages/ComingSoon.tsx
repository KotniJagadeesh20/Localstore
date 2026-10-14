export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="card" style={{ padding: 40, textAlign: 'center' }}>
      <h1>{title}</h1>
      <p className="muted">This section is coming soon.</p>
    </div>
  )
}
