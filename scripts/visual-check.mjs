/**
 * Real-browser checks that jsdom cannot do: layout, overflow, legibility and
 * horizontal-scroll regressions at several breakpoints.
 *
 * Requires a Chromium build. In locked-down sandboxes use the bundled one:
 *   LD_LIBRARY_PATH=/tmp/al2023/lib node scripts/visual-check.mjs
 *
 *   node scripts/visual-check.mjs [baseUrl]
 */
import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'

const base = process.argv[2] || 'http://localhost:4173'
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'laptop', width: 1280, height: 800, isMobile: false },
  { name: 'tablet', width: 768, height: 1024, isMobile: true },
  { name: 'mobile', width: 390, height: 844, isMobile: true },
]

const browser = await puppeteer.launch({
  args: [...chromium.args, '--no-sandbox'],
  executablePath: await chromium.executablePath(),
  headless: true,
})

let failures = 0
const report = (cond, msg) => {
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`)
  if (!cond) failures++
}

for (const vp of VIEWPORTS) {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.setViewport({
    width: vp.width,
    height: vp.height,
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    deviceScaleFactor: 1,
  })
  await page.goto(base, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 4500))

  /* ---- no horizontal overflow ---- */
  const overflow = await page.evaluate(() => {
    const de = document.documentElement
    return { scroll: de.scrollWidth, client: de.clientWidth }
  })
  report(
    overflow.scroll <= overflow.client + 1,
    `${vp.name}: no horizontal overflow (${overflow.scroll} <= ${overflow.client})`,
  )

  /* ---- hero headline must be a single line ---- */
  const headline = await page.evaluate(() => {
    const span = document.querySelector('#home h1 span span')
    if (!span) return null
    const range = document.createRange()
    range.selectNodeContents(span)
    const lines = range.getClientRects().length
    const rect = span.getBoundingClientRect()
    return { lines, width: Math.round(rect.width), right: Math.round(rect.right) }
  })
  report(headline !== null, `${vp.name}: hero headline rendered`)
  if (headline) {
    report(headline.lines === 1, `${vp.name}: hero headline on one line (${headline.lines})`)
    report(
      headline.right <= overflow.client + 1,
      `${vp.name}: hero headline within viewport (right=${headline.right})`,
    )
  }

  /* ---- every visible image actually decoded ----
     Force lazy images to load first; `loading="lazy"` leaves below-the-fold
     images un-fetched, which is not a broken asset. */
  await page.evaluate(async () => {
    for (const img of document.images) img.loading = 'eager'
    const pending = [...document.images].filter((i) => !i.complete)
    await Promise.all(
      pending.map(
        (i) =>
          new Promise((res) => {
            i.addEventListener('load', res, { once: true })
            i.addEventListener('error', res, { once: true })
            setTimeout(res, 8000)
          }),
      ),
    )
  })
  await new Promise((r) => setTimeout(r, 600))

  const imgs = await page.evaluate(() => {
    const bad = []
    for (const img of document.images) {
      const r = img.getBoundingClientRect()
      const visible = r.width > 1 && r.height > 1
      if (visible && (!img.complete || img.naturalWidth === 0)) bad.push(img.currentSrc || img.src)
    }
    return bad
  })
  report(imgs.length === 0, `${vp.name}: all visible images decoded${imgs.length ? ' → ' + imgs[0] : ''}`)

  /* ---- key sections present and non-empty ---- */
  const sections = await page.evaluate(() =>
    ['home', 'profile', 'talents', 'weapons', 'constellations', 'builds', 'gallery', 'ending'].map((id) => {
      const el = document.getElementById(id)
      return { id, present: !!el, height: el ? Math.round(el.getBoundingClientRect().height) : 0 }
    }),
  )
  const empties = sections.filter((s) => !s.present || s.height < 200)
  report(empties.length === 0, `${vp.name}: all 8 sections have content${empties.length ? ' → ' + empties.map((e) => e.id) : ''}`)

  /* ---- talent artwork fills its column (regression guard) ---- */
  const talentArt = await page.evaluate(() => {
    const img = document.querySelector('#panel-skill [data-art]')
    if (!img) return null
    const wrap = img.parentElement
    const a = img.getBoundingClientRect()
    const b = wrap.getBoundingClientRect()
    return { imgW: Math.round(a.width), wrapW: Math.round(b.width), imgH: Math.round(a.height), wrapH: Math.round(b.height) }
  })
  if (talentArt) {
    report(
      talentArt.imgW >= talentArt.wrapW * 0.95 && talentArt.imgH >= talentArt.wrapH * 0.95,
      `${vp.name}: talent art fills its column (${talentArt.imgW}x${talentArt.imgH} in ${talentArt.wrapW}x${talentArt.wrapH})`,
    )
  }

  /* ---- text contrast sample on the hero copy ---- */
  const contrast = await page.evaluate(() => {
    const label = document.querySelector('#home .stat-label, #home span.tracking-\\[0\\.24em\\]')
    const el = document.querySelector('#home p') || label
    if (!el) return null
    const cs = getComputedStyle(el)
    return { opacity: cs.opacity, color: cs.color }
  })
  if (contrast) report(Number(contrast.opacity) > 0.5, `${vp.name}: hero copy not faded out (opacity ${contrast.opacity})`)

  report(errors.length === 0, `${vp.name}: no console/page errors${errors.length ? ' → ' + errors[0] : ''}`)

  await page.close()
}

await browser.close()
console.log(failures ? `\n${failures} check(s) failed` : '\nAll visual checks passed')
process.exit(failures ? 1 : 0)
