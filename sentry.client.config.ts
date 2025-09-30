/**
 * Sentry Client Configuration
 * Tracks errors and performance in the browser
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENABLED = process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true'

if (SENTRY_ENABLED && SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,

    // Adjust sample rate for production traffic
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    // Session Replay
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove PII from breadcrumbs and context
      if (event.request?.data) {
        const data = event.request.data as any
        if (data.email) data.email = '[REDACTED]'
        if (data.phone) data.phone = '[REDACTED]'
        if (data.address) data.address = '[REDACTED]'
        if (data.postcode) data.postcode = '[REDACTED]'
      }

      // Don't send events in development unless explicitly enabled
      if (process.env.NODE_ENV === 'development' && !process.env.SENTRY_DEBUG) {
        return null
      }

      return event
    },

    // Session Replay integration (if available)
    integrations: [],

    // Ignore common browser errors
    ignoreErrors: [
      // Network errors
      'NetworkError',
      'Failed to fetch',
      'Load failed',
      // Browser extension errors
      'top.GLOBALS',
      'chrome-extension://',
      'moz-extension://',
    ],
  })
}
