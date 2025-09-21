import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import securityHeadersConfig from '@/config/security-headers.json'

const isLocalhost = (hostname: string | null) => !hostname || hostname.endsWith('.local') || hostname === 'localhost'
const STRICT_TRANSPORT_SECURITY = securityHeadersConfig.strictTransportSecurity

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const hostname = request.nextUrl.hostname

  if (!isLocalhost(hostname)) {
    response.headers.set('Strict-Transport-Security', STRICT_TRANSPORT_SECURITY)
  }

  return response
}

export const config = {
  matcher: '/:path*',
}
