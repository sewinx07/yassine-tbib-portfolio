import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { i18n, localeContent, type Locale, type LocaleContent } from '../data/content'

interface LanguageContextValue {
  locale: Locale
  content: LocaleContent
  dir: 'ltr' | 'rtl'
  setLocale: (locale: Locale) => void
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'ytb-locale'
const SUPPORTED: Locale[] = ['fr', 'en', 'ar']

function initialLocale(): Locale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang') as Locale | null
  if (fromUrl && SUPPORTED.includes(fromUrl)) return fromUrl
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null
  if (stored && SUPPORTED.includes(stored)) return stored
  return 'fr' // French is the default.
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = locale === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem(STORAGE_KEY, locale)

    const current = i18n[locale === 'fr' ? 'fr' : 'en']
    document.title = `${current.meta.ogTitle}`
    document.querySelector('meta[name="description"]')?.setAttribute('content', current.meta.description)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', current.meta.ogDescription)
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', locale === 'fr' ? 'fr_FR' : 'en_US')
  }, [locale])

  const setLocale = useCallback((next: Locale) => setLocaleState(next), [])
  const toggle = useCallback(() => setLocaleState((l) => (l === 'fr' ? 'en' : 'fr')), [])

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      content: localeContent(locale),
      dir: locale === 'ar' ? 'rtl' : 'ltr',
      setLocale,
      toggle,
    }),
    [locale, setLocale, toggle],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider')
  return ctx
}
