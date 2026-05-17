# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Choplink Telegram Mini App flows >> payment route is guarded in fallback app mode
- Location: e2e/app.spec.ts:76:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /#\/$/
Received string:  "http://127.0.0.1:4173/#/payment/demo"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    9 × unexpected value "http://127.0.0.1:4173/#/payment/demo"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - main [ref=e5]:
    - generic [ref=e6]:
      - button "Open menu" [ref=e7] [cursor=pointer]
      - generic [ref=e8]:
        - generic [ref=e9]: Location
        - generic [ref=e10]:
          - img [ref=e11]
          - combobox "Location" [ref=e14]:
            - option "Ikeja" [selected]
            - option "Yaba"
            - option "Victoria Island"
            - option "Lekki Phase 1"
      - generic [ref=e15]:
        - generic [ref=e16]:
          - button "Open search" [ref=e17] [cursor=pointer]:
            - img [ref=e18]
          - generic [ref=e21]: Search for food and restaurants
          - textbox "Search for food and restaurants" [ref=e22]:
            - /placeholder: Search food and restaurants
        - button "Open cart" [ref=e23] [cursor=pointer]:
          - img [ref=e24]
    - generic [ref=e27]:
      - generic [ref=e28]:
        - heading "ChopLink specials" [level=1] [ref=e29]
        - paragraph [ref=e30]: Order from Jollof Republic without leaving Telegram.
        - button "Order Now" [ref=e31] [cursor=pointer]
      - img "Jollof Republic" [ref=e32]
    - generic [ref=e33]:
      - generic [ref=e35]:
        - paragraph [ref=e36]: Discovery
        - heading "Featured restaurants" [level=2] [ref=e37]
      - generic [ref=e38]:
        - button "Jollof Republic African • Rice bowls Jollof Republic 25–35 mins" [ref=e39] [cursor=pointer]:
          - img "Jollof Republic" [ref=e40]
          - generic [ref=e41]:
            - paragraph [ref=e42]: African • Rice bowls
            - heading "Jollof Republic" [level=3] [ref=e43]
            - generic [ref=e44]: 25–35 mins
        - button "Green Bowl Healthy • Salads Green Bowl 15–25 mins" [ref=e45] [cursor=pointer]:
          - img "Green Bowl" [ref=e46]
          - generic [ref=e47]:
            - paragraph [ref=e48]: Healthy • Salads
            - heading "Green Bowl" [level=3] [ref=e49]
            - generic [ref=e50]: 15–25 mins
        - button "Pizza Hut Pizza • Fast food Pizza Hut 20–30 mins" [ref=e51] [cursor=pointer]:
          - img "Pizza Hut" [ref=e52]
          - generic [ref=e53]:
            - paragraph [ref=e54]: Pizza • Fast food
            - heading "Pizza Hut" [level=3] [ref=e55]
            - generic [ref=e56]: 20–30 mins
      - generic "Featured restaurants carousel position" [ref=e57]:
        - button "Show featured restaurant 1" [ref=e58] [cursor=pointer]
        - button "Show featured restaurant 2" [ref=e59] [cursor=pointer]
        - button "Show featured restaurant 3" [ref=e60] [cursor=pointer]
    - generic [ref=e61]:
      - generic [ref=e62]:
        - generic [ref=e63]:
          - paragraph [ref=e64]: Restaurants
          - heading "Discover nearby options" [level=2] [ref=e65]
        - button "See All" [ref=e67] [cursor=pointer]
      - generic [ref=e68]:
        - link "Pizza Hut Open Pizza Hut 4.8 Pizza • Fast food Classic pizza, bowls, and sides for quick city delivery. 20–30 mins" [ref=e69] [cursor=pointer]:
          - /url: /restaurants/r1
          - generic [ref=e70]:
            - img "Pizza Hut" [ref=e71]
            - generic [ref=e72]: Open
          - generic [ref=e73]:
            - generic [ref=e74]:
              - generic [ref=e75]:
                - img [ref=e76]
                - heading "Pizza Hut" [level=2] [ref=e80]
              - generic [ref=e81]:
                - img [ref=e82]
                - generic [ref=e84]: "4.8"
            - paragraph [ref=e85]:
              - img [ref=e86]
              - generic [ref=e91]: Pizza • Fast food
            - paragraph [ref=e92]: Classic pizza, bowls, and sides for quick city delivery.
            - generic [ref=e94]:
              - img [ref=e95]
              - generic [ref=e98]: 20–30 mins
        - link "Jollof Republic Open Jollof Republic 4.7 African • Rice bowls Jollof rice, grills, and everyday comfort meals. 25–35 mins" [ref=e99] [cursor=pointer]:
          - /url: /restaurants/r2
          - generic [ref=e100]:
            - img "Jollof Republic" [ref=e101]
            - generic [ref=e102]: Open
          - generic [ref=e103]:
            - generic [ref=e104]:
              - generic [ref=e105]:
                - img [ref=e106]
                - heading "Jollof Republic" [level=2] [ref=e110]
              - generic [ref=e111]:
                - img [ref=e112]
                - generic [ref=e114]: "4.7"
            - paragraph [ref=e115]:
              - img [ref=e116]
              - generic [ref=e121]: African • Rice bowls
            - paragraph [ref=e122]: Jollof rice, grills, and everyday comfort meals.
            - generic [ref=e124]:
              - img [ref=e125]
              - generic [ref=e128]: 25–35 mins
        - link "Green Bowl Closed Green Bowl 4.5 Healthy • Salads Fresh bowls, wraps, and smoothies. 15–25 mins" [ref=e129] [cursor=pointer]:
          - /url: /restaurants/r3
          - generic [ref=e130]:
            - img "Green Bowl" [ref=e131]
            - generic [ref=e132]: Closed
          - generic [ref=e133]:
            - generic [ref=e134]:
              - generic [ref=e135]:
                - img [ref=e136]
                - heading "Green Bowl" [level=2] [ref=e140]
              - generic [ref=e141]:
                - img [ref=e142]
                - generic [ref=e144]: "4.5"
            - paragraph [ref=e145]:
              - img [ref=e146]
              - generic [ref=e151]: Healthy • Salads
            - paragraph [ref=e152]: Fresh bowls, wraps, and smoothies.
            - generic [ref=e154]:
              - img [ref=e155]
              - generic [ref=e158]: 15–25 mins
  - navigation "Primary navigation" [ref=e159]:
    - link "Home" [ref=e160] [cursor=pointer]:
      - /url: /
      - img [ref=e161]
      - generic [ref=e164]: Home
    - link "History" [ref=e165] [cursor=pointer]:
      - /url: /history
      - img [ref=e166]
      - generic [ref=e170]: History
    - link "Cart" [ref=e171] [cursor=pointer]:
      - /url: /cart
      - img [ref=e172]
      - generic [ref=e175]: Cart
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
> 78  |     await expect(page).toHaveURL(/#\/$/)
      |                        ^ Error: expect(page).toHaveURL(expected) failed
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