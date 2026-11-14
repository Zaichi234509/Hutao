import { useEffect, useState } from 'react'
import { Menu, X, ChevronsRight } from 'lucide-react'
import { Butterfly } from './ui/Decorations'
import { useActiveSection, useScrolled, useScrollLock, useScrollTo } from '../hooks/useUI'

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'Profile' },
  { id: 'talents', label: 'Talents' },
  { id: 'weapons', label: 'Weapons' },
  { id: 'constellations', label: 'Constellations' },
  { id: 'builds', label: 'Builds' },
  { id: 'gallery', label: 'Gallery' },
] as const

const SECTION_IDS = LINKS.map((l) => l.id)

export default function Navbar() {
  const scrolled = useScrolled(60)
  const active = useActiveSection(SECTION_IDS as unknown as string[])
  const [open, setOpen] = useState(false)
  const scrollTo = useScrollTo()
  useScrollLock(open)

  // close menu on resize to desktop
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)')
    const onChange = () => mql.matches && setOpen(false)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Escape closes the menu
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    // let the overlay unmount so the scroll target isn't covered
    requestAnimationFrame(() => scrollTo(id))
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-gold/15 bg-obsidian/85 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,.9)]'
            : 'border-b border-transparent bg-gradient-to-b from-obsidian/80 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8">
          {/* Brand */}
          <button
            type="button"
            onClick={() => go('home')}
            className="group flex items-center gap-3"
            aria-label="Papilio Charontis — back to top"
          >
            <span className="relative flex h-9 w-9 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-gold/35 transition-colors duration-500 group-hover:border-gold/80" />
              <Butterfly className="h-5 w-5 transition-transform duration-700 group-hover:rotate-[8deg]" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[13px] tracking-[0.34em] text-ivory/95">WANGSHENG</span>
              <span className="mt-1 font-serif text-[10px] italic tracking-[0.14em] text-gold/70">
                Funerary Archive
              </span>
            </span>
          </button>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                aria-current={active === l.id ? 'true' : undefined}
                className={`relative px-3 py-2 font-sans text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 ${
                  active === l.id ? 'text-gold-bright' : 'text-ivory/60 hover:text-ivory'
                }`}
              >
                {l.label}
                <span
                  className={`absolute inset-x-2 -bottom-0.5 h-px origin-left bg-gradient-to-r from-gold/80 to-transparent transition-transform duration-500 ${
                    active === l.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 rounded-full border border-gold/30 px-4 py-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" />
              <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-ivory/80">Liyue</span>
              <ChevronsRight className="h-3 w-3 text-gold/70" />
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="flex h-11 w-11 items-center justify-center border border-gold/25 text-ivory/80 transition-colors hover:border-gold/60 hover:text-gold lg:hidden"
              aria-label="Open navigation menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* scroll progress */}
        <ScrollProgress />
      </header>

      {/* Mobile overlay */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-[60] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div
          className={`absolute inset-0 bg-ink/90 backdrop-blur-xl transition-opacity duration-500 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col border-l border-gold/20 bg-gradient-to-b from-[#1d1319] via-obsidian to-ink px-7 pb-10 pt-6 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="flex items-center justify-between">
            <span className="eyebrow">Navigation</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex h-11 w-11 items-center justify-center border border-gold/25 text-ivory/80"
              aria-label="Close menu"
              autoFocus
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col" aria-label="Mobile">
            {LINKS.map((l, i) => (
              <button
                key={l.id}
                type="button"
                onClick={() => go(l.id)}
                className="group flex items-center gap-4 border-b border-gold/10 py-4 text-left"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <span className="font-display text-[10px] tracking-[0.3em] text-gold/50">
                  0{i + 1}
                </span>
                <span className="font-serif text-2xl text-ivory/85 transition-colors group-hover:text-gold-bright">
                  {l.label}
                </span>
                <ChevronsRight className="ml-auto h-4 w-4 text-gold/30 transition-all group-hover:translate-x-1 group-hover:text-gold" />
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8">
            <div className="hairline mb-6" />
            <p className="font-serif text-sm italic text-ivory/45">
              &ldquo;Every journey has its final destination.&rdquo;
            </p>
            <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.28em] text-gold/50">
              Papilio Charontis · 77th Director
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div className="absolute inset-x-0 bottom-0 h-px bg-gold/10">
      <div
        className="h-full origin-left bg-gradient-to-r from-crimson via-gold to-gold-bright transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
