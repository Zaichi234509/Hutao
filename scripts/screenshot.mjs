/**
 * Saves full-page and section screenshots of the running site.
 * Requires a Chromium install reachable by Playwright (`npx playwright install chromium`).
 *
 *   node scripts/screenshot.mjs [baseUrl] [outDir]
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const base = process.argv[2] || 'http://localhost:5173'
const outDir = process.argv[3] || 'docs/screens'
mkdirSync(outDir, { recursive: true })

const shots = [
  { name: 'hero', selector: '#home' },
  { name: 'profile', selector: '#profile' },
  { name: 'talents', selector: '#talents' },
  { name: 'weapons', selector: '#weapons' },
  { name: 'constellations', selector: '#constellations' },
  { name: 'builds', selector: '#builds' },
  { name: 'gallery', selector: '#gallery' },
  { name: 'ending', selector: '#ending' },
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
await page.goto(base, { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)

for (const shot of shots) {
  const el = await page.$(shot.selector)
  if (!el) {
    console.log('missing section', shot.selector)
    continue
  }
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(1400)
  await el.screenshot({ path: `${outDir}/${shot.name}.png` })
  console.log('saved', shot.name)
}

// mobile pass
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
})
await mobile.goto(base, { waitUntil: 'networkidle' })
await mobile.waitForTimeout(2500)
await mobile.screenshot({ path: `${outDir}/mobile-hero.png` })
await mobile.evaluate(() => window.scrollTo(0, window.innerHeight * 1.1))
await mobile.waitForTimeout(1400)
await mobile.screenshot({ path: `${outDir}/mobile-profile.png` })
console.log('saved mobile')

await browser.close()
