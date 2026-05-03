---

```md id="telegram-mini-app-prd-v3"
# Telegram Mini App – Frontend PRD (Food Ordering)

Date updated: 2026-05-01

---

## 1. Product Overview

### 1.1 Product Description

A mobile-first Telegram Mini App that enables users to:

- Browse restaurants
- Search restaurants and dishes
- Explore discovery sections for fast picks
- View menus
- Build one order from multiple **dish groups**
- Add multiple items under each dish group
- Review backend-driven pricing
- Add delivery notes to pinpoint rider drop-off
- Complete checkout inside the Mini App

### 1.2 Current Product Reality

Current implemented live path is:

```text
Home → Restaurant → Cart → Checkout → Success
```

This reflects current backend capabilities.

Currently implemented and aligned:
- Telegram Mini App initialization
- Telegram auth boot
- Restaurant discovery
- Search for restaurants and dishes
- Menu browsing
- Dish grouping
- Cart management
- Delivery location selection
- Rider note
- Referral code support
- Backend checkout
- Success confirmation

Currently **not** real backend product flows yet:
- payment initialize / verify lifecycle
- backend order history
- reorder
- fractional quantity / half-step quantity

---

### 1.3 Core Objective

Enable users to go from discovery → order placement as quickly as possible with:

- minimal interactions
- fast, responsive UI
- Telegram-native feel
- instant cart feedback
- clear checkout flow

---

## 2. Design Principles

### 2.1 UX Principles

- Minimal clicks
- Thumb-first interaction
- Progressive disclosure
- Instant feedback
- Zero cognitive overload
- Native Telegram feel (not generic web app)

### 2.2 Visual Design

- Neutral marketplace design
- Brand colors:
  - Primary: Calm Red (`#C84B4B`)
  - Secondary: Black (`#111111`)
  - Background: Theme-aware white / dark Telegram surfaces
- Compact rounded UI (**6px radius max** on core controls)
- Clean typography hierarchy
- Soft shadows, minimal borders
- Theme-aware surfaces for Telegram light and dark modes
- Avoid unnecessary gradients on core app UI

---

## 3. Telegram Mini App Integration

### 3.1 Required SDK Features

- `themeParams` → dynamic theming
- `MainButton` → supported where appropriate, but not sole CTA pattern
- `BackButton` → navigation
- `HapticFeedback` → micro interactions

### 3.2 Initialization Requirements

Application must:
- load Telegram WebApp bootstrap script
- read Telegram WebApp context
- read `initData`
- send `initData` to backend auth endpoint
- restore authenticated user session when token exists

### 3.3 UI Constraints

- Fullscreen immersive layout
- Safe area handling
- No browser-like feel
- Smooth app-like transitions
- Theme-aware light/dark support
- Brand red primary across web + Telegram

---

## 4. Feature: Restaurant Discovery

### 4.1 Objective

Allow users to quickly discover and select restaurants.

### 4.2 UI Components

- Header toolbar:
  - Location selector
  - Expandable search icon/input
  - Quick cart access
- Promotional banner card
  - Hero restaurant is selected randomly from fetched restaurant list
  - CTA routes directly to selected restaurant page
- Discovery modules:
  - Recommendations / fast picks
  - Image-led restaurant carousel
  - Carousel shows at most **5** restaurants at once
  - Carousel restaurants are selected randomly from fetched restaurant list
  - Carousel auto-advances between restaurants at timed intervals
- Restaurant Card:
  - Image
  - Name
  - Cuisine when available
  - Delivery time when available
  - Status (Open/Closed) when available
  - Rating when available

### 4.3 Interaction

- Search expands inline and searches restaurants and dishes
- Tap restaurant card → opens restaurant menu
- Tap dish search result → opens restaurant menu
- Tap `See All` on Home restaurant section → opens dedicated Restaurants listing page
- Discovery carousel supports timed auto-advance and manual dot navigation
- Bottom navigation gives access to Home, History, and Cart

### 4.4 UX Requirements

- Skeleton loading on initial load
- Lazy-loaded images
- Smooth scrolling
- Fast perceived performance
- Search should feel instant
- Discovery should reduce decision time, not add clutter

---

## 5. Feature: Menu Browsing & Item Selection

### 5.1 Objective

Enable fast multi-item / multi-dish selection with minimal friction.

### 5.2 Layout

- Sticky header:
  - Restaurant context
  - Back button
- Featured product / hero item block
- Dish-group rail for active dish selection
- Scrollable menu grouped by categories

### 5.3 Menu Item Component

- Name
- Price
- Description (optional)
- Image (optional)
- Quantity helper:

```
[+]  1  [-]
```

### 5.4 Interaction Model

- Default state: “Add” button
- On tap → transforms to quantity helper
- Add/remove updates cart instantly in UI
- Backend cart create/update happens in background where applicable
- User can create a new dish group and add items into that active dish

### 5.5 Quantity Rule

Current backend-aligned rule:
- quantity increments by `1`
- fractional quantity is not supported in live backend flow

### 5.6 Cart Indicator

Floating bottom bar:

```
3 items • ₦4,500 → View Cart
```

### 5.7 UX Requirements

- Instant feedback
- Haptic feedback on add/remove when Telegram context available
- No page reloads
- Maintain scroll position

---

## 6. Feature: Cart Management

### 6.1 Objective

Allow users to review and adjust selected items.

### 6.2 UI Components

- Dish-grouped item list:
  - Dish label
  - Items within dish
  - Quantity controls
  - Unit price
  - Line total
- Explicit remove dish-group action
- Empty cart state

### 6.3 Pricing Summary

Default cart presentation:
- Show total summary first
- On tap, open slide-up pricing breakdown sheet

Breakdown contents:
- Items total
- Delivery fee
- Handling fee
- Surcharge
- Transaction fee
- Discount
- Subtotal
- Total

### 6.4 CTA

Cart screen CTA is fixed **above bottom navigation**:

```
Proceed to Checkout
```

### 6.5 UX Requirements

- Real-time updates
- Clear hierarchy
- Efficient use of horizontal space
- Preserve dish grouping in cart review
- Empty cart renders dedicated state
- Quantity helper remains horizontal:

```
[+]  2  [-]
```

---

## 7. Feature: Checkout

### 7.1 Objective

Confirm order details and submit backend checkout.

### 7.2 Sections

#### 7.2.1 Delivery Location

- Location dropdown sourced from backend-configured delivery zones
- Required before proceeding
- Delivery fee comes from backend cart summary after sync

#### 7.2.2 Delivery Note

- Free-text note field
- Used to better pinpoint rider drop-off
- Required in current checkout flow

#### 7.2.3 Referral Code

- Optional input field
- Applied once per cart when backend supports it

#### 7.2.4 Order Summary

- Collapsible list of items grouped by dish

#### 7.2.5 Pricing Summary

- Collapsed total-first summary
- Expandable slide-up breakdown sheet

### 7.3 CTA

```
Place Order
```

### 7.4 Current Backend-Aligned Meaning

Current backend checkout behavior:
- finalizes active cart
- does **not** initialize payment session
- successful submit routes directly to success confirmation

---

## 8. Feature: Payment

### 8.1 Product Intention

Long-term goal:
- seamless embedded payment experience within Telegram

### 8.2 Current Limitation

This flow is **not yet supported by current backend contract**.

Missing backend capabilities:
- payment initialization endpoint
- payment verification endpoint
- pending order + payment lifecycle support

### 8.3 Product Rule Until Backend Support Exists

Frontend must not pretend full payment lifecycle exists in live aligned flow.

Current live path:

```text
Checkout → Success
```

---

## 9. Feature: Order Confirmation

### 9.1 Objective

Confirm successful order placement and next steps.

### 9.2 UI Components

- Success icon
- Message:

```
Your order has been placed and is awaiting restaurant approval
```

- Order summary grouped by dish
- Pricing summary
- Back to Home path

### 9.3 Current Data Source

Success screen currently uses checked-out cart snapshot stored in session.

---

## 10. Navigation

### 10.1 Model

Current primary areas:
- Home
- Restaurants
- History
- Cart

Transactional path:
- Home
- Restaurants
- Restaurant
- Cart
- Checkout
- Success

### 10.2 Controls

- Telegram BackButton when available
- App-level navigation patterns when not available
- Bottom navigation on primary screens

### 10.3 Behavior

- Preserve state between screens
- Keep interactions app-like and compact

---

## 11. State Management

### 11.1 Required States

- Restaurants
- Menu items
- Cart
- Dish groups within cart
- Pricing
- Checkout state
- Auth state
- History limitation state

### 11.2 Requirements

- Persist cart during session
- Sync with backend for pricing validation
- Use optimistic cart updates for snappy UX
- Reconcile optimistic state with backend response

---

## 12. Performance Requirements

- Fast first render
- UI response should feel immediate
- Smooth scrolling
- Lazy image loading
- Cart interactions should update instantly in visible UI

---

## 13. Edge Cases

- Empty cart
- Restaurant closed
- Item unavailable
- Search returns no results
- Delivery location not selected
- Delivery note missing or too vague
- Network failure
- Authentication failure
- Missing Telegram context in backend mode
- Dish group created but left empty
- Backend cart mutation rollback after optimistic UI update

---

## 14. Analytics

Track:
- Restaurant views
- Search queries
- Item additions/removals
- Cart opens
- Checkout starts
- Delivery zone selections
- Dish group creation / switching
- Re-order starts when/if supported later
- Payment attempts when/if supported later

---

## 15. MVP Scope

### Included in current implemented path

- Restaurant listing
- Discovery sections
- Search for restaurants and dishes
- Menu browsing
- Multi-dish selection
- Dish grouping within a single order
- Cart
- Checkout with location-based pricing and rider note
- Success confirmation
- Telegram-auth-aware backend integration

### Deferred / backend-limited

- Embedded Paystack payment
- Backend order history
- Re-order previous orders
- Fractional / half-step quantity

---

## 16. Success Metrics

Current useful metrics:
- Fast discovery to checkout completion
- Snappy add-to-cart perception
- Checkout completion success
- Low friction in dish-grouped ordering flow
- Readable UI in Telegram light and dark themes

---

## 17. Future Enhancements

- Embedded payment lifecycle
- Backend order history
- Reorder support
- Saved locations
- Promotions
- Order tracking
- Personalization
- Push notifications via bot

---

```

---
```