import { useState } from 'react'
import { Copy, Image, Link2, Monitor, Palette, Settings, Smartphone, Trash2, Upload, FileText, ExternalLink, Share2, Pencil, CheckCircle2 } from 'lucide-react'
import { PageHeader, Field, Stars } from '../components/ui'

const tabs = [
  { k: 'General', i: Settings }, { k: 'Branding', i: Image }, { k: 'Appearance', i: Palette }, { k: 'Content', i: FileText }, { k: 'Domain & Publishing', i: Link2 },
]

export default function Store() {
  const [tab, setTab] = useState('General')
  const [device, setDevice] = useState<'Desktop' | 'Mobile'>('Desktop')
  const [published, setPublished] = useState(true)
  const [copied, setCopied] = useState(false)
  const [f, setF] = useState({
    name: 'Ghaatu Mitai',
    short: 'Authentic homemade sweets and snacks crafted with traditional recipes and high quality ingredients.',
    about: 'Ghaatu Mitai brings the authentic taste of traditional Telugu sweets and snacks to your doorstep. We use high quality ingredients and time-tested recipes to deliver fresh and delightful homemade treats.',
    phone: '+91 98765 43210', email: 'contact@ghaatumitai.com', address: '12-4-21, Main Road\nHyderabad, Telangana - 500001\nIndia',
  })
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value })
  const url = 'https://localstore.in/ghaatu-mitai'
  const copy = () => { navigator.clipboard?.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  const Count = ({ v, max }: { v: string; max: number }) => <small className="muted right-text block">{v.length} / {max}</small>

  return (
    <div className="store-layout">
      <div>
        <PageHeader title="Store" subtitle="Manage your storefront, branding and appearance."
          actions={<><a className="btn btn-primary" href={url} target="_blank" rel="noreferrer">View Store <ExternalLink size={14} /></a><button className="icon-btn boxed">⋯</button></>} />
        <div className="card tabs-card">
          {tabs.map(({ k, i: Icon }) => <button key={k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}><Icon size={16} /> {k}</button>)}
        </div>
        {tab !== 'General'
          ? <div className="card pad"><h3>{tab}</h3><p className="muted">Settings for {tab.toLowerCase()} will appear here.</p></div>
          : <div className="grid-2">
            <div className="col">
              <div className="card pad">
                <h3>Basic Information</h3><small className="muted">This information will be shown on your storefront.</small>
                <Field label="Store Name" required><input className="input" value={f.name} onChange={set('name')} /></Field>
                <Field label="Short Description" required><textarea className="input" rows={2} maxLength={200} value={f.short} onChange={set('short')} /></Field><Count v={f.short} max={200} />
                <Field label="About Your Store"><textarea className="input" rows={4} maxLength={500} value={f.about} onChange={set('about')} /></Field><Count v={f.about} max={500} />
              </div>
              <div className="card pad">
                <h3>Contact Information</h3><small className="muted">Customers can use this to reach you.</small>
                <Field label="Phone Number" required><input className="input" value={f.phone} onChange={set('phone')} /></Field>
                <Field label="Email Address"><input className="input" type="email" value={f.email} onChange={set('email')} /></Field>
                <Field label="Business Address"><textarea className="input" rows={3} maxLength={300} value={f.address} onChange={set('address')} /></Field><Count v={f.address} max={300} />
              </div>
            </div>
            <div className="col">
              <div className="card pad">
                <h3>Store Logo & Banner</h3><small className="muted">Upload your store logo and banner.</small>
                <div className="field"><span>Store Logo <b>*</b></span>
                  <div className="row gap">
                    <div className="logo">🏯</div>
                    <div className="col tight">
                      <label className="btn btn-outline"><Upload size={14} /> Change Logo<input type="file" accept="image/*" hidden /></label>
                      <button className="btn btn-outline danger"><Trash2 size={14} /> Remove</button>
                    </div>
                  </div>
                  <small className="muted">Recommended: 512 × 512px (PNG, JPG)</small>
                </div>
                <div className="field"><span>Banner Image</span>
                  <div className="banner">Traditional Sweets & Snacks Made with Love</div>
                  <div className="row gap-sm"><label className="btn btn-outline"><Upload size={14} /> Change Banner<input type="file" accept="image/*" hidden /></label><button className="btn btn-outline danger"><Trash2 size={14} /> Remove</button></div>
                  <small className="muted">Recommended: 1200 × 400px (PNG, JPG)</small>
                </div>
              </div>
              <div className="card pad">
                <h3>Store Status</h3><small className="muted">Control the visibility of your storefront.</small>
                <div className="row gap toggle-row">
                  <button role="switch" aria-checked={published} className={'switch' + (published ? ' on' : '')} onClick={() => setPublished(!published)}><i /></button>
                  <div><strong>{published ? 'Published' : 'Unpublished'}</strong><small className="block muted">{published ? 'Your store is live and accessible to customers.' : 'Your store is hidden from customers.'}</small></div>
                </div>
                <Field label="Store URL"><div className="input url"><span>{url}</span><button className="icon-btn" onClick={copy} aria-label="Copy URL">{copied ? <CheckCircle2 size={16} color="var(--green)" /> : <Copy size={16} />}</button></div></Field>
                {published && <div className="live"><CheckCircle2 size={18} color="var(--green)" /><div><strong>Your store is live!</strong><small className="block muted">Customers can now visit your store and place orders.</small></div></div>}
              </div>
            </div>
          </div>}
      </div>

      <aside className="card pad preview">
        <div className="card-head">
          <div><h3>Store Preview</h3><small className="muted">See how your store looks to customers.</small></div>
          <div className="seg">
            <button className={device === 'Desktop' ? 'on' : ''} onClick={() => setDevice('Desktop')}><Monitor size={14} /> Desktop</button>
            <button className={device === 'Mobile' ? 'on' : ''} onClick={() => setDevice('Mobile')}><Smartphone size={14} /></button>
          </div>
        </div>
        <div className={'frame ' + device.toLowerCase()}>
          <div className="mini-nav"><b>{f.name}</b><span>Home</span><span>Sweets</span><span>Snacks</span><span>About</span></div>
          <div className="mini-hero"><h4>Authentic Homemade Sweets & Snacks</h4><small>Traditional recipes, pure ingredients and the true taste of home.</small><button className="btn btn-primary btn-sm">Shop Now →</button></div>
          <h5>Our Products</h5>
          <div className="mini-products">{[['🍘', 'Kaja', 300], ['🍪', 'Ariselu', 150], ['🌀', 'Murukulu', 150], ['🟠', 'Boondi Laddu', 250]].map(([e, n, p]) => (
            <div key={n as string}><div className="mini-img">{e}</div><small>{n}</small><Stars value={4.5} size={8} /><b>₹{p}</b></div>))}</div>
        </div>
        <h4>Quick Actions</h4>
        <div className="grid-2 tight">
          <a className="btn btn-outline" href={url} target="_blank" rel="noreferrer"><ExternalLink size={14} /> View Store</a>
          <button className="btn btn-outline" onClick={copy}><Share2 size={14} /> Share Store</button>
          <button className="btn btn-outline" onClick={() => setTab('Content')}><Pencil size={14} /> Edit Content</button>
          <button className="btn btn-outline" onClick={() => setTab('Appearance')}><Palette size={14} /> Customize Theme</button>
        </div>
      </aside>
    </div>
  )
}
