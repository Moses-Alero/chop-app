import { ArrowRight, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PricingBlock } from '../components/PricingBlock'
import { QuantityStepper } from '../components/QuantityStepper'
import { useCart } from '../context/CartContext'
import { useToasts } from '../context/ToastContext'
import { useTelegramChrome } from '../hooks/useTelegramChrome'
import { track } from '../lib/analytics'
import { formatMoney } from '../lib/currency'
import { useTelegram } from '../lib/telegram'

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1)
}

function CartLineItem({
  item,
  restaurantId,
  setQuantity,
  stepSize,
  disabled,
}: {
  item: (ReturnType<typeof useCart>['cart']['items'])[number]
  restaurantId: string | null
  setQuantity: ReturnType<typeof useCart>['setQuantity']
  stepSize: number
  disabled?: boolean
}) {
  const { pushToast } = useToasts()
  const { haptic } = useTelegram()

  return (
    <article key={item.itemId} className="card cart-item" data-testid={`cart-item-${item.itemId}`}>
      <div>
        <h2>{item.name}</h2>
        <p>
          {formatQuantity(item.qty)} × {formatMoney(item.unitPrice)}
        </p>
      </div>
      <QuantityStepper
        compact
        quantity={item.qty}
        disabled={disabled}
        onDecrease={() => {
          void setQuantity(restaurantId ?? '', item.itemId, Math.max(0, item.qty - stepSize), item.dishId)
          haptic('light')
          if (item.qty - 1 <= 0) pushToast('Item removed', 'success')
        }}
        onIncrease={() => {
          void setQuantity(restaurantId ?? '', item.itemId, item.qty + stepSize, item.dishId)
          haptic('medium')
        }}
      />
    </article>
  )
}

export function CartPage() {
  const { cart, clearCart, getStepSize, pendingPaymentReference, removeDish, setQuantity, syncing } = useCart()
  const paymentLocked = Boolean(cart.paymentLocked)
  const { pushToast } = useToasts()
  const navigate = useNavigate()

  useTelegramChrome({
    backTo: cart.restaurantId ? `/restaurants/${cart.restaurantId}` : '/',
    mainButton: null,
  })

  return (
    <main className="screen">
      <PageHeader title="Cart" subtitle={cart.restaurantName ?? undefined} backTo={cart.restaurantId ? `/restaurants/${cart.restaurantId}` : '/'} />

      {paymentLocked ? (
        <section className="card empty-state">
          <p>Payment in progress for this cart.</p>
          <p className="helper">Continue payment or cancel it before editing items. Clear cart will cancel pending payment first.</p>
          {pendingPaymentReference ? (
            <button type="button" className="primary-cta" onClick={() => navigate(`/payment/${encodeURIComponent(pendingPaymentReference)}`)}>
              <span className="icon-label icon-label--end">
                <span>Continue Payment</span>
                <ArrowRight size={14} />
              </span>
            </button>
          ) : null}
        </section>
      ) : null}

      {cart.items.length === 0 ? (
        <section className="empty-cart-state" data-testid="empty-cart-state">
          <div className="empty-cart-state__icon">
            <Trash2 size={56} strokeWidth={1.75} />
          </div>
          <h2>Empty Cart</h2>
        </section>
      ) : (
        <>
          <section className="card location-pricing-card">
            <div className="location-pricing-card__header">
              <div>
                <p className="eyebrow">Delivery pricing</p>
                <h2>{cart.locationLabel ? `Deliver to ${cart.locationLabel}` : 'Select delivery area at checkout'}</h2>
              </div>
              <button
                type="button"
                className="secondary-cta"
                disabled={syncing}
                onClick={() => {
                  void (async () => {
                    const confirmed = window.confirm('Clear whole cart? This cannot be undone.')
                    if (!confirmed) return
                    try {
                      await clearCart()
                      pushToast('Clearing cart…', 'success')
                    } catch (error) {
                      pushToast(error instanceof Error ? error.message : 'Unable to clear cart', 'error')
                    }
                  })()
                }}
              >
                Clear Cart
              </button>
            </div>
            <div className="location-pricing-card__grid">
              <div>
                <p className="helper">Delivery fee</p>
                <strong>{formatMoney(cart.pricing.deliveryFee)}</strong>
              </div>
              <div>
                <p className="helper">Current total</p>
                <strong>{formatMoney(cart.pricing.total)}</strong>
              </div>
            </div>
            <p className="helper">Backend recalculates delivery from current cart location and restaurants in cart.</p>
          </section>

          <section className="list-stack screen-section">
            {cart.dishes.map((dish) => (
              <section key={dish.id} className="card dish-group-card">
                <div className="dish-group-card__header">
                  <div className="dish-group-card__title">
                    <h2>{dish.label}</h2>
                    {dish.restaurantName ? <p className="helper">{dish.restaurantName}</p> : null}
                  </div>
                  <div className="icon-label icon-label--end">
                    <span>{formatMoney(dish.subtotal)}</span>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Remove ${dish.label}`}
                      data-testid={`remove-dish-${dish.id}`}
                      disabled={paymentLocked}
                      onClick={() => void removeDish(dish.id)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                <div className="list-stack condensed-stack">
                  {dish.items.map((item) => (
                    <CartLineItem
                      key={`${dish.id}-${item.itemId}`}
                      item={item}
                      restaurantId={dish.restaurantId ?? cart.restaurantId}
                      setQuantity={setQuantity}
                      stepSize={getStepSize(dish.restaurantId ?? cart.restaurantId ?? '')}
                      disabled={paymentLocked}
                    />
                  ))}
                </div>
              </section>
            ))}
          </section>

          <PricingBlock cart={cart} sticky />

          <button
            type="button"
            className="primary-cta cart-checkout-bar"
            onClick={() => {
              track('cart_opened', { items: cart.items.length })
              if (paymentLocked && pendingPaymentReference) {
                navigate(`/payment/${encodeURIComponent(pendingPaymentReference)}`)
                return
              }
              navigate('/checkout')
            }}
            data-testid="cart-checkout-button"
          >
            {paymentLocked ? 'Continue Payment' : 'Proceed to Checkout'}
          </button>
        </>
      )}
    </main>
  )
}
