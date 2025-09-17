/**
 * WhatsApp Business Message Templates for Somerset Window Cleaning
 * Pre-approved templates for automated messaging compliance
 */

// Template definitions for WhatsApp Business API
export const WHATSAPP_TEMPLATES = {
  /**
   * Booking Confirmation Template
   * Sent immediately after appointment booking
   */
  BOOKING_CONFIRMATION: {
    name: 'booking_confirmation_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '🏠 Somerset Window Cleaning',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, your {{2}} appointment is confirmed!\n\n📅 Date: {{3}}\n⏰ Time: {{4}}\n🔢 Confirmation: {{5}}\n\nWe\'ll arrive within 30 minutes of your scheduled time. Our team will contact you before arrival.\n\nReply STOP to opt out.',
    },
    footer: {
      type: 'TEXT',
      text: 'Somerset Window Cleaning - Professional & Reliable',
    },
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Reschedule',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Contact Us',
      },
    ],
  },

  /**
   * Appointment Reminder Template
   * Sent 24 hours before service
   */
  APPOINTMENT_REMINDER: {
    name: 'appointment_reminder_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '⏰ Appointment Reminder',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, this is a friendly reminder about your {{2}} service {{3}} at {{4}}.\n\nOur team will arrive within 30 minutes of your scheduled time. Please ensure:\n• Clear access to windows/gutters\n• Remove valuables from window sills\n• Any specific instructions ready\n\nWeather looking good! ☀️',
    },
    footer: {
      type: 'TEXT',
      text: 'Need to reschedule? Reply to this message',
    },
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'All Ready',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Reschedule',
      },
    ],
  },

  /**
   * Service Completion Template
   * Sent after service completion with photos
   */
  SERVICE_COMPLETION: {
    name: 'service_completion_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '✅ Service Completed',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, your {{2}} service is now complete! ✨\n\nInvoice Amount: {{3}}\n\nBefore & after photos have been sent separately. We hope you\'re delighted with the results!\n\nYour payment link will follow shortly.',
    },
    footer: {
      type: 'TEXT',
      text: 'Thank you for choosing Somerset Window Cleaning',
    },
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Excellent Service',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Issue to Report',
      },
    ],
  },

  /**
   * Payment Request Template
   * Sent after service with secure payment link
   */
  PAYMENT_REQUEST: {
    name: 'payment_request_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '💳 Secure Payment',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, your {{2}} service invoice is ready for payment.\n\nAmount: {{3}}\nReference: {{4}}\n\nPay securely online using the link below. Card payments accepted (Visa, Mastercard, Amex).\n\nThank you for your business! 🏠',
    },
    footer: {
      type: 'TEXT',
      text: 'Questions about payment? Reply to this message',
    },
    buttons: [
      {
        type: 'URL',
        text: 'Pay Now',
        url: '{{5}}', // Dynamic payment URL
      },
    ],
  },

  /**
   * Quote Ready Template
   * Sent when instant quote is calculated
   */
  QUOTE_READY: {
    name: 'quote_ready_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '💡 Your Quote is Ready',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, your {{2}} quote is ready!\n\n💰 Quote: {{3}}\n📅 Valid until: {{4}}\n🔢 Reference: {{5}}\n\nThis quote includes all materials and equipment. No hidden charges, fully insured service.\n\nReady to book? Reply to this message or call us directly.',
    },
    footer: {
      type: 'TEXT',
      text: 'Free quotes • No obligation • Professional service',
    },
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Book Now',
      },
      {
        type: 'QUICK_REPLY',
        text: 'More Info',
      },
    ],
  },

  /**
   * Weather Delay Template
   * Sent when weather affects scheduled service
   */
  WEATHER_DELAY: {
    name: 'weather_delay_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '🌧️ Weather Update',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, due to {{2}} we need to reschedule your appointment from {{3}} to {{4}}.\n\nSafety is our priority, and weather conditions affect the quality of our service. Your new slot is confirmed.\n\nSorry for any inconvenience caused.',
    },
    footer: {
      type: 'TEXT',
      text: 'Weather tracking for optimal service quality',
    },
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Understood',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Different Date',
      },
    ],
  },

  /**
   * Review Request Template
   * Sent 24 hours after service completion
   */
  REVIEW_REQUEST: {
    name: 'review_request_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '⭐ How Did We Do?',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, we hope you\'re delighted with your {{2}} service! ✨\n\nYour feedback helps us maintain our high standards and helps other customers make informed decisions.\n\nWould you mind leaving us a quick Google review?',
    },
    footer: {
      type: 'TEXT',
      text: 'Your review means the world to us',
    },
    buttons: [
      {
        type: 'URL',
        text: 'Leave Google Review',
        url: 'https://g.page/r/CYourGoogleReviewLinkHere/review',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Happy to Help',
      },
    ],
  },

  /**
   * Customer Welcome Template
   * Sent to new customers after first booking
   */
  CUSTOMER_WELCOME: {
    name: 'customer_welcome_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '🎉 Welcome to Somerset Window Cleaning',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, welcome to the Somerset Window Cleaning family! 🏠\n\nWe\'re committed to providing you with:\n✅ Professional, reliable service\n✅ Fully insured and trained staff\n✅ Competitive, transparent pricing\n✅ 100% satisfaction guarantee\n\nYour first appointment: {{2}}',
    },
    footer: {
      type: 'TEXT',
      text: 'Questions? Reply anytime - we\'re here to help',
    },
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Looking Forward',
      },
      {
        type: 'URL',
        text: 'View Services',
        url: 'https://somersetwindowcleaning.co.uk/services',
      },
    ],
  },

  /**
   * Emergency Weather Alert Template
   * Sent during severe weather conditions
   */
  EMERGENCY_WEATHER_ALERT: {
    name: 'emergency_weather_alert_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '🚨 Weather Alert',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, due to severe weather warnings ({{2}}) we\'ve temporarily suspended outdoor services for safety.\n\nYour appointment on {{3}} will be rescheduled once conditions improve. We\'ll contact you with new times.\n\nThank you for understanding our safety-first approach.',
    },
    footer: {
      type: 'TEXT',
      text: 'Safety first • Quality always',
    },
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Understood',
      },
      {
        type: 'URL',
        text: 'Weather Updates',
        url: 'https://www.metoffice.gov.uk/weather/warnings-and-advice',
      },
    ],
  },

  /**
   * Maintenance Reminder Template
   * Sent for regular customers when service is due
   */
  MAINTENANCE_REMINDER: {
    name: 'maintenance_reminder_swc',
    category: 'UTILITY' as const,
    language: 'en_GB',
    header: {
      type: 'TEXT',
      text: '🔄 Service Due',
    },
    body: {
      type: 'TEXT',
      text: 'Hi {{1}}, it\'s time for your regular {{2}} service! 🏠\n\nLast service: {{3}}\nRecommended frequency: {{4}}\n\nReady to book your next appointment? We have availability this week and next.\n\nKeeping your property looking its best! ✨',
    },
    footer: {
      type: 'TEXT',
      text: 'Regular maintenance • Consistent quality',
    },
    buttons: [
      {
        type: 'QUICK_REPLY',
        text: 'Book Now',
      },
      {
        type: 'QUICK_REPLY',
        text: 'Not Yet',
      },
    ],
  },
};

/**
 * Template creation payload for WhatsApp API
 */
export function getTemplatePayload(templateKey: keyof typeof WHATSAPP_TEMPLATES) {
  const template = WHATSAPP_TEMPLATES[templateKey];
  
  return {
    name: template.name,
    category: template.category,
    language: template.language,
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: template.header.text,
      },
      {
        type: 'BODY',
        text: template.body.text,
      },
      {
        type: 'FOOTER',
        text: template.footer.text,
      },
      ...(template.buttons ? [{
        type: 'BUTTONS',
        buttons: template.buttons,
      }] : []),
    ],
  };
}

/**
 * Template usage examples for documentation
 */
export const TEMPLATE_EXAMPLES = {
  BOOKING_CONFIRMATION: {
    customerName: 'John Smith',
    serviceType: 'Window Cleaning',
    appointmentDate: 'Friday, 15th March 2024',
    appointmentTime: '10:00 AM',
    confirmationCode: 'SWC-ABC123',
  },
  
  QUOTE_READY: {
    customerName: 'Sarah Johnson',
    serviceType: 'Gutter Clearing',
    quotedAmount: '£85',
    validUntil: '31st March 2024',
    quoteReference: 'QT-2024-045',
  },
  
  PAYMENT_REQUEST: {
    customerName: 'Mike Wilson',
    serviceType: 'Conservatory Cleaning',
    invoiceAmount: '£120',
    invoiceReference: 'INV-2024-089',
    paymentUrl: 'https://pay.somersetwindowcleaning.co.uk/INV-2024-089',
  },
};

/**
 * Template compliance notes for WhatsApp approval
 */
export const COMPLIANCE_NOTES = {
  BOOKING_CONFIRMATION: 'Transactional - confirms user-initiated booking',
  APPOINTMENT_REMINDER: 'Utility - service reminder for confirmed appointment',
  SERVICE_COMPLETION: 'Transactional - service completion notification',
  PAYMENT_REQUEST: 'Transactional - payment request for completed service',
  QUOTE_READY: 'Utility - requested quote delivery',
  WEATHER_DELAY: 'Utility - service disruption notification',
  REVIEW_REQUEST: 'Utility - post-service feedback request',
  CUSTOMER_WELCOME: 'Utility - new customer onboarding',
  EMERGENCY_WEATHER_ALERT: 'Utility - safety-related service disruption',
  MAINTENANCE_REMINDER: 'Utility - scheduled maintenance reminder',
};