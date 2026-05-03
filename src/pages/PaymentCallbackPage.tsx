import { LoaderCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useTelegramChrome } from '../hooks/useTelegramChrome'
import { fetchPaymentStatusFromBackend, verifyPaymentInBackend } from '../lib/backendApi'
import type { PaymentRecord } from '../types/domain'

type VerifyState = 'verifying' | 'success' | 'failed' | 'pending'

function resolveReference(searchParams: URLSearchParams): string | null {
  return searchParams.get('reference')
    ?? searchParams.get('trxref')
    ?? searchParams.get('trans')
    ?? searchParams.get('transaction')
}

export function PaymentCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { token, isAuthenticated, loading: authLoading } = useAuth()
  const {
    pendingCheckoutCart,
    setPendingCheckoutCart,
    setPendingPaymentReference,
    setLastCheckoutCart,
    refreshCart,
  } = useCart()
  const [state, setState] = useState<VerifyState>('verifying')
  const [message, setMessage] = useState('Verifying payment with backend…')
  const [payment, setPayment] = useState<PaymentRecord | null>(null)

  const reference = useMemo(() => resolveReference(searchParams), [searchParams])

  useTelegramChrome({ backTo: '/checkout', mainButton: null })

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated || !token) {
      setState('failed')
      setMessage('Authentication required before payment verification.')
      return
    }

    if (!reference) {
      setState('failed')
      setMessage('Missing payment reference from callback.')
      return
    }

    let cancelled = false

    const run = async () => {
      setState('verifying')
      setMessage('Verifying payment with backend…')

      try {
        const verifiedPayment = await verifyPaymentInBackend(token, reference)
        if (cancelled) return

        setPayment(verifiedPayment)

        if (verifiedPayment.status === 'success') {
          setState('success')
          setMessage('Payment verified. Loading order confirmation…')
          if (pendingCheckoutCart) setLastCheckoutCart(pendingCheckoutCart)
          setPendingCheckoutCart(null)
          setPendingPaymentReference(null)
          await refreshCart().catch(() => undefined)
          navigate(`/success/${verifiedPayment.cartId}`, { replace: true })
          return
        }

        if (verifiedPayment.status === 'pending' || verifiedPayment.status === 'initialized') {
          setState('pending')
          setMessage('Payment still pending. You can retry verification shortly.')
          return
        }

        setState('failed')
        setMessage('Payment was not completed. Your cart is available for edits again.')
        setPendingCheckoutCart(null)
        setPendingPaymentReference(null)
        await refreshCart().catch(() => undefined)
      } catch (error) {
        if (cancelled) return

        try {
          const paymentStatus = await fetchPaymentStatusFromBackend(token, reference)
          if (cancelled) return
          setPayment(paymentStatus)

          if (paymentStatus.status === 'success') {
            if (pendingCheckoutCart) setLastCheckoutCart(pendingCheckoutCart)
            setPendingCheckoutCart(null)
            setPendingPaymentReference(null)
            await refreshCart().catch(() => undefined)
            navigate(`/success/${paymentStatus.cartId}`, { replace: true })
            return
          }

          if (paymentStatus.status === 'pending' || paymentStatus.status === 'initialized') {
            setState('pending')
            setMessage('Payment still pending. Wait a moment, then verify again.')
            return
          }

          setState('failed')
          setMessage(error instanceof Error ? error.message : 'Unable to verify payment.')
        } catch {
          if (cancelled) return
          setState('failed')
          setMessage(error instanceof Error ? error.message : 'Unable to verify payment.')
        }
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [authLoading, isAuthenticated, navigate, pendingCheckoutCart, reference, refreshCart, setLastCheckoutCart, setPendingCheckoutCart, setPendingPaymentReference, token])

  return (
    <main className="screen">
      <PageHeader title="Payment" subtitle="Verification" backTo="/checkout" />

      <section className="card empty-state" data-testid="payment-callback-screen">
        {state === 'verifying' ? (
          <div className="success-icon"><LoaderCircle size={20} className="spin" /></div>
        ) : null}
        <h2>
          {state === 'success'
            ? 'Payment verified'
            : state === 'pending'
              ? 'Payment pending'
              : state === 'failed'
                ? 'Payment not completed'
                : 'Verifying payment'}
        </h2>
        <p className="helper">{message}</p>
        {reference ? <p className="helper">Reference: {reference}</p> : null}
        {payment ? <p className="helper">Provider status: {payment.status}</p> : null}

        {state === 'pending' ? (
          <div className="action-row">
            <button type="button" className="secondary-cta" onClick={() => window.location.reload()}>
              Verify Again
            </button>
            <button type="button" className="primary-cta" onClick={() => navigate('/checkout')}>
              Back to Checkout
            </button>
          </div>
        ) : null}

        {state === 'failed' ? (
          <div className="action-row">
            <button type="button" className="secondary-cta" onClick={() => navigate('/cart')}>
              Back to Cart
            </button>
            <button type="button" className="primary-cta" onClick={() => navigate('/checkout')}>
              Retry Payment
            </button>
          </div>
        ) : null}
      </section>
    </main>
  )
}
