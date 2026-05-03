import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'
import { RestaurantCard } from '../components/RestaurantCard'
import { SectionHeader } from '../components/SectionHeader'
import { SkeletonCard } from '../components/SkeletonCard'
import { useMockApi } from '../hooks/useMockApi'
import { useTelegramChrome } from '../hooks/useTelegramChrome'

export function RestaurantsPage() {
  const navigate = useNavigate()
  const { useRestaurants } = useMockApi
  const { data: restaurants, error, loading, refresh } = useRestaurants()

  useTelegramChrome({ backTo: '/', mainButton: null })

  return (
    <main className="screen">
      <PageHeader title="Restaurants" subtitle="Discover nearby options" backTo="/" />

      <section className="screen-section">
        <SectionHeader eyebrow="Browse" title="All restaurants" trailing={restaurants?.length ? <span className="helper">{restaurants.length} available</span> : null} />

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

        {!loading && !error && (!restaurants || restaurants.length === 0) ? (
          <div className="card empty-state">
            <p>No restaurants available right now.</p>
            <button type="button" className="secondary-cta" onClick={() => navigate('/')}>
              Back Home
            </button>
          </div>
        ) : null}

        {!loading && !error && restaurants?.length ? (
          <div className="restaurant-grid restaurant-grid--page" data-testid="restaurants-page-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}
