/** Shared helpers for the Vercel API functions. Never imported by the site bundle. */

export function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  })
}

export function textResponse(body: string, status = 200, contentType = 'text/plain; charset=utf-8') {
  return new Response(body, {
    status,
    headers: { 'Content-Type': contentType, 'Cache-Control': 'no-store' },
  })
}

function originFrom(value: string | null): string | null {
  if (!value) return null
  try {
    return new URL(value).origin
  } catch {
    return null
  }
}

export function requestOrigin(request: Request): string | null {
  return originFrom(request.headers.get('origin')) ?? originFrom(request.headers.get('referer'))
}

export function allowedOrigins(): string[] {
  const origins = new Set<string>()
  const configured = [
    process.env.SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.ALLOWED_ADMIN_ORIGINS,
  ]
    .filter(Boolean)
    .join(',')
    .split(',')
  for (const value of configured) {
    const origin = originFrom(value.trim())
    if (origin) origins.add(origin)
  }
  if (process.env.VERCEL_ENV !== 'production') {
    origins.add('http://localhost:5173')
    origins.add('http://127.0.0.1:5173')
    origins.add('http://localhost:4173')
    origins.add('http://127.0.0.1:4173')
  }
  return [...origins]
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = requestOrigin(request)
  return Boolean(origin && allowedOrigins().includes(origin))
}

export function siteUrl(request: Request): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return new URL(request.url).origin
}

export function randomHex(bytes: number): string {
  const buffer = new Uint8Array(bytes)
  crypto.getRandomValues(buffer)
  return [...buffer].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function base64url(value: string): string {
  return btoa(value).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

export function fromBase64url(value: string): string {
  const padded = value.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  return atob(padded)
}

export async function sign(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let difference = 0
  for (let i = 0; i < a.length; i += 1) difference |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return difference === 0
}

export function readCookie(headers: Headers, name: string): string | null {
  const cookies = headers.get('cookie') ?? ''
  for (const part of cookies.split(';')) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) return decodeURIComponent(rest.join('='))
  }
  return null
}

export function stateCookie(value: string, maxAge: number): string {
  const secure = process.env.VERCEL_ENV === 'production' ? '; Secure' : ''
  return `decap_oauth_state=${encodeURIComponent(value)}; Path=/api; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`
}

export function corsHeaders(origin: string): HeadersInit {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    Vary: 'Origin',
  }
}
