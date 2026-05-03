# Choplink Telegram Mini App – Implementation Plan

Date updated: 2026-05-01

---

## 1. Purpose

This document tracks current frontend implementation against:
- `.pi/spec/openapi.yaml`
- `.pi/product/frontend-api-integration-guide.md`
- `.pi/product/prd.md`
- `.pi/product/ui.md`

It reflects actual application state after backend alignment, Telegram initialization fixes, UI refresh, cart UX polish, and current QA coverage.

---

## 2. Current Runtime Strategy

Frontend runs in two modes.

### 2.1 Backend mode
Enabled when `VITE_API_BASE_URL` is set.

Uses backend for:
- Telegram auth boot
- current user restore
- public restaurant list
- public restaurant detail
- public restaurant menu
- public search
- public locations
- backend cart CRUD
- cart location sync
- rider note sync
- referral code sync
- cart checkout

### 2.2 Mock fallback mode
Used when backend base URL is not configured.

Purpose:
- deterministic local UI fallback
- Playwright/browser QA without Telegram auth dependency
- development without live backend

Important:
- Product-aligned live integration path is **backend mode**
- Fallback mode remains useful for visual and interaction QA

---

## 3. Feature Groups

### 3.1 App Foundation

**Implemented**
- `BrowserRouter`
- shared app shell
- bottom navigation
- Telegram/browser fallback main button support where still used
- safe-area aware mobile shell
- route splash overlay

**Notes**
- Router changed from `HashRouter` to `BrowserRouter` to avoid Telegram launch-context/hash conflicts during Mini App boot

**Status**
- [x] Complete

---

### 3.2 Telegram Mini App Initialization + Auth

**Implemented**
- Telegram WebApp bootstrap script loaded in `index.html`
  - `https://telegram.org/js/telegram-web-app.js`
- `TelegramProvider` handles:
  - `ready()`
  - `expand()`
  - theme variable mapping
  - haptics
  - Telegram chrome support
- `AuthProvider` supports:
  - `POST /auth/telegram` when Telegram `initData` exists
  - `GET /auth/me` for session restore
  - development bearer token via `VITE_API_BEARER_TOKEN`
- Bearer token persisted in session storage
- Startup toast behavior added:
  - shows error toast when Telegram context missing in backend mode
  - shows error toast when authentication fails

**Current behavior**
- Browse screens work without auth
- Backend cart and checkout actions require authenticated token
- Application now follows Telegram Mini App initialization path more closely than earlier versions

**Theme handling**
- App reads Telegram theme params for:
  - background
  - text
  - secondary background
  - hint color
- Primary app accent/button color is intentionally forced to brand red across platforms

**Status**
- [x] Complete
- [ ] Further UX polish for unauthenticated backend-cart attempts

---

### 3.3 Public Discovery Integration

**Implemented**
- `GET /restaurants`
- `GET /restaurants/{id}`
- `GET /restaurants/{id}/menu`
- `GET /search?q=...`
- `GET /locations`
- dedicated Restaurants listing page fed by public restaurant list
- randomized Home hero restaurant CTA
- randomized Home discovery carousel limited to at most 5 restaurants
- timed carousel auto-advance with manual dot navigation

**Frontend mapping updates**
- Uses public discovery endpoints instead of admin `GET /restaurant/*`
- Null-safe rendering for:
  - `description`
  - `cuisine`
  - `rating`
  - `is_open`
  - `delivery_time_text`
  - `promo_text`
- Menu grouped by `category_name`, fallback from `dish_type`

**Status**
- [x] Complete
- [x] Restaurants page added for `See All` navigation
- [x] Home discovery upgraded to randomized capped carousel

---

### 3.4 Cart Integration

**Implemented**
Backend cart is source of truth in backend mode.

Integrated endpoints:
- `GET /cart/`
- `POST /cart/orders`
- `POST /cart/items`
- `PATCH /cart/items/{id}`
- `DELETE /cart/items/{id}`
- `DELETE /cart/orders/{id}`
- `PATCH /cart/location`
- `PATCH /cart/info`
- `PATCH /cart/referral`
- `POST /cart/checkout`

**Frontend behavior**
- `cart.orders[]` mapped to frontend dish groups
- Dish labels remain frontend-only (`Dish 1`, `Dish 2`, ...)
- Explicit UI exists for deleting whole dish groups
- Quantity controls support inline updates
- Backend pricing fields rendered from cart summary

**Snappy UX improvement**
- In backend mode, item quantity changes now apply **optimistically**
- Cart and floating cart update immediately on add/remove
- Backend create/update runs in background
- On mutation failure, optimistic state rolls back and error handling still runs

**Important alignment**
- Backend cart replaces local pricing truth in backend mode
- Delivery fee comes from backend cart summary after location sync
- Frontend still accepts backend cart as final authority after mutation response

**Status**
- [x] Complete

---

### 3.5 Quantity Rules

**Implemented**
- Backend mode uses integer quantity only
- Effective step size in backend mode = `1`
- Frontend no longer depends on half-portion behavior for backend-integrated flow

**Current UI behavior**
- Shared quantity helper uses horizontal order:
  - `[+]  quantity  [-]`
- Used consistently across cart/menu surfaces using shared stepper component

**Status**
- [x] Complete

---

### 3.6 Checkout Integration

**Implemented**
- Delivery location selection
- Rider note field
- Optional referral code field
- Save checkout details to backend before submit
- Submit order with `POST /cart/checkout`

**Current product-aligned backend behavior**
- Checkout is terminal submission step
- Frontend routes directly to success after successful backend checkout
- No real payment initialization step is assumed in backend mode

**Cart page CTA change**
- Cart page now uses in-page fixed checkout CTA above bottom nav instead of relying on fallback main button
- Improves space usage and keeps checkout action visible inside page structure

**Status**
- [x] Complete

---

### 3.7 Pricing Breakdown UX

**Implemented**
- Pricing summary now defaults to collapsed total card
- Tapping pricing summary opens slide-up pricing breakdown sheet
- Sheet displays:
  - items total
  - delivery fee
  - handling fee
  - surcharge
  - transaction fee
  - discount
  - subtotal
  - total

**Intent**
- Preserve full pricing transparency
- Reduce visual weight on main cart/checkout screens
- Better match compact Telegram Mini App interaction style

**Status**
- [x] Complete

---

### 3.8 Payment Flow

**Current backend reality**
Not supported by backend contract yet.

**Frontend behavior now**
- Payment route no longer drives real backend-integrated order flow
- Backend-aligned flow goes checkout → success
- Payment page behavior remains limited / informational until backend adds real lifecycle support

**Status**
- [x] Aligned to backend limitation
- [ ] Re-enable real payment screen when backend adds initialize/verify lifecycle

---

### 3.9 Success Flow

**Implemented**
- Success screen renders from last checked-out cart snapshot stored in session
- Summary preserves dish grouping and pricing snapshot for post-checkout confirmation

**Status**
- [x] Complete
- [ ] Persist richer success details when backend adds order-detail endpoint

---

### 3.10 History / Reorder

**Current backend reality**
Not supported by current backend contract.

**Frontend behavior now**
- History screen intentionally replaced with limitation state in aligned flow
- Reorder flow removed from backend-aligned path

**Status**
- [x] Aligned to backend limitation

---

### 3.11 UI System / Visual Compliance

**Implemented**
- UI refreshed to stay close to established design system while better fitting Telegram expectations
- Reduced unnecessary gradients across surfaces
- Primary accent standardized to calm red brand color
- Border radius reduced to max 6px to match requested rules
- Light/dark adaptation improved for:
  - background
  - text
  - muted text
  - surfaces
  - borders
  - status pills
  - nav items
  - category tabs
- Category tab text forced black in both light and dark modes per latest request
- Brand primary remains red across web and Telegram platforms

**Current design rules reflected**
- compact cards
- restrained shadows
- no noisy gradients on core controls
- Telegram theme support for non-brand surfaces
- consistent red / black / white brand expression

**Status**
- [x] Complete
- [ ] Continue visual QA inside real Telegram dark/light themes

---

### 3.12 Testing / Compliance State

**Confirmed locally**
- TypeScript build passes
- Production build passes
- Playwright suite previously realigned and passing in fallback mode
- Evidence captured: videos, traces, screenshots, HTML report

**Important current note**
- Recent UI and routing changes introduced drift between current UI and some Playwright selectors/assumptions
- Full Playwright suite needs another refresh to match:
  - `BrowserRouter`
  - cart checkout button replacement
  - current payment/history route behavior
  - latest UI polish changes

**Validated patterns already exercised during previous pass**
- discovery to checkout success
- checkout validation guard rails
- search results flow
- payment route guard / unsupported flow handling
- empty cart state
- dish grouping + explicit dish-group removal
- history limitation state

**Status**
- [x] Build verified
- [ ] Playwright suite needs another update after latest UI/navigation changes

---

## 4. Files Updated During Current Alignment

Core frontend updates:
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/App.css`
- `src/index.css`
- `src/lib/backendApi.ts`
- `src/lib/telegram.tsx`
- `src/context/AuthContext.tsx`
- `src/context/CartContext.tsx`
- `src/pages/HomePage.tsx`
- `src/pages/RestaurantsPage.tsx`
- `src/pages/RestaurantPage.tsx`
- `src/pages/CartPage.tsx`
- `src/pages/CheckoutPage.tsx`
- `src/pages/PaymentPage.tsx`
- `src/pages/SuccessPage.tsx`
- `src/pages/HistoryPage.tsx`
- `src/components/PricingBlock.tsx`
- `src/components/QuantityStepper.tsx`
- `src/components/MenuItemCard.tsx`
- `src/types/domain.ts`

Support updates:
- `src/hooks/useMockApi.ts`
- `src/lib/mockApi.ts`
- `src/lib/mockData.ts`
- `review/compliance-summary.md`
- `e2e/app.spec.ts`
- `playwright.config.ts`

---

## 5. Final Alignment Summary

### Now aligned to backend spec
- public discovery endpoints
- public restaurant detail/menu
- public search
- public locations
- Telegram auth boot / bearer session restore
- backend cart CRUD
- rider note semantics via `user_info`
- cart-level location semantics
- backend-driven pricing summary
- checkout as terminal submit step

### Now aligned to latest UI/UX decisions
- Telegram bootstrap script included
- BrowserRouter used to avoid Telegram hash conflicts
- brand red forced across web + Telegram
- theme-aware surfaces/text for light/dark support
- compact 6px max border radius system
- optimistic cart add/update behavior for snappier UX
- collapsed pricing summary with slide-up full breakdown
- cart CTA fixed above bottom navigation

### Intentionally not implemented as real backend features yet
- Paystack initialize / verify flow
- order history
- reorder
- fractional / half-step quantity

---

## 6. Next Recommended Work

1. Refresh Playwright suite again to match latest routing + CTA + UI state
2. Improve unauthenticated backend-cart UX
3. Split backend hooks from legacy mock hooks for clarity
4. Validate dark/light theme rendering inside real Telegram runtime
5. Replace stale README with backend integration setup and env instructions
6. Add backend-mode authenticated QA pass for real Telegram auth + cart lifecycle
