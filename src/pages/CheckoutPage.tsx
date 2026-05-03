import { ChevronDown, ChevronUp, Mail, MapPin, Receipt, StickyNote, TicketPercent } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { PricingBlock } from '../components/PricingBlock'
import { SectionHeader } from '../components/SectionHeader'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToasts } from '../context/ToastContext'
import { useDeliveryZones } from '../hooks/useMockApi'
import { useTelegramChrome } from '../hooks/useTelegramChrome'
import { track } from '../lib/analytics'
import {
  getPaymentCallbackUrl,
  initializePaymentInBackend,
} from '../lib/backendApi'
import { formatMoney } from '../lib/currency'
import { startPaystackPayment } from '../lib/paystack'

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1)
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function CheckoutPage() {
  const {
    cart,
    checkout,
    locationId,
    locationNote,
    referralCode,
    mode,
    applyReferralCode,
    clearReferralCode,
    saveCheckoutInfo,
    setLocationId,
    setLocationNote,
    setReferralCode,
    syncing,
    setPendingCheckoutCart,
    setPendingPaymentReference,
    pendingPaymentReference,
  } = useCart()
  const { isAuthenticated, loading: authLoading, token, user } = useAuth()
  const { pushToast } = useToasts()
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const [referralMessage, setReferralMessage] = useState<string | null>(null)
  const [email, setEmail] = useState(user?.email ?? '')
  const [submitting, setSubmitting] = useState(false)
  const {
    data: zones,
    loading: zonesLoading,
    error: zonesError,
  } = useDeliveryZones()

  useEffect(() => {
    if (!user?.email) return
    setEmail((current) => current || user.email || '')
  }, [user?.email])

  const locationError = !locationId ? 'Select delivery area' : null
  const noteError = !locationNote.trim() ? 'Add delivery note for rider' : null
  const emailError = !email.trim()
    ? 'Email required for payment'
    : !isValidEmail(email)
      ? 'Enter valid email address'
      : null
  const referralHasError = Boolean(referralMessage && /not found|unable|invalid/i.test(referralMessage))
  const referralApplied = Boolean(cart.referralCode)
  const referralDirty = referralCode.trim() !== (cart.referralCode ?? '').trim()
  const paymentLockedReason = mode === 'backend' && cart.paymentLocked ? 'Payment in progress. Continue or cancel existing payment.' : null
  const blockedReason = paymentLockedReason
    ?? locationError
    ?? noteError
    ?? emailError
    ?? (mode === 'backend' && !isAuthenticated && !authLoading ? 'Authentication required before checkout' : null)

  const submit = async () => {
    if (mode === 'backend' && cart.paymentLocked) {
      if (pendingPaymentReference) {
        navigate(`/payment/${encodeURIComponent(pendingPaymentReference)}`)
        return
      }

      pushToast('Payment already initialized. Open payment page to continue or cancel.', 'error')
      return
    }

    if (submitting || syncing || blockedReason) {
      if (blockedReason) pushToast(blockedReason, 'error')
      return
    }

    if (mode === 'mock') {
      try {
        const checkedOutCart = await checkout()
        navigate(`/success/${checkedOutCart.id}`)
      } catch (error) {
        pushToast(error instanceof Error ? error.message : 'Unable to place order', 'error')
      }
      return
    }

    if (!token) {
      pushToast('Authentication required before payment', 'error')
      return
    }

    const callbackUrl = getPaymentCallbackUrl()

    setSubmitting(true)

    try {
      track('checkout_started', {
        items: cart.items.length,
        total: cart.total.amount,
        locationId: locationId || null,
      })

      await saveCheckoutInfo()
      setPendingCheckoutCart({
        ...cart,
        locationId: locationId || null,
        locationNote,
        referralCode: referralCode.trim() || null,
      })

      const paymentSession = await initializePaymentInBackend(token, {
        cartId: cart.id,
        email: email.trim(),
        callbackUrl,
      })

      if (!paymentSession.accessCode) {
        throw new Error('Payment initialize response missing Paystack access code')
      }

      setPendingPaymentReference(paymentSession.reference)

      await startPaystackPayment({
        accessCode: paymentSession.accessCode,
      })

      setSubmitting(false)
      pushToast('Payment popup opened. Complete payment to continue.', 'success')
      navigate(`/payment/${encodeURIComponent(paymentSession.reference)}`)
    } catch (error) {
      setSubmitting(false)
      pushToast(error instanceof Error ? error.message : 'Unable to initialize payment', 'error')
    }
  }

  const payButtonText = useMemo(() => {
    if (submitting) return 'Opening Payment…'
    if (mode === 'backend') return 'Pay Now'
    return syncing ? 'Placing Order…' : 'Place Order'
  }, [mode, submitting, syncing])

  useTelegramChrome({
    backTo: '/cart',
    mainButton: {
      text: payButtonText,
      onClick: () => void submit(),
      disabled: submitting || syncing || Boolean(blockedReason),
    },
  })

  if (cart.items.length === 0) return <Navigate to="/" replace />

  return (
    <main className="screen">
      <PageHeader title="Checkout" subtitle={cart.restaurantName ?? undefined} backTo="/cart" />

      <section className="card checkout-summary-card">
        <SectionHeader eyebrow="Checkout" title={mode === 'backend' ? 'Confirm details and pay' : 'Confirm delivery details'} />
        <p className="helper">Add payment email, confirm delivery details, pay.</p>
      </section>

      {cart.paymentLocked ? (
        <section className="card empty-state">
          <p>Payment already in progress.</p>
          {pendingPaymentReference ? (
            <button type="button" className="primary-cta" onClick={() => navigate(`/payment/${encodeURIComponent(pendingPaymentReference)}`)}>
              Continue Payment
            </button>
          ) : null}
        </section>
      ) : null}

      <section className="card form-card">
        <label htmlFor="checkout-email" className="field-label icon-label icon-label--start">
          <Mail size={14} />
          <span>Email for payment</span>
        </label>
        <input
          id="checkout-email"
          className={`text-input ${emailError ? 'text-input--error' : ''}`.trim()}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          inputMode="email"
          autoComplete="email"
          aria-invalid={Boolean(emailError)}
        />
        {emailError ? <p className="helper error-text">{emailError}</p> : <p className="helper">Required for payment.</p>}
      </section>

      <section className="card form-card">
        <label htmlFor="delivery-location" className="field-label icon-label icon-label--start">
          <MapPin size={14} />
          <span>Delivery Area</span>
        </label>
        <select
          id="delivery-location"
          className="text-input"
          value={locationId}
          onChange={(event) => {
            void setLocationId(event.target.value)
          }}
          data-testid="delivery-location-select"
          disabled={cart.paymentLocked}
        >
          <option value="">Select delivery area</option>
          {zones?.map((zone) => (
            <option key={zone.id} value={zone.id}>
              {zone.label}
            </option>
          ))}
        </select>
        {zonesLoading ? <p className="helper">Loading delivery zones…</p> : null}
        {zonesError ? <p className="helper error-text">{zonesError}</p> : null}
        {locationError ? <p className="helper error-text">{locationError}</p> : null}

        <div className="location-pricing-card__grid location-pricing-card__grid--compact">
          <div>
            <p className="helper">Delivery fee</p>
            <strong>{formatMoney(cart.pricing.deliveryFee)}</strong>
          </div>
          <div>
            <p className="helper">Current total</p>
            <strong>{formatMoney(cart.pricing.total)}</strong>
          </div>
        </div>
        {syncing ? <p className="helper">Updating pricing…</p> : null}
      </section>

      <section className="card form-card">
        <label htmlFor="delivery-note" className="field-label icon-label icon-label--start">
          <StickyNote size={14} />
          <span>Note for rider</span>
        </label>
        <textarea
          id="delivery-note"
          className="text-area"
          value={locationNote}
          onChange={(event) => setLocationNote(event.target.value)}
          placeholder="Add estate gate, floor, landmark, or callout to help rider locate you faster"
          data-testid="delivery-location-note"
          disabled={cart.paymentLocked}
        />
        {noteError ? <p className="helper error-text">{noteError}</p> : <p className="helper">Saved to backend as `user_info`.</p>}
      </section>

      <section className="card form-card referral-card">
        <div className="referral-card__header">
          <label htmlFor="referral-code" className="field-label icon-label icon-label--start">
            <TicketPercent size={14} />
            <span>Referral code</span>
          </label>
          <div className="referral-card__badges">
            {referralApplied ? <span className="status-pill status-pill--open">Applied</span> : null}
            {referralDirty && !referralHasError ? <span className="meta-chip referral-chip referral-chip--pending">Unsaved</span> : null}
            {referralHasError ? <span className="status-pill status-pill--closed">Invalid</span> : null}
          </div>
        </div>
        <div className="referral-row">
          <input
            id="referral-code"
            className={`text-input ${referralApplied ? 'text-input--success' : ''} ${referralHasError ? 'text-input--error' : ''}`.trim()}
            value={referralCode}
            onChange={(event) => {
              setReferralCode(event.target.value.toUpperCase())
              setReferralMessage(null)
            }}
            placeholder="Optional referral code"
            aria-invalid={referralHasError}
            disabled={cart.paymentLocked}
          />
          <button
            type="button"
            className="secondary-cta"
            disabled={syncing || cart.items.length === 0 || (!referralDirty && !referralHasError) || Boolean(cart.paymentLocked)}
            onClick={() => {
              void (async () => {
                try {
                  await applyReferralCode()
                  setReferralMessage(referralCode.trim() ? 'Referral code applied. Discount updated from backend.' : 'Referral code cleared.')
                } catch (error) {
                  setReferralMessage(error instanceof Error ? error.message : 'Unable to apply referral code')
                  pushToast(error instanceof Error ? error.message : 'Unable to apply referral code', 'error')
                }
              })()
            }}
          >
            Apply
          </button>
          <button
            type="button"
            className="secondary-cta"
            disabled={syncing || (!referralCode && !cart.referralCode) || Boolean(cart.paymentLocked)}
            onClick={() => {
              void (async () => {
                try {
                  await clearReferralCode()
                  setReferralMessage('Referral code cleared.')
                } catch (error) {
                  pushToast(error instanceof Error ? error.message : 'Unable to clear referral code', 'error')
                }
              })()
            }}
          >
            Clear
          </button>
        </div>
        {referralApplied ? (
          <div className="referral-summary">
            <p className="helper">Applied code</p>
            <strong>{cart.referralCode}</strong>
            <span className="referral-summary__discount">Discount: {formatMoney(cart.pricing.discount)}</span>
          </div>
        ) : null}
        {referralMessage ? <p className={`helper ${referralHasError ? 'error-text' : 'success-text'}`}>{referralMessage}</p> : <p className="helper">Optional. Backend applies discount once per cart.</p>}
      </section>

      <section className="card collapsible-card">
        <button type="button" className="collapsible-trigger" onClick={() => setExpanded((current) => !current)}>
          <span className="icon-label icon-label--start">
            <Receipt size={14} />
            <span>Order Summary</span>
          </span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {expanded ? (
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
        ) : null}
      </section>

      {mode === 'backend' && !isAuthenticated && !authLoading ? (
        <section className="card empty-state">
          <p>Backend checkout needs authenticated Telegram or development bearer token.</p>
        </section>
      ) : null}

      <PricingBlock cart={cart} />
    </main>
  )
}
