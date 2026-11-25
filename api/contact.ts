/**
 * Contact form delivery. Messages are sent by email and are never stored.
 * CORS is restricted to the configured site origin. Rate limiting uses Upstash
 * when configured and fails open otherwise (no in-memory state on serverless).
 */
import { z } from 'zod'
import { corsHeaders, isAllowedOrigin, jsonResponse, requestOrigin } from './_shared'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(200).default(''),
  startedAt: z.string().datetime(),
})

async function fingerprint(value: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value))
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function withinRateLimit(request: Request): Promise<boolean> {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    console.info('[contact] UPSTASH_REDIS_REST_URL is not set — rate limiting is disabled.')
    return true
  }

  const forwarded =
    request.headers.get('x-vercel-forwarded-for') ??
    request.headers.get('x-forwarded-for') ??
    'unknown'
  const ip = forwarded.split(',')[0]?.trim() ?? 'unknown'
  const key = `contact:${Math.floor(Date.now() / 3_600_000)}:${(await fingerprint(ip)).slice(0, 16)}`

  try {
    const response = await fetch(`${url.replace(/\/+$/, '')}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['INCR', key],
        ['EXPIRE', key, '3600', 'NX'],
      ]),
    })
    if (!response.ok) return true
    const result = (await response.json()) as Array<{ result?: number | string }>
    return Number(result[0]?.result ?? 0) <= 5
  } catch {
    return true
  }
}

export default async function handler(request: Request): Promise<Response> {
  const origin = requestOrigin(request)
  if (!isAllowedOrigin(request)) {
    return jsonResponse({ ok: false, error: 'Origin not allowed' }, 403)
  }
  const cors = origin ? corsHeaders(origin) : {}

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }
  if (request.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed' }, 405, {
      ...cors,
      Allow: 'POST, OPTIONS',
    })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return jsonResponse({ ok: false, error: 'Invalid JSON body' }, 400, cors)
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return jsonResponse({ ok: false, error: 'Invalid form data' }, 400, cors)
  }

  // Silent success for bots; do not reveal the honeypot.
  if (parsed.data.website) return jsonResponse({ ok: true }, 200, cors)

  const elapsed = Date.now() - Date.parse(parsed.data.startedAt)
  if (!Number.isFinite(elapsed) || elapsed < 800 || elapsed > 6 * 60 * 60 * 1000) {
    return jsonResponse({ ok: false, error: 'Invalid submission timing' }, 400, cors)
  }

  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  const apiKey = process.env.RESEND_API_KEY
  if (!to || !from || !apiKey) {
    return jsonResponse({ ok: false, code: 'contact_not_configured', error: 'Email delivery is not configured' }, 503, cors)
  }

  if (!(await withinRateLimit(request))) {
    return jsonResponse({ ok: false, error: 'Too many messages. Please try again later.' }, 429, cors)
  }

  const subject = `Portfolio — ${parsed.data.name.replace(/[\r\n]+/g, ' ')}`
  const text = `Nouveau message de ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`

  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: parsed.data.email,
        subject,
        text,
      }),
    })
    if (!delivery.ok) throw new Error(`Resend responded with ${delivery.status}`)
    return jsonResponse({ ok: true }, 200, cors)
  } catch {
    return jsonResponse({ ok: false, error: 'Delivery failed' }, 502, cors)
  }
}
