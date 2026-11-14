import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap'

/**
 * Scopes a GSAP animation setup to a container element and reverts it on
 * unmount (killing every timeline and ScrollTrigger created inside).
 *
 * Usage:
 *   const ref = useScrollAnimation<HTMLDivElement>((el) => {
 *     gsap.from(el.querySelectorAll('.reveal'), { ... })
 *   })
 */
export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  setup: (root: T) => void,
  deps: unknown[] = [],
): RefObject<T> {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    let ctx: gsap.Context | undefined

    // Give the browser one frame so fonts/layout settle before measuring.
    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        if (prefersReducedMotion()) {
          // Still let components place their elements in a sensible final state.
          setup(root)
          return
        }
        setup(root)
      }, root)
      ScrollTrigger.refresh()
    })

    return () => {
      cancelAnimationFrame(raf)
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}

/** A small reveal timeline shared by sections: fade + rise with a soft stagger. */
export function revealUp(
  targets: gsap.TweenTarget,
  opts: { y?: number; stagger?: number; delay?: number; trigger?: Element | null; start?: string } = {},
) {
  if (prefersReducedMotion()) {
    gsap.set(targets, { opacity: 1, y: 0 })
    return
  }
  return gsap.fromTo(
    targets,
    { opacity: 0, y: opts.y ?? 40 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: opts.stagger ?? 0.08,
      delay: opts.delay ?? 0,
      scrollTrigger: opts.trigger
        ? { trigger: opts.trigger, start: opts.start ?? 'top 82%', once: true }
        : undefined,
    },
  )
}
