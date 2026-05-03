import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const testResultsDir = path.join(root, 'test-results')
const reviewDir = path.join(root, 'review')
const reviewPath = path.join(reviewDir, 'slide-deck.html')
const summaryPath = path.join(reviewDir, 'compliance-summary.md')

fs.mkdirSync(reviewDir, { recursive: true })

function walk(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return [full]
  })
}

const files = walk(testResultsDir)
const videos = files.filter((file) => file.endsWith('.webm'))
const traces = files.filter((file) => file.endsWith('.zip'))
const screenshots = files.filter((file) => file.endsWith('.png'))

const rel = (file) => path.relative(reviewDir, file).split(path.sep).join('/')

const scenarioCards = videos.length
  ? videos
      .map(
        (video, index) => `
        <section class="slide">
          <p class="eyebrow">Evidence ${index + 1}</p>
          <h2>${path.basename(path.dirname(video))}</h2>
          <video controls preload="metadata" src="${rel(video)}"></video>
          <p class="meta">Video: ${rel(video)}</p>
        </section>`,
      )
      .join('\n')
  : `
    <section class="slide">
      <p class="eyebrow">Evidence</p>
      <h2>No videos found yet</h2>
      <p>Run <code>npm run e2e</code> first, then regenerate this deck with <code>npm run review:deck</code>.</p>
    </section>`

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Choplink Review Deck</title>
    <style>
      :root { --bg: #0f0f12; --surface: #18181d; --text: #ffffff; --muted: #b6b6c2; --accent: #e53935; }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: Inter, system-ui, sans-serif; background: var(--bg); color: var(--text); }
      .deck { display: grid; gap: 24px; padding: 24px; width: min(1200px, 100%); margin: 0 auto; }
      .slide { background: linear-gradient(180deg, rgba(229,57,53,0.12), rgba(255,255,255,0.02)); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 24px; }
      h1, h2, h3, p { margin: 0 0 12px; }
      .eyebrow { text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-size: 12px; }
      .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
      .metric { background: rgba(255,255,255,0.03); border-radius: 16px; padding: 16px; }
      ul { margin: 0; padding-left: 20px; color: var(--muted); }
      video { width: 100%; border-radius: 18px; background: #000; min-height: 240px; }
      code { background: rgba(255,255,255,0.08); border-radius: 8px; padding: 2px 6px; }
      .meta { color: var(--muted); font-size: 14px; }
      a { color: #ffb4b2; }
    </style>
  </head>
  <body>
    <main class="deck">
      <section class="slide">
        <p class="eyebrow">Choplink</p>
        <h1>Telegram Mini App Rewrite Review</h1>
        <p class="meta">Generated evidence deck for PRD/UI compliance review.</p>
        <div class="grid">
          <div class="metric"><h3>Videos</h3><p>${videos.length}</p></div>
          <div class="metric"><h3>Traces</h3><p>${traces.length}</p></div>
          <div class="metric"><h3>Screenshots</h3><p>${screenshots.length}</p></div>
        </div>
      </section>

      <section class="slide">
        <p class="eyebrow">Delivered</p>
        <h2>MVP Feature Coverage</h2>
        <ul>
          <li>Restaurant discovery with skeleton loading and lazy-loaded images</li>
          <li>Search across dishes and restaurants</li>
          <li>Menu browsing with inline quantity stepper and multi-dish ordering</li>
          <li>Floating cart bar and editable cart</li>
          <li>Checkout with location-based pricing dropdown and rider note</li>
          <li>Embedded mock Paystack payment success/failure</li>
          <li>Success screen, stored order history, and re-order shortcuts</li>
          <li>Telegram-style BackButton/MainButton fallback</li>
        </ul>
      </section>

      <section class="slide">
        <p class="eyebrow">Artifacts</p>
        <h2>Reference Paths</h2>
        <ul>
          <li>Implementation plan: <code>../.pi/product/implementation.md</code></li>
          <li>PRD: <code>../.pi/product/prd.md</code></li>
          <li>UI Decisions: <code>../.pi/product/ui.md</code></li>
          <li>Playwright report: <code>../playwright-report/index.html</code></li>
        </ul>
      </section>

      ${scenarioCards}
    </main>
  </body>
</html>`

const summary = `# Compliance Summary

## Evidence counts
- Videos: ${videos.length}
- Traces: ${traces.length}
- Screenshots: ${screenshots.length}

## Implemented MVP areas
- Restaurant discovery and discovery sections
- Search for dishes and restaurants
- Menu browsing and inline multi-dish selection
- Cart management
- Checkout with location-based pricing and rider note
- Embedded payment mock flow
- Success confirmation and re-order history
- Telegram chrome fallback for local testing

## Evidence paths
${videos.map((file) => `- Video: ${rel(file)}`).join('\n') || '- No videos found'}
${traces.map((file) => `- Trace: ${rel(file)}`).join('\n') || '- No traces found'}
`

fs.writeFileSync(reviewPath, html)
fs.writeFileSync(summaryPath, summary)
console.log(`Generated ${reviewPath}`)
console.log(`Generated ${summaryPath}`)
