import { useEffect, useState } from 'react'

export default function Loader() {
  const [visible, setVisible] = useState(true)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const leave = window.setTimeout(() => setLeaving(true), 900)
    const done = window.setTimeout(() => setVisible(false), 1750)
    return () => {
      window.clearTimeout(leave)
      window.clearTimeout(done)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-ink transition-opacity duration-700 ${
        leaving ? 'pointer-events-none animate-curtain opacity-0' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        <span className="font-script text-5xl text-bone md:text-7xl">Yassine</span>
        <span className="h-px w-40 overflow-hidden bg-white/10">
          <span className="loader-line block h-full w-full origin-left bg-crimson" />
        </span>
        <span className="text-[9px] font-semibold uppercase tracking-editorial text-bone-dim">
          Portfolio · 2026
        </span>
      </div>
    </div>
  )
}
