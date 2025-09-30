/**
 * Google Ads Conversion Tracking
 */

// Google Ads Conversion ID
export const GOOGLE_ADS_CONVERSION_ID = 'AW-766877634'

// Conversion labels
export const CONVERSION_LABELS = {
  PHONE_CLICK: 'zsUDCL2J46IbEMK_1u0C', // Lead - Phone Click (Website)
} as const

/**
 * Track a phone click conversion
 */
export function trackPhoneClickConversion() {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag
    gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_CONVERSION_ID}/${CONVERSION_LABELS.PHONE_CLICK}`,
      value: 1.0,
      currency: 'GBP',
    })
  }
}

/**
 * Track a form submission conversion (if you add this later)
 */
export function trackFormSubmitConversion(value = 1.0) {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag
    gtag('event', 'conversion', {
      send_to: `${GOOGLE_ADS_CONVERSION_ID}/${CONVERSION_LABELS.PHONE_CLICK}`,
      value: value,
      currency: 'GBP',
    })
  }
}
