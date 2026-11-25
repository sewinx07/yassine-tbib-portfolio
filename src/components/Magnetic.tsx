import { useRef } from 'react'
import type { PointerEvent, ReactNode } from 'react'
import gsap from 'gsap'

export default function Magnetic({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)

  const onMove = (event: PointerEvent<HTMLSpanElement>) => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left - rect.width / 2) * 0.22
    const y = (event.clientY - rect.top - rect.height / 2) * 0.22
    gsap.to(el, { x, y, duration: 0.5, ease: 'power3.out' })
  }

  const onLeave = () => {
    if (ref.current) gsap.to(ref.current, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1,0.4)' })
  }

  return (
    <span
      ref={ref}
      data-magnetic
      className={`inline-block ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </span>
  )
}
