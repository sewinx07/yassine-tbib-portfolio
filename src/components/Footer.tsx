import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'
import { Sparkle } from './Sparkle'

export default function Footer() {
  const { content } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/10 bg-ink pb-10 pt-12">
      <div className="section-shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Link to="/" className="font-display text-3xl uppercase tracking-tight text-bone md:text-5xl">
            Yassine <span className="text-crimson">Tbib</span>
          </Link>
          <p className="mt-3 max-w-md text-xs leading-relaxed text-bone-dim">
            {content.footer.made} · © {year} {content.footer.rights}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a href="mailto:tbibyassine03@gmail.com" className="link-underline">
            Email ↗
          </a>
          <a href="#top" className="link-underline">
            {content.footer.top} ↑
          </a>
          <Sparkle className="h-4 w-4 text-crimson" />
        </div>
      </div>
    </footer>
  )
}
