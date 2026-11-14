import { JSDOM } from 'jsdom'
import { readFileSync } from 'fs'

const js = readFileSync(process.argv[2], 'utf8')

const dom = new JSDOM(
  `<!doctype html><html><head></head><body><div id="root"></div></body></html>`,
  { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/' },
)
const { window } = dom
// esbuild injects NODE_ENV guards referencing `process`
window.process = { env: { NODE_ENV: 'production' }, browser: true, version: '' }

// --- minimal browser APIs that the app relies on at import/mount time ---
window.matchMedia = (q) => ({
  matches: q.includes('min-width'), // desktop-ish
  media: q,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() { return false },
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
window.HTMLCanvasElement.prototype.getContext = () => null
window.SVGElement.prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 })
Object.defineProperty(window, 'innerWidth', { value: 1440, writable: true })
Object.defineProperty(window, 'innerHeight', { value: 900, writable: true })

const errors = []
window.addEventListener('error', (e) => errors.push(String(e.error || e.message)))
window.console.error = (...a) => errors.push(a.map(String).join(' '))
window.console.warn = () => {}

try {
  window.eval(js)
} catch (e) {
  errors.push('EVAL: ' + (e && e.stack ? e.stack : e))
}

// wait until React has flushed real content (or give up after ~6s)
const rootEl = window.document.getElementById('root')
for (let i = 0; i < 60; i++) {
  await new Promise((r) => setTimeout(r, 100))
  if (rootEl && rootEl.innerHTML.length > 5000) break
}

const root = window.document.getElementById('root')
const state = window.__SMOKE__ || { ok: false, errors: ['no state'], nodes: 0 }
const html = root ? root.innerHTML : ''
const count = (tag) => (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length

const report = {
  ok: state.ok && !errors.some((e) => /Error|error/i.test(e) && !/Warning/.test(e)),
  reactErrors: (state.errors || []).filter(Boolean).slice(0, 12),
  windowErrors: errors.slice(0, 12),
  htmlLength: html.length,
  sections: [...html.matchAll(/id="([a-z]+)"/g)].map((m) => m[1]).slice(0, 20),
  buttons: count('button'),
  images: count('img'),
  svgs: count('svg'),
  tables: count('table'),
  h2: count('h2'),
  hasHeroTitle: html.includes('Hu Tao'),
  hasClosingLine: html.includes('Every journey has'),
  hasStaffOfHoma: html.includes('Staff of Homa'),
  hasCrimsonBouquet: html.includes('Crimson Bouquet'),
  brokenImgSrc: [...html.matchAll(/<img[^>]+src="([^"]*)"/g)]
    .map((m) => m[1])
    .filter((s) => !s || s.includes('undefined'))
    .slice(0, 5),
}
report.imageSrcs = [...new Set([...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]))]
console.log(JSON.stringify(report, null, 2))
// GSAP leaves rAF loops running in jsdom; hard-stop so the process can exit
try { window.close() } catch {}
process.exit(0)
