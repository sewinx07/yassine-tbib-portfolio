# Deployment guide

This portfolio is a static Vite site plus three small Vercel functions. There is no database and no paid service required. Vercel Hobby is sufficient; note that Hobby bandwidth, build-minute and serverless invocation limits still apply, and every editorial draft PR creates a preview deployment that counts toward usage.

## 1. Repository and Vercel project

1. Push this folder to GitHub. The CMS commits to `main`.
2. Import the repository in Vercel.
3. Framework preset: **Vite**. Root directory: repository root.
4. Build command: `npm run build`. Output directory: `dist`.
5. Node.js version: **20.x** (`.nvmrc` and `engines` are included).
6. Add the environment variables below, then deploy.

`vercel.json` keeps `/admin/*` and `/api/*` out of the SPA fallback, applies security headers, caches hashed assets for one year and HTML for zero seconds.

## 2. Environment variables

Set these in **Production** (and in Preview only if editors need to sign in on previews):

| Variable | Purpose |
|---|---|
| `SITE_URL` | Canonical origin, e.g. `https://portfolio-yassine.vercel.app`. Used for OAuth callback, generated `config.yml` and sitemap. |
| `GITHUB_REPO` | `owner/repo` that stores the content. |
| `OAUTH_GITHUB_CLIENT_ID` | GitHub OAuth App client ID. |
| `OAUTH_GITHUB_CLIENT_SECRET` | GitHub OAuth App secret. Server-only. |
| `OAUTH_GITHUB_SCOPE` | Optional. Defaults to `repo,user`; use `public_repo,user` for public repos. |
| `ALLOWED_ADMIN_ORIGINS` | Optional comma-separated extra origins allowed to call the OAuth proxy and contact API (e.g. preview URLs). |
| `RESEND_API_KEY` | Resend API key for contact email delivery. |
| `CONTACT_TO_EMAIL` | Inbox that receives contact messages. |
| `CONTACT_FROM_EMAIL` | Verified Resend sender, e.g. `Yassine Portfolio <contact@your-domain.com>`. |
| `UPSTASH_REDIS_REST_URL` | Optional Upstash REST URL for rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Optional Upstash REST token. |

Copy `.env.example` to `.env.local` for local checks. **Never commit real values.** Secrets are read only by `api/auth.ts`, `api/callback.ts` and `api/contact.ts`; the build scripts write only non-secret placeholders to `dist/`.

## 3. GitHub OAuth App

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
2. Homepage URL: the `SITE_URL` value.
3. Authorization callback URL: `SITE_URL/api/callback`.
4. Copy the client ID and generate a client secret into the Vercel variables above.

The proxy validates a signed `state` cookie, restricts calling origins, exchanges the code server-side and returns the token to the CMS popup with a target-origin `postMessage`. The OAuth app callback must stay on the canonical domain; previews use the same callback and post the token back to their own allowed origin.

## 4. Email delivery and rate limiting

- Verify a sending domain in Resend and create an API key. Contact messages are delivered as email and are **not stored** anywhere.
- If Resend variables are missing, the public form falls back to `mailto:` with the configured email address.
- Upstash is optional. Without it, rate limiting is disabled by design because serverless functions have no reliable in-memory state; this is logged server-side, not in the browser.

## 5. Editorial workflow

`publish_mode: editorial_workflow` is enabled. Editors save drafts, which become pull requests on GitHub. Vercel builds every PR as a preview deployment. Draft projects are visible in previews and local development but filtered out of production builds. Publishing a draft merges it into `main` and triggers the production build.

To roll back, revert the content commit on `main` or promote an earlier successful deployment in the Vercel dashboard.

## 6. Pre-deploy verification

```bash
npm run typecheck
npm run build
npx vercel build   # requires an authenticated Vercel CLI session
```

Then check:

- `/` and `/projects/kelma-216` render and a 404 route shows the custom 404 page;
- FR/EN toggle works and `lang` / meta tags update;
- `/admin/` loads Decap and `/admin/config.yml` has no secrets and no `local_backend`;
- `/robots.txt` disallows `/admin/` and `/api/` and points to `/sitemap.xml`;
- response headers include CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy`;
- `dist/` contains no `.env`, OAuth secret or Resend key.

`npx vercel build` could not be run in this workspace because the Vercel CLI had no valid login; it must be run by someone authenticated with the Vercel account.

## 7. Media rules

Uploads go to `public/assets/uploads/`. Use WebP, 2400 px maximum on the long edge. Do not commit large videos: use a YouTube/Vimeo URL or a small MP4/WebM under 10 MB. GLB files should stay under 15 MB. The public CV must remain the DOB-redacted `cv-yassine-tbib.pdf`; never publish the original CV.
