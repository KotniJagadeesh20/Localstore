import { ReactNode, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, Star, X } from 'lucide-react'

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

const tone: Record<string, string> = {
  Active: 'green', 'In Stock': 'green', Paid: 'green', Delivered: 'green', Published: 'green', Returning: 'green', Shipped: 'teal',
  Draft: 'amber', 'Low Stock': 'amber', Pending: 'amber', New: 'blue', Confirmed: 'blue', Packed: 'blue',
  Processing: 'purple', 'Out of Stock': 'red', Cancelled: 'red', Archived: 'gray', Inactive: 'gray',
  Sweets: 'pink', Snacks: 'amber', Pickles: 'green', Product: 'green', Business: 'blue', 'Special Items': 'pink', 'Dry Snacks': 'amber', 'Festival Packs': 'pink',
}
export function Badge({ children, dot, tone: t }: { children: string; dot?: boolean; tone?: string }) {
  return <span className={`badge ${t ?? tone[children] ?? 'gray'}`}>{dot && <i />}{children}</span>
}

export function Thumb({ emoji, size = 40 }: { emoji: string; size?: number }) {
  return <span className="thumb" style={{ width: size, height: size, fontSize: size * 0.55 }}>{emoji}</span>
}

export function PageHeader({ title, subtitle, tagline, actions }: { title: string; subtitle: string; tagline?: string; actions?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {tagline && <div className="tagline">{tagline}</div>}
      <div className="actions">{actions}</div>
    </div>
  )
}

export function Tabs({ tabs, value, onChange }: { tabs: { key: string; count?: number }[]; value: string; onChange: (k: string) => void }) {
  return (
    <div className="chips">
      {tabs.map((t) => (
        <button key={t.key} className={'chip' + (value === t.key ? ' on' : '')} onClick={() => onChange(t.key)}>
          {t.key} {t.count !== undefined && <span>{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export function FilterBar({ search, onSearch, placeholder, children, onReset }: { search: string; onSearch: (v: string) => void; placeholder: string; children?: ReactNode; onReset: () => void }) {
  return (
    <div className="filters card">
      <label className="search grow">
        <Search size={18} />
        <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder={placeholder} />
      </label>
      {children}
      <button className="btn btn-outline" onClick={onReset}>Reset</button>
    </div>
  )
}

export function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => <option key={o}>{o}</option>)}
    </select>
  )
}

export function Pagination({ label, pages = 3 }: { label: string; pages?: number }) {
  return (
    <div className="pager">
      <span className="muted">{label}</span>
      <div className="pages">
        <button className="page"><ChevronLeft size={16} /></button>
        {Array.from({ length: pages }, (_, i) => <button key={i} className={'page' + (i === 0 ? ' on' : '')}>{i + 1}</button>)}
        <button className="page"><ChevronRight size={16} /></button>
      </div>
    </div>
  )
}

export function TableFooter({ selected, label, pages }: { selected: number; label: string; pages?: number }) {
  return (
    <div className="table-footer">
      <span>{selected} selected</span>
      <select className="select" disabled={!selected}><option>Bulk Actions</option><option>Delete</option><option>Archive</option></select>
      <div className="spacer" />
      <Pagination label={label} pages={pages} />
    </div>
  )
}

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={size} fill={i <= Math.round(value) ? 'currentColor' : 'none'} className={i <= Math.round(value) ? '' : 'off'} />)}
    </span>
  )
}

export function Drawer({ open, title, subtitle, onClose, children, footer }: { open: boolean; title: string; subtitle?: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  useEscape(open, onClose)
  if (!open) return null
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={title}>
        <div className="drawer-head">
          <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </aside>
    </>
  )
}

export function Modal({ open, title, subtitle, onClose, children }: { open: boolean; title: string; subtitle?: string; onClose: () => void; children: ReactNode }) {
  useEscape(open, onClose)
  if (!open) return null
  return (
    <div className="overlay center" onClick={onClose}>
      <div className="modal" role="dialog" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function useEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [open, onClose])
}

export function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}{required && <b> *</b>}</span>
      {children}
      {hint && <small className="muted">{hint}</small>}
    </label>
  )
}

export function Radio({ checked, onChange, label, hint }: { checked: boolean; onChange: () => void; label: string; hint?: string }) {
  return (
    <label className="radio">
      <input type="radio" checked={checked} onChange={onChange} />
      <span className="radio-dot" />
      <span><strong>{label}</strong>{hint && <small className="muted">{hint}</small>}</span>
    </label>
  )
}

export function RowMenu({ items }: { items?: string[] }) {
  return <button className="icon-btn boxed" aria-label="Row actions" title={items?.join(' / ')}>⋯</button>
}

export function StatCard({ icon, tint, label, value, sub, tone: t }: { icon: ReactNode; tint: string; label: string; value: ReactNode; sub: string; tone?: string }) {
  return (
    <div className={'card stat ' + (t ?? '')}>
      <span className="stat-icon" style={{ background: `var(--${tint}-bg)`, color: `var(--${tint})` }}>{icon}</span>
      <div><small>{label}</small><div className="stat-value">{value}</div><small className="muted">{sub}</small></div>
    </div>
  )
}
