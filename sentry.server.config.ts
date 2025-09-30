/**
 * Sentry Server Configuration
 * Tracks errors and performance on the server
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

    // Filter out sensitive data
    beforeSend(event, hint) {
      // Remove PII from request data
      if (event.request?.data) {
        const data = event.request.data as any
        if (data.email) data.email = '[REDACTED]'
        if (data.phone) data.phone = '[REDACTED]'
        if (data.address) data.address = '[REDACTED]'
        if (data.postcode) data.postcode = '[REDACTED]'
        if (data.customer) {
          data.customer = {
            ...data.customer,
            email: '[REDACTED]',
            phone: '[REDACTED]',
            address: '[REDACTED]',
            postcode: '[REDACTED]',
          }
        }
      }

      // Remove PII from extra context
      if (event.extra) {
        Object.keys(event.extra).forEach((key) => {
          const value = event.extra![key]
          if (typeof value === 'string') {
            // Redact email addresses
            event.extra![key] = value.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]')
            // Redact phone numbers
            event.extra![key] = value.replace(/(\+44|0)[0-9\s-()]{10,}/g, '[PHONE]')
          }
        })
      }

      return event
    },

    // Ignore certain errors
    ignoreErrors: [
      'ECONNRESET',
      'ETIMEDOUT',
      'ENOTFOUND',
    ],
  })
}
