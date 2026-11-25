import { useEffect, useRef } from 'react'

export interface Pointer {
  x: number // -1 → 1
  y: number // -1 → 1
}

/** Pointer position held in a ref so animation loops never trigger React renders. */
export function usePointer() {
  const pointer = useRef<Pointer>({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return pointer
}
