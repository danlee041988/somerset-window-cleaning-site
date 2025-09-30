/**
 * Form state persistence utilities
 * Saves and restores form data to/from localStorage
 */

export interface StoredFormData {
  data: Record<string, any>
  timestamp: number
  step?: number
}

const STORAGE_PREFIX = 'swc_form_'
const MAX_AGE_MS = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Save form data to localStorage
 */
export function saveFormData(
  formId: string,
  data: Record<string, any>,
  step?: number
): void {
  if (typeof window === 'undefined') return

  try {
    const stored: StoredFormData = {
      data,
      timestamp: Date.now(),
      step,
    }

    localStorage.setItem(
      `${STORAGE_PREFIX}${formId}`,
      JSON.stringify(stored)
    )
  } catch (error) {
    console.warn('Failed to save form data:', error)
  }
}

/**
 * Load form data from localStorage
 */
export function loadFormData(formId: string): StoredFormData | null {
  if (typeof window === 'undefined') return null

  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${formId}`)
    if (!item) return null

    const stored: StoredFormData = JSON.parse(item)

    // Check if data is too old
    const age = Date.now() - stored.timestamp
    if (age > MAX_AGE_MS) {
      clearFormData(formId)
      return null
    }

    return stored
  } catch (error) {
    console.warn('Failed to load form data:', error)
    return null
  }
}

/**
 * Clear form data from localStorage
 */
export function clearFormData(formId: string): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${formId}`)
  } catch (error) {
    console.warn('Failed to clear form data:', error)
  }
}

/**
 * Check if form data exists
 */
export function hasFormData(formId: string): boolean {
  return loadFormData(formId) !== null
}

/**
 * Get age of stored form data in milliseconds
 */
export function getFormDataAge(formId: string): number | null {
  const stored = loadFormData(formId)
  if (!stored) return null

  return Date.now() - stored.timestamp
}

/**
 * Format age for display
 */
export function formatFormDataAge(ageMs: number): string {
  const minutes = Math.floor(ageMs / 60000)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  }

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  }

  return 'just now'
}
