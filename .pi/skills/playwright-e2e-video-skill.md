---
name: playwright-e2e-video-capture
description: >
  Comprehensive Playwright end-to-end validation with video capture, traces,
  screenshots, and report generation for product compliance review. Use when
  user asks to test flows, record evidence, validate PRD compliance, generate
  slide decks from evidence, or run automated browser QA.
---

Run Playwright like disciplined cave tester. Capture proof, not vibes.

## Purpose

Validate full product flows end-to-end. Save video, trace, screenshots, logs. Use results to prove implementation matches PRD/UI requirements.

## When to use

- User asks for E2E testing
- User asks for recordings/videos of app flows
- User asks for compliance validation
- User asks for QA evidence deck / presentation

## Rules

- Test actual user journeys, not isolated clicks only.
- Prefer stable selectors: `data-testid`, labels, roles.
- Record both happy path and failure/edge cases.
- Save artifacts in predictable folders.
- Generate human-reviewable summary after run.
- If local browser fallback differs from Telegram runtime, state it clearly.

## Minimum artifact set

- Playwright HTML report
- Video per scenario
- Trace per scenario
- Key screenshots for pass/fail states
- Written compliance summary
- HTML slide deck embedding or linking evidence

## Required flows

1. Restaurant discovery
2. Menu add/remove items
3. Cart review/edit
4. Checkout with location
5. Payment success
6. Payment failure
7. Guard rails / empty states as relevant

## Suggested commands

- Install browsers: `npx playwright install chromium`
- Run tests: `npx playwright test`
- Open report: `npx playwright show-report`

## Output conventions

- Videos: `test-results/` or configured artifacts dir
- Report: `playwright-report/`
- Review deck: `review/slide-deck.html`
- Summary: `review/compliance-summary.md`

## Review method

For each scenario:
- state requirement
- show test steps
- attach evidence artifact path
- mark pass/fail/blocker

## Cave warning

If video capture toolchain/browser missing, say exact missing dependency and fix path. No pretend testing.
