import { JSDOM } from 'jsdom'
import { readFileSync } from 'fs'

const js = readFileSync(process.argv[2], 'utf8')
const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>', {
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  url: 'http://localhost/',
})
const { window } = dom
window.process = { env: { NODE_ENV: 'production' } }
window.matchMedia = (q) => ({
  matches: false,
  media: q,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() {
    return false
  },
})
window.IntersectionObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }
window.scrollTo = () => {}
window.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 0)
window.cancelAnimationFrame = (id) => clearTimeout(id)
window.scrollBy = () => {}
window.HTMLElement.prototype.scrollIntoView = () => {}
window.HTMLElement.prototype.scrollBy = () => {}
window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 })
Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true })
Object.defineProperty(window, 'innerHeight', { value: 900, writable: true })
const consoleErrors = []
window.console.error = (...a) => consoleErrors.push(a.map(String).join(' '))

window.eval(js)

const doc = window.document
const root = doc.getElementById('root')
for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 100))
  if (root.innerHTML.length > 5000) break
}
const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms))
const results = []
const check = (name, pass, detail = '') => results.push({ name, pass: !!pass, detail })

const byText = (sel, text) =>
  [...doc.querySelectorAll(sel)].find((el) => (el.textContent || '').toLowerCase().includes(text.toLowerCase()))
const click = (el) => {
  if (!el) return false
  el.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }))
  return true
}

/* ---------- 1. TALENT TABS ---------- */
{
  const tabs = [...doc.querySelectorAll('[role="tab"]')].filter((t) => t.id.startsWith('tab-'))
  check('talent: 3 tabs present', tabs.length === 3, `${tabs.length}`)
  const panel = doc.getElementById('panel-skill')
  check('talent: default panel is Guide to Afterlife', !!panel, panel ? 'ok' : 'missing')

  // switch to burst (third tab)
  const burstTab = doc.getElementById('tab-burst')
  click(burstTab)
  await wait(80)
  const burstPanel = doc.getElementById('panel-burst')
  check('talent: switch to burst panel', !!burstPanel)
  check(
    'talent: burst table shows Spirit Soother values',
    burstPanel && burstPanel.textContent.includes('494.0%'),
    burstPanel ? burstPanel.textContent.slice(0, 40) : '',
  )

  // level toggle inside burst
  const lv1 = [...burstPanel.querySelectorAll('button')].find((b) => b.textContent.trim() === 'Lv. 1')
  click(lv1)
  await wait(80)
  check(
    'talent: Lv.1 multiplier applied',
    doc.getElementById('panel-burst').textContent.includes('303.3%'),
  )

  // keyboard: ArrowRight from burst wraps to normal
  burstTab.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  await wait(80)
  check('talent: arrow-key navigation works', !!doc.getElementById('panel-normal'))

  // normal panel content
  check(
    'talent: normal attack rows present',
    doc.getElementById('panel-normal').textContent.includes('Charged Attack DMG'),
  )
}

/* ---------- 2. WEAPON CAROUSEL ---------- */
{
  const carousel = doc.querySelector('[aria-roledescription="carousel"]')
  check('carousel: stage exists', !!carousel)
  const next = doc.querySelector('[aria-label="Next weapon"]')
  const prev = doc.querySelector('[aria-label="Previous weapon"]')
  check('carousel: next/prev buttons exist', !!next && !!prev)

  const nameIn = () => doc.querySelector('#weapons h3')?.textContent?.trim()
  const startName = nameIn()
  click(next)
  await wait(120)
  const afterNext = nameIn()
  check('carousel: next changes selected weapon', startName !== afterNext, `${startName} -> ${afterNext}`)
  check('carousel: second weapon is Primordial Jade', afterNext === 'Primordial Jade Winged-Spear', afterNext)

  click(prev)
  await wait(120)
  check('carousel: prev returns to Staff of Homa', nameIn() === 'Staff of Homa', nameIn())

  // keyboard navigation: we are on index 0 (Staff of Homa), so one step lands on index 1
  const right = new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true })
  carousel.dispatchEvent(right)
  await wait(200)
  check('carousel: ArrowRight advances', nameIn() === 'Primordial Jade Winged-Spear', nameIn())

  // End key jumps to last
  carousel.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'End', bubbles: true }))
  await wait(120)
  check('carousel: End selects last weapon', nameIn() === 'Blackcliff Pole', nameIn())

  // dot selection
  const dot = doc.querySelector('[aria-label="Deathmatch"]')
  click(dot)
  await wait(120)
  check('carousel: dot click selects weapon', nameIn() === 'Deathmatch', nameIn())
  check(
    'carousel: detail panel shows correct Base ATK',
    doc.querySelector('#weapons').textContent.includes('454'),
  )
  check(
    'carousel: detail shows verified substat',
    doc.querySelector('#weapons').textContent.includes('36.8%'),
  )

  // pointer swipe (drag left -> next)
  const before = nameIn()
  const fire = (type, x) =>
    carousel.dispatchEvent(
      new window.PointerEvent(type, { clientX: x, clientY: 200, bubbles: true, pointerId: 1, button: 0 }),
    )
  try {
    fire('pointerdown', 600)
    fire('pointermove', 560)
    fire('pointermove', 480)
    fire('pointerup', 470)
    await wait(150)
    check('carousel: pointer swipe advances', nameIn() !== before, `${before} -> ${nameIn()}`)
  } catch (e) {
    check('carousel: pointer swipe advances', false, String(e).slice(0, 80))
  }

  // card click to select by index
  const cards = [...doc.querySelectorAll('#weapons button[aria-label^="View "]')]
  check('carousel: 6 weapon cards rendered', cards.length === 6, `${cards.length}`)
  click(cards[0])
  await wait(120)
  check('carousel: clicking center card selects it', nameIn() === 'Staff of Homa', nameIn())
}

/* ---------- 3. CONSTELLATIONS ---------- */
{
  const stars = [...doc.querySelectorAll('#constellations [role="button"]')].filter((el) =>
    (el.getAttribute('aria-label') || '').startsWith('Constellation'),
  )
  check('constellation: 6 interactive stars', stars.length === 6, `${stars.length}`)
  const heading = () => doc.querySelector('#constellations h3')?.textContent?.trim()
  check('constellation: default is C1', heading() === 'Crimson Bouquet', heading())
  click(stars[5])
  await wait(120)
  check("constellation: C6 selection updates panel", heading() === "Butterfly's Embrace", heading())
  check(
    'constellation: C6 description present',
    doc.querySelector('#constellations').textContent.includes('100%'),
  )
  click(stars[3])
  await wait(120)
  check('constellation: C4 selection updates panel', heading() === 'Garden of Eternal Rest', heading())
}

/* ---------- 4. BUILD PRESETS ---------- */
{
  const presets = [...doc.querySelectorAll('#builds [role="tab"]')]
  check('builds: 3 preset tabs', presets.length === 3, `${presets.length}`)
  const panel = () => doc.getElementById('build-panel')
  const has = (t) => panel().textContent.includes(t)
  check('builds: default vaporize content', has('Vaporize DPS') || has('Elemental Mastery'))

  click(presets[1])
  await wait(100)
  check('builds: pure pyro preset switches', has('Mono Pyro') && has("Shimenawa's Reminiscence"))

  click(presets[2])
  await wait(100)
  check('builds: general preset switches', has('Marechaussee Hunter') && has('Comfort Vape'))

  // artifact slot icons render as svg
  const slots = doc.querySelectorAll('#builds [data-slot]')
  check('builds: 5 artifact slot icons', slots.length === 5, `${slots.length}`)
}

/* ---------- 5. GALLERY + LIGHTBOX ---------- */
{
  const tiles = [...doc.querySelectorAll('#gallery [data-tile]')]
  check('gallery: 9 artwork tiles', tiles.length === 9, `${tiles.length}`)

  click(tiles[2])
  await wait(120)
  const lb = doc.getElementById('lightbox')
  check('gallery: lightbox opens', !!lb)
  check('gallery: lightbox shows dialog role', lb?.getAttribute('role') === 'dialog')

  const before = lb?.textContent || ''
  const nextBtn = lb?.querySelector('[aria-label="Next artwork"]')
  click(nextBtn)
  await wait(120)
  const lb2 = doc.getElementById('lightbox')
  check('gallery: lightbox next changes artwork', lb2?.textContent !== before)

  // thumbnails
  const thumbs = lb2?.querySelectorAll('[aria-label^="View "]') || []
  check('gallery: 9 thumbnails in lightbox', thumbs.length === 9, `${thumbs.length}`)

  // escape closes
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  await wait(120)
  check('gallery: Escape closes lightbox', !doc.getElementById('lightbox'))

  // reopen via carousel strip, arrow key nav
  const strip = [...doc.querySelectorAll('#gallery button[aria-label^="Open "]')]
  click(strip[0])
  await wait(100)
  check('gallery: reopen from filmstrip', !!doc.getElementById('lightbox'))
  window.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  await wait(100)
  check('gallery: arrow key navigates', (doc.getElementById('lightbox')?.textContent || '').includes('02'))
}

/* ---------- 6. NAV / ANCHORS ---------- */
{
  const navButtons = [...doc.querySelectorAll('nav[aria-label="Primary"] button')]
  check('nav: 7 primary links', navButtons.length === 7, `${navButtons.length}`)
  const ids = ['home', 'profile', 'talents', 'weapons', 'constellations', 'builds', 'gallery', 'ending']
  const missing = ids.filter((id) => !doc.getElementById(id))
  check('nav: all target sections exist', missing.length === 0, missing.join(','))

  // mobile menu open/close
  const openBtn = doc.querySelector('[aria-label="Open navigation menu"]')
  click(openBtn)
  await wait(100)
  const menu = doc.getElementById('mobile-menu')
  check('nav: mobile menu opens', menu?.getAttribute('aria-hidden') === 'false')
  const closeBtn = doc.querySelector('[aria-label="Close menu"]')
  click(closeBtn)
  await wait(100)
  check('nav: mobile menu closes', doc.getElementById('mobile-menu')?.getAttribute('aria-hidden') === 'true')
}

/* ---------- 7. HERO ---------- */
{
  const hero = doc.getElementById('home')
  check('hero: parallax layers present', hero.querySelectorAll('[data-layer]').length >= 6,
    `${hero.querySelectorAll('[data-layer]').length}`)
  check('hero: character artwork', !!hero.querySelector('img[alt*="Hu Tao"]'))
  check('hero: closing CTA scrolls to profile', !!hero.querySelector('.btn-gold'))
}

const failed = results.filter((r) => !r.pass)
console.log('\n===== INTERACTION TESTS =====')
for (const r of results) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? '  [' + r.detail + ']' : ''}`)
}
console.log(`\n${results.length - failed.length}/${results.length} passed`)
if (consoleErrors.length) {
  console.log('console.error output:', consoleErrors.slice(0, 5))
}
try { window.close() } catch {}
process.exit(failed.length ? 1 : 0)
