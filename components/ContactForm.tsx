"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'

type CustomerType = 'new' | 'existing'

type FormValues = {
  first_name: string
  last_name: string
  email: string
  mobile: string
  postcode: string
  preferred_contact: 'Email' | 'Phone' | 'WhatsApp'
  
  // Property information (especially for new customers)
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
  '1-2 bedrooms',
  '3-4 bedrooms',
  '5-6 bedrooms',
  '7+ bedrooms',
] as const

interface ContactFormProps {
  customerType: CustomerType
}

export default function ContactForm({ customerType }: ContactFormProps) {
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
  } = useForm<FormValues>({
    defaultValues: { 
      preferred_contact: 'Email', 
      services: [],
      frequency: '8-weeks',
      has_extension: false,
      has_conservatory: false,
      customer_type: customerType
    }
  })
  
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const start = React.useRef<number>(Date.now())

  const selectedServices = watch('services') || []
  const preferredContact = watch('preferred_contact')
  const selectedFrequency = watch('frequency')

  // Set hidden timestamp fields
  React.useEffect(() => {
    const now = new Date()
    setValue('submission_date', now.toISOString().split('T')[0])
    setValue('submission_time', now.toTimeString().split(' ')[0])
    setValue('customer_type', customerType)
  }, [customerType, setValue])

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
    ensureHidden('property_bedrooms', values.bedrooms)
    ensureHidden('property_extension', values.has_extension ? 'Yes' : 'No')
    ensureHidden('property_conservatory', values.has_conservatory ? 'Yes' : 'No')
    ensureHidden('cleaning_frequency', values.frequency.replace('-', ' '))
    ensureHidden('customer_type_field', customerType === 'new' ? 'New Customer' : 'Existing Customer')
    ensureHidden('submitted_at', now.toLocaleString('en-GB'))
    ensureHidden('submitted_date', now.toLocaleDateString('en-GB'))
    ensureHidden('submitted_time', now.toLocaleTimeString('en-GB'))

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      setStatus('success')
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
                  {...register('postcode', { 
                    required: 'Postcode is required',
                    pattern: {
                      value: /^[A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2}$/i,
                      message: 'Please enter a valid UK postcode'
                    }
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
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="radio" 
                      value="WhatsApp" 
                      className="accent-brand-red" 
                      {...register('preferred_contact', { required: true })} 
                    />
                    WhatsApp
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Property Information
              {customerType === 'new' && <span className="text-xs text-brand-red font-normal">(helps us provide accurate pricing)</span>}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Number of Bedrooms *
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                  {...register('bedrooms', { required: 'Please select number of bedrooms' })}
                >
                  <option value="">Select bedrooms</option>
                  {BEDROOM_OPTIONS.map(option => (
                    <option key={option} value={option} className="bg-gray-800">{option}</option>
                  ))}
                </select>
                {errors.bedrooms && <p className="mt-1 text-xs text-red-400">{errors.bedrooms.message}</p>}
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
                    Has extension
                  </label>
                  <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="accent-brand-red" 
                      {...register('has_conservatory')} 
                    />
                    Has conservatory
                  </label>
                </div>
              </div>

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
                    {...register('frequency', { required: true })} 
                  />
                  Every 4 weeks
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg border border-white/20 bg-white/5 text-sm text-white cursor-pointer hover:border-brand-red/50 transition-colors">
                  <input 
                    type="radio" 
                    value="8-weeks" 
                    className="accent-brand-red" 
                    {...register('frequency', { required: true })} 
                  />
                  Every 8 weeks
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg border border-white/20 bg-white/5 text-sm text-white cursor-pointer hover:border-brand-red/50 transition-colors">
                  <input 
                    type="radio" 
                    value="12-weeks" 
                    className="accent-brand-red" 
                    {...register('frequency', { required: true })} 
                  />
                  Every 12 weeks
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg border border-white/20 bg-white/5 text-sm text-white cursor-pointer hover:border-brand-red/50 transition-colors">
                  <input 
                    type="radio" 
                    value="ad-hoc" 
                    className="accent-brand-red" 
                    {...register('frequency', { required: true })} 
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

          {/* Hidden fields for EmailJS template compatibility */}
          <input type="hidden" name="name" />
          <input type="hidden" name="phone" />
          <input type="hidden" name="services_list" />
          <input type="hidden" name="property_bedrooms" />
          <input type="hidden" name="property_extension" />
          <input type="hidden" name="property_conservatory" />
          <input type="hidden" name="cleaning_frequency" />
          <input type="hidden" name="customer_type_field" />
          <input type="hidden" name="submitted_at" />
          <input type="hidden" name="submitted_date" />
          <input type="hidden" name="submitted_time" />

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
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
                  Send My Message
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