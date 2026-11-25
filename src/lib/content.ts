/**
 * Typed, build-time content loader.
 *
 * Content is read from /content with Vite's import.meta.glob (eager), validated
 * by scripts/validate-content.mjs during `npm run build`, and merged with the
 * generated fallback from the original src/data/content.ts. The public site
 * makes zero runtime content requests and ships no validation library.
 */
import type {
  Locale,
  Localized,
  LocaleContent,
  ProcessStep,
  Project,
  SkillGroup,
  TimelineItem,
} from '../data/content'
import { fallback } from '../data/fallbacks.generated'

declare const __VERCEL_ENV__: string

type LocalizedMap<K extends string> = Record<K, Localized>

type HeroSettings = LocalizedMap<
  'greeting' | 'firstName' | 'lastName' | 'title' | 'bio' | 'word' | 'tagline' | 'scroll' | 'location'
> & { statsLabel: [Localized, Localized, Localized] }

type ContactSection = LocalizedMap<
  | 'eyebrow'
  | 'title'
  | 'intro'
  | 'email'
  | 'phone'
  | 'location'
  | 'formName'
  | 'formEmail'
  | 'formMessage'
  | 'formSend'
  | 'formNote'
  | 'formSending'
  | 'formSuccess'
  | 'formError'
  | 'formFallback'
  | 'download'
  | 'socialTitle'
  | 'socialNote'
  | 'beyond'
  | 'beyondDetail'
>

type Settings = {
  defaultLanguage: Locale
  hero: HeroSettings
  topbar: LocalizedMap<'role' | 'availability' | 'menu' | 'close'> & { availabilityEnabled: boolean }
  sections: {
    selected: LocalizedMap<'eyebrow' | 'title' | 'viewAll' | 'note'>
    lab: LocalizedMap<'eyebrow' | 'title' | 'description' | 'drag' | 'frames'>
    education: LocalizedMap<'eyebrow' | 'title' | 'timeline' | 'training'>
    experience: LocalizedMap<'eyebrow' | 'title' | 'note'>
    process: LocalizedMap<'eyebrow' | 'title'>
    contact: ContactSection
  }
  contact: {
    email: string
    phone: string
    location: string
    cv: string
    socialLinks: { label: string; url: string }[]
  }
  seo: LocalizedMap<'description' | 'ogTitle' | 'ogDescription'> & { ogImage: string }
}

type Copy = {
  nav: { home: string; projects: string; lab: string; about: string; contact: string }
  projectsPage: {
    eyebrow: string
    title: string
    intro: string
    filters: Record<'all' | 'graphic' | 'motion' | '3d' | 'xr' | 'web', string>
    count: string
    empty: string
    back: string
    tools: string
    year: string
    role: string
    next: string
  }
  footer: { made: string; rights: string; top: string }
  notFound: { title: string; text: string; back: string }
  todoBadge: string
}

type Quote = LocalizedMap<'eyebrow' | 'text' | 'signature'>
type ProjectFile = Project & {
  featuredOrder: number
  sortOrder: number
  draft: boolean
  videoUrl: string
  glb: string
  liveUrl: string
}

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeDeep<T>(base: T, override: T): T {
  if (Array.isArray(override) || !isRecord(base) || !isRecord(override)) return override
  const merged: UnknownRecord = { ...base }
  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in base ? mergeDeep((base as UnknownRecord)[key], value) : value
  }
  return merged as T
}

const globbed = import.meta.glob('../../content/**/*.json', { eager: true, import: 'default' }) as Record<
  string,
  unknown
>

function keyForFile(file: string): string | null {
  const normalized = file.replace(/^\.\.\/\.\.\/content\//, '')
  if (normalized === 'settings.json') return 'settings'
  if (normalized === 'copy/fr.json') return 'copyFr'
  if (normalized === 'copy/en.json') return 'copyEn'
  if (normalized === 'quote.json') return 'quote'
  if (normalized === 'skills.json') return 'skills'
  if (normalized === 'education.json') return 'education'
  if (normalized === 'experience.json') return 'experience'
  if (normalized === 'languages.json') return 'languages'
  if (normalized === 'stats.json') return 'stats'
  if (normalized === 'process.json') return 'process'
  const project = normalized.match(/^projects\/(.+)\.json$/)
  return project ? `project:${project[1]}` : null
}

const files: Record<string, unknown> = { ...(fallback as Record<string, unknown>) }
for (const [file, value] of Object.entries(globbed)) {
  const key = keyForFile(file)
  if (!key) throw new Error(`[content] Unexpected content file: ${file}`)
  files[key] = mergeDeep(files[key] as never, value as never)
}

const settings = files.settings as Settings
const copyFr = files.copyFr as Copy
const copyEn = files.copyEn as Copy
const quote = files.quote as Quote
const skillsContent = files.skills as { groups: SkillGroup[] }
const educationContent = files.education as { items: TimelineItem[]; trainings: TimelineItem[] }
const experienceContent = files.experience as { items: TimelineItem[] }
const languagesContent = files.languages as { items: { name: Localized; level: Localized; value: number }[] }
const statsContent = files.stats as { items: { value: number; labelIndex: number }[] }
const processContent = files.process as { items: ProcessStep[] }

const projectFiles: ProjectFile[] = Object.entries(files)
  .filter(([key]) => key.startsWith('project:'))
  .map(([key, value]) => ({
    slug: key.slice('project:'.length),
    ...(value as UnknownRecord),
  })) as ProjectFile[]

projectFiles.sort((a, b) => a.sortOrder - b.sortOrder)

const includeDrafts = import.meta.env.DEV || __VERCEL_ENV__ === 'preview'
const visibleFiles = includeDrafts ? projectFiles : projectFiles.filter((p) => !p.draft)
export const projects: Project[] = visibleFiles as Project[]
const featuredFiles = visibleFiles
  .filter((project) => project.featured)
  .sort((a, b) => a.featuredOrder - b.featuredOrder || a.sortOrder - b.sortOrder)
export const featuredProjects: Project[] = featuredFiles as Project[]

if (featuredProjects.length > 3) {
  console.warn(`[content] ${featuredProjects.length} projects are featured — keep 3 or fewer.`)
}

function localize(value: Localized, locale: Locale): string {
  if (locale === 'fr') return value.fr
  return value.ar ?? value.en
}

function localizeRecord<T extends Record<string, Localized>>(record: T, locale: Locale) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, localize(value, locale)]),
  ) as { [K in keyof T]: string }
}

export function t(value: Localized, locale: Locale): string {
  return localize(value, locale)
}

export function localeContent(locale: Locale): LocaleContent {
  const language = locale === 'fr' ? 'fr' : 'en'
  const copy = language === 'fr' ? copyFr : copyEn
  const s = settings.sections
  const h = settings.hero

  return {
    meta: {
      description: localize(settings.seo.description, language),
      ogTitle: localize(settings.seo.ogTitle, language),
      ogDescription: localize(settings.seo.ogDescription, language),
    },
    nav: copy.nav,
    topbar: {
      role: localize(settings.topbar.role, language),
      availability: localize(settings.topbar.availability, language),
      menu: localize(settings.topbar.menu, language),
      close: localize(settings.topbar.close, language),
    },
    hero: {
      greeting: localize(h.greeting, language),
      firstName: localize(h.firstName, language),
      lastName: localize(h.lastName, language),
      title: localize(h.title, language),
      bio: localize(h.bio, language),
      word: localize(h.word, language),
      tagline: localize(h.tagline, language),
      scroll: localize(h.scroll, language),
      location: localize(h.location, language),
      statsLabel: [
        localize(h.statsLabel[0], language),
        localize(h.statsLabel[1], language),
        localize(h.statsLabel[2], language),
      ],
    },
    sections: {
      selected: localizeRecord(s.selected, language),
      lab: localizeRecord(s.lab, language),
      education: localizeRecord(s.education, language),
      experience: localizeRecord(s.experience, language),
      process: localizeRecord(s.process, language),
      quote: localizeRecord(quote, language),
      contact: localizeRecord(s.contact, language),
    },
    projectsPage: copy.projectsPage,
    footer: copy.footer,
    notFound: copy.notFound,
    todoBadge: copy.todoBadge,
  }
}

export const i18n: Record<'fr' | 'en', LocaleContent> = {
  fr: localeContent('fr'),
  en: localeContent('en'),
}

export const defaultLanguage: Locale = settings.defaultLanguage
export const availabilityEnabled = settings.topbar.availabilityEnabled
export const seoImage = settings.seo.ogImage

export const contact = {
  email: settings.contact.email,
  phone: settings.contact.phone,
  phoneHref: `tel:${settings.contact.phone.replace(/[^\d+]/g, '')}`,
  location: settings.contact.location,
  cv: settings.contact.cv,
  socialLinks: settings.contact.socialLinks,
}

export const stats = statsContent.items
export const education: TimelineItem[] = educationContent.items
export const trainings: TimelineItem[] = educationContent.trainings
export const experience: TimelineItem[] = experienceContent.items
export const skillGroups: SkillGroup[] = skillsContent.groups
export const languages = languagesContent.items
export const processSteps: ProcessStep[] = processContent.items

export { todos } from '../data/content'
export type {
  Category,
  Locale,
  Localized,
  LocaleContent,
  ProcessStep,
  Project,
  SkillGroup,
  TimelineItem,
} from '../data/content'
