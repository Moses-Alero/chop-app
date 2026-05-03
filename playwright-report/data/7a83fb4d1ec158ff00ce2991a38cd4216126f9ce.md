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
      - button "Open menu" [ref=e7] [cursor=pointer]:
        - img [ref=e8]
      - generic [ref=e9]:
        - generic [ref=e10]: Location
        - generic [ref=e11]:
          - img [ref=e12]
          - combobox "Location" [ref=e15]:
            - option "Ikeja" [selected]
            - option "Yaba"
            - option "Victoria Island"
            - option "Lekki Phase 1"
      - generic [ref=e16]:
        - generic [ref=e17]:
          - button "Open search" [ref=e18] [cursor=pointer]:
            - img [ref=e19]
          - generic [ref=e22]: Search for food and restaurants
          - textbox "Search for food and restaurants" [ref=e23]:
            - /placeholder: Search food and restaurants
        - button "Open cart" [ref=e24] [cursor=pointer]:
          - img [ref=e25]
    - generic [ref=e28]:
      - generic [ref=e29]:
        - heading "ChopLink specials" [level=1] [ref=e30]
        - paragraph [ref=e31]: Quick restaurant discovery and checkout inside Telegram.
        - button "Order Now" [ref=e32] [cursor=pointer]
      - img "Pizza Hut" [ref=e33]
    - generic [ref=e34]:
      - generic [ref=e36]:
        - paragraph [ref=e37]: Discovery
        - heading "Browse by what matters now" [level=2] [ref=e38]
      - generic [ref=e39]:
        - button "Pizza Hut Pizza • Fast food Pizza Hut 20–30 mins" [ref=e40] [cursor=pointer]:
          - img "Pizza Hut" [ref=e41]
          - generic [ref=e42]:
            - paragraph [ref=e43]: Pizza • Fast food
            - heading "Pizza Hut" [level=3] [ref=e44]
            - generic [ref=e45]: 20–30 mins
        - button "Jollof Republic African • Rice bowls Jollof Republic 25–35 mins" [ref=e46] [cursor=pointer]:
          - img "Jollof Republic" [ref=e47]
          - generic [ref=e48]:
            - paragraph [ref=e49]: African • Rice bowls
            - heading "Jollof Republic" [level=3] [ref=e50]
            - generic [ref=e51]: 25–35 mins
        - button "Green Bowl Healthy • Salads Green Bowl 15–25 mins" [ref=e52] [cursor=pointer]:
          - img "Green Bowl" [ref=e53]
          - generic [ref=e54]:
            - paragraph [ref=e55]: Healthy • Salads
            - heading "Green Bowl" [level=3] [ref=e56]
            - generic [ref=e57]: 15–25 mins
    - generic [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e60]:
          - paragraph [ref=e61]: Restaurants
          - heading "Discover nearby options" [level=2] [ref=e62]
        - button "See All" [ref=e64] [cursor=pointer]
      - generic [ref=e65]:
        - link "Pizza Hut Open Pizza Hut 4.8 Pizza • Fast food Classic pizza, bowls, and sides for quick city delivery. 20–30 mins" [ref=e66] [cursor=pointer]:
          - /url: /restaurants/r1
          - generic [ref=e67]:
            - img "Pizza Hut" [ref=e68]
            - generic [ref=e69]: Open
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]:
                - img [ref=e73]
                - heading "Pizza Hut" [level=2] [ref=e77]
              - generic [ref=e78]:
                - img [ref=e79]
                - generic [ref=e81]: "4.8"
            - paragraph [ref=e82]:
              - img [ref=e83]
              - generic [ref=e88]: Pizza • Fast food
            - paragraph [ref=e89]: Classic pizza, bowls, and sides for quick city delivery.
            - generic [ref=e91]:
              - img [ref=e92]
              - generic [ref=e95]: 20–30 mins
        - link "Jollof Republic Open Jollof Republic 4.7 African • Rice bowls Jollof rice, grills, and everyday comfort meals. 25–35 mins" [ref=e96] [cursor=pointer]:
          - /url: /restaurants/r2
          - generic [ref=e97]:
            - img "Jollof Republic" [ref=e98]
            - generic [ref=e99]: Open
          - generic [ref=e100]:
            - generic [ref=e101]:
              - generic [ref=e102]:
                - img [ref=e103]
                - heading "Jollof Republic" [level=2] [ref=e107]
              - generic [ref=e108]:
                - img [ref=e109]
                - generic [ref=e111]: "4.7"
            - paragraph [ref=e112]:
              - img [ref=e113]
              - generic [ref=e118]: African • Rice bowls
            - paragraph [ref=e119]: Jollof rice, grills, and everyday comfort meals.
            - generic [ref=e121]:
              - img [ref=e122]
              - generic [ref=e125]: 25–35 mins
        - link "Green Bowl Closed Green Bowl 4.5 Healthy • Salads Fresh bowls, wraps, and smoothies. 15–25 mins" [ref=e126] [cursor=pointer]:
          - /url: /restaurants/r3
          - generic [ref=e127]:
            - img "Green Bowl" [ref=e128]
            - generic [ref=e129]: Closed
          - generic [ref=e130]:
            - generic [ref=e131]:
              - generic [ref=e132]:
                - img [ref=e133]
                - heading "Green Bowl" [level=2] [ref=e137]
              - generic [ref=e138]:
                - img [ref=e139]
                - generic [ref=e141]: "4.5"
            - paragraph [ref=e142]:
              - img [ref=e143]
              - generic [ref=e148]: Healthy • Salads
            - paragraph [ref=e149]: Fresh bowls, wraps, and smoothies.
            - generic [ref=e151]:
              - img [ref=e152]
              - generic [ref=e155]: 15–25 mins
  - navigation "Primary navigation" [ref=e156]:
    - link "Home" [ref=e157] [cursor=pointer]:
      - /url: /
      - img [ref=e158]
      - generic [ref=e161]: Home
    - link "History" [ref=e162] [cursor=pointer]:
      - /url: /history
      - img [ref=e163]
      - generic [ref=e167]: History
    - link "Cart" [ref=e168] [cursor=pointer]:
      - /url: /cart
      - img [ref=e169]
      - generic [ref=e172]: Cart
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
  111 |   test('history screen clearly states current mode limitation', async ({ page }, testInfo) => {
  112 |     await page.goto('/#/history')
  113 |     await expect(page.getByText(/Order history is unavailable in current app mode/)).toBeVisible()
  114 |     await page.screenshot({ path: testInfo.outputPath('history-limitation.png'), fullPage: true })
  115 |   })
  116 | })
  117 | 
```