import { useRef } from 'react'
import { ChevronsDown, Sparkles } from 'lucide-react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useScrollTo, useMediaQuery, useReducedMotion } from '../hooks/useUI'
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

/* ------------------------------------------------------------------ */
/*  Chapter 01 — a scroll-scrubbed 3D "scrollytelling" sticky stage.    */
/*                                                                     */
/*  The section is a tall scroll runway (≈2.4 viewports on desktop).    */
/*  Inside it, a 100svh stage is `position: sticky`, so it stays put     */
/*  while the runway scrolls past. A single scrubbed GSAP timeline      */
/*  then drives a virtual camera through a `perspective` scene:         */
/*  layers sit at different translateZ depths, the character pushes     */
/*  toward the lens, and three copy beats fly in and out of the stage   */
/*  in Z. Nothing is pinned with JS — sticky does the pinning, so the   */
/*  layout never has to reserve a pin-spacer.                           */
/* ------------------------------------------------------------------ */

const STAGES = [
  { id: 'arrival', label: 'Arrival' },
  { id: 'director', label: 'Director' },
  { id: 'papilio', label: 'Papilio' },
] as const

const STATS = [
  ['Element', 'Pyro'],
  ['Weapon', 'Polearm'],
  ['Region', 'Liyue'],
  ['Rarity', '5★'],
] as const

/** Deterministic dust motes suspended at different depths in the scene. */
const DUST = Array.from({ length: 16 }, (_, i) => ({
  left: `${(i * 43 + 9) % 100}%`,
  top: `${(i * 61 + 13) % 100}%`,
  z: -460 + ((i * 137) % 880),
  size: 1 + (i % 3),
  opacity: Number((0.14 + (i % 5) * 0.08).toFixed(2)),
}))

function StatRow({ className = '' }: { className?: string }) {
  return (
    <dl className={`grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4 ${className}`}>
      {STATS.map(([label, value]) => (
        <div key={label} className="flex flex-col gap-1">
          <dt className="stat-label">{label}</dt>
          <dd className="font-serif text-lg leading-none text-ivory">{value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function ParallaxHero() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const reduced = useReducedMotion()
  const scrollTo = useScrollTo()
  const pointerRef = useRef<HTMLDivElement>(null)

  const rootRef = useScrollAnimation<HTMLDivElement>((root) => {
    const q = gsap.utils.selector(root)
    const still = prefersReducedMotion()
    const beat = (n: number) => q(`[data-beat="${n}"]`)
    const depth = (name: string) => q(`[data-depth="${name}"]`)

    /* Defensive: drop any inline state a reverted run (StrictMode, HMR,
       breakpoint change) may have left behind. Only elements we animate are
       touched, and none of them carry Tailwind transform utilities. */
    gsap.set(
      q(
        '[data-hero], [data-beat], [data-depth], [data-layer="bg"], [data-rig], [data-hint], [data-scrim], [data-layer="veil"], [data-rail], [data-stage-label]',
      ),
      { clearProps: 'opacity,visibility,transform' },
    )

    if (still) {
      // Reduced motion: the stage is flat, static and fully readable. Nothing
      // is hidden behind scroll position, so no content is lost.
      gsap.set(q('[data-hero]'), { opacity: 1 })
      return
    }

    /* ---------------- Entrance ---------------- */
    const intro = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        gsap.set(
          q(
            '[data-hero="bg"], [data-hero="art"], [data-hero="fade"], [data-hero="ornament"], [data-hero="corner"], [data-hero="bar"]',
          ),
          { clearProps: 'opacity,transform' },
        )
        gsap.set(q('[data-hero="title-line"] span'), { clearProps: 'opacity,transform' })
      },
    })

    intro
      .from(q('[data-hero="bg"]'), { scale: 1.16, opacity: 0, duration: 2.2, ease: 'power2.out' }, 0)
      .from(q('[data-hero="glow"]'), { opacity: 0, scale: 0.7, duration: 1.8 }, 0.2)
      .from(q('[data-hero="art"]'), { yPercent: 12, opacity: 0, duration: 1.7, ease: 'power3.out' }, 0.15)
      .from(
        q('[data-hero="title-line"] span'),
        { yPercent: 118, duration: 1.25, stagger: 0.055, ease: 'power4.out' },
        0.5,
      )
      /* Copy enters on transform only — never on opacity. On a slow device (or
         a stalled rAF) the hero must still be readable, and a scrubbed stage
         must never leave its first beat invisible. */
      .from(q('[data-hero="fade"]'), { y: 26, duration: 1.1, stagger: 0.1 }, 0.7)
      .from(q('[data-hero="ornament"]'), { scaleX: 0.4, duration: 1.2 }, 0.85)
      .from(q('[data-hero="bar"]'), { y: 18, duration: 1 }, 1)
      .from(q('[data-hero="corner"]'), { opacity: 0, duration: 1.4, stagger: 0.12 }, 1.1)

    /* ---------------- 3D depth staging ----------------
       Each layer gets a resting translateZ (and a compensating scale for the
       full-bleed layers so no edges appear while they sit far from the lens). */
    gsap.set(depth('moon'), { z: -420, scale: 1.45 })
    gsap.set(depth('roofs'), { z: -260, scale: 1.28 })
    gsap.set(depth('halo'), { z: -60 })
    gsap.set(depth('char'), { z: 0 })
    gsap.set(depth('fly'), { z: 140 })
    gsap.set(depth('fly2'), { z: 220 })
    gsap.set(depth('fore'), { z: 300 })
    gsap.set(depth('dust'), { z: -200 })

    /* ---------------- The scrubbed stage timeline ----------------
       One timeline, scrubbed by the runway. Positions are normalised 0→1 so
       the choreography is identical on every breakpoint; only the runway
       length changes. */
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
      },
    })

    tl
      /* Camera: a slow orbital drift for the whole stage. */
      .fromTo(q('[data-rig]'), { rotateY: 0, rotateX: 0 }, { rotateY: 4, rotateX: -1.6, duration: 1 }, 0)

      /* Depth pass — we push into the scene. */
      .to(depth('moon'), { z: -150, yPercent: 5, opacity: 0.6, duration: 0.9 }, 0)
      .to(depth('roofs'), { z: -40, yPercent: 8, duration: 0.9 }, 0)
      .to(depth('halo'), { z: 40, opacity: 0.85, duration: 0.5 }, 0)
      .to(depth('char'), { z: 140, rotateY: -9, xPercent: -2, duration: 0.5 }, 0)
      .to(q('[data-layer="bg"]'), { scale: 1.16, yPercent: 4, duration: 1 }, 0)
      .to(depth('fly'), { z: 300, yPercent: -3, duration: 1 }, 0)
      .to(depth('fly2'), { z: 420, duration: 1 }, 0)
      .to(depth('fore'), { z: 520, duration: 1 }, 0)

      /* Beat 01 → 02 */
      .to(q('[data-hint]'), { autoAlpha: 0, duration: 0.08 }, 0.02)
      .fromTo(beat(1), { autoAlpha: 1, z: 0 }, { autoAlpha: 0, z: 260, y: -40, duration: 0.16 }, 0.16)
      .fromTo(
        beat(2),
        { autoAlpha: 0, z: -170, y: 60 },
        { autoAlpha: 1, z: 0, y: 0, duration: 0.16 },
        0.27,
      )
      .to(depth('char'), { z: 170, rotateY: -2, xPercent: -6, yPercent: 3, duration: 0.3 }, 0.46)
      .to(depth('dust'), { z: 900, duration: 0.5 }, 0.3)

      /* Beat 02 → 03: she turns, the foreground rushes past the lens. */
      .to(beat(2), { autoAlpha: 0, z: 240, y: -40, duration: 0.14 }, 0.56)
      .fromTo(
        beat(3),
        { autoAlpha: 0, z: -220, y: 60 },
        { autoAlpha: 1, z: 0, y: 0, duration: 0.16 },
        0.66,
      )
      .to(depth('char'), { z: 210, rotateY: 12, xPercent: -9, yPercent: 4, duration: 0.28 }, 0.66)
      .to(depth('char'), { z: 250, rotateY: 16, yPercent: 8, duration: 0.18 }, 0.88)
      .to(q('[data-layer="veil"]'), { opacity: 0.7, duration: 0.35 }, 0.6)
      .to(q('[data-scrim]'), { opacity: 0.38, duration: 0.2 }, 0.86)

      /* Stage rail: each segment fills through its own beat. */
      .fromTo(q('[data-rail="1"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.2 }, 0)
      .fromTo(q('[data-rail="2"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.28 }, 0.22)
      .fromTo(q('[data-rail="3"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.28 }, 0.6)
      .fromTo(q('[data-stage-label="1"]'), { opacity: 0.35 }, { opacity: 1, duration: 0.12 }, 0)
      .fromTo(q('[data-stage-label="2"]'), { opacity: 0.35 }, { opacity: 1, duration: 0.12 }, 0.3)
      .fromTo(q('[data-stage-label="3"]'), { opacity: 0.35 }, { opacity: 1, duration: 0.12 }, 0.68)

    /* Ambient life that is not scroll-linked. */
    gsap.to(q('[data-hero="art-wrap"]'), {
      y: 12,
      duration: 4.6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })
    gsap.to(q('[data-hero="pulse"]'), {
      scale: 1.08,
      opacity: 0.85,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    ScrollTrigger.refresh()
  }, [isMobile, reduced])

  /* Pointer-driven camera parallax — layers at different depths shift by
     different amounts, which sells the 3D stage even when not scrolling. */
  const onPointerMove = (e: React.PointerEvent) => {
    if (isMobile || prefersReducedMotion() || !pointerRef.current) return
    const r = pointerRef.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    pointerRef.current.style.setProperty('--px', x.toFixed(3))
    pointerRef.current.style.setProperty('--py', y.toFixed(3))
  }

  const onPointerLeave = () => {
    if (!pointerRef.current) return
    pointerRef.current.style.setProperty('--px', '0')
    pointerRef.current.style.setProperty('--py', '0')
  }

  /* Layout switches entirely for reduced motion: no runway, no pinning. */
  const runwayClass = reduced
    ? 'h-[100svh] min-h-[560px]'
    : 'h-[270svh] min-h-[560px] md:h-[350svh]'
  const stageClass = reduced ? 'relative' : 'sticky'
  const beatClass = reduced ? 'relative' : 'col-start-1 row-start-1'

  return (
    <section
      id="home"
      ref={rootRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      aria-label="Hu Tao cinematic introduction"
      className={`relative isolate w-full ${runwayClass}`}
    >
      {/* The sticky stage: sticky pins it for the length of the runway, so no
          JS pin-spacer is needed and the layout below stays untouched. */}
      <div
        data-stage
        className={`${stageClass} top-0 z-0 h-[100svh] min-h-[560px] w-full overflow-hidden`}
      >
        {/* ============ 0 · Backdrop (screen-space, slowest) ============ */}
        <div data-layer="bg" className="pointer-events-none absolute inset-0">
          <div data-hero="bg" className="absolute inset-0">
            <img
              src={liyueNight}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-110 object-cover object-[62%_42%]"
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/20 to-obsidian" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(141,38,54,.28),transparent_60%)]" />
          </div>
        </div>

        {/* ============ 1 · The 3D scene ============ */}
        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute inset-0 [perspective:1500px] [perspective-origin:50%_45%]">
            <div
              ref={pointerRef}
              data-pointer-scene
              className="preserve-3d absolute inset-0 will-change-transform"
              style={{
                transform:
                  'translate3d(calc(var(--px, 0) * 14px), calc(var(--py, 0) * 10px), 0) rotateX(calc(var(--py, 0) * -1.4deg)) rotateY(calc(var(--px, 0) * 1.8deg))',
              }}
            >
              <div data-rig className="preserve-3d absolute inset-0 will-change-transform">
                {/* far — moon glow + horizon haze */}
                <div data-depth="moon" data-layer="far" className="absolute inset-0">
                  <div className="absolute right-[14%] top-[16%] h-40 w-40 rounded-full bg-gradient-to-b from-ivory/25 to-transparent blur-2xl sm:h-56 sm:w-56" />
                  <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent" />
                </div>

                {/* mid — distant Liyue rooftops */}
                <div
                  data-depth="roofs"
                  data-layer="mid"
                  className="absolute inset-x-0 bottom-0 h-[38%] opacity-70"
                >
                  <svg viewBox="0 0 1440 320" preserveAspectRatio="none" className="h-full w-full">
                    <defs>
                      <linearGradient id="hero-roofs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2A121B" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#120C12" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    <g fill="url(#hero-roofs)" stroke="#D9AE69" strokeOpacity="0.09">
                      <path d="M0 250h1440v70H0z" />
                      <path d="M40 250c0-40 30-60 30-60s30 20 30 60M110 250c0-52 36-78 36-78s36 26 36 78" />
                      <path d="M300 250c0-66 48-96 48-96s48 30 48 96M430 250c0-44 32-64 32-64s32 20 32 64" />
                      <path d="M900 250c0-58 42-84 42-84s42 26 42 84M1010 250c0-70 52-100 52-100s52 30 52 100" />
                      <path d="M1250 250c0-48 35-70 35-70s35 22 35 70" />
                      <path d="M180 250h-18v-70h18zM760 250h-22v-84h22zM1180 250h-20v-76h20z" />
                    </g>
                  </svg>
                </div>

                {/* subject — Hu Tao, on her own depth plane */}
                <div
                  data-depth="char"
                  data-layer="character"
                  className="absolute inset-x-0 bottom-0 flex justify-center will-change-transform md:justify-end md:pr-[5%] lg:pr-[9%]"
                >
                  <div
                    className="preserve-3d relative"
                    style={{
                      transform:
                        'translate3d(calc(var(--px, 0) * -16px), calc(var(--py, 0) * -12px), 0)',
                    }}
                  >
                    {/* halo — its own plane, behind her */}
                    <div
                      data-depth="halo"
                      className="absolute left-1/2 top-[38%] -z-10 h-[68%] w-[112%]"
                    >
                      <div data-hero="glow" className="h-full w-full">
                        <div
                          data-hero="pulse"
                          className="h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(141,38,54,.55),rgba(83,27,41,.22)_45%,transparent_70%)] blur-2xl"
                        />
                      </div>
                    </div>

                    <div data-hero="art-wrap">
                      <img
                        data-hero="art"
                        src={heroArt}
                        alt="Hu Tao, 77th Director of the Wangsheng Funeral Parlor, with a crimson butterfly"
                        className="h-[43svh] w-auto max-w-none object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,.65)] sm:h-[62svh] md:h-[64svh] lg:h-[94svh]"
                        fetchPriority="high"
                      />
                    </div>

                    {/* ghost companion */}
                    <div className="anim-ghost absolute left-[-14%] top-[6%] w-[18%] max-w-[120px] sm:left-[-10%]">
                      <GhostSpirit className="w-full drop-shadow-[0_0_24px_rgba(240,230,214,.35)]" />
                    </div>

                    {/* butterflies near her */}
                    <Butterfly className="anim-flutter absolute right-[6%] top-[18%] w-9 opacity-90 sm:w-12" />
                    <Butterfly
                      className="anim-flutter absolute left-[12%] top-[46%] w-6 opacity-80 sm:w-8"
                      style={{ animationDelay: '-5s' }}
                      variant="gold"
                    />
                  </div>
                </div>

                {/* ambient drift — butterflies + falling petals */}
                <div data-depth="fly" data-layer="fly" className="absolute inset-0">
                  <ButterflyField />
                </div>
                <div data-depth="fly2" data-layer="fly" className="absolute inset-0">
                  <PetalField />
                </div>

                {/* foreground blossoms — nearest plane */}
                <div data-depth="fore" data-layer="fore" className="absolute inset-0">
                  <PlumBlossom className="absolute -left-4 bottom-[8%] h-24 w-24 rotate-12 opacity-40 blur-[1px] sm:h-36 sm:w-36" />
                  <PlumBlossom
                    className="absolute right-[2%] top-[10%] h-16 w-16 -rotate-12 opacity-30 blur-[1px] sm:h-24 sm:w-24"
                    tone="gold"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-obsidian via-obsidian/80 to-transparent" />
                </div>

                {/* dust suspended in the volume between the layers */}
                <div data-depth="dust" className="preserve-3d absolute inset-0">
                  {DUST.map((d, i) => (
                    <span
                      key={i}
                      className="absolute rounded-full bg-gold"
                      style={{
                        left: d.left,
                        top: d.top,
                        width: d.size,
                        height: d.size,
                        opacity: d.opacity,
                        transform: `translateZ(${d.z}px)`,
                        boxShadow: '0 0 6px 1px rgba(240,206,143,.45)',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <EmberField className="z-[1]" />
        </div>

        {/* ============ 2 · Atmosphere ============ */}
        <div data-scrim className="pointer-events-none absolute inset-0 z-[12] bg-ink opacity-0" />

        {/* legibility wash — the copy column must win against a lit Liyue */}
        <div data-layer="wash" className="pointer-events-none absolute inset-0 z-[13]">
          <div className="absolute inset-y-0 left-0 hidden w-[72%] bg-gradient-to-r from-ink/95 via-ink/60 to-transparent md:block" />
          <div className="absolute inset-x-0 top-0 h-[72%] bg-gradient-to-b from-ink/90 via-ink/40 to-transparent md:hidden" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
        </div>

        <div
          data-layer="veil"
          className="pointer-events-none absolute inset-0 z-[14] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(10,8,12,.55)_100%)] opacity-40"
        />

        {/* ============ 3 · Chrome (copy beats + controls) ============ */}
        <div
          data-layer="type"
          className="relative z-20 mx-auto flex h-full w-full max-w-[1440px] flex-col px-5 pb-5 pt-24 sm:px-8 sm:pt-28 md:pb-8 md:pt-20"
        >
          {/* stage HUD — the beat rail doubles as scroll progress */}
          <div className="flex shrink-0 items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-5">
              <span className="hidden font-sans text-[8px] uppercase tracking-[0.34em] text-gold/60 md:inline">
                Chapter 01
              </span>

              {reduced ? (
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-gold/60">
                  Arrival
                </span>
              ) : (
                <ul className="flex items-center gap-2.5 sm:gap-4" aria-hidden="true">
                  {STAGES.map((stage, i) => (
                    <li key={stage.id} className="flex items-center gap-2">
                      <span className="font-sans text-[8px] uppercase tracking-[0.2em] text-ivory/45">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="relative block h-[3px] w-8 overflow-hidden bg-gold/20 sm:w-12">
                        <span
                          data-rail={String(i + 1)}
                          className="block h-full origin-left scale-x-0 bg-gradient-to-r from-gold-bright to-gold/50"
                        />
                      </span>
                      <span
                        data-stage-label={String(i + 1)}
                        className="hidden font-sans text-[8px] uppercase tracking-[0.28em] text-ivory/60 lg:inline"
                      >
                        {stage.label}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              data-hint
              className="hidden items-center gap-2 text-ivory/40 lg:flex"
              aria-hidden="true"
            >
              <span className="font-sans text-[8px] uppercase tracking-[0.3em]">
                Scroll-scrubbed · 3D stage
              </span>
              <ChevronsDown className="h-3 w-3" />
            </div>
          </div>

          {/* The copy stage. Every beat occupies the same grid cell and flies
              through Z as the timeline scrubs. autoAlpha is used for the
              transitions, so an outgoing beat is `visibility: hidden` — that
              keeps it out of the tab order and the accessibility tree, and the
              information it carries is repeated in Chapter 02. */}
          <div className="flex flex-1 items-start pt-5 md:items-center md:pt-0">
            <div className="w-full max-w-[680px] [perspective:1200px] md:max-w-[52%] lg:max-w-[680px]">
              <div className="grid [transform-style:preserve-3d]">
                {/* ---------- Beat 01 ---------- */}
                <div
                  data-beat="1"
                  className={`hero-copy will-change-transform ${beatClass}`}
                >
                  <div data-hero="fade" className="flex items-center gap-3">
                    <PlumBlossom className="h-4 w-4" />
                    <span className="eyebrow">Wangsheng Funeral Parlor · Character Archive</span>
                  </div>

                  <h1
                    data-hero="title-line"
                    className="mt-4 whitespace-nowrap font-display text-[15vw] font-semibold leading-[0.84] tracking-[0.01em] text-ivory sm:text-[6.5rem] md:text-[7.5rem] lg:text-[9.5rem] xl:text-[10.5rem]"
                  >
                    <span className="block overflow-hidden">
                      <span className="gold-text block drop-shadow-[0_10px_40px_rgba(0,0,0,.6)] [text-shadow:none]">
                        Hu Tao
                      </span>
                    </span>
                  </h1>

                  <div
                    data-hero="ornament"
                    className="mt-2 flex origin-left items-center gap-4"
                  >
                    <span className="hidden h-px w-12 bg-gold/60 sm:block" />
                    <span className="script-accent text-2xl text-gold-bright drop-shadow-[0_2px_10px_rgba(0,0,0,.7)] sm:text-3xl">
                      Papilio Charontis
                    </span>
                  </div>

                  <p
                    data-hero="fade"
                    className="mt-4 max-w-md font-serif text-xl leading-snug text-ivory/85 sm:mt-5 sm:text-2xl"
                  >
                    77th Director of Wangsheng Funeral Parlor
                  </p>

                  {reduced ? (
                    <StatRow className="mt-6 max-w-lg border-t border-gold/15 pt-5" />
                  ) : null}
                </div>

                {/* ---------- Beat 02 ---------- */}
                {!reduced ? (
                  <div
                    data-beat="2"
                    className="hero-copy col-start-1 row-start-1 opacity-0 will-change-transform"
                  >
                    <div className="flex items-center gap-3">
                      <span className="block h-1 w-1 rotate-45 bg-gold" />
                      <span className="eyebrow">02 · The 77th Director</span>
                    </div>

                    <h2 className="mt-4 max-w-[16ch] font-display text-[1.9rem] leading-[1.06] text-ivory sm:text-4xl lg:text-[2.9rem]">
                      Keeper of the <span className="script-accent gold-text [text-shadow:none]">final threshold</span>
                    </h2>

                    <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-ivory/75 sm:text-lg">
                      Cheerful, eccentric and endlessly curious, she inherited the Parlor at a
                      remarkably young age — trading solemnity for poetry, pranks and a spear that
                      burns her own vitality.
                    </p>

                    <StatRow className="mt-6 max-w-lg border-t border-gold/15 pt-5 sm:mt-7" />
                  </div>
                ) : null}

                {/* ---------- Beat 03 ---------- */}
                {!reduced ? (
                  <div
                    data-beat="3"
                    className="hero-copy col-start-1 row-start-1 opacity-0 will-change-transform"
                  >
                    <div className="flex items-center gap-3">
                      <span className="block h-1 w-1 rotate-45 bg-gold" />
                      <span className="eyebrow">03 · Papilio Charontis</span>
                    </div>

                    <blockquote className="mt-4 max-w-xl font-serif text-2xl italic leading-snug text-ivory sm:text-3xl lg:text-[2.6rem]">
                      “Every journey has its{' '}
                      <span className="gold-text not-italic [text-shadow:none]">final destination</span>.”
                    </blockquote>

                    <p className="mt-4 max-w-md font-serif text-base leading-relaxed text-ivory/75 sm:text-lg">
                      A crimson butterfly drifts between the living and the dead — and the 77th
                      Director walks that seam with a spear in one hand and a grin on her face.
                    </p>

                    <div className="mt-6 flex items-center gap-3">
                      <span className="font-sans text-[9px] uppercase tracking-[0.32em] text-gold/70">
                        Next
                      </span>
                      <span className="h-px w-8 bg-gold/40" />
                      <span className="font-serif text-base italic text-ivory/70">
                        Chapter 02 · Character Profile
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* ---------- Persistent controls ---------- */}
          <div
            data-hero="bar"
            className="relative z-10 mt-6 flex shrink-0 items-end justify-between gap-4 md:mt-0"
          >
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" onClick={() => scrollTo('profile')} className="btn btn-gold">
                <Sparkles className="h-3.5 w-3.5" />
                Explore the Archive
              </button>
              <button type="button" onClick={() => scrollTo('weapons')} className="btn btn-outline">
                View Armory
              </button>
            </div>

            <div
              data-hint
              className="hidden shrink-0 items-center gap-2 text-ivory/45 md:flex"
              aria-hidden="true"
            >
              <span className="font-sans text-[9px] uppercase tracking-[0.4em]">Scroll</span>
              <span className="relative flex h-9 w-[18px] items-start justify-center rounded-full border border-gold/30 pt-1.5">
                <span className="h-1.5 w-1.5 animate-scroll-dot rounded-full bg-gold" />
              </span>
            </div>
          </div>
        </div>

        {/* corner ornaments */}
        <div data-hero="corner" className="pointer-events-none absolute inset-5 z-30 hidden sm:block">
          <span className="absolute left-0 top-0 h-10 w-10 border-l border-t border-gold/25" />
          <span className="absolute right-0 top-0 h-10 w-10 border-r border-t border-gold/25" />
          <span className="absolute bottom-0 left-0 h-10 w-10 border-b border-l border-gold/25" />
          <span className="absolute bottom-0 right-0 h-10 w-10 border-b border-r border-gold/25" />
        </div>
      </div>
    </section>
  )
}
