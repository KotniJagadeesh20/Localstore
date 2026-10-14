import { useMemo, useState } from 'react'
import { AlertTriangle, Boxes, CheckCircle2, XCircle } from 'lucide-react'
import { Badge, Drawer, Field, FilterBar, PageHeader, Radio, RowMenu, Select, StatCard, TableFooter, Tabs, Thumb } from '../components/ui'
import { categories, stockHistory, stockStatus, variants as seed, Variant } from '../data/mock'

type Mode = 'add' | 'remove' | 'set'

export default function Inventory() {
  const [list, setList] = useState<Variant[]>(seed)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All Categories')
  const [status, setStatus] = useState('All Status')
  const [tab, setTab] = useState('All')
  const [sel, setSel] = useState<string[]>([])
  const [active, setActive] = useState<Variant | null>(null)
  const [mode, setMode] = useState<Mode>('add')
  const [qty, setQty] = useState(10)
  const [reason, setReason] = useState('')

  const rows = useMemo(() => list.filter((v) => {
    const s = stockStatus(v)
    return (tab === 'All' || s === tab) && (status === 'All Status' || s === status) &&
      (cat === 'All Categories' || v.category === cat) && (v.product + v.sku).toLowerCase().includes(q.toLowerCase())
  }), [list, q, cat, status, tab])

  const next = active ? Math.max(0, mode === 'add' ? active.stock + qty : mode === 'remove' ? active.stock - qty : qty) : 0
  const open = (v: Variant) => { setActive(v); setMode('add'); setQty(10); setReason('') }
  const save = () => {
    if (!active || !reason.trim()) return
    setList((l) => l.map((v) => (v.id === active.id ? { ...v, stock: next, updated: 'Today' } : v)))
    setActive(null)
  }

  return (
    <>
      <PageHeader title="Inventory" subtitle="Track stock levels, manage variants and never run out of your bestsellers." tagline="Well Stocked for Sweeter Tomorrows" />
      <div className="grid-4">
        <StatCard icon={<Boxes />} tint="green" label="Total Variants" value="46" sub="Across 28 products" />
        <StatCard icon={<CheckCircle2 />} tint="green" label="In Stock" value="34" sub="74% of variants" />
        <StatCard icon={<AlertTriangle />} tint="amber" label="Low Stock" value="8" sub="Need attention" />
        <StatCard icon={<XCircle />} tint="red" label="Out of Stock" value="4" sub="Restock soon" tone="tint-red" />
      </div>
      <FilterBar search={q} onSearch={setQ} placeholder="Search products or SKU…" onReset={() => { setQ(''); setCat('All Categories'); setStatus('All Status'); setTab('All') }}>
        <Select value={cat} onChange={setCat} options={['All Categories', ...categories.map((c) => c.name)]} />
        <Select value={status} onChange={setStatus} options={['All Status', 'In Stock', 'Low Stock', 'Out of Stock']} />
      </FilterBar>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'All', count: 46 }, { key: 'In Stock', count: 34 }, { key: 'Low Stock', count: 8 }, { key: 'Out of Stock', count: 4 }]} />
      <div className="card">
        <table className="table">
          <thead><tr><th className="chk"><input type="checkbox" onChange={(e) => setSel(e.target.checked ? rows.map((r) => r.id) : [])} /></th><th>Product & Variant</th><th>SKU</th><th>Category</th><th>Stock</th><th>Threshold</th><th>Status</th><th>Last Updated</th><th>Actions</th></tr></thead>
          <tbody>{rows.map((v) => {
            const s = stockStatus(v)
            return (
              <tr key={v.id} className="clickable" onClick={() => open(v)}>
                <td className="chk" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.includes(v.id)} onChange={() => setSel((x) => (x.includes(v.id) ? x.filter((i) => i !== v.id) : [...x, v.id]))} /></td>
                <td><div className="cell-product"><Thumb emoji={v.emoji} /><div><strong>{v.product}</strong><small>{v.variant}</small></div></div></td>
                <td className="muted">{v.sku}</td>
                <td><Badge>{v.category}</Badge></td>
                <td style={{ color: s === 'In Stock' ? undefined : 'var(--red)', fontWeight: 600 }}>{v.stock}</td>
                <td className="muted">{v.threshold}</td>
                <td><Badge dot>{s}</Badge></td>
                <td className="muted">{v.updated}</td>
                <td onClick={(e) => e.stopPropagation()}><RowMenu /></td>
              </tr>
            )
          })}</tbody>
        </table>
        <TableFooter selected={sel.length} label={`Showing 1-${rows.length} of 46`} pages={5} />
      </div>

      <Drawer open={!!active} onClose={() => setActive(null)} title="Adjust Inventory" subtitle="Update stock for a product variant."
        footer={<><button className="btn btn-outline" onClick={() => setActive(null)}>Cancel</button><button className="btn btn-primary grow" onClick={save} disabled={!reason.trim()}>Update Stock</button></>}>
        {active && <>
          <div className="cell-product"><Thumb emoji={active.emoji} size={56} /><div><strong>{active.product}</strong><small>{active.category}</small></div></div>
          <Field label="Variant" required><select className="select full" value={active.id} onChange={(e) => open(list.find((v) => v.id === e.target.value)!)}>
            {list.filter((v) => v.product === active.product).map((v) => <option key={v.id} value={v.id}>{v.variant} ({v.sku})</option>)}
          </select></Field>
          <Field label="Current Stock"><div className="input readonly">{active.stock}{stockStatus(active) !== 'In Stock' && <Badge>{stockStatus(active)}</Badge>}</div></Field>
          <div className="field"><span>Adjustment Type</span>
            <Radio checked={mode === 'add'} onChange={() => setMode('add')} label="Add stock" />
            <Radio checked={mode === 'remove'} onChange={() => setMode('remove')} label="Remove stock" />
            <Radio checked={mode === 'set'} onChange={() => setMode('set')} label="Set stock" />
          </div>
          <Field label="Quantity" required><input className="input" type="number" min={0} value={qty} onChange={(e) => setQty(Math.max(0, +e.target.value))} /></Field>
          <Field label="Reason" required><textarea className="input" rows={3} placeholder="e.g. New stock received from supplier" value={reason} onChange={(e) => setReason(e.target.value)} /></Field>
          <div className="result"><small>New Stock</small><div><b>{next}</b> <span>({next === 0 ? 'Out of Stock' : next <= active.threshold ? 'Low Stock' : 'In Stock'})</span></div></div>
          <div className="card-head" style={{ marginTop: 24 }}><h4>Recent History</h4><a className="link">View All ›</a></div>
          {stockHistory.map((h) => (
            <div className="history" key={h.date}><small className="muted">{h.date}</small><Badge tone={h.delta > 0 ? 'green' : 'red'}>{(h.delta > 0 ? '+' : '') + h.delta}</Badge><small>{h.note}</small></div>
          ))}
        </>}
      </Drawer>
    </>
  )
}
