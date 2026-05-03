import type { ReactNode } from 'react'
import { History, House, ShoppingBag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

type NavItem = {
  key: string
  label: string
  icon: ReactNode
  to?: string
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Home', icon: <House size={18} />, to: '/' },
  { key: 'history', label: 'History', icon: <History size={18} />, to: '/history' },
  { key: 'orders', label: 'Cart', icon: <ShoppingBag size={18} />, to: '/cart' },
]

export function BottomNav() {
  const location = useLocation()

  const activeKey = location.pathname.startsWith('/history')
    ? 'history'
    : location.pathname.startsWith('/cart')
      ? 'orders'
      : 'home'

  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {navItems.map((item) => {
        const active = item.key === activeKey
        const className = `bottom-nav__item ${active ? 'bottom-nav__item--active' : ''}`.trim()

        return (
          <Link key={item.key} to={item.to ?? '/'} className={className}>
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
