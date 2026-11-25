/** Build-time content validation. Zod never reaches the public bundle. */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

const localized = z.object({ fr: z.string(), en: z.string(), ar: z.string().optional() })
const eyebrowTitle = z.object({ eyebrow: localized, title: localized })
const timeline = z.object({ period: z.string(), title: localized, place: z.string(), detail: localized })

const settingsSchema = z.object({
  defaultLanguage: z.enum(['fr', 'en', 'ar']),
  hero: z.object({
    greeting: localized,
    firstName: localized,
    lastName: localized,
    title: localized,
    bio: localized,
    word: localized,
    tagline: localized,
    scroll: localized,
    location: localized,
    statsLabel: z.tuple([localized, localized, localized]),
  }),
  topbar: z.object({
    role: localized,
    availability: localized,
    menu: localized,
    close: localized,
    availabilityEnabled: z.boolean(),
  }),
  sections: z.object({
    selected: z.object({ ...eyebrowTitle.shape, viewAll: localized, note: localized }),
    lab: z.object({ ...eyebrowTitle.shape, description: localized, drag: localized, frames: localized }),
    education: z.object({ ...eyebrowTitle.shape, timeline: localized, training: localized }),
    experience: z.object({ ...eyebrowTitle.shape, note: localized }),
    process: eyebrowTitle,
    contact: z.object({
      eyebrow: localized,
      title: localized,
      intro: localized,
      email: localized,
      phone: localized,
      location: localized,
      formName: localized,
      formEmail: localized,
      formMessage: localized,
      formSend: localized,
      formNote: localized,
      formSending: localized,
      formSuccess: localized,
      formError: localized,
      formFallback: localized,
      download: localized,
      socialTitle: localized,
      socialNote: localized,
      beyond: localized,
      beyondDetail: localized,
    }),
  }),
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(1),
    location: z.string(),
    cv: z.string(),
    socialLinks: z.array(z.object({ label: z.string(), url: z.string().url() })),
  }),
  seo: z.object({
    description: localized,
    ogTitle: localized,
    ogDescription: localized,
    ogImage: z.string(),
  }),
})

const copySchema = z.object({
  nav: z.object({ home: z.string(), projects: z.string(), lab: z.string(), about: z.string(), contact: z.string() }),
  projectsPage: z.object({
    eyebrow: z.string(),
    title: z.string(),
    intro: z.string(),
    filters: z.object({
      all: z.string(),
      graphic: z.string(),
      motion: z.string(),
      '3d': z.string(),
      xr: z.string(),
      web: z.string(),
    }),
    count: z.string(),
    empty: z.string(),
    back: z.string(),
    tools: z.string(),
    year: z.string(),
    role: z.string(),
    next: z.string(),
  }),
  footer: z.object({ made: z.string(), rights: z.string(), top: z.string() }),
  notFound: z.object({ title: z.string(), text: z.string(), back: z.string() }),
  todoBadge: z.string(),
})

const quoteSchema = z.object({ eyebrow: localized, text: localized, signature: localized })

const projectSchema = z.object({
  slug: z.string().min(1),
  number: z.string(),
  category: z.enum(['graphic', 'motion', '3d', 'xr', 'web']),
  year: z.string(),
  tools: z.array(z.string()),
  role: localized,
  title: localized,
  excerpt: localized,
  description: localized,
  thumbnail: z.string(),
  gallery: z.array(z.string()),
  video: z.object({ webm: z.string(), mp4: z.string(), poster: z.string() }).optional(),
  videoUrl: z.string(),
  glb: z.string(),
  liveUrl: z.string(),
  featured: z.boolean(),
  featuredOrder: z.number().int().nonnegative(),
  sortOrder: z.number().int(),
  draft: z.boolean(),
  todo: z.boolean().optional(),
})

const schemas = {
  'settings.json': settingsSchema,
  'copy/fr.json': copySchema,
  'copy/en.json': copySchema,
  'quote.json': quoteSchema,
  'skills.json': z.object({ groups: z.array(z.object({ label: localized, items: z.array(z.string()) })) }),
  'education.json': z.object({ items: z.array(timeline), trainings: z.array(timeline) }),
  'experience.json': z.object({ items: z.array(timeline) }),
  'languages.json': z.object({
    items: z.array(z.object({ name: localized, level: localized, value: z.number() })),
  }),
  'stats.json': z.object({
    items: z.array(z.object({ value: z.number(), labelIndex: z.number().int().min(0).max(2) })),
  }),
  'process.json': z.object({
    items: z.array(
      z.object({
        number: z.string(),
        icon: z.enum(['briefcase', 'sparkles', 'pen', 'code', 'send']),
        title: localized,
        detail: localized,
      }),
    ),
  }),
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function mergeDeep(base, override) {
  if (Array.isArray(override) || !isRecord(base) || !isRecord(override)) return override
  const merged = { ...base }
  for (const [key, value] of Object.entries(override)) {
    merged[key] = key in base ? mergeDeep(base[key], value) : value
  }
  return merged
}

function formatIssues(label, error) {
  return error.issues
    .map((issue) => `  ${label} → ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n')
}

export async function validateContent(root, fallbacks = {}) {
  const errors = []
  const contentRoot = path.join(root, 'content')

  for (const [relativePath, schema] of Object.entries(schemas)) {
    const file = path.join(contentRoot, relativePath)
    let value
    try {
      const parsedFile = JSON.parse(await readFile(file, 'utf8'))
      value = fallbacks[relativePath] ? mergeDeep(fallbacks[relativePath], parsedFile) : parsedFile
    } catch (error) {
      throw new Error(`[content] Cannot read content/${relativePath}: ${error.message}`)
    }
    const result = schema.safeParse(value)
    if (!result.success) errors.push(formatIssues(`content/${relativePath}`, result.error))
  }

  const projectDir = path.join(contentRoot, 'projects')
  const files = (await readdir(projectDir)).filter((file) => file.endsWith('.json'))
  const featured = []
  for (const file of files) {
    const relativePath = `projects/${file}`
    let value
    try {
      const parsedFile = JSON.parse(await readFile(path.join(projectDir, file), 'utf8'))
      value = fallbacks[relativePath] ? mergeDeep(fallbacks[relativePath], parsedFile) : parsedFile
    } catch (error) {
      throw new Error(`[content] Cannot read content/${relativePath}: ${error.message}`)
    }
    const result = projectSchema.safeParse(value)
    if (!result.success) {
      errors.push(formatIssues(`content/${relativePath}`, result.error))
      continue
    }
    if (value.slug !== file.replace(/\.json$/, '')) {
      errors.push(`  content/${relativePath} → slug: must match the filename ("${file.replace(/\.json$/, '')}")`)
    }
    if (value.featured) featured.push(value.slug)
  }

  if (errors.length) {
    throw new Error(`[content] Validation failed:\n${errors.join('\n')}`)
  }
  if (featured.length > 3) {
    console.warn(`[content] ${featured.length} projects are featured — keep 3 or fewer: ${featured.join(', ')}`)
  }
  return files.length
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
  validateContent(root)
    .then((count) => console.log(`[content] ${count} projects and all files validated.`))
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
