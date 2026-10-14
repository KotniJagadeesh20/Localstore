import { useMemo, useState } from 'react'
import { GripVertical, Plus, Upload } from 'lucide-react'
import { Badge, Drawer, Field, FilterBar, PageHeader, Pagination, Radio, RowMenu, Select, Thumb } from '../components/ui'
import { categories as seed, Category } from '../data/mock'

export default function Categories() {
  const [list, setList] = useState<Category[]>(seed)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('All Status')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', status: 'Active' as 'Active' | 'Archived', order: 1 })

  const rows = useMemo(() => list.filter((c) => (status === 'All Status' || c.status === status) && c.name.toLowerCase().includes(q.toLowerCase())), [list, q, status])

  const create = () => {
    if (!form.name.trim()) return
    setList((l) => [...l, { id: String(Date.now()), name: form.name, description: form.description, products: 0, status: form.status, updated: 'Today', emoji: '🍬' }])
    setForm({ name: '', description: '', status: 'Active', order: list.length + 2 })
    setOpen(false)
  }

  return (
    <>
      <PageHeader title="Categories" subtitle="Organize your products into simple categories and make it easier for your customers to browse."
        tagline="Organized Products, Happier Customers" />
      <FilterBar search={q} onSearch={setQ} placeholder="Search categories…" onReset={() => { setQ(''); setStatus('All Status') }}>
        <Select value={status} onChange={setStatus} options={['All Status', 'Active', 'Draft', 'Archived']} />
        <button className="btn btn-primary" onClick={() => setOpen(true)}><Plus size={18} /> Add Category</button>
      </FilterBar>
      <div className="card">
        <table className="table">
          <thead><tr><th className="chk" /><th>Category</th><th>Description</th><th>Products</th><th>Status</th><th>Last Updated</th><th>Actions</th></tr></thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.id}>
                <td className="chk"><GripVertical size={18} className="muted" /></td>
                <td><div className="cell-product"><Thumb emoji={c.emoji} size={48} /><strong>{c.name}</strong></div></td>
                <td className="muted desc">{c.description}</td>
                <td>{c.products}</td>
                <td><Badge dot>{c.status}</Badge></td>
                <td className="muted">{c.updated}</td>
                <td><RowMenu /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="table-footer"><span className="muted">Showing 1–{rows.length} of {rows.length} categories</span><div className="spacer" /><Pagination label="" pages={1} /></div>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} title="Add Category" subtitle="Create a new category for your products."
        footer={<><button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button><button className="btn btn-primary grow" onClick={create}>Create Category</button></>}>
        <Field label="Category Name" required><input className="input" placeholder="e.g. Sweets" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
        <Field label="Description"><textarea className="input" rows={3} placeholder="Tell customers about this category…" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
        <Field label="Category Image">
          <div className="dropzone"><Upload size={26} /><span>Upload an image</span><small className="muted">PNG, JPG (max 2MB)</small><label className="btn btn-soft">Choose File<input type="file" accept="image/png,image/jpeg" hidden /></label></div>
        </Field>
        <div className="field"><span>Status</span>
          <Radio checked={form.status === 'Active'} onChange={() => setForm({ ...form, status: 'Active' })} label="Active" hint="Visible on your store" />
          <Radio checked={form.status === 'Archived'} onChange={() => setForm({ ...form, status: 'Archived' })} label="Archived" hint="Hidden from your store" />
        </div>
        <Field label="Display Order" hint="Lower numbers appear first on your store."><input className="input" type="number" min={1} value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} /></Field>
      </Drawer>
    </>
  )
}
