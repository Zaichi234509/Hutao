import chromium from '@sparticuz/chromium'
import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ args: [...chromium.args, '--no-sandbox'], executablePath: await chromium.executablePath(), headless: true, defaultViewport: { width: 900, height: 900 } })
const page = await browser.newPage()
await page.goto('http://localhost:4173', { waitUntil: 'networkidle2' })
await new Promise(r => setTimeout(r, 3000))
const el = await page.$('#constellations [data-map]')
await el.evaluate(n => n.scrollIntoView({ block: 'center' }))
await new Promise(r => setTimeout(r, 2500))
await el.screenshot({ path: 'docs/screens/wings.png' })
console.log('saved')
await browser.close()
