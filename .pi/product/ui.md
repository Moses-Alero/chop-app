---

```md id="telegram-mini-app-ui-decisions"
# Telegram Mini App – UI Decisions & Design System

---

## 1. Overview

This document defines the current **UI/UX decisions, design system, and interaction patterns** for the Telegram Mini App.

### Primary Goal

Create a **fast, minimal, Telegram-native mobile ordering experience** with:

- fast discovery to checkout
- immediate cart feedback
- clean, compact UI
- strong brand identity using red, black, and white
- support for Telegram light and dark themes

---

## 2. Global Design Principles

### 2.1 UX Principles

- **Minimal Interaction**
  - Inline actions over extra screens
  - Keep ordering flow short

- **Thumb-First Design**
  - Primary actions must stay reachable near lower half of screen

- **Progressive Disclosure**
  - Show summary first
  - Expand details only when needed

- **Immediate Feedback**
  - Item add/remove should feel instant
  - Haptics and visual updates should happen quickly

- **No Interruptions**
  - Avoid modals when inline or sheet patterns work better
  - Prefer slide-up panels over hard navigational detours for supporting detail

---

### 2.2 Visual Style

- Clean, minimal UI
- Neutral marketplace design
- Limited gradients
- Brand-led but restrained visual language
- Compact touch-friendly controls
- Soft shadows only where needed
- Strong use of white/surface separation

---

## 3. Color System

### 3.1 Brand Colors

| Type    | Color   |
| ------- | ------- |
| Primary | #C84B4B |
| Black   | #111111 |
| White   | #FFFFFF |

Use calm red as primary brand/action color.

### 3.2 Functional Colors

| Purpose | Color intent |
| ------- | ------------ |
| Success | Green-tinted support state |
| Warning | Warm amber support state |
| Error   | Red support state |
| Divider | Theme-aware neutral border |

### 3.3 Telegram Theme Integration

Use Telegram `themeParams` when available for:
- `bg_color`
- `text_color`
- `secondary_bg_color`
- `hint_color`

Important:
- **Primary brand/action color remains red across platforms**, including Telegram
- Do not let Telegram default blue replace brand primary actions

### 3.4 Theme Behavior

Application must adapt to:
- light Telegram theme
- dark Telegram theme

Theme-sensitive elements:
- background
- text
- muted text
- surface cards
- borders
- chips/tabs
- toast surfaces
- nav surfaces

Brand-sensitive elements that remain red:
- primary actions
- active brand highlights
- floating cart bar
- cart/checkout CTA emphasis

---

## 4. Typography

| Element | Size    | Weight   |
| ------- | ------- | -------- |
| Heading | 16–18px | Semibold |
| Body    | 14–15px | Regular  |
| Meta    | 12–13px | Regular  |

Font: System/Inter stack for Telegram-native feel.

Rules:
- clear hierarchy
- strong item and screen titles
- muted secondary descriptions
- compact metadata

---

## 5. Shape and Radius System

### Current Rule

Border radius must stay compact.

| Role  | Radius |
| ----- | ------ |
| Small | 4px    |
| Main  | 6px    |
| Large | 6px    |
| CTA   | 6px    |

Important:
- Do **not** exceed 6px radius on buttons/cards/core controls
- Avoid overly rounded/pill-heavy styling

---

## 6. Spacing System

- Base unit: **8px**
- Card/control padding: 12–16px
- Section spacing: 16–24px

Goal:
- compact but breathable
- no crowded layouts
- no random spacing values

---

## 7. Core Components

### 7.1 Primary Actions

Usage:
- Proceed to Checkout
- Place Order
- major in-flow CTA actions

Behavior:
- high visibility
- brand red background
- full-width where appropriate
- fixed above bottom navigation when used as in-page sticky CTA

### 7.2 Secondary Actions

Usage:
- less important inline actions
- optional supporting navigation

Style:
- low emphasis
- bordered surface button
- no heavy gradients

### 7.3 Card Component

Usage:
- restaurants
- menu items
- checkout sections
- pricing summary

Specs:
- radius: 6px
- padding: 12–16px
- subtle border
- light shadow only where useful

### 7.4 Quantity Stepper

Required visual order:

```
[+]  2  [-]
```

Behavior:
- Replaces Add button after first tap
- Must remain **horizontal**
- No vertical stacking
- Compact inline helper style
- Used consistently across menu and cart

### 7.5 Floating Cart Bar

Component:

```
2 items • ₦4,500 → View Cart
```

Behavior:
- fixed above bottom nav
- always brand red
- visible when cart has items
- tap opens cart

### 7.6 Discovery Carousel

Behavior:
- Home discovery uses image-led restaurant carousel
- Carousel shows at most **5** restaurants at once
- Restaurants shown are selected randomly from fetched restaurant list
- Carousel auto-advances at timed intervals
- Dot indicators support direct manual slide selection
- Active slide should feel visually emphasized over adjacent slides

### 7.7 Pricing Summary + Breakdown

Collapsed state:

```
Pricing
Total amount
₦4,500
```

Expanded behavior:
- tap total summary
- open slide-up pricing sheet
- show full breakdown:
  - items total
  - delivery fee
  - handling fee
  - surcharge
  - transaction fee
  - discount
  - subtotal
  - total

### 7.8 Input Field (Location)

- Full-width select
- Theme-aware surface
- 6px radius
- Simple, readable layout

### 7.9 Input Field (Rider Note)

- Full-width textarea
- Theme-aware surface
- 6px radius
- Placeholder should help rider delivery accuracy

---

## 8. Navigation Model

### 8.1 Structure

Current intended product structure:

```
Home
→ Restaurant
→ Cart
→ Checkout
→ Success
```

Notes:
- payment route remains non-primary / limited until backend payment lifecycle exists
- history remains limitation state until backend history exists

### 8.2 Rules

- Use Telegram BackButton when available
- Preserve application state between screens
- Keep transitions lightweight
- Avoid browser-like navigation feel even though internal routing exists

---

## 9. Screen-Level Decisions

### 9.1 Home

Required sections:
- location selector
- search
- promo area
- randomized hero restaurant card
- randomized restaurant carousel
- restaurant list/grid
- bottom navigation

Decisions:
- discovery should be quick to scan
- carousel should cap visible dataset to at most 5 restaurants
- carousel should auto-advance but still support manual control
- hero restaurant CTA should route directly to selected restaurant page
- card tap area should be full-card
- search should feel instant

### 9.2 Restaurant Menu

Required sections:
- back/header area
- featured item block
- dish-group rail
- category tabs
- menu item cards
- floating cart bar

Decisions:
- inline selection only
- no add-to-cart modal
- item add should update cart immediately
- category tabs must remain legible in light/dark themes
- category tab text should remain black

### 9.3 Cart Screen

Required behavior:
- dish-grouped items
- item quantity control inline on same row
- checkout CTA above bottom nav
- pricing collapsed by default
- expandable pricing breakdown

Decisions:
- use available horizontal space well
- quantity helper must remain horizontal
- no unnecessary white space

### 9.4 Checkout Screen

Required sections:
- delivery location
- rider note
- optional referral code
- order summary
- pricing summary

Decisions:
- rider note required
- delivery pricing comes from backend cart after location update
- minimal text, clear hierarchy

### 9.5 Success Screen

Required sections:
- success confirmation
- grouped order summary
- pricing summary
- back-home path

### 9.6 History Screen

Current state:
- limitation state only until backend history exists

---

## 10. Interaction Design

### 10.1 Micro Interactions

- add item → immediate visual update + haptic when available
- quantity change → inline update
- press states → subtle scale only
- pricing details → slide-up sheet

### 10.2 Loading / Empty / Error States

Must support:
- skeletons for discovery/menu loading
- empty cart
- no search results
- backend/auth error toasts
- history limitation state

### 10.3 Error Handling

Use toast notifications for:
- item unavailable
- authentication failure
- missing Telegram context in backend mode
- cart mutation failures

---

## 11. State Behavior

### Cart
- Updates instantly in UI
- Backend mode uses optimistic updates, then reconciles with backend response
- Persistent within session

### Pricing
- Backend remains source of truth in backend mode
- Frontend may optimistically reflect immediate cart change, but backend response remains final

### Checkout
- Prevent duplicate submission
- Save location/note/referral before checkout

---

## 12. Non-Negotiable UX Decisions

1. Inline item selection (no modals)
2. Floating cart visibility
3. Brand red primary across all platforms
4. Max 6px radius system
5. Theme-aware light/dark adaptation
6. Horizontal quantity helper: `[+] 2 [-]`
7. Pricing total first, full breakdown in slide-up sheet
8. Immediate cart feedback on add/remove

---

## 13. Implementation Notes

- Build mobile-first
- Keep Telegram-native feel over generic web feel
- Avoid unnecessary gradients
- Support both Telegram and browser fallback environments
- Reusable design primitives should drive all screens

---

## 14. Summary

Current UI system is designed to:
- maximize speed
- reduce friction
- preserve brand consistency
- work across Telegram light/dark themes
- deliver a compact, polished Mini App experience

```

---
```