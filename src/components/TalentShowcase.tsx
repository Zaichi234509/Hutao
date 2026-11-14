import { useRef, useState } from 'react'
import { ChevronRight, Info, Zap } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { SectionShell, SectionHeading } from './ui/Section'
import { Butterfly, PlumBlossom, Divider, EmberField } from './ui/Decorations'
import { talents, passives } from '../data/talents'

export default function TalentShowcase() {
  const [activeId, setActiveId] = useState<(typeof talents)[number]['id']>('skill')
  const [levelIdx, setLevelIdx] = useState(2)
  const panelRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const active = talents.find((t) => t.id === activeId) ?? talents[0]

  const rootRef = useScrollAnimation<HTMLDivElement>((root) => {
    if (prefersReducedMotion()) return
    const q = gsap.utils.selector(root)
    gsap.from(q('[data-reveal]'), {
      opacity: 0,
      y: 32,
      duration: 1,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: { trigger: root, start: 'top 72%', once: true },
      clearProps: 'opacity,transform',
    })
    gsap.from(q('[data-tabbar]'), {
      opacity: 0,
      y: 24,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: { trigger: q('[data-tabbar]')[0], start: 'top 90%', once: true },
    })
  }, [])

  /** Animate the content panel whenever the selection changes. */
  const animatePanel = () => {
    if (!panelRef.current || prefersReducedMotion()) return
    const q = gsap.utils.selector(panelRef.current)
    gsap.fromTo(
      q('[data-anim]'),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: 'power3.out', overwrite: true },
    )
    gsap.fromTo(
      panelRef.current.querySelector('[data-art]'),
      { opacity: 0, scale: 1.05, filter: 'blur(6px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.9, ease: 'power2.out', overwrite: true },
    )
  }

  const select = (id: (typeof talents)[number]['id']) => {
    if (id === activeId) return
    setActiveId(id)
    requestAnimationFrame(animatePanel)
  }

  /** Roving arrow-key navigation across tabs (WAI-ARIA tabs pattern). */
  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % talents.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + talents.length) % talents.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = talents.length - 1
    else return
    e.preventDefault()
    tabRefs.current[next]?.focus()
    select(talents[next].id)
  }

  return (
    <SectionShell id="talents" className="overflow-hidden">
      <div ref={rootRef}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="03"
            eyebrow="Combat Talents"
            title="The Dance of"
            accent="Flame & Farewell"
            description="Three movements of the Wangsheng spear art — a rhythm of strikes, sacrifice and rebirth."
          />
          <div data-reveal className="hidden shrink-0 items-center gap-3 lg:flex">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30">
              <Zap className="h-4 w-4 text-gold/80" />
            </span>
            <p className="max-w-[200px] font-sans text-[11px] leading-relaxed text-ivory/45">
              Talents shown at Lv.&nbsp;1 / 6 / 10. Select a level to compare multipliers.
            </p>
          </div>
        </div>

        {/* ---------------- Tabs ---------------- */}
        <div data-tabbar className="mt-10 sm:mt-14">
          <div
            role="tablist"
            aria-label="Hu Tao combat talents"
            className="grid grid-cols-1 gap-2 border border-gold/15 bg-obsidian/50 p-1.5 backdrop-blur-sm sm:grid-cols-3"
          >
            {talents.map((t, i) => {
              const Icon = t.icon
              const selected = t.id === activeId
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(t.id)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className="tab-pill group"
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.6} />
                  <span className="flex flex-col items-start leading-none">
                    <span className="text-[9px] tracking-[0.22em] text-current opacity-55">{t.tier}</span>
                    <span className="mt-1.5 font-serif text-[13px] normal-case tracking-normal text-current sm:text-sm">
                      {t.name}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ---------------- Panel ---------------- */}
        <div
          ref={panelRef}
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
          className="relative mt-5"
        >
          <div className="panel corners grid overflow-hidden lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
            <span className="corner-b pointer-events-none absolute inset-0" aria-hidden="true" />

            {/* Art */}
            <div className="relative min-h-[320px] overflow-hidden sm:min-h-[420px] lg:min-h-[600px]">
              {/* absolutely positioned so the art always fills the grid cell,
                  regardless of its intrinsic aspect ratio */}
              <img
                key={active.art}
                data-art
                src={active.art}
                alt={`${active.name} — combat showcase art`}
                className="absolute inset-0 h-full w-full object-cover object-[50%_35%]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-obsidian/95" />
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 p-5 sm:p-7 lg:hidden">
                <span className="h-px flex-1 bg-gold/30" />
                <Butterfly className="h-6 w-6" />
                <span className="h-px flex-1 bg-gold/30" />
              </div>

              {/* element badge */}
              <div className="absolute left-5 top-5 flex items-center gap-2 border border-gold/30 bg-obsidian/60 px-3 py-1.5 backdrop-blur-md">
                <span
                  className={`h-1.5 w-1.5 rotate-45 ${
                    active.element === 'Pyro' ? 'bg-[#E2683F]' : 'bg-ivory/70'
                  }`}
                />
                <span className="font-sans text-[9px] uppercase tracking-[0.22em] text-ivory/80">
                  {active.element} · {active.tier}
                </span>
              </div>
              <EmberField className="opacity-60" />
            </div>

            {/* Content */}
            <div className="relative flex flex-col p-5 sm:p-8 lg:p-10">
              <div data-anim>
                <p className="eyebrow">{active.tier}</p>
                <h3 className="mt-3 font-display text-2xl leading-tight text-ivory sm:text-3xl">
                  {active.name}
                </h3>
                <p className="mt-2 font-serif text-base italic text-gold/80">{active.subtitle}</p>
              </div>

              <Divider className="my-5" />

              <div className="space-y-2.5" data-anim>
                {active.description.map((line, i) => {
                  const [head, ...rest] = line.split(' — ')
                  const hasHead = rest.length > 0
                  return (
                    <p key={i} className="text-[12.5px] leading-relaxed text-ivory/60 sm:text-[13px]">
                      {hasHead ? (
                        <>
                          <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-gold/75">
                            {head}
                          </span>
                          <span className="mx-1.5 text-gold/30">—</span>
                          {rest.join(' — ')}
                        </>
                      ) : (
                        line
                      )}
                    </p>
                  )
                })}
              </div>

              {/* multipliers */}
              <div className="mt-6" data-anim>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <span className="flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.22em] text-gold/75">
                    <Info className="h-3.5 w-3.5" />
                    {active.detailLabel}
                  </span>
                  <div className="flex items-center gap-1 border border-gold/20 p-0.5">
                    {active.levelLabels.map((label, i) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setLevelIdx(i)}
                        aria-pressed={levelIdx === i}
                        className={`px-2.5 py-1 font-sans text-[10px] tracking-[0.14em] transition-colors ${
                          levelIdx === i
                            ? 'bg-gold/90 text-obsidian'
                            : 'text-ivory/50 hover:text-ivory/85'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-hidden border border-gold/10">
                  <table className="w-full border-collapse text-left">
                    <caption className="sr-only">
                      {active.name} multipliers at {active.levelLabels[levelIdx]}
                    </caption>
                    <thead>
                      <tr className="bg-crimson/15">
                        <th scope="col" className="px-3 py-2 font-sans text-[9px] font-normal uppercase tracking-[0.2em] text-ivory/55">
                          Attribute
                        </th>
                        <th scope="col" className="px-3 py-2 text-right font-sans text-[9px] font-normal uppercase tracking-[0.2em] text-gold/85">
                          {active.levelLabels[levelIdx]}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {active.detailRows.map((row, i) => (
                        <tr key={row.label} className={i % 2 ? 'bg-ivory/[0.02]' : ''}>
                          <td className="px-3 py-[7px] text-[11.5px] text-ivory/60">{row.label}</td>
                          <td className="px-3 py-[7px] text-right font-serif text-[13px] text-ivory/95">
                            {row.values[levelIdx]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="mt-auto pt-5 font-sans text-[10px] leading-relaxed text-ivory/30">
                Values are official in-game talent multipliers. Damage scales with ATK, Pyro DMG
                Bonus and CRIT, and is not shown as final damage.
              </p>
            </div>
          </div>

          {/* decorative corner blossom */}
          <PlumBlossom className="pointer-events-none absolute -right-3 -top-3 h-8 w-8 opacity-70" />
        </div>

        {/* ---------------- Passive talents ---------------- */}
        <div className="mt-14">
          <div className="flex items-center gap-4" data-reveal>
            <span className="h-px w-10 bg-gold/40" />
            <h3 className="font-display text-lg tracking-[0.14em] text-ivory/85 sm:text-xl">
              Passive Talents
            </h3>
            <ChevronRight className="h-4 w-4 text-gold/50" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {passives.map((p, i) => (
              <article
                key={p.name}
                data-reveal
                className="group panel relative overflow-hidden p-5 transition-colors duration-500 hover:border-gold/40"
              >
                <span className="absolute right-4 top-4 font-display text-[11px] tracking-[0.2em] text-gold/25">
                  0{i + 1}
                </span>
                <span className="inline-flex items-center gap-2 border border-gold/20 px-2 py-1">
                  <span className="h-1 w-1 rotate-45 bg-gold/70" />
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-gold/70">
                    {p.kind}
                  </span>
                </span>
                <h4 className="mt-4 font-serif text-xl text-ivory/95">{p.name}</h4>
                <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.18em] text-muted/60">
                  {p.unlock}
                </p>
                <p className="mt-3 text-[12.5px] leading-relaxed text-ivory/55">{p.description}</p>
                <span className="absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-gold/60 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
