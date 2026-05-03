import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { FloatingCartBar } from '../components/FloatingCartBar'
import { MenuItemCard } from '../components/MenuItemCard'
import { PageHeader } from '../components/PageHeader'
import { SectionHeader } from '../components/SectionHeader'
import { SkeletonCard } from '../components/SkeletonCard'
import { useCart } from '../context/CartContext'
import { useToasts } from '../context/ToastContext'
import { useRestaurantMenu } from '../hooks/useMockApi'
import { useTelegramChrome } from '../hooks/useTelegramChrome'
import { track } from '../lib/analytics'
import { useTelegram } from '../lib/telegram'

export function RestaurantPage() {
  const { id = '' } = useParams()
  const { data, error, loading, refresh } = useRestaurantMenu(id)
  const { cart, cartDraft, mode, syncing, activeDishId, addDish, getQuantity, getStepSize, setActiveDish, setQuantity } = useCart()
  const { pushToast } = useToasts()
  const { haptic } = useTelegram()

  useTelegramChrome({ backTo: '/', mainButton: null })

  const grouped = useMemo(() => {
    if (!data) return []
    return data.categories.map((category) => ({
      ...category,
      items: data.items.filter((item) => item.categoryId === category.id),
    }))
  }, [data])

  const stepSize = data?.restaurant.quantityStep ?? getStepSize(id)
  const restaurantClosed = data?.restaurant.isOpen === false
  const paymentLocked = Boolean(cart.paymentLocked)
  const dishGroups = mode === 'mock' ? cartDraft.dishes : cart.dishes

  const changeQty = async (itemId: string, nextQty: number, dishId = activeDishId) => {
    const item = data?.items.find((entry) => entry.id === itemId)
    if (!item) return

    if (restaurantClosed) {
      pushToast('Restaurant is closed', 'error')
      return
    }

    if (!item.isAvailable) {
      pushToast('Item unavailable', 'error')
      return
    }

    const currentQty = getQuantity(itemId, dishId)

    try {
      await setQuantity(id, itemId, nextQty, dishId)
      haptic(nextQty > currentQty ? 'medium' : 'light')
      track(nextQty > currentQty ? 'item_added' : 'item_removed', {
        itemId,
        restaurantId: id,
        quantity: nextQty,
      })
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'Unable to update cart', 'error')
    }
  }

  return (
    <main className="screen">
      <PageHeader title="Restaurant" subtitle={data?.restaurant.name ?? data?.restaurant.cuisine ?? undefined} backTo="/" />

      {loading ? (
        <div className="list-stack">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : null}

      {error ? (
        <div className="card empty-state">
          <p>{error}</p>
          <button type="button" className="secondary-cta" onClick={() => void refresh()}>
            Retry
          </button>
        </div>
      ) : null}

      {data ? (
        <>
          {data.restaurant.imageUrl ? (<section className="card restaurant-hero restaurant-hero--feature">
            {data.restaurant.imageUrl ? <img src={data.restaurant.imageUrl} alt={data.restaurant.name} className="restaurant-hero__image" /> : null}
            <div className="restaurant-hero__content">
              <div className="restaurant-hero__topline">
                <h2>{data.restaurant.name}</h2>
                {typeof data.restaurant.isOpen === 'boolean' ? (
                  <span className={`status-pill ${data.restaurant.isOpen ? 'status-pill--open' : 'status-pill--closed'}`}>
                    {data.restaurant.isOpen ? 'Open' : 'Closed'}
                  </span>
                ) : null}
              </div>
              {data.restaurant.description ? <p className="helper">{data.restaurant.description}</p> : null}
              {data.restaurant.cuisine || (data.restaurant.totalMenuItems ?? 0) > 0 ? (
                <div className="restaurant-hero__meta">
                  {data.restaurant.cuisine ? <span className="meta-chip">{data.restaurant.cuisine}</span> : null}
                  {data.restaurant.totalMenuItems ? <span className="meta-chip">{data.restaurant.totalMenuItems} items</span> : null}
                </div>
              ) : null}
            </div>
          </section>): null}

          {paymentLocked ? (
            <section className="card empty-state">
              <p>Payment in progress for current cart.</p>
              <p className="helper">Item changes stay disabled until payment is verified or cancelled.</p>
            </section>
          ) : null}

          <section className="screen-section">
            <SectionHeader eyebrow="Dishes" title="Group items by dish" trailing={<button type="button" className="section-link" disabled={paymentLocked} onClick={() => void addDish(id)}>New dish</button>} />
            <div className="category-rail" aria-label="Dish groups">
              {dishGroups.length === 0 ? (
                <button type="button" className="category-tab category-tab--active" disabled={paymentLocked} onClick={() => void addDish(id)}>Dish 1</button>
              ) : dishGroups.map((dish) => (
                <button
                  key={dish.id}
                  type="button"
                  className={`category-tab ${dish.id === activeDishId ? 'category-tab--active' : ''}`}
                  onClick={() => setActiveDish(dish.id)}
                >
                  {dish.label}
                </button>
              ))}
            </div>
          </section>

          <nav className="category-tabs" aria-label="Menu Categories">
            {grouped.map((category) => (
              <a key={category.id} href={`#${category.id}`} className="category-tab">
                {category.name}
              </a>
            ))}
          </nav>

          <div className="menu-groups">
            {grouped.map((category) => (
              <section key={category.id} id={category.id} className="screen-section">
                <SectionHeader title={category.name} />
                <div className="list-stack">
                  {category.items.map((item) => {
                    const quantity = getQuantity(item.id, activeDishId)
                    return (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        quantity={quantity}
                        onAdd={() => changeQty(item.id, item.quantityStep ?? stepSize)}
                        onDecrease={() => changeQty(item.id, Math.max(0, quantity - (item.quantityStep ?? stepSize)))}
                        onIncrease={() => changeQty(item.id, quantity + (item.quantityStep ?? stepSize))}
                        disabled={syncing || paymentLocked}
                      />
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        </>
      ) : null}

      <FloatingCartBar cart={cart} />
    </main>
  )
}
