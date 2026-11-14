import { useCallback, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/gsap'

/** Boolean state for a media query. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')

/** True once the page has scrolled past `offset` pixels. */
export function useScrolled(offset = 40): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return scrolled
}

/** Tracks the section id currently in view for the navbar. */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [ids])

  return active
}

/**
 * Lock/unlock body scroll without layout shift (used by the lightbox & mobile menu).
 * Returns an unlock function; cleans up on unmount.
 */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const { style } = document.documentElement
    const prev = style.overflow
    style.overflow = 'hidden'
    return () => {
      style.overflow = prev
    }
  }, [locked])
}

/** Simple value that updates only after the user stops changing it. */
export function useDebouncedValue<T>(value: T, delay = 120): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(id)
  }, [value, delay])
  return debounced
}

/** Smooth-scroll to a section, respecting reduced motion. */
export function useScrollTo() {
  return useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 8
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [])
}

/** Pointer-driven parallax offsets (percent -1..1), returns a ref to attach. */
export function usePointerParallax(enabled = true) {
  const ref = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const raf = useRef(0)

  useEffect(() => {
    if (!enabled || prefersReducedMotion()) return
    const el = ref.current
    if (!el) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      target.current = {
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
      }
      if (!raf.current) raf.current = requestAnimationFrame(apply)
    }

    const apply = () => {
      raf.current = 0
      el.style.setProperty('--px', target.current.x.toFixed(3))
      el.style.setProperty('--py', target.current.y.toFixed(3))
    }

    const onLeave = () => {
      target.current = { x: 0, y: 0 }
      if (!raf.current) raf.current = requestAnimationFrame(apply)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf.current)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled])

  return ref
}
