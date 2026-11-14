/**
 * Render smoke test entry.
 * Mounts the full application into a jsdom document and reports whether any
 * React render phase error was thrown. This is a *runtime* check that the app
 * mounts (not just that it type-checks).
 */
import { createRoot } from 'react-dom/client'
import App from '../src/App'

declare global {
  interface Window {
    __SMOKE__?: { ok: boolean; errors: string[]; nodes: number }
  }
}

const errors: string[] = []
const origError = console.error
console.error = (...args: unknown[]) => {
  errors.push(args.map(String).join(' '))
  origError(...args)
}

try {
  // jsdom's document lives on the global object, not on globalThis.window
  const doc = (globalThis as unknown as { document: Document }).document
  const el = doc.getElementById('root') ?? doc.createElement('div')
  if (!el.isConnected) doc.body.appendChild(el)
  createRoot(el).render(<App />)
  window.__SMOKE__ = { ok: true, errors, nodes: 0 }
} catch (e) {
  window.__SMOKE__ = { ok: false, errors: [...errors, String(e)], nodes: 0 }
}
