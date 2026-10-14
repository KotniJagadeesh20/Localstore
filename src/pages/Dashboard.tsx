import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, BarChart3, Box, ClipboardCheck, ExternalLink, Pencil, ShoppingCart, Star, Users } from 'lucide-react'
import { Badge, Stars, Thumb, inr } from '../components/ui'
import { orders, products, salesSeries } from '../data/mock'

function Spark({ color }: { color: string }) {
  const pts = [8, 12, 9, 14, 11, 18, 16, 22, 20, 28]
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(i / 9) * 100},${30 - p}`).join(' ')
  return <svg viewBox="0 0 100 30" className="spark"><path d={d} fill="none" stroke={color} strokeWidth="1.5" /></svg>
}

function SalesChart({ metric }: { metric: 'Revenue' | 'Orders' }) {
  const [hover, setHover] = useState(14)
  const data = metric === 'Revenue' ? salesSeries : salesSeries.map((v) => Math.round(v / 350))
  const max = metric === 'Revenue' ? 8000 : 24
  const W = 700, H = 200
  const x = (i: number) => (i / (data.length - 1)) * W
  const y = (v: number) => H - (v / max) * H
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)
  return (
    <div className="chart">
      <div className="y-axis">{[...ticks].reverse().map((t) => <span key={t}>{metric === 'Revenue' ? '₹' : ''}{t.toLocaleString('en-IN')}</span>)}</div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" onMouseLeave={() => setHover(14)}>
        {ticks.map((t) => <line key={t} x1="0" x2={W} y1={y(t)} y2={y(t)} stroke="var(--border)" />)}
        <path d={`${line} L${W},${H} L0,${H} Z`} fill="var(--green)" opacity="0.1" />
        <path d={line} fill="none" stroke="var(--green)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <line x1={x(hover)} x2={x(hover)} y1="0" y2={H} stroke="var(--green)" strokeDasharray="4" vectorEffect="non-scaling-stroke" />
        {data.map((_, i) => <rect key={i} x={x(i) - W / 60} y="0" width={W / 30} height={H} fill="transparent" onMouseEnter={() => setHover(i)} />)}
      </svg>
      <div className="tooltip" style={{ left: `${(hover / (data.length - 1)) * 100}%` }}>
        <small>Sep {hover + 1}</small><br /><b>{metric === 'Revenue' ? inr(data[hover]) : data[hover]}</b>
      </div>
      <div className="x-axis">{['Sep 1', 'Sep 5', 'Sep 10', 'Sep 15', 'Sep 20', 'Sep 25', 'Sep 30'].map((l) => <span key={l}>{l}</span>)}</div>
    </div>
  )
}

export default function Dashboard() {
  const [metric, setMetric] = useState<'Revenue' | 'Orders'>('Revenue')
  const top = [['Kaja', 24], ['Ariselu', 18], ['Pootharekulu', 12], ['Bobbatlu', 10], ['Pickle (Mango)', 8]] as const
  const emoji = (n: string) => products.find((p) => p.name === n)?.emoji ?? '🍬'
  return (
    <>
      <section className="hero card">
        <div>
          <h1>Good morning, Ghaatu Mitai 👋</h1>
          <p>Your store is live and ready to receive orders.</p>
          <div className="row gap">
            <Link to="/store" className="btn btn-primary"><ExternalLink size={16} /> View Store</Link>
            <Link to="/store" className="btn btn-outline"><Pencil size={16} /> Edit Store</Link>
          </div>
        </div>
        <div className="tagline big">Traditional Taste, Happier Homes</div>
        <div className="quote">“Homemade sweets bringing people closer.”</div>
      </section>

      <div className="right"><select className="select"><option>Last 30 days</option><option>Last 7 days</option><option>Last 90 days</option></select></div>

      <div className="grid-4">
        {[
          { l: 'Revenue', v: '₹24,850', d: '12%', i: <BarChart3 />, t: 'green' },
          { l: 'Orders', v: '42', d: '8%', i: <ShoppingCart />, t: 'blue' },
          { l: 'Customers', v: '31', d: '5%', i: <Users />, t: 'purple' },
        ].map((s) => (
          <div className="card kpi" key={s.l}>
            <span className="stat-icon" style={{ background: `var(--${s.t}-bg)`, color: `var(--${s.t})` }}>{s.i}</span>
            <div><small>{s.l}</small><div className="stat-value">{s.v}</div></div>
            <div className="kpi-foot"><b className="up">↑ {s.d}</b><small className="muted">vs previous 30 days</small><Spark color={`var(--${s.t})`} /></div>
          </div>
        ))}
        <Link to="/products" className="card kpi">
          <span className="stat-icon" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}><Box /></span>
          <div><small>Products</small><div className="stat-value">28</div></div>
          <div className="kpi-foot"><small className="muted">24 active<br />4 out of stock</small><ArrowRight size={16} /></div>
        </Link>
      </div>

      <div className="grid-2-1">
        <div className="card pad">
          <div className="card-head">
            <div><h3><BarChart3 size={18} /> Sales Overview</h3><small className="muted">Your {metric.toLowerCase()} over the last 30 days</small></div>
            <div className="seg">{(['Revenue', 'Orders'] as const).map((m) => <button key={m} className={metric === m ? 'on' : ''} onClick={() => setMetric(m)}>{m}</button>)}</div>
          </div>
          <SalesChart metric={metric} />
        </div>
        <div className="card pad">
          <div className="card-head"><h3><AlertTriangle size={18} color="var(--red)" /> Needs Attention</h3><Link to="/inventory" className="link">View All <ArrowRight size={14} /></Link></div>
          {[
            { t: '3 products are low on stock', s: 'Update inventory to avoid stockouts.', to: '/inventory', b: 'View Inventory', c: 'red', i: <AlertTriangle size={20} /> },
            { t: '2 orders need confirmation', s: 'Please review and confirm.', to: '/orders', b: 'View Orders', c: 'amber', i: <ClipboardCheck size={20} /> },
            { t: '4 new reviews', s: 'Customers have shared their feedback.', to: '/reviews', b: 'View Reviews', c: 'blue', i: <Star size={20} /> },
          ].map((a) => (
            <div key={a.t} className="alert" style={{ background: `var(--${a.c}-bg)` }}>
              <span className="alert-icon" style={{ color: `var(--${a.c})` }}>{a.i}</span>
              <div className="grow"><strong>{a.t}</strong><br /><small className="muted">{a.s}</small></div>
              <Link to={a.to} className="btn btn-sm" style={{ color: `var(--${a.c})`, borderColor: `var(--${a.c})` }}>{a.b}</Link>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-3">
        <div className="card pad">
          <div className="card-head"><h3>Recent Orders</h3><Link to="/orders" className="link">View All <ArrowRight size={14} /></Link></div>
          <table className="table compact">
            <thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>{orders.slice(0, 5).map((o) => (
              <tr key={o.id}><td>#{o.id}</td><td>{o.customer}</td><td>{inr(o.amount)}</td><td><Badge>{o.status}</Badge></td><td>{o.date.split(',')[0]}</td></tr>
            ))}</tbody>
          </table>
        </div>
        <div className="card pad">
          <div className="card-head"><h3>Top Products</h3><Link to="/products" className="link">View All <ArrowRight size={14} /></Link></div>
          {top.map(([n, v]) => (
            <div className="bar-row" key={n}><Thumb emoji={emoji(n)} size={32} /><span className="bar-name">{n}</span><div className="bar"><i style={{ width: `${(v / 24) * 100}%` }} /></div><b>{v}</b></div>
          ))}
        </div>
        <div className="card pad">
          <div className="card-head"><h3>Customer Reviews</h3><Link to="/reviews" className="link">View All <ArrowRight size={14} /></Link></div>
          <div className="row gap-lg">
            <div><div className="big-rating">★ 4.8</div><Stars value={5} size={16} /><br /><small className="muted">128 reviews</small></div>
            <div className="grow">{[92, 5, 2, 1, 0].map((p, i) => <div className="bar-row tight" key={i}><small>{5 - i} star</small><div className="bar thin"><i style={{ width: `${p}%` }} /></div><small>{p}%</small></div>)}</div>
          </div>
          <div className="quote-card"><div className="row"><Stars value={5} size={12} /><small className="muted right-text">Sep 15, 2024</small></div>“Very tasty and fresh. Will order again!”<br /><small className="muted">— Ravi Kumar</small></div>
        </div>
      </div>
    </>
  )
}
