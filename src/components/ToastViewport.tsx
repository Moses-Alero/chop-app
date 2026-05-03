import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { useToasts } from '../context/ToastContext'

export function ToastViewport() {
  const { toasts, dismissToast } = useToasts()

  return (
    <div className="toast-viewport" aria-live="polite">
      {toasts.map((toast) => {
        const Icon = toast.tone === 'error' ? AlertCircle : toast.tone === 'success' ? CheckCircle2 : Info

        return (
          <button
            key={toast.id}
            type="button"
            className={`toast toast--${toast.tone ?? 'default'} icon-label icon-label--start`}
            onClick={() => dismissToast(toast.id)}
          >
            <Icon size={14} />
            <span>{toast.title}</span>
          </button>
        )
      })}
    </div>
  )
}
