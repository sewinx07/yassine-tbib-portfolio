import { useLanguage } from '../i18n/LanguageContext'
import TodoBadge from '../components/TodoBadge'

export default function QuotePanel() {
  const { content } = useLanguage()
  const quote = content.sections.quote

  return (
    <section className="section-shell py-12 md:py-20">
      <div className="grain relative overflow-hidden border-y border-white/10 bg-ink-850 px-6 py-20 md:px-16 md:py-28">
        <div className="pointer-events-none absolute -left-20 -top-24 font-display text-[22rem] leading-none text-crimson/10" aria-hidden="true">
          “
        </div>
        <div className="relative max-w-4xl" data-reveal>
          <p className="eyebrow mb-8">{quote.eyebrow}</p>
          <blockquote className="font-display text-[clamp(1.8rem,4.2vw,3.6rem)] uppercase leading-[1.12] tracking-tight text-bone">
            {quote.text}
            <TodoBadge label="Original draft — needs Yassine's approval" />
          </blockquote>
          <p className="mt-10 font-script text-4xl text-crimson md:text-5xl">— {quote.signature}</p>
        </div>
      </div>
    </section>
  )
}
