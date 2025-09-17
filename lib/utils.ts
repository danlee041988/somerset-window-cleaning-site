import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Form validation utilities
export function scrollToElement(elementId: string, offset: number = 100) {
  const element = document.getElementById(elementId)
  if (element) {
    const elementPosition = element.offsetTop - offset
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })
  }
}

export function scrollToFirstError(errors: Record<string, any>) {
  const firstErrorField = Object.keys(errors)[0]
  if (firstErrorField) {
    scrollToElement(firstErrorField, 120)
    
    // Focus the field if it's focusable
    const element = document.getElementById(firstErrorField) || 
                   document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement
    if (element && 'focus' in element) {
      setTimeout(() => element.focus(), 300)
    }
  }
}

export function announceToScreenReader(message: string) {
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  
  setTimeout(() => {
    document.body.removeChild(announcement)
  }, 1000)
}

export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Format UK mobile numbers
  if (digits.length === 11 && digits.startsWith('07')) {
    return `${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  
  return phone
}

export function formatPostcode(postcode: string): string {
  // Remove all spaces and convert to uppercase
  const cleaned = postcode.replace(/\s/g, '').toUpperCase()
  
  // UK postcode format: AA9A 9AA, AA9 9AA, AA99 9AA, A9A 9AA, A9 9AA, A99 9AA
  if (cleaned.length >= 5) {
    const beforeSpace = cleaned.slice(0, -3)
    const afterSpace = cleaned.slice(-3)
    return `${beforeSpace} ${afterSpace}`
  }
  
  return cleaned
}