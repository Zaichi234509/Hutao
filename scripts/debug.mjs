import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox'], executablePath: await chromium.executablePath(),
  headless: true, defaultViewport: { width: 1440, height: 900 },
})
const page = await browser.newPage()
await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 2500))

const heroInfo = await page.evaluate(() => {
  const pick = (sel) => {
    const el = document.querySelector(sel)
    if (!el) return { sel, missing: true }
    const cs = getComputedStyle(el)
    const r = el.getBoundingClientRect()
    return { sel, opacity: cs.opacity, color: cs.color, transform: cs.transform.slice(0, 40),
             w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) }
  }
  return {
    typeLayer: pick('[data-layer="type"]'),
    h1: pick('#home h1'),
    h1span: pick('#home h1 span span'),
    subtitle: pick('#home [data-hero="ornament"]'),
    tagline: pick('#home [data-hero="fade"] p'),
    statLabel: pick('#home .stat-label'),
    veil: pick('[data-layer="veil"]'),
    fore: pick('[data-layer="fore"]'),
  }
})
console.log('HERO', JSON.stringify(heroInfo, null, 1))

const talent = await page.evaluate(() => {
  const panel = document.querySelector('#panel-skill')
  if (!panel) return 'no panel'
  const kids = [...panel.children].map((el, i) => {
    const r = el.getBoundingClientRect(); const cs = getComputedStyle(el)
    return { i, cls: String(el.className).slice(0, 40), tag: el.tagName, x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height), grid: cs.gridColumnStart }
  })
  const img = panel.querySelector('[data-art]')
  const ir = img?.getBoundingClientRect()
  return { cols: getComputedStyle(panel).gridTemplateColumns, kids,
           img: ir ? { x: Math.round(ir.x), w: Math.round(ir.width), h: Math.round(ir.height), natural: img.naturalWidth + 'x' + img.naturalHeight } : null }
})
console.log('\nTALENT PANEL', JSON.stringify(talent, null, 1))
await browser.close()
