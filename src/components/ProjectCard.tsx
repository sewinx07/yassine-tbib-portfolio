import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { t, type Project } from '../lib/content'
import { useLanguage } from '../i18n/LanguageContext'
import TodoBadge from './TodoBadge'

export default function ProjectCard({ project, className = '' }: { project: Project; className?: string }) {
  const { content, locale } = useLanguage()

  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`group relative block ${className}`}
      data-reveal
      aria-label={t(project.title, locale)}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ink-800">
        <img
          src={project.thumbnail}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-cinematic group-hover:scale-[1.06] group-hover:filter-none md:grayscale-[35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-40" />
        <span className="absolute left-4 top-4 rounded-full border border-white/25 bg-ink/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-bone backdrop-blur-sm">
          {content.projectsPage.filters[project.category]}
        </span>
        <span className="absolute right-4 top-4 font-display text-2xl text-bone/60">{project.number}</span>
        <span className="absolute bottom-4 right-4 flex h-11 w-11 translate-y-3 items-center justify-center rounded-full bg-crimson text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-5 flex items-start justify-between gap-4 border-t border-white/10 pt-4">
        <div>
          <h3 className="font-display text-2xl uppercase leading-tight tracking-tight text-bone transition-colors group-hover:text-crimson md:text-3xl">
            {t(project.title, locale)}
          </h3>
          <p className="mt-2 max-w-md text-xs leading-relaxed text-bone-dim md:text-sm">
            {t(project.excerpt, locale)}
          </p>
        </div>
        <span className="mt-1 shrink-0 text-[10px] uppercase tracking-widest text-bone-dim">{project.year}</span>
      </div>
      {project.todo && <TodoBadge label="Project description inferred from source files" />}
    </Link>
  )
}
