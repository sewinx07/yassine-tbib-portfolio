# Yassine Tbib — Portfolio

Premium dark editorial portfolio built with React 18, Vite 5, TypeScript, Tailwind CSS, Three.js (`@react-three/fiber` / `drei`), GSAP + ScrollTrigger and Lenis.

French is the default language; the English translation is complete. The content layer is typed for a future Arabic RTL locale.

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

All copy lives in [`src/data/content.ts`](src/data/content.ts). Nothing on the site is invented:

- biography, education, experience, skills and languages come from `CV Professionnel Moderne Gris (1).pdf`;
- project facts come from the local folders `projeyat/`, `kelma-216-main/`, `mon_projet/` and the PDF reports inside them;
- the date of birth in the original CV is **never rendered**. The downloadable PDF at `public/assets/cv-yassine-tbib.pdf` is a redacted copy; the original file is untouched.

Descriptions and role wording were inferred from filenames, README files and reports. They are marked with `todo: true` in the data model and with a `TODO: confirm` badge in development builds only.

## Asset pipeline

Generated assets are committed in `public/assets/`. The originals are never modified and are excluded from git.

| Asset | Origin |
|---|---|
| `portrait/portrait.webp`, `portrait-depth.webp` | `WhatsApp Image 2026-06-30 at 10.43.27.jpeg` (verified as the same photo as the CV portrait), background removed with rembg, upscaled to 1196 × 1596, depth map derived from the cutout alpha |
| `hero-og.jpg` | composed from the cutout portrait and the palette |
| `projects/kelma-*.webp` | 4 real KELMA 216 Android screenshots |
| `projects/aljazira-*.webp` | pages from the 16-page AL Jazira brand charter PDF |
| `projects/jazira-3d-*.webp` | real frames from `YASSINNEE.mp4` (1920 × 1080, 60 fps, 60 s) |
| `video/jazira-preview.*` | short optimized preview of the same render (H.264 + VP9) |
| `projects/rajah-*.webp` | real mockups from the graphic-design internship report |
| `projects/logo-*.webp`, `affiche.webp` | embedded previews from the Illustrator files |
| `projects/photo-retouch.webp`, `gabes-city.webp` | pages from the photography report |
| `projects/motion-placeholder.webp` | generated placeholder — the 10 After Effects projects have no exported renders yet |
| `cv-yassine-tbib.pdf` | redacted copy of the CV (DOB removed) |

## Structure

```
src/
  data/content.ts        all bilingual copy, projects, timelines, skills, contact
  i18n/                  language provider (FR default, EN, AR-ready RTL)
  hooks/                 reduced motion, pointer, Lenis/GSAP reveal system
  three/                 lazy-loaded R3F scenes (hero crystal, contact object)
  components/            nav, footer, loader, cursor, cards, shared UI
  sections/              home page sections
  pages/                 home, archive, project detail, 404
public/assets/           optimized WebP/AVIF-ready exports
```

## Behaviour and accessibility

- `prefers-reduced-motion` disables Lenis, the loader, the custom cursor, the reveal tweens and 3D rotation.
- Keyboard: skip link, focus-visible outlines, arrow-key navigation in the 3D Lab carousel.
- DPR capped at 1.5; Three.js and GSAP/Lenis are split into separate chunks and the 3D scenes are lazy-loaded.
- Layouts checked conceptually at 375 / 768 / 1280 / 1920 px.

## Deployment

`vercel.json` and `public/_redirects` rewrite unknown paths to `index.html` for client-side routing. Set the final `og:image` absolute URL and confirm social links before going live — see [`TODO.md`](TODO.md).

## Known TODOs

See [`TODO.md`](TODO.md). The most important ones are a high-resolution portrait, the After Effects renders, verified social/live links and approval of the quote panel copy.
