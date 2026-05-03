import { Clock3, Star, Store, UtensilsCrossed } from 'lucide-react'
import { Link } from 'react-router-dom'
import { track } from '../lib/analytics'
import type { Restaurant } from '../types/domain'

type RestaurantCardProps = {
  restaurant: Restaurant
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="card restaurant-card restaurant-card--feature"
      data-testid={`restaurant-card-${restaurant.id}`}
      onClick={() => track('restaurant_viewed', { restaurantId: restaurant.id })}
    >
      <div className="restaurant-card__media">
        {restaurant.imageUrl ? (
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            loading="lazy"
            className="restaurant-card__image"
          />
        ) : null}
        {typeof restaurant.isOpen === 'boolean' ? (
          <span className={`status-pill restaurant-card__status ${restaurant.isOpen ? 'status-pill--open' : 'status-pill--closed'}`}>
            {restaurant.isOpen ? 'Open' : 'Closed'}
          </span>
        ) : null}
      </div>
      <div className="restaurant-card__body">
        <div className="restaurant-card__topline">
          <span className="icon-label icon-label--muted">
            <Store size={14} />
            <h2>{restaurant.name}</h2>
          </span>
          {typeof restaurant.rating === 'number' ? (
            <span className="restaurant-card__rating icon-label">
              <Star size={13} />
              <span>{restaurant.rating.toFixed(1)}</span>
            </span>
          ) : null}
        </div>
        {restaurant.cuisine ? (
          <p className="icon-label icon-label--muted">
            <UtensilsCrossed size={13} />
            <span>{restaurant.cuisine}</span>
          </p>
        ) : null}
        {restaurant.description ? <p className="restaurant-card__description helper">{restaurant.description}</p> : null}
        {restaurant.deliveryFee || restaurant.totalMenuItems || (restaurant.deliveryTimeMin !== null && restaurant.deliveryTimeMax !== null) ? (
          <div className="meta-row restaurant-card__meta-row">
            {restaurant.deliveryTimeMin !== null && restaurant.deliveryTimeMax !== null ? (
              <span className="meta-chip icon-label icon-label--muted">
                <Clock3 size={13} />
                <span>
                  {restaurant.deliveryTimeMin}–{restaurant.deliveryTimeMax} mins
                </span>
              </span>
            ) : null}
            {restaurant.totalMenuItems ? <span className="meta-chip">{restaurant.totalMenuItems} items</span> : null}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
