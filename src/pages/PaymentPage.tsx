import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToasts } from '../context/ToastContext'
import { useTelegramChrome } from '../hooks/useTelegramChrome'
import { cancelPaymentInBackend, fetchPaymentStatusFromBackend, verifyPaymentInBackend } from '../lib/backendApi'

export function PaymentPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { mode, token } = useAuth()
  const {
    pendingCheckoutCart,
    pendingPaymentReference,
    setLastCheckoutCart,
    setPendingCheckoutCart,
    setPendingPaymentReference,
    refreshCart,
  } = useCart()
  const { pushToast } = useToasts()
  const [checking, setChecking] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [polling, setPolling] = useState(true)
  const [statusMessage, setStatusMessage] = useState('Waiting for payment confirmation…')
  const reference = id ?? pendingPaymentReference ?? null
  const verifiedRef = useRef(false)

  const completeSuccess = async (cartId: string) => {
    verifiedRef.current = true
    if (pendingCheckoutCart) setLastCheckoutCart(pendingCheckoutCart)
    setPendingCheckoutCart(null)
    setPendingPaymentReference(null)
    await refreshCart().catch(() => undefined)
    navigate(`/success/${cartId}`, { replace: true })
  }

  const checkPaymentStatus = async (silent = false): Promise<boolean> => {
    if (!token || !reference) return false

    setChecking(true)
    try {
      const verifiedPayment = await verifyPaymentInBackend(token, reference)
      if (verifiedPayment.status === 'success') {
        await completeSuccess(verifiedPayment.cartId)
        return true
      }

      const payment = await fetchPaymentStatusFromBackend(token, reference)
      const pending = payment.status === 'pending' || payment.status === 'initialized'
      setStatusMessage(pending ? 'Waiting for payment confirmation…' : `Payment ${payment.status}.`)

      if (payment.status === 'success') {
        await completeSuccess(payment.cartId)
        return true
      }

      if (!silent) {
        pushToast(`Payment ${payment.status}.`, payment.status === 'failed' || payment.status === 'cancelled' || payment.status === 'expired' ? 'error' : 'success')
      }
      return false
    } catch (error) {
      try {
        const payment = await fetchPaymentStatusFromBackend(token, reference)
        const pending = payment.status === 'pending' || payment.status === 'initialized'
        setStatusMessage(pending ? 'Waiting for payment confirmation…' : `Payment ${payment.status}.`)
        if (!silent) {
          pushToast(`Payment ${payment.status}.`, payment.status === 'failed' || payment.status === 'cancelled' || payment.status === 'expired' ? 'error' : 'success')
        }
      } catch {
        if (!silent) pushToast(error instanceof Error ? error.message : 'Unable to check payment status', 'error')
      }
      return false
    } finally {
      setChecking(false)
    }
  }

  useEffect(() => {
    if (!token || !reference) return
    if (verifiedRef.current) return

    let cancelled = false
    let timeoutId: number | null = null
    let attempts = 0

    const run = async () => {
      const success = await checkPaymentStatus(true)
      if (cancelled || success) {
        setPolling(false)
        return
      }

      attempts += 1
      if (attempts >= 5) {
        setPolling(false)
        return
      }

      timeoutId = window.setTimeout(() => {
        if (!cancelled && !verifiedRef.current) void run()
      }, 1000)
    }

    void run()

    return () => {
      cancelled = true
      if (timeoutId) window.clearTimeout(timeoutId)
    }
  }, [reference, token])

  useTelegramChrome({
    backTo: '/checkout',
    mainButton: {
      text: checking || polling ? 'Checking…' : 'Check Payment Status',
      onClick: () => {
        void checkPaymentStatus()
      },
      disabled: checking || cancelling || polling || !token || !reference,
    },
  })

  if (mode === 'mock') return <Navigate to="/" replace />

  return (
    <main className="screen">
      <PageHeader title="Payment" subtitle="Complete checkout" backTo="/checkout" />
      <section className="card empty-state" data-testid="payment-status-screen">
        <div className="success-icon"><LoaderCircle size={20} className="spin" /></div>
        <h2>{polling ? 'Confirming payment…' : 'Payment pending'}</h2>
        <p className="helper">{statusMessage}</p>

        <div className="action-row">
          <button
            type="button"
            className="secondary-cta"
            disabled={checking || cancelling || polling || !token || !reference}
            onClick={() => {
              void checkPaymentStatus()
            }}
          >
            {checking || polling ? 'Checking…' : 'Check Status'}
          </button>
          <button
            type="button"
            className="primary-cta"
            disabled={checking || cancelling || !token || !reference}
            onClick={() => {
              void (async () => {
                if (!token || !reference) return
                setCancelling(true)
                try {
                  await cancelPaymentInBackend(token, reference)
                  setPendingCheckoutCart(null)
                  setPendingPaymentReference(null)
                  await refreshCart().catch(() => undefined)
                  pushToast('Pending payment cancelled. Cart unlocked.', 'success')
                  navigate('/checkout', { replace: true })
                } catch (error) {
                  pushToast(error instanceof Error ? error.message : 'Unable to cancel pending payment', 'error')
                } finally {
                  setCancelling(false)
                }
              })()
            }}
          >
            {cancelling ? 'Cancelling…' : 'Cancel Payment'}
          </button>
        </div>
      </section>
    </main>
  )
}
