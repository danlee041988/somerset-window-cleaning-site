/**
 * WhatsApp Business API Integration for Somerset Window Cleaning
 * Official WhatsApp Business Platform integration with message templates,
 * automated workflows, and webhook handling
 */

// WhatsApp Business API configuration
const WHATSAPP_API_URL = 'https://graph.facebook.com/v18.0';
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

export interface WhatsAppMessage {
  to: string;
  type: 'text' | 'template' | 'image' | 'document' | 'location';
  text?: {
    body: string;
    preview_url?: boolean;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
        image?: { link: string };
        document?: { link: string; filename: string };
      }>;
    }>;
  };
  image?: {
    link: string;
    caption?: string;
  };
  document?: {
    link: string;
    caption?: string;
    filename: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
}

export interface WhatsAppContact {
  phone: string;
  name: string;
  email?: string;
  lastMessageAt?: Date;
  preferences: {
    appointmentReminders: boolean;
    serviceUpdates: boolean;
    marketingMessages: boolean;
  };
  serviceHistory: Array<{
    date: string;
    service: string;
    satisfaction: number;
  }>;
}

export interface BookingNotification {
  customerName: string;
  customerPhone: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  propertyAddress: string;
  confirmationCode: string;
  estimatedDuration: number;
}

export interface ServiceCompletionData {
  customerName: string;
  customerPhone: string;
  serviceType: string;
  completionDate: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  invoiceAmount: number;
  paymentLink?: string;
}

// Message templates for different scenarios
export const MESSAGE_TEMPLATES = {
  BOOKING_CONFIRMATION: 'booking_confirmation_swc',
  APPOINTMENT_REMINDER: 'appointment_reminder_swc',
  SERVICE_COMPLETION: 'service_completion_swc',
  PAYMENT_REQUEST: 'payment_request_swc',
  REVIEW_REQUEST: 'review_request_swc',
  QUOTE_READY: 'quote_ready_swc',
  WEATHER_DELAY: 'weather_delay_swc',
  CUSTOMER_WELCOME: 'customer_welcome_swc',
};

/**
 * Send a WhatsApp message using the Business API
 */
export async function sendWhatsAppMessage(message: WhatsAppMessage): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    console.warn('WhatsApp Business API not configured');
    return { success: false, error: 'WhatsApp API not configured' };
  }

  try {
    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${data.error?.message || 'Unknown error'}`);
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error('WhatsApp message send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send booking confirmation via WhatsApp
 */
export async function sendBookingConfirmation(booking: BookingNotification): Promise<boolean> {
  const message: WhatsAppMessage = {
    to: booking.customerPhone,
    type: 'template',
    template: {
      name: MESSAGE_TEMPLATES.BOOKING_CONFIRMATION,
      language: { code: 'en_GB' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: booking.customerName },
            { type: 'text', text: booking.serviceType },
            { type: 'text', text: formatDate(booking.appointmentDate) },
            { type: 'text', text: booking.appointmentTime },
            { type: 'text', text: booking.confirmationCode },
          ],
        },
      ],
    },
  };

  const result = await sendWhatsAppMessage(message);
  return result.success;
}

/**
 * Send appointment reminder 24 hours before service
 */
export async function sendAppointmentReminder(booking: BookingNotification): Promise<boolean> {
  const message: WhatsAppMessage = {
    to: booking.customerPhone,
    type: 'template',
    template: {
      name: MESSAGE_TEMPLATES.APPOINTMENT_REMINDER,
      language: { code: 'en_GB' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: booking.customerName },
            { type: 'text', text: booking.serviceType },
            { type: 'text', text: 'tomorrow' },
            { type: 'text', text: booking.appointmentTime },
          ],
        },
      ],
    },
  };

  const result = await sendWhatsAppMessage(message);
  return result.success;
}

/**
 * Send service completion notification with photos and payment request
 */
export async function sendServiceCompletion(completion: ServiceCompletionData): Promise<boolean> {
  try {
    // Send completion message with template
    const completionMessage: WhatsAppMessage = {
      to: completion.customerPhone,
      type: 'template',
      template: {
        name: MESSAGE_TEMPLATES.SERVICE_COMPLETION,
        language: { code: 'en_GB' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: completion.customerName },
              { type: 'text', text: completion.serviceType },
              { type: 'text', text: `£${completion.invoiceAmount}` },
            ],
          },
        ],
      },
    };

    await sendWhatsAppMessage(completionMessage);

    // Send before/after photos if available
    if (completion.afterPhotos && completion.afterPhotos.length > 0) {
      for (const photoUrl of completion.afterPhotos.slice(0, 3)) {
        const photoMessage: WhatsAppMessage = {
          to: completion.customerPhone,
          type: 'image',
          image: {
            link: photoUrl,
            caption: `✨ ${completion.serviceType} completed - After photo`,
          },
        };
        await sendWhatsAppMessage(photoMessage);
      }
    }

    // Send payment link if available
    if (completion.paymentLink) {
      const paymentMessage: WhatsAppMessage = {
        to: completion.customerPhone,
        type: 'text',
        text: {
          body: `💳 *Secure Payment Link*\n\nPay for your ${completion.serviceType} service securely online:\n${completion.paymentLink}\n\nAmount: £${completion.invoiceAmount}\nReference: ${completion.completionDate}\n\nThank you for choosing Somerset Window Cleaning! 🏠✨`,
          preview_url: true,
        },
      };
      await sendWhatsAppMessage(paymentMessage);
    }

    return true;
  } catch (error) {
    console.error('Error sending service completion:', error);
    return false;
  }
}

/**
 * Send instant quote via WhatsApp
 */
export async function sendInstantQuote(quote: {
  customerName: string;
  customerPhone: string;
  serviceType: string;
  propertyAddress: string;
  quotedAmount: number;
  validUntil: string;
  quoteReference: string;
}): Promise<boolean> {
  const message: WhatsAppMessage = {
    to: quote.customerPhone,
    type: 'template',
    template: {
      name: MESSAGE_TEMPLATES.QUOTE_READY,
      language: { code: 'en_GB' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: quote.customerName },
            { type: 'text', text: quote.serviceType },
            { type: 'text', text: `£${quote.quotedAmount}` },
            { type: 'text', text: quote.validUntil },
            { type: 'text', text: quote.quoteReference },
          ],
        },
      ],
    },
  };

  const result = await sendWhatsAppMessage(message);
  return result.success;
}

/**
 * Send location pin for customer property
 */
export async function sendLocationPin(
  customerPhone: string,
  latitude: number,
  longitude: number,
  propertyAddress: string
): Promise<boolean> {
  const message: WhatsAppMessage = {
    to: customerPhone,
    type: 'location',
    location: {
      latitude,
      longitude,
      name: 'Your Property',
      address: propertyAddress,
    },
  };

  const result = await sendWhatsAppMessage(message);
  return result.success;
}

/**
 * Send weather delay notification
 */
export async function sendWeatherDelay(
  customerPhone: string,
  customerName: string,
  originalDate: string,
  newDate: string,
  reason: string
): Promise<boolean> {
  const message: WhatsAppMessage = {
    to: customerPhone,
    type: 'template',
    template: {
      name: MESSAGE_TEMPLATES.WEATHER_DELAY,
      language: { code: 'en_GB' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: customerName },
            { type: 'text', text: reason },
            { type: 'text', text: originalDate },
            { type: 'text', text: newDate },
          ],
        },
      ],
    },
  };

  const result = await sendWhatsAppMessage(message);
  return result.success;
}

/**
 * Send review request after service completion
 */
export async function sendReviewRequest(
  customerPhone: string,
  customerName: string,
  serviceType: string
): Promise<boolean> {
  const message: WhatsAppMessage = {
    to: customerPhone,
    type: 'template',
    template: {
      name: MESSAGE_TEMPLATES.REVIEW_REQUEST,
      language: { code: 'en_GB' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: customerName },
            { type: 'text', text: serviceType },
          ],
        },
      ],
    },
  };

  const result = await sendWhatsAppMessage(message);
  return result.success;
}

/**
 * Format date for WhatsApp messages
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Validate UK phone number for WhatsApp
 */
export function validateWhatsAppNumber(phoneNumber: string): {
  isValid: boolean;
  formattedNumber?: string;
  error?: string;
} {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // UK mobile numbers
  if (cleaned.startsWith('447') && cleaned.length === 13) {
    return { isValid: true, formattedNumber: cleaned };
  }
  
  // UK mobile starting with 07
  if (cleaned.startsWith('07') && cleaned.length === 11) {
    return { isValid: true, formattedNumber: `44${cleaned.substring(1)}` };
  }
  
  // UK mobile starting with +44
  if (cleaned.startsWith('447') && cleaned.length === 13) {
    return { isValid: true, formattedNumber: cleaned };
  }
  
  return {
    isValid: false,
    error: 'Please enter a valid UK mobile number (07xxx xxxxxx)',
  };
}

/**
 * Get WhatsApp Business Profile information
 */
export async function getBusinessProfile(): Promise<{
  success: boolean;
  profile?: any;
  error?: string;
}> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
    return { success: false, error: 'WhatsApp API not configured' };
  }

  try {
    const url = `${WHATSAPP_API_URL}/${WHATSAPP_PHONE_NUMBER_ID}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${data.error?.message || 'Unknown error'}`);
    }

    return { success: true, profile: data };
  } catch (error) {
    console.error('Error fetching business profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create message template (for setup)
 */
export async function createMessageTemplate(template: {
  name: string;
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  language: string;
  components: any[];
}): Promise<{ success: boolean; error?: string }> {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_BUSINESS_ACCOUNT_ID) {
    return { success: false, error: 'WhatsApp API not configured' };
  }

  try {
    const url = `${WHATSAPP_API_URL}/${WHATSAPP_BUSINESS_ACCOUNT_ID}/message_templates`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(template),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${data.error?.message || 'Unknown error'}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error creating message template:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * WhatsApp opt-in management
 */
export async function handleOptIn(phoneNumber: string, optInType: 'service' | 'marketing'): Promise<boolean> {
  // Store opt-in preferences in your database
  // This is a placeholder - implement actual database storage
  console.log(`User ${phoneNumber} opted in for ${optInType} messages`);
  return true;
}

export async function handleOptOut(phoneNumber: string): Promise<boolean> {
  // Remove from all messaging lists
  // This is a placeholder - implement actual database storage
  console.log(`User ${phoneNumber} opted out of all messages`);
  return true;
}

/**
 * Schedule automatic reminders (to be called by a cron job)
 */
export async function processScheduledReminders(): Promise<void> {
  // This would typically query your database for appointments in the next 24 hours
  // and send reminder messages automatically
  console.log('Processing scheduled WhatsApp reminders...');
}

/**
 * Analytics for WhatsApp messaging
 */
export interface WhatsAppAnalytics {
  messagesSent: number;
  messagesDelivered: number;
  messagesRead: number;
  optIns: number;
  optOuts: number;
  conversionRate: number;
}

export async function getWhatsAppAnalytics(dateRange: {
  start: string;
  end: string;
}): Promise<WhatsAppAnalytics> {
  // Placeholder for analytics implementation
  // Would integrate with WhatsApp Business API analytics endpoints
  return {
    messagesSent: 0,
    messagesDelivered: 0,
    messagesRead: 0,
    optIns: 0,
    optOuts: 0,
    conversionRate: 0,
  };
}