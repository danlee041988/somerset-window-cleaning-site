/**
 * Server-side reCAPTCHA verification
 * Validates reCAPTCHA tokens to prevent spam and bot submissions
 */

export interface RecaptchaVerificationResult {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

export interface RecaptchaVerificationOptions {
  minScore?: number
  expectedAction?: string
}

/**
 * Verify reCAPTCHA token server-side
 * @param token - The reCAPTCHA token from the client
 * @param options - Verification options (score threshold, expected action)
 * @returns Verification result with success status
 */
export async function verifyRecaptchaToken(
  token: string,
  options: RecaptchaVerificationOptions = {}
): Promise<{ valid: boolean; error?: string; score?: number }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  // Make reCAPTCHA optional - allow submission if not configured
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY is not configured - skipping reCAPTCHA verification')
    return {
      valid: true, // Allow submission when reCAPTCHA is not configured
      error: undefined,
    }
  }

  if (!token || token.trim().length === 0) {
    return {
      valid: false,
      error: 'Missing reCAPTCHA token',
    }
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    if (!response.ok) {
      console.error('reCAPTCHA verification request failed:', response.status)
      return {
        valid: false,
        error: 'Verification service unavailable',
      }
    }

    const data: RecaptchaVerificationResult = await response.json()

    // Check if verification was successful
    if (!data.success) {
      const errorCodes = data['error-codes'] || []
      console.warn('reCAPTCHA verification failed:', errorCodes)
      
      // Provide user-friendly error messages
      if (errorCodes.includes('timeout-or-duplicate')) {
        return {
          valid: false,
          error: 'reCAPTCHA token expired. Please try again.',
        }
      }
      
      if (errorCodes.includes('invalid-input-response')) {
        return {
          valid: false,
          error: 'Invalid reCAPTCHA token. Please refresh and try again.',
        }
      }

      return {
        valid: false,
        error: 'reCAPTCHA verification failed',
      }
    }

    // For reCAPTCHA v3, check score threshold
    const minScore = options.minScore ?? 0.5
    if (data.score !== undefined && data.score < minScore) {
      console.warn(`reCAPTCHA score too low: ${data.score} (minimum: ${minScore})`)
      return {
        valid: false,
        error: 'Security check failed. Please try again.',
        score: data.score,
      }
    }

    // Optionally verify the action matches expected
    if (options.expectedAction && data.action !== options.expectedAction) {
      console.warn(`reCAPTCHA action mismatch: ${data.action} (expected: ${options.expectedAction})`)
      return {
        valid: false,
        error: 'Security check failed',
      }
    }

    return {
      valid: true,
      score: data.score,
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return {
      valid: false,
      error: 'Verification failed. Please try again.',
    }
  }
}
