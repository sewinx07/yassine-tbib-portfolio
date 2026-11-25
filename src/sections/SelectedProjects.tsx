import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import { projects } from '../data/content'
import { useLanguage } from '../i18n/LanguageContext'
import Magnetic from '../components/Magnetic'

export default function SelectedProjects() {
  const { content } = useLanguage()
  const featured = projects.filter((p) => p.featured)

  return (
    <section id="projects" className="section-shell scroll-mt-24 py-24 md:py-36">
      <SectionHeading
        eyebrow={content.sections.selected.eyebrow}
        title={content.sections.selected.title}
        note={content.sections.selected.note}
        action={
          <Magnetic>
            <Link to="/projects" className="link-underline">
              {content.sections.selected.viewAll}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Magnetic>
        }
      />
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {featured.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            className={i === 1 ? 'md:mt-16 lg:mt-20' : i === 2 ? 'md:mt-8 lg:mt-10' : ''}
          />
        ))}
      </div>
    </section>
  )
}
