import { ChevronDown, ChevronUp, RotateCcw, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useToasts } from '../context/ToastContext'
import { useOrderHistory } from '../hooks/useMockApi'
import { track } from '../lib/analytics'
import { useTelegramChrome } from '../hooks/useTelegramChrome'

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

export function HistoryPage() {
  const navigate = useNavigate()
  const { mode, isAuthenticated, loading: authLoading } = useAuth()
  const { cart, locationId, reorderFromHistory, syncing } = useCart()
  const { pushToast } = useToasts()
  const { data, error, loading, refresh } = useOrderHistory()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [reorderingId, setReorderingId] = useState<string | null>(null)

  useTelegramChrome({ backTo: '/', mainButton: null })

  const entries = useMemo(() => data ?? [], [data])

  const handleReorder = async (historyId: string) => {
    const entry = entries.find((item) => item.id === historyId)
    if (!entry) return

    if (cart.items.length > 0) {
      const confirmed = window.confirm('This will replace current cart with reordered items. Continue?')
      if (!confirmed) return
    }

    setReorderingId(historyId)
    try {
      const result = await reorderFromHistory(entry)
      track('reorder_started', {
        historyId: entry.id,
        addedItems: result.addedItems,
        skippedItems: result.skippedItems,
      })

      if (!locationId) {
        pushToast('Reorder ready. Select delivery area to refresh backend pricing.', 'success')
      } else if (result.skippedItems > 0) {
        pushToast(`Reorder ready. Skipped ${result.skippedItems} unavailable item${result.skippedItems === 1 ? '' : 's'}.`, 'success')
      } else {
        pushToast('Reorder ready in cart.', 'success')
      }

      navigate('/cart')
    } catch (nextError) {
      pushToast(nextError instanceof Error ? nextError.message : 'Unable to reorder items', 'error')
    } finally {
      setReorderingId(null)
    }
  }

  return (
    <main className="screen">
      <PageHeader title="History" subtitle="Previous orders" backTo="/" />

      {mode === 'backend' && !isAuthenticated && !authLoading ? (
        <section className="card empty-state">
          <p>Order history needs authenticated Telegram or development bearer token.</p>
        </section>
      ) : null}

      {locationId ? (
        <section className="card history-banner">
          <p className="eyebrow">Reorder pricing</p>
          <h2>Current cart location will price reordered items</h2>
          <p className="helper">Location stays cart-level. Backend recalculates delivery fee after cart rebuild.</p>
        </section>
      ) : (
        <section className="card history-banner history-banner--warning">
          <p className="eyebrow">Reorder pricing</p>
          <h2>Select location after reorder</h2>
          <p className="helper">Backend delivery fee depends on current selected location and restaurants in cart.</p>
        </section>
      )}

      {loading ? (
        <section className="screen-section">
          <div className="card empty-state">
            <p>Loading order history…</p>
          </div>
        </section>
      ) : null}

      {error ? (
        <section className="screen-section">
          <div className="card empty-state">
            <p>{error}</p>
            <button type="button" className="secondary-cta" onClick={() => void refresh()}>
              Retry
            </button>
          </div>
        </section>
      ) : null}

      {!loading && !error && entries.length === 0 ? (
        <section className="screen-section">
          <div className="card empty-state">
            <div className="empty-cart-state__icon">
              <ShoppingBag size={42} strokeWidth={1.75} />
            </div>
            <h2>No previous orders</h2>
            <p className="helper">Completed orders will appear here for quick reorder.</p>
          </div>
        </section>
      ) : null}

      {!loading && !error && entries.length > 0 ? (
        <section className="list-stack screen-section">
          {entries.map((entry, index) => {
            const expanded = expandedId === entry.id
            const unavailableCount = entry.totalItems - entry.availableItems

            return (
              <article key={entry.id} className="card history-card">
                <div className="history-card__header">
                  <div className="history-card__meta">
                    <p className="eyebrow">Order {index + 1}</p>
                    <h2>{formatDate(entry.createdAt)}</h2>
                    <p className="helper">{entry.orders.length} dish group{entry.orders.length === 1 ? '' : 's'} • {entry.totalItems} item{entry.totalItems === 1 ? '' : 's'}</p>
                  </div>
                  <span className={`status-pill ${entry.canReorder ? 'status-pill--open' : 'status-pill--closed'}`}>
                    {entry.canReorder ? 'Reorder ready' : 'Partial reorder'}
                  </span>
                </div>

                <div className="history-chip-row">
                  {entry.orders.map((group) => (
                    <span key={group.id} className="meta-chip">{group.restaurantName ?? `Restaurant ${group.restaurantId}`}</span>
                  ))}
                </div>

                {unavailableCount > 0 ? (
                  <p className="helper error-text">{unavailableCount} item{unavailableCount === 1 ? '' : 's'} unavailable. Reorder skips missing items.</p>
                ) : null}

                <div className="history-card__actions">
                  <button
                    type="button"
                    className="secondary-cta"
                    onClick={() => setExpandedId((current) => current === entry.id ? null : entry.id)}
                  >
                    <span className="icon-label icon-label--end">
                      <span>{expanded ? 'Hide details' : 'View details'}</span>
                      {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="primary-cta"
                    disabled={syncing || reorderingId === entry.id || entry.availableItems === 0}
                    onClick={() => void handleReorder(entry.id)}
                  >
                    <span className="icon-label icon-label--end">
                      <span>{reorderingId === entry.id ? 'Reordering…' : 'Reorder'}</span>
                      <RotateCcw size={14} />
                    </span>
                  </button>
                </div>

                {expanded ? (
                  <div className="list-stack condensed-stack">
                    {entry.orders.map((group, groupIndex) => (
                      <section key={group.id} className="history-group">
                        <div className="history-group__header">
                          <div>
                            <h3>{`Dish ${groupIndex + 1}`}</h3>
                            <p className="helper">{group.restaurantName ?? `Restaurant ${group.restaurantId}`}</p>
                          </div>
                          <span className={`status-pill ${group.allItemsAvailable ? 'status-pill--open' : 'status-pill--closed'}`}>
                            {group.allItemsAvailable ? 'All available' : `${group.availableItemCount}/${group.items.length} available`}
                          </span>
                        </div>

                        <div className="list-stack condensed-stack">
                          {group.items.map((item) => (
                            <div key={item.orderItemId} className="summary-row">
                              <span>
                                {item.name ?? 'Menu item'} × {item.quantity}
                              </span>
                              <span className={item.available ? '' : 'error-text'}>{item.available ? 'Available' : 'Skipped'}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : null}
              </article>
            )
          })}
        </section>
      ) : null}
    </main>
  )
}
