import { t } from '../lib/content'
import { education, languages, skillGroups, trainings } from '../lib/content'
import SectionHeading from '../components/SectionHeading'
import { useLanguage } from '../i18n/LanguageContext'

export default function Education() {
  const { content, locale } = useLanguage()

  return (
    <section id="about" className="section-shell scroll-mt-24 py-24 md:py-36">
      <SectionHeading
        eyebrow={content.sections.education.eyebrow}
        title={content.sections.education.title}
      />

      <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div data-reveal>
          <h3 className="eyebrow mb-8 border-b border-white/10 pb-4">{content.sections.education.timeline}</h3>
          <ol className="relative border-l border-white/10 pl-8">
            {education.map((item) => (
              <li key={item.period + item.title.fr} className="relative pb-10 last:pb-0">
                <span className="absolute -left-[35px] top-1 h-2 w-2 rounded-full border border-crimson bg-ink" />
                <p className="text-[10px] font-semibold uppercase tracking-editorial text-crimson">{item.period}</p>
                <h4 className="mt-2 font-display text-xl uppercase leading-tight text-bone md:text-2xl">
                  {t(item.title, locale)}
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-bone-dim">{item.place}</p>
                <p className="mt-1 text-xs text-bone-dim/70">{t(item.detail, locale)}</p>
              </li>
            ))}
          </ol>

          <h3 className="eyebrow mb-6 mt-14 border-b border-white/10 pb-4">
            {content.sections.education.training}
          </h3>
          <ul className="grid gap-3 sm:grid-cols-3">
            {trainings.map((item) => (
              <li key={item.title.fr} className="border border-white/10 p-4">
                <p className="text-[10px] uppercase tracking-widest text-crimson">{item.period}</p>
                <p className="mt-2 text-xs leading-snug text-bone">{t(item.title, locale)}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-12" data-reveal>
          <div>
            <h3 className="eyebrow mb-6 border-b border-white/10 pb-4">
              {locale === 'fr' ? 'Compétences' : 'Skills'}
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {skillGroups.flatMap((group) => group.items).map((item) => (
                <span key={item} className="chip">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="eyebrow mb-6 border-b border-white/10 pb-4">
              {locale === 'fr' ? 'Langues' : 'Languages'}
            </h3>
            <ul className="space-y-5">
              {languages.map((language) => (
                <li key={language.name.fr}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium text-bone">{t(language.name, locale)}</span>
                    <span className="text-[10px] uppercase tracking-widest text-bone-dim">
                      {t(language.level, locale)}
                    </span>
                  </div>
                  <div className="mt-2 h-px w-full bg-white/10">
                    <div className="h-px bg-crimson" style={{ width: `${language.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
