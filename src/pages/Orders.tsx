import { useMemo, useState } from 'react'
import { Calendar, Check, Circle, Download } from 'lucide-react'
import { Badge, Drawer, FilterBar, PageHeader, RowMenu, Select, TableFooter, Tabs, Thumb, inr } from '../components/ui'
import { orderCounts, orderFlow, orders as seed, Order, OrderStatus } from '../data/mock'

const tabTone: Record<string, string> = { Pending: 'amber', Confirmed: 'blue', Processing: 'purple', Packed: 'blue', Shipped: 'teal', Delivered: 'green', Cancelled: 'red' }

export default function Orders() {
  const [list, setList] = useState<Order[]>(seed)
  const [q, setQ] = useState('')
  const [pay, setPay] = useState('All Payments')
  const [tab, setTab] = useState('All')
  const [sel, setSel] = useState<string[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const order = list.find((o) => o.id === openId)

  const rows = useMemo(() => list.filter((o) =>
    (tab === 'All' || o.status === tab) && (pay === 'All Payments' || o.payment === pay) &&
    (o.id + o.customer + o.phone).toLowerCase().includes(q.toLowerCase())), [list, q, pay, tab])

  const idx = order ? orderFlow.indexOf(order.status) : -1
  const nextStatus = idx >= 0 && idx < orderFlow.length - 1 ? orderFlow[idx + 1] : null
  const advance = () => nextStatus && setList((l) => l.map((o) => (o.id === openId ? { ...o, status: nextStatus } : o)))
  const cancel = () => setList((l) => l.map((o) => (o.id === openId ? { ...o, status: 'Cancelled' as OrderStatus } : o)))

  return (
    <>
      <PageHeader title="Orders" subtitle="Manage and track customer orders." tagline="Happy Customers, Sweeter Tomorrows"
        actions={<button className="btn btn-primary"><Download size={16} /> Export</button>} />
      <div className="chips">
        {Object.entries(orderCounts).map(([k, c]) => (
          <button key={k} className={`chip ${tab === k ? 'on' : ''} t-${tabTone[k] ?? 'green'}`} onClick={() => setTab(k)}>{k} <span>{c}</span></button>
        ))}
      </div>
      <FilterBar search={q} onSearch={setQ} placeholder="Search order ID, customer name or phone…" onReset={() => { setQ(''); setPay('All Payments'); setTab('All') }}>
        <button className="select datebtn-like"><Calendar size={16} /> Last 30 days</button>
        <Select value={pay} onChange={setPay} options={['All Payments', 'Paid', 'Pending']} />
      </FilterBar>
      <div className="card">
        <table className="table">
          <thead><tr><th className="chk"><input type="checkbox" onChange={(e) => setSel(e.target.checked ? rows.map((r) => r.id) : [])} /></th><th>Order ID</th><th>Customer</th><th>Items</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{rows.map((o) => {
            const [d, t] = o.date.includes('Today') ? ['Today', o.date.split(', ')[1]] : [o.date.split(', ').slice(0, 2).join(', '), o.date.split(', ')[2]]
            const count = o.items.reduce((n, i) => n + i.qty, 0)
            return (
              <tr key={o.id} className="clickable" onClick={() => setOpenId(o.id)}>
                <td className="chk" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.includes(o.id)} onChange={() => setSel((x) => (x.includes(o.id) ? x.filter((i) => i !== o.id) : [...x, o.id]))} /></td>
                <td><strong>#{o.id}</strong></td>
                <td><strong>{o.customer}</strong><small className="block">{o.phone}</small></td>
                <td><div className="row gap-sm"><span className="stack">{o.items.slice(0, 2).map((i) => <Thumb key={i.name} emoji={i.emoji} size={28} />)}</span><small className="muted">{count} item{count > 1 ? 's' : ''}</small></div></td>
                <td>{inr(o.amount)}</td>
                <td><Badge dot>{o.payment}</Badge></td>
                <td><Badge dot>{o.status}</Badge></td>
                <td><small>{d}</small><small className="block muted">{t}</small></td>
                <td onClick={(e) => e.stopPropagation()}><RowMenu /></td>
              </tr>
            )
          })}</tbody>
        </table>
        <TableFooter selected={sel.length} label={`Showing 1-${rows.length} of 42`} pages={5} />
      </div>

      <Drawer open={!!order} onClose={() => setOpenId(null)} title={order ? `Order #${order.id}` : ''} subtitle={order ? `Placed on ${order.date}` : ''}>
        {order && <>
          <Badge dot>{order.status}</Badge>
          <p className="muted small">{order.status === 'Cancelled' ? 'This order was cancelled.' : order.payment === 'Paid' ? 'Payment received. Preparing items.' : 'Awaiting payment.'}</p>
          <div className="row gap-sm">
            {nextStatus && order.status !== 'Cancelled' && <button className="btn btn-primary" onClick={advance}>Mark as {nextStatus}</button>}
            {order.status !== 'Cancelled' && order.status !== 'Delivered' && <button className="btn btn-outline" onClick={cancel}>Cancel Order</button>}
          </div>
          <h4>Customer</h4>
          <div className="cell-product"><span className="avatar lg">{order.customer[0]}</span><div><strong>{order.customer}</strong><small>{order.phone}</small><small>{order.email}</small></div></div>
          <h4>Order Items</h4>
          {order.items.map((i) => (
            <div className="line" key={i.name}><Thumb emoji={i.emoji} size={48} /><div className="grow"><strong>{i.name}</strong><small>{i.variant}</small><small>{inr(i.price)} × {i.qty}</small></div><b>{inr(i.price * i.qty)}</b></div>
          ))}
          <h4>Order Summary</h4>
          <div className="sum"><span>Subtotal</span><span>{inr(order.amount)}</span></div>
          <div className="sum total"><span>Total</span><span>{inr(order.amount)}</span></div>
          <h4>Payment Information</h4>
          <div className="pay-box"><Check size={18} color="var(--green)" /><div><strong>{order.payment}</strong><small>UPI</small></div></div>
          <h4>Order Timeline</h4>
          <ol className="timeline">
            {order.status === 'Cancelled'
              ? <li className="done"><Circle size={16} /> <span><b>Order cancelled</b></span></li>
              : orderFlow.map((s, i) => (
                <li key={s} className={i < idx ? 'done' : i === idx ? 'current' : ''}>
                  <i>{i < idx && <Check size={12} />}</i>
                  <span><b>{i === 0 ? 'Order placed' : s}</b>{i === idx && <small>Current step</small>}</span>
                </li>
              ))}
          </ol>
        </>}
      </Drawer>
    </>
  )
}
