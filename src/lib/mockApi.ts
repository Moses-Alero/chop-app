import {
  ApiError,
  type Cart,
  type CartDish,
  type CartDraft,
  type CartLine,
  type CheckoutPreview,
  type DeliveryZone,
  type MenuCategory,
  type MenuItem,
  type Order,
  type OrderHistoryEntry,
  type PaymentSession,
  type Restaurant,
  type RestaurantMenuResult,
  type SearchCatalogResult,
} from '../types/domain'
import { money } from './currency'
import {
  findMockDeliveryZoneById,
  findMockMenuItemById,
  findMockRestaurantById,
  getMockDeliveryZones,
  getMockMenuCategories,
  getMockMenuItems,
  getMockRestaurants,
} from './mockSelectors'

const ORDER_HISTORY_STORAGE_KEY = 'choplink-order-history-v1'

const restaurants: Restaurant[] = getMockRestaurants()

const deliveryZones: DeliveryZone[] = getMockDeliveryZones()

const categories: MenuCategory[] = getMockMenuCategories()

const menuItems: MenuItem[] = getMockMenuItems()

const orderStore = new Map<string, Order>()

function wait(duration = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

function createError(code: ConstructorParameters<typeof ApiError>[0], message: string, retryable = false): never {
  throw new ApiError(code, message, retryable)
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readOrderHistory(): Order[] {
  if (!canUseStorage()) return []

  try {
    const raw = window.localStorage.getItem(ORDER_HISTORY_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Order[]
  } catch {
    return []
  }
}

function writeOrderHistory(orders: Order[]): void {
  if (!canUseStorage()) return
  window.localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orders.slice(0, 8)))
}

function saveOrderToHistory(order: Order): void {
  const history = readOrderHistory().filter((entry) => entry.id !== order.id)
  writeOrderHistory([order, ...history])
}

export function getRestaurantById(id: string): Restaurant | undefined {
  return findMockRestaurantById(id)
}

export function getItemById(id: string): MenuItem | undefined {
  return findMockMenuItemById(id)
}

export function getDeliveryZoneById(id: string): DeliveryZone | undefined {
  return findMockDeliveryZoneById(id)
}

export async function fetchRestaurants(): Promise<Restaurant[]> {
  await wait()
  return restaurants
}

export async function fetchDeliveryZones(): Promise<DeliveryZone[]> {
  await wait(150)
  return deliveryZones
}

function mapOrderToHistoryEntry(order: Order): OrderHistoryEntry {
  const orders = order.cart.dishes.map((dish) => ({
    id: dish.id,
    restaurantId: dish.restaurantId ?? order.cart.restaurantId ?? 'unknown',
    restaurantName: dish.restaurantName ?? order.cart.restaurantName ?? null,
    restaurantExists: true,
    allItemsAvailable: dish.items.every((item) => getItemById(item.itemId)?.isAvailable ?? false),
    availableItemCount: dish.items.filter((item) => getItemById(item.itemId)?.isAvailable ?? false).length,
    items: dish.items.map((item) => ({
      orderItemId: `${dish.id}-${item.itemId}`,
      menuItemId: item.itemId,
      name: item.name,
      imageUrl: item.imageUrl ?? null,
      quantity: item.qty,
      exists: Boolean(getItemById(item.itemId)),
      available: getItemById(item.itemId)?.isAvailable ?? false,
    })),
  }))

  const totalItems = order.cart.items.reduce((sum, item) => sum + item.qty, 0)
  const availableItems = orders.reduce((sum, group) => sum + group.items.filter((item) => item.available).reduce((groupSum, item) => groupSum + item.quantity, 0), 0)

  return {
    id: order.id,
    createdAt: order.createdAt,
    canReorder: orders.every((group) => group.items.length > 0 && group.items.every((item) => item.available)),
    orders,
    totalItems,
    availableItems,
  }
}

export async function fetchOrderHistory(): Promise<OrderHistoryEntry[]> {
  await wait(150)
  return readOrderHistory().map(mapOrderToHistoryEntry)
}

export async function fetchSearchCatalog(query: string): Promise<SearchCatalogResult> {
  await wait(180)
  const normalized = query.trim().toLowerCase()

  if (!normalized) {
    return {
      restaurants,
      items: menuItems.slice(0, 6).map((item) => ({
        ...item,
        restaurantName: getRestaurantById(item.restaurantId)?.name ?? 'Unknown Restaurant',
      })),
    }
  }

  return {
    restaurants: restaurants.filter((restaurant) => {
      const haystack = `${restaurant.name} ${restaurant.cuisine ?? ''} ${restaurant.description ?? ''}`.toLowerCase()
      return haystack.includes(normalized)
    }),
    items: menuItems
      .filter((item) => {
        const restaurantName = getRestaurantById(item.restaurantId)?.name ?? ''
        const haystack = `${item.name} ${item.description ?? ''} ${restaurantName}`.toLowerCase()
        return haystack.includes(normalized)
      })
      .map((item) => ({
        ...item,
        restaurantName: getRestaurantById(item.restaurantId)?.name ?? 'Unknown Restaurant',
      })),
  }
}

export async function fetchRestaurantMenu(restaurantId: string): Promise<RestaurantMenuResult> {
  await wait()
  const restaurant = getRestaurantById(restaurantId)
  if (!restaurant) createError('NOT_FOUND', 'Restaurant not found')

  return {
    restaurant,
    categories: categories
      .filter((category) => category.restaurantId === restaurantId)
      .sort((a, b) => a.sortOrder - b.sortOrder),
    items: menuItems.filter((item) => item.restaurantId === restaurantId),
  }
}

function lineFromItem(item: MenuItem, qty: number, dishId: string, dishLabel: string): CartLine {
  return {
    itemId: item.id,
    dishId,
    dishLabel,
    name: item.name,
    imageUrl: item.imageUrl ?? undefined,
    unitPrice: item.price,
    qty,
    lineTotal: money(item.price.amount * qty),
  }
}

export function evaluateCart(draft: CartDraft): Cart {
  const restaurant = draft.restaurantId ? getRestaurantById(draft.restaurantId) : undefined
  const zone = getDeliveryZoneById(draft.locationId)

  const dishes = draft.dishes
    .map((dish): CartDish => {
      const items = Object.entries(dish.quantities)
        .filter(([, qty]) => qty > 0)
        .map(([itemId, qty]) => {
          const item = getItemById(itemId)
          if (!item) return null
          return lineFromItem(item, qty, dish.id, dish.label)
        })
        .filter((line): line is CartLine => Boolean(line))

      const subtotal = money(items.reduce((sum, line) => sum + line.lineTotal.amount, 0))

      return {
        id: dish.id,
        label: dish.label,
        items,
        subtotal,
      }
    })
    .filter((dish) => dish.items.length > 0)

  const lines = dishes.flatMap((dish) => dish.items)
  const subtotalAmount = lines.reduce((sum, line) => sum + line.lineTotal.amount, 0)
  const subtotal = money(subtotalAmount)
  const fee = lines.length > 0 && zone?.fee ? zone.fee : money(0)

  const total = money(subtotal.amount + fee.amount)

  return {
    id: 'cart-dev',
    restaurantId: restaurant?.id ?? null,
    restaurantName: restaurant?.name ?? null,
    locationId: draft.locationId || null,
    locationLabel: zone?.label ?? null,
    referralCode: null,
    locationNote: draft.locationNote || null,
    status: 'active',
    dishes,
    items: lines,
    subtotal,
    deliveryFee: fee,
    total,
    pricing: {
      itemsTotal: subtotal,
      deliveryFee: fee,
      handlingFee: money(0),
      surcharge: money(0),
      extraOrderCharge: money(0),
      transactionFee: money(0),
      serviceCharge: money(0),
      discount: money(0),
      subTotal: subtotal,
      total,
    },
    updatedAt: new Date().toISOString(),
  }
}

export async function previewCheckout(draft: CartDraft): Promise<CheckoutPreview> {
  await wait(250)

  const zone = getDeliveryZoneById(draft.locationId)
  if (!zone) createError('INVALID_LOCATION', 'Select delivery area')
  if (!draft.locationNote.trim()) createError('INVALID_LOCATION', 'Add delivery note for rider')

  const cart = evaluateCart(draft)
  if (cart.items.length === 0) createError('EMPTY_CART', 'Cart is empty')

  return { cart, location: zone, locationNote: draft.locationNote }
}

export async function createOrder(input: { draft: CartDraft }): Promise<Order> {
  await wait(500)
  const cart = evaluateCart(input.draft)

  if (cart.items.length === 0) createError('EMPTY_CART', 'Cart is empty')
  if (!cart.restaurantId) createError('NOT_FOUND', 'Restaurant not found')

  const zone = getDeliveryZoneById(input.draft.locationId)
  if (!zone) createError('INVALID_LOCATION', 'Select delivery area')
  if (!input.draft.locationNote.trim()) createError('INVALID_LOCATION', 'Add delivery note for rider')

  const restaurant = getRestaurantById(cart.restaurantId)
  if (!restaurant?.isOpen) createError('RESTAURANT_CLOSED', 'Restaurant is currently closed')

  const unavailable = cart.items.find((line) => !getItemById(line.itemId)?.isAvailable)
  if (unavailable) createError('ITEM_UNAVAILABLE', `${unavailable.name} is unavailable`)

  const order: Order = {
    id: `ord_${Date.now()}`,
    status: 'pending_payment',
    cart,
    locationId: zone.id,
    locationLabel: zone.label,
    locationNote: input.draft.locationNote,
    createdAt: new Date().toISOString(),
  }

  orderStore.set(order.id, order)
  return order
}

export async function initPayment(orderId: string): Promise<PaymentSession> {
  await wait(700)
  const order = orderStore.get(orderId)
  if (!order) createError('NOT_FOUND', 'Order not found')

  const reference = `pay_${orderId}`
  orderStore.set(orderId, { ...order, paymentReference: reference })

  return {
    cartId: order.cart.id,
    provider: 'paystack',
    reference,
    authorizationUrl: `https://paystack.mock/inline/${reference}`,
    accessCode: null,
    amount: order.cart.total.amount,
    currency: 'NGN',
    email: 'mock@example.com',
    status: 'initialized',
  }
}

export async function resolvePayment(input: {
  orderId: string
  outcome: 'success' | 'failed'
}): Promise<Order> {
  await wait(1000)
  const order = orderStore.get(input.orderId)
  if (!order) createError('NOT_FOUND', 'Order not found')

  if (input.outcome === 'failed') {
    const failedOrder: Order = { ...order, status: 'payment_failed' }
    orderStore.set(order.id, failedOrder)
    createError('PAYMENT_FAILED', 'Payment failed. Try again.', true)
  }

  const paidOrder: Order = {
    ...order,
    status: 'awaiting_restaurant',
  }
  orderStore.set(order.id, paidOrder)
  saveOrderToHistory(paidOrder)
  return paidOrder
}

export async function getOrder(orderId: string): Promise<Order> {
  await wait(250)
  const order = orderStore.get(orderId) ?? readOrderHistory().find((entry) => entry.id === orderId)
  if (!order) createError('NOT_FOUND', 'Order not found')
  return order
}
