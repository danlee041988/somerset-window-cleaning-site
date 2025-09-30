/**
 * Webhook signature verification utilities
 * Validates webhook payloads using HMAC signatures to prevent spoofing
 */

import crypto from 'crypto'

/**
 * Verify WhatsApp webhook signature
 * @param payload - Raw request body as string
 * @param signature - Signature from x-hub-signature-256 header
 * @param secret - WhatsApp app secret
 * @returns True if signature is valid
 */
export function verifyWhatsAppSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) {
    console.warn('WhatsApp webhook: Missing signature header')
    return false
  }

  if (!secret) {
    console.error('WhatsApp webhook: Missing app secret')
    return false
  }

  try {
    // WhatsApp uses HMAC-SHA256
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')

    const expectedSignatureWithPrefix = `sha256=${expectedSignature}`

    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignatureWithPrefix)
    )
  } catch (error) {
    console.error('WhatsApp signature verification error:', error)
    return false
  }
}

/**
 * Verify webhook timestamp to prevent replay attacks
 * @param timestamp - Timestamp from webhook payload
 * @param maxAgeSeconds - Maximum age of webhook in seconds (default: 5 minutes)
 * @returns True if timestamp is recent enough
 */
export function verifyWebhookTimestamp(
  timestamp: string | number,
  maxAgeSeconds: number = 300
): boolean {
  try {
    const webhookTime = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp
    const currentTime = Math.floor(Date.now() / 1000)
    const age = currentTime - webhookTime

    if (age < 0) {
      console.warn('Webhook timestamp is in the future')
      return false
    }

    if (age > maxAgeSeconds) {
      console.warn(`Webhook timestamp too old: ${age}s (max: ${maxAgeSeconds}s)`)
      return false
    }

    return true
  } catch (error) {
    console.error('Webhook timestamp verification error:', error)
    return false
  }
}

/**
 * Generic HMAC signature verification
 * @param payload - Raw request body
 * @param signature - Signature to verify
 * @param secret - Signing secret
 * @param algorithm - HMAC algorithm (default: sha256)
 * @returns True if signature is valid
 */
export function verifyHmacSignature(
  payload: string,
  signature: string | null,
  secret: string,
  algorithm: string = 'sha256'
): boolean {
  if (!signature || !secret) {
    return false
  }

  try {
    const expectedSignature = crypto
      .createHmac(algorithm, secret)
      .update(payload)
      .digest('hex')

    // Remove any prefix (e.g., "sha256=")
    const cleanSignature = signature.replace(/^[a-z0-9]+=/i, '')

    // Ensure both buffers are the same length before comparison
    if (cleanSignature.length !== expectedSignature.length) {
      return false
    }

    return crypto.timingSafeEqual(
      Buffer.from(cleanSignature),
      Buffer.from(expectedSignature)
    )
  } catch (error) {
    console.error('HMAC signature verification error:', error)
    return false
  }
}
