/**
 * Decap CMS GitHub OAuth proxy — step 1.
 * Validates the calling origin, creates a signed state bound to that origin,
 * and redirects the CMS popup to GitHub. Secrets stay server-side.
 */
import {
  base64url,
  isAllowedOrigin,
  jsonResponse,
  randomHex,
  requestOrigin,
  sign,
  siteUrl,
  stateCookie,
} from './_shared'

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405, { Allow: 'GET' })
  }

  if (!isAllowedOrigin(request)) {
    return jsonResponse({ error: 'Origin not allowed' }, 403)
  }

  const url = new URL(request.url)
  if (url.searchParams.get('provider') !== 'github') {
    return jsonResponse({ error: 'Unsupported OAuth provider' }, 400)
  }

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  const secret = process.env.OAUTH_GITHUB_CLIENT_SECRET || process.env.OAUTH_STATE_SECRET
  if (!clientId || !secret) {
    return jsonResponse({ error: 'OAuth is not configured' }, 503)
  }

  const origin = requestOrigin(request)!
  const state = randomHex(16)
  const signature = await sign(`${state}|${origin}`, secret)
  const cookie = [base64url(state), base64url(origin), signature].join('.')
  const redirectUri = `${siteUrl(request)}/api/callback`
  const scope = process.env.OAUTH_GITHUB_SCOPE || 'repo,user'

  const authorize = new URL('https://github.com/login/oauth/authorize')
  authorize.searchParams.set('response_type', 'code')
  authorize.searchParams.set('client_id', clientId)
  authorize.searchParams.set('redirect_uri', redirectUri)
  authorize.searchParams.set('scope', scope)
  authorize.searchParams.set('state', state)
  authorize.searchParams.set('allow_signup', 'false')

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': stateCookie(cookie, 600),
      'Cache-Control': 'no-store',
      'Referrer-Policy': 'no-referrer',
    },
  })
}
