# Frontend API Integration Guide

Date: 2026-05-01
Scope: Customer-facing frontend integration against current backend capabilities without requiring backend data model changes.

## Purpose

This guide tells frontend exactly what is now safe to integrate, how to map current backend semantics to UI semantics, and which product behaviors remain intentionally unsupported.

Read alongside:

- `.pi/product/api-gap-analysis.md`
- `spec/openapi.yaml`
- `.pi/product/features/location-delivery-pricing.md`

---

## 1. Current Backend-Supported Customer Flow

Fully usable now:

1. Telegram auth boot
2. Fetch current user
3. Browse public restaurants
4. Fetch restaurant detail
5. Fetch restaurant menu
6. Search restaurants and dishes
7. List predefined locations
8. Create/update backend cart
9. Attach cart location
10. Attach rider note / instructions
11. Initialize payment
12. Verify payment after popup callback
13. Fetch payment status
14. Cancel pending payment when needed
15. Fetch backend order history for frontend-driven reorder

Still not real backend product flows yet:

- backend reorder endpoint
- fractional quantity / half-step quantity

---

## 2. Auth Integration

### 2.1 Authenticate Telegram mini app user

Endpoint:

- `POST /auth/telegram`

Request:

```json
{
  "init_data": "<telegram init data>"
}
```

Response:

- stores `result.access_token`
- stores `result.user`

Frontend rule:

- persist bearer token
- send on all cart endpoints as:
  - `Authorization: Bearer <token>`

### 2.2 Restore session

Endpoint:

- `GET /auth/me`

Use on app boot when token already stored.

Important:

- `result.user.email` may be `null` initially
- once frontend sends email during first payment initialize call, backend stores it on user profile
- frontend may use stored email as default on later payment attempts

---

## 3. Discovery / Browse

### 3.1 Restaurant list

Endpoint:

- `GET /restaurants`

Use for:

- home restaurant cards
- browse screens
- discovery list sections

Important payload notes:

- `description`, `cuisine`, `rating`, `is_open`, `delivery_time_text`, `promo_text` may be `null`
- do not assume they exist
- hide UI sections if null

Stable fields to use now:

- `id`
- `name`
- `image_url`
- `plate_price`
- `delivery_fee`
- `total_menu_items`

Capability flags:

- `supports_fractional_quantity` is currently `false`
- `quantity_step` is currently `1`

### 3.2 Restaurant detail

Endpoint:

- `GET /restaurants/{id}`

Use for:

- restaurant header / hero
- detail screen payload bootstrap

Response includes:

- `restaurant`
- `menu`

If frontend already fetches menu separately, this endpoint can still power detail header.

### 3.3 Restaurant menu only

Endpoint:

- `GET /restaurants/{id}/menu`

Use for:

- lightweight menu refresh
- menu-only route

Grouping guidance:

- group by `category_name`
- fallback group by `dish_type`

Current category mapping:

- `main` -> `Main Dishes`
- `side` -> `Sides`
- `drink` -> `Drinks`
- `chicken` -> `Proteins`

---

## 4. Search

Endpoint:

- `GET /search?q=<query>`

Response shape:

- `result.query`
- `result.restaurants[]`
- `result.dishes[]`

Frontend guidance:

- render restaurant hits and dish hits separately
- dish hit already includes restaurant summary
- no pagination yet
- no fuzzy matching guarantee
- empty query may return empty arrays

---

## 5. Location Flow

### 5.1 Fetch locations

Endpoint:

- `GET /locations`

Use for:

- location picker modal / screen

Important:

- these are predefined admin-managed fixed locations
- not GPS
- not address search
- not nearest-location API

### 5.2 Attach location to cart

Endpoint:

- `PATCH /cart/location`

Request:

```json
{
  "location_id": 1
}
```

Clear selection:

```json
{
  "location_id": null
}
```

Important semantics:

- location belongs to whole cart
- not individual dish group
- not individual item

### 5.3 Delivery fee display

Do **not** try to compute delivery from `/locations` alone.

Correct flow:

1. user selects location
2. call `PATCH /cart/location`
3. refresh or use returned cart payload
4. display `cart.summary.delivery_fee`

Why:

- delivery fee depends on selected location **and** unique restaurants present in cart
- if no restaurant-location override exists, backend falls back to restaurant default `delivery_fee`

---

## 6. Cart Semantics

### 6.1 Active cart

Endpoint:

- `GET /cart/`

Use as source of truth for:

- dish groups
- selected location
- rider note
- totals
- fees
- discounts
- payment lock state

Important:

- `cart.payment_locked = true` means payment has been initialized and cart can no longer be mutated until payment is either completed or cancelled/failed

### 6.2 Dish groups mapping

Backend cart child orders map to frontend dish groups.

Meaning:

- each entry in `cart.orders[]` = one frontend dish group
- labels like `Dish 1`, `Dish 2` are frontend-only display labels
- persistent backend ID for group is `cart.orders[].id`

### 6.3 Create dish group

Endpoint:

- `POST /cart/orders`

Request:

```json
{
  "restaurant_id": 1
}
```

Use when user wants:

- a new dish group from a restaurant
- another independent group from same restaurant

### 6.4 Add item to dish group

Endpoint:

- `POST /cart/items`

Request:

```json
{
  "order_id": 10,
  "menu_item_id": 4,
  "quantity": 2
}
```

Rule:

- must send exact `order_id`
- backend validates item belongs to same restaurant as target group

### 6.5 Update item quantity

Endpoint:

- `PATCH /cart/items/{id}`

Request:

```json
{
  "quantity": 3
}
```

Important:

- integer only
- no `0.5`
- no half portions in current backend contract

Frontend rule:

- disable fractional quantity controls
- stepper increment should be `1`

### 6.6 Delete item

Endpoint:

- `DELETE /cart/items/{id}`

Backend cleanup behavior:

- if group becomes empty, backend deletes that child order
- if cart becomes empty, backend deletes cart

### 6.7 Delete dish group

Endpoint:

- `DELETE /cart/orders/{id}`

### 6.8 Clear whole cart

Endpoint:

- `DELETE /cart/`

Use for:

- one-tap clear cart action
- reset cart before frontend-driven reorder rebuild

Behavior:

- deletes active cart if present
- if no active cart exists, backend still returns success
- response `result` will be `null`
- if `cart.payment_locked = true`, backend rejects clear-cart until payment is cancelled/failed

---

## 7. Rider Note / Instructions

Endpoint:

- `PATCH /cart/info`

Request:

```json
{
  "user_info": "Please call when rider arrives. No pepper."
}
```

Frontend meaning:

- treat `user_info` as rider note / delivery note / order instructions

Important:

- backend field name remains `user_info`
- product meaning for frontend should be rider/order note

---

## 8. Referral Code

Endpoint:

- `PATCH /cart/referral`

Request:

```json
{
  "referral_code": "AMB001"
}
```

Cart response will reflect discount in:

- `summary.discount`
- `summary.total`

Current rule:

- discount applied once per cart
- referral code must exist in ambassadors table
- sending `null` or empty string clears referral from cart
- unknown code returns error and cart referral is not updated

---

## 9. Cart Summary / Pricing

Use `cart.summary` as single source of truth.

Fields:

- `items_total`
- `delivery_fee`
- `handling_fee`
- `surcharge`
- `extra_order_charge`
- `transaction_fee`
- `service_charge`
- `discount`
- `sub_total`
- `total`

Pricing scope rules:

- `handling_fee` = summed from child orders
- `surcharge` = summed from child orders
- `extra_order_charge` = `300` for each extra child order after first
- `delivery_fee` = summed once per unique restaurant in cart
- `transaction_fee` = once per cart
- `service_charge` = fixed `500` once per cart
- `discount` = once per cart

Frontend rule:

- never recompute totals locally if backend cart response available
- display backend numbers exactly
- if cart has 1 dish group, expect `extra_order_charge = 0`
- if cart has 3 dish groups, expect `extra_order_charge = 600`
- every cart also includes fixed `service_charge = 500`

---

## 10. Payments / Checkout

### 10.1 Important routing change

Frontend should **not** use `POST /cart/checkout` anymore.

That route is deprecated for frontend payment flow.

Use this sequence instead:

1. `POST /payments/initialize`
2. open Paystack popup using returned authorization data
3. Paystack popup redirects to frontend callback page
4. frontend callback page calls `POST /payments/verify`
5. optional fallback poll: `GET /payments/{reference}`

### 10.2 Initialize payment

Endpoint:

- `POST /payments/initialize`

Request:

```json
{
  "cart_id": 12,
  "email": "user@example.com",
  "callback_url": "https://app.example.com/payments/callback"
}
```

Frontend rules:

- send active cart id
- send user email from checkout form or stored profile default
- send callback page URL that Paystack popup should redirect to after completion
- backend does **not** return Paystack public key; frontend owns that config

Backend behavior:

- validates cart
- requires selected cart location
- requires cart with items
- stores email on user profile for future default use
- allows only one pending payment per cart
- locks cart after successful initialization
- returns payment authorization details

### 10.3 Verify payment after callback

Endpoint:

- `POST /payments/verify`

Request:

```json
{
  "reference": "pay_1_1746212345"
}
```

Frontend callback page behavior:

1. read payment reference from Paystack callback/redirect context
2. call `POST /payments/verify`
3. trust backend response, not popup redirect alone
4. show success/failure/pending from backend status

Backend behavior:

- verifies server-side with provider
- if successful, marks child orders paid/completed and cart checked out
- if failed/cancelled, unlocks cart for edits

### 10.4 Payment status lookup

Endpoint:

- `GET /payments/{reference}`

Use for:

- popup recovery flow
- page refresh recovery
- polling fallback when callback verification is delayed

### 10.5 Cancel pending payment

Endpoint:

- `POST /payments/cancel`

Request:

```json
{
  "reference": "pay_1_1746212345"
}
```

Use for:

- popup closed by user
- abort checkout and unlock cart

### 10.6 Cart locking rules during payment

When payment has been initialized:

- `cart.payment_locked = true`
- frontend should disable all cart mutations
- backend rejects cart mutation requests while locked

Blocked while locked:

- add/remove items
- create/delete dish groups
- update rider note
- update location
- update referral
- clear whole cart

If payment is cancelled/failed:

- cart unlocks
- frontend may update cart again
- any new payment attempt should use a new initialization request

---

## 11. Order History

### 11.1 Fetch order history

Endpoints:

- `GET /orders/history`
- optional `GET /orders/history/{id}` for one dedicated previous-order screen

Use for:

- previous orders screen
- frontend-driven reorder flow
- checking whether previously ordered items still exist and are available

Response semantics:

- each history record represents one checked-out cart
- each `orders[]` entry is one historical dish group
- frontend should use `restaurant_id`, `menu_item_id`, and `quantity` to rebuild a new cart
- history does **not** preserve past selected location for reorder purposes
- frontend should use the user's current selected cart location when rebuilding and pricing a new cart

Availability fields:

- `can_reorder` = all groups contain at least one item and all items are currently available
- `orders[].restaurant_exists` = target restaurant still exists
- `orders[].all_items_available` = all items in that group are currently available
- `orders[].available_item_count` = number of items in that group currently available
- `orders[].items[].exists` = menu item still exists
- `orders[].items[].available` = menu item still exists and is currently available

Frontend reorder guidance:

1. fetch `GET /orders/history`
2. choose one history entry
3. for each history group, create new dish group with `POST /cart/orders { restaurant_id }`
4. for each item where `available = true`, call `POST /cart/items` with returned `order_id`, `menu_item_id`, and `quantity`
5. skip items where `available = false`
6. attach current selected location with `PATCH /cart/location`

Important:

- there is no backend reorder endpoint yet
- history is read-only support for frontend cart reconstruction
- if a restaurant or item no longer exists, frontend should show it as unavailable and skip it during reorder

## 12. Unsupported / Deferred Features

Frontend should not rely on these yet:

- fractional item quantity
- half-step quantity
- backend reorder endpoint
- guaranteed restaurant metadata for description/rating/cuisine/open-state

Graceful degradation rules:

- if metadata field is `null`, hide section
- if fractional quantity unsupported, use integer stepper only
- if no payment backend flow, keep payment UI behind feature flag or mock mode

---

## 13. Suggested Frontend Integration Order

### Phase 1

- auth boot
- `GET /restaurants`
- `GET /restaurants/{id}`
- `GET /restaurants/{id}/menu`
- `GET /search`
- `GET /locations`

### Phase 2

- `GET /cart/`
- `POST /cart/orders`
- `POST /cart/items`
- `PATCH /cart/items/{id}`
- `DELETE /cart/items/{id}`
- `DELETE /cart/orders/{id}`
- `DELETE /cart/`
- `PATCH /cart/location`
- `PATCH /cart/info`
- `PATCH /cart/referral`

### Phase 3

- `POST /payments/initialize`
- open provider popup
- frontend callback page -> `POST /payments/verify`
- optional `GET /payments/{reference}` fallback
- optional `POST /payments/cancel`
- success screen from verified payment response
- `GET /orders/history`

---

## 14. Example Minimal End-to-End Flow

1. Authenticate via `POST /auth/telegram`
2. Fetch restaurants via `GET /restaurants`
3. Fetch restaurant menu via `GET /restaurants/{id}/menu`
4. Create dish group via `POST /cart/orders`
5. Add menu item via `POST /cart/items`
6. Fetch locations via `GET /locations`
7. Attach location via `PATCH /cart/location`
8. Attach rider note via `PATCH /cart/info`
9. Optionally attach referral via `PATCH /cart/referral`
10. Show totals from `GET /cart/` or latest cart response
11. Initialize payment via `POST /payments/initialize`
12. Open Paystack popup using returned authorization details
13. Paystack redirects popup to frontend callback page
14. Callback page calls `POST /payments/verify`
15. If needed, poll `GET /payments/{reference}` or cancel via `POST /payments/cancel`
16. Render success from verified payment response
17. Later fetch `GET /orders/history` to show previous orders or rebuild a new cart in frontend
18. Optional clear-cart UX may call `DELETE /cart/` only when cart is not payment-locked

---

## 15. Backend Contract Notes for Frontend Team

### Use these as truth

- child cart order = dish group
- `user_info` = rider note / instructions
- quantity = integer only
- location belongs to cart
- referral code must exist in ambassadors table to apply discount
- `DELETE /cart/` clears active cart in one call when cart is not payment-locked
- payment init requires `cart_id`, `email`, and `callback_url`
- user email is persisted from first payment init and can be reused as default later
- backend does not return Paystack public key; frontend owns that config
- `cart.payment_locked = true` means all cart mutations must stop until payment resolves
- frontend callback page must call `POST /payments/verify`
- delivery fee depends on cart location and unique restaurants
- `extra_order_charge` = `300` for each extra dish group after first
- `service_charge` = fixed `500` per cart
- totals should come from backend response, not frontend recomputation

### Do not assume these yet

- backend reorder endpoint
- historical location snapshot for reorder
- map-based locations
- half portions
