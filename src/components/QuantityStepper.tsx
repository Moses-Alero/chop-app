import { Minus, Plus } from 'lucide-react'

type QuantityStepperProps = {
  quantity: number
  onDecrease: () => void
  onIncrease: () => void
  compact?: boolean
  disabled?: boolean
  testId?: string
}

function formatQuantity(quantity: number): string {
  return Number.isInteger(quantity) ? String(quantity) : quantity.toFixed(1)
}

export function QuantityStepper({
  quantity,
  onDecrease,
  onIncrease,
  compact = false,
  disabled = false,
  testId,
}: QuantityStepperProps) {
  return (
    <div className={`stepper ${compact ? 'stepper--compact' : ''}`} data-testid={testId}>
      <button type="button" onClick={onDecrease} aria-label="Decrease quantity" disabled={disabled}>
        <Minus size={14} />
      </button>
      <span className="stepper__value">{formatQuantity(quantity)}</span>
      <button type="button" onClick={onIncrease} aria-label="Increase quantity" disabled={disabled}>
        <Plus size={14} />
      </button>
    </div>
  )
}
