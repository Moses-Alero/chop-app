# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Choplink Telegram Mini App flows >> happy path: discovery to checkout success
- Location: e2e/app.spec.ts:19:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('fallback-main-button')

```

# Page snapshot

```yaml
- main [ref=e5]:
  - generic [ref=e7]:
    - link "Go back" [ref=e8] [cursor=pointer]:
      - /url: /cart
      - img [ref=e9]
    - generic [ref=e11]:
      - heading "Checkout" [level=1] [ref=e12]
      - paragraph [ref=e13]: Pizza Hut
  - generic [ref=e14]:
    - generic [ref=e16]:
      - paragraph [ref=e17]: Checkout
      - heading "Confirm delivery details" [level=2] [ref=e18]
    - paragraph [ref=e19]: Add payment email, confirm delivery details, pay.
  - generic [ref=e20]:
    - generic [ref=e21]:
      - img [ref=e22]
      - text: Email for payment
    - textbox "Email for payment" [ref=e25]:
      - /placeholder: name@example.com
    - paragraph [ref=e26]: Email required for payment
  - generic [ref=e27]:
    - generic [ref=e28]:
      - img [ref=e29]
      - text: Delivery Area
    - combobox "Delivery Area" [ref=e32]:
      - option "Select delivery area"
      - option "Ikeja" [selected]
      - option "Yaba"
      - option "Victoria Island"
      - option "Lekki Phase 1"
    - generic [ref=e33]:
      - generic [ref=e34]:
        - paragraph [ref=e35]: Delivery fee
        - strong [ref=e36]: ₦50,000
      - generic [ref=e37]:
        - paragraph [ref=e38]: Current total
        - strong [ref=e39]: ₦1,470,000
  - generic [ref=e40]:
    - generic [ref=e41]:
      - img [ref=e42]
      - text: Note for rider
    - textbox "Note for rider" [ref=e45]:
      - /placeholder: Add estate gate, floor, landmark, or callout to help rider locate you faster
      - text: Blue gate beside the petrol station, call on arrival
    - paragraph [ref=e46]: "Saved to backend as `user_info`."
  - generic [ref=e47]:
    - generic [ref=e48]:
      - generic [ref=e49]:
        - img [ref=e50]
        - text: Referral code
      - generic [ref=e54]: Unsaved
    - generic [ref=e55]:
      - textbox "Referral code" [active] [ref=e56]:
        - /placeholder: Optional referral code
        - text: AMB001
      - button "Apply" [ref=e57] [cursor=pointer]
      - button "Clear" [ref=e58] [cursor=pointer]
    - paragraph [ref=e59]: Optional. Backend applies discount once per cart.
  - button "Order Summary" [ref=e61] [cursor=pointer]:
    - generic [ref=e62]:
      - img [ref=e63]
      - generic [ref=e66]: Order Summary
    - img [ref=e67]
  - button "Total Items Ikeja Total ₦1,470,000" [ref=e70] [cursor=pointer]:
    - generic [ref=e71]:
      - heading "Total Items" [level=3] [ref=e73]
      - paragraph [ref=e74]: Ikeja
    - generic [ref=e75]:
      - generic [ref=e76]: Total
      - generic [ref=e77]: ₦1,470,000
  - generic:
    - button
    - generic:
      - button:
        - generic:
          - generic: Pricing breakdown
          - img
      - generic:
        - generic:
          - paragraph: Pricing
          - heading [level=3]: Total amount
        - paragraph: 2 items
      - generic:
        - generic: Items Total
        - generic: ₦1,420,000
      - generic:
        - generic: Delivery Fee
        - generic: ₦50,000
      - generic:
        - generic: Service Charge
        - generic: ₦0
      - generic:
        - generic: Transaction Fee
        - generic: ₦0
      - generic:
        - generic: Discount
        - generic: "-₦0"
      - generic:
        - generic: Subtotal
        - generic: ₦1,420,000
      - generic:
        - generic: Total
        - generic: ₦1,470,000
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test'
  2   | 
  3   | async function openFirstRestaurant(page: import('@playwright/test').Page) {
  4   |   const firstRestaurant = page.locator('[data-testid^="restaurant-card-"]').first()
  5   |   await expect(firstRestaurant).toBeVisible()
  6   |   await firstRestaurant.click({ force: true })
  7   |   await expect(page).toHaveURL(/restaurants\/\d+|restaurants\/r\d+/)
  8   | }
  9   | 
  10  | async function addFirstVisibleItems(page: import('@playwright/test').Page, count = 1) {
  11  |   for (let index = 0; index < count; index += 1) {
  12  |     const addButtons = page.locator('[data-testid^="add-item-"]')
  13  |     await expect(addButtons.first()).toBeVisible()
  14  |     await addButtons.first().click()
  15  |   }
  16  | }
  17  | 
  18  | test.describe('Choplink Telegram Mini App flows', () => {
  19  |   test('happy path: discovery to checkout success', async ({ page }, testInfo) => {
  20  |     await page.goto('/')
  21  | 
  22  |     await expect(page.getByRole('heading', { name: 'Discover nearby options' })).toBeVisible()
  23  |     await openFirstRestaurant(page)
  24  |     await expect(page.locator('[data-testid^="menu-item-"]').first()).toBeVisible()
  25  |     await addFirstVisibleItems(page, 2)
  26  | 
  27  |     await expect(page.getByTestId('floating-cart-bar')).toBeVisible()
  28  |     await page.getByTestId('floating-cart-bar').click()
  29  | 
  30  |     await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible()
  31  |     await page.getByLabel('Increase quantity').first().click()
  32  | 
  33  |     await page.getByTestId('cart-checkout-button').click()
  34  |     await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()
  35  | 
  36  |     const locationSelect = page.getByTestId('delivery-location-select')
  37  |     const optionCount = await locationSelect.locator('option').count()
  38  |     if (optionCount > 1) {
  39  |       await locationSelect.selectOption({ index: 1 })
  40  |     }
  41  | 
  42  |     await page.getByTestId('delivery-location-note').fill('Blue gate beside the petrol station, call on arrival')
  43  |     await page.getByLabel('Referral code').fill('AMB001')
> 44  |     await page.getByTestId('fallback-main-button').click()
      |                                                    ^ Error: locator.click: Test timeout of 30000ms exceeded.
  45  | 
  46  |     await expect(page.getByTestId('success-screen')).toBeVisible()
  47  |     await expect(page.getByRole('heading', { name: /Your order has been placed/ })).toBeVisible()
  48  |     await page.screenshot({ path: testInfo.outputPath('checkout-success.png'), fullPage: true })
  49  |   })
  50  | 
  51  |   test('checkout guard rails show rider-note validation feedback', async ({ page }, testInfo) => {
  52  |     await page.goto('/')
  53  |     await openFirstRestaurant(page)
  54  |     await addFirstVisibleItems(page, 1)
  55  |     await page.getByTestId('floating-cart-bar').click()
  56  |     await page.getByTestId('cart-checkout-button').click()
  57  | 
  58  |     await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()
  59  |     await expect(page.getByText('Add delivery note for rider')).toBeVisible()
  60  |     await expect(page.getByTestId('fallback-main-button')).toBeDisabled()
  61  |     await page.screenshot({ path: testInfo.outputPath('checkout-validation.png'), fullPage: true })
  62  |   })
  63  | 
  64  |   test('search updates results from backend discovery', async ({ page }, testInfo) => {
  65  |     await page.goto('/')
  66  |     const firstRestaurantName = (await page.locator('.restaurant-card h2').first().textContent())?.trim() ?? 'Home'
  67  |     const query = firstRestaurantName.split(' ')[0]
  68  | 
  69  |     await page.getByTestId('catalog-search-toggle').click()
  70  |     await page.getByTestId('catalog-search-input').fill(query)
  71  |     await expect(page.getByRole('heading', { name: 'Food and restaurants' })).toBeVisible()
  72  |     await expect(page.getByText(new RegExp(query, 'i')).first()).toBeVisible()
  73  |     await page.screenshot({ path: testInfo.outputPath('search-results.png'), fullPage: true })
  74  |   })
  75  | 
  76  |   test('payment route is guarded in fallback app mode', async ({ page }, testInfo) => {
  77  |     await page.goto('/#/payment/demo')
  78  |     await expect(page).toHaveURL(/#\/$/)
  79  |     await expect(page.getByRole('heading', { name: 'Discover nearby options' })).toBeVisible()
  80  |     await page.screenshot({ path: testInfo.outputPath('payment-route-guard.png'), fullPage: true })
  81  |   })
  82  | 
  83  |   test('cart route shows empty state when no items exist', async ({ page }, testInfo) => {
  84  |     await page.goto('/#/cart')
  85  |     await expect(page.getByTestId('empty-cart-state')).toBeVisible()
  86  |     await expect(page.getByRole('heading', { name: 'Empty Cart' })).toBeVisible()
  87  |     await page.screenshot({ path: testInfo.outputPath('empty-cart.png'), fullPage: true })
  88  |   })
  89  | 
  90  |   test('supports dish grouping and explicit dish-group removal', async ({ page }, testInfo) => {
  91  |     await page.goto('/')
  92  |     await openFirstRestaurant(page)
  93  | 
  94  |     await addFirstVisibleItems(page, 1)
  95  |     await page.getByRole('button', { name: 'New dish' }).click()
  96  |     await page.getByRole('button', { name: 'Dish 2' }).click()
  97  | 
  98  |     const visibleAddButtons = page.locator('[data-testid^="add-item-"]')
  99  |     await visibleAddButtons.first().click()
  100 | 
  101 |     await page.getByTestId('floating-cart-bar').click()
  102 |     await expect(page.getByText('Dish 1')).toBeVisible()
  103 |     await expect(page.getByText('Dish 2')).toBeVisible()
  104 | 
  105 |     await page.getByRole('button', { name: 'Remove Dish 2' }).click()
  106 |     await expect(page.getByText('Dish 2')).not.toBeVisible()
  107 |     await expect(page.getByText('Dish 1')).toBeVisible()
  108 |     await page.screenshot({ path: testInfo.outputPath('dish-group-removed.png'), fullPage: true })
  109 |   })
  110 | 
  111 |   test('see all opens restaurants page and specials CTA opens restaurant page', async ({ page }, testInfo) => {
  112 |     await page.goto('/')
  113 | 
  114 |     await page.getByRole('button', { name: 'See All' }).click()
  115 |     await expect(page).toHaveURL(/\/restaurants$/)
  116 |     await expect(page.getByRole('heading', { name: 'Restaurants' })).toBeVisible()
  117 | 
  118 |     await page.goto('/')
  119 |     await page.getByTestId('specials-order-now').click()
  120 |     await expect(page).toHaveURL(/\/restaurants\/(\d+|r\d+)/)
  121 |     await page.screenshot({ path: testInfo.outputPath('restaurants-page-and-specials.png'), fullPage: true })
  122 |   })
  123 | 
  124 |   test('history screen clearly states current mode limitation', async ({ page }, testInfo) => {
  125 |     await page.goto('/#/history')
  126 |     await expect(page.getByText(/Order history is unavailable in current app mode/)).toBeVisible()
  127 |     await page.screenshot({ path: testInfo.outputPath('history-limitation.png'), fullPage: true })
  128 |   })
  129 | })
  130 | 
```