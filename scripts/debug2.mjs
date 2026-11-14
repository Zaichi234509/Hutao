import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ args: [...chromium.args, '--no-sandbox'], executablePath: await chromium.executablePath(), headless: true, defaultViewport: { width: 1440, height: 900 } })
const page = await browser.newPage()
const logs = []
page.on('console', m => logs.push(m.type() + ': ' + m.text()))
await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 2500))
const out = await page.evaluate(() => {
  const panel = document.querySelector('#panel-skill')
  const grid = panel.firstElementChild
  const gcs = getComputedStyle(grid)
  const artWrap = grid.children[0]
  const img = grid.querySelector('[data-art]')
  const acs = getComputedStyle(artWrap)
  const ics = getComputedStyle(img)
  return {
    panelDisplay: getComputedStyle(panel).display,
    gridDisplay: gcs.display,
    gridTemplate: gcs.gridTemplateColumns,
    gridWidth: Math.round(grid.getBoundingClientRect().width),
    artWrapCols: acs.gridColumn,
    artWrapW: Math.round(artWrap.getBoundingClientRect().width),
    artWrapH: Math.round(artWrap.getBoundingClientRect().height),
    imgW: Math.round(img.getBoundingClientRect().width),
    imgH: Math.round(img.getBoundingClientRect().height),
    imgMaxW: ics.maxWidth, imgHeightCss: ics.height, imgObjectFit: ics.objectFit,
    imgDisplay: ics.display, imgPos: ics.position,
  }
})
console.log(JSON.stringify(out, null, 1))
console.log('CONSOLE:', logs.slice(0, 10))
await browser.close()
