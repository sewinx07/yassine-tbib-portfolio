import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Sparkle } from './Sparkle'
import { useLanguage } from '../i18n/LanguageContext'

const sections = [
  { id: 'top', key: 'home' },
  { id: 'projects', key: 'projects' },
  { id: 'lab', key: 'lab' },
  { id: 'about', key: 'about' },
  { id: 'contact', key: 'contact' },
] as const

export default function Nav() {
  const { content, locale, toggle } = useLanguage()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [location])

  const isHome = location.pathname === '/'

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/10 bg-ink/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="section-shell flex h-14 items-center justify-between border-b border-white/10">
        <Link
          to="/"
          className="group flex items-center gap-3 text-[10px] font-semibold uppercase tracking-editorial text-bone-dim transition-colors hover:text-bone md:text-[11px]"
        >
          <Sparkle className="h-3.5 w-3.5 text-crimson transition-transform duration-500 group-hover:rotate-90" />
          {content.topbar.role}
        </Link>

        <div className="flex items-center gap-3 md:gap-6">
          <span className="hidden items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-bone-dim sm:inline-flex md:text-[10px]">
            <Sparkle className="h-3 w-3 text-crimson" />
            {content.topbar.availability}
          </span>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-11 min-w-[3rem] items-center justify-center rounded-full border border-white/15 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-bone transition-colors hover:border-crimson"
            aria-label={locale === 'fr' ? 'Switch to English' : 'Passer en français'}
          >
            {locale === 'fr' ? 'EN' : 'FR'}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="icon-button md:hidden"
            aria-expanded={open}
            aria-label={open ? content.topbar.close : content.topbar.menu}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <nav
        className={`section-shell hidden items-center justify-end gap-9 py-5 md:flex ${open ? '' : ''}`}
        aria-label="Primary"
      >
        {sections.map(({ id, key }) => (
          <Link
            key={id}
            to={{ pathname: '/', hash: `#${id}` }}
            className={`relative text-[10px] font-semibold uppercase tracking-editorial transition-colors hover:text-crimson ${
              isHome ? 'text-bone-dim' : 'text-bone'
            }`}
          >
            {content.nav[key]}
          </Link>
        ))}
        <Link
          to="/projects"
          className="ml-2 text-[10px] font-semibold uppercase tracking-editorial text-crimson"
        >
          ↗
        </Link>
      </nav>

      {open && (
        <nav className="section-shell flex flex-col gap-1 border-b border-white/10 bg-ink py-6 md:hidden" aria-label="Mobile">
          {sections.map(({ id, key }) => (
            <Link
              key={id}
              to={{ pathname: '/', hash: `#${id}` }}
              className="border-b border-white/5 py-3 font-display text-2xl uppercase tracking-wide text-bone"
            >
              {content.nav[key]}
            </Link>
          ))}
          <Link to="/projects" className="border-b border-white/5 py-3 font-display text-2xl uppercase text-crimson">
            {content.nav.projects} ↗
          </Link>
        </nav>
      )}
    </header>
  )
}
