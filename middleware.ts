import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import securityHeadersConfig from '@/config/security-headers.json'

const isLocalhost = (hostname: string | null) => !hostname || hostname.endsWith('.local') || hostname === 'localhost'
const STRICT_TRANSPORT_SECURITY = securityHeadersConfig.strictTransportSecurity

// Simple UUID generator for edge runtime (no crypto module)
function generateSimpleId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const hostname = request.nextUrl.hostname

  // Add request ID to all requests for tracing
  const requestId = request.headers.get('x-request-id') || generateSimpleId()
  response.headers.set('X-Request-ID', requestId)

  if (!isLocalhost(hostname)) {
    response.headers.set('Strict-Transport-Security', STRICT_TRANSPORT_SECURITY)
  }

  // Apply all security headers from config
  securityHeadersConfig.headers.forEach((header) => {
    response.headers.set(header.key, header.value)
  })

  return response
}

export const config = {
  matcher: '/:path*',
}
