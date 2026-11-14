import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'fs'

const base = process.argv[2] || 'http://localhost:4173'
const out = process.argv[3] || 'docs/screens'
mkdirSync(out, { recursive: true })

const execPath = await chromium.executablePath()
console.log('chromium:', execPath)
const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox', '--disable-gpu'],
  executablePath: execPath,
  headless: true,
  defaultViewport: { width: 1440, height: 900 },
})
const page = await browser.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))
page.on('requestfailed', (r) => errors.push('REQFAIL: ' + r.url()))

await page.goto(base, { waitUntil: 'networkidle2', timeout: 60000 })
await new Promise((r) => setTimeout(r, 6000))

const sections = ['#home', '#profile', '#talents', '#weapons', '#constellations', '#builds', '#gallery', '#ending']
for (const sel of sections) {
  const name = sel.replace('#', '')
  const el = await page.$(sel)
  if (!el) { console.log('missing', sel); continue }
  await el.evaluate((n) => n.scrollIntoView({ block: 'start' }))
  await new Promise((r) => setTimeout(r, 2000))
  await page.screenshot({ path: `${out}/${name}.png` })
  console.log('saved', name)
}

// mobile
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
await page.goto(base, { waitUntil: 'networkidle2' })
await new Promise((r) => setTimeout(r, 2000))
await page.screenshot({ path: `${out}/mobile-hero.png` })
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.18))
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: `${out}/mobile-top2.png` })

console.log('console errors:', errors.length ? errors.slice(0, 10) : 'none')
await browser.close()
