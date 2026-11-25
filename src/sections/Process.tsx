import { Briefcase, Code2, PenLine, Send, Sparkles } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import { processSteps, t, type ProcessStep } from '../lib/content'
import { useLanguage } from '../i18n/LanguageContext'

const icons = {
  briefcase: Briefcase,
  sparkles: Sparkles,
  pen: PenLine,
  code: Code2,
  send: Send,
} satisfies Record<ProcessStep['icon'], typeof Briefcase>

export default function Process() {
  const { content, locale } = useLanguage()

  return (
    <section className="section-shell py-24 md:py-36">
      <SectionHeading eyebrow={content.sections.process.eyebrow} title={content.sections.process.title} />
      <ol className="relative grid gap-10 md:grid-cols-5 md:gap-4">
        <div className="absolute left-0 right-0 top-9 hidden h-px bg-white/10 md:block" aria-hidden="true" />
        {processSteps.map((step) => {
          const Icon = icons[step.icon]
          return (
            <li key={step.number} className="relative" data-reveal>
              <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/15 bg-ink">
                <Icon className="h-5 w-5 text-crimson" strokeWidth={1.5} />
              </div>
              <p className="mt-6 font-display text-3xl text-white/20">{step.number}</p>
              <h3 className="mt-1 font-display text-xl uppercase text-bone">{t(step.title, locale)}</h3>
              <p className="mt-2 max-w-[15rem] text-xs leading-relaxed text-bone-dim">{t(step.detail, locale)}</p>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
