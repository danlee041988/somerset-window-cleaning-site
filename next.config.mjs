import { createRequire } from 'node:module'
import { withSentryConfig } from '@sentry/nextjs'

const require = createRequire(import.meta.url)
const securityHeaders = require('./config/security-headers.json')

const createSecurityHeaders = () => {
  const isProduction = process.env.NODE_ENV === 'production'

  return securityHeaders.headers.map((header) => {
    if (header.key !== 'Content-Security-Policy') {
      return header
    }

    const directives = header.value
      .split(';')
      .map((directive) => directive.trim())
      .filter(Boolean)

    const scriptIndex = directives.findIndex((directive) => directive.startsWith('script-src '))

    if (scriptIndex === -1) {
      return header
    }

    const scriptParts = directives[scriptIndex].split(/\s+/)
    const sources = scriptParts.slice(1)

    const ensureSource = (source) => {
      if (!sources.includes(source)) {
        sources.push(source)
      }
    }

    ensureSource('https://app.usercentrics.eu')

    if (!isProduction && !sources.includes("'unsafe-eval'")) {
      const inlineIndex = sources.indexOf("'unsafe-inline'")
      if (inlineIndex !== -1) {
        sources.splice(inlineIndex + 1, 0, "'unsafe-eval'")
      } else {
        sources.unshift("'unsafe-eval'")
      }
    }

    directives[scriptIndex] = `script-src ${sources.join(' ')}`

    return {
      ...header,
      value: directives.join('; '),
    }
  })
}

const SECURITY_HEADERS = createSecurityHeaders()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 960, 1080, 1200, 1280, 1366, 1440, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  async redirects() {
    return [
      {
        source: '/pricing',
        destination: '/book-appointment?intent=quote',
        permanent: true,
      },
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: SECURITY_HEADERS,
      },
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    }
    return config
  },
}

// Wrap with Sentry for error tracking and performance monitoring
export default withSentryConfig(nextConfig, {
  // Sentry webpack plugin options
  silent: true, // Suppresses all logs
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
}, {
  // Upload source maps in production only
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})
