import { CheckCircle2, MapPin } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PricingBlock } from '../components/PricingBlock'
import { SectionHeader } from '../components/SectionHeader'
import { useCart } from '../context/CartContext'
import { useTelegramChrome } from '../hooks/useTelegramChrome'
import { formatMoney } from '../lib/currency'

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1)
}

export function SuccessPage() {
  const navigate = useNavigate()
  const { lastCheckoutCart } = useCart()
  const cart = lastCheckoutCart

  useTelegramChrome({
    backTo: '/',
    mainButton: cart
      ? {
          text: 'Back to Home',
          onClick: () => {
            navigate('/')
          },
        }
      : null,
  })

  if (!cart) return <Navigate to="/" replace />

  return (
    <main className="screen">
      <PageHeader title="Order Placed" subtitle="Awaiting restaurant approval" backTo="/" />

      <section className="card success-card" data-testid="success-screen">
        <div className="success-icon"><CheckCircle2 size={20} /></div>
        <h2>Your order has been placed and is awaiting restaurant approval</h2>
        {cart.locationLabel ? (
          <p className="helper icon-label icon-label--start">
            <MapPin size={13} />
            <span>Delivery to: {cart.locationLabel}</span>
          </p>
        ) : null}
        {cart.locationNote ? <p className="helper">Rider note: {cart.locationNote}</p> : null}
      </section>

      <section className="card collapsible-card">
        <SectionHeader eyebrow="Receipt" title="Order Summary" />
        <div className="list-stack condensed-stack">
          {cart.dishes.map((dish) => (
            <div key={dish.id} className="list-stack condensed-stack">
              <p className="eyebrow">{dish.label}</p>
              {dish.items.map((item) => (
                <div key={`${dish.id}-${item.itemId}`} className="summary-row">
                  <span>
                    {item.name} × {formatQuantity(item.qty)}
                  </span>
                  <span>{formatMoney(item.lineTotal)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <PricingBlock cart={cart} />
    </main>
  )
}
