/**
 * Sentry Edge Configuration
 * Tracks errors in Edge Runtime (middleware, edge functions)
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENABLED = process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true'

if (SENTRY_ENABLED && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Lower sample rate for edge functions
    tracesSampleRate: 0.1,

    // Minimal configuration for edge runtime
    beforeSend(event) {
      // Remove PII
      if (event.request?.data) {
        const data = event.request.data as any
        if (data.email) data.email = '[REDACTED]'
        if (data.phone) data.phone = '[REDACTED]'
      }

      return event
    },
  })
}
