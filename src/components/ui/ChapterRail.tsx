import { useEffect, useState } from 'react'
import { useActiveSection, useScrollTo } from '../../hooks/useUI'

const CHAPTERS = [
  { id: 'home', label: 'Hero' },
  { id: 'profile', label: 'Profile' },
  { id: 'talents', label: 'Talents' },
  { id: 'weapons', label: 'Armory' },
  { id: 'constellations', label: 'Stars' },
  { id: 'builds', label: 'Builds' },
  { id: 'gallery', label: 'Gallery' },
]

const IDS = CHAPTERS.map((c) => c.id)

/**
 * Vertical chapter rail on wide screens.
 * A thin gold spine with diamond markers that track the active chapter.
 */
export default function ChapterRail() {
  const active = useActiveSection(IDS)
  const scrollTo = useScrollTo()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      aria-label="Chapter progress"
      className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-5 transition-opacity duration-700 xl:flex ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <span className="font-sans text-[8px] uppercase tracking-[0.3em] text-gold/40 [writing-mode:vertical-rl]">
        Chapters
      </span>

      <span className="relative h-40 w-px bg-gold/20">
        <span
          className="absolute left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-gold-bright to-gold/40 transition-all duration-500"
          style={{
            top: 0,
            height: `${((IDS.indexOf(active) + 1) / IDS.length) * 100}%`,
          }}
        />
      </span>

      <ul className="flex flex-col items-center gap-3.5">
        {CHAPTERS.map((c, i) => {
          const isActive = c.id === active
          return (
            <li key={c.id} className="group relative">
              <button
                type="button"
                onClick={() => scrollTo(c.id)}
                aria-label={`Go to ${c.label}`}
                aria-current={isActive ? 'true' : undefined}
                className="flex h-4 w-4 items-center justify-center"
              >
                <span
                  className={`block rotate-45 transition-all duration-500 ${
                    isActive
                      ? 'h-2 w-2 bg-gold shadow-[0_0_10px_2px_rgba(217,174,105,.5)]'
                      : 'h-1.5 w-1.5 bg-ivory/25 group-hover:bg-gold/70'
                  }`}
                />
              </button>
              <span className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap border border-gold/20 bg-obsidian/90 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.18em] text-ivory/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                {String(i + 1).padStart(2, '0')} · {c.label}
              </span>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
