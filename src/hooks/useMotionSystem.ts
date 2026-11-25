import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/** Lenis smooth scroll wired into GSAP's ticker. Disabled for reduced motion. */
export function useSmoothScroll() {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.15, wheelMultiplier: 0.9, smoothWheel: true })
    const onTick = (time: number) => lenis.raf(time * 1000)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    const onAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!target) return
      const id = target.getAttribute('href')?.slice(1)
      if (!id) return
      const element = document.getElementById(id)
      if (!element) return
      event.preventDefault()
      lenis.scrollTo(element, { offset: -80 })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [reduced])
}

/** Reveals [data-reveal] descendants on scroll with a split-line feel. */
export function useReveal(scope: RefObject<HTMLElement>, dependency?: unknown) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const root = scope.current
    if (!root) return
    const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', root)
    if (!items.length) return

    if (reduced) {
      gsap.set(items, { clearProps: 'all', opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { y: 34, opacity: 0, filter: 'blur(6px)' },
          {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: item, start: 'top 88%', once: true },
          },
        )
      })
    }, root)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [scope, reduced, dependency])
}

/** Counts a number element up when it enters the viewport. */
export function useCountUp(ref: RefObject<HTMLElement>, value: number) {
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduced) {
      el.textContent = String(value)
      return
    }
    const counter = { n: 0 }
    const tween = gsap.to(counter, {
      n: value,
      duration: 1.6,
      ease: 'power2.out',
      paused: true,
      onUpdate: () => {
        el.textContent = String(Math.round(counter.n))
      },
    })
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter: () => tween.play(),
    })
    return () => {
      trigger.kill()
      tween.kill()
    }
  }, [ref, value, reduced])
}
