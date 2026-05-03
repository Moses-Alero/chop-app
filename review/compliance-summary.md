# Compliance Summary

Date: 2026-05-01
Validation method: Playwright E2E with video, trace, and screenshot capture
Execution mode: fallback/mock app mode for deterministic browser QA (`VITE_API_BASE_URL`, `VITE_API_BEARER_TOKEN`, `VITE_ABIDOSHAKER_HEADER` forced empty in Playwright web server command)

## Evidence counts
- Videos: 7
- Traces: 7
- Screenshots: 7

## Validation note
Core UX flows validated successfully in fallback mode.
This run intentionally does **not** validate live Telegram auth boot or live backend cart endpoints.
Those backend-specific constraints remain documented in `.pi/product/api-gap-analysis.md`.

## Validated flows
- Discovery to checkout success
- Checkout guard rails for missing rider note
- Search flow
- Payment route guard in fallback mode
- Empty cart state
- Dish grouping and explicit dish-group removal
- History limitation state

## Result
- Playwright scenarios passed: 7/7
- Build status: pass

## Evidence paths
- Video: ../test-results/app-Choplink-Telegram-Mini-0cff3-scovery-to-checkout-success-chromium/video.webm
- Screenshot: ../test-results/app-Choplink-Telegram-Mini-0cff3-scovery-to-checkout-success-chromium/checkout-success.png
- Trace: ../test-results/app-Choplink-Telegram-Mini-0cff3-scovery-to-checkout-success-chromium/trace.zip

- Video: ../test-results/app-Choplink-Telegram-Mini-45309-er-note-validation-feedback-chromium/video.webm
- Screenshot: ../test-results/app-Choplink-Telegram-Mini-45309-er-note-validation-feedback-chromium/checkout-validation.png
- Trace: ../test-results/app-Choplink-Telegram-Mini-45309-er-note-validation-feedback-chromium/trace.zip

- Video: ../test-results/app-Choplink-Telegram-Mini-80c8d-ults-from-backend-discovery-chromium/video.webm
- Screenshot: ../test-results/app-Choplink-Telegram-Mini-80c8d-ults-from-backend-discovery-chromium/search-results.png
- Trace: ../test-results/app-Choplink-Telegram-Mini-80c8d-ults-from-backend-discovery-chromium/trace.zip

- Video: ../test-results/app-Choplink-Telegram-Mini-82157-uarded-in-fallback-app-mode-chromium/video.webm
- Screenshot: ../test-results/app-Choplink-Telegram-Mini-82157-uarded-in-fallback-app-mode-chromium/payment-route-guard.png
- Trace: ../test-results/app-Choplink-Telegram-Mini-82157-uarded-in-fallback-app-mode-chromium/trace.zip

- Video: ../test-results/app-Choplink-Telegram-Mini-6f6be-y-state-when-no-items-exist-chromium/video.webm
- Screenshot: ../test-results/app-Choplink-Telegram-Mini-6f6be-y-state-when-no-items-exist-chromium/empty-cart.png
- Trace: ../test-results/app-Choplink-Telegram-Mini-6f6be-y-state-when-no-items-exist-chromium/trace.zip

- Video: ../test-results/app-Choplink-Telegram-Mini-a2ea5-explicit-dish-group-removal-chromium/video.webm
- Screenshot: ../test-results/app-Choplink-Telegram-Mini-a2ea5-explicit-dish-group-removal-chromium/dish-group-removed.png
- Trace: ../test-results/app-Choplink-Telegram-Mini-a2ea5-explicit-dish-group-removal-chromium/trace.zip

- Video: ../test-results/app-Choplink-Telegram-Mini-74d11-tes-current-mode-limitation-chromium/video.webm
- Screenshot: ../test-results/app-Choplink-Telegram-Mini-74d11-tes-current-mode-limitation-chromium/history-limitation.png
- Trace: ../test-results/app-Choplink-Telegram-Mini-74d11-tes-current-mode-limitation-chromium/trace.zip
