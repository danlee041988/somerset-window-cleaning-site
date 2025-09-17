/**
 * Google Calendar Integration for Somerset Window Cleaning
 * Handles appointment scheduling and calendar management
 */

// Google Calendar API configuration
const GOOGLE_CALENDAR_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY;

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  location?: string;
  attendees?: Array<{
    email: string;
    displayName?: string;
  }>;
  status: 'confirmed' | 'tentative' | 'cancelled';
}

export interface AvailableSlot {
  dateTime: string;
  duration: number; // in minutes
  type: 'consultation' | 'service' | 'quote';
  serviceName?: string;
}

export interface BookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  propertyAddress: string;
  preferredDate?: string;
  preferredTime?: string;
  specialRequirements?: string;
  estimatedDuration: number;
}

export interface BookingResult {
  success: boolean;
  eventId?: string;
  eventUrl?: string;
  confirmationCode?: string;
  error?: string;
  suggestedAlternatives?: AvailableSlot[];
}

// Business calendar configuration
export const CALENDAR_CONFIG = {
  calendarId: 'primary', // Somerset Window Cleaning business calendar
  timeZone: 'Europe/London',
  businessHours: {
    start: '08:00',
    end: '17:00',
    workingDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  },
  serviceTypes: {
    consultation: { duration: 30, color: '#4285F4' },
    quote: { duration: 45, color: '#F4B400' },
    'window-cleaning': { duration: 120, color: '#0F9D58' },
    'gutter-clearing': { duration: 180, color: '#DB4437' },
    'conservatory-cleaning': { duration: 150, color: '#9C27B0' },
    'solar-panel-cleaning': { duration: 90, color: '#FF5722' },
  },
};

/**
 * Get available time slots for scheduling
 */
export async function getAvailableSlots(
  serviceType: string,
  startDate: string,
  endDate: string
): Promise<AvailableSlot[]> {
  if (!GOOGLE_CALENDAR_API_KEY) {
    console.warn('Google Calendar API key not configured');
    return [];
  }

  try {
    const timeMin = new Date(startDate).toISOString();
    const timeMax = new Date(endDate).toISOString();
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_CONFIG.calendarId}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Calendar API error: ${data.error?.message || 'Unknown error'}`);
    }

    // Get busy periods from existing events
    const busyPeriods = data.items?.map((event: any) => ({
      start: new Date(event.start.dateTime || event.start.date),
      end: new Date(event.end.dateTime || event.end.date),
    })) || [];

    // Generate available slots
    const availableSlots = generateAvailableSlots(
      new Date(startDate),
      new Date(endDate),
      busyPeriods,
      serviceType
    );

    return availableSlots;
  } catch (error) {
    console.error('Error fetching available slots:', error);
    return [];
  }
}

/**
 * Generate available time slots based on business hours and existing bookings
 */
function generateAvailableSlots(
  startDate: Date,
  endDate: Date,
  busyPeriods: Array<{ start: Date; end: Date }>,
  serviceType: string
): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const serviceDuration = CALENDAR_CONFIG.serviceTypes[serviceType as keyof typeof CALENDAR_CONFIG.serviceTypes]?.duration || 60;
  
  const current = new Date(startDate);
  current.setHours(0, 0, 0, 0);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    
    // Check if it's a working day
    if (CALENDAR_CONFIG.businessHours.workingDays.includes(dayOfWeek)) {
      const daySlots = generateDaySlots(current, busyPeriods, serviceDuration, serviceType);
      slots.push(...daySlots);
    }
    
    current.setDate(current.getDate() + 1);
  }

  return slots;
}

/**
 * Generate available slots for a specific day
 */
function generateDaySlots(
  date: Date,
  busyPeriods: Array<{ start: Date; end: Date }>,
  duration: number,
  serviceType: string
): AvailableSlot[] {
  const slots: AvailableSlot[] = [];
  const [startHour, startMinute] = CALENDAR_CONFIG.businessHours.start.split(':').map(Number);
  const [endHour, endMinute] = CALENDAR_CONFIG.businessHours.end.split(':').map(Number);
  
  const startTime = new Date(date);
  startTime.setHours(startHour, startMinute, 0, 0);
  
  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);
  
  const current = new Date(startTime);
  
  while (current.getTime() + (duration * 60 * 1000) <= endTime.getTime()) {
    const slotEnd = new Date(current.getTime() + (duration * 60 * 1000));
    
    // Check if this slot conflicts with any busy periods
    const hasConflict = busyPeriods.some(busy => 
      (current >= busy.start && current < busy.end) ||
      (slotEnd > busy.start && slotEnd <= busy.end) ||
      (current <= busy.start && slotEnd >= busy.end)
    );
    
    if (!hasConflict) {
      slots.push({
        dateTime: current.toISOString(),
        duration,
        type: getSlotType(serviceType),
        serviceName: serviceType,
      });
    }
    
    // Move to next 30-minute slot
    current.setTime(current.getTime() + (30 * 60 * 1000));
  }
  
  return slots;
}

/**
 * Determine slot type based on service
 */
function getSlotType(serviceType: string): 'consultation' | 'service' | 'quote' {
  if (serviceType.includes('consultation')) return 'consultation';
  if (serviceType.includes('quote')) return 'quote';
  return 'service';
}

/**
 * Book an appointment in the calendar
 */
export async function bookAppointment(booking: BookingRequest): Promise<BookingResult> {
  if (!GOOGLE_CALENDAR_API_KEY) {
    return {
      success: false,
      error: 'Calendar API not configured'
    };
  }

  try {
    // For now, we'll create a mock booking since we need OAuth for writing to calendar
    const confirmationCode = generateConfirmationCode();
    const startDateTime = booking.preferredDate && booking.preferredTime 
      ? new Date(`${booking.preferredDate}T${booking.preferredTime}`)
      : getNextAvailableSlot(booking.serviceType);

    if (!startDateTime) {
      return {
        success: false,
        error: 'No available slots found',
        suggestedAlternatives: await getAvailableSlots(
          booking.serviceType,
          new Date().toISOString(),
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        )
      };
    }

    const endDateTime = new Date(startDateTime.getTime() + (booking.estimatedDuration * 60 * 1000));

    // In a real implementation, this would create the calendar event
    const mockEventId = `swc_${Date.now()}`;
    
    return {
      success: true,
      eventId: mockEventId,
      eventUrl: `https://calendar.google.com/calendar/event?eid=${mockEventId}`,
      confirmationCode,
    };
  } catch (error) {
    console.error('Error booking appointment:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Get the next available slot for a service type
 */
function getNextAvailableSlot(serviceType: string): Date | null {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0); // Default to 9 AM
  
  return tomorrow;
}

/**
 * Generate a unique confirmation code
 */
function generateConfirmationCode(): string {
  const prefix = 'SWC';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Cancel an appointment
 */
export async function cancelAppointment(eventId: string): Promise<boolean> {
  if (!GOOGLE_CALENDAR_API_KEY) {
    console.warn('Calendar API not configured');
    return false;
  }

  try {
    // In a real implementation, this would delete the calendar event
    console.log(`Cancelling appointment: ${eventId}`);
    return true;
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    return false;
  }
}

/**
 * Get upcoming appointments
 */
export async function getUpcomingAppointments(limit: number = 10): Promise<CalendarEvent[]> {
  if (!GOOGLE_CALENDAR_API_KEY) {
    console.warn('Calendar API not configured');
    return [];
  }

  try {
    const timeMin = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_CONFIG.calendarId}/events?key=${GOOGLE_CALENDAR_API_KEY}&timeMin=${timeMin}&maxResults=${limit}&singleEvents=true&orderBy=startTime`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Calendar API error: ${data.error?.message || 'Unknown error'}`);
    }

    return data.items?.map((event: any) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      start: {
        dateTime: event.start.dateTime || event.start.date,
        timeZone: event.start.timeZone || CALENDAR_CONFIG.timeZone,
      },
      end: {
        dateTime: event.end.dateTime || event.end.date,
        timeZone: event.end.timeZone || CALENDAR_CONFIG.timeZone,
      },
      location: event.location,
      attendees: event.attendees,
      status: event.status,
    })) || [];
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return [];
  }
}

/**
 * Format appointment for display
 */
export function formatAppointment(event: CalendarEvent): {
  title: string;
  date: string;
  time: string;
  duration: string;
  location: string;
} {
  const start = new Date(event.start.dateTime);
  const end = new Date(event.end.dateTime);
  
  const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  
  return {
    title: event.summary,
    date: start.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    time: start.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    duration: `${duration} minutes`,
    location: event.location || 'Customer property',
  };
}

/**
 * Check if a time slot is available
 */
export async function isSlotAvailable(
  dateTime: string,
  duration: number
): Promise<boolean> {
  const startDate = new Date(dateTime);
  const endDate = new Date(startDate.getTime() + (duration * 60 * 1000));
  
  const availableSlots = await getAvailableSlots(
    'service',
    startDate.toISOString(),
    endDate.toISOString()
  );
  
  return availableSlots.some(slot => 
    new Date(slot.dateTime).getTime() === startDate.getTime()
  );
}