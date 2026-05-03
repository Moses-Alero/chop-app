/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

type Toast = {
  id: number
  title: string
  tone?: 'default' | 'error' | 'success'
}

type ToastContextValue = {
  toasts: Toast[]
  pushToast: (title: string, tone?: Toast['tone']) => void
  dismissToast: (id: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const pushToast = useCallback(
    (title: string, tone: Toast['tone'] = 'default') => {
      const id = Date.now() + Math.floor(Math.random() * 1000)
      setToasts((current) => [...current, { id, title, tone }])
      window.setTimeout(() => dismissToast(id), 2600)
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({ toasts, pushToast, dismissToast }),
    [dismissToast, pushToast, toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}

export function useToasts(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToasts must be used within ToastProvider')
  return context
}
