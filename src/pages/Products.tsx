import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Badge, FilterBar, PageHeader, RowMenu, Select, TableFooter, Tabs, Thumb, inr } from '../components/ui'
import { categories, products, ProductStatus } from '../data/mock'

export default function Products() {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All Categories')
  const [status, setStatus] = useState('All Status')
  const [tab, setTab] = useState('All')
  const [sel, setSel] = useState<string[]>([])

  const counts = { All: 24, Active: 20, Draft: 2, 'Out of Stock': 2, Archived: 0 }
  const rows = useMemo(() => products.filter((p) =>
    (tab === 'All' || p.status === tab) &&
    (status === 'All Status' || p.status === status) &&
    (cat === 'All Categories' || p.category === cat) &&
    (p.name + p.sku).toLowerCase().includes(q.toLowerCase())), [q, cat, status, tab])

  const reset = () => { setQ(''); setCat('All Categories'); setStatus('All Status'); setTab('All') }
  const toggle = (id: string) => setSel((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  return (
    <>
      <PageHeader title="Products" subtitle="Manage your store catalog, add new products, and keep your offerings up to date."
        tagline="Good Food Brings People Together" actions={<button className="btn btn-primary"><Plus size={18} /> Add Product</button>} />
      <FilterBar search={q} onSearch={setQ} placeholder="Search products by name or SKU…" onReset={reset}>
        <Select value={cat} onChange={setCat} options={['All Categories', ...categories.map((c) => c.name)]} />
        <Select value={status} onChange={setStatus} options={['All Status', 'Active', 'Draft', 'Out of Stock', 'Archived'] as ('All Status' | ProductStatus)[]} />
      </FilterBar>
      <Tabs value={tab} onChange={setTab} tabs={Object.entries(counts).map(([key, count]) => ({ key, count }))} />
      <div className="card">
        <table className="table">
          <thead><tr>
            <th className="chk"><input type="checkbox" checked={sel.length === rows.length && rows.length > 0} onChange={(e) => setSel(e.target.checked ? rows.map((r) => r.id) : [])} /></th>
            <th>Product</th><th>Category</th><th>Price</th><th>Status</th><th>Last Updated</th><th>Actions</th>
          </tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td className="chk"><input type="checkbox" checked={sel.includes(p.id)} onChange={() => toggle(p.id)} /></td>
                <td><div className="cell-product"><Thumb emoji={p.emoji} /><div><strong>{p.name}</strong><small>SKU: {p.sku}</small></div></div></td>
                <td><Badge>{p.category}</Badge></td>
                <td>{inr(p.price)}</td>
                <td><Badge dot>{p.status}</Badge></td>
                <td className="muted">{p.updated}</td>
                <td><RowMenu /></td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7} className="empty">No products match your filters.</td></tr>}
          </tbody>
        </table>
        <TableFooter selected={sel.length} label={`Showing 1-${rows.length} of ${tab === 'All' ? 24 : rows.length}`} />
      </div>
    </>
  )
}
