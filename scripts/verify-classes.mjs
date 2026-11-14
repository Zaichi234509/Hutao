/**
 * Fails the build if any Tailwind class used in src/ produced no CSS rule.
 *
 * Tailwind silently drops unknown utilities (e.g. `h-4.5`, `text-ivory/58`,
 * `bg-ink/96` — values outside its default scales). Those fail *quietly*: the
 * colour or size simply doesn't apply. This guard turns that into a hard error.
 *
 *   node scripts/verify-classes.mjs [dist/assets/index-*.css]
 */
import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { globSync } from 'fs'

const cssPath =
  process.argv[2] ||
  (() => {
    const dir = 'dist/assets'
    const f = readdirSync(dir).find((n) => /^index-.*\.css$/.test(n))
    if (!f) throw new Error('No built CSS found — run `npm run build` first.')
    return join(dir, f)
  })()

const css = readFileSync(cssPath, 'utf8')
// remove backslash escapes so `.text-ivory\/40` becomes `.text-ivory/40`
const cssUnescaped = css.replace(/\\/g, '')

/** Tokens produced by template interpolation rather than literals. */
const NOISE = new Set([
  'active', 'align', 'filled', 'lightbox', 'open', 'scrolled', 'selected', 'unlocked',
])

const files = globSync('src/**/*.tsx')
const tokens = new Set()

for (const f of files) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)) {
    const body = m[1] ?? m[2] ?? ''
    for (const raw of body.split(/\s+/)) {
      const t = raw.trim().replace(/'$/, '')
      if (!t || t.includes('{') || t.includes('$')) continue
      const simple = /^[a-z]+(-[a-z0-9/[\]\.%#(),_-]+)?$/.test(t)
      const variant = /^(hover|focus|group-hover|sm|md|lg|xl|last|focus-visible):/.test(t)
      if (simple || variant) tokens.add(t)
    }
  }
}

const present = (cls) => {
  // Tailwind escapes special characters in the emitted selector. Rather than
  // modelling every case, compare on the *unescaped* form: strip the escapes
  // from the stylesheet once, then look for a literal `.class` occurrence.
  const needle = '.' + cls
  return cssUnescaped.includes(needle)
}

const missing = [...tokens].filter((t) => !NOISE.has(t) && !present(t)).sort()

if (missing.length) {
  console.error(`\n✗ ${missing.length} Tailwind class(es) produced no CSS rule:\n`)
  for (const m of missing) console.error('   ' + m)
  console.error('\nUse a value from Tailwind\'s scales or an arbitrary value, e.g. text-ivory/[0.58].\n')
  process.exit(1)
}

console.log(`✓ ${tokens.size} Tailwind classes resolved to CSS rules (${cssPath})`)
