import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ args: [...chromium.args, '--no-sandbox'], executablePath: await chromium.executablePath(), headless: true, defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 5000))
const out = await page.evaluate(() => {
  const h1 = document.querySelector('#home h1')
  const span = h1.querySelector('span span')
  const cs = getComputedStyle(h1)
  // measure the rendered text width
  const range = document.createRange()
  range.selectNodeContents(span)
  const rects = [...range.getClientRects()].map(r => ({ w: Math.round(r.width), h: Math.round(r.height), y: Math.round(r.y) }))
  return {
    fontSize: cs.fontSize, letterSpacing: cs.letterSpacing, fontFamily: cs.fontFamily.slice(0, 60),
    fontFeature: cs.fontKerning, h1Width: Math.round(h1.getBoundingClientRect().width),
    h1Height: Math.round(h1.getBoundingClientRect().height),
    lineRects: rects, lines: rects.length,
    textWidth: Math.round(span.getBoundingClientRect().width),
    wordSpacing: cs.wordSpacing,
  }
})
console.log(JSON.stringify(out, null, 1))
await browser.close()
