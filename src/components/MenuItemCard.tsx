import { Info, Nfc, Plus } from 'lucide-react'
import type { MenuItem } from '../types/domain'
import { formatMoney } from '../lib/currency'
import { QuantityStepper } from './QuantityStepper'

type MenuItemCardProps = {
  item: MenuItem
  quantity: number
  onAdd: () => void | Promise<void>
  onDecrease: () => void | Promise<void>
  onIncrease: () => void | Promise<void>
  disabled?: boolean
}

export function MenuItemCard({
  item,
  quantity,
  onAdd,
  onDecrease,
  onIncrease,
  disabled = false,
}: MenuItemCardProps) {
  return (
    <article className="card menu-item-card menu-item-card--feature" data-testid={`menu-item-${item.id}`}>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} loading="lazy" className="menu-item-card__image" />
      ) : null}
      <div className="menu-item-card__content">
        <div className="menu-item-card__copy">
          <h3>{item.name}</h3>
          <p className="price-row icon-label">
            <Nfc size={13} />
            <span>{formatMoney(item.price)}</span>
          </p>
          {item.description ? (
            <p className="menu-description icon-label icon-label--muted icon-label--start">
              <Info size={13} />
              <span>{item.description}</span>
            </p>
          ) : null}
        </div>
        {!item.isAvailable ? (
          <span className="status-pill status-pill--closed">Unavailable</span>
        ) : quantity > 0 ? (
          <QuantityStepper
            quantity={quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            testId={`stepper-${item.id}`}
          />
        ) : (
          <button type="button" className="secondary-cta icon-label" onClick={() => void onAdd()} disabled={disabled} data-testid={`add-item-${item.id}`}>
            <Plus size={14} />
            <span>Add</span>
          </button>
        )}
      </div>
    </article>
  )
}
