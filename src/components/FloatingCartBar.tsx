import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Cart } from '../types/domain'
import { formatMoney } from '../lib/currency'

type FloatingCartBarProps = {
  cart: Cart
}

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1)
}

export function FloatingCartBar({ cart }: FloatingCartBarProps) {
  if (cart.items.length === 0) return null

  const count = cart.items.reduce((sum, item) => sum + item.qty, 0)

  return (
    <Link to="/cart" className="floating-cart-bar" data-testid="floating-cart-bar">
      <span className="floating-cart-bar__content">
        <span className="floating-cart-bar__count">{formatQuantity(count)}</span>
        <span>
          <strong>{formatMoney(cart.total)}</strong>
          <small>{formatQuantity(count)} items in cart</small>
        </span>
      </span>
      <span className="icon-label icon-label--end">
        <span>View Cart</span>
        <ChevronRight size={15} />
      </span>
    </Link>
  )
}
