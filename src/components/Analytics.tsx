import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'

declare const __VERCEL_ENV__: string

/** Vercel Web Analytics is loaded only on Vercel production and never blocks first paint. */
export default function Analytics() {
  const [Component, setComponent] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (!import.meta.env.PROD || __VERCEL_ENV__ !== 'production' || typeof window === 'undefined' || !window.location.hostname.endsWith('.vercel.app')) return
    let active = true
    void import('@vercel/analytics/react').then(({ Analytics }) => {
      if (active) setComponent(() => Analytics)
    })
    return () => {
      active = false
    }
  }, [])

  return Component ? <Component /> : null
}
