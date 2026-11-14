import { useRef } from 'react'
import { ArrowUp, Github, Heart, ExternalLink } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useScrollTo } from '../hooks/useUI'
import { Butterfly, PlumBlossom, ButterflyField, PetalField, Divider } from './ui/Decorations'
import heroArt from '../assets/characters/hutao-hero.png'
import parlor from '../assets/backgrounds/parlor.png'

export function CinematicEnding() {
  const artRef = useRef<HTMLDivElement>(null)

  const rootRef = useScrollAnimation<HTMLDivElement>((root) => {
    if (prefersReducedMotion()) return
    const q = gsap.utils.selector(root)

    // slow cinematic zoom on the artwork as the section passes
    gsap.fromTo(
      q('[data-end-art]'),
      { scale: 1.02, yPercent: 2 },
      {
        scale: 1.16,
        yPercent: -2,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: true },
      },
    )
    gsap.from(q('[data-end-line]'), {
      opacity: 0,
      y: 24,
      duration: 1.2,
      stagger: 0.14,
      ease: 'power3.out',
      scrollTrigger: { trigger: root, start: 'top 45%', once: true },
    })
    gsap.from(q('[data-end-text]'), {
      opacity: 0,
      y: 30,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: q('[data-end-text]')[0], start: 'top 85%', once: true },
    })

    // parallax butterflies rise slightly faster
    gsap.to(q('[data-end-fly]'), {
      yPercent: -18,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
  }, [])

  return (
    <section
      id="ending"
      ref={rootRef}
      aria-label="Closing scene"
      className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 py-28 text-center"
    >
      {/* backdrop */}
      <div className="absolute inset-0 -z-30">
        <img src={parlor} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/55 to-[#0b080d]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(141,38,54,.3),transparent_62%)]" />
      </div>

      {/* the figure, centered and vast */}
      <div ref={artRef} className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <img
          data-end-art
          src={heroArt}
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-[52%] h-[112vh] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.22] blur-[0.4px] sm:opacity-25"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(11,8,13,.92)_78%)]" />
      </div>

      <div data-end-fly className="pointer-events-none absolute inset-0 -z-10">
        <ButterflyField density="normal" />
        <PetalField />
      </div>

      <div className="relative z-10 max-w-3xl">
        <div data-end-line className="flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gold/40" />
          <Butterfly className="h-9 w-9 sm:h-11 sm:w-11" />
          <span className="h-px w-10 bg-gold/40" />
        </div>

        <p data-end-line className="mt-8 font-sans text-[9.5px] uppercase tracking-widest3 text-gold/70 sm:text-[10.5px]">
          Papilio Charontis
        </p>

        <h2
          data-end-text
          className="mt-6 font-serif text-3xl font-light italic leading-[1.3] text-ivory/90 sm:text-5xl lg:text-[3.4rem]"
        >
          &ldquo;Every journey has
          <br className="hidden sm:block" /> its final destination.&rdquo;
        </h2>

        <p data-end-line className="mx-auto mt-7 max-w-lg text-[13px] leading-[1.9] text-ivory/45 sm:text-sm">
          The parlor lamps are lit, the tea is still warm, and somewhere beyond the harbor a crimson
          butterfly is already on its way home.
        </p>

        <div data-end-line className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a href="#home" className="btn btn-gold">
            Return to the Beginning
          </a>
          <a href="#gallery" className="btn btn-outline">
            Revisit the Gallery
          </a>
        </div>

        <p data-end-line className="mt-12 font-sans text-[9px] uppercase tracking-[0.34em] text-ivory/25">
          Wangsheng Funeral Parlor · Liyue Harbor
        </p>
      </div>
    </section>
  )
}

export default function Footer() {
  const scrollTo = useScrollTo()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-gold/15 bg-[#0c0910] px-5 pb-10 pt-14 sm:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(83,27,41,.45),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-[1440px]">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gold/35">
                <Butterfly className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm tracking-[0.3em] text-ivory/90">WANGSHENG</p>
                <p className="font-serif text-[11px] italic text-gold/60">Funerary Archive</p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-[12.5px] leading-relaxed text-ivory/40">
              A fan-made character showcase celebrating Hu Tao, the 77th Director of Wangsheng
              Funeral Parlor.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <PlumBlossom className="h-4 w-4 opacity-70" />
              <span className="font-sans text-[9px] uppercase tracking-[0.24em] text-gold/50">
                Papilio Charontis
              </span>
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow">Archive</p>
            <ul className="mt-4 space-y-2.5">
              {[
                ['home', 'Home'],
                ['profile', 'Profile'],
                ['talents', 'Talents'],
                ['weapons', 'Weapon Archive'],
                ['constellations', 'Constellations'],
              ].map(([id, label]) => (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    className="group flex items-center gap-2 text-[12px] text-ivory/45 transition-colors hover:text-gold/90"
                  >
                    <span className="h-px w-0 bg-gold/60 transition-all duration-300 group-hover:w-3" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://genshin.hoyoverse.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 text-[12px] text-ivory/45 transition-colors hover:text-gold/90"
                >
                  Genshin Impact
                  <ExternalLink className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Zaichi234509/Hutao"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 text-[12px] text-ivory/45 transition-colors hover:text-gold/90"
                >
                  <Github className="h-3.5 w-3.5" />
                  Source Repository
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => scrollTo('home')}
                  className="group inline-flex items-center gap-2 text-[12px] text-ivory/45 transition-colors hover:text-gold/90"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                  Back to Top
                </button>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="my-8" icon={false} />

        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="font-sans text-[10px] leading-relaxed tracking-[0.08em] text-ivory/30">
            © {year} Papilio Charontis · Fan project. Genshin Impact and Hu Tao are trademarks of
            HoYoverse. Not affiliated with or endorsed by HoYoverse.
          </p>
          <p className="flex items-center gap-1.5 font-sans text-[10px] tracking-[0.1em] text-ivory/30">
            Crafted with <Heart className="h-3 w-3 text-crimson" /> for the Parlor
          </p>
        </div>
      </div>
    </footer>
  )
}
