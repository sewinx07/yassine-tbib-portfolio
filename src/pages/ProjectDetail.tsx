import { useRef } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { projects, t } from '../lib/content'
import { useLanguage } from '../i18n/LanguageContext'
import { useReveal } from '../hooks/useMotionSystem'
import TodoBadge from '../components/TodoBadge'

export default function ProjectDetail() {
  const { slug } = useParams()
  const { content, locale } = useLanguage()
  const scope = useRef<HTMLDivElement>(null)
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]
  useReveal(scope, slug)

  if (!project) {
    return (
      <div className="section-shell flex min-h-[70vh] flex-col items-start justify-center pt-32">
        <h1 className="display-title text-6xl text-bone">{content.notFound.title}</h1>
        <Link to="/projects" className="link-underline mt-8">
          {content.projectsPage.back}
        </Link>
      </div>
    )
  }

  const next = projects[(index + 1) % projects.length]

  return (
    <div ref={scope} className="pt-32 md:pt-40">
      <section className="section-shell pb-12">
        <Link to="/projects" className="link-underline mb-12">
          <ArrowLeft className="h-3.5 w-3.5" />
          {content.projectsPage.back}
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-[10px] uppercase tracking-editorial text-bone-dim">
          <span className="text-crimson">{project.number}</span>
          <span>/</span>
          <span>{content.projectsPage.filters[project.category]}</span>
          <span>/</span>
          <span>{project.year}</span>
          {project.todo && <TodoBadge />}
        </div>
        <h1 className="display-title mt-6 max-w-5xl text-[clamp(3rem,8vw,7.5rem)] text-bone">
          {t(project.title, locale)}
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-bone-dim md:text-lg">
          {t(project.description, locale)}
        </p>
        <dl className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3">
          <div>
            <dt className="text-[10px] uppercase tracking-editorial text-bone-dim">{content.projectsPage.role}</dt>
            <dd className="mt-2 text-sm text-bone">{t(project.role, locale)}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-editorial text-bone-dim">{content.projectsPage.year}</dt>
            <dd className="mt-2 text-sm text-bone">{project.year}</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-editorial text-bone-dim">{content.projectsPage.tools}</dt>
            <dd className="mt-2 text-sm text-bone">{project.tools.join(' · ')}</dd>
          </div>
        </dl>
      </section>

      <div className="section-shell" data-reveal>
        <img
          src={project.gallery[0] ?? project.thumbnail}
          alt={t(project.title, locale)}
          className="aspect-[16/9] w-full border border-white/10 object-cover"
        />
      </div>

      {project.video && (
        <section className="section-shell py-14" data-reveal>
          <video controls poster={project.video.poster} className="w-full border border-white/10">
            <source src={project.video.mp4} type="video/mp4" />
          </video>
        </section>
      )}

      {project.gallery.length > 1 && (
        <section className="section-shell py-14 md:py-20">
          <div className="grid gap-4 md:grid-cols-2">
            {project.gallery.slice(1).map((src, i) => (
              <figure key={src} className="overflow-hidden border border-white/10 bg-ink-800" data-reveal>
                <img src={src} alt={`${t(project.title, locale)} — ${i + 2}`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="section-shell py-20">
        <Link to={`/projects/${next.slug}`} className="group block border-t border-white/10 pt-8" data-reveal>
          <p className="eyebrow">{content.projectsPage.next}</p>
          <div className="mt-4 flex items-center justify-between gap-6">
            <h2 className="font-display text-3xl uppercase text-bone transition-colors group-hover:text-crimson md:text-5xl">
              {t(next.title, locale)}
            </h2>
            <ArrowUpRight className="h-8 w-8 shrink-0 text-crimson transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
        </Link>
      </section>
    </div>
  )
}
