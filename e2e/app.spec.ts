import { expect, test } from '@playwright/test'

async function openFirstRestaurant(page: import('@playwright/test').Page) {
  const firstRestaurant = page.locator('[data-testid^="restaurant-card-"]').first()
  await expect(firstRestaurant).toBeVisible()
  await firstRestaurant.click({ force: true })
  await expect(page).toHaveURL(/restaurants\/\d+|restaurants\/r\d+/)
}

async function addFirstVisibleItems(page: import('@playwright/test').Page, count = 1) {
  for (let index = 0; index < count; index += 1) {
    const addButtons = page.locator('[data-testid^="add-item-"]')
    await expect(addButtons.first()).toBeVisible()
    await addButtons.first().click()
  }
}

test.describe('Choplink Telegram Mini App flows', () => {
  test('happy path: discovery to checkout success', async ({ page }, testInfo) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Discover nearby options' })).toBeVisible()
    await openFirstRestaurant(page)
    await expect(page.locator('[data-testid^="menu-item-"]').first()).toBeVisible()
    await addFirstVisibleItems(page, 2)

    await expect(page.getByTestId('floating-cart-bar')).toBeVisible()
    await page.getByTestId('floating-cart-bar').click()

    await expect(page.getByRole('heading', { name: 'Cart' })).toBeVisible()
    await page.getByLabel('Increase quantity').first().click()

    await page.getByTestId('cart-checkout-button').click()
    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()

    const locationSelect = page.getByTestId('delivery-location-select')
    const optionCount = await locationSelect.locator('option').count()
    if (optionCount > 1) {
      await locationSelect.selectOption({ index: 1 })
    }

    await page.getByTestId('delivery-location-note').fill('Blue gate beside the petrol station, call on arrival')
    await page.getByLabel('Referral code').fill('AMB001')
    await page.getByTestId('fallback-main-button').click()

    await expect(page.getByTestId('success-screen')).toBeVisible()
    await expect(page.getByRole('heading', { name: /Your order has been placed/ })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('checkout-success.png'), fullPage: true })
  })

  test('checkout guard rails show rider-note validation feedback', async ({ page }, testInfo) => {
    await page.goto('/')
    await openFirstRestaurant(page)
    await addFirstVisibleItems(page, 1)
    await page.getByTestId('floating-cart-bar').click()
    await page.getByTestId('cart-checkout-button').click()

    await expect(page.getByRole('heading', { name: 'Checkout' })).toBeVisible()
    await expect(page.getByText('Add delivery note for rider')).toBeVisible()
    await expect(page.getByTestId('fallback-main-button')).toBeDisabled()
    await page.screenshot({ path: testInfo.outputPath('checkout-validation.png'), fullPage: true })
  })

  test('search updates results from backend discovery', async ({ page }, testInfo) => {
    await page.goto('/')
    const firstRestaurantName = (await page.locator('.restaurant-card h2').first().textContent())?.trim() ?? 'Home'
    const query = firstRestaurantName.split(' ')[0]

    await page.getByTestId('catalog-search-toggle').click()
    await page.getByTestId('catalog-search-input').fill(query)
    await expect(page.getByRole('heading', { name: 'Food and restaurants' })).toBeVisible()
    await expect(page.getByText(new RegExp(query, 'i')).first()).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('search-results.png'), fullPage: true })
  })

  test('payment route is guarded in fallback app mode', async ({ page }, testInfo) => {
    await page.goto('/#/payment/demo')
    await expect(page).toHaveURL(/#\/$/)
    await expect(page.getByRole('heading', { name: 'Discover nearby options' })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('payment-route-guard.png'), fullPage: true })
  })

  test('cart route shows empty state when no items exist', async ({ page }, testInfo) => {
    await page.goto('/#/cart')
    await expect(page.getByTestId('empty-cart-state')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Empty Cart' })).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('empty-cart.png'), fullPage: true })
  })

  test('supports dish grouping and explicit dish-group removal', async ({ page }, testInfo) => {
    await page.goto('/')
    await openFirstRestaurant(page)

    await addFirstVisibleItems(page, 1)
    await page.getByRole('button', { name: 'New dish' }).click()
    await page.getByRole('button', { name: 'Dish 2' }).click()

    const visibleAddButtons = page.locator('[data-testid^="add-item-"]')
    await visibleAddButtons.first().click()

    await page.getByTestId('floating-cart-bar').click()
    await expect(page.getByText('Dish 1')).toBeVisible()
    await expect(page.getByText('Dish 2')).toBeVisible()

    await page.getByRole('button', { name: 'Remove Dish 2' }).click()
    await expect(page.getByText('Dish 2')).not.toBeVisible()
    await expect(page.getByText('Dish 1')).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('dish-group-removed.png'), fullPage: true })
  })

  test('see all opens restaurants page and specials CTA opens restaurant page', async ({ page }, testInfo) => {
    await page.goto('/')

    await page.getByRole('button', { name: 'See All' }).click()
    await expect(page).toHaveURL(/\/restaurants$/)
    await expect(page.getByRole('heading', { name: 'Restaurants' })).toBeVisible()

    await page.goto('/')
    await page.getByTestId('specials-order-now').click()
    await expect(page).toHaveURL(/\/restaurants\/(\d+|r\d+)/)
    await page.screenshot({ path: testInfo.outputPath('restaurants-page-and-specials.png'), fullPage: true })
  })

  test('history screen clearly states current mode limitation', async ({ page }, testInfo) => {
    await page.goto('/#/history')
    await expect(page.getByText(/Order history is unavailable in current app mode/)).toBeVisible()
    await page.screenshot({ path: testInfo.outputPath('history-limitation.png'), fullPage: true })
  })
})
