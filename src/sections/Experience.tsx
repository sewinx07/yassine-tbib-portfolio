import { t } from '../lib/content'
import { experience } from '../lib/content'
import SectionHeading from '../components/SectionHeading'
import { useLanguage } from '../i18n/LanguageContext'

export default function Experience() {
  const { content, locale } = useLanguage()

  return (
    <section className="section-shell py-8 md:py-12">
      <SectionHeading eyebrow={content.sections.experience.eyebrow} title={content.sections.experience.title} note={content.sections.experience.note} />
      <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
        {experience.map((item) => (
          <article key={item.title.fr + item.period} className="bg-ink p-7 md:p-9" data-reveal>
            <p className="text-[10px] font-semibold uppercase tracking-editorial text-crimson">{item.period}</p>
            <h3 className="mt-4 font-display text-2xl uppercase leading-tight text-bone">{t(item.title, locale)}</h3>
            <p className="mt-3 text-xs font-medium uppercase tracking-wider text-bone-dim">{item.place}</p>
            <p className="mt-5 text-xs leading-[1.85] text-bone-dim/80">{t(item.detail, locale)}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
