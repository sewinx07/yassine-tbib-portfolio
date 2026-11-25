import { useMemo, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProjectCard from '../components/ProjectCard'
import { projects, type Category } from '../lib/content'
import { useLanguage } from '../i18n/LanguageContext'
import { useReveal } from '../hooks/useMotionSystem'

type Filter = Category | 'all'
const filters: Filter[] = ['all', 'graphic', 'motion', '3d', 'xr', 'web']

export default function Projects() {
  const { content, locale } = useLanguage()
  const [filter, setFilter] = useState<Filter>('all')
  const scope = useRef<HTMLDivElement>(null)
  const visible = useMemo(() => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)), [filter])
  useReveal(scope, filter)

  return (
    <div ref={scope} className="pt-32 md:pt-40">
      <section className="section-shell pb-16">
        <Link to="/" className="link-underline mb-10">
          <ArrowLeft className="h-3.5 w-3.5" />
          {content.projectsPage.back.replace('aux projets', 'à l’accueil').replace('to projects', 'home')}
        </Link>
        <p className="eyebrow mb-5">{content.projectsPage.eyebrow}</p>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 className="display-title text-[clamp(3.5rem,10vw,9rem)] text-bone">{content.projectsPage.title}</h1>
          <p className="max-w-md text-sm leading-relaxed text-bone-dim">{content.projectsPage.intro}</p>
        </div>
      </section>

      <div className="sticky top-[3.5rem] z-30 border-y border-white/10 bg-ink/90 backdrop-blur-xl md:top-14">
        <div className="section-shell flex flex-wrap items-center gap-x-2 gap-y-1 py-4">
          {filters.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                filter === key ? 'bg-crimson text-white' : 'text-bone-dim hover:text-bone'
              }`}
            >
              {content.projectsPage.filters[key]}
            </button>
          ))}
          <span className="ml-auto text-[10px] uppercase tracking-widest text-bone-dim">
            {visible.length} {content.projectsPage.count}
          </span>
        </div>
      </div>

      <section className="section-shell py-14 md:py-20">
        {visible.length ? (
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
            {visible.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-sm text-bone-dim">{content.projectsPage.empty}</p>
        )}
        <p className="mt-16 text-center text-[10px] uppercase tracking-editorial text-bone-dim/60">
          {locale === 'fr' ? 'Fin de l’archive' : 'End of archive'} · 2025 — 2026
        </p>
      </section>
    </div>
  )
}
