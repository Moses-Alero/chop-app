/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import {
  addCartItemInBackend,
  cancelPaymentInBackend,
  createCartOrderInBackend,
  deleteCartInBackend,
  deleteCartItemInBackend,
  deleteCartOrderInBackend,
  fetchCartFromBackend,
  updateCartInfoInBackend,
  updateCartItemInBackend,
  updateCartLocationInBackend,
  updateCartReferralInBackend,
} from '../lib/backendApi'
import { money } from '../lib/currency'
import { evaluateCart } from '../lib/mockApi'
import { findMockMenuItemById, findMockRestaurantById } from '../lib/mockSelectors'
import type { Cart, CartDishDraft, CartDraft, Order, OrderHistoryEntry } from '../types/domain'
import { useAuth } from './AuthContext'

type PendingQuantityMutation = {
  dishId: string
  itemId: string
  restaurantId: string
  qty: number
}

type PendingDishCreateMutation = {
  tempDishId: string
  restaurantId: string
}

type PendingMutations = {
  clearCartRequested: boolean
  quantities: Map<string, PendingQuantityMutation>
  addDishes: PendingDishCreateMutation[]
  removeDishIds: Set<string>
}

function createPendingMutations(): PendingMutations {
  return {
    clearCartRequested: false,
    quantities: new Map(),
    addDishes: [],
    removeDishIds: new Set(),
  }
}

function cloneCart(cart: Cart): Cart {
  return {
    ...cart,
    pricing: { ...cart.pricing },
    dishes: cart.dishes.map((dish) => ({
      ...dish,
      items: dish.items.map((item) => ({ ...item })),
    })),
    items: cart.items.map((item) => ({ ...item })),
  }
}

function emptyCart(): Cart {
  return {
    id: 'cart-empty',
    restaurantId: null,
    restaurantName: null,
    locationId: null,
    locationLabel: null,
    referralCode: null,
    locationNote: null,
    status: 'active',
    paymentLocked: false,
    dishes: [],
    items: [],
    subtotal: money(0),
    deliveryFee: money(0),
    total: money(0),
    pricing: {
      itemsTotal: money(0),
      deliveryFee: money(0),
      handlingFee: money(0),
      surcharge: money(0),
      extraOrderCharge: money(0),
      transactionFee: money(0),
      serviceCharge: money(0),
      discount: money(0),
      subTotal: money(0),
      total: money(0),
    },
    updatedAt: new Date().toISOString(),
  }
}

function createDish(index: number): CartDishDraft {
  return {
    id: `dish-${Date.now()}-${index}`,
    label: `Dish ${index}`,
    quantities: {},
  }
}

function createOptimisticDish(baseCart: Cart, restaurantId: string, dishId?: string): Cart {
  const nextCart = cloneCart(baseCart)
  const id = dishId ?? `dish-temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const restaurantName = nextCart.restaurantName ?? findMockRestaurantById(restaurantId)?.name ?? null

  nextCart.dishes.push({
    id,
    label: `Dish ${nextCart.dishes.length + 1}`,
    restaurantId,
    restaurantName,
    items: [],
    subtotal: money(0),
  })
  nextCart.restaurantId = nextCart.restaurantId ?? restaurantId
  nextCart.restaurantName = restaurantName
  nextCart.updatedAt = new Date().toISOString()
  return nextCart
}

function applyOptimisticCartQuantity(input: {
  cart: Cart
  restaurantId: string
  itemId: string
  qty: number
  dishId?: string | null
  fallbackDishId?: string | null
}): { cart: Cart, activeDishId: string | null } {
  const nextCart = cloneCart(input.cart)
  const nextQty = Math.max(0, Math.round(input.qty))
  const menuItem = findMockMenuItemById(input.itemId)
  const targetDishId = input.dishId ?? input.fallbackDishId ?? nextCart.dishes[0]?.id ?? `dish-temp-${Date.now()}`
  let dish = nextCart.dishes.find((entry) => entry.id === targetDishId) ?? null

  if (!dish) {
    dish = {
      id: targetDishId,
      backendOrderId: undefined,
      label: `Dish ${nextCart.dishes.length + 1}`,
      restaurantId: input.restaurantId,
      restaurantName: nextCart.restaurantName,
      items: [],
      subtotal: money(0),
    }
    nextCart.dishes.push(dish)
  }

  const lineIndex = dish.items.findIndex((entry) => entry.itemId === input.itemId)
  const previousQty = lineIndex >= 0 ? dish.items[lineIndex].qty : 0
  const deltaQty = nextQty - previousQty
  const unitPrice = lineIndex >= 0 ? dish.items[lineIndex].unitPrice : (menuItem?.price ?? money(0))
  const deltaAmount = unitPrice.amount * deltaQty

  if (nextQty <= 0) {
    if (lineIndex >= 0) dish.items.splice(lineIndex, 1)
  } else if (lineIndex >= 0) {
    dish.items[lineIndex] = {
      ...dish.items[lineIndex],
      qty: nextQty,
      lineTotal: money(unitPrice.amount * nextQty),
    }
  } else {
    dish.items.push({
      cartItemId: undefined,
      itemId: input.itemId,
      dishId: dish.id,
      backendOrderId: dish.backendOrderId,
      dishLabel: dish.label,
      name: menuItem?.name ?? 'Item',
      imageUrl: menuItem?.imageUrl ?? undefined,
      unitPrice,
      qty: nextQty,
      lineTotal: money(unitPrice.amount * nextQty),
    })
  }

  nextCart.dishes = nextCart.dishes.filter((entry) => entry.items.length > 0)
  nextCart.dishes.forEach((entry, index) => {
    entry.label = `Dish ${index + 1}`
    entry.items = entry.items.map((item) => ({ ...item, dishLabel: entry.label, dishId: entry.id, backendOrderId: entry.backendOrderId }))
    entry.subtotal = money(entry.items.reduce((sum, item) => sum + item.lineTotal.amount, 0))
  })
  nextCart.items = nextCart.dishes.flatMap((entry) => entry.items)

  nextCart.restaurantId = input.restaurantId
  nextCart.restaurantName = nextCart.restaurantName ?? findMockRestaurantById(input.restaurantId)?.name ?? null
  nextCart.pricing = {
    ...nextCart.pricing,
    itemsTotal: money(nextCart.pricing.itemsTotal.amount + deltaAmount),
    subTotal: money(nextCart.pricing.subTotal.amount + deltaAmount),
    total: money(nextCart.pricing.total.amount + deltaAmount),
  }
  nextCart.subtotal = nextCart.pricing.subTotal
  nextCart.total = nextCart.pricing.total
  nextCart.updatedAt = new Date().toISOString()

  return {
    cart: nextCart,
    activeDishId: nextCart.dishes.find((entry) => entry.id === targetDishId)?.id ?? nextCart.dishes[0]?.id ?? null,
  }
}

type CartContextValue = {
  mode: 'backend' | 'mock'
  ready: boolean
  syncing: boolean
  error: string | null
  cartDraft: CartDraft
  cart: Cart
  activeDishId: string | null
  locationId: string
  locationNote: string
  referralCode: string
  setLocationId: (value: string) => Promise<void>
  setLocationNote: (value: string) => void
  setReferralCode: (value: string) => void
  applyReferralCode: () => Promise<void>
  clearReferralCode: () => Promise<void>
  saveCheckoutInfo: () => Promise<void>
  addDish: (restaurantId?: string | null) => Promise<void>
  removeDish: (dishId: string) => Promise<void>
  setActiveDish: (dishId: string) => void
  getQuantity: (itemId: string, dishId?: string | null) => number
  setQuantity: (restaurantId: string, itemId: string, qty: number, dishId?: string | null) => Promise<void>
  getStepSize: (restaurantId: string) => number
  hydrateFromOrder: (order: Order) => void
  reorderFromHistory: (entry: OrderHistoryEntry) => Promise<{ addedItems: number, skippedItems: number }>
  refreshCart: () => Promise<void>
  flushPendingCartMutations: () => Promise<void>
  checkout: () => Promise<Cart>
  clearCart: () => Promise<void>
  lastCheckoutCart: Cart | null
  pendingCheckoutCart: Cart | null
  pendingPaymentReference: string | null
  setLastCheckoutCart: (cart: Cart | null) => void
  setPendingCheckoutCart: (cart: Cart | null) => void
  setPendingPaymentReference: (reference: string | null) => void
}

const STORAGE_KEY = 'choplink-cart-v4'
const CHECKOUT_STORAGE_KEY = 'choplink-last-checkout-v1'
const PENDING_CHECKOUT_STORAGE_KEY = 'choplink-pending-checkout-v1'
const PENDING_PAYMENT_REFERENCE_STORAGE_KEY = 'choplink-pending-payment-reference-v1'
const DEBOUNCE_MS = 1000

type DeferredMutation = {
  promise: Promise<void>
  resolve: () => void
  reject: (error: unknown) => void
}

const defaultDraft: CartDraft = {
  restaurantId: null,
  dishes: [],
  activeDishId: null,
  locationId: '',
  locationNote: '',
}

const CartContext = createContext<CartContextValue | null>(null)

function migrateCartDraft(value: unknown): CartDraft {
  if (!value || typeof value !== 'object') return defaultDraft

  const draft = value as Partial<CartDraft> & { quantities?: Record<string, number> }

  if (Array.isArray(draft.dishes)) {
    return {
      restaurantId: draft.restaurantId ?? null,
      dishes: draft.dishes,
      activeDishId: draft.activeDishId ?? draft.dishes[0]?.id ?? null,
      locationId: draft.locationId ?? '',
      locationNote: draft.locationNote ?? '',
    }
  }

  const legacyQuantities = draft.quantities ?? {}
  const hasLegacyItems = Object.keys(legacyQuantities).length > 0
  const dish = hasLegacyItems
    ? [{ id: createDish(1).id, label: 'Dish 1', quantities: legacyQuantities }]
    : []

  return {
    restaurantId: draft.restaurantId ?? null,
    dishes: dish,
    activeDishId: dish[0]?.id ?? null,
    locationId: draft.locationId ?? '',
    locationNote: draft.locationNote ?? '',
  }
}

function readStoredDraft(): CartDraft {
  const raw = window.sessionStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultDraft

  try {
    return migrateCartDraft(JSON.parse(raw))
  } catch {
    return defaultDraft
  }
}

function readStoredCart(key: string): Cart | null {
  try {
    const raw = window.sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) as Cart : null
  } catch {
    return null
  }
}

function writeStoredCart(key: string, cart: Cart | null) {
  if (!cart) {
    window.sessionStorage.removeItem(key)
    return
  }
  window.sessionStorage.setItem(key, JSON.stringify(cart))
}

function readStoredString(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStoredString(key: string, value: string | null) {
  if (!value) {
    window.sessionStorage.removeItem(key)
    return
  }
  window.sessionStorage.setItem(key, value)
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { mode, token, loading: authLoading } = useAuth()
  const [cartDraft, setCartDraft] = useState<CartDraft>(() => readStoredDraft())
  const [serverCart, setServerCart] = useState<Cart>(emptyCart())
  const [backendCart, setBackendCart] = useState<Cart>(emptyCart())
  const [syncing, setSyncing] = useState(mode === 'backend')
  const [error, setError] = useState<string | null>(null)
  const [locationId, setLocationIdState] = useState(cartDraft.locationId)
  const [locationNote, setLocationNoteState] = useState(cartDraft.locationNote)
  const [referralCode, setReferralCodeState] = useState('')
  const [activeDishId, setActiveDishId] = useState<string | null>(cartDraft.activeDishId)
  const [lastCheckoutCart, setLastCheckoutCartState] = useState<Cart | null>(() => readStoredCart(CHECKOUT_STORAGE_KEY))
  const [pendingCheckoutCart, setPendingCheckoutCartState] = useState<Cart | null>(() => readStoredCart(PENDING_CHECKOUT_STORAGE_KEY))
  const [pendingPaymentReference, setPendingPaymentReferenceState] = useState<string | null>(() => readStoredString(PENDING_PAYMENT_REFERENCE_STORAGE_KEY))

  const flushTimerRef = useRef<number | null>(null)
  const pendingMutationsRef = useRef<PendingMutations>(createPendingMutations())
  const isFlushingRef = useRef(false)
  const mutationVersionRef = useRef(0)
  const tokenRef = useRef(token)
  const serverCartRef = useRef(serverCart)
  const pendingPaymentReferenceRef = useRef(pendingPaymentReference)
  const locationIdRef = useRef(locationId)
  const locationNoteRef = useRef(locationNote)
  const referralCodeRef = useRef(referralCode)
  const clearCartDeferredRef = useRef<DeferredMutation | null>(null)

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cartDraft))
  }, [cartDraft])

  useEffect(() => {
    writeStoredCart(CHECKOUT_STORAGE_KEY, lastCheckoutCart)
  }, [lastCheckoutCart])

  useEffect(() => {
    writeStoredCart(PENDING_CHECKOUT_STORAGE_KEY, pendingCheckoutCart)
  }, [pendingCheckoutCart])

  useEffect(() => {
    writeStoredString(PENDING_PAYMENT_REFERENCE_STORAGE_KEY, pendingPaymentReference)
  }, [pendingPaymentReference])

  useEffect(() => {
    tokenRef.current = token
  }, [token])

  useEffect(() => {
    serverCartRef.current = serverCart
  }, [serverCart])

  useEffect(() => {
    pendingPaymentReferenceRef.current = pendingPaymentReference
  }, [pendingPaymentReference])

  useEffect(() => {
    locationIdRef.current = locationId
  }, [locationId])

  useEffect(() => {
    locationNoteRef.current = locationNote
  }, [locationNote])

  useEffect(() => {
    referralCodeRef.current = referralCode
  }, [referralCode])

  useEffect(() => {
    if (mode !== 'backend' || authLoading || !token) {
      setSyncing(false)
      return
    }

    let cancelled = false

    const run = async () => {
      setSyncing(true)
      setError(null)
      try {
        const cart = await fetchCartFromBackend(token)
        if (cancelled) return
        setServerCart(cart)
        setBackendCart(cart)
        setLocationIdState(cart.locationId ?? '')
        setLocationNoteState(cart.locationNote ?? '')
        setReferralCodeState(cart.referralCode ?? '')
        setActiveDishId((current) => current ?? cart.dishes[0]?.id ?? null)
      } catch (nextError) {
        if (cancelled) return
        const message = nextError instanceof Error ? nextError.message : 'Unable to load cart'
        const isMissingCart = /cart not found|not found/i.test(message)
        if (isMissingCart) {
          const cart = emptyCart()
          setServerCart(cart)
          setBackendCart(cart)
        } else {
          setError(message)
        }
      } finally {
        if (!cancelled) setSyncing(false)
      }
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [authLoading, mode, token])

  const syncMockDraftLocation = (nextLocationId: string, nextLocationNote: string) => {
    setCartDraft((current) => ({
      ...current,
      locationId: nextLocationId,
      locationNote: nextLocationNote,
    }))
  }

  const ensureBackendToken = () => {
    if (!tokenRef.current) throw new Error('Authentication required before cart actions')
    return tokenRef.current
  }

  const ensureCartUnlocked = () => {
    if (mode === 'backend' && serverCartRef.current.paymentLocked) {
      throw new Error('Payment in progress. Complete or cancel payment before editing cart')
    }
  }

  const hasPendingMutations = () => {
    const pending = pendingMutationsRef.current
    return pending.clearCartRequested || pending.quantities.size > 0 || pending.addDishes.length > 0 || pending.removeDishIds.size > 0
  }

  const createDeferredMutation = (): DeferredMutation => {
    let resolve!: () => void
    let reject!: (error: unknown) => void
    const promise = new Promise<void>((nextResolve, nextReject) => {
      resolve = nextResolve
      reject = nextReject
    })
    return { promise, resolve, reject }
  }

  const clearScheduledFlush = () => {
    if (flushTimerRef.current) {
      window.clearTimeout(flushTimerRef.current)
      flushTimerRef.current = null
    }
  }

  const scheduleFlush = () => {
    if (mode !== 'backend') return
    clearScheduledFlush()
    flushTimerRef.current = window.setTimeout(() => {
      void flushPendingCartMutations()
    }, DEBOUNCE_MS)
  }

  const markMutation = () => {
    mutationVersionRef.current += 1
    scheduleFlush()
  }

  const setLastCheckoutCart = (cart: Cart | null) => {
    setLastCheckoutCartState(cart)
  }

  const setPendingCheckoutCart = (cart: Cart | null) => {
    setPendingCheckoutCartState(cart)
  }

  const setPendingPaymentReference = (reference: string | null) => {
    setPendingPaymentReferenceState(reference)
  }

  const flushPendingCartMutations = async () => {
    if (mode !== 'backend') return
    if (isFlushingRef.current) return
    if (!hasPendingMutations()) return

    const activeToken = ensureBackendToken()
    clearScheduledFlush()
    isFlushingRef.current = true
    setSyncing(true)
    const startVersion = mutationVersionRef.current

    const pending = pendingMutationsRef.current
    pendingMutationsRef.current = createPendingMutations()

    try {
      let nextCart = cloneCart(serverCartRef.current)

      if (pending.clearCartRequested) {
        if (nextCart.paymentLocked && pendingPaymentReferenceRef.current) {
          await cancelPaymentInBackend(activeToken, pendingPaymentReferenceRef.current)
        }

        nextCart = await deleteCartInBackend(activeToken)
        setServerCart(nextCart)
        setPendingCheckoutCartState(null)
        setPendingPaymentReferenceState(null)
        if (mutationVersionRef.current === startVersion && !hasPendingMutations()) {
          setBackendCart(nextCart)
          setActiveDishId(null)
        }
        setLocationIdState(nextCart.locationId ?? '')
        setLocationNoteState(nextCart.locationNote ?? '')
        setReferralCodeState(nextCart.referralCode ?? '')
        clearCartDeferredRef.current?.resolve()
        clearCartDeferredRef.current = null
        return
      }

      const tempDishIdMap = new Map<string, string>()
      const existingDishIds = new Set(nextCart.dishes.map((dish) => dish.id))

      for (const create of pending.addDishes) {
        nextCart = await createCartOrderInBackend(activeToken, create.restaurantId)
        const createdDish = nextCart.dishes.find((dish) => !existingDishIds.has(dish.id)) ?? nextCart.dishes[nextCart.dishes.length - 1]
        if (createdDish) {
          tempDishIdMap.set(create.tempDishId, createdDish.id)
          existingDishIds.add(createdDish.id)
        }
      }

      for (const mutation of pending.quantities.values()) {
        const resolvedDishId = tempDishIdMap.get(mutation.dishId) ?? mutation.dishId
        const targetDish = nextCart.dishes.find((dish) => dish.id === resolvedDishId)
        if (!targetDish) continue

        const existingLine = targetDish.items.find((entry) => entry.itemId === mutation.itemId)

        if (existingLine?.cartItemId) {
          nextCart = mutation.qty <= 0
            ? await deleteCartItemInBackend(activeToken, existingLine.cartItemId)
            : await updateCartItemInBackend(activeToken, existingLine.cartItemId, mutation.qty)
          continue
        }

        if (mutation.qty > 0 && targetDish.backendOrderId) {
          nextCart = await addCartItemInBackend(activeToken, targetDish.backendOrderId, mutation.itemId, mutation.qty)
        }
      }

      for (const dishId of pending.removeDishIds) {
        const resolvedDishId = tempDishIdMap.get(dishId) ?? dishId
        const dish = nextCart.dishes.find((entry) => entry.id === resolvedDishId)
        if (!dish?.backendOrderId) continue
        nextCart = await deleteCartOrderInBackend(activeToken, dish.backendOrderId)
      }

      setServerCart(nextCart)
      setLocationIdState(nextCart.locationId ?? locationIdRef.current)
      setLocationNoteState(nextCart.locationNote ?? locationNoteRef.current)
      setReferralCodeState(nextCart.referralCode ?? referralCodeRef.current)
      if (mutationVersionRef.current === startVersion && !hasPendingMutations()) {
        setBackendCart(nextCart)
        setActiveDishId((current) => nextCart.dishes.find((dish) => dish.id === current) ? current : (nextCart.dishes[0]?.id ?? null))
      }
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Unable to sync cart changes'
      setError(message)
      try {
        const refreshed = await fetchCartFromBackend(activeToken)
        setServerCart(refreshed)
        setBackendCart(refreshed)
        setLocationIdState(refreshed.locationId ?? '')
        setLocationNoteState(refreshed.locationNote ?? '')
        setReferralCodeState(refreshed.referralCode ?? '')
        setActiveDishId(refreshed.dishes[0]?.id ?? null)
      } catch {
        setServerCart(emptyCart())
        setBackendCart(emptyCart())
        setActiveDishId(null)
      }
      pendingMutationsRef.current = createPendingMutations()
      clearCartDeferredRef.current?.reject(nextError)
      clearCartDeferredRef.current = null
      throw nextError
    } finally {
      isFlushingRef.current = false
      setSyncing(false)
      if (!pending.clearCartRequested && clearCartDeferredRef.current) {
        clearCartDeferredRef.current.resolve()
        clearCartDeferredRef.current = null
      }
      if (hasPendingMutations()) scheduleFlush()
    }
  }

  const setLocationId = async (value: string) => {
    setLocationIdState(value)

    if (mode === 'mock') {
      syncMockDraftLocation(value, locationNote)
      return
    }

    ensureCartUnlocked()
    if (!token || serverCart.id === 'cart-empty') return

    setSyncing(true)
    try {
      const nextCart = await updateCartLocationInBackend(token, value || null)
      setServerCart(nextCart)
      setBackendCart(nextCart)
      setLocationIdState(nextCart.locationId ?? '')
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to update location')
      throw nextError
    } finally {
      setSyncing(false)
    }
  }

  const setLocationNote = (value: string) => {
    setLocationNoteState(value)
    if (mode === 'mock') syncMockDraftLocation(locationId, value)
  }

  const setReferralCode = (value: string) => {
    setReferralCodeState(value)
  }

  const applyReferralCode = async () => {
    if (mode === 'mock') return
    const activeToken = ensureBackendToken()
    ensureCartUnlocked()
    if (serverCart.id === 'cart-empty') throw new Error('Add items before applying referral code')

    setSyncing(true)
    try {
      const nextCart = await updateCartReferralInBackend(activeToken, referralCode.trim() || null)
      setServerCart(nextCart)
      setBackendCart(nextCart)
      setReferralCodeState(nextCart.referralCode ?? '')
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Unable to apply referral code'
      setError(message)
      if (/invalid referral/i.test(message)) throw new Error('Referral code not found')
      throw nextError
    } finally {
      setSyncing(false)
    }
  }

  const clearReferralCode = async () => {
    setReferralCodeState('')
    if (mode === 'mock') return
    const activeToken = ensureBackendToken()
    ensureCartUnlocked()
    if (serverCart.id === 'cart-empty') return

    setSyncing(true)
    try {
      const nextCart = await updateCartReferralInBackend(activeToken, null)
      setServerCart(nextCart)
      setBackendCart(nextCart)
      setReferralCodeState(nextCart.referralCode ?? '')
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to clear referral code')
      throw nextError
    } finally {
      setSyncing(false)
    }
  }

  const saveCheckoutInfo = async () => {
    if (mode === 'mock') return
    await flushPendingCartMutations()
    const activeToken = ensureBackendToken()
    ensureCartUnlocked()
    if (serverCart.id === 'cart-empty') return

    setSyncing(true)
    try {
      let nextCart = serverCart

      if ((locationId || '') !== (serverCart.locationId ?? '')) {
        nextCart = await updateCartLocationInBackend(activeToken, locationId || null)
      }

      if ((locationNote || '') !== (nextCart.locationNote ?? '')) {
        nextCart = await updateCartInfoInBackend(activeToken, locationNote)
      }

      if ((referralCode || '') !== (nextCart.referralCode ?? '')) {
        nextCart = await updateCartReferralInBackend(activeToken, referralCode.trim() || null)
      }

      setServerCart(nextCart)
      setBackendCart(nextCart)
      setLocationIdState(nextCart.locationId ?? '')
      setLocationNoteState(nextCart.locationNote ?? '')
      setReferralCodeState(nextCart.referralCode ?? '')
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to save checkout info')
      throw nextError
    } finally {
      setSyncing(false)
    }
  }

  const addDish = async (restaurantId?: string | null) => {
    if (mode === 'mock') {
      setCartDraft((current) => {
        const nextDish = createDish(current.dishes.length + 1)
        return {
          ...current,
          restaurantId: restaurantId ?? current.restaurantId,
          dishes: [...current.dishes, nextDish],
          activeDishId: nextDish.id,
        }
      })
      return
    }

    ensureCartUnlocked()
    const targetRestaurantId = restaurantId ?? backendCart.dishes[0]?.restaurantId ?? backendCart.restaurantId
    if (!targetRestaurantId) throw new Error('Select restaurant before creating dish')

    const optimistic = createOptimisticDish(backendCart, targetRestaurantId)
    const createdDish = optimistic.dishes[optimistic.dishes.length - 1]
    setBackendCart(optimistic)
    setActiveDishId(createdDish?.id ?? null)

    const pending = pendingMutationsRef.current
    if (pending.clearCartRequested) pending.clearCartRequested = false
    if (createdDish) pending.addDishes.push({ tempDishId: createdDish.id, restaurantId: targetRestaurantId })
    markMutation()
  }

  const removeDish = async (dishId: string) => {
    if (mode === 'mock') {
      setCartDraft((current) => {
        const nextDishes = current.dishes.filter((dish) => dish.id !== dishId)
        return {
          ...current,
          dishes: nextDishes,
          activeDishId: current.activeDishId === dishId ? (nextDishes[0]?.id ?? null) : current.activeDishId,
        }
      })
      return
    }

    ensureCartUnlocked()
    const optimistic = cloneCart(backendCart)
    optimistic.dishes = optimistic.dishes.filter((dish) => dish.id !== dishId)
    optimistic.items = optimistic.dishes.flatMap((dish) => dish.items)
    optimistic.updatedAt = new Date().toISOString()
    setBackendCart(optimistic)
    setActiveDishId((current) => current === dishId ? (optimistic.dishes[0]?.id ?? null) : current)

    const pending = pendingMutationsRef.current
    pending.clearCartRequested = false
    pending.addDishes = pending.addDishes.filter((entry) => entry.tempDishId !== dishId)
    pending.removeDishIds.add(dishId)
    for (const [key, mutation] of pending.quantities.entries()) {
      if (mutation.dishId === dishId) pending.quantities.delete(key)
    }
    markMutation()
  }

  const setActiveDish = (dishId: string) => {
    setActiveDishId(dishId)
    if (mode === 'mock') {
      setCartDraft((current) => ({ ...current, activeDishId: dishId }))
    }
  }

  const getQuantity = (itemId: string, dishId?: string | null) => {
    if (mode === 'mock') {
      const targetDishId = dishId ?? cartDraft.activeDishId
      const dish = cartDraft.dishes.find((entry) => entry.id === targetDishId)
      return dish?.quantities[itemId] ?? 0
    }

    const targetDishId = dishId ?? activeDishId
    const dish = backendCart.dishes.find((entry) => entry.id === targetDishId)
    const line = dish?.items.find((entry) => entry.itemId === itemId)
    return line?.qty ?? 0
  }

  const getStepSize = (restaurantId: string) => {
    if (mode === 'backend') return 1
    const restaurant = findMockRestaurantById(restaurantId)
    return restaurant?.supportsHalfPortions ? 0.5 : 1
  }

  const setQuantity = async (restaurantId: string, itemId: string, qty: number, dishId?: string | null) => {
    if (mode === 'mock') {
      const restaurant = findMockRestaurantById(restaurantId)
      const item = findMockMenuItemById(itemId)
      if (!restaurant || !item) return

      setCartDraft((current) => {
        const isSwitchingRestaurant = Boolean(current.restaurantId && current.restaurantId !== restaurantId)
        const baseDishes = isSwitchingRestaurant
          ? [createDish(1)]
          : current.dishes.length > 0
            ? current.dishes.map((dish) => ({ ...dish, quantities: { ...dish.quantities } }))
            : [createDish(1)]

        const targetDishId = dishId ?? current.activeDishId ?? baseDishes[0].id
        const targetDish = baseDishes.find((dish) => dish.id === targetDishId) ?? baseDishes[0]

        if (qty <= 0) delete targetDish.quantities[itemId]
        else targetDish.quantities[itemId] = Number(qty.toFixed(2))

        return {
          ...current,
          restaurantId,
          dishes: baseDishes,
          activeDishId: targetDish.id,
        }
      })
      return
    }

    ensureCartUnlocked()
    const nextQty = Math.max(0, Math.round(qty))
    const optimistic = applyOptimisticCartQuantity({
      cart: backendCart,
      restaurantId,
      itemId,
      qty: nextQty,
      dishId,
      fallbackDishId: activeDishId,
    })

    setBackendCart(optimistic.cart)
    setActiveDishId(optimistic.activeDishId)

    const targetDishId = optimistic.activeDishId ?? dishId ?? activeDishId ?? optimistic.cart.dishes[0]?.id
    if (!targetDishId) return

    const pending = pendingMutationsRef.current
    if (pending.clearCartRequested) pending.clearCartRequested = false

    const optimisticDish = optimistic.cart.dishes.find((entry) => entry.id === targetDishId)
    const needsDishCreate = Boolean(
      optimisticDish
      && !optimisticDish.backendOrderId
      && !pending.addDishes.find((entry) => entry.tempDishId === targetDishId),
    )

    if (needsDishCreate) {
      pending.addDishes.push({
        tempDishId: targetDishId,
        restaurantId,
      })
    }

    pending.quantities.set(`${targetDishId}:${itemId}`, {
      dishId: targetDishId,
      itemId,
      restaurantId,
      qty: nextQty,
    })
    markMutation()
  }

  const hydrateFromOrder = (order: Order) => {
    const dishes = order.cart.dishes.length > 0
      ? order.cart.dishes.map((dish) => ({
          id: dish.id,
          label: dish.label,
          quantities: dish.items.reduce<Record<string, number>>((accumulator, item) => {
            accumulator[item.itemId] = item.qty
            return accumulator
          }, {}),
        }))
      : [{
          id: createDish(1).id,
          label: 'Dish 1',
          quantities: order.cart.items.reduce<Record<string, number>>((accumulator, item) => {
            accumulator[item.itemId] = item.qty
            return accumulator
          }, {}),
        }]

    setCartDraft({
      restaurantId: order.cart.restaurantId,
      dishes,
      activeDishId: dishes[0]?.id ?? null,
      locationId: order.locationId,
      locationNote: order.locationNote,
    })
  }

  const reorderFromHistory = async (entry: OrderHistoryEntry) => {
    const groups = entry.orders
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.available && item.exists && item.quantity > 0),
      }))
      .filter((group) => group.restaurantExists && group.items.length > 0)

    const addedItems = groups.reduce((sum, group) => sum + group.items.reduce((groupSum, item) => groupSum + item.quantity, 0), 0)
    const skippedItems = entry.totalItems - addedItems

    if (mode === 'mock') {
      const dishes = groups.map((group, index) => ({
        id: createDish(index + 1).id,
        label: `Dish ${index + 1}`,
        quantities: group.items.reduce<Record<string, number>>((accumulator, item) => {
          accumulator[item.menuItemId] = item.quantity
          return accumulator
        }, {}),
      }))

      setCartDraft({
        restaurantId: groups[0]?.restaurantId ?? null,
        dishes,
        activeDishId: dishes[0]?.id ?? null,
        locationId,
        locationNote,
      })

      return { addedItems, skippedItems }
    }

    const activeToken = ensureBackendToken()
    await flushPendingCartMutations()
    ensureCartUnlocked()
    setSyncing(true)

    try {
      let nextCart = await deleteCartInBackend(activeToken)

      for (const group of groups) {
        nextCart = await createCartOrderInBackend(activeToken, group.restaurantId)
        const createdDish = nextCart.dishes[nextCart.dishes.length - 1]
        if (!createdDish?.backendOrderId) throw new Error('Unable to rebuild dish group')

        for (const item of group.items) {
          nextCart = await addCartItemInBackend(activeToken, createdDish.backendOrderId, item.menuItemId, item.quantity)
        }
      }

      if (locationId) {
        nextCart = await updateCartLocationInBackend(activeToken, locationId)
      }

      setServerCart(nextCart)
      setBackendCart(nextCart)
      setActiveDishId(nextCart.dishes[0]?.id ?? null)
      setLocationIdState(nextCart.locationId ?? locationId)
      setLocationNoteState(nextCart.locationNote ?? locationNote)
      setReferralCodeState(nextCart.referralCode ?? referralCode)

      return { addedItems, skippedItems }
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to reorder items')
      throw nextError
    } finally {
      setSyncing(false)
    }
  }

  const refreshCart = async () => {
    if (mode === 'mock' || !token) return
    pendingMutationsRef.current = createPendingMutations()
    clearScheduledFlush()
    setSyncing(true)
    try {
      const nextCart = await fetchCartFromBackend(token)
      setServerCart(nextCart)
      setBackendCart(nextCart)
      setLocationIdState(nextCart.locationId ?? '')
      setLocationNoteState(nextCart.locationNote ?? '')
      setReferralCodeState(nextCart.referralCode ?? '')
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'Unable to refresh cart')
      throw nextError
    } finally {
      setSyncing(false)
    }
  }

  const checkout = async () => {
    if (mode === 'mock') {
      const cart = evaluateCart(cartDraft)
      setLastCheckoutCartState(cart)
      setCartDraft(defaultDraft)
      return cart
    }

    throw new Error('Direct backend checkout deprecated. Use payment initialize flow.')
  }

  const clearCart = async () => {
    if (mode === 'mock') {
      setCartDraft(defaultDraft)
      setBackendCart(emptyCart())
      setActiveDishId(null)
      return
    }

    const deferred = createDeferredMutation()
    clearCartDeferredRef.current = deferred

    const nextCart = emptyCart()
    setBackendCart(nextCart)
    setActiveDishId(null)
    const pending = createPendingMutations()
    pending.clearCartRequested = true
    pendingMutationsRef.current = pending
    markMutation()

    return deferred.promise
  }

  const cart = useMemo(() => (
    mode === 'mock' ? evaluateCart(cartDraft) : backendCart
  ), [backendCart, cartDraft, mode])

  const value = {
    mode,
    ready: mode === 'mock' || !authLoading,
    syncing,
    error,
    cartDraft,
    cart,
    activeDishId: mode === 'mock' ? cartDraft.activeDishId : activeDishId,
    locationId,
    locationNote,
    referralCode,
    setLocationId,
    setLocationNote,
    setReferralCode,
    applyReferralCode,
    clearReferralCode,
    saveCheckoutInfo,
    addDish,
    removeDish,
    setActiveDish,
    getQuantity,
    setQuantity,
    getStepSize,
    hydrateFromOrder,
    reorderFromHistory,
    refreshCart,
    flushPendingCartMutations,
    checkout,
    clearCart,
    lastCheckoutCart,
    pendingCheckoutCart,
    pendingPaymentReference,
    setLastCheckoutCart,
    setPendingCheckoutCart,
    setPendingPaymentReference,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
