/**
 * Error tracking utilities
 * Centralized error handling and reporting to Sentry
 */

import * as Sentry from '@sentry/nextjs'
import { logger } from './logger'

export interface ErrorContext {
  requestId?: string
  userId?: string
  action?: string
  [key: string]: any
}

/**
 * Capture and report an error
 */
export function captureError(
  error: Error | unknown,
  context?: ErrorContext
): void {
  // Log to console
  logger.error(
    error instanceof Error ? error.message : String(error),
    context
  )

  // Report to Sentry if enabled
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
    Sentry.captureException(error, {
      extra: context,
      level: 'error',
    })
  }
}

/**
 * Capture a message (non-error event)
 */
export function captureMessage(
  message: string,
  level: 'info' | 'warning' | 'error' = 'info',
  context?: ErrorContext
): void {
  // Log to console
  const logLevel = level === 'warning' ? 'warn' : level === 'error' ? 'error' : 'info'
  logger[logLevel](message, context)

  // Report to Sentry if enabled
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
    Sentry.captureMessage(message, {
      level,
      extra: context,
    })
  }
}

/**
 * Set user context for error tracking
 */
export function setUserContext(user: {
  id?: string
  email?: string
  username?: string
}): void {
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
    Sentry.setUser(user)
  }
}

/**
 * Clear user context
 */
export function clearUserContext(): void {
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
    Sentry.setUser(null)
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  category: string,
  data?: Record<string, any>
): void {
  if (process.env.NEXT_PUBLIC_SENTRY_ENABLED === 'true') {
    Sentry.addBreadcrumb({
      message,
      category,
      data,
      level: 'info',
    })
  }
}

/**
 * Wrap an async function with error tracking
 */
export function withErrorTracking<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      captureError(error, context)
      throw error
    }
  }) as T
}

/**
 * Wrap a sync function with error tracking
 */
export function withErrorTrackingSync<T extends (...args: any[]) => any>(
  fn: T,
  context?: ErrorContext
): T {
  return ((...args: Parameters<T>) => {
    try {
      return fn(...args)
    } catch (error) {
      captureError(error, context)
      throw error
    }
  }) as T
}
