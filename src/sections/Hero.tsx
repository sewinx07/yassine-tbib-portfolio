import { lazy, Suspense, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, MoveDown } from 'lucide-react'
const HeroScene = lazy(() => import('../three/HeroScene'))
import Magnetic from '../components/Magnetic'
import { useLanguage } from '../i18n/LanguageContext'
import { usePointer } from '../hooks/usePointer'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useCountUp } from '../hooks/useMotionSystem'
import { stats } from '../lib/content'

function Stat({ value, label, index }: { value: number; label: string; index: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  useCountUp(ref, value)
  return (
    <div className="flex flex-col gap-1" data-reveal>
      <span ref={ref} className="font-display text-4xl leading-none text-bone md:text-5xl">
        0
      </span>
      <span className="max-w-[9rem] text-[10px] uppercase leading-tight tracking-[0.12em] text-bone-dim">
        {label}
        <span className="sr-only"> {index}</span>
      </span>
    </div>
  )
}

function Portrait() {
  const shell = useRef<HTMLDivElement>(null)
  const photo = useRef<HTMLImageElement>(null)
  const depth = useRef<HTMLImageElement>(null)
  const pointer = usePointer()
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    let frame = 0
    const tick = () => {
      const x = pointer.current.x
      const y = pointer.current.y
      if (photo.current) photo.current.style.transform = `translate3d(${x * -12}px, ${y * -8}px, 0) scale(1.02)`
      if (depth.current) depth.current.style.transform = `translate3d(${x * 14}px, ${y * 10}px, 0) scale(1.06)`
      if (shell.current) shell.current.style.setProperty('--px', `${x * 8}px`)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [pointer, reduced])

  return (
    <div ref={shell} className="relative mx-auto h-[420px] w-full max-w-[440px] md:h-[540px] lg:h-[640px]" data-reveal>
      <div className="absolute inset-x-6 bottom-0 top-6 border border-crimson/40 md:inset-x-10" />
      <div className="absolute inset-x-0 bottom-8 top-0 border border-white/10" />
      <img
        ref={depth}
        src="/assets/portrait/portrait-depth.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-contain object-bottom opacity-25 mix-blend-screen"
      />
      <img
        ref={photo}
        src="/assets/portrait/portrait.webp"
        alt="Portrait de Yassine Tbib"
        className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.75)]"
      />
      <span className="absolute -bottom-2 left-0 font-body text-[9px] font-semibold uppercase tracking-editorial text-bone-dim md:left-4">
        Gabès · TN
      </span>
      <span className="absolute right-0 top-0 h-2 w-2 bg-crimson md:right-4" />
    </div>
  )
}

export default function Hero() {
  const { content } = useLanguage()

  return (
    <section id="top" className="grain relative flex min-h-[100svh] flex-col overflow-hidden pt-28 md:pt-32">
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-ink via-ink/40 to-transparent" />

      <div className="section-shell relative z-10 flex flex-1 items-center py-10">
        <div className="grid w-full items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
          <div className="relative">
            <p className="eyebrow mb-6 flex items-center gap-3" data-reveal>
              <span className="h-px w-9 bg-crimson" />
              {content.hero.greeting}
            </p>
            <h1 className="relative" data-reveal>
              <span className="block font-display text-[clamp(4rem,13vw,11rem)] uppercase leading-[0.78] tracking-[-0.03em] text-bone">
                {content.hero.firstName}
              </span>
              <span className="block font-display text-[clamp(4rem,13vw,11rem)] uppercase leading-[0.78] tracking-[-0.03em] text-bone">
                {content.hero.lastName.charAt(0)}
                <span className="text-crimson">{content.hero.lastName.slice(1)}</span>
              </span>
            </h1>
            <p
              className="mt-8 max-w-xl font-script text-4xl leading-none text-bone md:text-5xl"
              data-reveal
            >
              {content.hero.tagline}
            </p>
            <p className="mt-7 max-w-lg text-sm leading-[1.9] text-bone-dim md:text-base" data-reveal>
              {content.hero.bio}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4" data-reveal>
              <Magnetic>
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-3 rounded-full bg-crimson px-7 py-4 text-[11px] font-bold uppercase tracking-editorial text-white transition-colors duration-300 hover:bg-crimson-bright"
                >
                  {content.sections.selected.viewAll}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </Link>
              </Magnetic>
              <a href="#contact" className="link-underline">
                {content.nav.contact} ↗
              </a>
            </div>

            <div className="mt-14 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-7">
              {stats.map((stat, i) => (
                <Stat key={stat.labelIndex} value={stat.value} label={content.hero.statsLabel[i]} index={i} />
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -right-10 top-1/2 hidden -translate-y-1/2 rotate-90 font-body text-[9px] uppercase tracking-editorial text-bone-dim xl:block">
              {content.hero.location}
            </div>
            <Portrait />
          </div>
        </div>
      </div>

      <div className="relative z-10 overflow-hidden border-y border-white/10 py-3" aria-hidden="true">
        <div className="flex w-max animate-[marquee_34s_linear_infinite] gap-12 whitespace-nowrap">
          {[0, 1].map((i) => (
            <span key={i} className="stroke-text font-display text-[clamp(3rem,8vw,7rem)] uppercase leading-none">
              {content.hero.word} · {content.hero.word} · {content.hero.word} ·
            </span>
          ))}
        </div>
      </div>
      <div className="section-shell relative z-10 flex items-center gap-3 py-4 text-[9px] uppercase tracking-editorial text-bone-dim">
        <MoveDown className="h-3 w-3 text-crimson" />
        {content.hero.scroll}
      </div>
    </section>
  )
}
