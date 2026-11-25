/**
 * Build-time content preparation.
 *
 * 1. On first run (or with --migrate/--force), generates /content JSON files
 *    from the existing src/data/content.ts so nothing is lost.
 * 2. On every run, writes src/data/fallbacks.generated.ts containing ONLY the
 *    values present in content.ts but missing from a content file. This keeps
 *    the original data as a typed fallback without shipping two full copies.
 *
 * Never overwrite editor content unless --force is passed.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import esbuild from 'esbuild'
import { validateContent } from './validate-content.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const force = process.argv.includes('--force') || process.argv.includes('--migrate')
const localeKeys = ['fr', 'en']

const loc = (fr, en) => ({ fr, en })

function pick(source, keys) {
  return Object.fromEntries(keys.map((key) => [key, source[key]]))
}

function localizeValue(frValue, enValue) {
  if (typeof frValue === 'string') return loc(frValue, enValue ?? frValue)
  if (Array.isArray(frValue)) return frValue.map((value, i) => localizeValue(value, enValue?.[i]))
  if (frValue && typeof frValue === 'object') {
    return Object.fromEntries(
      Object.keys(frValue).map((key) => [key, localizeValue(frValue[key], enValue?.[key])]),
    )
  }
  return loc(frValue, enValue)
}

function localizeSubset(frSource, enSource, keys) {
  return localizeValue(pick(frSource, keys), pick(enSource, keys))
}

function mapTimeline(item) {
  return {
    period: item.period,
    title: loc(item.title.fr, item.title.en),
    place: item.place,
    detail: loc(item.detail.fr, item.detail.en),
  }
}

async function exists(relativePath) {
  try {
    await access(path.join(root, relativePath))
    return true
  } catch {
    return false
  }
}

async function loadSourceData() {
  const sourcePath = path.join(root, 'src/data/content.ts')
  const source = await readFile(sourcePath, 'utf8')
  const { code } = await esbuild.transform(source, { loader: 'ts', format: 'esm', target: 'es2020' })
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  return import(moduleUrl)
}

function buildDefaultsTree(data) {
  const heroKeys = ['greeting', 'firstName', 'lastName', 'title', 'bio', 'word', 'tagline', 'scroll', 'location', 'statsLabel']
  const topbarKeys = ['role', 'availability', 'menu', 'close']
  const sectionKeys = ['selected', 'lab', 'education', 'experience', 'process', 'contact']
  const metaKeys = ['description', 'ogTitle', 'ogDescription']
  const copyKeys = ['nav', 'projectsPage', 'footer', 'notFound', 'todoBadge']

  const settings = {
    defaultLanguage: 'fr',
    hero: localizeSubset(data.i18n.fr.hero, data.i18n.en.hero, heroKeys),
    topbar: {
      ...localizeSubset(data.i18n.fr.topbar, data.i18n.en.topbar, topbarKeys),
      availabilityEnabled: true,
    },
    sections: localizeSubset(data.i18n.fr.sections, data.i18n.en.sections, sectionKeys),
    contact: {
      email: data.contact.email,
      phone: data.contact.phone,
      location: data.contact.location,
      cv: data.contact.cv,
      socialLinks: [],
    },
    seo: {
      ...localizeSubset(data.i18n.fr.meta, data.i18n.en.meta, metaKeys),
      ogImage: '/assets/hero-og.jpg',
    },
  }

  const copy = Object.fromEntries(
    localeKeys.map((locale) => [locale, pick(data.i18n[locale], copyKeys)]),
  )

  const quote = localizeSubset(data.i18n.fr.sections.quote, data.i18n.en.sections.quote, [
    'eyebrow',
    'text',
    'signature',
  ])

  const projects = data.projects.map((project, index) => ({
    ...project,
    featuredOrder: project.featured ? index + 1 : 0,
    sortOrder: index + 1,
    draft: false,
    videoUrl: '',
    glb: '',
    liveUrl: project.liveUrl ?? '',
  }))

  const skills = {
    groups: data.skillGroups.map((group) => ({
      label: loc(group.label.fr, group.label.en),
      items: group.items,
    })),
  }

  const education = {
    items: data.education.map(mapTimeline),
    trainings: data.trainings.map(mapTimeline),
  }

  const experience = { items: data.experience.map(mapTimeline) }

  const languages = {
    items: data.languages.map((language) => ({
      name: loc(language.name.fr, language.name.en),
      level: loc(language.level.fr, language.level.en),
      value: language.value,
    })),
  }

  const stats = { items: data.stats.map((stat) => ({ ...stat })) }

  const process = {
    items: data.processSteps.map((step) => ({
      number: step.number,
      icon: step.icon,
      title: loc(step.title.fr, step.title.en),
      detail: loc(step.detail.fr, step.detail.en),
    })),
  }

  const files = {
    'settings.json': settings,
    'copy/fr.json': copy.fr,
    'copy/en.json': copy.en,
    'quote.json': quote,
    'skills.json': skills,
    'education.json': education,
    'experience.json': experience,
    'languages.json': languages,
    'stats.json': stats,
    'process.json': process,
  }

  for (const project of projects) {
    files[`projects/${project.slug}.json`] = project
  }

  return { files, projects }
}

function fileKey(relativePath) {
  if (relativePath === 'settings.json') return 'settings'
  if (relativePath === 'copy/fr.json') return 'copyFr'
  if (relativePath === 'copy/en.json') return 'copyEn'
  if (relativePath === 'quote.json') return 'quote'
  if (relativePath === 'skills.json') return 'skills'
  if (relativePath === 'education.json') return 'education'
  if (relativePath === 'experience.json') return 'experience'
  if (relativePath === 'languages.json') return 'languages'
  if (relativePath === 'stats.json') return 'stats'
  if (relativePath === 'process.json') return 'process'
  const match = relativePath.match(/^projects\/(.+)\.json$/)
  return match ? `project:${match[1]}` : null
}

/** Return only the parts of `defaults` that are absent from `actual`. */
function missingFromActual(defaults, actual) {
  if (actual === undefined || actual === null) return defaults
  if (Array.isArray(defaults)) return undefined
  if (defaults === null || typeof defaults !== 'object') return undefined
  if (Array.isArray(actual) || typeof actual !== 'object') return undefined

  const missing = {}
  for (const [key, value] of Object.entries(defaults)) {
    const entry = missingFromActual(value, actual[key])
    if (entry !== undefined) missing[key] = entry
  }
  return Object.keys(missing).length ? missing : undefined
}

async function main() {
  const data = await loadSourceData()
  const { files } = buildDefaultsTree(data)

  for (const [relativePath, content] of Object.entries(files)) {
    const target = path.join(root, 'content', relativePath)
    await mkdir(path.dirname(target), { recursive: true })
    if (force || !(await exists(path.join('content', relativePath)))) {
      await writeFile(target, `${JSON.stringify(content, null, 2)}\n`, 'utf8')
    }
  }

  const fallbackTree = {}
  const fallbackByPath = {}
  for (const [relativePath, defaults] of Object.entries(files)) {
    const key = fileKey(relativePath)
    if (!key) continue
    const target = path.join(root, 'content', relativePath)
    let actual
    try {
      actual = JSON.parse(await readFile(target, 'utf8'))
    } catch (error) {
      throw new Error(`[content] Invalid JSON in content/${relativePath}: ${error.message}`)
    }
    const missing = missingFromActual(defaults, actual)
    if (missing !== undefined) {
      fallbackTree[key] = missing
      fallbackByPath[relativePath] = missing
    }
  }

  await validateContent(root, fallbackByPath)

  await writeFile(
    path.join(root, 'src/data/fallbacks.generated.ts'),
    `// Generated by scripts/prepare-content.mjs — do not edit by hand.\nexport const fallback: Record<string, unknown> = ${JSON.stringify(fallbackTree, null, 2)}\n`,
    'utf8',
  )

  console.log(`[content] ${Object.keys(files).length} files verified, ${Object.keys(fallbackTree).length} fallback entries generated.`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
