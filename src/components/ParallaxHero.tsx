import { useRef } from 'react'
import { ChevronsDown, Sparkles } from 'lucide-react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useScrollTo, useMediaQuery } from '../hooks/useUI'
import {
  Butterfly,
  ButterflyField,
  GhostSpirit,
  PetalField,
  EmberField,
  PlumBlossom,
} from './ui/Decorations'
import heroArt from '../assets/characters/hutao-hero.png'
import liyueNight from '../assets/backgrounds/liyue-night.png'

export default function ParallaxHero() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const scrollTo = useScrollTo()
  const sceneRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)

  const rootRef = useScrollAnimation<HTMLDivElement>((root) => {
    const q = gsap.utils.selector(root)
    const reduced = prefersReducedMotion()

    // Defensive: clear any inline state a previous (reverted) run may have left.
    gsap.set(q('[data-hero]'), { clearProps: 'opacity,transform,scale' })

    /* ---------- Entrance ----------
       Content must never be left hidden: if anything interrupts the timeline
       (a reverted context, a background tab, StrictMode double-mount) we force
       the end state. The `.from()` tweens are therefore paired with an
       `onComplete` that clears the inline styles they set.            */
    const intro = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set(q('[data-hero="bg"], [data-hero="glow"], [data-hero="art"], [data-hero="fade"], [data-hero="ornament"], [data-hero="corner"]'), {
          clearProps: 'opacity,transform,scale',
        })
        gsap.set(q('[data-hero="title-line"] span'), { clearProps: 'opacity,transform' })
      },
    })
    if (reduced) {
      gsap.set(q('[data-hero]'), { opacity: 1, y: 0 })
    } else {
      intro
        .from(q('[data-hero="bg"]'), { scale: 1.16, opacity: 0, duration: 2.2, ease: 'power2.out' }, 0)
        .from(q('[data-hero="glow"]'), { opacity: 0, scale: 0.7, duration: 1.8 }, 0.2)
        .from(q('[data-hero="art"]'), { yPercent: 12, opacity: 0, duration: 1.7, ease: 'power3.out' }, 0.15)
        .from(
          q('[data-hero="title-line"] span'),
          { yPercent: 118, duration: 1.25, stagger: 0.055, ease: 'power4.out' },
          0.5,
        )
        .from(q('[data-hero="fade"]'), { opacity: 0, y: 26, duration: 1.1, stagger: 0.1 }, 0.85)
        .from(q('[data-hero="ornament"]'), { opacity: 0, scaleX: 0.4, duration: 1.2 }, 0.95)
        .from(q('[data-hero="corner"]'), { opacity: 0, duration: 1.4, stagger: 0.12 }, 1.1)
    }

    if (reduced) return

    /* ---------- Scroll parallax layers ---------- */
    const scrub = { trigger: root, start: 'top top', end: 'bottom top', scrub: true }

    // background: slowest
    gsap.to(q('[data-layer="bg"]'), { yPercent: 12, scale: 1.06, ease: 'none', scrollTrigger: scrub })
    // moon / far scenery: slower than character
    gsap.to(q('[data-layer="far"]'), { yPercent: 22, ease: 'none', scrollTrigger: scrub })
    // environment mid layer
    gsap.to(q('[data-layer="mid"]'), { yPercent: 34, ease: 'none', scrollTrigger: scrub })
    // character: foreground speed with a slight tilt
    gsap.to(q('[data-layer="character"]'), {
      yPercent: -6,
      scale: 1.02,
      ease: 'none',
      scrollTrigger: { ...scrub, trigger: root, start: 'top top', end: '60% top' },
    })
    // typography fades + drifts up faster
    gsap.to(q('[data-layer="type"]'), {
      yPercent: -48,
      opacity: 0,
      ease: 'none',
      scrollTrigger: { trigger: root, start: '18% top', end: '75% top', scrub: true },
    })
    // floating decorations move independently
    gsap.to(q('[data-layer="fly"]'), {
      yPercent: -70,
      xPercent: 6,
      ease: 'none',
      scrollTrigger: scrub,
    })
    // foreground blossoms: fastest
    gsap.to(q('[data-layer="fore"]'), {
      yPercent: -16,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: scrub,
    })
    // vignette darkens as we leave
    gsap.to(q('[data-layer="veil"]'), {
      opacity: 0.85,
      ease: 'none',
      scrollTrigger: { trigger: root, start: '40% top', end: 'bottom top', scrub: true },
    })

    /* ---------- Scroll cue ---------- */
    if (scrollHintRef.current) {
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: root, start: '6% top', end: '22% top', scrub: true },
      })
    }

    /* ---------- Breathing character sway ---------- */
    gsap.to(q('[data-hero="art-wrap"]'), {
      y: 12,
      duration: 4.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    /* ---------- Ambient ember glow pulse ---------- */
    gsap.to(q('[data-hero="glow"]'), {
      scale: 1.08,
      opacity: 0.85,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    ScrollTrigger.refresh()
  }, [isMobile])

  /* Pointer-driven depth on the scene layers */
  const onPointerMove = (e: React.PointerEvent) => {
    if (isMobile || prefersReducedMotion() || !sceneRef.current) return
    const r = sceneRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    sceneRef.current.style.setProperty('--mx', x.toFixed(3))
    sceneRef.current.style.setProperty('--my', y.toFixed(3))
  }

  return (
    <section
      id="home"
      ref={rootRef}
      onPointerMove={onPointerMove}
      className="relative isolate h-[100svh] min-h-[560px] w-full overflow-hidden"
      aria-label="Hu Tao cinematic introduction"
    >
      {/* ============ Background layers ============ */}
      <div data-layer="bg" data-hero="bg" className="absolute inset-0 -z-30">
        <img
          src={liyueNight}
          alt=""
          aria-hidden="true"
          className="h-full w-full scale-105 object-cover object-[60%_40%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/20 to-obsidian" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(141,38,54,.28),transparent_60%)]" />
      </div>

      {/* far layer: moon glow + horizon haze */}
      <div data-layer="far" className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute right-[14%] top-[16%] h-40 w-40 rounded-full bg-gradient-to-b from-ivory/25 to-transparent blur-2xl sm:h-56 sm:w-56" />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent" />
      </div>

      {/* mid layer: faint distant architecture lines */}
      <div data-layer="mid" className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-[38%] opacity-70">
        <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
          <defs>
            <linearGradient id="roofs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2A121B" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#120C12" stopOpacity="1" />
            </linearGradient>
          </defs>
          <g fill="url(#roofs)" stroke="#D9AE69" strokeOpacity="0.09">
            <path d="M0 250h1440v70H0z" />
            <path d="M40 250c0-40 30-60 30-60s30 20 30 60M110 250c0-52 36-78 36-78s36 26 36 78" />
            <path d="M300 250c0-66 48-96 48-96s48 30 48 96M430 250c0-44 32-64 32-64s32 20 32 64" />
            <path d="M900 250c0-58 42-84 42-84s42 26 42 84M1010 250c0-70 52-100 52-100s52 30 52 100" />
            <path d="M1250 250c0-48 35-70 35-70s35 22 35 70" />
            <path d="M180 250h-18v-70h18zM760 250h-22v-84h22zM1180 250h-20v-76h20z" />
          </g>
        </svg>
      </div>

      {/* ============ Character ============ */}
      <div
        data-layer="character"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center md:justify-end md:pr-[6%] lg:pr-[9%]"
        style={{
          transform: 'translate3d(calc(var(--mx,0) * -10px), calc(var(--my,0) * -8px), 0)',
        }}
      >
        <div ref={sceneRef} className="relative">
          {/* halo behind character */}
          <div
            data-hero="glow"
            className="absolute left-1/2 top-[38%] -z-10 h-[68%] w-[112%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(141,38,54,.55),rgba(83,27,41,.22)_45%,transparent_70%)] blur-2xl"
          />
          <div data-hero="art-wrap">
            <img
              data-hero="art"
              src={heroArt}
              alt="Hu Tao, 77th Director of the Wangsheng Funeral Parlor, with a crimson butterfly"
              className="h-[43svh] w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,.65)] sm:h-[62svh] md:h-[86svh] lg:h-[94svh]"
              fetchPriority="high"
            />
          </div>
          {/* ghost companion */}
          <div className="anim-ghost absolute left-[-14%] top-[6%] w-[18%] max-w-[120px] sm:left-[-10%]">
            <GhostSpirit className="w-full drop-shadow-[0_0_24px_rgba(240,230,214,.35)]" />
          </div>
          {/* a few butterflies near her */}
          <Butterfly className="anim-flutter absolute right-[6%] top-[18%] w-9 opacity-90 sm:w-12" />
          <Butterfly
            className="anim-flutter absolute left-[12%] top-[46%] w-6 opacity-80 sm:w-8"
            style={{ animationDelay: '-5s' }}
            variant="gold"
          />
        </div>
      </div>

      {/* localised scrim so copy stays legible over the vignette */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[18] w-full bg-gradient-to-r from-obsidian/85 via-obsidian/45 to-transparent md:w-[62%]" />

      {/* ============ Typography ============ */}
      <div className="relative z-20 mx-auto flex h-full w-full max-w-[1440px] flex-col justify-start px-5 pb-[46svh] pt-24 sm:px-8 md:justify-center md:pb-0 md:pt-20">
        <div
          data-layer="type"
          className="max-w-[620px] md:max-w-[600px] lg:max-w-[700px] md:-mt-16 lg:-mt-24"
        >
          <div data-hero="fade" className="flex items-center gap-3">
            <PlumBlossom className="h-4 w-4" />
            <span className="eyebrow">Wangsheng Funeral Parlor · Character Archive</span>
          </div>

          <h1
            data-hero="title-line"
            className="mt-4 whitespace-nowrap font-display text-[15vw] font-semibold leading-[0.84] tracking-[0.01em] text-ivory sm:text-[6.5rem] md:text-[7.5rem] lg:text-[9.5rem] xl:text-[11rem]"
          >
            <span className="block overflow-hidden">
              <span className="gold-text block drop-shadow-[0_10px_40px_rgba(0,0,0,.6)]">Hu Tao</span>
            </span>
          </h1>

          <div data-hero="ornament" className="mt-2 flex origin-left items-center gap-4">
            <span className="hidden h-px w-12 bg-gold/60 sm:block" />
            <span className="script-accent text-2xl text-gold-bright drop-shadow-[0_2px_10px_rgba(0,0,0,.7)] sm:text-3xl">Papilio Charontis</span>
          </div>

          <div data-hero="fade" className="mt-5 max-w-md space-y-2.5 sm:mt-7 sm:space-y-3">
            <p className="font-serif text-xl leading-snug text-ivory/85 sm:text-2xl">
              77th Director of Wangsheng Funeral Parlor
            </p>
            <p className="hidden text-[13px] leading-relaxed text-ivory/55 xs:block sm:text-sm">
              A mischievous poet of the threshold between this world and the next — as quick with a
              grin as she is with a spear, and never far from a crimson butterfly.
            </p>
          </div>

          <div data-hero="fade" className="mt-6 flex flex-wrap items-center gap-3 sm:mt-9 sm:gap-4">
            <button type="button" onClick={() => scrollTo('profile')} className="btn btn-gold">
              <Sparkles className="h-3.5 w-3.5" />
              Explore the Archive
            </button>
            <button type="button" onClick={() => scrollTo('weapons')} className="btn btn-outline">
              View Armory
            </button>
          </div>

          <div data-hero="fade" className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2.5 sm:mt-9 sm:gap-x-8 sm:gap-y-3 sm:border-t sm:border-gold/15 sm:pt-5">
            {[
              ['Element', 'Pyro'],
              ['Weapon', 'Polearm'],
              ['Region', 'Liyue'],
              ['Rarity', '5★'],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="font-sans text-[10px] uppercase tracking-[0.24em] text-gold/70">{k}</span>
                <span className="font-serif text-lg text-ivory">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============ Floating decor ============ */}
      <div data-layer="fly" className="absolute inset-0 z-[15]">
        <ButterflyField />
      </div>
      <div data-layer="fly" className="pointer-events-none absolute inset-0 z-[16]">
        <PetalField />
      </div>
      <EmberField className="z-[17]" />

      {/* foreground blossoms, fastest layer */}
      <div data-layer="fore" className="pointer-events-none absolute inset-0 z-30">
        <PlumBlossom className="absolute -left-4 bottom-[8%] h-24 w-24 rotate-12 opacity-40 blur-[1px] sm:h-36 sm:w-36" />
        <PlumBlossom
          className="absolute right-[2%] top-[10%] h-16 w-16 -rotate-12 opacity-30 blur-[1px] sm:h-24 sm:w-24"
          tone="gold"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent" />
      </div>

      {/* vignette veil */}
      <div
        data-layer="veil"
        className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,8,12,.55)_100%)] opacity-40"
      />

      {/* corner ornaments */}
      <div data-hero="corner" className="pointer-events-none absolute inset-5 z-40 hidden sm:block">
        <span className="absolute left-0 top-0 h-10 w-10 border-l border-t border-gold/25" />
        <span className="absolute right-0 top-0 h-10 w-10 border-r border-t border-gold/25" />
        <span className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-gold/25" />
        <span className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-gold/25" />
      </div>

      {/* scroll cue */}
      <div
        ref={scrollHintRef}
        className="absolute inset-x-0 bottom-6 z-40 flex flex-col items-center gap-2 sm:bottom-8"
      >
        <span className="font-sans text-[9px] uppercase tracking-[0.4em] text-ivory/45">Scroll</span>
        <span className="relative flex h-12 w-[22px] items-start justify-center rounded-full border border-gold/30 pt-1.5">
          <span className="h-1.5 w-1.5 animate-scroll-dot rounded-full bg-gold" />
        </span>
        <ChevronsDown className="h-3 w-3 text-gold/50" />
      </div>
    </section>
  )
}
