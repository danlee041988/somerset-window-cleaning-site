/**
 * Simple in-memory rate limiting
 * For production with multiple instances, consider Redis/Upstash
 */

interface RateLimitRecord {
  count: number
  resetAt: number
}

// In-memory store (resets on server restart)
const rateLimitStore = new Map<string, RateLimitRecord>()

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key)
    }
  }
}, 600000)

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  retryAfter?: number
}

export interface RateLimitOptions {
  limit?: number
  windowMs?: number
}

/**
 * Check if request is within rate limit
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param options - Rate limit configuration
 * @returns Rate limit result with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 10
  const windowMs = options.windowMs ?? 60000 // 1 minute default

  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  // No existing record or window expired
  if (!record || now > record.resetAt) {
    const resetAt = now + windowMs
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt,
    })

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
    }
  }

  // Within existing window
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: record.resetAt,
      retryAfter: Math.ceil((record.resetAt - now) / 1000),
    }
  }

  // Increment count
  record.count++

  return {
    allowed: true,
    remaining: limit - record.count,
    resetAt: record.resetAt,
  }
}

/**
 * Reset rate limit for an identifier
 * Useful for testing or manual overrides
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier)
}

/**
 * Get current rate limit status without incrementing
 * Note: This returns status based on default limit of 10
 * For accurate status, use the same limit as checkRateLimit
 */
export function getRateLimitStatus(identifier: string, limit: number = 10): RateLimitResult | null {
  const record = rateLimitStore.get(identifier)
  
  if (!record) {
    return null
  }

  const now = Date.now()
  if (now > record.resetAt) {
    rateLimitStore.delete(identifier)
    return null
  }

  return {
    allowed: record.count < limit,
    remaining: Math.max(0, limit - record.count),
    resetAt: record.resetAt,
    retryAfter: record.count >= limit ? Math.ceil((record.resetAt - now) / 1000) : undefined,
  }
}
