"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import ReCaptcha from './ReCaptcha'
import SimpleAddressInput from './SimpleAddressInput'
import { analytics } from '@/lib/analytics'

interface BookingFormData {
  customer_name: string
  customer_email: string
  customer_phone: string
  property_address: string
  service_type: string
  preferred_date: string
  preferred_time: string
  special_requirements?: string
  customer_type: 'new' | 'existing'
  
  // Hidden fields for EmailJS
  submission_date?: string
  submission_time?: string
  
  // Honeypot
  website?: string
  
  // reCAPTCHA
  recaptcha?: string
}

const SERVICE_OPTIONS = [
  'Window Cleaning',
  'Gutter Clearing', 
  'Conservatory Roof Cleaning',
  'Solar Panel Cleaning',
  'Fascias & Soffits Cleaning',
  'External Commercial Cleaning',
] as const

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00'
]

// Get environment variables
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_booking_form'

interface BookingFormProps {
  defaultService?: string
  defaultAddress?: string
  className?: string
}

export default function BookingForm({ 
  defaultService = '', 
  defaultAddress = '', 
  className = '' 
}: BookingFormProps) {
  const formRef = React.useRef<HTMLFormElement>(null)
  
  const { 
    register, 
    handleSubmit, 
    watch, 
    reset, 
    setError, 
    clearErrors, 
    setValue,
    formState: { errors, isSubmitting } 
  } = useForm<BookingFormData>({
    defaultValues: { 
      property_address: defaultAddress || '',
      service_type: defaultService || '',
      customer_type: 'new'
    }
  })
  
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)
  const [formStarted, setFormStarted] = React.useState<boolean>(false)
  const start = React.useRef<number>(Date.now())

  const selectedService = watch('service_type')
  const customerType = watch('customer_type') || 'new'

  // Handler for address change from SimpleAddressInput component
  const handleAddressChange = (address: string) => {
    setValue('property_address', address)
  }

  // Form interaction tracking
  const trackFormStart = React.useCallback(() => {
    if (!formStarted) {
      setFormStarted(true)
      analytics.formStart(selectedService)
    }
  }, [formStarted, selectedService])

  // reCAPTCHA handlers
  const handleRecaptchaChange = (token: string | null) => {
    console.log('reCAPTCHA token received:', token ? 'Valid token received' : 'No token/token cleared')
    setRecaptchaToken(token)
    if (token) {
      clearErrors('recaptcha')
      analytics.recaptchaComplete()
    }
  }

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null)
    setError('recaptcha', { type: 'manual', message: 'reCAPTCHA expired, please try again' })
    analytics.recaptchaError('expired')
  }

  // Set hidden timestamp fields
  React.useEffect(() => {
    const now = new Date()
    setValue('submission_date', now.toISOString().split('T')[0])
    setValue('submission_time', now.toTimeString().split(' ')[0])
  }, [setValue])

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + 30)
    return maxDate.toISOString().split('T')[0]
  }

  const onSubmit = async (values: BookingFormData) => {
    console.log('Booking form submission started', values)
    
    // Honeypot + time-trap
    if (values.website) {
      console.warn('Honeypot triggered - bot submission blocked')
      return
    }
    const elapsed = Date.now() - start.current
    if (elapsed < 2000) {
      console.warn('Time trap triggered - submission too fast')
      setStatus('error')
      return
    }

    // Validation
    if (!values.service_type) {
      setError('service_type', { type: 'manual', message: 'Please select a service' })
      return
    }
    clearErrors('service_type')

    // reCAPTCHA validation
    if (!recaptchaToken) {
      setError('recaptcha', { type: 'manual', message: 'Please complete the reCAPTCHA verification' })
      return
    }
    clearErrors('recaptcha')

    // Prepare data for EmailJS
    const form = formRef.current
    if (!form) {
      console.error('Form reference not found')
      setStatus('error')
      return
    }

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
    ensureHidden('name', values.customer_name)
    ensureHidden('email', values.customer_email)
    ensureHidden('phone', values.customer_phone)
    ensureHidden('address', values.property_address)
    ensureHidden('service', values.service_type)
    ensureHidden('booking_date', values.preferred_date)
    ensureHidden('booking_time', values.preferred_time)
    ensureHidden('requirements', values.special_requirements || '')
    ensureHidden('customer_type_field', customerType === 'new' ? 'New Customer' : 'Existing Customer')
    ensureHidden('submitted_at', now.toLocaleString('en-GB'))
    ensureHidden('submitted_date', now.toLocaleDateString('en-GB'))
    ensureHidden('submitted_time', now.toLocaleTimeString('en-GB'))
    ensureHidden('recaptcha_token', recaptchaToken)

    try {
      console.log('Starting booking form submission...')
      console.log('EmailJS config:', { SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY: PUBLIC_KEY ? 'Set' : 'Missing' })
      
      // Send to EmailJS
      const result = await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      
      console.log('✅ Booking form sent successfully:', result)
      
      // Track successful form submission
      analytics.formSubmit({
        serviceType: values.service_type,
        customerType: customerType,
        email: values.customer_email
      })
      
      setStatus('success')
      setRecaptchaToken(null) // Reset reCAPTCHA
      reset()
    } catch (e) {
      console.error('Booking form submission error:', e)
      
      // Track form error
      analytics.formError('submission_failed', e instanceof Error ? e.message : 'Unknown error')
      
      setStatus('error')
      
      // Show specific error message
      const errorMessage = e instanceof Error ? e.message : 'Unknown error occurred'
      console.error('Detailed error:', errorMessage)
      
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <h3 className="text-2xl font-bold text-white mb-4">Booking Request Sent!</h3>
        <p className="text-white/80 mb-6">
          Thank you for your booking request. We&apos;ll review your preferred date and time and get back to you within 4 hours to confirm your appointment.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/70">Response within 4 hours</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/70">Professional service</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white/70">Fully insured team</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-red to-transparent" />
      
      <div className="p-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent mb-3">
            Book an Appointment
          </h2>
          <p className="text-white/80">
            Schedule a service appointment with our professional cleaning team. Choose your preferred date and time.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Type Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                  <div className="text-sm text-white/70 mt-1">First time booking with Somerset Window Cleaning</div>
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
                  <div className="text-sm text-white/70 mt-1">Returning customer booking additional service</div>
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
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  placeholder="Your full name"
                  onFocus={trackFormStart}
                  {...register('customer_name', { 
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                />
                {errors.customer_name && <p className="mt-1 text-xs text-red-400">{errors.customer_name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  placeholder="your.email@example.com"
                  {...register('customer_email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.customer_email && <p className="mt-1 text-xs text-red-400">{errors.customer_email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  placeholder="07123 456789"
                  {...register('customer_phone', { 
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(\+44|0)[0-9\s-()]{10,}$/,
                      message: 'Please enter a valid UK phone number'
                    }
                  })}
                />
                {errors.customer_phone && <p className="mt-1 text-xs text-red-400">{errors.customer_phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Property Address *
                </label>
                <SimpleAddressInput
                  value={watch('property_address') || ''}
                  onChange={handleAddressChange}
                  placeholder="Enter your full address including postcode..."
                  required
                />
                {errors.property_address && <p className="mt-1 text-xs text-red-400">{errors.property_address.message}</p>}
                <input
                  type="hidden"
                  {...register('property_address', { 
                    required: 'Property address is required',
                    minLength: {
                      value: 10,
                      message: 'Please enter a complete address including postcode'
                    }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Service & Appointment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
              </svg>
              Service & Appointment
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Service Required *
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  {...register('service_type', { required: 'Please select a service' })}
                >
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service} value={service} className="bg-gray-800 text-white">
                      {service}
                    </option>
                  ))}
                </select>
                {errors.service_type && <p className="mt-1 text-xs text-red-400">{errors.service_type.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  {...register('preferred_date', { required: 'Please select a preferred date' })}
                />
                {errors.preferred_date && <p className="mt-1 text-xs text-red-400">{errors.preferred_date.message}</p>}
                <p className="mt-1 text-xs text-white/60">Available: Tomorrow to 30 days ahead</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Preferred Time *
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  {...register('preferred_time', { required: 'Please select a preferred time' })}
                >
                  <option value="">Select a time</option>
                  {TIME_SLOTS.map((time) => (
                    <option key={time} value={time} className="bg-gray-800 text-white">
                      {time}
                    </option>
                  ))}
                </select>
                {errors.preferred_time && <p className="mt-1 text-xs text-red-400">{errors.preferred_time.message}</p>}
                <p className="mt-1 text-xs text-white/60">Business hours: 9:00 AM - 4:00 PM</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Special Requirements
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors resize-none"
                  placeholder="Any special requirements, access instructions, or questions..."
                  {...register('special_requirements')}
                />
              </div>
            </div>
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
          <input type="hidden" name="email" />
          <input type="hidden" name="phone" />
          <input type="hidden" name="address" />
          <input type="hidden" name="service" />
          <input type="hidden" name="booking_date" />
          <input type="hidden" name="booking_time" />
          <input type="hidden" name="requirements" />
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
              className={`w-full px-8 py-4 font-semibold rounded-xl shadow-lg transition-all duration-300 ${
                isSubmitting || !recaptchaToken
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-brand-red to-brand-red/90 text-white hover:shadow-xl hover:shadow-brand-red/25 hover:scale-105 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Booking Appointment...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                  </svg>
                  {!recaptchaToken ? '🔒 Complete reCAPTCHA to Book' : '✅ Book My Appointment'}
                </span>
              )}
            </button>
            
            {!recaptchaToken && (
              <p className="mt-2 text-sm text-yellow-400 text-center flex items-center justify-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please complete the reCAPTCHA verification above to book your appointment
              </p>
            )}
            
            {status === 'error' && (
              <p className="mt-4 text-sm text-red-400 text-center">
                Sorry, something went wrong. Please try again or contact us directly at 01458 860339.
              </p>
            )}
            
            <p className="mt-4 text-xs text-white/60 text-center">
              We&apos;ll confirm your appointment within 4 hours during business hours (Mon-Sat 9AM-4PM).
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}