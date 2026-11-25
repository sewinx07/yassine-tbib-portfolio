/**
 * Decap CMS GitHub OAuth proxy — step 2.
 * Validates the signed state/cookie pair, exchanges the code server-side, and
 * hands the token back to the CMS popup with a target-origin postMessage.
 */
import {
  constantTimeEqual,
  fromBase64url,
  jsonResponse,
  randomHex,
  readCookie,
  sign,
  siteUrl,
  stateCookie,
} from './_shared'

function safeJson(value: unknown): string {
  return JSON.stringify(value).replaceAll('<', '\\u003c')
}

function callbackPage(kind: 'success' | 'error', payload: Record<string, string>, targetOrigin: string) {
  const nonce = randomHex(16)
  const message = `authorization:github:${kind}:${safeJson(payload)}`
  const html = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Connexion Decap CMS</title>
    <style>
      body { margin: 0; display: grid; min-height: 100vh; place-items: center; background: #070707; color: #f4f1ec; font: 14px system-ui, sans-serif; }
      p { padding: 2rem; }
    </style>
  </head>
  <body>
    <p>Connexion en cours… Vous pouvez fermer cette fenêtre.</p>
    <script nonce="${nonce}">
      (function () {
        var target = ${safeJson(targetOrigin)};
        var message = ${safeJson(message)};
        var sent = false;
        function deliver() {
          if (sent || !window.opener) return;
          sent = true;
          window.opener.postMessage(message, target);
        }
        window.opener && window.opener.postMessage("authorizing:github", target);
        window.addEventListener("message", deliver, { once: true });
        window.setTimeout(deliver, 600);
      })();
    </script>
  </body>
</html>`

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': `default-src 'none'; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
      'Referrer-Policy': 'no-referrer',
    },
  })
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed' }, 405, { Allow: 'GET' })
  }

  const url = new URL(request.url)
  const fallbackOrigin = siteUrl(request)
  const clearCookie = stateCookie('', 0)

  if (url.searchParams.get('provider') !== 'github') {
    return jsonResponse({ error: 'Unsupported OAuth provider' }, 400, { 'Set-Cookie': clearCookie })
  }

  const state = url.searchParams.get('state')
  const cookie = readCookie(request.headers, 'decap_oauth_state')
  const parts = cookie?.split('.') ?? []
  const secret = process.env.OAUTH_GITHUB_CLIENT_SECRET || process.env.OAUTH_STATE_SECRET
  let targetOrigin = fallbackOrigin

  if (!state || parts.length !== 3 || !secret) {
    return withClear(callbackPage('error', { message: 'Session OAuth invalide.' }, fallbackOrigin), clearCookie)
  }

  try {
    const cookieState = fromBase64url(parts[0])
    targetOrigin = fromBase64url(parts[1])
    const expected = await sign(`${cookieState}|${targetOrigin}`, secret)
    if (!constantTimeEqual(cookieState, state) || !constantTimeEqual(parts[2], expected)) {
      throw new Error('state mismatch')
    }
  } catch {
    return withClear(callbackPage('error', { message: 'Session OAuth invalide.' }, fallbackOrigin), clearCookie)
  }

  const error = url.searchParams.get('error')
  if (error || url.searchParams.get('error_description')) {
    return withClear(
      callbackPage('error', { message: 'Connexion GitHub annulée ou refusée.' }, targetOrigin),
      clearCookie,
    )
  }

  const code = url.searchParams.get('code')
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID
  if (!code || !clientId || !secret) {
    return withClear(callbackPage('error', { message: 'Code OAuth manquant.' }, targetOrigin), clearCookie)
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: secret,
        code,
        redirect_uri: `${siteUrl(request)}/api/callback`,
        grant_type: 'authorization_code',
      }),
    })
    const tokenData = (await tokenResponse.json()) as { access_token?: string; error?: string }
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error || 'token exchange failed')
    }
    return withClear(callbackPage('success', { token: tokenData.access_token }, targetOrigin), clearCookie)
  } catch {
    return withClear(
      callbackPage('error', { message: 'Échange du jeton impossible. Réessayez.' }, targetOrigin),
      clearCookie,
    )
  }
}

function withClear(response: Response, cookie: string): Response {
  response.headers.append('Set-Cookie', cookie)
  return response
}
