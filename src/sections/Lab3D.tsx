import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { useLanguage } from '../i18n/LanguageContext'

const frames = [1, 2, 3, 4].map((n) => `/assets/projects/jazira-3d-0${n}.webp`)

export default function Lab3D() {
  const { content, locale } = useLanguage()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const startX = useRef<number | null>(null)

  const go = (direction: number) => setIndex((i) => (i + direction + frames.length) % frames.length)

  return (
    <section id="lab" className="relative scroll-mt-24 overflow-hidden border-y border-white/10 bg-ink-850 py-24 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[520px] w-[520px] rounded-full bg-crimson/10 blur-[130px]" />
      <div className="section-shell relative">
        <SectionHeading
          eyebrow={content.sections.lab.eyebrow}
          title={content.sections.lab.title}
          note={content.sections.lab.description}
        />

        <div
          className="relative"
          role="region"
          aria-label={content.sections.lab.title}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') go(-1)
            if (e.key === 'ArrowRight') go(1)
          }}
          onPointerDown={(e) => {
            startX.current = e.clientX
            e.currentTarget.setPointerCapture(e.pointerId)
          }}
          onPointerMove={(e) => {
            if (startX.current === null) return
            const dx = e.clientX - startX.current
            if (Math.abs(dx) > 55) {
              go(dx > 0 ? -1 : 1)
              startX.current = null
            }
          }}
          onPointerUp={(e) => {
            startX.current = null
            e.currentTarget.releasePointerCapture(e.pointerId)
          }}
        >
          <div className="relative aspect-[16/9] overflow-hidden border border-white/10 bg-ink-800 md:aspect-[2/1]">
            {frames.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${content.sections.lab.title} — ${i + 1}`}
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
                className={`absolute inset-0 h-full w-full select-none object-cover transition-[opacity,transform] duration-700 ease-cinematic ${
                  i === index ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'
                }`}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-10">
              <div>
                <p className="text-[10px] uppercase tracking-editorial text-crimson">
                  {content.sections.lab.frames}
                </p>
                <p className="mt-2 font-display text-3xl uppercase text-bone md:text-5xl">
                  Frame {String(index + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="pointer-events-auto inline-flex items-center gap-3 rounded-full border border-white/30 bg-ink/50 px-5 py-3 text-[10px] font-bold uppercase tracking-editorial text-bone backdrop-blur-sm transition-colors hover:border-crimson hover:bg-crimson"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                {locale === 'fr' ? 'Voir le rendu' : 'Watch render'}
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-6">
            <p className="text-[10px] uppercase tracking-[0.16em] text-bone-dim">{content.sections.lab.drag}</p>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => go(-1)} className="icon-button h-9 w-9" aria-label="Previous frame">
                <ChevronLeft className="h-4 w-4" />
              </button>
              {frames.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Frame ${i + 1}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-crimson' : 'w-1.5 bg-white/25 hover:bg-white/60'
                  }`}
                />
              ))}
              <button type="button" onClick={() => go(1)} className="icon-button h-9 w-9" aria-label="Next frame">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {playing && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 p-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={content.sections.lab.title}
          onClick={() => setPlaying(false)}
        >
          <button
            type="button"
            onClick={() => setPlaying(false)}
            className="absolute right-6 top-6 icon-button"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <video
            src="/assets/video/jazira-preview.webm"
            poster="/assets/projects/jazira-3d-01.webp"
            controls
            autoPlay
            loop
            className="max-h-[80vh] w-full max-w-5xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <source src="/assets/video/jazira-preview.mp4" type="video/mp4" />
          </video>
        </div>
      )}
    </section>
  )
}
