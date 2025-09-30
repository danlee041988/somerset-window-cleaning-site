/**
 * Tests for reCAPTCHA verification
 */

import { verifyRecaptchaToken } from '@/lib/security/recaptcha'

// Mock fetch globally
global.fetch = jest.fn()

describe('verifyRecaptchaToken', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.RECAPTCHA_SECRET_KEY = 'test-secret-key'
  })

  afterEach(() => {
    delete process.env.RECAPTCHA_SECRET_KEY
  })

  it('should return invalid when secret key is not configured', async () => {
    delete process.env.RECAPTCHA_SECRET_KEY

    const result = await verifyRecaptchaToken('test-token')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Server configuration error')
  })

  it('should return invalid when token is empty', async () => {
    const result = await verifyRecaptchaToken('')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Missing reCAPTCHA token')
  })

  it('should return valid when reCAPTCHA verification succeeds', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        score: 0.9,
        action: 'submit',
      }),
    })

    const result = await verifyRecaptchaToken('valid-token')

    expect(result.valid).toBe(true)
    expect(result.score).toBe(0.9)
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.google.com/recaptcha/api/siteverify',
      expect.objectContaining({
        method: 'POST',
      })
    )
  })

  it('should return invalid when score is below threshold', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        score: 0.3,
      }),
    })

    const result = await verifyRecaptchaToken('low-score-token', { minScore: 0.5 })

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Security check failed. Please try again.')
    expect(result.score).toBe(0.3)
  })

  it('should return invalid when reCAPTCHA returns error codes', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        'error-codes': ['timeout-or-duplicate'],
      }),
    })

    const result = await verifyRecaptchaToken('expired-token')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('reCAPTCHA token expired. Please try again.')
  })

  it('should handle network errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    const result = await verifyRecaptchaToken('test-token')

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Verification failed. Please try again.')
  })

  it('should verify action when expectedAction is provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        action: 'login',
        score: 0.9,
      }),
    })

    const result = await verifyRecaptchaToken('test-token', { expectedAction: 'submit' })

    expect(result.valid).toBe(false)
    expect(result.error).toBe('Security check failed')
  })
})
