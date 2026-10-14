import { useMemo, useState } from 'react'
import { Calendar, Mail, Phone, Plus, RefreshCw, User, UserPlus, Users } from 'lucide-react'
import { Badge, Drawer, Field, FilterBar, Modal, PageHeader, Pagination, Select, Stars, StatCard, inr } from '../components/ui'
import { customerOrderHistory, customers as seed, Customer } from '../data/mock'

const tint = ['blue', 'amber', 'purple', 'teal', 'pink', 'green']

export default function Customers() {
  const [list, setList] = useState<Customer[]>(seed)
  const [q, setQ] = useState('')
  const [seg, setSeg] = useState('All Customers')
  const [act, setAct] = useState('All Activity')
  const [openId, setOpenId] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [tab, setTab] = useState<'Order History' | 'Reviews (3)'>('Order History')
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const cust = list.find((c) => c.id === openId)

  const rows = useMemo(() => list.filter((c) =>
    (seg === 'All Customers' || c.tag === seg.split(' ')[0]) &&
    (c.name + c.phone + c.email).toLowerCase().includes(q.toLowerCase())), [list, q, seg])

  const initials = (n: string) => n.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()
  const add = () => {
    if (!form.name.trim() || !form.phone.trim()) return
    setList((l) => [{ id: String(Date.now()), ...form, orders: 0, spent: 0, lastOrder: '—', joined: 'Today', tag: 'New' }, ...l])
    setForm({ name: '', phone: '', email: '', notes: '' }); setAdding(false)
  }

  return (
    <>
      <PageHeader title="Customers" subtitle="Manage your customers and build lasting relationships." tagline="Happy Customers, Sweeter Tomorrows"
        actions={<button className="btn btn-primary" onClick={() => setAdding(true)}><Plus size={18} /> Add Customer</button>} />
      <div className="grid-4">
        <StatCard icon={<Users />} tint="blue" label="Total Customers" value="128" sub="All customers" />
        <StatCard icon={<UserPlus />} tint="green" label="New Customers" value="24" sub="First-time buyers" />
        <StatCard icon={<RefreshCw />} tint="green" label="Returning Customers" value="82" sub="More than 1 order" />
        <StatCard icon={<User />} tint="gray" label="Inactive Customers" value="22" sub="No recent orders" />
      </div>
      <FilterBar search={q} onSearch={setQ} placeholder="Search name, phone or email…" onReset={() => { setQ(''); setSeg('All Customers'); setAct('All Activity') }}>
        <Select value={seg} onChange={setSeg} options={['All Customers', 'New customers', 'Returning customers', 'Inactive customers']} />
        <Select value={act} onChange={setAct} options={['All Activity', 'Last 7 days', 'Last 30 days']} />
      </FilterBar>
      <div className="card">
        <table className="table">
          <thead><tr><th className="chk"><input type="checkbox" /></th><th>Customer</th><th>Orders</th><th>Total Spent</th><th>Last Order</th><th>Joined</th><th /></tr></thead>
          <tbody>{rows.map((c, i) => (
            <tr key={c.id} className="clickable" onClick={() => { setOpenId(c.id); setTab('Order History') }}>
              <td className="chk" onClick={(e) => e.stopPropagation()}><input type="checkbox" /></td>
              <td><div className="cell-product"><span className="avatar" style={{ background: `var(--${tint[i % tint.length]}-bg)`, color: `var(--${tint[i % tint.length]})` }}>{initials(c.name)}</span><div><strong>{c.name}</strong><small>{c.phone}</small><small>{c.email}</small></div></div></td>
              <td>{c.orders}</td><td>{inr(c.spent)}</td><td className="muted">{c.lastOrder}</td><td className="muted">{c.joined}</td>
              <td><Badge>{c.tag}</Badge></td>
            </tr>
          ))}</tbody>
        </table>
        <div className="table-footer"><span className="muted">Showing 1-{rows.length} of 128 customers</span><div className="spacer" /><Pagination label="" pages={5} /></div>
      </div>

      <Modal open={adding} onClose={() => setAdding(false)} title="Add Customer" subtitle="Manually add a customer to your store.">
        <Field label="Name" required><input className="input" placeholder="e.g. Ravi Kumar" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Phone" required><input className="input" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        <Field label="Email"><input className="input" type="email" placeholder="e.g. ravi@gmail.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Notes (Optional)"><textarea className="input" rows={3} placeholder="Any additional notes about this customer…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
        <div className="row gap-sm end"><button className="btn btn-outline" onClick={() => setAdding(false)}>Cancel</button><button className="btn btn-primary" onClick={add}>Add Customer</button></div>
      </Modal>

      <Drawer open={!!cust} onClose={() => setOpenId(null)} title={cust?.name ?? ''}>
        {cust && <>
          <div className="row gap"><span className="avatar lg">{initials(cust.name)}</span><Badge>{cust.tag + ' Customer'}</Badge></div>
          <p className="icon-line"><Phone size={16} /> {cust.phone}</p>
          <p className="icon-line"><Mail size={16} /> {cust.email}</p>
          <p className="icon-line"><Calendar size={16} /> Customer since {cust.joined}</p>
          <div className="mini-stats"><div><b>{cust.orders}</b><small>Total Orders</small></div><div><b>{inr(cust.spent)}</b><small>Total Spent</small></div><div><b>{inr(Math.round(cust.spent / Math.max(1, cust.orders)))}</b><small>Avg. Order</small></div></div>
          <div className="tabs-line">{(['Order History', 'Reviews (3)'] as const).map((t) => <button key={t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}>{t}</button>)}</div>
          {tab === 'Order History'
            ? <>{customerOrderHistory.map((o) => <div className="hist-row" key={o.id}><div><strong>#{o.id}</strong><small className="block muted">{o.date}</small></div><b>{inr(o.amount)}</b><Badge>{o.status}</Badge></div>)}
              <button className="btn btn-outline block">View All Orders →</button></>
            : <>{[[5, 'Kaja was excellent! Fresh and tasty.', 'Sep 20, 2024'], [4, 'Very good taste and nice packaging.', 'Aug 15, 2024']].map(([r, t, d]) => (
              <div className="hist-row col" key={t as string}><Stars value={r as number} /><span>“{t}”</span><small className="muted">{d}</small></div>))}</>}
        </>}
      </Drawer>
    </>
  )
}
