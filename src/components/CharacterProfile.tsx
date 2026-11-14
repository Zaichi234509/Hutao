import { Flame, Swords, Mountain, Sparkles, Cake, Landmark, Quote, ChevronRight } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { SectionShell, SectionHeading, Stars } from './ui/Section'
import { Butterfly, PlumBlossom, PyroSigil, GhostSpirit, Divider } from './ui/Decorations'
import { profile } from '../data/profile'
import portrait from '../assets/characters/hutao-portrait.png'
import parlor from '../assets/backgrounds/parlor.png'

const ICONS = { flame: Flame, spear: Swords, mountain: Mountain, stars: Sparkles, cake: Cake, building: Landmark } as const

export default function CharacterProfile() {
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

    gsap.from(q('[data-portrait]'), {
      opacity: 0,
      x: -50,
      scale: 0.97,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: root, start: 'top 70%', once: true },
    })

    gsap.from(q('[data-attr]'), {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.07,
      ease: 'power2.out',
      scrollTrigger: { trigger: q('[data-attr-grid]')[0], start: 'top 88%', once: true },
    })

    // slow portrait parallax
    gsap.fromTo(
      q('[data-portrait-img]'),
      { yPercent: -3 },
      {
        yPercent: 3,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }, [])

  return (
    <SectionShell id="profile" className="overflow-hidden">
      <div ref={rootRef} className="relative">
        {/* atmosphere */}
        <div className="pointer-events-none absolute -inset-x-10 -top-24 -bottom-24 -z-10">
          <img src={parlor} alt="" aria-hidden="true" className="h-full w-full object-cover opacity-[0.16]" />
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian/60 to-obsidian" />
        </div>

        <SectionHeading
          index="02"
          eyebrow="Character Profile"
          title="The Seventy-Seventh"
          accent="Director"
          description="Keeper of the final threshold, poet of the parlor, and the most cheerful guide the underworld has ever had."
        />

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-14">
          {/* ---------- Portrait card ---------- */}
          <div data-portrait className="relative">
            <div className="panel corners relative overflow-hidden p-2.5">
              <span className="corner-b pointer-events-none absolute inset-0" aria-hidden="true" />
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  data-portrait-img
                  src={portrait}
                  alt="Portrait of Hu Tao in ceremonial attire"
                  className="h-full w-full scale-[1.04] object-cover object-[50%_28%]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-transparent to-obsidian/10" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="eyebrow">Fragrance in Thaw</p>
                      <p className="mt-2 font-display text-3xl text-ivory sm:text-4xl">Hu Tao</p>
                      <p className="mt-1 font-serif text-sm italic text-gold/80">Papilio Charontis</p>
                    </div>
                    <div className="text-right">
                      <Stars count={5} size={13} className="justify-end" />
                      <p className="mt-2 font-sans text-[9px] uppercase tracking-[0.22em] text-ivory/50">
                        Released v{profile.releaseVersion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* sigil */}
                <div className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-gold/35 bg-obsidian/50 backdrop-blur-md">
                  <PyroSigil className="h-6 w-6" />
                </div>
              </div>

              {/* Ghosty peeking out of the frame */}
              <div className="anim-ghost pointer-events-none absolute -right-3 top-[42%] w-16 sm:-right-6 sm:w-20">
                <GhostSpirit className="w-full drop-shadow-[0_0_20px_rgba(240,230,214,.4)]" />
              </div>
            </div>

            {/* stats strip */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {profile.stats.map((s) => (
                <div key={s.label} className="panel px-3 py-3.5 text-center">
                  <p className="stat-label">{s.label}</p>
                  <p className="mt-1.5 font-serif text-base leading-tight text-ivory">{s.value}</p>
                  <p className="mt-0.5 font-sans text-[9px] uppercase tracking-[0.18em] text-gold/45">{s.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- Bio & attributes ---------- */}
          <div className="relative">
            <div data-reveal className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {profile.attributes.slice(0, 3).map((a) => {
                const Icon = ICONS[a.icon as keyof typeof ICONS]
                return (
                  <div key={a.label} className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-gold/80" strokeWidth={1.5} />
                    <span className="font-sans text-sm text-ivory/85">{a.value}</span>
                  </div>
                )
              })}
            </div>

            <Divider className="my-6" icon={false} />

            <div data-reveal className="relative">
              <Quote className="absolute -left-1 -top-2 h-8 w-8 text-crimson/40" strokeWidth={1} />
              <p className="pl-9 font-serif text-2xl leading-snug text-ivory/90 sm:text-[1.7rem]">
                {profile.tagline}
              </p>
            </div>

            <div className="mt-7 space-y-4">
              {profile.bio.map((p, i) => (
                <p
                  key={i}
                  data-reveal
                  className="text-[13.5px] leading-[1.85] text-ivory/60 sm:text-sm"
                >
                  {p}
                </p>
              ))}
            </div>

            {/* attributes grid */}
            <div data-attr-grid className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {profile.attributes.map((a) => {
                const Icon = ICONS[a.icon as keyof typeof ICONS]
                return (
                  <div
                    key={a.label}
                    data-attr
                    className="group panel flex items-start gap-3 px-3.5 py-3.5 transition-colors duration-500 hover:border-gold/40 sm:px-4"
                  >
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold/75 transition-colors duration-500 group-hover:border-gold/60 group-hover:text-gold-bright">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0">
                      <span className="stat-label block">{a.label}</span>
                      <span className="mt-1 block truncate font-serif text-sm text-ivory/90">{a.value}</span>
                    </span>
                  </div>
                )
              })}
            </div>

            {/* quote card */}
            <div data-reveal className="relative mt-8 overflow-hidden rounded-sm border border-gold/25 bg-gradient-to-br from-crimson/25 via-dark-red/20 to-transparent px-6 py-6">
              <Butterfly className="absolute -right-3 -top-3 w-20 opacity-25" />
              <PlumBlossom className="absolute bottom-2 right-16 h-6 w-6 opacity-30" />
              <p className="font-serif text-lg italic leading-relaxed text-ivory/85">
                &ldquo;Death is not the end — it is simply the last, best joke.&rdquo;
              </p>
              <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.28em] text-gold/60">
                Attributed to the Parlor Director
              </p>
              <a
                href="#talents"
                className="group mt-5 inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-[0.26em] text-gold/80 transition-colors hover:text-gold-bright"
              >
                Study her talents
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </SectionShell>
  )
}
