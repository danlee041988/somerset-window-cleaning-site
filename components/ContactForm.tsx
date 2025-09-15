"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import ReCaptcha from './ReCaptcha'

type CustomerType = 'new' | 'existing'

type FormValues = {
  first_name: string
  last_name: string
  email: string
  mobile: string
  postcode: string
  preferred_contact: 'Email' | 'Phone'
  
  // Property information (especially for new customers)
  property_combo?: string // Combined property type and bedrooms
  property_type: string
  bedrooms: string
  has_extension: boolean
  has_conservatory: boolean
  property_notes?: string
  
  // Service requirements
  services: string[]
  frequency: '4-weeks' | '8-weeks' | '12-weeks' | 'ad-hoc'
  
  // Additional message
  message?: string
  
  // Hidden fields for EmailJS
  customer_type?: CustomerType
  submission_date?: string
  submission_time?: string
  
  // Honeypot
  website?: string
  
  // reCAPTCHA
  recaptcha?: string
}

const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''

const SERVICE_OPTIONS = [
  'Window Cleaning',
  'Gutter Clearing',
  'Conservatory Roof Cleaning',
  'Solar Panel Cleaning',
  'Fascias & Soffits Cleaning',
  'External Commercial Cleaning',
] as const

const BEDROOM_OPTIONS = [
  {
    label: '1-2 bedrooms',
    value: '1-2 bedrooms',
    basePrice: 18,
    description: 'Small property'
  },
  {
    label: '3 bedrooms',
    value: '3 bedrooms', 
    basePrice: 25,
    description: 'Family home'
  },
  {
    label: '4 bedrooms',
    value: '4 bedrooms',
    basePrice: 30,
    description: 'Large family home'
  },
  {
    label: '5 bedrooms',
    value: '5 bedrooms',
    basePrice: 35,
    description: 'Large property'
  },
  {
    label: '6+ bedrooms',
    value: '6+ bedrooms',
    basePrice: null, // Requires visit
    description: 'Very large property - requires visit'
  },
  {
    label: 'Commercial',
    value: 'commercial',
    basePrice: null, // Always requires custom quote
    description: 'Business property'
  },
] as const

const PROPERTY_TYPE_OPTIONS = [
  'Detached house',
  'Terraced / Semi-detached house',
] as const

const COMMERCIAL_OPTION = 'Commercial property'

interface ContactFormProps {
  defaultPostcode?: string
  defaultService?: string
}

export default function ContactForm({ defaultPostcode, defaultService }: ContactFormProps = {}) {
  const formRef = React.useRef<HTMLFormElement>(null)
  
  // Utility function to format postcodes with proper spacing
  const formatPostcode = (input: string): string => {
    // Remove all spaces and convert to uppercase
    const cleaned = input.replace(/\s/g, '').toUpperCase()
    
    // UK postcode format: AA9A 9AA, AA9 9AA, AA99 9AA, A9A 9AA, A9 9AA, A99 9AA
    // Match the pattern and add space before the last 3 characters
    if (cleaned.length >= 5) {
      const beforeSpace = cleaned.slice(0, -3)
      const afterSpace = cleaned.slice(-3)
      return `${beforeSpace} ${afterSpace}`
    }
    
    return cleaned
  }

  // Map service query parameter to actual service name
  const getServiceName = (serviceParam?: string) => {
    if (!serviceParam) return []
    
    const serviceMap: Record<string, string> = {
      'window-cleaning': 'Window Cleaning',
      'gutter-clearing': 'Gutter Clearing',
      'conservatory-cleaning': 'Conservatory Roof Cleaning',
      'solar-cleaning': 'Solar Panel Cleaning',
      'fascias-soffits': 'Fascias & Soffits Cleaning',
      'commercial-cleaning': 'External Commercial Cleaning',
    }
    
    const serviceName = serviceMap[serviceParam]
    return serviceName ? [serviceName] : []
  }
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    reset, 
    setError, 
    clearErrors, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<FormValues>({
    defaultValues: { 
      postcode: defaultPostcode ? formatPostcode(defaultPostcode) : '',
      preferred_contact: 'Email', 
      services: getServiceName(defaultService),
      frequency: '8-weeks',
      has_extension: false,
      has_conservatory: false,
      customer_type: 'new'
    }
  })
  
  // Handler for postcode input formatting
  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostcode(e.target.value)
    setValue('postcode', formatted)
  }

  // Pricing calculation function
  const calculateWindowCleaningPrice = () => {
    const selectedBedrooms = watch('bedrooms')
    const propertyType = watch('property_type')
    const hasExtension = watch('has_extension')
    const hasConservatory = watch('has_conservatory')

    // Find the selected bedroom option
    const bedroomOption = BEDROOM_OPTIONS.find(option => option.value === selectedBedrooms)
    if (!bedroomOption || bedroomOption.basePrice === null) {
      return null // Requires visit
    }

    let total = bedroomOption.basePrice

    // Add detached house surcharge
    if (propertyType === 'Detached house') {
      total += 5
    }

    // Add extension surcharge
    if (hasExtension) {
      total += 5
    }

    // Add conservatory surcharge
    if (hasConservatory) {
      total += 5
    }

    return total
  }

  // Get pricing breakdown
  const getPricingBreakdown = () => {
    const selectedBedrooms = watch('bedrooms')
    const propertyType = watch('property_type')
    const hasExtension = watch('has_extension')
    const hasConservatory = watch('has_conservatory')

    // Commercial properties always require custom quote
    if (propertyType === COMMERCIAL_OPTION || selectedBedrooms === 'commercial') {
      return { requiresVisit: true, breakdown: [], isCommercial: true }
    }

    const bedroomOption = BEDROOM_OPTIONS.find(option => option.value === selectedBedrooms)
    if (!bedroomOption || bedroomOption.basePrice === null) {
      return { requiresVisit: true, breakdown: [] }
    }

    const breakdown: Array<{ item: string; price: number }> = [
      { item: selectedBedrooms, price: bedroomOption.basePrice }
    ]

    if (propertyType === 'Detached house') {
      breakdown.push({ item: 'Detached house surcharge', price: 5 })
    }

    if (hasExtension) {
      breakdown.push({ item: 'Extension cleaning', price: 5 })
    }

    if (hasConservatory) {
      breakdown.push({ item: 'Conservatory cleaning', price: 5 })
    }

    return { requiresVisit: false, breakdown }
  }
  
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)
  const start = React.useRef<number>(Date.now())

  const selectedServices = watch('services') || []
  const preferredContact = watch('preferred_contact')
  const selectedFrequency = watch('frequency')
  const customerType = watch('customer_type') || 'new'
  const hasWindowCleaning = selectedServices.includes('Window Cleaning')

  // reCAPTCHA handlers
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    if (token) {
      clearErrors('recaptcha')
    }
  }

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null)
    setError('recaptcha', { type: 'manual', message: 'reCAPTCHA expired, please try again' })
  }

  // Set hidden timestamp fields
  React.useEffect(() => {
    const now = new Date()
    setValue('submission_date', now.toISOString().split('T')[0])
    setValue('submission_time', now.toTimeString().split(' ')[0])
  }, [setValue])

  const onSubmit = async (values: FormValues) => {
    setStatus('idle')
    
    // Honeypot + time-trap
    if (values.website) return
    const elapsed = Date.now() - start.current
    if (elapsed < 2000) return // Prevent bot submissions

    // Validation
    if (!values.services || values.services.length === 0) {
      setError('services', { type: 'manual', message: 'Please select at least one service' })
      return
    }
    clearErrors('services')

    // reCAPTCHA validation
    if (!recaptchaToken) {
      setError('recaptcha', { type: 'manual', message: 'Please complete the reCAPTCHA verification' })
      return
    }
    clearErrors('recaptcha')

    // Prepare data for EmailJS
    const form = formRef.current
    if (!form) return

    const fullName = `${values.first_name} ${values.last_name}`.trim()
    const now = new Date()

    // Ensure hidden fields for EmailJS compatibility
    const ensureHidden = (name: string, value: string) => {
      let input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`)
      if (!input) {
        input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        form.appendChild(input)
      }
      input.value = value
    }

    // Map form data to EmailJS template fields
    ensureHidden('name', fullName)
    ensureHidden('phone', values.mobile)
    ensureHidden('services_list', values.services.join(', '))
    ensureHidden('property_type_field', values.property_type)
    ensureHidden('property_bedrooms', values.bedrooms)
    ensureHidden('property_extension', values.has_extension ? 'Yes' : 'No')
    ensureHidden('property_conservatory', values.has_conservatory ? 'Yes' : 'No')
    ensureHidden('cleaning_frequency', values.frequency.replace('-', ' '))
    ensureHidden('customer_type_field', customerType === 'new' ? 'New Customer' : 'Existing Customer')
    ensureHidden('submitted_at', now.toLocaleString('en-GB'))
    ensureHidden('submitted_date', now.toLocaleDateString('en-GB'))
    ensureHidden('submitted_time', now.toLocaleTimeString('en-GB'))
    ensureHidden('recaptcha_token', recaptchaToken)

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      setStatus('success')
      setRecaptchaToken(null) // Reset reCAPTCHA
      reset()
    } catch (e) {
      console.error('EmailJS Error:', e)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">Message sent successfully!</h3>
        <p className="text-white/80 mb-6">
          Thank you for getting in touch. We&apos;ll review your requirements and get back to you within the first working day.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/70">Response within 1 working day</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/70">No hidden fees</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/70">Professional service</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-red to-transparent" />
      
      <div className="p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent mb-3">
            {customerType === 'new' ? 'Get Your Free Quote' : 'Update Your Details'}
          </h2>
          <p className="text-white/80">
            {customerType === 'new' 
              ? 'Tell us about your property and we&apos;ll provide a comprehensive quotation with transparent pricing.'
              : 'Update your contact details or add additional services to your existing plan.'
            }
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              I am a...
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 p-4 rounded-lg border border-white/20 bg-white/5 cursor-pointer hover:border-brand-red/50 transition-colors">
                <input 
                  type="radio" 
                  value="new" 
                  className="mt-1 accent-brand-red" 
                  {...register('customer_type', { required: true })} 
                />
                <div>
                  <div className="font-medium text-white">New Customer</div>
                  <div className="text-sm text-white/70 mt-1">Ready to book our services? Get a comprehensive quotation for your property.</div>
                </div>
              </label>
              
              <label className="flex items-start gap-3 p-4 rounded-lg border border-white/20 bg-white/5 cursor-pointer hover:border-brand-red/50 transition-colors">
                <input 
                  type="radio" 
                  value="existing" 
                  className="mt-1 accent-brand-red" 
                  {...register('customer_type', { required: true })} 
                />
                <div>
                  <div className="font-medium text-white">Existing Customer</div>
                  <div className="text-sm text-white/70 mt-1">Update your details, book additional services, or make changes to your schedule.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  placeholder="Your first name"
                  {...register('first_name', { 
                    required: 'First name is required',
                    minLength: { value: 2, message: 'First name must be at least 2 characters' }
                  })}
                />
                {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  placeholder="Your last name"
                  {...register('last_name', { 
                    required: 'Last name is required',
                    minLength: { value: 2, message: 'Last name must be at least 2 characters' }
                  })}
                />
                {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                  {...register('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  placeholder="07123 456789"
                  {...register('mobile', { 
                    required: 'Mobile number is required',
                    pattern: {
                      value: /^(\+44|0)[0-9\s-()]{10,}$/,
                      message: 'Please enter a valid UK mobile number'
                    }
                  })}
                />
                {errors.mobile && <p className="mt-1 text-xs text-red-400">{errors.mobile.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Postcode *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  placeholder="BA16 0HW"
                  maxLength={8}
                  {...register('postcode', { 
                    required: 'Postcode is required',
                    pattern: {
                      value: /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i,
                      message: 'Please enter a valid UK postcode'
                    },
                    onChange: handlePostcodeChange
                  })}
                />
                {errors.postcode && <p className="mt-1 text-xs text-red-400">{errors.postcode.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Preferred Contact Method *
                </label>
                <div className="flex gap-3 rounded-lg border border-white/20 bg-white/5 p-3">
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="radio" 
                      value="Email" 
                      className="accent-brand-red" 
                      {...register('preferred_contact', { required: true })} 
                    />
                    Email
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="radio" 
                      value="Phone" 
                      className="accent-brand-red" 
                      {...register('preferred_contact', { required: true })} 
                    />
                    Phone
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Property Information - Only for new customers */}
          {customerType === 'new' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Property Information
                <span className="text-xs text-brand-red font-normal">(helps us provide accurate pricing)</span>
              </h3>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-3">
                  Property Type & Size *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {PROPERTY_TYPE_OPTIONS.map((propertyType) => (
                    <div key={propertyType} className="space-y-2">
                      <h4 className="text-sm font-semibold text-white/90 px-2">{propertyType}</h4>
                      {BEDROOM_OPTIONS.map((option) => {
                        const combinedValue = `${propertyType}|${option.value}`
                        const adjustedPrice = option.basePrice ? 
                          (propertyType === 'Detached house' ? option.basePrice + 5 : option.basePrice) : 
                          null
                        
                        return (
                          <label 
                            key={combinedValue}
                            className="relative flex flex-col p-2 rounded-lg border border-white/20 bg-white/5 cursor-pointer hover:border-brand-red/50 transition-all duration-200 hover:bg-white/10"
                          >
                            <input 
                              type="radio" 
                              value={combinedValue}
                              className="absolute top-1 right-1 accent-brand-red scale-75" 
                              {...register('property_combo', { required: 'Please select property type and size' })} 
                              onChange={(e) => {
                                const [type, bedrooms] = e.target.value.split('|')
                                setValue('property_type', type)
                                setValue('bedrooms', bedrooms)
                              }}
                            />
                            <div className="pr-4">
                              <div className="font-medium text-white text-xs">{option.label}</div>
                              <div className="text-sm font-semibold text-green-400 mt-1">
                                {adjustedPrice ? `£${adjustedPrice}` : 'Quote'}
                                {propertyType === 'Detached house' && option.basePrice && (
                                  <span className="text-xs text-white/60 ml-1">(+£5)</span>
                                )}
                              </div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  ))}
                </div>

                {/* Commercial Property Option */}
                <div className="mt-6">
                  <h4 className="text-sm font-semibold text-white/90 mb-3">Commercial Property</h4>
                  <label className="relative flex flex-col p-3 rounded-lg border border-white/20 bg-white/5 cursor-pointer hover:border-brand-red/50 transition-all duration-200 hover:bg-white/10">
                    <input 
                      type="radio" 
                      value={`${COMMERCIAL_OPTION}|commercial`}
                      className="absolute top-2 right-2 accent-brand-red" 
                      {...register('property_combo', { required: 'Please select property type and size' })} 
                      onChange={(e) => {
                        setValue('property_type', COMMERCIAL_OPTION)
                        setValue('bedrooms', 'commercial')
                      }}
                    />
                    <div className="pr-6">
                      <div className="font-medium text-white text-sm">{COMMERCIAL_OPTION}</div>
                      <div className="text-xs text-white/60 mt-1">Office, shop, restaurant, or other business</div>
                      <div className="text-sm font-semibold text-blue-400 mt-2">
                        Custom Quote Required
                      </div>
                      <div className="text-xs text-white/50 mt-1">
                        Pricing based on size, access, and requirements
                      </div>
                    </div>
                  </label>
                </div>

                {errors.property_combo && <p className="mt-2 text-xs text-red-400">{errors.property_combo.message}</p>}
                {errors.property_type && <p className="mt-2 text-xs text-red-400">{errors.property_type.message}</p>}
                {errors.bedrooms && <p className="mt-2 text-xs text-red-400">{errors.bedrooms.message}</p>}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Property Features
                </label>
                <div className="space-y-2 rounded-lg border border-white/20 bg-white/5 p-3">
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-brand-red" 
                      {...register('has_extension')} 
                    />
                    Has extension (+£5)
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-brand-red" 
                      {...register('has_conservatory')} 
                    />
                    Has conservatory (+£5)
                  </label>
                </div>
              </div>

              {/* Dynamic Pricing Calculator */}
              {(watch('bedrooms') || watch('property_type') || watch('has_extension') || watch('has_conservatory')) && (
                <div className="md:col-span-2">
                  <div className="rounded-lg border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-500/5 p-4">
                    <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Window Cleaning Quote Calculator
                    </h4>
                    
                    {(() => {
                      const pricingInfo = getPricingBreakdown()
                      const totalPrice = calculateWindowCleaningPrice()
                      
                      if (pricingInfo.requiresVisit) {
                        return (
                          <div className="text-center p-4 rounded-lg bg-orange-500/20 border border-orange-500/30">
                            <div className="text-orange-400 font-semibold mb-2">🏠 Property Visit Required</div>
                            <p className="text-sm text-white/90">
                              For properties with 6+ bedrooms, we provide custom quotes after a free property assessment.
                            </p>
                          </div>
                        )
                      }
                      
                      if (pricingInfo.breakdown.length === 0) {
                        return (
                          <p className="text-sm text-white/70">
                            Select your property details above to see pricing
                          </p>
                        )
                      }
                      
                      return (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            {pricingInfo.breakdown.map((item, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span className="text-white/90">{item.item}</span>
                                <span className="text-green-400 font-medium">£{item.price}</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="border-t border-white/20 pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-white">Total Price:</span>
                              <span className="text-2xl font-bold text-green-400">£{totalPrice}</span>
                            </div>
                            <p className="text-xs text-white/60 mt-1">
                              * Final price may vary based on property access and specific requirements
                            </p>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Additional Property Notes
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors resize-none"
                  placeholder="e.g., difficult access, high windows, special requirements..."
                  {...register('property_notes')}
                />
              </div>
            </div>
            </div>
          )}

          {/* Service Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Service Requirements
            </h3>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Which services are you interested in? * (select multiple)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-lg border border-white/20 bg-white/5 p-4">
                {SERVICE_OPTIONS.map((service) => (
                  <label key={service} className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input
                      type="checkbox"
                      value={service}
                      className="accent-brand-red"
                      {...register('services', { required: 'Please select at least one service' })}
                    />
                    {service}
                  </label>
                ))}
              </div>
              {errors.services && <p className="mt-1 text-xs text-red-400">{errors.services.message}</p>}
            </div>

            {hasWindowCleaning && (
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  How often would you like your windows cleaned? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-white/20 bg-white/5 text-sm text-white cursor-pointer hover:border-brand-red/50 transition-colors">
                    <input 
                      type="radio" 
                      value="4-weeks" 
                      className="accent-brand-red" 
                      {...register('frequency', { required: hasWindowCleaning })} 
                    />
                    Every 4 weeks
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-white/20 bg-white/5 text-sm text-white cursor-pointer hover:border-brand-red/50 transition-colors">
                    <input 
                      type="radio" 
                      value="8-weeks" 
                      className="accent-brand-red" 
                      {...register('frequency', { required: hasWindowCleaning })} 
                    />
                    Every 8 weeks
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-white/20 bg-white/5 text-sm text-white cursor-pointer hover:border-brand-red/50 transition-colors">
                    <input 
                      type="radio" 
                      value="12-weeks" 
                      className="accent-brand-red" 
                      {...register('frequency', { required: hasWindowCleaning })} 
                    />
                    Every 12 weeks
                  </label>
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-white/20 bg-white/5 text-sm text-white cursor-pointer hover:border-brand-red/50 transition-colors">
                    <input 
                      type="radio" 
                      value="ad-hoc" 
                      className="accent-brand-red" 
                      {...register('frequency', { required: hasWindowCleaning })} 
                    />
                    Ad hoc basis
                  </label>
                </div>
                {selectedFrequency === 'ad-hoc' && (
                  <p className="mt-2 text-xs text-yellow-400 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Ad hoc cleans cost more than regular scheduled services.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Additional Message */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Additional Message
            </label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors resize-none"
              placeholder="Any special requirements, access instructions, or questions about our services..."
              {...register('message')}
            />
          </div>

          {/* Hidden Fields for EmailJS */}
          <input type="hidden" {...register('customer_type')} />
          <input type="hidden" {...register('submission_date')} />
          <input type="hidden" {...register('submission_time')} />
          
          {/* Honeypot */}
          <input 
            type="text" 
            tabIndex={-1} 
            autoComplete="off" 
            className="hidden" 
            aria-hidden="true" 
            {...register('website')} 
          />

          {/* reCAPTCHA */}
          <div className="space-y-2">
            <ReCaptcha
              onChange={handleRecaptchaChange}
              onExpired={handleRecaptchaExpired}
              className="pt-4"
            />
            {errors.recaptcha && <p className="text-xs text-red-400 text-center">{errors.recaptcha.message}</p>}
          </div>

          {/* Hidden fields for EmailJS template compatibility */}
          <input type="hidden" name="name" />
          <input type="hidden" name="phone" />
          <input type="hidden" name="services_list" />
          <input type="hidden" name="property_type_field" />
          <input type="hidden" name="property_bedrooms" />
          <input type="hidden" name="property_extension" />
          <input type="hidden" name="property_conservatory" />
          <input type="hidden" name="cleaning_frequency" />
          <input type="hidden" name="customer_type_field" />
          <input type="hidden" name="submitted_at" />
          <input type="hidden" name="submitted_date" />
          <input type="hidden" name="submitted_time" />
          <input type="hidden" name="recaptcha_token" />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !recaptchaToken}
              className="w-full px-8 py-4 bg-gradient-to-r from-brand-red to-brand-red/90 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:shadow-brand-red/25 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sending your message...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {!recaptchaToken ? 'Complete reCAPTCHA to Send' : 'Send My Message'}
                </span>
              )}
            </button>
            
            {status === 'error' && (
              <p className="mt-4 text-sm text-red-400 text-center">
                Sorry, something went wrong. Please try again or contact us directly at 07415 526331.
              </p>
            )}
            
            <p className="mt-4 text-xs text-white/60 text-center">
              We respect your privacy. Your details are only used to respond to your enquiry and provide you with a quotation.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}