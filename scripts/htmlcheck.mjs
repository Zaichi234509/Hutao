import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ args: [...chromium.args, '--no-sandbox'], executablePath: await chromium.executablePath(), headless: true })
const page = await browser.newPage()
await page.goto(process.argv[2] || 'http://localhost:4173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 2000))
const problems = await page.evaluate(() => {
  const out = []
  // block-level elements nested inside phrasing content
  const blockInInline = ['p','div','h1','h2','h3','h4','p','ul','ol','li','section','article']
  for (const el of document.querySelectorAll('span, p, a, button, label')) {
    for (const child of el.children) {
      if (blockInInline.includes(child.tagName.toLowerCase())) {
        out.push(`<${child.tagName.toLowerCase()}> inside <${el.tagName.toLowerCase()}> (${(el.textContent||'').trim().slice(0,30)})`)
      }
    }
  }
  // images that failed to load
  for (const img of document.images) if (!img.complete || img.naturalWidth === 0) out.push('broken img: ' + img.src)
  // elements overflowing the viewport horizontally
  const de = document.documentElement
  if (de.scrollWidth > de.clientWidth + 1) out.push(`horizontal overflow: scrollWidth=${de.scrollWidth} clientWidth=${de.clientWidth}`)
  return [...new Set(out)]
})
console.log(problems.length ? problems.slice(0, 30).join('\n') : 'no structural problems found')
await browser.close()
