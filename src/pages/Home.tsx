import { useRef } from 'react'
import Hero from '../sections/Hero'
import SelectedProjects from '../sections/SelectedProjects'
import Lab3D from '../sections/Lab3D'
import Education from '../sections/Education'
import Experience from '../sections/Experience'
import Process from '../sections/Process'
import QuotePanel from '../sections/QuotePanel'
import Contact from '../sections/Contact'
import { useReveal } from '../hooks/useMotionSystem'
import { useLanguage } from '../i18n/LanguageContext'

export default function Home() {
  const scope = useRef<HTMLDivElement>(null)
  const { locale } = useLanguage()
  useReveal(scope, locale)

  return (
    <div ref={scope}>
      <Hero />
      <SelectedProjects />
      <Lab3D />
      <Education />
      <Experience />
      <Process />
      <QuotePanel />
      <Contact />
    </div>
  )
}
