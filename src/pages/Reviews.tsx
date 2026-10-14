import { useMemo, useState } from 'react'
import { AlertTriangle, Calendar, Check, Download, Package, ShieldCheck, Star, Store as StoreIcon, Tag, User } from 'lucide-react'
import { Badge, Drawer, FilterBar, PageHeader, RowMenu, Select, Stars, TableFooter, Tabs, Thumb } from '../components/ui'
import { productEmoji, reviews as seed, Review } from '../data/mock'

export default function Reviews() {
  const [list, setList] = useState<Review[]>(seed)
  const [q, setQ] = useState('')
  const [rating, setRating] = useState('All Ratings')
  const [prod, setProd] = useState('All Products')
  const [tab, setTab] = useState('All Reviews')
  const [sel, setSel] = useState<string[]>([])
  const [openId, setOpenId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const rev = list.find((r) => r.id === openId)

  const rows = useMemo(() => list.filter((r) =>
    (tab === 'All Reviews' || r.type === tab.split(' ')[0]) &&
    (rating === 'All Ratings' || r.rating === +rating[0]) &&
    (prod === 'All Products' || r.product === prod) &&
    (r.title + r.body + r.customer + r.product).toLowerCase().includes(q.toLowerCase())), [list, q, rating, prod, tab])

  const post = () => {
    if (!draft.trim() || !openId) return
    setList((l) => l.map((r) => (r.id === openId ? { ...r, reply: draft } : r)))
    setDraft('')
  }

  return (
    <>
      <PageHeader title="Reviews" subtitle="See what your customers are saying and build trust." tagline="Sweet Feedback, Stronger Tomorrows"
        actions={<button className="btn btn-primary"><Download size={16} /> Export</button>} />
      <div className="grid-3 reviews-top">
        <div className="card pad row gap-lg">
          <span className="stat-icon" style={{ background: 'var(--amber-bg)', color: 'var(--amber)' }}><Star /></span>
          <div><small>Overall Rating</small><div className="big-rating">★ 4.8</div><small className="muted">128 reviews</small></div>
          <div className="grow">{[72, 18, 7, 2, 1].map((p, i) => <div className="bar-row tight" key={i}><small>{5 - i} ★</small><div className="bar thin"><i style={{ width: `${p}%` }} /></div><small>{p}%</small></div>)}</div>
        </div>
        <div className="card pad row gap-lg"><span className="stat-icon" style={{ background: 'var(--green-bg)', color: 'var(--green)' }}><Package /></span><div><small>Product Rating</small><div className="big-rating">★ 4.7</div><small className="muted">96 product reviews</small></div></div>
        <div className="card pad row gap-lg"><span className="stat-icon" style={{ background: 'var(--pink-bg)', color: 'var(--pink)' }}><StoreIcon /></span><div><small>Business Rating</small><div className="big-rating">★ 4.8</div><small className="muted">32 store reviews</small></div></div>
      </div>
      <Tabs value={tab} onChange={setTab} tabs={[{ key: 'All Reviews', count: 128 }, { key: 'Product Reviews', count: 96 }, { key: 'Business Reviews', count: 32 }]} />
      <FilterBar search={q} onSearch={setQ} placeholder="Search reviews, customer name or product…" onReset={() => { setQ(''); setRating('All Ratings'); setProd('All Products'); setTab('All Reviews') }}>
        <Select value={rating} onChange={setRating} options={['All Ratings', '5 stars', '4 stars', '3 stars', '2 stars', '1 star']} />
        <Select value={prod} onChange={setProd} options={['All Products', ...Object.keys(productEmoji)]} />
        <Select value="All Time" onChange={() => {}} options={['All Time', 'Last 30 days']} />
      </FilterBar>
      <div className="card">
        <table className="table">
          <thead><tr><th className="chk"><input type="checkbox" onChange={(e) => setSel(e.target.checked ? rows.map((r) => r.id) : [])} /></th><th>Review</th><th>Type</th><th>Customer</th><th>Rating</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.id} className="clickable" onClick={() => { setOpenId(r.id); setDraft('') }}>
              <td className="chk" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={sel.includes(r.id)} onChange={() => setSel((x) => (x.includes(r.id) ? x.filter((i) => i !== r.id) : [...x, r.id]))} /></td>
              <td><div className="cell-product"><Thumb emoji={r.type === 'Business' ? '🏪' : productEmoji[r.product] ?? '🍬'} size={44} /><div className="review-text"><strong>{r.title}</strong><small className="clamp">{r.body}</small><small className="muted">{r.type === 'Business' ? 'Store Review' : `${r.product} • ${r.variant}`} | Order {r.order}</small></div></div></td>
              <td><Badge>{r.type}</Badge></td>
              <td><div className="cell-product"><span className="avatar sm">{r.customer.split(' ').map((p) => p[0]).join('').slice(0, 2)}</span><div><strong>{r.customer}</strong><small>{r.phone}</small></div></div></td>
              <td><Stars value={r.rating} /></td>
              <td><small>{r.date.slice(0, 12)}</small><small className="block muted">{r.date.slice(13)}</small></td>
              <td onClick={(e) => e.stopPropagation()}><RowMenu /></td>
            </tr>
          ))}</tbody>
        </table>
        <TableFooter selected={sel.length} label={`Showing 1-${rows.length} of 128 reviews`} pages={5} />
      </div>

      <Drawer open={!!rev} onClose={() => setOpenId(null)} title="Review Details">
        {rev && <>
          <div className="cell-product top"><Thumb emoji={rev.type === 'Business' ? '🏪' : productEmoji[rev.product] ?? '🍬'} size={72} /><div><strong className="lg">{rev.title}</strong><div><Stars value={rev.rating} size={18} /></div><small className="muted">{rev.type === 'Business' ? 'Store Review' : `${rev.product} • ${rev.variant}`}</small></div></div>
          <p className="quote-text">“{rev.body}”</p>
          <dl className="meta">
            <dt><User size={16} /> Customer</dt><dd><strong>{rev.customer}</strong><small>{rev.phone}</small></dd>
            <dt><Package size={16} /> Order</dt><dd><strong>{rev.order}</strong><small>{rev.date}</small></dd>
            <dt><Tag size={16} /> Type</dt><dd><Badge>{rev.type + ' Review'}</Badge></dd>
            <dt><Check size={16} /> Status</dt><dd><Badge>Published</Badge></dd>
            <dt><ShieldCheck size={16} /> Verified Purchase</dt><dd><Badge tone="green">Yes</Badge></dd>
          </dl>
          {rev.reply && <><h4>Your Reply</h4><div className="reply"><span className="avatar sm">G</span><div><strong>Ghaatu Mitai</strong><div className="bubble">{rev.reply}</div></div></div></>}
          <h4>Write a Reply</h4>
          <textarea className="input" rows={4} maxLength={500} placeholder="Thank the customer or respond to their feedback… (Max 500 characters)" value={draft} onChange={(e) => setDraft(e.target.value)} />
          <small className="muted right-text block">{draft.length} / 500</small>
          <div className="row gap-sm"><button className="btn btn-outline" onClick={() => setDraft('')}>Cancel</button><button className="btn btn-primary grow" onClick={post} disabled={!draft.trim()}>Post Reply</button></div>
          <h4>More Actions</h4>
          <p className="icon-line"><Calendar size={16} /> View Order <span className="muted">{rev.order}</span></p>
          <p className="icon-line"><Package size={16} /> View Product <span className="muted">{rev.product}</span></p>
          <p className="icon-line"><AlertTriangle size={16} /> Report Review</p>
        </>}
      </Drawer>
    </>
  )
}
