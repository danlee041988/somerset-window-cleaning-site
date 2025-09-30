/**
 * Accessibility utilities
 * Helpers for improving accessibility
 */

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (typeof window === 'undefined') return

  // Create or get announcement element
  let announcer = document.getElementById('screen-reader-announcer')
  
  if (!announcer) {
    announcer = document.createElement('div')
    announcer.id = 'screen-reader-announcer'
    announcer.setAttribute('role', 'status')
    announcer.setAttribute('aria-live', priority)
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    document.body.appendChild(announcer)
  }

  // Update aria-live if priority changed
  if (announcer.getAttribute('aria-live') !== priority) {
    announcer.setAttribute('aria-live', priority)
  }

  // Clear and set message
  announcer.textContent = ''
  setTimeout(() => {
    announcer!.textContent = message
  }, 100)
}

/**
 * Focus first error in form
 */
export function focusFirstError(formElement: HTMLFormElement | null): void {
  if (!formElement) return

  const firstError = formElement.querySelector('[aria-invalid="true"]') as HTMLElement
  
  if (firstError) {
    firstError.focus()
    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

/**
 * Trap focus within element (for modals)
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )

  const firstFocusable = focusableElements[0]
  const lastFocusable = focusableElements[focusableElements.length - 1]

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault()
        lastFocusable?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault()
        firstFocusable?.focus()
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  // Focus first element
  firstFocusable?.focus()

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Get accessible label for form field
 */
export function getAccessibleLabel(
  fieldName: string,
  isRequired: boolean = false
): string {
  const label = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')
  return isRequired ? `${label} (required)` : label
}

/**
 * Generate unique ID for form field
 */
export function generateFieldId(formId: string, fieldName: string): string {
  return `${formId}-${fieldName}-${Math.random().toString(36).substr(2, 9)}`
}
