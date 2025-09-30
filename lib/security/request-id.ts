/**
 * Request ID generation and tracking utilities
 * Helps correlate logs and debug issues across services
 */

import crypto from 'crypto'

/**
 * Generate a unique request ID
 * Uses crypto.randomUUID() for RFC 4122 compliant UUIDs
 */
export function generateRequestId(): string {
  return crypto.randomUUID()
}

/**
 * Extract request ID from headers or generate new one
 * Checks for existing x-request-id header first
 */
export function getOrCreateRequestId(headers: Headers): string {
  const existingId = headers.get('x-request-id')
  return existingId || generateRequestId()
}

/**
 * Format log message with request ID
 * Makes it easy to grep logs by request ID
 */
export function formatLogWithRequestId(requestId: string, message: string): string {
  return `[${requestId}] ${message}`
}
