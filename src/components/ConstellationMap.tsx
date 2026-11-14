import { useRef, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { SectionShell, SectionHeading } from './ui/Section'
import { Divider, PetalField } from './ui/Decorations'
import { constellations, wingPaths, bodyPaths, dustNodes } from '../data/constellations'
import celestial from '../assets/backgrounds/celestial.png'
import celestialLow from '../assets/backgrounds/celestial-low.png'

export default function ConstellationMap() {
  const [active, setActive] = useState(0)
  const [unlocked, setUnlocked] = useState(0)
  const contentRef = useRef<HTMLDivElement>(null)

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

    // draw the wings
    gsap.fromTo(
      q('[data-wing]'),
      { strokeDasharray: 620, strokeDashoffset: 620, opacity: 0 },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 2.6,
        ease: 'power2.inOut',
        stagger: 0.16,
        scrollTrigger: { trigger: q('[data-map]')[0], start: 'top 78%', once: true },
      },
    )

    // stars pop in
    gsap.from(q('[data-star]'), {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.11,
      ease: 'back.out(2.2)',
      scrollTrigger: { trigger: q('[data-map]')[0], start: 'top 72%', once: true },
    })

    // slow celestial drift
    gsap.fromTo(
      q('[data-sky]'),
      { yPercent: -4, scale: 1.05 },
      {
        yPercent: 4,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }, [])

  const select = (i: number) => {
    setActive(i)
    setUnlocked((u) => Math.max(u, i + 1))
    if (contentRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        contentRef.current.querySelectorAll('[data-c]'),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'power2.out', overwrite: true },
      )
    }
  }

  const node = constellations[active]

  return (
    <SectionShell id="constellations" className="overflow-hidden">
      <div ref={rootRef} className="relative">
        {/* celestial atmosphere */}
        <div className="pointer-events-none absolute -inset-x-10 -top-24 -bottom-28 -z-10 overflow-hidden">
          <img
            data-sky
            src={celestial}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/40 to-obsidian" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(141,38,54,.22),transparent_65%)]" />
        </div>
        <PetalField className="-z-10 opacity-60" />

        <SectionHeading
          index="05"
          eyebrow="Constellations"
          title="The Butterfly's"
          accent="Descent"
          description="Six stars chart the path of Papilio Charontis — the soul's final flight from the parlor lamp to the far shore."
          align="center"
        />

        <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-14">
          {/* ---------------- Map ---------------- */}
          <div data-map className="relative mx-auto aspect-square w-full max-w-[620px]">
            {/* halo */}
            <div className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(141,38,54,.35),transparent_70%)] blur-2xl" />

            <svg viewBox="0 0 100 100" className="relative h-full w-full overflow-visible" role="group" aria-label="Papilio Charontis constellation map">
              <defs>
                <linearGradient id="wing-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F0CE8F" stopOpacity="0.85" />
                  <stop offset="55%" stopColor="#D9AE69" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="#8D2636" stopOpacity="0.35" />
                </linearGradient>
                <filter id="star-glow" x="-120%" y="-120%" width="340%" height="340%">
                  <feGaussianBlur stdDeviation="1.1" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="dust-glow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="0.45" />
                </filter>
              </defs>

              {/* faint celestial field */}
              <g opacity="0.5">
                {dustNodes.map((d, i) => (
                  <circle
                    key={i}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    fill="#E8DCC8"
                    opacity={0.35 + (i % 3) * 0.18}
                    filter="url(#dust-glow)"
                  />
                ))}
              </g>

              {/* wings */}
              {wingPaths.map((d, i) => (
                <path
                  key={i}
                  data-wing
                  d={d}
                  fill="rgba(141,38,54,0.06)"
                  stroke="url(#wing-grad)"
                  strokeWidth="0.32"
                  strokeLinecap="round"
                />
              ))}

              {/* body & antennae */}
              {bodyPaths.map((d, i) => (
                <path
                  key={i}
                  data-wing
                  d={d}
                  fill={i === 0 ? 'rgba(217,174,105,0.12)' : 'none'}
                  stroke="#D9AE69"
                  strokeOpacity="0.45"
                  strokeWidth="0.28"
                  strokeLinecap="round"
                />
              ))}

              {/* connectors from active star */}
              {constellations.map((c, i) => (
                <line
                  key={c.id}
                  x1={c.x}
                  y1={c.y}
                  x2="50"
                  y2="50"
                  stroke="#D9AE69"
                  strokeOpacity={i === active ? 0.5 : 0}
                  strokeWidth="0.18"
                  strokeDasharray="1 1.4"
                  className="transition-[stroke-opacity] duration-700"
                />
              ))}

              {/* star nodes */}
              {constellations.map((c, i) => {
                const isActive = i === active
                return (
                  <g
                    key={c.id}
                    data-star
                    className="cursor-pointer"
                    onClick={() => select(i)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        select(i)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Constellation ${c.level}: ${c.name}`}
                    aria-pressed={isActive}
                  >
                    {/* generous hit area */}
                    <circle cx={c.x} cy={c.y} r="5.5" fill="transparent" />
                    {/* halo */}
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isActive ? 3.6 : 2.2}
                      fill="#8D2636"
                      opacity={isActive ? 0.55 : 0.18}
                      className="transition-all duration-500"
                    />
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isActive ? 1.5 : 0.95}
                      fill={isActive ? '#FFF3DA' : '#E8DCC8'}
                      filter="url(#star-glow)"
                      className="transition-all duration-500"
                    />
                    {/* unbroken ring */}
                    <circle
                      cx={c.x}
                      cy={c.y}
                      r={isActive ? 4.4 : 2.9}
                      fill="none"
                      stroke={isActive ? '#F0CE8F' : '#D9AE69'}
                      strokeOpacity={isActive ? 0.8 : 0.28}
                      strokeWidth="0.16"
                      className="transition-all duration-500"
                    />
                    <text
                      x={c.x}
                      y={c.y - 6.4}
                      textAnchor="middle"
                      className="fill-ivory font-sans"
                      fontSize="2.5"
                      opacity={isActive ? 0.95 : 0.5}
                    >
                      C{c.level}
                    </text>
                  </g>
                )
              })}
            </svg>

            {/* level nav under map */}
            <div className="absolute inset-x-0 -bottom-2 flex justify-center gap-1.5">
              {constellations.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`Show ${c.name}`}
                  aria-pressed={i === active}
                  className={`h-1.5 transition-all duration-500 ${
                    i === active
                      ? 'w-8 bg-gold'
                      : i < unlocked
                        ? 'w-3 bg-gold/40 hover:bg-gold/70'
                        : 'w-3 bg-ivory/15 hover:bg-ivory/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ---------------- Description ---------------- */}
          <div className="relative">
            <div className="flex items-center gap-3" data-reveal>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/35">
                <Sparkles className="h-4 w-4 text-gold/80" />
              </span>
              <p className="eyebrow">Constellation {node.level} of 6</p>
            </div>

            <div ref={contentRef} className="mt-5">
              <h3 data-c className="font-display text-3xl leading-tight text-ivory sm:text-4xl">
                {node.name}
              </h3>
              <div data-c className="mt-3 flex flex-wrap gap-2">
                <span className="border border-gold/30 bg-crimson/20 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.2em] text-gold/90">
                  {node.chip}
                </span>
                <span className="border border-ivory/15 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.2em] text-ivory/50">
                  Level {node.level}
                </span>
              </div>
              <p data-c className="mt-5 text-[13.5px] leading-[1.85] text-ivory/60">
                {node.description}
              </p>
            </div>

            <Divider className="my-6" />

            {/* selector list */}
            <div className="max-h-[300px] space-y-1.5 overflow-y-auto pr-1 no-scrollbar" data-reveal>
              {constellations.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => select(i)}
                  aria-pressed={i === active}
                  className={`group flex w-full items-center gap-3 border px-3.5 py-2.5 text-left transition-all duration-300 ${
                    i === active
                      ? 'border-gold/45 bg-gradient-to-r from-crimson/35 to-transparent'
                      : 'border-transparent hover:border-gold/20 hover:bg-ivory/[0.03]'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[9px] tracking-wider transition-colors ${
                      i === active
                        ? 'border-gold/70 bg-gold/15 text-gold-bright'
                        : 'border-ivory/20 text-ivory/40 group-hover:text-ivory/70'
                    }`}
                  >
                    C{c.level}
                  </span>
                  <span
                    className={`flex-1 font-serif text-[15px] transition-colors ${
                      i === active ? 'text-ivory' : 'text-ivory/60 group-hover:text-ivory/85'
                    }`}
                  >
                    {c.name}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rotate-45 transition-colors ${
                      i === active ? 'bg-gold' : 'bg-ivory/15'
                    }`}
                  />
                </button>
              ))}
            </div>

            <p className="mt-5 font-sans text-[10px] leading-relaxed text-ivory/30">
              Select a star to read its effect. Constellations unlock in order with each copy of
              Hu Tao obtained from the gacha.
            </p>
          </div>
        </div>
      </div>

      {/* bottom divider uses the low celestial plate for a soft transition */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40">
        <img src={celestialLow} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/70 to-obsidian" />
      </div>
    </SectionShell>
  )
}
