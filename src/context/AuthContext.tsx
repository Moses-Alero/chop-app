/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  authenticateTelegramUser,
  fetchCurrentUser,
  getBootstrapBearerToken,
  shouldUseBackendApp,
} from '../lib/backendApi'
import type { AppUser as AuthUser } from '../lib/backendApi'
import { useToasts } from './ToastContext'

type AuthContextValue = {
  mode: 'backend' | 'mock'
  token: string | null
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  error: string | null
  refreshUser: () => Promise<void>
}

type TelegramWebAppWithInitData = {
  initData?: string
}

const TOKEN_STORAGE_KEY = 'choplink-auth-token-v1'
const AuthContext = createContext<AuthContextValue | null>(null)

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null
  return window.sessionStorage.getItem(TOKEN_STORAGE_KEY)
}

function persistToken(token: string | null) {
  if (typeof window === 'undefined') return
  if (!token) {
    window.sessionStorage.removeItem(TOKEN_STORAGE_KEY)
    return
  }

  window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const mode = shouldUseBackendApp() ? 'backend' : 'mock'
  const { pushToast } = useToasts()
  const warnedMissingContext = useRef(false)
  const warnedAuthFailure = useRef<string | null>(null)
  const [token, setToken] = useState<string | null>(() => getBootstrapBearerToken() ?? getStoredToken())
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(mode === 'backend')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    persistToken(token)
  }, [token])

  useEffect(() => {
    if (mode === 'mock') {
      setLoading(false)
      setUser(null)
      setError(null)
      return
    }

    let cancelled = false

    const bootstrap = async () => {
      setLoading(true)
      setError(null)

      try {
        let activeToken = token
        if (!activeToken) {
          const initData = (window.Telegram?.WebApp as TelegramWebAppWithInitData | undefined)?.initData
          if (initData) {
            const auth = await authenticateTelegramUser(initData)
            activeToken = auth.token
            if (!cancelled) {
              setToken(auth.token)
              setUser(auth.user)
            }
          } else if (!warnedMissingContext.current) {
            warnedMissingContext.current = true
            pushToast('Telegram context missing. Auth skipped.', 'error')
          }
        }

        if (activeToken) {
          const currentUser = await fetchCurrentUser(activeToken)
          if (!cancelled) {
            setToken(activeToken)
            setUser(currentUser)
          }
        }
      } catch (nextError) {
        if (!cancelled) {
          const message = nextError instanceof Error ? nextError.message : 'Unable to authenticate'
          setError(message)
          setUser(null)
          if (warnedAuthFailure.current !== message) {
            warnedAuthFailure.current = message
            pushToast(`Authentication failed: ${message}`, 'error')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [mode, pushToast, token])

  const value = useMemo<AuthContextValue>(() => ({
    mode,
    token,
    user,
    loading,
    isAuthenticated: Boolean(token),
    error,
    refreshUser: async () => {
      if (mode !== 'backend' || !token) return
      const currentUser = await fetchCurrentUser(token)
      setUser(currentUser)
    },
  }), [error, loading, mode, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
