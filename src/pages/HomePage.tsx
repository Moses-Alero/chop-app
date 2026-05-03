import { MapPin, Search, ShoppingBag, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RestaurantCard } from '../components/RestaurantCard'
import { SectionHeader } from '../components/SectionHeader'
import { SkeletonCard } from '../components/SkeletonCard'
import { useCart } from '../context/CartContext'
import { useMockApi } from '../hooks/useMockApi'
import { useTelegramChrome } from '../hooks/useTelegramChrome'
import { track } from '../lib/analytics'
import { formatMoney } from '../lib/currency'

function shuffleRestaurants<T>(items: T[]): T[] {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = next[index]
    next[index] = next[randomIndex]
    next[randomIndex] = current
  }
  return next
}

export function HomePage() {
  const navigate = useNavigate()
  const { cart, locationId, setLocationId } = useCart()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [activeDiscoveryIndex, setActiveDiscoveryIndex] = useState(0)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const discoverySliderRef = useRef<HTMLDivElement | null>(null)
  const { useDeliveryZones, useRestaurants, useSearchCatalog } = useMockApi
  const { data: restaurants, error, loading, refresh } = useRestaurants()
  const { data: zones } = useDeliveryZones()
  const { data: searchResults, loading: searchLoading } = useSearchCatalog(query)
  const [featuredRestaurantId, setFeaturedRestaurantId] = useState<string | null>(null)

  useTelegramChrome({ mainButton: null, backTo: null })

  useEffect(() => {
    const normalized = query.trim()
    if (!normalized) return

    track('search_performed', { query: normalized })
  }, [query])

  useEffect(() => {
    if (!searchOpen) return
    searchInputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!zones?.length || locationId) return
    void setLocationId(zones[0].id)
  }, [locationId, setLocationId, zones])

  useEffect(() => {
    if (!restaurants?.length) {
      setFeaturedRestaurantId(null)
      return
    }

    setFeaturedRestaurantId((current) => {
      if (current && restaurants.some((restaurant) => restaurant.id === current)) return current
      const randomIndex = Math.floor(Math.random() * restaurants.length)
      return restaurants[randomIndex]?.id ?? restaurants[0]?.id ?? null
    })
  }, [restaurants])

  const hasSearch = query.trim().length > 0
  const selectedZoneId = locationId || zones?.[0]?.id || ''
  const featuredRestaurants = useMemo(() => {
    if (!restaurants?.length) return []
    return shuffleRestaurants(restaurants).slice(0, 5)
  }, [restaurants])

  const scrollToDiscoverySlide = useCallback((index: number) => {
    const nextSlide = discoverySliderRef.current?.children[index] as HTMLElement | undefined
    nextSlide?.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
  }, [])

  useEffect(() => {
    if (!featuredRestaurants.length) {
      setActiveDiscoveryIndex(0)
      return
    }

    setActiveDiscoveryIndex((current) => Math.min(current, featuredRestaurants.length - 1))
  }, [featuredRestaurants])

  useEffect(() => {
    if (carouselPaused || featuredRestaurants.length <= 1) return

    const intervalId = window.setInterval(() => {
      setActiveDiscoveryIndex((current) => {
        const nextIndex = (current + 1) % featuredRestaurants.length
        scrollToDiscoverySlide(nextIndex)
        return nextIndex
      })
    }, 4500)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [carouselPaused, featuredRestaurants, scrollToDiscoverySlide])

  const featuredRestaurant = useMemo(
    () => restaurants?.find((restaurant) => restaurant.id === featuredRestaurantId) ?? restaurants?.[0] ?? null,
    [featuredRestaurantId, restaurants],
  )

  const restaurantSearchResults = useMemo(() => {
    if (!hasSearch) return []
    return searchResults?.restaurants ?? []
  }, [hasSearch, searchResults])

  const itemSearchResults = useMemo(() => searchResults?.items ?? [], [searchResults])

  return (
    <main className="screen">
      <section className="home-topbar">
        <button type="button" className="icon-button home-topbar__menu" aria-label="Open menu">
        </button>

        <label className="home-location" htmlFor="home-location-select">
          <span className="home-location__label">Location</span>
          <span className="home-location__value icon-label icon-label--start">
            <MapPin size={14} />
            <select
              id="home-location-select"
              className="toolbar-location__select"
              value={selectedZoneId}
              onChange={(event) => {
                void setLocationId(event.target.value)
              }}
              data-testid="home-location-select"
            >
              {zones?.map((zone) => (
                <option key={zone.id} value={zone.id}>
                  {zone.label}
                </option>
              ))}
            </select>
          </span>
        </label>

        <div className="home-topbar__actions">
          <div className={`toolbar-search ${searchOpen ? 'toolbar-search--open' : ''}`}>
            <button
              type="button"
              className="toolbar-search__toggle"
              onClick={() => {
                if (searchOpen && query) {
                  setQuery('')
                  setSearchOpen(false)
                  return
                }

                if (searchOpen && !query) {
                  setSearchOpen(false)
                  return
                }

                setSearchOpen(true)
              }}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              data-testid="catalog-search-toggle"
            >
              {searchOpen ? <X size={16} /> : <Search size={16} />}
            </button>
            <label htmlFor="catalog-search" className="visually-hidden">
              Search for food and restaurants
            </label>
            <input
              ref={searchInputRef}
              id="catalog-search"
              className="toolbar-search__input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onBlur={() => {
                if (!query.trim()) setSearchOpen(false)
              }}
              placeholder="Search food and restaurants"
              data-testid="catalog-search-input"
            />
          </div>

          <button
            type="button"
            className="icon-button home-topbar__cart"
            aria-label="Open cart"
            onClick={() => navigate('/cart')}
          >
            <ShoppingBag size={16} />
            {cart.items.length > 0 ? <span className="home-topbar__badge">{cart.items.length}</span> : null}
          </button>
        </div>
      </section>

      <section className="home-promo-card">
        <div className="home-promo-card__content">
          <h1>ChopLink specials</h1>
          <p>{featuredRestaurant ? `Order from ${featuredRestaurant.name} without leaving Telegram.` : 'Quick restaurant discovery and checkout inside Telegram.'}</p>
          <button
            type="button"
            className="home-promo-card__cta"
            onClick={() => navigate(featuredRestaurant ? `/restaurants/${featuredRestaurant.id}` : '/')}
            data-testid="specials-order-now"
          >
            Order Now
          </button>
        </div>
        {featuredRestaurant?.imageUrl ? (
          <img
            src={featuredRestaurant.imageUrl}
            alt={featuredRestaurant.name}
            className="home-promo-card__image"
          />
        ) : null}
      </section>

      {!hasSearch ? (
        <section className="screen-section">
          <SectionHeader eyebrow="Discovery" title="Featured restaurants" />
          <div
            className="discovery-slider"
            data-testid="discovery-slider"
            ref={discoverySliderRef}
            onMouseEnter={() => setCarouselPaused(true)}
            onMouseLeave={() => setCarouselPaused(false)}
            onTouchStart={() => setCarouselPaused(true)}
            onTouchEnd={() => setCarouselPaused(false)}
            onScroll={(event) => {
              const slider = event.currentTarget
              const slideWidth = slider.clientWidth * 0.82 + 12
              if (slideWidth <= 0) return
              const nextIndex = Math.round(slider.scrollLeft / slideWidth)
              setActiveDiscoveryIndex(Math.max(0, Math.min(nextIndex, featuredRestaurants.length - 1)))
            }}
          >
            {featuredRestaurants.map((restaurant, index) => (
              <button
                key={restaurant.id}
                type="button"
                className="discovery-slide"
                onClick={() => navigate(`/restaurants/${restaurant.id}`)}
                data-testid={`discovery-restaurant-${restaurant.id}`}
                aria-current={activeDiscoveryIndex === index}
              >
                {restaurant.imageUrl ? <img src={restaurant.imageUrl} alt={restaurant.name} className="discovery-slide__image" /> : null}
                <div className="discovery-slide__overlay">
                  {restaurant.cuisine ? <p className="eyebrow">{restaurant.cuisine}</p> : null}
                  <h3>{restaurant.name}</h3>
                  {restaurant.deliveryTimeMin !== null && restaurant.deliveryTimeMax !== null ? (
                    <span>{restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} mins</span>
                  ) : null}
                </div>
              </button>
            ))}
          </div>
          {featuredRestaurants.length > 1 ? (
            <div className="discovery-dots" aria-label="Featured restaurants carousel position">
              {featuredRestaurants.map((restaurant, index) => (
                <button
                  key={restaurant.id}
                  type="button"
                  className={`discovery-dot ${index === activeDiscoveryIndex ? 'discovery-dot--active' : ''}`}
                  aria-label={`Show featured restaurant ${index + 1}`}
                  onClick={() => {
                    setActiveDiscoveryIndex(index)
                    scrollToDiscoverySlide(index)
                  }}
                />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {hasSearch ? (
        <section className="screen-section">
          <SectionHeader eyebrow="Search results" title="Food and restaurants" />

          {searchLoading ? <SkeletonCard /> : null}

          {restaurants || searchResults ? (
            <div className="list-stack">
              {restaurantSearchResults.map((restaurant) => (
                <RestaurantCard key={restaurant.id} restaurant={restaurant} />
              ))}

              {itemSearchResults.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="card search-result-card"
                  onClick={() => navigate(`/restaurants/${item.restaurantId}`)}
                  data-testid={`search-result-${item.id}`}
                >
                  {item.imageUrl ? <img src={item.imageUrl} alt={item.name} loading="lazy" className="search-result-card__image" /> : null}
                  <div>
                    <h3>{item.name}</h3>
                    <p className="helper">{item.restaurantName}</p>
                    <p className="helper">{formatMoney(item.price)}</p>
                  </div>
                </button>
              ))}

              {restaurantSearchResults.length === 0 && itemSearchResults.length === 0 ? (
                <div className="card empty-state">
                  <p>No matches for “{query.trim()}”.</p>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="screen-section">
        <SectionHeader
          eyebrow="Restaurants"
          title="Discover nearby options"
          trailing={<button type="button" className="section-link" onClick={() => navigate('/restaurants')}>See All</button>}
        />

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

        {!loading && !error && restaurants ? (
          <div className="restaurant-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : null}
      </section>
    </main>
  )
}
