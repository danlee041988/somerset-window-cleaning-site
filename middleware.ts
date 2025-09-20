import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const isLocalhost = (hostname: string | null) => !hostname || hostname.endsWith('.local') || hostname === 'localhost'

const securityHeaders: [string, string][] = [
  [
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "img-src 'self' data: https://*",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
      "frame-ancestors 'self'",
      "form-action 'self'"
    ].join('; '),
  ],
  ['X-Frame-Options', 'SAMEORIGIN'],
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
  ['Cross-Origin-Opener-Policy', 'same-origin'],
  ['Cross-Origin-Resource-Policy', 'same-origin'],
]

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const hostname = request.nextUrl.hostname

  for (const [header, value] of securityHeaders) {
    response.headers.set(header, value)
  }

  if (!isLocalhost(hostname)) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }

  return response
}

export const config = {
  matcher: '/:path*',
}
