import { z } from 'zod'

// Custom validation helpers
const ukPostcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i
const ukPhoneRegex = /^(\+44|0)[0-9\s-()]{10,}$/
const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

// Service options enum
export const SERVICE_OPTIONS = [
  'Window Cleaning',
  'Gutter Clearing', 
  'Conservatory Roof Cleaning',
  'Solar Panel Cleaning',
  'Fascias & Soffits Cleaning',
  'External Commercial Cleaning',
] as const

export const FREQUENCY_OPTIONS = [
  '4-weeks',
  '8-weeks', 
  '12-weeks',
  'ad-hoc'
] as const

export const CUSTOMER_TYPES = ['new', 'existing'] as const
export const CONTACT_METHODS = ['Email', 'Phone'] as const

// Property type and bedroom combinations
export const PROPERTY_TYPES = [
  'Detached house',
  'Terraced / Semi-detached house',
  'Commercial property'
] as const

export const BEDROOM_OPTIONS = [
  '1-2 bedrooms',
  '3 bedrooms',
  '4 bedrooms', 
  '5 bedrooms',
  '6+ bedrooms',
  'commercial'
] as const

// Main form validation schema
export const contactFormSchema = z.object({
  // Customer type - always required
  customer_type: z.enum(CUSTOMER_TYPES, {
    errorMap: () => ({ message: 'Please select whether you are a new or existing customer' })
  }),

  // Personal information - always required
  first_name: z.string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),

  last_name: z.string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),

  email: z.string()
    .min(1, 'Email address is required')
    .regex(emailRegex, 'Please enter a valid email address')
    .max(100, 'Email address is too long'),

  mobile: z.string()
    .min(1, 'Mobile number is required')
    .regex(ukPhoneRegex, 'Please enter a valid UK mobile number (e.g., 07123 456789)')
    .transform((val) => val.replace(/\s/g, '')), // Remove spaces for consistency

  property_address: z.string()
    .min(1, 'Property address is required')
    .min(10, 'Please enter a complete address including postcode')
    .max(200, 'Address is too long')
    .refine((val) => {
      // Basic check for UK postcode in address
      return ukPostcodeRegex.test(val.split(' ').slice(-2).join(' ')) || 
             ukPostcodeRegex.test(val.split(' ').slice(-1)[0])
    }, 'Please include a valid UK postcode in your address'),

  preferred_contact: z.enum(CONTACT_METHODS, {
    errorMap: () => ({ message: 'Please select your preferred contact method' })
  }),

  // Property information - required for new customers
  property_combo: z.string().optional(),
  property_type: z.enum(PROPERTY_TYPES).optional(),
  bedrooms: z.enum(BEDROOM_OPTIONS).optional(),
  has_extension: z.boolean().default(false),
  has_conservatory: z.boolean().default(false),
  property_notes: z.string().max(500, 'Property notes must be less than 500 characters').optional(),

  // Service requirements - always required
  services: z.array(z.enum(SERVICE_OPTIONS))
    .min(1, 'Please select at least one service')
    .max(6, 'Maximum 6 services can be selected'),

  frequency: z.enum(FREQUENCY_OPTIONS).optional(),

  // Additional message - optional
  message: z.string()
    .max(1000, 'Message must be less than 1000 characters')
    .optional(),

  // Photo uploads - optional
  customer_photos: z.any().optional(),

  // Hidden/system fields
  submission_date: z.string().optional(),
  submission_time: z.string().optional(),
  website: z.string().max(0, 'Spam protection triggered').optional(), // Honeypot
  recaptcha: z.string().min(1, 'Please complete the reCAPTCHA verification'),
})
.refine((data) => {
  // New customers must select property type and size
  if (data.customer_type === 'new') {
    return data.property_type && data.bedrooms
  }
  return true
}, {
  message: 'Please select your property type and size',
  path: ['property_combo']
})
.refine((data) => {
  // If window cleaning is selected, frequency is required
  if (data.services.includes('Window Cleaning')) {
    return data.frequency
  }
  return true
}, {
  message: 'Please select how often you would like your windows cleaned',
  path: ['frequency']
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Field validation helpers
export const validateField = (fieldName: keyof ContactFormData, value: any, allData?: Partial<ContactFormData>) => {
  try {
    // Get the field schema
    const fieldSchema = contactFormSchema.shape[fieldName]
    if (!fieldSchema) return { isValid: true }

    // For dependent validations, check the full object
    if (fieldName === 'property_combo' || fieldName === 'frequency') {
      contactFormSchema.parse({ ...allData, [fieldName]: value })
    } else {
      fieldSchema.parse(value)
    }
    
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || 'Invalid input'
      }
    }
    return { isValid: false, error: 'Validation error' }
  }
}

// Form submission validation
export const validateFormSubmission = (data: Partial<ContactFormData>) => {
  try {
    const validatedData = contactFormSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {}
      const otherErrors: string[] = []

      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path[0] as string
          fieldErrors[fieldName] = err.message
        } else {
          otherErrors.push(err.message)
        }
      })

      return {
        success: false,
        fieldErrors,
        generalErrors: otherErrors,
        errorCount: error.errors.length
      }
    }
    return {
      success: false,
      fieldErrors: {},
      generalErrors: ['An unexpected validation error occurred'],
      errorCount: 1
    }
  }
}

// Error message helpers
export const getErrorSeverity = (fieldName: string): 'error' | 'warning' | 'info' => {
  const criticalFields = ['first_name', 'last_name', 'email', 'mobile', 'property_address', 'services', 'customer_type']
  return criticalFields.includes(fieldName) ? 'error' : 'warning'
}

export const getFieldRequirementText = (fieldName: keyof ContactFormData, customerType?: 'new' | 'existing'): string => {
  const alwaysRequired = ['customer_type', 'first_name', 'last_name', 'email', 'mobile', 'property_address', 'preferred_contact', 'services']
  
  if (alwaysRequired.includes(fieldName)) {
    return 'Required'
  }
  
  if (customerType === 'new' && ['property_combo', 'property_type', 'bedrooms'].includes(fieldName)) {
    return 'Required for new customers'
  }
  
  if (fieldName === 'frequency') {
    return 'Required when Window Cleaning is selected'
  }
  
  return 'Optional'
}

// Success validation messages
export const getSuccessMessage = (fieldName: string, value: any): string | null => {
  switch (fieldName) {
    case 'email':
      return '✓ Valid email format'
    case 'mobile':
      return '✓ Valid UK mobile number'
    case 'property_address':
      return '✓ Address with postcode detected'
    case 'services':
      return `✓ ${Array.isArray(value) ? value.length : 0} service${Array.isArray(value) && value.length !== 1 ? 's' : ''} selected`
    default:
      return null
  }
}