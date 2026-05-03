/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react'

type MainButtonConfig = {
  text: string
  onClick: () => void
  disabled?: boolean
  visible?: boolean
}

type TelegramContextValue = {
  isTelegram: boolean
  webApp: TelegramWebApp | null
  haptic: (impact?: 'light' | 'medium' | 'heavy') => void
}

type TelegramWebApp = {
  ready?: () => void
  expand?: () => void
  initData?: string
  themeParams?: Record<string, string>
  MainButton?: {
    setText: (text: string) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  BackButton?: {
    show: () => void
    hide: () => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
  }
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy') => void
  }
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp
    }
  }
}

const TelegramContext = createContext<TelegramContextValue | null>(null)

const fallbackStore = {
  current: null as MainButtonConfig | null,
  listeners: new Set<() => void>(),
}

function emitFallbackChange() {
  fallbackStore.listeners.forEach((listener) => listener())
}

export function setFallbackMainButton(config: MainButtonConfig | null) {
  fallbackStore.current = config
  emitFallbackChange()
}

export function useFallbackMainButton() {
  return useSyncExternalStore(
    (listener) => {
      fallbackStore.listeners.add(listener)
      return () => fallbackStore.listeners.delete(listener)
    },
    () => fallbackStore.current,
    () => fallbackStore.current,
  )
}

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const webApp = window.Telegram?.WebApp ?? null
  const isTelegram = Boolean(webApp)

  useEffect(() => {
    webApp?.ready?.()
    webApp?.expand?.()

    const theme = webApp?.themeParams
    const root = document.documentElement
    root.style.setProperty('--tg-bg', theme?.bg_color ?? '#ffffff')
    root.style.setProperty('--tg-text', theme?.text_color ?? '#111111')
    root.style.setProperty('--tg-button', '#c84b4b')
    root.style.setProperty('--tg-secondary-bg', theme?.secondary_bg_color ?? '#f7f7f8')
    root.style.setProperty('--tg-hint', theme?.hint_color ?? '#6d625d')
    root.style.setProperty('--tg-button-text', '#ffffff')
  }, [webApp])

  const value = useMemo<TelegramContextValue>(
    () => ({
      isTelegram,
      webApp,
      haptic: (impact = 'light') => {
        webApp?.HapticFeedback?.impactOccurred(impact)
      },
    }),
    [isTelegram, webApp],
  )

  return <TelegramContext.Provider value={value}>{children}</TelegramContext.Provider>
}

export function useTelegram(): TelegramContextValue {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider')
  }
  return context
}
