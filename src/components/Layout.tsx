import { NavLink, Outlet } from 'react-router-dom'
import { Bell, ChevronDown, ClipboardList, CreditCard, Headphones, Home, Leaf, Package, Search, Settings, Star, Store, Tag, Users, Box, ArrowRight } from 'lucide-react'

const nav = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/inventory', label: 'Inventory', icon: Box },
  { to: '/orders', label: 'Orders', icon: ClipboardList },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/reviews', label: 'Reviews', icon: Star },
  { to: '/store', label: 'Store', icon: Store },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Layout() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <Leaf size={34} color="var(--green)" />
          <div>
            <div className="brand-name">LocalStore</div>
            <div className="brand-tag">Small Businesses. Bigger Dreams.</div>
          </div>
        </div>
        <nav>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
              <Icon size={20} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="side-spacer" />
        <div className="side-card grow">
          <strong>Grow Your Business Online</strong>
          <p>Simple tools for big opportunities.</p>
          <NavLink to="/store" className="btn btn-outline block">View Store <ArrowRight size={14} /></NavLink>
        </div>
        <div className="side-card help">
          <div className="row"><Headphones size={22} /><div><strong>Need help?</strong><p>We're here for you.</p></div></div>
          <button className="btn btn-outline block">Contact Support</button>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <label className="search">
            <Search size={18} />
            <input placeholder="Search anything…" />
          </label>
          <div className="spacer" />
          <button className="icon-btn bell" aria-label="Notifications"><Bell size={20} /><span className="dot">3</span></button>
          <div className="profile">
            <div className="avatar">G</div>
            <div><strong>Ghaatu Mitai</strong><small>Merchant</small></div>
            <ChevronDown size={16} />
          </div>
        </header>
        <main className="content"><Outlet /></main>
      </div>
    </div>
  )
}
