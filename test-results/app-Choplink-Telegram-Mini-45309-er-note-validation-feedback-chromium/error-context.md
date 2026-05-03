# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Choplink Telegram Mini App flows >> checkout guard rails show rider-note validation feedback
- Location: e2e/app.spec.ts:51:3

# Error details

```
Error: expect(locator).toBeDisabled() failed

Locator: getByTestId('fallback-main-button')
Expected: disabled
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeDisabled" with timeout 5000ms
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
    - paragraph [ref=e19]: Review rider location, note, and total before submitting order.
  - generic [ref=e20]:
    - generic [ref=e21]:
      - img [ref=e22]
      - text: Delivery Area
    - combobox "Delivery Area" [ref=e25]:
      - option "Select delivery area"
      - option "Ikeja" [selected]
      - option "Yaba"
      - option "Victoria Island"
      - option "Lekki Phase 1"
    - paragraph [ref=e26]: Delivery fee updates from backend cart after location sync.
  - generic [ref=e27]:
    - generic [ref=e28]:
      - img [ref=e29]
      - text: Note for rider
    - textbox "Note for rider" [ref=e32]:
      - /placeholder: Add estate gate, floor, landmark, or callout to help rider locate you faster
    - paragraph [ref=e33]: Add delivery note for rider
  - generic [ref=e34]:
    - generic [ref=e35]:
      - img [ref=e36]
      - text: Referral code
    - textbox "Referral code" [ref=e39]:
      - /placeholder: Optional referral code
    - paragraph [ref=e40]: Optional. Backend applies discount once per cart.
  - button "Order Summary" [ref=e42] [cursor=pointer]:
    - generic [ref=e43]:
      - img [ref=e44]
      - generic [ref=e47]: Order Summary
    - img [ref=e48]
  - button "Pricing Total amount Total ₦550,000" [ref=e51] [cursor=pointer]:
    - generic [ref=e52]:
      - paragraph [ref=e53]: Pricing
      - heading "Total amount" [level=3] [ref=e54]
    - generic [ref=e55]:
      - generic [ref=e56]: Total
      - generic [ref=e57]: ₦550,000
  - generic:
    - button
    - generic:
      - button:
        - generic:
          - generic: Pricing breakdown
          - img
      - generic:
        - paragraph: Pricing
        - heading [level=3]: Total amount
      - generic:
        - generic: Items Total
        - generic: ₦500,000
      - generic:
        - generic: Delivery Fee
        - generic: ₦50,000
      - generic:
        - generic: Handling Fee
        - generic: ₦0
      - generic:
        - generic: Surcharge
        - generic: ₦0
      - generic:
        - generic: Transaction Fee
        - generic: ₦0
      - generic:
        - generic: Discount
        - generic: "-₦0"
      - generic:
        - generic: Subtotal
        - generic: ₦500,000
      - generic:
        - generic: Total
        - generic: ₦550,000
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
  44  |     await page.getByTestId('fallback-main-button').click()
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
> 60  |     await expect(page.getByTestId('fallback-main-button')).toBeDisabled()
      |                                                            ^ Error: expect(locator).toBeDisabled() failed
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
  111 |   test('history screen clearly states current mode limitation', async ({ page }, testInfo) => {
  112 |     await page.goto('/#/history')
  113 |     await expect(page.getByText(/Order history is unavailable in current app mode/)).toBeVisible()
  114 |     await page.screenshot({ path: testInfo.outputPath('history-limitation.png'), fullPage: true })
  115 |   })
  116 | })
  117 | 
```