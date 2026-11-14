import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, MoveHorizontal, GripVertical } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useMediaQuery } from '../hooks/useUI'
import { SectionShell, SectionHeading, Stars } from './ui/Section'
import { Butterfly, PlumBlossom, EmberField, Divider } from './ui/Decorations'
import { weapons } from '../data/weapons'
import archive from '../assets/backgrounds/weapon-archive.png'

/** Depth layout constants for each ring position. */
const LAYOUT = [
  { x: 0, z: 0, rotY: 0, scale: 1, opacity: 1, blur: 0 },
  { x: 52, z: -170, rotY: -30, scale: 0.82, opacity: 0.92, blur: 0 },
  { x: 94, z: -320, rotY: -42, scale: 0.66, opacity: 0.6, blur: 0.6 },
  { x: -94, z: -320, rotY: 42, scale: 0.66, opacity: 0.6, blur: 0.6 },
  { x: -52, z: -170, rotY: 30, scale: 0.82, opacity: 0.92, blur: 0 },
] as const

const SWIPE_THRESHOLD = 46

export default function WeaponCarousel3D() {
  const total = weapons.length
  const [active, setActive] = useState(0)
  const isCompact = useMediaQuery('(max-width: 767px)')
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const stageRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({ dragging: false, startX: 0, lastX: 0, startTime: 0, moved: 0 })
  const activeRef = useRef(0)
  activeRef.current = active

  const weapon = weapons[active]

  const rootRef = useScrollAnimation<HTMLDivElement>((root) => {
    if (prefersReducedMotion()) return
    const q = gsap.utils.selector(root)
    // reveal only when motion is welcome; content stays visible otherwise
    if (!prefersReducedMotion()) {
      gsap.from(q('[data-reveal]'), {
        opacity: 0,
        y: 32,
        duration: 1,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: root, start: 'top 72%', once: true },
        clearProps: 'opacity,transform',
      })
    }
    gsap.from(q('[data-stage]'), {
      opacity: 0,
      scale: 0.94,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: q('[data-stage]')[0], start: 'top 85%', once: true },
    })
  }, [])

  /* ---------------- Carousel navigation ---------------- */
  const go = useCallback(
    (dir: number) => {
      setActive((prev) => (prev + dir + total) % total)
    },
    [total],
  )

  const select = useCallback(
    (index: number) => {
      if (index === activeRef.current) return
      setActive(index)
    },
    [],
  )

  /* Position every card each time the active index changes. */
  useEffect(() => {
    const reduced = prefersReducedMotion()
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const offset = (i - active + total) % total
      // Map offsets 0..5 to ring slots; offset 3 is directly behind (-2 equivalent).
      const slot = offset === total - 1 ? -1 : offset === total - 2 ? -2 : offset
      const layout = LAYOUT[((slot % total) + total) % total] ?? LAYOUT[0]

      const depthX = isCompact ? layout.x * 0.98 : layout.x
      const depthZ = isCompact ? layout.z * 0.62 : layout.z
      const scale = isCompact ? layout.scale * 0.78 : layout.scale

      const target = {
        xPercent: depthX,
        z: depthZ,
        rotateY: layout.rotY,
        scale,
        opacity: layout.opacity,
        filter: `blur(${reduced ? 0 : layout.blur}px) saturate(${slot === 0 ? 1 : 0.8})`,
        zIndex: 20 - Math.abs(slot) * 3,
      }

      if (reduced) {
        gsap.set(card, target)
      } else {
        gsap.to(card, {
          ...target,
          duration: 0.85,
          ease: 'power3.out',
          overwrite: 'auto',
        })
      }
      card.setAttribute('aria-hidden', slot === 0 ? 'false' : 'true')
      card.tabIndex = slot === 0 ? 0 : -1
    })
  }, [active, total, isCompact])

  /* ---------------- Pointer drag / touch swipe ---------------- */
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== undefined && e.button !== 0) return
    dragState.current = {
      dragging: true,
      startX: e.clientX,
      lastX: e.clientX,
      startTime: performance.now(),
      moved: 0,
    }
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
    stageRef.current?.classList.add('cursor-grabbing')
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const st = dragState.current
    if (!st.dragging) return
    st.moved = e.clientX - st.startX
    st.lastX = e.clientX
    // subtle live rotation feedback
    if (stageRef.current && !prefersReducedMotion()) {
      stageRef.current.style.setProperty('--drag', `${Math.max(-40, Math.min(40, st.moved * 0.08))}deg`)
    }
  }

  const endDrag = (e: React.PointerEvent) => {
    const st = dragState.current
    if (!st.dragging) return
    const dx = e.clientX - st.startX
    const dt = Math.max(1, performance.now() - st.startTime)
    const velocity = Math.abs(dx) / dt
    st.dragging = false
    st.moved = 0
    stageRef.current?.classList.remove('cursor-grabbing')
    if (stageRef.current) stageRef.current.style.setProperty('--drag', '0deg')

    if (dx <= -SWIPE_THRESHOLD || (velocity > 0.5 && dx < -20)) go(1)
    else if (dx >= SWIPE_THRESHOLD || (velocity > 0.5 && dx > 20)) go(-1)
  }

  /* ---------------- Keyboard ---------------- */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      go(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      select(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      select(total - 1)
    }
  }

  return (
    <SectionShell id="weapons" className="overflow-hidden">
      <div ref={rootRef} className="relative">
        {/* archive backdrop */}
        <div className="pointer-events-none absolute -inset-x-10 -top-20 -bottom-24 -z-10 overflow-hidden">
          <img src={archive} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/55 to-obsidian" />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="04"
            eyebrow="Weapon Archive"
            title="Armory of"
            accent="the Flame"
            description="Every polearm remembers the hands that held it. Choose your companion for the road ahead."
          />
          <div data-reveal className="hidden items-center gap-3 text-ivory/40 lg:flex">
            <MoveHorizontal className="h-4 w-4 text-gold/60" />
            <span className="font-sans text-[10px] uppercase tracking-[0.22em]">
              Drag · Swipe · Arrow keys
            </span>
          </div>
        </div>

        {/* ---------------- Stage ---------------- */}
        <div
          data-stage
          className="relative mt-8 select-none sm:mt-10"
          style={{ perspective: isCompact ? '1100px' : '1600px' }}
        >
          <div
            ref={stageRef}
            role="group"
            aria-roledescription="carousel"
            aria-label="Hu Tao polearm archive"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            onPointerLeave={(e) => dragState.current.dragging && endDrag(e)}
            className="preserve-3d relative mx-auto flex h-[330px] w-full max-w-5xl touch-pan-y items-center justify-center outline-none sm:h-[400px] lg:h-[450px] cursor-grab"
          >
            {/* pedestal glow */}
            <div className="pointer-events-none absolute bottom-8 left-1/2 h-24 w-[78%] -translate-x-1/2">
              <div className="weapon-floor anim-pulse-glow absolute inset-0 rounded-[50%]" />
              <svg viewBox="0 0 600 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <ellipse cx="300" cy="60" rx="220" ry="34" fill="none" stroke="#D9AE69" strokeOpacity="0.22" />
                <ellipse cx="300" cy="60" rx="160" ry="22" fill="none" stroke="#D9AE69" strokeOpacity="0.12" />
              </svg>
            </div>

            {/* rotating sigil behind stage */}
            <svg
              viewBox="0 0 400 400"
              className="anim-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 opacity-[0.09] sm:h-[420px] sm:w-[420px]"
              aria-hidden="true"
            >
              <circle cx="200" cy="200" r="150" fill="none" stroke="#D9AE69" strokeWidth="0.6" strokeDasharray="4 10" />
              <circle cx="200" cy="200" r="118" fill="none" stroke="#D9AE69" strokeWidth="0.4" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2={200 + 150 * Math.cos((i * Math.PI) / 6)}
                  y2={200 + 150 * Math.sin((i * Math.PI) / 6)}
                  stroke="#D9AE69"
                  strokeWidth="0.3"
                />
              ))}
            </svg>

            {weapons.map((w, i) => (
              <button
                key={w.id}
                ref={(el) => {
                  cardRefs.current[i] = el
                }}
                type="button"
                onClick={() => select(i)}
                onDragStart={(e) => e.preventDefault()}
                aria-label={`View ${w.name}`}
                aria-current={i === active ? 'true' : undefined}
                className="preserve-3d backface-hidden absolute left-1/2 top-1/2 h-[270px] w-[158px] -translate-x-1/2 -translate-y-1/2 will-change-transform sm:h-[330px] sm:w-[192px] lg:h-[380px] lg:w-[222px]"
              >
                <WeaponCard weapon={w} isActive={i === active} />
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="mt-2 flex items-center justify-center gap-4 sm:mt-0">
            <button
              type="button"
              onClick={() => go(-1)}
              className="group flex h-12 w-12 items-center justify-center border border-gold/30 bg-obsidian/60 text-ivory/70 backdrop-blur-sm transition-all hover:border-gold/70 hover:bg-crimson/30 hover:text-gold-bright sm:h-14 sm:w-14"
              aria-label="Previous weapon"
            >
              <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
            </button>

            {/* dots */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Weapon selection">
              {weapons.map((w, i) => (
                <button
                  key={w.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={w.name}
                  onClick={() => select(i)}
                  className="group flex h-6 w-6 items-center justify-center"
                >
                  <span
                    className={`block transition-all duration-500 ${
                      i === active
                        ? 'h-1.5 w-6 rotate-0 bg-gold'
                        : 'h-1.5 w-1.5 rotate-45 bg-ivory/25 group-hover:bg-gold/60'
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => go(1)}
              className="group flex h-12 w-12 items-center justify-center border border-gold/30 bg-obsidian/60 text-ivory/70 backdrop-blur-sm transition-all hover:border-gold/70 hover:bg-crimson/30 hover:text-gold-bright sm:h-14 sm:w-14"
              aria-label="Next weapon"
            >
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          <p className="mt-4 flex items-center justify-center gap-2 font-sans text-[9px] uppercase tracking-[0.28em] text-ivory/30 sm:hidden">
            <GripVertical className="h-3 w-3" /> Swipe to browse
          </p>
        </div>

        {/* ---------------- Details panel ---------------- */}
        <div
          className="panel corners relative mt-10 grid gap-0 overflow-hidden md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:mt-14"
          aria-live="polite"
        >
          <span className="corner-b pointer-events-none absolute inset-0" aria-hidden="true" />

          {/* Left: name + preview */}
          <div className="relative flex flex-col justify-between overflow-hidden border-b border-gold/10 p-6 sm:p-8 md:border-b-0 md:border-r">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(141,38,54,.35),transparent_65%)]" />
            <EmberField className="opacity-40" />

            <div className="relative">
              <div className="flex items-center justify-between gap-4">
                <p className="eyebrow">Selected Polearm</p>
                <span className="font-display text-[10px] tracking-[0.3em] text-gold/40">
                  {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
              </div>
              <h3 key={weapon.id} className="mt-3 font-display text-3xl leading-tight text-ivory sm:text-4xl">
                {weapon.name}
              </h3>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <Stars count={weapon.rarity} size={15} />
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rotate-45 bg-gold/60" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ivory/55">
                    {weapon.type}
                  </span>
                </span>
              </div>
            </div>

            <div className="relative mt-6 flex items-end justify-between gap-4">
              <img
                key={weapon.image}
                src={weapon.image}
                alt={weapon.name}
                className="h-24 w-auto max-w-[62%] object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,.6)] sm:h-28"
                loading="lazy"
              />
              <div className="text-right">
                <p className="stat-label">Base ATK</p>
                <p className="font-display text-3xl text-gold-bright sm:text-4xl">{weapon.baseAtk}</p>
                <p className="mt-1 font-sans text-[9px] uppercase tracking-[0.18em] text-ivory/40">Lv. 90</p>
              </div>
            </div>
          </div>

          {/* Right: stats + passive */}
          <div className="relative p-6 sm:p-8">
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gold/15 bg-ivory/[0.02] px-4 py-3">
                <p className="stat-label">Secondary Stat</p>
                <p className="mt-1 font-serif text-lg text-ivory/90">{weapon.subStat.name}</p>
              </div>
              <div className="border border-gold/15 bg-ivory/[0.02] px-4 py-3">
                <p className="stat-label">Value</p>
                <p className="mt-1 font-serif text-lg text-gold-bright">{weapon.subStat.value}</p>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center gap-2">
                <Butterfly className="h-4 w-4 shrink-0" />
                <p className="font-serif text-lg text-ivory/95">{weapon.passiveName}</p>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ivory/60">{weapon.passive}</p>
            </div>

            <Divider className="my-5" icon={false} />

            <div className="flex items-start gap-3">
              <PlumBlossom className="mt-0.5 h-4 w-4 shrink-0 opacity-70" />
              <p className="text-[12px] italic leading-relaxed text-ivory/45">{weapon.lore}</p>
            </div>

            <div className="mt-5 flex items-start gap-2 border-l-2 border-crimson/60 pl-3">
              <p className="text-[11.5px] leading-relaxed text-gold/70">{weapon.bestFor}</p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}

/* ------------------------------------------------------------------ */
/*  Individual 3D weapon card                                          */
/* ------------------------------------------------------------------ */
function WeaponCard({ weapon, isActive }: { weapon: (typeof weapons)[number]; isActive: boolean }) {
  const glow = {
    gold: 'rgba(217,174,105,.5)',
    jade: 'rgba(120,190,160,.42)',
    ember: 'rgba(226,104,63,.45)',
    steel: 'rgba(180,180,200,.35)',
    frost: 'rgba(150,200,230,.38)',
    obsidian: 'rgba(160,60,80,.45)',
  }[weapon.accent]

  return (
    <span
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[3px] border bg-gradient-to-b from-[#2a1a22]/95 via-[#1b1219] to-[#120c12] transition-[border-color,box-shadow] duration-500 ${
        isActive ? 'border-gold/70' : 'border-gold/20'
      }`}
      style={{
        boxShadow: isActive
          ? `0 0 0 1px rgba(240,206,143,.35), 0 0 60px -8px ${glow}, inset 0 0 40px rgba(0,0,0,.6)`
          : '0 24px 50px -24px rgba(0,0,0,.9), inset 0 0 30px rgba(0,0,0,.6)',
      }}
    >
      {/* rarity gradient wash */}
      <span
        className={`pointer-events-none absolute inset-0 ${
          weapon.rarity === 5
            ? 'bg-[radial-gradient(circle_at_50%_35%,rgba(217,174,105,.22),transparent_62%)]'
            : 'bg-[radial-gradient(circle_at_50%_35%,rgba(164,110,220,.16),transparent_62%)]'
        }`}
      />
      <span className="card-sheen pointer-events-none absolute inset-0" />

      {/* top frame ornament */}
      <span className="pointer-events-none absolute inset-x-3 top-3 flex items-center gap-1.5">
        <span className="h-px flex-1 bg-gold/25" />
        <span className="h-1 w-1 rotate-45 bg-gold/50" />
        <span className="h-px flex-1 bg-gold/25" />
      </span>

      {/* weapon art */}
      <span className="relative flex flex-1 items-center justify-center px-3 pt-6">
        <img
          src={weapon.image}
          alt=""
          aria-hidden="true"
          className="max-h-[130px] w-auto max-w-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,.8)] sm:max-h-[170px] lg:max-h-[200px]"
          draggable={false}
          loading="lazy"
        />
        {isActive && (
          <span
            className="pointer-events-none absolute inset-x-4 bottom-0 h-10 blur-xl"
            style={{ background: `radial-gradient(ellipse, ${glow}, transparent 70%)` }}
          />
        )}
      </span>

      {/* caption */}
      <span className="relative w-full px-3 pb-3 pt-2 text-center">
        <span className="mx-auto mb-1.5 block h-px w-8 bg-gold/30" />
        <span className="line-clamp-2 block font-serif text-[11px] leading-tight text-ivory/85 sm:text-[13px]">
          {weapon.name}
        </span>
        <span className="mt-1.5 flex items-center justify-center gap-[3px]">
          {Array.from({ length: weapon.rarity }).map((_, i) => (
            <svg key={i} width="7" height="7" viewBox="0 0 24 24" className="rarity-star" aria-hidden="true">
              <path
                d="M12 2.6l2.75 6.2 6.75.62-5.1 4.5 1.5 6.62L12 17.1l-5.9 3.44 1.5-6.62-5.1-4.5 6.75-.62L12 2.6z"
                fill="currentColor"
              />
            </svg>
          ))}
        </span>
      </span>
    </span>
  )
}
