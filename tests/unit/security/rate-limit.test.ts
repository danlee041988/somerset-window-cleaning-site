/**
 * Tests for rate limiting
 */

import {
  checkRateLimit,
  resetRateLimit,
  getRateLimitStatus,
} from '@/lib/security/rate-limit'

describe('checkRateLimit', () => {
  const identifier = 'test-user'

  beforeEach(() => {
    resetRateLimit(identifier)
  })

  it('should allow first request', () => {
    const result = checkRateLimit(identifier, { limit: 5, windowMs: 60000 })

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(4)
  })

  it('should track multiple requests', () => {
    checkRateLimit(identifier, { limit: 5, windowMs: 60000 })
    checkRateLimit(identifier, { limit: 5, windowMs: 60000 })
    const result = checkRateLimit(identifier, { limit: 5, windowMs: 60000 })

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(2)
  })

  it('should block requests after limit is reached', () => {
    const options = { limit: 3, windowMs: 60000 }

    checkRateLimit(identifier, options)
    checkRateLimit(identifier, options)
    checkRateLimit(identifier, options)
    const result = checkRateLimit(identifier, options)

    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
    expect(result.retryAfter).toBeGreaterThan(0)
  })

  it('should reset after window expires', async () => {
    const options = { limit: 2, windowMs: 100 } // 100ms window

    checkRateLimit(identifier, options)
    checkRateLimit(identifier, options)

    // Wait for window to expire
    await new Promise(resolve => setTimeout(resolve, 150))

    const result = checkRateLimit(identifier, options)

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(1)
  })

  it('should use default values when options not provided', () => {
    const result = checkRateLimit(identifier)

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(9) // Default limit is 10
  })

  it('should handle different identifiers independently', () => {
    const user1 = 'user-1'
    const user2 = 'user-2'
    const options = { limit: 2, windowMs: 60000 }

    checkRateLimit(user1, options)
    checkRateLimit(user1, options)
    const result1 = checkRateLimit(user1, options)

    const result2 = checkRateLimit(user2, options)

    expect(result1.allowed).toBe(false)
    expect(result2.allowed).toBe(true)
  })
})

describe('resetRateLimit', () => {
  it('should reset rate limit for identifier', () => {
    const identifier = 'test-user'
    const options = { limit: 2, windowMs: 60000 }

    checkRateLimit(identifier, options)
    checkRateLimit(identifier, options)

    resetRateLimit(identifier)

    const result = checkRateLimit(identifier, options)

    expect(result.allowed).toBe(true)
    expect(result.remaining).toBe(1)
  })
})

describe('getRateLimitStatus', () => {
  it('should return null for unknown identifier', () => {
    const result = getRateLimitStatus('unknown-user')

    expect(result).toBeNull()
  })

  it('should return current status without incrementing', () => {
    const identifier = 'test-user-status'
    const options = { limit: 5, windowMs: 60000 }

    checkRateLimit(identifier, options) // count = 1, remaining = 4
    checkRateLimit(identifier, options) // count = 2, remaining = 3
    checkRateLimit(identifier, options) // count = 3, remaining = 2

    const status = getRateLimitStatus(identifier, 5)

    expect(status).not.toBeNull()
    expect(status?.remaining).toBe(2)

    // Verify it didn't increment
    const status2 = getRateLimitStatus(identifier, 5)
    expect(status2?.remaining).toBe(2)
  })

  it('should return null after window expires', async () => {
    const identifier = 'test-user-expired'
    const options = { limit: 5, windowMs: 100 }

    checkRateLimit(identifier, options)

    await new Promise(resolve => setTimeout(resolve, 150))

    const status = getRateLimitStatus(identifier)

    expect(status).toBeNull()
  })
})
