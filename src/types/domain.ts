export type CurrencyCode = 'NGN'

export type Money = {
  currency: CurrencyCode
  amount: number
}

export type Restaurant = {
  id: string
  name: string
  cuisine: string | null
  imageUrl: string | null
  deliveryTimeText: string | null
  deliveryTimeMin: number | null
  deliveryTimeMax: number | null
  isOpen: boolean | null
  rating: number | null
  description: string | null
  supportsHalfPortions: boolean
  supportsFractionalQuantity?: boolean
  quantityStep?: number
  promoText?: string | null
  platePrice?: Money | null
  deliveryFee?: Money | null
  totalMenuItems?: number | null
}

export type MenuCategory = {
  id: string
  restaurantId: string
  name: string
  sortOrder: number
}

export type MenuItem = {
  id: string
  restaurantId: string
  categoryId: string
  categoryName?: string | null
  name: string
  description?: string | null
  imageUrl?: string | null
  price: Money
  isAvailable: boolean
  maxPortion?: number | null
  dishType?: string | null
  supportsFractionalQuantity?: boolean
  quantityStep?: number
}

export type DeliveryZone = {
  id: string
  label: string
  description: string | null
  fee: Money | null
}

export type CartDishDraft = {
  id: string
  label: string
  quantities: Record<string, number>
}

export type CartDraft = {
  restaurantId: string | null
  dishes: CartDishDraft[]
  activeDishId: string | null
  locationId: string
  locationNote: string
}

export type CartLine = {
  cartItemId?: string
  itemId: string
  dishId: string
  backendOrderId?: string
  dishLabel: string
  name: string
  imageUrl?: string
  unitPrice: Money
  qty: number
  lineTotal: Money
}

export type CartDish = {
  id: string
  backendOrderId?: string
  label: string
  restaurantId?: string | null
  restaurantName?: string | null
  items: CartLine[]
  subtotal: Money
}

export type CartPricingSummary = {
  itemsTotal: Money
  deliveryFee: Money
  handlingFee: Money
  surcharge: Money
  extraOrderCharge: Money
  transactionFee: Money
  serviceCharge: Money
  discount: Money
  subTotal: Money
  total: Money
}

export type Cart = {
  id: string
  restaurantId: string | null
  restaurantName: string | null
  locationId?: string | null
  locationLabel?: string | null
  referralCode?: string | null
  locationNote?: string | null
  status?: string | null
  paymentLocked?: boolean
  dishes: CartDish[]
  items: CartLine[]
  subtotal: Money
  deliveryFee: Money
  total: Money
  pricing: CartPricingSummary
  updatedAt: string
}

export type CheckoutPreview = {
  cart: Cart
  location: DeliveryZone
  locationNote: string
}

export type SearchCatalogItem = MenuItem & {
  restaurantName: string
}

export type SearchCatalogResult = {
  restaurants: Restaurant[]
  items: SearchCatalogItem[]
}

export type RestaurantMenuResult = {
  restaurant: Restaurant
  categories: MenuCategory[]
  items: MenuItem[]
}

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'payment_failed'
  | 'awaiting_restaurant'

export type Order = {
  id: string
  status: OrderStatus
  cart: Cart
  locationId: string
  locationLabel: string
  locationNote: string
  paymentReference?: string
  createdAt: string
}

export type OrderHistoryEntryItem = {
  orderItemId: string
  menuItemId: string
  name: string | null
  imageUrl: string | null
  quantity: number
  exists: boolean
  available: boolean
}

export type OrderHistoryEntryGroup = {
  id: string
  restaurantId: string
  restaurantName: string | null
  restaurantExists: boolean
  allItemsAvailable: boolean
  availableItemCount: number
  items: OrderHistoryEntryItem[]
}

export type OrderHistoryEntry = {
  id: string
  createdAt: string
  canReorder: boolean
  orders: OrderHistoryEntryGroup[]
  totalItems: number
  availableItems: number
}

export type PaymentStatus = 'initialized' | 'pending' | 'success' | 'failed' | 'cancelled' | 'expired'

export type PaymentSession = {
  cartId: string
  provider: string
  reference: string
  authorizationUrl: string | null
  accessCode: string | null
  amount: number
  currency: CurrencyCode
  email: string
  status: PaymentStatus
}

export type PaymentRecord = {
  id: string
  cartId: string
  userId: string
  provider: string
  reference: string
  status: PaymentStatus
  amount: number
  currency: CurrencyCode
  email: string
  authorizationUrl: string | null
  accessCode: string | null
  callbackUrl: string | null
  paidAt: string | null
}

export type AnalyticsEvent = {
  name:
    | 'restaurant_viewed'
    | 'item_added'
    | 'item_removed'
    | 'cart_opened'
    | 'checkout_started'
    | 'payment_attempted'
    | 'payment_succeeded'
    | 'payment_failed'
    | 'search_performed'
    | 'reorder_started'
  payload: Record<string, string | number | boolean | null>
  createdAt: string
}

export type ApiErrorCode =
  | 'NETWORK_ERROR'
  | 'ITEM_UNAVAILABLE'
  | 'RESTAURANT_CLOSED'
  | 'EMPTY_CART'
  | 'INVALID_LOCATION'
  | 'PAYMENT_FAILED'
  | 'NOT_FOUND'

export class ApiError extends Error {
  code: ApiErrorCode
  retryable: boolean

  constructor(code: ApiErrorCode, message: string, retryable = false) {
    super(message)
    this.code = code
    this.retryable = retryable
  }
}
