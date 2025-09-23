/**
 * WhatsApp Business API Webhook Handler
 * Handles incoming WhatsApp messages and delivery status updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { analytics } from '@/lib/analytics';

const WHATSAPP_WEBHOOK_VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

interface WhatsAppWebhookEntry {
  id: string;
  changes: Array<{
    value: {
      messaging_product: string;
      metadata: {
        display_phone_number: string;
        phone_number_id: string;
      };
      contacts?: Array<{
        profile: {
          name: string;
        };
        wa_id: string;
      }>;
      messages?: Array<{
        from: string;
        id: string;
        timestamp: string;
        text?: {
          body: string;
        };
        type: string;
      }>;
      statuses?: Array<{
        id: string;
        status: 'sent' | 'delivered' | 'read' | 'failed';
        timestamp: string;
        recipient_id: string;
        conversation?: {
          id: string;
          expiration_timestamp?: string;
          origin: {
            type: string;
          };
        };
        pricing?: {
          billable: boolean;
          pricing_model: string;
          category: string;
        };
      }>;
    };
    field: string;
  }>;
}

interface WhatsAppWebhookPayload {
  object: string;
  entry: WhatsAppWebhookEntry[];
}

/**
 * GET - Webhook verification
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    console.log('✅ WhatsApp webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn('❌ WhatsApp webhook verification failed');
  return new NextResponse('Forbidden', { status: 403 });
}

/**
 * POST - Handle incoming webhook events
 */
export async function POST(request: NextRequest) {
  try {
    const payload: WhatsAppWebhookPayload = await request.json();
    
    // Verify webhook payload
    if (payload.object !== 'whatsapp_business_account') {
      return new NextResponse('Invalid webhook object', { status: 400 });
    }

    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          await handleMessagesChange(change.value);
        }
      }
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Handle incoming messages and status updates
 */
async function handleMessagesChange(value: any) {
  // Handle incoming messages
  if (value.messages) {
    for (const message of value.messages) {
      await processIncomingMessage(message);
    }
  }

  // Handle message status updates
  if (value.statuses) {
    for (const status of value.statuses) {
      await processMessageStatus(status);
    }
  }
}

/**
 * Process incoming WhatsApp message
 */
async function processIncomingMessage(message: any) {
  const { from, text, type, timestamp } = message;
  
  console.log(`📱 Incoming WhatsApp message from ${from}:`, text?.body);

  try {
    // Track incoming message
    // analytics.trackCustomEvent('whatsapp_received', 'WhatsApp', type, 1);

    // Handle different message types
    switch (type) {
      case 'text':
        await handleTextMessage(from, text.body, timestamp);
        break;
      case 'button':
        await handleButtonMessage(message);
        break;
      case 'interactive':
        await handleInteractiveMessage(message);
        break;
      default:
        console.log(`Unsupported message type: ${type}`);
    }
  } catch (error) {
    console.error('Error processing incoming message:', error);
  }
}

/**
 * Handle text messages
 */
async function handleTextMessage(from: string, messageBody: string, timestamp: string) {
  const lowerMessage = messageBody.toLowerCase().trim();

  // Handle common responses
  if (lowerMessage === 'stop' || lowerMessage === 'unsubscribe') {
    await handleOptOut(from);
  } else if (lowerMessage.includes('reschedule') || lowerMessage.includes('change')) {
    await handleRescheduleRequest(from);
  } else if (lowerMessage.includes('cancel')) {
    await handleCancellationRequest(from);
  } else if (lowerMessage.includes('quote') || lowerMessage.includes('price')) {
    await handleQuoteRequest(from);
  } else if (lowerMessage.includes('book') || lowerMessage.includes('appointment')) {
    await handleBookingRequest(from);
  } else {
    // General inquiry - log for follow-up
    await logGeneralInquiry(from, messageBody, timestamp);
  }
}

/**
 * Handle button responses
 */
async function handleButtonMessage(message: any) {
  const { from, button } = message;
  const buttonText = button.text;

  console.log(`Button pressed by ${from}: ${buttonText}`);

  switch (buttonText) {
    case 'Reschedule':
      await handleRescheduleRequest(from);
      break;
    case 'Contact Us':
      await sendContactInformation(from);
      break;
    case 'All Ready':
      await acknowledgeReadiness(from);
      break;
    case 'Arrange Visit':
      await handleBookingRequest(from);
      break;
    case 'Update Details':
      await handleQuoteRequest(from);
      break;
    case 'Excellent Service':
      await handlePositiveFeedback(from);
      break;
    case 'Issue to Report':
      await handleServiceIssue(from);
      break;
    default:
      console.log(`Unhandled button: ${buttonText}`);
  }
}

/**
 * Handle interactive message responses
 */
async function handleInteractiveMessage(message: any) {
  // Handle list replies, button replies, etc.
  console.log('Interactive message received:', message);
}

/**
 * Process message status updates
 */
async function processMessageStatus(status: any) {
  const { id, status: messageStatus, recipient_id, timestamp } = status;
  
  console.log(`📊 Message ${id} to ${recipient_id}: ${messageStatus}`);

  // Track message delivery analytics
  // analytics.trackCustomEvent(`whatsapp_${messageStatus}`, 'WhatsApp Status', messageStatus, 1);

  // Update message status in database if needed
  // await updateMessageStatus(id, messageStatus, timestamp);
}

/**
 * Handle opt-out requests
 */
async function handleOptOut(phoneNumber: string) {
  console.log(`🚫 Opt-out request from ${phoneNumber}`);
  
  // Remove from messaging lists
  // await removeFromMessagingLists(phoneNumber);
  
  // Send confirmation (this is allowed even after opt-out)
  const confirmationMessage = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '✅ You have been unsubscribed from WhatsApp messages. You will no longer receive automated updates from Somerset Window Cleaning. Thank you for using our services.',
    },
  };

  // Note: In production, you would send this via the WhatsApp API
  console.log('Opt-out confirmation would be sent:', confirmationMessage);
}

/**
 * Handle reschedule requests
 */
async function handleRescheduleRequest(phoneNumber: string) {
  console.log(`📅 Reschedule request from ${phoneNumber}`);
  
  // In production, this would:
  // 1. Look up customer's upcoming appointments
  // 2. Send available alternative times
  // 3. Handle the rescheduling process
  
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '📅 We\'ll help you reschedule your appointment. Please call us at 07415 526331 or reply with your preferred date and time. Our team will confirm availability and update your booking.',
    },
  };

  console.log('Reschedule response would be sent:', response);
}

/**
 * Handle cancellation requests
 */
async function handleCancellationRequest(phoneNumber: string) {
  console.log(`❌ Cancellation request from ${phoneNumber}`);
  
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '😔 Sorry to hear you need to cancel. Please call us at 07415 526331 to confirm the cancellation. If you cancel 24+ hours in advance, there are no charges. We hope to serve you again in the future!',
    },
  };

  console.log('Cancellation response would be sent:', response);
}

/**
 * Handle quote requests
 */
async function handleQuoteRequest(phoneNumber: string) {
  console.log(`💰 Quote request from ${phoneNumber}`);
  
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '💰 Happy to provide a quote! Please share:\n\n🏠 Property address\n📏 Property type (house/flat)\n🏠 Number of bedrooms\n🪟 Services needed\n\nPrefer online? Send the form at somersetwindowcleaning.co.uk/book-appointment?intent=quote and we\'ll reply within one working day.',
    },
  };

  console.log('Quote response would be sent:', response);
}

/**
 * Handle booking requests
 */
async function handleBookingRequest(phoneNumber: string) {
  console.log(`📝 Booking request from ${phoneNumber}`);
  
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '🗓️ Ready to arrange your visit! Share your quote details at somersetwindowcleaning.co.uk/book-appointment?intent=quote so we can confirm pricing and visit times, or call us directly at 07415 526331.',
    },
  };

  console.log('Booking response would be sent:', response);
}

/**
 * Send contact information
 */
async function sendContactInformation(phoneNumber: string) {
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '📞 *Contact Somerset Window Cleaning*\n\n📱 Phone: 07415 526331\n📧 Email: info@somersetwindowcleaning.co.uk\n🌐 Website: somersetwindowcleaning.co.uk\n\n🕐 Operating Hours:\nMon-Sat: 8:00 AM - 5:00 PM\nSun: Emergency only\n\nWe\'re here to help! 🏠✨',
    },
  };

  console.log('Contact info would be sent:', response);
}

/**
 * Acknowledge customer readiness
 */
async function acknowledgeReadiness(phoneNumber: string) {
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '✅ Perfect! We\'re all set for your appointment tomorrow. Our team will arrive within 30 minutes of your scheduled time and will contact you just before arrival. Looking forward to providing excellent service! 🏠✨',
    },
  };

  console.log('Readiness acknowledgment would be sent:', response);
}

/**
 * Handle positive feedback
 */
async function handlePositiveFeedback(phoneNumber: string) {
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '🌟 Wonderful! We\'re delighted you\'re happy with our service. Your satisfaction is our priority!\n\nIf you have a moment, we\'d be grateful for a Google review: [Review Link]\n\nThank you for choosing Somerset Window Cleaning! 🏠✨',
    },
  };

  console.log('Positive feedback response would be sent:', response);
}

/**
 * Handle service issues
 */
async function handleServiceIssue(phoneNumber: string) {
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '😔 We\'re sorry to hear there\'s an issue. Customer satisfaction is our priority, and we want to make this right immediately.\n\nPlease call us at 07415 526331 or describe the issue here. We\'ll address it promptly and ensure you\'re completely satisfied with our service.',
    },
  };

  console.log('Service issue response would be sent:', response);
}

/**
 * Log general inquiries for follow-up
 */
async function logGeneralInquiry(phoneNumber: string, message: string, timestamp: string) {
  console.log(`📝 General inquiry from ${phoneNumber}: ${message}`);
  
  // In production, this would be stored in a database for manual follow-up
  const inquiry = {
    phoneNumber,
    message,
    timestamp,
    status: 'pending',
    priority: 'normal',
  };

  // Store inquiry for manual follow-up
  console.log('General inquiry logged:', inquiry);
  
  // Send acknowledgment
  const response = {
    to: phoneNumber,
    type: 'text' as const,
    text: {
      body: '👋 Thanks for your message! We\'ve received your inquiry and will get back to you as soon as possible during business hours (Mon-Sat 8AM-5PM).\n\nFor urgent matters, please call 07415 526331.',
    },
  };

  console.log('General inquiry acknowledgment would be sent:', response);
}
