/**
 * Tests for webhook signature verification
 */

import crypto from 'crypto'
import {
  verifyWhatsAppSignature,
  verifyWebhookTimestamp,
  verifyHmacSignature,
} from '@/lib/security/webhook-verification'

describe('verifyWhatsAppSignature', () => {
  const secret = 'test-secret'
  const payload = '{"test":"data"}'

  it('should return true for valid signature', () => {
    const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex')

    const result = verifyWhatsAppSignature(payload, signature, secret)

    expect(result).toBe(true)
  })

  it('should return false for invalid signature', () => {
    const result = verifyWhatsAppSignature(payload, 'sha256=invalid', secret)

    expect(result).toBe(false)
  })

  it('should return false when signature is missing', () => {
    const result = verifyWhatsAppSignature(payload, null, secret)

    expect(result).toBe(false)
  })

  it('should return false when secret is empty', () => {
    const signature = 'sha256=test'

    const result = verifyWhatsAppSignature(payload, signature, '')

    expect(result).toBe(false)
  })
})

describe('verifyWebhookTimestamp', () => {
  it('should return true for recent timestamp', () => {
    const recentTimestamp = Math.floor(Date.now() / 1000) - 60 // 1 minute ago

    const result = verifyWebhookTimestamp(recentTimestamp)

    expect(result).toBe(true)
  })

  it('should return false for old timestamp', () => {
    const oldTimestamp = Math.floor(Date.now() / 1000) - 600 // 10 minutes ago

    const result = verifyWebhookTimestamp(oldTimestamp, 300) // 5 minute max age

    expect(result).toBe(false)
  })

  it('should return false for future timestamp', () => {
    const futureTimestamp = Math.floor(Date.now() / 1000) + 60 // 1 minute in future

    const result = verifyWebhookTimestamp(futureTimestamp)

    expect(result).toBe(false)
  })

  it('should handle string timestamps', () => {
    const recentTimestamp = String(Math.floor(Date.now() / 1000) - 60)

    const result = verifyWebhookTimestamp(recentTimestamp)

    expect(result).toBe(true)
  })
})

describe('verifyHmacSignature', () => {
  const secret = 'test-secret'
  const payload = 'test-payload'

  it('should return true for valid HMAC signature', () => {
    const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

    const result = verifyHmacSignature(payload, signature, secret)

    expect(result).toBe(true)
  })

  it('should return false for invalid signature', () => {
    const result = verifyHmacSignature(payload, 'invalid', secret)

    expect(result).toBe(false)
  })

  it('should handle signatures with prefix', () => {
    const signature = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex')

    const result = verifyHmacSignature(payload, signature, secret)

    expect(result).toBe(true)
  })

  it('should support different algorithms', () => {
    const signature = crypto.createHmac('sha1', secret).update(payload).digest('hex')

    const result = verifyHmacSignature(payload, signature, secret, 'sha1')

    expect(result).toBe(true)
  })
})
