import { useLanguage } from '../i18n/LanguageContext'

/** Visible only in development so nothing TODO ships to production. */
export default function TodoBadge({ label }: { label?: string }) {
  const { content } = useLanguage()
  if (!import.meta.env.DEV) return null
  return (
    <span
      className="ml-3 inline-flex items-center rounded-full border border-crimson/50 bg-crimson/10 px-2.5 py-1 align-middle text-[9px] font-bold uppercase tracking-[0.16em] text-crimson-bright"
      title={label}
    >
      {content.todoBadge}
    </span>
  )
}
