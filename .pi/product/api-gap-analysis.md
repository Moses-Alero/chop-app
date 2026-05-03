# Choplink Frontend × API Gap Analysis

Date: 2026-05-01
Scope: Remaining gaps in application after frontend alignment to current backend contract in `.pi/spec/openapi.yaml` and `.pi/product/frontend-api-integration-guide.md`.

---

## 1. Summary

Frontend is now aligned to current backend-supported customer flow for:
- auth boot and session restore
- public discovery
- restaurant detail and menu
- public search
- locations list
- backend cart CRUD
- rider note sync
- referral code sync
- backend checkout

Biggest remaining gaps are no longer discovery/cart wiring gaps. Remaining gaps are now mainly:
1. unsupported backend product areas still absent from contract
2. frontend UX gaps around authenticated backend-cart usage
3. a few backend-dependent success states still rely on client snapshotting
4. documentation/setup clarity still pending

---

## 2. What Is Fully Integrated Now

### 2.1 Discovery
Integrated:
- `GET /restaurants`
- `GET /restaurants/{id}`
- `GET /restaurants/{id}/menu`
- `GET /search`
- `GET /locations`

Frontend behavior:
- null-safe rendering for optional restaurant metadata
- menu grouping by `category_name` with fallback behavior
- search renders restaurant hits and dish hits from backend

### 2.2 Auth
Integrated:
- `POST /auth/telegram`
- `GET /auth/me`
- bearer token persistence
- dev-token fallback using env configuration

### 2.3 Cart + Checkout
Integrated:
- `GET /cart/`
- `POST /cart/orders`
- `POST /cart/items`
- `PATCH /cart/items/{id}`
- `DELETE /cart/items/{id}`
- `PATCH /cart/location`
- `PATCH /cart/info`
- `PATCH /cart/referral`
- `POST /cart/checkout`

Frontend behavior:
- backend cart is source of truth in backend mode
- frontend dish groups map to `cart.orders[]`
- pricing renders backend summary exactly
- checkout routes directly to success because backend checkout is terminal step

---

## 3. Remaining Backend Contract Gaps

These are still missing from backend, so frontend cannot implement them as real product features yet.

### 3.1 Payment lifecycle
Still missing:
- `POST /payments/initialize`
- `POST /payments/verify`
- order/payment status lookup suitable for embedded Paystack flow

Impact:
- frontend cannot run real in-app Paystack flow against backend
- payment route must stay informational / disabled in aligned mode

### 3.2 Order history
Still missing:
- customer-facing order history endpoint
- order detail endpoint for historical lookup after checkout

Impact:
- history tab cannot show real backend orders
- success screen can only rely on client-side checkout snapshot, not refetchable backend order detail

### 3.3 Reorder
Still missing:
- reorder endpoint
- or historical order payload sufficient for frontend rebuild-cart flow

Impact:
- reorder remains unavailable in backend-aligned path

### 3.4 Fractional quantity
Still unsupported in contract:
- integer quantity only
- `supports_fractional_quantity` currently false
- `quantity_step` currently `1`

Impact:
- half-portion UX remains intentionally disabled in backend-integrated flow

---

## 4. Remaining Frontend Application Gaps

These are gaps in the app itself, not missing backend endpoints.

### 4.1 Auth UX is functional but not polished
Current frontend:
- browse works without auth
- backend cart actions fail if no Telegram init data and no dev bearer token
- error path exists, but explicit sign-in guidance is minimal

Impact:
- backend-mode local/dev experience can confuse users when they reach cart mutation without valid auth source

Recommended fix:
- add dedicated unauthenticated state / banner / CTA
- explain Telegram launch requirement or dev-token setup

### 4.2 Success page is session-backed only
Current frontend:
- success page reads last checked-out cart snapshot from session storage
- refreshing after session loss can drop success view

Reason:
- backend has no customer-facing order detail endpoint yet

Impact:
- confirmation page not refetchable after hard refresh

Recommended fix:
- add backend order detail endpoint later
- then swap success page to server-backed order lookup

### 4.3 Mock/backend boundary still visible in code structure
Current code still contains:
- `useMockApi.ts` name even though it now mixes backend discovery and mock fallback concerns
- legacy mock files supporting fallback mode

Impact:
- naming and ownership are less clear than ideal

Recommended fix:
- split into dedicated backend hooks and mock hooks
- isolate fallback/demo mode from main backend path

### 4.4 README / developer setup docs stale
Current repo README is still template-level and does not describe:
- backend mode env vars
- Telegram auth expectations
- dev bearer token fallback
- product-aligned route behavior changes

Impact:
- onboarding friction

Recommended fix:
- replace README with real setup/integration guide

---

## 5. Contract Clarifications Frontend Still Must Respect

These are not gaps, but critical rules that must stay enforced:
- `cart.orders[]` = frontend dish groups
- dish labels remain frontend-only display values
- `user_info` = rider note / order instructions
- location belongs to whole cart
- delivery fee must come from backend cart summary
- frontend must not recompute backend totals
- frontend must not expose half-step quantity in backend mode
- checkout success is order placement success, not payment-session initialization

---

## 6. Final Gap Verdict

Frontend is now substantially aligned to current backend spec.

Remaining work is mostly:
- waiting for backend product expansion around payment/history/reorder
- improving auth UX and internal code clarity
- replacing session-backed success snapshot with backend order detail when available
- improving developer docs/setup clarity

Note:
- Telegram WebApp bootstrap script is now loaded in `index.html`, so missing SDK-script initialization is no longer a frontend gap.

This means primary product path is now:
- browse
- search
- select items
- manage backend cart
- set location and rider note
- checkout
- success

And intentionally **not** yet:
- real payment lifecycle
- backend history
- reorder
- fractional quantity
