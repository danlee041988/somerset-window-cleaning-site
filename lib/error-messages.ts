/**
 * User-friendly error messages
 * Converts technical errors into helpful messages
 */

export interface ErrorMessage {
  title: string
  message: string
  action?: string
  severity: 'error' | 'warning' | 'info'
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: unknown): ErrorMessage {
  // Network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      title: 'Connection Problem',
      message: 'Unable to connect to the server. Please check your internet connection and try again.',
      action: 'Retry',
      severity: 'error',
    }
  }

  // Timeout errors
  if (error instanceof Error && error.message.includes('timeout')) {
    return {
      title: 'Request Timeout',
      message: 'The request took too long. Please try again.',
      action: 'Retry',
      severity: 'warning',
    }
  }

  // Rate limit errors
  if (error instanceof Error && error.message.includes('rate limit')) {
    return {
      title: 'Too Many Requests',
      message: 'Please wait a moment before trying again.',
      action: 'Wait and retry',
      severity: 'warning',
    }
  }

  // Validation errors
  if (error instanceof Error && error.message.includes('validation')) {
    return {
      title: 'Invalid Information',
      message: 'Please check your information and try again.',
      action: 'Review form',
      severity: 'warning',
    }
  }

  // reCAPTCHA errors
  if (error instanceof Error && error.message.toLowerCase().includes('recaptcha')) {
    return {
      title: 'Security Check Failed',
      message: 'Please complete the security check and try again.',
      action: 'Complete reCAPTCHA',
      severity: 'warning',
    }
  }

  // Generic error
  return {
    title: 'Something Went Wrong',
    message: 'We encountered an unexpected error. Please try again or contact us if the problem persists.',
    action: 'Try again',
    severity: 'error',
  }
}

/**
 * Form field error messages
 */
export const FIELD_ERRORS = {
  required: (fieldName: string) => `${fieldName} is required`,
  email: 'Please enter a valid email address (e.g., john@example.com)',
  phone: 'Please enter a valid UK phone number (e.g., 07123 456789)',
  postcode: 'Please enter a valid UK postcode (e.g., TA1 1AA)',
  minLength: (min: number) => `Must be at least ${min} characters`,
  maxLength: (max: number) => `Must be no more than ${max} characters`,
  pattern: 'Please enter a valid format',
}

/**
 * Success messages
 */
export const SUCCESS_MESSAGES = {
  formSubmitted: {
    title: 'Request Received!',
    message: 'Thank you for your request. We\'ll get back to you within one working day.',
    severity: 'info' as const,
  },
  dataSaved: {
    title: 'Progress Saved',
    message: 'Your information has been saved. You can continue later.',
    severity: 'info' as const,
  },
}

/**
 * Format error for display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  return 'An unexpected error occurred'
}
