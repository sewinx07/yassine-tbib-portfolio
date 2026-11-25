import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export default function NotFound() {
  const { content } = useLanguage()
  return (
    <div className="section-shell flex min-h-[75vh] flex-col items-start justify-center pt-32">
      <p className="eyebrow">404</p>
      <h1 className="display-title mt-5 text-[clamp(4rem,12vw,10rem)] text-bone">{content.notFound.title}</h1>
      <p className="mt-6 text-sm text-bone-dim">{content.notFound.text}</p>
      <Link to="/" className="link-underline mt-10">
        {content.notFound.back} ↗
      </Link>
    </div>
  )
}
