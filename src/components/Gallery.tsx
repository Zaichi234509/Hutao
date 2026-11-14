import { useCallback, useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Expand, Images, ZoomIn } from 'lucide-react'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { useScrollLock } from '../hooks/useUI'
import { SectionShell, SectionHeading } from './ui/Section'
import { Butterfly, PlumBlossom, PetalField } from './ui/Decorations'
import { galleryItems } from '../data/gallery'

export default function Gallery() {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [carousel, setCarousel] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  useScrollLock(lightbox !== null)

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
    gsap.from(q('[data-tile]'), {
      opacity: 0,
      y: 44,
      scale: 0.98,
      duration: 0.95,
      stagger: 0.07,
      ease: 'power3.out',
      scrollTrigger: { trigger: q('[data-grid]')[0], start: 'top 84%', once: true },
    })
  }, [])

  const open = useCallback((index: number) => {
    lastFocus.current = document.activeElement as HTMLElement
    setLightbox(index)
  }, [])

  const close = useCallback(() => {
    setLightbox(null)
    // restore focus to the tile that opened the viewer
    requestAnimationFrame(() => lastFocus.current?.focus?.())
  }, [])

  const step = useCallback(
    (dir: number) => {
      setLightbox((cur) => {
        if (cur === null) return cur
        return (cur + dir + galleryItems.length) % galleryItems.length
      })
    },
    [],
  )

  /* Keyboard handling for the lightbox */
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'Tab') {
        // simple focus trap within the dialog
        const focusables = document.querySelectorAll<HTMLElement>(
          '#lightbox [data-focusable], #lightbox button',
        )
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, close, step])

  const current = lightbox !== null ? galleryItems[lightbox] : null

  /* horizontal filmstrip carousel */
  const stripRef = useRef<HTMLDivElement>(null)
  const scrollStrip = (dir: number) => {
    const el = stripRef.current
    if (!el) return
    const amount = el.clientWidth * 0.72
    el.scrollBy({ left: dir * amount, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
    setCarousel((c) => (c + dir + galleryItems.length) % galleryItems.length)
  }

  return (
    <SectionShell id="gallery" className="overflow-hidden">
      <div ref={rootRef} className="relative">
        <PetalField className="-z-10 opacity-40" />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="07"
            eyebrow="Gallery"
            title="Moments in"
            accent="Crimson"
            description="Sketches from the archive — lanterns, blossoms and the quiet poetry of a parlor director off duty."
          />
          <div data-reveal className="flex items-center gap-3">
            <span className="flex items-center gap-2 border border-gold/25 px-3.5 py-2">
              <Images className="h-3.5 w-3.5 text-gold/70" />
              <span className="font-sans text-[10px] uppercase tracking-[0.22em] text-ivory/55">
                {galleryItems.length} Artworks
              </span>
            </span>
            <button
              type="button"
              onClick={() => open(0)}
              className="btn btn-outline !px-4 !py-2.5"
            >
              View Gallery
              <Expand className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* ---------------- Masonry grid ---------------- */}
        <div
          data-grid
          className="mt-10 grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[230px] md:grid-cols-3 lg:auto-rows-[250px] lg:grid-cols-4"
        >
          {galleryItems.map((item, i) => {
            const span =
              item.span === 'tall'
                ? 'row-span-2'
                : item.span === 'wide'
                  ? 'col-span-2'
                  : ''
            return (
              <button
                key={item.id}
                data-tile
                type="button"
                onClick={() => open(i)}
                className={`group relative overflow-hidden border border-gold/15 text-left transition-colors duration-500 hover:border-gold/50 ${span}`}
                aria-label={`Open ${item.title} in the lightbox`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  style={{ objectPosition: item.focus ?? '50% 50%' }}
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-obsidian/95 via-obsidian/15 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-100" />
                <span className="absolute inset-0 bg-crimson/0 transition-colors duration-500 group-hover:bg-crimson/10" />

                <span className="absolute inset-x-0 bottom-0 p-4">
                  <span className="flex items-center gap-2">
                    <span className="h-1 w-1 rotate-45 bg-gold/80" />
                    <span className="font-sans text-[8.5px] uppercase tracking-[0.24em] text-gold/75">
                      {item.tag}
                    </span>
                  </span>
                  <span className="mt-1.5 block font-serif text-lg leading-tight text-ivory sm:text-xl">
                    {item.title}
                  </span>
                  <span className="mt-1 block max-h-0 overflow-hidden font-sans text-[10.5px] leading-relaxed text-ivory/55 transition-all duration-500 group-hover:max-h-12">
                    {item.caption}
                  </span>
                </span>

                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-gold/0 bg-obsidian/0 text-gold opacity-0 backdrop-blur-sm transition-all duration-500 group-hover:border-gold/40 group-hover:bg-obsidian/50 group-hover:opacity-100">
                  <ZoomIn className="h-3.5 w-3.5" />
                </span>
              </button>
            )
          })}
        </div>

        {/* ---------------- Filmstrip ---------------- */}
        <div className="mt-12">
          <div className="flex items-center justify-between gap-4" data-reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold/40" />
              <h3 className="font-display text-base tracking-[0.18em] text-ivory/80 sm:text-lg">
                From the Archive
              </h3>
              <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-ivory/30">
                {String(carousel + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollStrip(-1)}
                className="flex h-10 w-10 items-center justify-center border border-gold/25 text-ivory/70 transition-colors hover:border-gold/60 hover:text-gold-bright"
                aria-label="Scroll gallery carousel left"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollStrip(1)}
                className="flex h-10 w-10 items-center justify-center border border-gold/25 text-ivory/70 transition-colors hover:border-gold/60 hover:text-gold-bright"
                aria-label="Scroll gallery carousel right"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div
            ref={stripRef}
            data-reveal
            className="no-scrollbar mask-fade-x mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
          >
            {galleryItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => open(i)}
                className="group relative h-32 w-48 shrink-0 snap-start overflow-hidden border border-gold/15 transition-colors hover:border-gold/50 sm:h-36 sm:w-56"
                aria-label={`Open ${item.title}`}
              >
                <img
                  src={item.src}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-obsidian/90 to-transparent" />
                <span className="absolute bottom-2 left-2.5 right-2.5 text-left font-serif text-[12.5px] leading-tight text-ivory/90">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------- Lightbox ---------------- */}
      {current !== null && (
        <div
          id="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Artwork viewer: ${current.title}`}
          className="fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur-xl"
        >
          {/* background bloom */}
          <div className="pointer-events-none absolute inset-0 opacity-60">
            <div className="absolute left-1/2 top-1/2 h-[70vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(141,38,54,.35),transparent_70%)] blur-3xl" />
          </div>

          <div className="relative flex items-center justify-between border-b border-gold/15 px-4 py-3 sm:px-7">
            <div className="flex items-center gap-3">
              <Butterfly className="h-5 w-5" />
              <div>
                <p className="font-sans text-[8.5px] uppercase tracking-[0.24em] text-gold/70">
                  {current.tag} · {String((lightbox ?? 0) + 1).padStart(2, '0')} / {galleryItems.length}
                </p>
                <p className="font-serif text-base text-ivory/90 sm:text-lg">{current.title}</p>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              className="flex h-11 w-11 items-center justify-center border border-gold/25 text-ivory/70 transition-colors hover:border-gold/60 hover:text-gold-bright"
              aria-label="Close artwork viewer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 py-3 sm:px-16">
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute left-1 z-10 flex h-11 w-11 items-center justify-center border border-gold/25 bg-obsidian/60 text-ivory/70 backdrop-blur-sm transition-colors hover:border-gold/70 hover:text-gold-bright sm:left-4 sm:h-14 sm:w-14"
              aria-label="Previous artwork"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <figure className="relative flex h-full max-h-full w-full max-w-5xl flex-col items-center justify-center">
              <img
                key={current.id}
                src={current.src}
                alt={current.caption}
                className="max-h-[62vh] w-auto max-w-full border border-gold/20 object-contain shadow-[0_40px_120px_-40px_rgba(0,0,0,.9)] sm:max-h-[68vh]"
              />
              <figcaption className="mt-4 max-w-xl px-4 text-center">
                <p className="font-serif text-sm italic leading-relaxed text-ivory/60 sm:text-base">
                  {current.caption}
                </p>
              </figcaption>
            </figure>

            <button
              type="button"
              onClick={() => step(1)}
              className="absolute right-1 z-10 flex h-11 w-11 items-center justify-center border border-gold/25 bg-obsidian/60 text-ivory/70 backdrop-blur-sm transition-colors hover:border-gold/70 hover:text-gold-bright sm:right-4 sm:h-14 sm:w-14"
              aria-label="Next artwork"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex items-center justify-center gap-2 border-t border-gold/15 px-4 py-3">
            {galleryItems.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`View ${item.title}`}
                aria-current={i === lightbox}
                className={`h-9 w-12 overflow-hidden border transition-all duration-300 sm:h-11 sm:w-16 ${
                  i === lightbox ? 'border-gold opacity-100' : 'border-ivory/15 opacity-45 hover:opacity-80'
                }`}
              >
                <img src={item.src} alt="" aria-hidden="true" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <PlumBlossom className="pointer-events-none absolute bottom-16 left-6 h-10 w-10 opacity-25" />
          <PlumBlossom className="pointer-events-none absolute right-8 top-24 h-8 w-8 opacity-20" tone="gold" />
        </div>
      )}
    </SectionShell>
  )
}
