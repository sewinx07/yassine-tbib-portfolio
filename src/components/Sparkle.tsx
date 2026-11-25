import type { SVGProps } from 'react'

export function Sparkle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 1.5l2.35 7.15L21.5 11l-7.15 2.35L12 20.5l-2.35-7.15L2.5 11l7.15-2.35L12 1.5z" />
    </svg>
  )
}
