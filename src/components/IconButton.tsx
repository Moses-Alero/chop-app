import type { ReactNode } from 'react'

type IconButtonProps = {
  icon: ReactNode
  label: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function IconButton({ icon, label, onClick, className = '', disabled = false }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`icon-button ${className}`.trim()}
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
    >
      {icon}
    </button>
  )
}
