# Choplink Design System

Date updated: 2026-05-01

---

## Primary Objective

Create a polished, mobile-first food ordering interface with a clean, compact, Telegram-appropriate feel.

The UI should feel:
- Modern
- Minimal
- Friendly
- Lightweight
- Fast to understand
- Optimized for quick ordering
- Compatible with Telegram light and dark themes

The design system must stay reusable across pages such as:
- Home
- Product details
- Restaurant listing
- Cart
- Checkout
- Order summary
- Order history / limitation state
- Empty states
- Error states
- Success states

---

## 1. Overall Visual Direction

Use a calm, compact mobile commerce style.

The interface should use:
- compact cards
- clear visual hierarchy
- strong spacing discipline
- subtle shadows only where useful
- minimal borders
- simple surfaces
- restrained use of color
- no unnecessary gradients on core UI
- compact controls with clear affordances

The app should avoid looking bloated, noisy, or excessively rounded.

---

## 2. Brand + Theme Rules

### 2.1 Brand Identity

Primary brand palette:
- Calm red: `#C84B4B`
- Black: `#111111`
- White: `#FFFFFF`

This red is the primary action color across:
- web
- Telegram Mini App runtime
- light mode
- dark mode

### 2.2 Telegram Theme Support

Use Telegram theme values for:
- background
- text
- secondary background
- hint/muted text

Do **not** let Telegram blue override primary app branding.

Brand red must remain the primary action color even when Telegram theme provides its own button color.

### 2.3 Light / Dark Mode Behavior

Application must adapt for both light and dark Telegram themes.

Theme-sensitive elements:
- page background
- text
- muted text
- card surfaces
- input surfaces
- borders
- nav surfaces
- status surfaces
- toast surfaces

Brand-sensitive elements that stay red:
- primary buttons
- floating cart bar
- checkout CTA emphasis
- active brand highlights where appropriate

---

## 3. Layout Principles

### 3.1 Mobile-First Layout

Design primarily for a mobile viewport.

Use a single-column layout for most screens.

Content flow should generally be:
1. Header
2. Hero / summary / promo section
3. Categories / controls
4. Main content
5. Bottom action / bottom navigation

### 3.2 Safe Area Awareness

UI must account for:
- device notch
- rounded corners
- bottom gesture bar
- Telegram webview chrome

Important CTAs must not collide with bottom nav or safe area.

### 3.3 Space Efficiency

Use space carefully.

Goals:
- avoid wasted vertical space
- keep important controls visible
- prefer compact horizontal controls where possible
- cart rows should use width efficiently

---

## 4. Typography System

### 4.1 Typography Roles

#### Screen Title
Used for:
- Orders
- Checkout
- Cart
- History

Should feel bold, clear, and compact.

#### Section Title
Used for:
- Discover nearby options
- Group items by dish
- Order Summary
- Confirm delivery details

#### Item Title
Used for:
- food names
- restaurant names
- product titles

#### Body Text
Used for:
- descriptions
- helper text
- rider note guidance

#### Caption / Meta Text
Used for:
- delivery time
- ratings
- category labels
- item counts
- support metadata

### 4.2 Typography Rules

- Strong weight for titles
- Muted color for secondary info
- Compact line heights
- Avoid too many font sizes
- Keep text scan-friendly in both themes

---

## 5. Radius System

### Current Product Rule

Border radius must be compact and never exceed 6px for core UI.

| Role  | Radius |
| ----- | ------ |
| Small | 4px    |
| Main  | 6px    |
| Large | 6px    |
| CTA   | 6px    |

Use cases:
- Cards: 6px
- Buttons: 6px
- Tabs: 6px
- Inputs: 6px
- Stepper buttons: 6px
- Bottom nav surface: 6px

No oversized pill curves.

---

## 6. Spacing System

- Base unit: **8px**
- Compact gaps for related info: 6–8px
- Card/control padding: 12–16px
- Section spacing: 16–24px

Spacing must be:
- consistent
- compact
- breathable
- predictable

---

## 7. Surface System

### 7.1 Surface Types

#### Base Surface
Used for app background.

#### Elevated Surface
Used for:
- cards
- nav container
- toasts
- slide-up breakdown sheet

#### Muted Surface
Used for:
- input backgrounds
- loading placeholders
- secondary support surfaces

### 7.2 Surface Rules

- Prefer flat surfaces over heavy decoration
- Use subtle borders for separation
- Use shadow sparingly
- Avoid gradient-heavy containers for standard app flows

---

## 8. Card System

### 8.1 Restaurant Card
Must support:
- image
- title
- cuisine
- description
- item count
- open/closed status
- optional rating

### 8.2 Menu Item Card
Must support:
- image
- item title
- price
- description
- Add button or quantity helper

### 8.3 Pricing Summary Card
Must support:
- total-first summary
- tap target for expanded breakdown

### 8.4 Breakdown Sheet Card
Must support:
- slide-up presentation
- full pricing rows
- close/collapse affordance

---

## 9. Button System

### 9.1 Primary Button
Used for:
- Proceed to Checkout
- Place Order
- key in-flow primary actions

Rules:
- calm red background
- white text
- compact 6px radius
- touch-friendly height
- no unnecessary gradients

### 9.2 Secondary Button
Used for:
- optional supporting actions
- low-emphasis alternatives

Rules:
- bordered surface button
- low visual weight
- no heavy shadow

### 9.3 Icon / Ghost Button
Used for:
- back
- cart
- search
- menu
- close

Rules:
- enough touch area
- compact chrome
- theme-aware surface

---

## 10. Navigation System

### 10.1 Bottom Navigation
Supports:
- icon
- label
- active state
- inactive state

Rules:
- fixed at bottom
- active state readable in all themes
- compact, not bulky

### 10.2 Fixed Action Layer
When page-level CTA exists above bottom nav:
- CTA sits above nav
- nav remains visible below
- safe-area respected

This pattern is currently used on cart page.

---

## 11. Quantity + Price System

### 11.1 Quantity Helper
Must render horizontally as:

```text
[+]  2  [-]
```

Not acceptable:
- vertical stacking
- multiline collapse
- broken wrap

Rules:
- helper must remain horizontal
- buttons boxed
- quantity centered between buttons
- compact inline feel
- works on menu cards and cart rows

### 11.2 Price Display
Use clear labels such as:
- Items Total
- Delivery Fee
- Handling Fee
- Surcharge
- Transaction Fee
- Discount
- Subtotal
- Total

### 11.3 Price Breakdown UX
Behavior:
- show total first
- tap opens slide-up sheet
- breakdown lives in expandable panel, not always-open block

---

## 12. Inputs

### 12.1 Select / Dropdown
Used for delivery location.

Rules:
- full width
- theme-aware surface
- 6px radius
- clear border/focus treatment

### 12.2 Text Area
Used for rider note.

Rules:
- full width
- theme-aware
- readable helper/placeholder text
- compact but comfortable padding

---

## 13. Metadata System

Examples:
- rating
- delivery time
- cuisine
- item count
- open / closed status

Rules:
- compact icon + label presentation
- short strings
- muted/supporting tone unless status-specific
- no long noisy metadata lines

Special rule:
- category tab text should remain black in both light and dark themes

---

## 14. State System

Must support:

### Loading
- skeleton cards
- loading placeholders
- in-context loading states

### Empty
- empty cart
- no search results
- no history available

### Error
- auth failure
- missing Telegram context
- failed cart mutation
- failed discovery data load

### Success
- order placed
- item add/remove feedback

---

## 15. Interaction Rules

### 15.1 Responsiveness
App should feel fast.

Use:
- subtle press states
- compact transitions
- clear disabled states
- immediate cart feedback

### 15.2 Optimistic UX
For cart interactions:
- item add/remove should reflect immediately in UI
- backend sync can complete in background
- rollback only if backend fails

### 15.3 Slide-Up Patterns
Use slide-up panels for supporting details such as pricing breakdown instead of pushing user to separate screens.

### 15.4 Carousel Patterns
For Home discovery carousel:
- show at most **5** restaurants at once
- choose carousel restaurants randomly from fetched list
- support timed auto-advance
- support manual dot navigation
- active slide should feel visually highlighted
- horizontal swipe/scroll must remain smooth inside Telegram webview

---

## 16. Screen Guidance

### Home Screen
Required sections:
1. Header with location + quick actions
2. Randomized promo area
3. Discovery carousel
4. Restaurant listing
5. Bottom navigation

### Restaurant Screen
Required sections:
1. Header/back
2. Featured product block
3. Dish-group rail
4. Category tabs
5. Menu items
6. Floating cart bar

### Cart Screen
Required sections:
1. Header/back
2. Dish-grouped item rows
3. Horizontal quantity helper per item
4. Collapsed pricing summary
5. Checkout CTA above bottom nav

### Checkout Screen
Required sections:
1. Delivery location
2. Rider note
3. Referral code
4. Order summary
5. Collapsed pricing summary

---

## 17. Reusability Requirements

At minimum, reusable patterns should exist for:
- app header
- icon button
- primary button
- secondary button
- restaurant card
- menu item card
- quantity helper
- pricing rows
- pricing summary trigger
- bottom navigation
- section header
- empty state
- loading skeleton

---

## 18. Quality Bar

Before considering UI complete, verify:
- spacing is consistent
- typography hierarchy is clear
- cards feel reusable
- buttons are touch-friendly
- primary color remains red across platforms
- app adapts to Telegram light/dark themes
- radius never exceeds 6px on core UI
- quantity helper stays horizontal
- category tabs remain readable in dark mode
- UI does not feel crowded or overdesigned
- no visual behavior depends on one-off hacks
