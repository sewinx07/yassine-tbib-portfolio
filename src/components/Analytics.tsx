import { useEffect, useState } from 'react'
import type { ComponentType } from 'react'

/** Vercel Web Analytics is loaded only in production and never blocks first paint. */
export default function Analytics() {
  const [Component, setComponent] = useState<ComponentType | null>(null)

  useEffect(() => {
    if (!import.meta.env.PROD) return
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
