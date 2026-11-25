/**
 * Generates build-time public files from editable sources:
 *   - public/admin/config.yml from admin/config.template.yml
 *   - public/sitemap.xml from canonical project content
 *   - index.html from index.template.html + content/settings.json
 *
 * No secret is ever written to a public file. Set SITE_URL and GITHUB_REPO in
 * the build environment; placeholders are used locally.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const local = process.argv.includes('--local')
const env = process.env

function cleanUrl(value) {
  return value.replace(/\/+$/, '')
}

function siteUrl() {
  if (env.SITE_URL) return cleanUrl(env.SITE_URL)
  if (!local) return 'https://yassine-tbib-portfolio.vercel.app'
  return 'http://localhost:5173'
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

async function generateAdmin(url) {
  const template = await readFile(path.join(root, 'admin/config.template.yml'), 'utf8')
  const config = template
    .replaceAll('__LOCAL_BACKEND__', local ? 'local_backend: true\n' : '')
    .replaceAll('__BASE_URL__', url)
    .replaceAll('__GITHUB_REPO__', env.GITHUB_REPO || 'sewinx07/yassine-tbib-portfolio')

  await mkdir(path.join(root, 'public/admin'), { recursive: true })
  await writeFile(path.join(root, 'public/admin/config.yml'), config, 'utf8')
}

async function generateSitemap(url) {
  const projectDir = path.join(root, 'content/projects')
  const files = (await readdir(projectDir)).filter((file) => file.endsWith('.json'))
  const slugs = []
  for (const file of files) {
    const project = JSON.parse(await readFile(path.join(projectDir, file), 'utf8'))
    if (!project.draft) slugs.push(file.replace(/\.json$/, ''))
  }
  slugs.sort()

  const urls = ['/', '/projects', ...slugs.map((slug) => `/projects/${slug}`)]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((route) => `  <url><loc>${escapeHtml(url + route)}</loc></url>`)
    .join('\n')}\n</urlset>\n`
  await writeFile(path.join(root, 'public/sitemap.xml'), xml, 'utf8')
}

async function generateIndex() {
  const settings = JSON.parse(await readFile(path.join(root, 'content/settings.json'), 'utf8'))
  const template = await readFile(path.join(root, 'index.template.html'), 'utf8')
  const values = {
    DEFAULT_LANG: settings.defaultLanguage || 'fr',
    SITE_TITLE: settings.seo.ogTitle.fr,
    SITE_DESCRIPTION: settings.seo.description.fr,
    OG_TITLE: settings.seo.ogTitle.fr,
    OG_DESCRIPTION: settings.seo.ogDescription.fr,
    OG_IMAGE: settings.seo.ogImage,
    CONTACT_EMAIL: settings.contact.email,
  }
  const html = template.replace(/__([A-Z_]+)__/g, (match, key) =>
    key in values ? escapeHtml(values[key]) : match,
  )
  await writeFile(path.join(root, 'index.html'), html, 'utf8')
}

const url = siteUrl()
if (!local && !env.SITE_URL && !env.VERCEL_URL) {
  console.warn(`[site] SITE_URL is not set — generated files use ${url}. Set it before deploying.`)
}
await generateAdmin(url)
await generateSitemap(url)
await generateIndex()
console.log(`[site] Generated admin config, sitemap and index.html for ${url}${local ? ' (local backend)' : ''}.`)
