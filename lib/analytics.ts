/**
 * Google Analytics 4 Integration for Somerset Window Cleaning
 * Tracks form interactions, conversions, and user behavior
 */

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

// Configuration
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GA_ENABLED = process.env.NEXT_PUBLIC_GA_TRACKING_ENABLED === 'true';

/**
 * Initialize Google Analytics 4
 */
export const initGA4 = () => {
  if (!GA_MEASUREMENT_ID || !GA_ENABLED) {
    console.log('📊 GA4 tracking disabled or measurement ID missing');
    return;
  }

  // Load GA4 script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  window.gtag = window.gtag || function() {
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push(arguments);
  };

  window.gtag('js', new Date() as any);
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_title: 'Somerset Window Cleaning',
    page_location: window.location.href,
    anonymize_ip: true, // GDPR compliance
    allow_google_signals: false, // Privacy-focused
    allow_ad_personalization_signals: false
  });

  console.log('📊 GA4 initialized successfully');
};

/**
 * Track form events
 */
export const trackFormEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  if (!GA_ENABLED || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, {
    event_category: 'Contact Form',
    ...parameters
  });

  console.log(`📊 GA4 Event: ${eventName}`, parameters);
};

/**
 * Specific form tracking functions
 */
export const analytics = {
  // Track when user starts filling form
  formStart: (serviceType?: string) => {
    trackFormEvent('form_start', {
      event_label: 'Contact Form Started',
      service_type: serviceType || 'unknown',
      value: 1
    });
  },

  // Track successful form submission
  formSubmit: (data: {
    serviceType?: string;
    propertySize?: string;
    customerType?: string;
    email?: string;
  }) => {
    trackFormEvent('form_submit', {
      event_label: 'Contact Form Submitted',
      service_type: data.serviceType || 'unknown',
      property_size: data.propertySize || 'unknown',
      customer_type: data.customerType || 'unknown',
      value: 10 // Assign value for conversion tracking
    });

    // Also track as conversion when GA4 is enabled and gtag is available
    if (!GA_ENABLED) {
      return;
    }

    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      console.log('📊 GA4 conversion skipped: gtag not available');
      return;
    }

    if (!GA_MEASUREMENT_ID) {
      console.log('📊 GA4 conversion skipped: measurement ID missing');
      return;
    }

    window.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      value: 10,
      currency: 'GBP'
    });
  },

  // Track form errors
  formError: (errorType: string, errorMessage?: string) => {
    trackFormEvent('form_error', {
      event_label: `Form Error: ${errorType}`,
      error_type: errorType,
      error_message: errorMessage,
      value: 0
    });
  },

  // Track reCAPTCHA completion
  recaptchaComplete: () => {
    trackFormEvent('recaptcha_complete', {
      event_label: 'reCAPTCHA Completed',
      value: 5
    });
  },

  // Track reCAPTCHA errors
  recaptchaError: (errorType: string) => {
    trackFormEvent('recaptcha_error', {
      event_label: `reCAPTCHA Error: ${errorType}`,
      error_type: errorType,
      value: 0
    });
  },

  // Track service page visits
  servicePageView: (serviceName: string) => {
    trackFormEvent('service_page_view', {
      event_label: `Service Page: ${serviceName}`,
      service_name: serviceName,
      value: 2
    });
  },

  // Track quote requests (phone/email/whatsapp clicks)
  quoteRequest: (method: 'phone' | 'email' | 'form' | 'whatsapp' | 'exit_intent_phone' | 'exit_intent_callback') => {
    trackFormEvent('quote_request', {
      event_label: `Quote Request: ${method}`,
      contact_method: method,
      value: 8
    });
  },

  // Track area page visits
  areaPageView: (areaName: string) => {
    trackFormEvent('area_page_view', {
      event_label: `Area Page: ${areaName}`,
      area_name: areaName,
      value: 3
    });
  },

  // Expose custom event tracking for integrations expecting analytics.trackCustomEvent
  trackCustomEvent: (eventName: string, category: string, label?: string, value?: number) => {
    trackCustomEvent(eventName, category, label, value)
  }
};

/**
 * Page view tracking
 */
export const trackPageView = (url: string, title: string) => {
  if (!GA_ENABLED || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('config', GA_MEASUREMENT_ID!, {
    page_title: title,
    page_location: url
  });
};

/**
 * Custom event tracking
 */
export function trackCustomEvent(
  eventName: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!GA_ENABLED || typeof window === 'undefined' || !window.gtag) {
    return;
  }

  window.gtag('event', eventName, {
    event_category: category,
    event_label: label,
    value: value
  });
}
