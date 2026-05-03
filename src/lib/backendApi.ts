import type {
  Cart,
  CartDish,
  CartLine,
  CartPricingSummary,
  DeliveryZone,
  MenuCategory,
  MenuItem,
  OrderHistoryEntry,
  OrderHistoryEntryGroup,
  PaymentRecord,
  PaymentSession,
  Restaurant,
  RestaurantMenuResult,
  SearchCatalogResult,
} from "../types/domain";
import { money } from "./currency";
import {
  setRemoteDeliveryZones,
  setRemoteMenuItems,
  setRemoteRestaurants,
} from "./mockSelectors";

type ApiEnvelope<T> = {
  status: string;
  message?: string;
  result: T;
};

type ApiErrorEnvelope = {
  error?: string;
  message?: string;
};

type ApiUser = {
  id: number;
  telegram_id: number;
  username?: string | null;
  first_name: string;
  last_name?: string | null;
  photo_url?: string | null;
  email?: string | null;
};

type ApiAuthResult = {
  access_token: string;
  user: ApiUser;
};

type ApiRestaurant = {
  id: number;
  name: string;
  image_url?: string | null;
  plate_price?: number | null;
  delivery_fee?: number | null;
  total_menu_items?: number | null;
  description?: string | null;
  cuisine?: string | null;
  rating?: number | null;
  is_open?: boolean | null;
  delivery_time_text?: string | null;
  supports_fractional_quantity?: boolean;
  quantity_step?: number;
  promo_text?: string | null;
};

type ApiMenuItem = {
  id: number;
  restaurant_id?: number;
  name: string;
  image_url?: string | null;
  description?: string | null;
  price?: number | null;
  max_portion?: number | null;
  dish_type?: "main" | "side" | "drink" | "chicken" | string | null;
  category_name?: string | null;
  status?: "available" | "unavailable" | string | null;
  supports_fractional_quantity?: boolean;
  quantity_step?: number;
};

type ApiRestaurantDetail = {
  restaurant: ApiRestaurant;
  menu: ApiMenuItem[];
};

type ApiSearchDishResult = {
  id: number;
  name: string;
  image_url?: string | null;
  price: number;
  dish_type?: string | null;
  category_name?: string | null;
  restaurant: ApiRestaurant;
};

type ApiSearchResult = {
  query: string;
  restaurants: ApiRestaurant[];
  dishes: ApiSearchDishResult[];
};

type ApiLocation = {
  id: number;
  name: string;
};

type ApiOrderHistoryItem = {
  order_item_id: number;
  menu_item_id: number;
  name?: string | null;
  image_url?: string | null;
  quantity: number;
  exists: boolean;
  available: boolean;
};

type ApiOrderHistoryGroup = {
  id: number;
  restaurant_id: number;
  restaurant?: ApiRestaurant | null;
  restaurant_exists: boolean;
  all_items_available: boolean;
  available_item_count: number;
  items: ApiOrderHistoryItem[];
};

type ApiOrderHistoryEntry = {
  id: number;
  created_at: string;
  can_reorder: boolean;
  orders: ApiOrderHistoryGroup[];
};

type ApiCartSummary = {
  items_total: number;
  delivery_fee: number;
  handling_fee: number;
  surcharge: number;
  extra_order_charge: number;
  transaction_fee: number;
  service_charge: number;
  discount: number;
  sub_total: number;
  total: number;
};

type ApiCartItem = {
  id: number;
  quantity: number;
  item: ApiMenuItem;
};

type ApiCartOrder = {
  id: number;
  restaurant_id: number;
  restaurant: ApiRestaurant;
  items: ApiCartItem[];
  summary: ApiCartSummary;
};

type ApiCart = {
  id: number;
  location_id?: number | null;
  location?: ApiLocation | null;
  referral_code?: string | null;
  user_info?: string | null;
  payment_locked?: boolean;
  status?: string;
  orders: ApiCartOrder[];
  summary: ApiCartSummary;
};

type ApiPaymentInitializeResult = {
  provider: string;
  reference: string;
  authorization_url?: string | null;
  access_code?: string | null;
  amount: number;
  currency: string;
  email: string;
  status: PaymentSession["status"];
};

type ApiPayment = {
  id: number;
  cart_id: number;
  user_id: number;
  provider: string;
  reference: string;
  status: PaymentRecord["status"];
  amount: number;
  currency: string;
  email: string;
  authorization_url?: string | null;
  access_code?: string | null;
  callback_url?: string | null;
  paid_at?: string | null;
};

function emptyCart(): Cart {
  return {
    id: "cart-empty",
    restaurantId: null,
    restaurantName: null,
    locationId: null,
    locationLabel: null,
    referralCode: null,
    locationNote: null,
    status: "active",
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
  };
}

export type AppUser = {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string;
  lastName: string | null;
  photoUrl: string | null;
  email: string | null;
};

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "") ??
  "https://choplinks-bot.fly.dev";
const DEV_BEARER_TOKEN = import.meta.env.VITE_API_BEARER_TOKEN ?? "";
const PAYSTACK_PUBLIC_KEY =
  import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ??
  "pk_live_d96f96ba5ef003002e3cb36fc7473925d040f5c8";
const PAYMENT_CALLBACK_URL = import.meta.env.VITE_PAYMENT_CALLBACK_URL ?? "";

function moneyOrZero(amount?: number | null) {
  return money(typeof amount === "number" ? amount : 0);
}

export function shouldUseBackendApp(): boolean {
  return Boolean(API_BASE_URL);
}

export function getBootstrapBearerToken(): string | null {
  return DEV_BEARER_TOKEN || null;
}

export function getPaystackPublicKey(): string | null {
  return PAYSTACK_PUBLIC_KEY || null;
}

export function getPaymentCallbackUrl(): string {
  if (PAYMENT_CALLBACK_URL) return PAYMENT_CALLBACK_URL;
  if (typeof window !== "undefined")
    return `${window.location.origin}/payments/callback`;
  return "/payments/callback";
}

function buildUrl(path: string): string {
  if (!API_BASE_URL) throw new Error("Missing VITE_API_BASE_URL");
  return `${API_BASE_URL}${path}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as
    | ApiEnvelope<T>
    | ApiErrorEnvelope
    | null;

  if (!response.ok) {
    const message =
      data && typeof data === "object"
        ? "error" in data && typeof data.error === "string"
          ? data.error
          : data.message
        : null;
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (!data || !("result" in data)) {
    throw new Error("Invalid API response");
  }

  return data.result;
}

async function apiRequest<T>(
  path: string,
  init?: RequestInit & { token?: string | null },
): Promise<T> {
  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (init?.token) {
    headers.set("Authorization", `Bearer ${init.token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
  });

  return parseResponse<T>(response);
}

function parseDeliveryTimeBounds(text: string | null | undefined) {
  if (!text) return { min: null, max: null };
  const match = text.match(/(\d+)\D+(\d+)/);
  if (match) {
    return {
      min: Number(match[1]),
      max: Number(match[2]),
    };
  }

  const single = text.match(/(\d+)/);
  if (!single) return { min: null, max: null };
  const value = Number(single[1]);
  return { min: value, max: value };
}

function mapRestaurant(input: ApiRestaurant): Restaurant {
  const bounds = parseDeliveryTimeBounds(input.delivery_time_text);
  return {
    id: String(input.id),
    name: input.name,
    cuisine: input.cuisine ?? null,
    imageUrl: input.image_url ?? null,
    deliveryTimeText: input.delivery_time_text ?? null,
    deliveryTimeMin: bounds.min,
    deliveryTimeMax: bounds.max,
    isOpen: typeof input.is_open === "boolean" ? input.is_open : null,
    rating: typeof input.rating === "number" ? input.rating : null,
    description: input.description ?? null,
    supportsHalfPortions: Boolean(input.supports_fractional_quantity),
    supportsFractionalQuantity: Boolean(input.supports_fractional_quantity),
    quantityStep:
      typeof input.quantity_step === "number" ? input.quantity_step : 1,
    promoText: input.promo_text ?? null,
    platePrice: moneyOrZero(input.plate_price),
    deliveryFee: moneyOrZero(input.delivery_fee),
    totalMenuItems:
      typeof input.total_menu_items === "number"
        ? input.total_menu_items
        : null,
  };
}

function titleizeDishType(value: string | null | undefined): string {
  if (!value) return "Menu";
  if (value === "main") return "Main Dishes";
  if (value === "side") return "Sides";
  if (value === "drink") return "Drinks";
  if (value === "chicken") return "Proteins";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function mapMenuItem(input: ApiMenuItem, restaurantId: string): MenuItem {
  const categoryName = input.category_name ?? titleizeDishType(input.dish_type);
  const categoryId =
    categoryName.toLowerCase().replace(/\s+/g, "-") ||
    (input.dish_type ?? "menu");

  return {
    id: String(input.id),
    restaurantId,
    categoryId,
    categoryName,
    name: input.name,
    description: input.description ?? null,
    imageUrl: input.image_url ?? null,
    price: moneyOrZero(input.price),
    isAvailable: input.status !== "unavailable",
    maxPortion:
      typeof input.max_portion === "number" ? input.max_portion : null,
    dishType: input.dish_type ?? "menu",
    supportsFractionalQuantity: Boolean(input.supports_fractional_quantity),
    quantityStep:
      typeof input.quantity_step === "number" ? input.quantity_step : 1,
  };
}

function buildMenuCategories(
  restaurantId: string,
  items: MenuItem[],
): MenuCategory[] {
  const seen = new Map<string, MenuCategory>();

  items.forEach((item, index) => {
    const key = item.categoryId || "menu";
    if (seen.has(key)) return;

    seen.set(key, {
      id: key,
      restaurantId,
      name: item.categoryName ?? titleizeDishType(item.dishType),
      sortOrder: seen.size + index + 1,
    });
  });

  return Array.from(seen.values());
}

function mapLocation(input: ApiLocation): DeliveryZone {
  return {
    id: String(input.id),
    label: input.name,
    description: null,
    fee: null,
  };
}

function mapPricing(input: ApiCartSummary): CartPricingSummary {
  return {
    itemsTotal: moneyOrZero(input.items_total),
    deliveryFee: moneyOrZero(input.delivery_fee),
    handlingFee: moneyOrZero(input.handling_fee),
    surcharge: moneyOrZero(input.surcharge),
    extraOrderCharge: moneyOrZero(input.extra_order_charge),
    transactionFee: moneyOrZero(input.transaction_fee),
    serviceCharge: moneyOrZero(input.service_charge),
    discount: moneyOrZero(input.discount),
    subTotal: moneyOrZero(input.sub_total),
    total: moneyOrZero(input.total),
  };
}

function mapCart(input: ApiCart | null): Cart {
  if (!input) return emptyCart();

  const dishes = input.orders.map((order, index): CartDish => {
    const label = `Dish ${index + 1}`;
    const items = order.items.map(
      (entry): CartLine => ({
        cartItemId: String(entry.id),
        itemId: String(entry.item.id),
        dishId: `dish-${order.id}`,
        backendOrderId: String(order.id),
        dishLabel: label,
        name: entry.item.name,
        imageUrl: entry.item.image_url ?? undefined,
        unitPrice: moneyOrZero(entry.item.price),
        qty: entry.quantity,
        lineTotal: moneyOrZero((entry.item.price ?? 0) * entry.quantity),
      }),
    );

    return {
      id: `dish-${order.id}`,
      backendOrderId: String(order.id),
      label,
      restaurantId: String(order.restaurant_id),
      restaurantName: order.restaurant.name,
      items,
      subtotal: moneyOrZero(order.summary.items_total),
    };
  });

  const items = dishes.flatMap((dish) => dish.items);
  const firstRestaurant = input.orders[0]?.restaurant;
  const pricing = mapPricing(input.summary);

  return {
    id: String(input.id),
    restaurantId:
      input.orders.length === 1
        ? String(input.orders[0].restaurant_id)
        : firstRestaurant
          ? String(firstRestaurant.id)
          : null,
    restaurantName:
      input.orders.length === 1
        ? input.orders[0].restaurant.name
        : (firstRestaurant?.name ?? null),
    locationId: input.location_id ? String(input.location_id) : null,
    locationLabel: input.location?.name ?? null,
    referralCode: input.referral_code ?? null,
    locationNote: input.user_info ?? null,
    status: input.status ?? null,
    paymentLocked: Boolean(input.payment_locked),
    dishes,
    items,
    subtotal: pricing.subTotal,
    deliveryFee: pricing.deliveryFee,
    total: pricing.total,
    pricing,
    updatedAt: new Date().toISOString(),
  };
}

function setDiscoveryCaches(
  restaurants?: Restaurant[],
  items?: MenuItem[],
  zones?: DeliveryZone[],
) {
  if (restaurants) setRemoteRestaurants(restaurants);
  if (items) setRemoteMenuItems(items);
  if (zones) setRemoteDeliveryZones(zones);
}

function mapOrderHistoryGroup(
  input: ApiOrderHistoryGroup,
): OrderHistoryEntryGroup {
  return {
    id: String(input.id),
    restaurantId: String(input.restaurant_id),
    restaurantName: input.restaurant?.name ?? null,
    restaurantExists: input.restaurant_exists,
    allItemsAvailable: input.all_items_available,
    availableItemCount: input.available_item_count,
    items: input.items.map((item) => ({
      orderItemId: String(item.order_item_id),
      menuItemId: String(item.menu_item_id),
      name: item.name ?? null,
      imageUrl: item.image_url ?? null,
      quantity: item.quantity,
      exists: item.exists,
      available: item.available,
    })),
  };
}

function mapOrderHistoryEntry(input: ApiOrderHistoryEntry): OrderHistoryEntry {
  const orders = input.orders.map(mapOrderHistoryGroup);
  const totalItems = orders.reduce(
    (sum, group) =>
      sum + group.items.reduce((groupSum, item) => groupSum + item.quantity, 0),
    0,
  );
  const availableItems = orders.reduce(
    (sum, group) =>
      sum +
      group.items
        .filter((item) => item.available)
        .reduce((groupSum, item) => groupSum + item.quantity, 0),
    0,
  );

  return {
    id: String(input.id),
    createdAt: input.created_at,
    canReorder: input.can_reorder,
    orders,
    totalItems,
    availableItems,
  };
}

export async function authenticateTelegramUser(
  initData: string,
): Promise<{ token: string; user: AppUser }> {
  const result = await apiRequest<ApiAuthResult>("/auth/telegram", {
    method: "POST",
    body: JSON.stringify({ init_data: initData }),
  });

  return {
    token: result.access_token,
    user: mapUser(result.user),
  };
}

function mapUser(input: ApiUser): AppUser {
  return {
    id: String(input.id),
    telegramId: String(input.telegram_id),
    username: input.username ?? null,
    firstName: input.first_name,
    lastName: input.last_name ?? null,
    photoUrl: input.photo_url ?? null,
    email: input.email ?? null,
  };
}

export async function fetchCurrentUser(token: string): Promise<AppUser> {
  const result = await apiRequest<ApiUser>("/auth/me", {
    method: "GET",
    token,
  });

  return mapUser(result);
}

export async function fetchRestaurantsFromBackend(): Promise<Restaurant[]> {
  const result = await apiRequest<ApiRestaurant[]>("/restaurants", {
    method: "GET",
  });
  const restaurants = result.map(mapRestaurant);
  setDiscoveryCaches(restaurants);
  return restaurants;
}

export async function fetchRestaurantDetailFromBackend(
  restaurantId: string,
): Promise<RestaurantMenuResult> {
  const result = await apiRequest<ApiRestaurantDetail>(
    `/restaurants/${restaurantId}`,
    { method: "GET" },
  );
  const restaurant = mapRestaurant(result.restaurant);
  const items = result.menu.map((item) => mapMenuItem(item, restaurantId));
  const categories = buildMenuCategories(restaurantId, items);
  setDiscoveryCaches([restaurant], items);
  return { restaurant, items, categories };
}

export async function fetchRestaurantMenuFromBackend(
  restaurantId: string,
): Promise<RestaurantMenuResult> {
  const [restaurant, menu] = await Promise.all([
    apiRequest<ApiRestaurantDetail>(`/restaurants/${restaurantId}`, {
      method: "GET",
    }),
    apiRequest<ApiMenuItem[]>(`/restaurants/${restaurantId}/menu`, {
      method: "GET",
    }),
  ]);

  const mappedRestaurant = mapRestaurant(restaurant.restaurant);
  const items = menu.map((item) => mapMenuItem(item, restaurantId));
  const categories = buildMenuCategories(restaurantId, items);
  setDiscoveryCaches([mappedRestaurant], items);

  return {
    restaurant: mappedRestaurant,
    categories,
    items,
  };
}

export async function fetchSearchCatalogFromBackend(
  query: string,
): Promise<SearchCatalogResult> {
  const result = await apiRequest<ApiSearchResult>(
    `/search?q=${encodeURIComponent(query)}`,
    { method: "GET" },
  );

  return {
    restaurants: result.restaurants.map(mapRestaurant),
    items: result.dishes.map((dish) => ({
      ...mapMenuItem(
        {
          id: dish.id,
          restaurant_id: dish.restaurant.id,
          name: dish.name,
          image_url: dish.image_url ?? null,
          price: dish.price,
          dish_type: dish.dish_type ?? "menu",
          category_name: dish.category_name ?? null,
          status: "available",
          quantity_step: dish.restaurant.quantity_step ?? 1,
          supports_fractional_quantity:
            dish.restaurant.supports_fractional_quantity ?? false,
        },
        String(dish.restaurant.id),
      ),
      restaurantName: dish.restaurant.name,
    })),
  };
}

export async function fetchLocationsFromBackend(): Promise<DeliveryZone[]> {
  const result = await apiRequest<ApiLocation[]>("/locations", {
    method: "GET",
  });
  const locations = result.map(mapLocation);
  setDiscoveryCaches(undefined, undefined, locations);
  return locations;
}

export async function fetchOrderHistoryFromBackend(
  token: string,
): Promise<OrderHistoryEntry[]> {
  const result = await apiRequest<ApiOrderHistoryEntry[]>("/orders/history", {
    method: "GET",
    token,
  });

  return result.map(mapOrderHistoryEntry);
}

export async function fetchCartFromBackend(token: string): Promise<Cart> {
  const result = await apiRequest<ApiCart>("/cart/", { method: "GET", token });
  return mapCart(result);
}

export async function createCartOrderInBackend(
  token: string,
  restaurantId: string,
): Promise<Cart> {
  const result = await apiRequest<ApiCart>("/cart/orders", {
    method: "POST",
    token,
    body: JSON.stringify({ restaurant_id: Number(restaurantId) }),
  });
  return mapCart(result);
}

export async function addCartItemInBackend(
  token: string,
  orderId: string,
  menuItemId: string,
  quantity: number,
): Promise<Cart> {
  const result = await apiRequest<ApiCart>("/cart/items", {
    method: "POST",
    token,
    body: JSON.stringify({
      order_id: Number(orderId),
      menu_item_id: Number(menuItemId),
      quantity,
    }),
  });
  return mapCart(result);
}

export async function updateCartItemInBackend(
  token: string,
  cartItemId: string,
  quantity: number,
): Promise<Cart> {
  const result = await apiRequest<ApiCart>(`/cart/items/${cartItemId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ quantity }),
  });
  return mapCart(result);
}

export async function deleteCartItemInBackend(
  token: string,
  cartItemId: string,
): Promise<Cart> {
  const result = await apiRequest<ApiCart>(`/cart/items/${cartItemId}`, {
    method: "DELETE",
    token,
  });
  return mapCart(result);
}

export async function deleteCartOrderInBackend(
  token: string,
  orderId: string,
): Promise<Cart> {
  const result = await apiRequest<ApiCart>(`/cart/orders/${orderId}`, {
    method: "DELETE",
    token,
  });
  return mapCart(result);
}

export async function updateCartLocationInBackend(
  token: string,
  locationId: string | null,
): Promise<Cart> {
  const result = await apiRequest<ApiCart>("/cart/location", {
    method: "PATCH",
    token,
    body: JSON.stringify({
      location_id: locationId ? Number(locationId) : null,
    }),
  });
  return mapCart(result);
}

export async function updateCartInfoInBackend(
  token: string,
  note: string,
): Promise<Cart> {
  const result = await apiRequest<ApiCart>("/cart/info", {
    method: "PATCH",
    token,
    body: JSON.stringify({ user_info: note }),
  });
  return mapCart(result);
}

export async function updateCartReferralInBackend(
  token: string,
  referralCode: string | null,
): Promise<Cart> {
  const result = await apiRequest<ApiCart>("/cart/referral", {
    method: "PATCH",
    token,
    body: JSON.stringify({ referral_code: referralCode }),
  });
  return mapCart(result);
}

export async function deleteCartInBackend(token: string): Promise<Cart> {
  const result = await apiRequest<ApiCart | null>("/cart/", {
    method: "DELETE",
    token,
  });
  return mapCart(result);
}

function mapPaymentSession(
  input: ApiPaymentInitializeResult,
  cartId: string,
): PaymentSession {
  return {
    cartId,
    provider: input.provider,
    reference: input.reference,
    authorizationUrl: input.authorization_url ?? null,
    accessCode: input.access_code ?? null,
    amount: input.amount,
    currency: input.currency === "NGN" ? "NGN" : "NGN",
    email: input.email,
    status: input.status,
  };
}

function mapPaymentRecord(input: ApiPayment): PaymentRecord {
  return {
    id: String(input.id),
    cartId: String(input.cart_id),
    userId: String(input.user_id),
    provider: input.provider,
    reference: input.reference,
    status: input.status,
    amount: input.amount,
    currency: input.currency === "NGN" ? "NGN" : "NGN",
    email: input.email,
    authorizationUrl: input.authorization_url ?? null,
    accessCode: input.access_code ?? null,
    callbackUrl: input.callback_url ?? null,
    paidAt: input.paid_at ?? null,
  };
}

export async function initializePaymentInBackend(
  token: string,
  input: { cartId: string; email: string; callbackUrl: string },
): Promise<PaymentSession> {
  const result = await apiRequest<ApiPaymentInitializeResult>(
    "/payments/initialize",
    {
      method: "POST",
      token,
      body: JSON.stringify({
        cart_id: Number(input.cartId),
        email: input.email,
        callback_url: input.callbackUrl,
      }),
    },
  );
  return mapPaymentSession(result, input.cartId);
}

export async function verifyPaymentInBackend(
  token: string,
  reference: string,
): Promise<PaymentRecord> {
  const result = await apiRequest<ApiPayment>("/payments/verify", {
    method: "POST",
    token,
    body: JSON.stringify({ reference }),
  });
  return mapPaymentRecord(result);
}

export async function fetchPaymentStatusFromBackend(
  token: string,
  reference: string,
): Promise<PaymentRecord> {
  const result = await apiRequest<ApiPayment>(
    `/payments/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      token,
    },
  );
  return mapPaymentRecord(result);
}

export async function cancelPaymentInBackend(
  token: string,
  reference: string,
): Promise<PaymentRecord> {
  const result = await apiRequest<ApiPayment>("/payments/cancel", {
    method: "POST",
    token,
    body: JSON.stringify({ reference }),
  });
  return mapPaymentRecord(result);
}
