import { useRef, useState } from 'react'
import { FlaskConical, Flame, Compass, Swords, Users, ChevronRight } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { SectionShell, SectionHeading } from './ui/Section'
import { Butterfly, PlumBlossom, Divider } from './ui/Decorations'
import { ArtifactIcon, PriorityMark } from './ui/ArtifactIcons'
import { buildPresets, artifactSlots } from '../data/artifacts'
import crimsonSet from '../assets/artifacts/crimson-witch.png'

const PRESET_ICONS = { vaporize: FlaskConical, pyro: Flame, general: Compass } as const

export default function ArtifactBuilds() {
  const [presetId, setPresetId] = useState<(typeof buildPresets)[number]['id']>('vaporize')
  const panelRef = useRef<HTMLDivElement>(null)
  const preset = buildPresets.find((p) => p.id === presetId) ?? buildPresets[0]

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
    gsap.from(q('[data-slot]'), {
      opacity: 0,
      scale: 0.85,
      duration: 0.7,
      stagger: 0.08,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: q('[data-slots]')[0], start: 'top 88%', once: true },
    })
  }, [])

  const select = (id: (typeof buildPresets)[number]['id']) => {
    if (id === presetId) return
    setPresetId(id)
    if (panelRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        panelRef.current.querySelectorAll('[data-p]'),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.045, ease: 'power2.out', overwrite: true },
      )
    }
  }

  return (
    <SectionShell id="builds" className="overflow-hidden">
      <div ref={rootRef} className="relative">
        {/* parchment-ish crimson plates */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-full w-[140%] -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_20%,rgba(83,27,41,.5),transparent_65%)]" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gold/10" />
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="06"
            eyebrow="Artifacts & Builds"
            title="Prepare for the"
            accent="Return"
            description="Three prescriptions from the parlor's own records — each tuned to a different way of dancing with death."
          />
        </div>

        {/* ---------------- Preset selector ---------------- */}
        <div role="tablist" aria-label="Build presets" className="mt-10 grid gap-2 sm:grid-cols-3">
          {buildPresets.map((p) => {
            const Icon = PRESET_ICONS[p.id]
            const selected = p.id === presetId
            return (
              <div
                key={p.id}
                role="presentation"
                data-reveal
                className={`relative overflow-hidden border transition-all duration-500 ${
                  selected
                    ? 'border-gold/60 bg-gradient-to-br from-crimson/45 via-dark-red/35 to-transparent'
                    : 'border-gold/15 bg-ivory/[0.02] hover:border-gold/35 hover:bg-ivory/[0.04]'
                }`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="build-panel"
                  id={`preset-${p.id}`}
                  onClick={() => select(p.id)}
                  className="group block w-full px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        selected ? 'text-gold-bright' : 'text-gold/60'
                      }`}
                      strokeWidth={1.7}
                    />
                    <span
                      className={`font-serif text-lg transition-colors ${
                        selected ? 'text-ivory' : 'text-ivory/65 group-hover:text-ivory/85'
                      }`}
                    >
                      {p.name}
                    </span>
                    <ChevronRight
                      className={`ml-auto h-4 w-4 text-gold/50 transition-transform ${
                        selected ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                      }`}
                    />
                  </span>
                  <span className="mt-2 block text-[11.5px] leading-relaxed text-ivory/45">
                    {p.tagline}
                  </span>
                </button>
                {selected && (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
                )}
              </div>
            )
          })}
        </div>

        {/* ---------------- Panel ---------------- */}
        <div
          ref={panelRef}
          id="build-panel"
          role="tabpanel"
          aria-labelledby={`preset-${preset.id}`}
          className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,0.68fr)]"
        >
          {/* left column */}
          <div className="space-y-4">
            {/* summary */}
            <article className="panel corners relative overflow-hidden p-6 sm:p-7">
              <span className="corner-b pointer-events-none absolute inset-0" aria-hidden="true" />
              <Butterfly className="pointer-events-none absolute -right-6 -top-6 w-28 opacity-[0.12]" />
              <div data-p className="flex flex-wrap items-center gap-3">
                <span className="border border-gold/35 bg-crimson/25 px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.22em] text-gold-bright">
                  {preset.elementReaction}
                </span>
              </div>
              <h3 data-p className="mt-4 font-display text-2xl text-ivory sm:text-3xl">
                {preset.name}
              </h3>
              <p data-p className="mt-3 max-w-2xl text-[13px] leading-[1.85] text-ivory/60">
                {preset.summary}
              </p>

              {/* sets */}
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {preset.sets.map((s, i) => (
                  <div
                    key={s.id}
                    data-p
                    className={`relative overflow-hidden border p-4 ${
                      i === 0 ? 'border-gold/45 bg-gold/[0.06]' : 'border-ivory/10 bg-ivory/[0.02]'
                    }`}
                  >
                    {i === 0 && (
                      <span className="absolute right-0 top-0 bg-gold/90 px-2 py-0.5 font-sans text-[8px] uppercase tracking-[0.18em] text-obsidian">
                        Main
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <ArtifactIcon slot={i === 0 ? 'flower' : i === 1 ? 'plume' : 'circlet'} className="h-9 w-9" />
                      <span className="font-sans text-[9px] uppercase tracking-[0.18em] text-gold/60">
                        {s.pieces}
                      </span>
                    </div>
                    <p className="mt-3 font-serif text-[15px] leading-tight text-ivory/95">{s.name}</p>
                    <p className="mt-2 text-[11px] leading-relaxed text-ivory/50">
                      <span className="text-gold/70">2pc</span> · {s.twoPiece}
                    </p>
                    {s.fourPiece ? (
                      <p className="mt-1 text-[11px] leading-relaxed text-ivory/40">{s.fourPiece}</p>
                    ) : (
                      <p className="mt-1 text-[11px] italic leading-relaxed text-ivory/35">
                        Splash piece — combine with the main set's 4-piece.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </article>

            {/* main stats + substats */}
            <div className="grid gap-4 sm:grid-cols-2">
              <article className="panel p-5 sm:p-6" data-p>
                <div className="flex items-center gap-2.5">
                  <Swords className="h-4 w-4 text-gold/70" strokeWidth={1.6} />
                  <h4 className="font-sans text-[10px] uppercase tracking-[0.24em] text-gold/80">
                    Main Stats
                  </h4>
                </div>
                <div className="mt-4 space-y-3">
                  {preset.mainStats.map((m) => (
                    <div key={m.slot} className="border-b border-ivory/[0.06] pb-3 last:border-0 last:pb-0">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="stat-label">{m.slot}</span>
                        <span className="font-serif text-[15px] text-gold-bright">{m.stat}</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed text-ivory/40">{m.note}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel p-5 sm:p-6" data-p>
                <div className="flex items-center gap-2.5">
                  <Flame className="h-4 w-4 text-gold/70" strokeWidth={1.6} />
                  <h4 className="font-sans text-[10px] uppercase tracking-[0.24em] text-gold/80">
                    Substat Priority
                  </h4>
                </div>
                <div className="mt-4 space-y-2.5">
                  {preset.substats.map((s) => (
                    <div key={s.stat} className="flex items-center justify-between gap-3">
                      <span className="text-[12.5px] text-ivory/65">{s.stat}</span>
                      <PriorityMark level={s.priority} />
                    </div>
                  ))}
                </div>
                <Divider className="my-4" icon={false} />
                <p className="text-[10.5px] leading-relaxed text-ivory/35">
                  Prioritise reaching a 1:2 CRIT Ratio before chasing additional HP% rolls.
                </p>
              </article>
            </div>

            {/* teams */}
            <article className="panel p-5 sm:p-6" data-p>
              <div className="flex items-center gap-2.5">
                <Users className="h-4 w-4 text-gold/70" strokeWidth={1.6} />
                <h4 className="font-sans text-[10px] uppercase tracking-[0.24em] text-gold/80">
                  Team Compositions
                </h4>
              </div>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
                {preset.teams.map((t) => (
                  <div key={t.name} className="border border-ivory/10 bg-ivory/[0.02] p-3.5">
                    <p className="font-serif text-[15px] text-ivory/95">{t.name}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {t.members.map((m) => (
                        <span
                          key={m}
                          className={`px-2 py-0.5 font-sans text-[9px] uppercase tracking-[0.12em] ${
                            m === 'Hu Tao'
                              ? 'bg-gold/85 text-obsidian'
                              : 'border border-ivory/15 text-ivory/55'
                          }`}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-[10.5px] leading-relaxed text-ivory/40">{t.note}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* right column: weapon picks + artifact art */}
          <div className="space-y-4">
            <article className="panel relative overflow-hidden" data-p>
              <div className="relative h-44 overflow-hidden sm:h-52">
                <img
                  src={crimsonSet}
                  alt="Crimson Witch of Flames artifact set displayed in a radiant relic plate"
                  className="h-full w-full object-cover object-[50%_35%]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1118] via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-3">
                  <p className="eyebrow">Signature Set</p>
                  <p className="mt-1 font-serif text-xl text-ivory">Crimson Witch of Flames</p>
                </div>
              </div>
              <div className="p-4">
                <div
                  data-slots
                  className="flex items-center justify-between gap-2"
                  aria-label="Artifact slot recommendations"
                >
                  {artifactSlots.map((s) => (
                    <div key={s.slot} data-slot className="group flex flex-col items-center gap-1.5">
                      <span className="relative flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-500 group-hover:-translate-y-0.5 sm:h-14 sm:w-14">
                        <ArtifactIcon slot={s.icon} className="h-full w-full" />
                        <span className="pointer-events-none absolute inset-0 rounded-full bg-gold/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                      </span>
                      <span className="font-sans text-[8px] uppercase tracking-[0.14em] text-ivory/40">
                        {s.slot}
                      </span>
                      <span className="font-serif text-[10px] leading-none text-gold/80">{s.stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>

            <article className="panel relative p-5 sm:p-6" data-p>
              <div className="flex items-center gap-2.5">
                <PlumBlossom className="h-3.5 w-3.5" />
                <h4 className="font-sans text-[10px] uppercase tracking-[0.24em] text-gold/80">
                  Weapon Picks
                </h4>
              </div>
              <div className="mt-4 space-y-2.5">
                {preset.weapons.map((w) => (
                  <div
                    key={w.name}
                    className="flex items-start gap-3 border-b border-ivory/[0.06] pb-2.5 last:border-0 last:pb-0"
                  >
                    <span
                      className={`mt-0.5 shrink-0 px-1.5 py-0.5 font-sans text-[8px] uppercase tracking-[0.14em] ${
                        w.rank === 'BiS'
                          ? 'bg-gold/90 text-obsidian'
                          : w.rank === 'Strong'
                            ? 'border border-gold/40 text-gold/80'
                            : 'border border-ivory/15 text-ivory/40'
                      }`}
                    >
                      {w.rank}
                    </span>
                    <div>
                      <p className="font-serif text-[14.5px] leading-tight text-ivory/90">{w.name}</p>
                      <p className="mt-0.5 text-[10.5px] leading-relaxed text-ivory/40">{w.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <div className="border border-dashed border-gold/20 px-4 py-3">
              <p className="font-sans text-[9px] leading-relaxed tracking-[0.06em] text-ivory/30">
                Sources: in-game artifact descriptions and talent text; build guidance reflects
                established Hu Tao theorycrafting. Stats are shown at Lv.&nbsp;90.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
