import { ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { Cart } from '../types/domain'
import { formatMoney } from '../lib/currency'

type PricingBlockProps = {
  cart: Cart
  sticky?: boolean
}

export function PricingBlock({ cart, sticky = false }: PricingBlockProps) {
  const [expanded, setExpanded] = useState(false)
  const combinedServiceCharge = {
    currency: cart.pricing.serviceCharge.currency,
    amount: cart.pricing.serviceCharge.amount
      + cart.pricing.handlingFee.amount
      + cart.pricing.surcharge.amount
      + cart.pricing.extraOrderCharge.amount,
  }

  return (
    <>
      <section className={`card pricing-block pricing-block--summary ${sticky ? 'pricing-block--sticky' : ''}`}>
        <button
          type="button"
          className="pricing-block__summary-trigger"
          onClick={() => setExpanded(true)}
          data-testid="pricing-breakdown-trigger"
        >
          <div className="pricing-block__header">
            <div>
              <h3>Total Items</h3>
            </div>
            <p className="helper pricing-block__meta">
              {cart.locationLabel ? cart.locationLabel : 'Location pending'}
            </p>
          </div>
          <div className="price-line price-line--total">
            <span>Total</span>
            <span>{formatMoney(cart.pricing.total)}</span>
          </div>
        </button>
      </section>

      <div className={`pricing-sheet ${expanded ? 'pricing-sheet--open' : ''}`} aria-hidden={!expanded}>
        <button type="button" className="pricing-sheet__backdrop" onClick={() => setExpanded(false)} aria-label="Close pricing breakdown" />
        <section className="card pricing-sheet__panel">
          <button type="button" className="pricing-sheet__handle" onClick={() => setExpanded(false)} aria-label="Collapse pricing breakdown">
            <span className="pricing-sheet__grabber" />
            <span className="icon-label icon-label--end">
              <span>Pricing breakdown</span>
              <ChevronUp size={16} />
            </span>
          </button>

          <div className="pricing-block__header">
            <div>
              <p className="eyebrow">Pricing</p>
              <h3>Total amount</h3>
            </div>
            <p className="helper pricing-block__meta">
              {cart.items.length} item{cart.items.length === 1 ? '' : 's'}
            </p>
          </div>
          <div className="price-line">
            <span>Items Total</span>
            <span>{formatMoney(cart.pricing.itemsTotal)}</span>
          </div>
          <div className="price-line">
            <span>Delivery Fee</span>
            <span>{formatMoney(cart.pricing.deliveryFee)}</span>
          </div>
          <div className="price-line">
            <span>Service Charge</span>
            <span>{formatMoney(combinedServiceCharge)}</span>
          </div>
          <div className="price-line">
            <span>Transaction Fee</span>
            <span>{formatMoney(cart.pricing.transactionFee)}</span>
          </div>
          <div className="price-line">
            <span>Discount</span>
            <span>-{formatMoney(cart.pricing.discount)}</span>
          </div>
          <div className="price-line">
            <span>Subtotal</span>
            <span>{formatMoney(cart.pricing.subTotal)}</span>
          </div>
          <div className="price-line price-line--total">
            <span>Total</span>
            <span>{formatMoney(cart.pricing.total)}</span>
          </div>
        </section>
      </div>
    </>
  )
}
