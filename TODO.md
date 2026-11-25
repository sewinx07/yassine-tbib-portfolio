# TODO — before publishing

Everything below is a real gap in the source material, not an oversight. Development builds show a small `TODO: confirm` badge on affected cards.

## Blocked by missing media

1. **High-resolution portrait.** Current asset is a 598 × 798 WhatsApp image (same photo as the CV). Replace `public/assets/portrait/portrait.webp` and regenerate `portrait-depth.webp` + `hero-og.jpg` when a larger original is available.
2. **Motion exports.** Ten `.aep` projects exist (`projeyat/projeyat/after effect/`), but no MP4s. The Motion card uses a generated placeholder. Add real renders/stills to `public/assets/projects/` and update `motion-studies` in `src/data/content.ts`.
3. **3D model export.** `.blend` and `.skb` files exist but no GLB/OBJ/FBX. The Lab therefore uses real video frames instead of an orbit viewer. Export a GLB to add a true interactive model.
4. **Thumbnails for individual logos/posters.** Some `.ai` files only expose vector previews; the generated WebP cards are honest but not pixel-perfect. Replace with rendered exports if available.

## Needs confirmation from Yassine

5. Project descriptions, role wording and tool lists were inferred from folder names, README files and reports.
6. The work shown for Rajah d'Impression is presented as work produced **during the internship**, not as personal clients.
7. KELMA 216 is an Android game; it is mapped to the "XR & Games" filter as the closest available category.
8. The quote in the dark panel is an original draft and needs his approval (or replacement in `content/quote.json`).
9. Social profiles (GitHub, LinkedIn, Behance, Instagram) and live project URLs were not found in any local file.
10. `www.aljazira.tn` appears in the brand charter but was **not** used as a live link because it could not be verified.
11. Confirm the public email and phone number before launch.

## Technical follow-ups

12. Set `SITE_URL` and `GITHUB_REPO` in Vercel so generated `index.html`, `config.yml` and `sitemap.xml` use the final origin.
13. Create the GitHub OAuth App and Resend key, then verify `/api/auth`, `/api/callback` and `/api/contact` on the deployed domain.
14. Run Lighthouse on the deployed URL and tune if needed (target > 85).
15. Optionally add AVIF variants alongside WebP for supported browsers.
16. Initialize a remote and push the git repository — the repo was initialized locally only. `npx vercel build` also requires an authenticated Vercel CLI session.

## Privacy

- The date of birth present in the original CV PDF was removed from the public copy. Never re-add it to `src/data/content.ts` or `content/settings.json`.
- The original source folders are gitignored and must not be committed.
