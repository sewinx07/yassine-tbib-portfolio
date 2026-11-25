# Yassine Tbib — Portfolio

Premium dark editorial portfolio built with React 18, Vite 5, TypeScript, Tailwind CSS, Three.js (`@react-three/fiber` / `drei`), GSAP + ScrollTrigger and Lenis.

French is the default language; the English translation is complete. The content layer is typed for a future Arabic RTL locale. Content is edited in a Git-backed Decap CMS admin and injected into the static build at compile time.

## Run locally

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Typecheck only:

```bash
npm run typecheck
```

## Source of truth

Editorial content lives in [`content/`](content) as bilingual JSON (`{ fr, en, ar? }`). [`src/data/content.ts`](src/data/content.ts) remains the original typed source and automatic fallback, but the site consumes the typed loader in [`src/lib/content.ts`](src/lib/content.ts). Nothing on the site is invented:

- biography, education, experience, skills and languages come from `CV Professionnel Moderne Gris (1).pdf`;
- project facts come from the local folders `projeyat/`, `kelma-216-main/`, `mon_projet/` and the PDF reports inside them;
- the date of birth in the original CV is **never rendered**. The downloadable PDF at `public/assets/cv-yassine-tbib.pdf` is a redacted copy; the original file is untouched.

Descriptions and role wording were inferred from filenames, README files and reports. They are marked with `todo: true` in the data model and with a `TODO: confirm` badge in development builds only.

`npm run build` validates every JSON file with Zod at build time (no validation library in the public bundle), regenerates `public/admin/config.yml`, `public/sitemap.xml` and `index.html`, then builds the site. Draft projects are included only in development and Vercel preview builds.

## Asset pipeline

Generated assets are committed in `public/assets/`. The originals are never modified and are excluded from git.

| Asset | Origin |
|---|---|
| `portrait/portrait.webp`, `portrait-depth.webp` | new source photo processed by `npm run portrait -- <path>` (rembg cutout + MiDaS depth), 1196 × 1596, same framing as the original cutout |
| `hero-og.jpg` | recomposed from the current cutout over the dark/crimson background |
| `projects/kelma-*.webp` | 4 real KELMA 216 Android screenshots |
| `projects/aljazira-*.webp` | pages from the 16-page AL Jazira brand charter PDF |
| `projects/jazira-3d-*.webp` | real frames from `YASSINNEE.mp4` (1920 × 1080, 60 fps, 60 s) |
| `video/jazira-preview.*` | short optimized preview of the same render (H.264 + VP9) |
| `projects/rajah-*.webp` | real mockups from the graphic-design internship report |
| `projects/logo-*.webp`, `affiche.webp` | embedded previews from the Illustrator files |
| `projects/photo-retouch.webp`, `gabes-city.webp` | pages from the photography report |
| `projects/motion-placeholder.webp` | generated placeholder — the 10 After Effects projects have no exported renders yet |
| `cv-yassine-tbib.pdf` | redacted copy of the CV (DOB removed) |

### Replacing the hero portrait

```bash
# Python 3 with: pip install rembg onnxruntime pillow numpy opencv-python scipy
npm run portrait -- new-img.png
```

The script removes the background (rembg / `isnet-general-use` by default), aligns the head to the existing cutout's framing, despills and grades the edges, generates a MiDaS depth map, writes WebP + AVIF variants at 1x/2x, and recomposes `hero-og.jpg`. Only the canonical WebP files and the OG image are committed; the extra variants are gitignored because the current markup has no `<picture>`/`srcset` usage. Previous published files are copied to `public/assets/_archive/` before being replaced; the source photo is never modified. First run downloads the models (~180 MB rembg + ~64 MB MiDaS) into the user cache; later runs are offline. Override the rembg model with `PORTRAIT_REMBG_MODEL` if needed. The public path is centralised in `content/settings.json` → `hero_portrait` (also editable in the CMS).

## Content admin

The editorial panel is a standalone static page at `/admin`. It loads Decap CMS from a CDN and shares **zero** code or bundle weight with the public React app. GitHub is the backend with editorial workflow: a save opens a draft PR, publishing merges it to `main`, and Vercel builds each PR as a preview deployment.

```bash
# First migration (already done; only needed if content.ts changed)
npm run migrate:content

# Local admin with the local Git backend (no OAuth needed)
npm run cms:local
# then open http://localhost:5173/admin/

# Regenerate the production admin config/sitemap/index from env vars
npm run prepare:admin
```

Copy `.env.example` to `.env.local` for local checks. Required build/deploy variables are `SITE_URL`, `GITHUB_REPO`, `OAUTH_GITHUB_CLIENT_ID`, `OAUTH_GITHUB_CLIENT_SECRET`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`; `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are optional. Secrets are used only by `api/*` functions and are never written to `dist/`.

Edit [`admin/config.template.yml`](admin/config.template.yml), never the generated `public/admin/config.yml`. The French editor guide is in [`ADMIN_GUIDE.md`](ADMIN_GUIDE.md); deployment and OAuth setup are in [`DEPLOY.md`](DEPLOY.md).

## Structure

```
content/                 canonical bilingual JSON for the CMS
admin/config.template.yml  editable Decap schema (FR labels and hints)
api/                     Vercel functions: OAuth proxy + contact delivery
scripts/                 content migration, validation and file generation
src/
  data/content.ts        original typed source + build-time fallback
  lib/content.ts         typed build-time loader used by the site
  i18n/                  language provider (FR default, EN, AR-ready RTL)
  hooks/                 reduced motion, pointer, Lenis/GSAP reveal system
  three/                 lazy-loaded R3F scenes (hero crystal, contact object)
  components/            nav, footer, loader, cursor, cards, shared UI
  sections/              home page sections
  pages/                 home, archive, project detail, 404
public/admin/            generated config.yml + standalone Decap entry
public/assets/           optimized WebP/AVIF-ready exports
```

## Behaviour and accessibility

- `prefers-reduced-motion` disables Lenis, the loader, the custom cursor, the reveal tweens and 3D rotation.
- Keyboard: skip link, focus-visible outlines, arrow-key navigation in the 3D Lab carousel.
- DPR capped at 1.5; Three.js and GSAP/Lenis are split into separate chunks and the 3D scenes are lazy-loaded.
- Layouts checked conceptually at 375 / 768 / 1280 / 1920 px.

## Deployment

Deploy on Vercel with Node 26 (`.nvmrc`). `vercel.json` rewrites unknown paths to `index.html` while excluding `/admin/*`, `/api/*` and static assets, and sets security headers plus cache rules. See [`DEPLOY.md`](DEPLOY.md) for the OAuth app, Resend, optional Upstash and preview/rollback workflow. Confirm the final `og:image` URL and social links before going live — see [`TODO.md`](TODO.md).

Vercel Web Analytics is dynamically imported in production only. Speed Insights is intentionally optional and not enabled by default.

## Known TODOs

See [`TODO.md`](TODO.md). The most important ones are a high-resolution portrait, the After Effects renders, verified social/live links and approval of the quote panel copy.
