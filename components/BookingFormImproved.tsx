"use client"

import React from 'react'
import emailjs from '@emailjs/browser'
import Button from '@/components/ui/Button'
import ReCaptcha from '@/components/features/contact/ReCaptcha'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProgressBar from '@/components/ui/ProgressBar'
import Alert from '@/components/ui/Alert'
import ExitIntentPopup from '@/components/ui/ExitIntentPopup'
import PropertyTypeSelector from '@/components/form/PropertyTypeSelector'
import ServiceSelector from '@/components/form/ServiceSelector'
import AddressInput from '@/components/form/AddressInput'
import { analytics } from '@/lib/analytics'
import { pushToDataLayer } from '@/lib/dataLayer'
import { saveFormData, loadFormData, clearFormData, formatFormDataAge, getFormDataAge } from '@/lib/form-storage'
import { getUserFriendlyError } from '@/lib/error-messages'
import { announceToScreenReader } from '@/lib/accessibility'

const SERVICE_ID = (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '').trim()
const TEMPLATE_ID = (process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_booking_form').trim()
const PUBLIC_KEY = (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '').trim()

type PropertyCategory = 'residential' | 'commercial'
type Step = 1 | 2 | 3
const TOTAL_STEPS: Step = 3

interface FormData {
  // Step 1: Property Basics
  propertyCategory: PropertyCategory
  propertyStyle: string
  bedrooms: string
  hasExtension: boolean
  hasConservatory: boolean
  commercialType: string

  // Step 2: Services & Frequency
  services: string[]
  frequency: string

  // Step 3: Contact Details & Notes
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  postcode: string
  notes: string
  website: string
}

const INITIAL_FORM_DATA: FormData = {
  propertyCategory: 'residential',
  propertyStyle: 'semi',
  bedrooms: '3',
  hasExtension: false,
  hasConservatory: false,
  commercialType: '',
  services: [],
  frequency: 'every-4-weeks',
  notes: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
  website: '',
}

const PROPERTY_STYLE_OPTIONS = [
  { id: 'terraced', label: 'Terraced' },
  { id: 'semi', label: 'Semi-detached' },
  { id: 'detached', label: 'Detached' },
  { id: 'bungalow', label: 'Bungalow' },
  { id: 'flat', label: 'Flat/Apartment' },
  { id: 'townhouse', label: 'Townhouse' },
]

const BEDROOM_OPTIONS = [
  { id: '1-2', label: '1-2' },
  { id: '3', label: '3' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
  { id: '6+', label: '6+' },
]

const COMMERCIAL_TYPE_OPTIONS = [
  { id: 'office', label: 'Office Building' },
  { id: 'retail', label: 'Retail Store' },
  { id: 'restaurant', label: 'Restaurant/Café' },
  { id: 'warehouse', label: 'Warehouse' },
  { id: 'school', label: 'School/Education' },
  { id: 'medical', label: 'Medical Facility' },
  { id: 'other', label: 'Other' },
]

const FREQUENCY_OPTIONS = [
  { id: 'every-4-weeks', label: 'Every 4 weeks', subtitle: 'Most popular', badge: 'Recommended' },
  { id: 'every-8-weeks', label: 'Every 8 weeks', subtitle: 'Great value' },
  { id: 'one-off', label: 'One-off clean', subtitle: 'Single visit' },
]

interface BookingFormImprovedProps {
  defaultAddress?: string
  defaultPostcode?: string
  className?: string
}

export default function BookingFormImproved({
  defaultAddress = '',
  defaultPostcode = '',
  className = '',
}: BookingFormImprovedProps) {
  const [step, setStep] = React.useState<Step>(1)
  const [formData, setFormData] = React.useState<FormData>({
    ...INITIAL_FORM_DATA,
    address: defaultAddress,
    postcode: defaultPostcode.toUpperCase(),
  })
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)
  const [showDraftPrompt, setShowDraftPrompt] = React.useState(false)
  const [draftAge, setDraftAge] = React.useState<number | null>(null)
  const [showExitIntent, setShowExitIntent] = React.useState(true)

  const startTime = React.useRef<number>(Date.now())

  // Check for saved draft
  React.useEffect(() => {
    const saved = loadFormData('booking-form-improved')
    if (saved?.data) {
      setDraftAge(getFormDataAge('booking-form-improved'))
      setShowDraftPrompt(true)
    }
  }, [])

  // Auto-save every 30 seconds
  React.useEffect(() => {
    if (status === 'success') return
    const interval = setInterval(() => {
      saveFormData('booking-form-improved', formData, step)
    }, 30000)
    return () => clearInterval(interval)
  }, [formData, step, status])

  const restoreDraft = () => {
    const saved = loadFormData('booking-form-improved')
    if (saved?.data) {
      setFormData(saved.data as FormData)
      if (saved.step) setStep(saved.step as Step)
      setShowDraftPrompt(false)
      announceToScreenReader('Draft restored successfully')
    }
  }

  const dismissDraft = () => {
    clearFormData('booking-form-improved')
    setShowDraftPrompt(false)
  }

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const goToStep = (nextStep: Step) => {
    setErrorMessage(null)
    setStep(nextStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    announceToScreenReader(`Moving to step ${nextStep}`)
  }

  const handleStep1Continue = () => {
    // Step 1 just needs property details, no validation needed
    goToStep(2)
  }

  const handleStep2Continue = () => {
    if (formData.services.length === 0) {
      setErrorMessage('Please select at least one service to continue')
      return
    }
    // If windows are selected, frequency must be chosen
    if (formData.services.includes('windows') && !formData.frequency) {
      setErrorMessage('Please select a frequency for window cleaning')
      return
    }
    goToStep(3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status === 'submitting') return

    // Honeypot check
    if (formData.website.trim().length > 0) return

    // Time check
    const elapsed = Date.now() - startTime.current
    if (elapsed < 2000) {
      setErrorMessage('Please take a moment to review your request before sending')
      return
    }

    if (!recaptchaToken) {
      setErrorMessage('Please complete the security check')
      return
    }

    setStatus('submitting')
    setErrorMessage(null)

    try {
      const templateParams = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        first_name: formData.firstName,
        last_name: formData.lastName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        postcode: formData.postcode.toUpperCase(),
        property_address: formData.address,
        property_category: formData.propertyCategory,
        property_type: formData.propertyStyle,
        property_size: formData.bedrooms,
        has_extension: formData.hasExtension ? 'Yes' : '',
        has_conservatory: formData.hasConservatory ? 'Yes' : '',
        commercial_type: formData.commercialType || '',
        service_frequency: formData.frequency,
        services_list: formData.services.join(', '),
        notes: formData.notes || 'No additional notes',
        recaptcha_token: recaptchaToken,
        'g-recaptcha-response': recaptchaToken,
        intent: 'quote',
        intent_label: 'Quote request',
        email_subject: `${formData.firstName} ${formData.lastName} - ${formData.postcode.toUpperCase()} - ${formData.services.join(', ')} - ${formData.frequency}`,
      }

      // Use direct fetch to avoid SameSite cookie issues with EmailJS SDK
      const emailResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: templateParams,
        }),
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        throw new Error(`EmailJS failed: ${emailResponse.status} - ${errorText}`)
      }

      // Track success
      analytics.formSubmit({
        serviceType: formData.services.join(','),
        propertySize: formData.bedrooms,
        customerType: 'new',
        email: formData.email,
      })

      pushToDataLayer('booking_form_submit', {
        service_list: formData.services.join(','),
        property_category: formData.propertyCategory,
        frequency: formData.frequency,
      })

      // Try Notion sync (non-blocking)
      try {
        console.log('🔵 Attempting Notion sync...')
        const notionPayload = {
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            postcode: formData.postcode,
            address: formData.address,
          },
          request: {
            propertyCategory: formData.propertyCategory,
            propertyType: formData.propertyStyle,
            bedrooms: formData.bedrooms,
            hasExtension: formData.hasExtension,
            hasConservatory: formData.hasConservatory,
            commercialType: formData.commercialType,
            services: formData.services,
            frequency: formData.frequency,
            notes: formData.notes || '',
          },
          recaptchaToken,
        }
        console.log('📤 Notion payload:', notionPayload)

        const notionResponse = await fetch('/api/notion/simple-leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(notionPayload),
        })

        console.log('📥 Notion response status:', notionResponse.status)

        if (!notionResponse.ok) {
          const errorText = await notionResponse.text()
          console.error('❌ Notion sync failed:', notionResponse.status, errorText)
        } else {
          const responseData = await notionResponse.json()
          console.log('✅ Lead successfully synced to Notion:', responseData)
        }
      } catch (notionError) {
        console.error('❌ Notion sync error:', notionError)
      }

      clearFormData('booking-form-improved')
      setStatus('success')
      announceToScreenReader('Request submitted successfully!')
    } catch (error) {
      console.error('Form submission error:', error)
      const friendlyError = getUserFriendlyError(error)
      setErrorMessage(friendlyError.message)
      setStatus('error')
      announceToScreenReader(`Error: ${friendlyError.message}`, 'assertive')
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-3xl border border-brand-red/30 bg-gradient-to-br from-brand-red/10 to-brand-red/5 p-8 text-center ${className} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/20 animate-in zoom-in duration-700 delay-150">
          <svg className="h-8 w-8 text-brand-red animate-in zoom-in duration-500 delay-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">Request Received!</h2>
        <p className="mt-3 leading-relaxed-body text-white/70 animate-in fade-in duration-500 delay-300">
          Thank you! We&apos;ll review your request and get back to you within one working day with tailored pricing and scheduling options.
        </p>
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
          <p className="font-semibold text-white">What we captured:</p>
          <ul className="mt-2 space-y-1 leading-relaxed-body text-white/70">
            <li>• Property: {formData.propertyStyle} ({formData.bedrooms} bedrooms)</li>
            <li>• Services: {formData.services.join(', ')}</li>
            <li>• Frequency: {FREQUENCY_OPTIONS.find((f) => f.id === formData.frequency)?.label}</li>
          </ul>
        </div>
        <Button onClick={() => setStatus('idle')} className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
          Send Another Request
        </Button>
      </div>
    )
  }

  return (
    <>
      {showExitIntent && <ExitIntentPopup onClose={() => setShowExitIntent(false)} />}

      <div id="booking-form" className={`rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-sm md:p-10 ${className}`}>
        {/* Skip to form button for accessibility */}
        <a
          href="#booking-form"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-red focus:px-4 focus:py-2 focus:text-white focus:outline-none focus:ring-4 focus:ring-brand-red/50"
        >
          Skip to booking form
        </a>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Get Your Free Quote</h1>
          <p className="mt-2 leading-relaxed-body text-white/60">
            Tell us what you need and we&apos;ll send you a tailored quote within 24 hours
          </p>
        </div>

        {/* Progress */}
        <ProgressBar
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          labels={['Property', 'Services', 'Contact']}
          className="mb-8"
        />

        {/* Draft restoration */}
        {showDraftPrompt && draftAge && (
          <Alert
            type="info"
            title="Continue where you left off?"
            message={`We found a saved draft from ${formatFormDataAge(draftAge)}`}
            action={{ label: 'Restore Draft', onClick: restoreDraft }}
            onClose={dismissDraft}
            className="mb-6"
          />
        )}

        {/* Errors */}
        {errorMessage && (
          <Alert type="error" title="Unable to Submit" message={errorMessage} onClose={() => setErrorMessage(null)} className="mb-6" />
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Property Basics */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Property Details</h2>
                <PropertyTypeSelector
                  value={formData.propertyCategory}
                  onChange={(value) => updateField('propertyCategory', value)}
                />
              </div>

              {/* Divider */}
              <div className="border-t border-white/10"></div>

              {/* Residential-specific fields */}
              {formData.propertyCategory === 'residential' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-white mb-4">Tell us more</h3>

                  {/* Property Type Tabs */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-white/80">Property Type</label>
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {PROPERTY_STYLE_OPTIONS.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => updateField('propertyStyle', style.id)}
                          className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                            formData.propertyStyle === style.id
                              ? 'border-brand-red bg-brand-red/20 text-white'
                              : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bedrooms Tabs */}
                  <div>
                    <label className="mb-3 block text-sm font-medium text-white/80">Bedrooms</label>
                    <div className="flex gap-2">
                      {BEDROOM_OPTIONS.map((bedroom) => (
                        <button
                          key={bedroom.id}
                          type="button"
                          onClick={() => updateField('bedrooms', bedroom.id)}
                          className={`flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                            formData.bedrooms === bedroom.id
                              ? 'border-brand-red bg-brand-red/20 text-white'
                              : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          {bedroom.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Extension & Conservatory */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${
                      formData.hasExtension
                        ? 'border-brand-red bg-brand-red/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.hasExtension}
                        onChange={(e) => updateField('hasExtension', e.target.checked)}
                        className="h-5 w-5 rounded border-white/20 bg-white/10 text-brand-red focus:ring-2 focus:ring-brand-red focus:ring-offset-0"
                      />
                      <span className="text-sm font-medium text-white">Has Extension</span>
                    </label>

                    <label className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition ${
                      formData.hasConservatory
                        ? 'border-brand-red bg-brand-red/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.hasConservatory}
                        onChange={(e) => updateField('hasConservatory', e.target.checked)}
                        className="h-5 w-5 rounded border-white/20 bg-white/10 text-brand-red focus:ring-2 focus:ring-brand-red focus:ring-offset-0"
                      />
                      <span className="text-sm font-medium text-white">Has Conservatory</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Commercial-specific fields */}
              {formData.propertyCategory === 'commercial' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Commercial Property Details</h3>
                  <div>
                    <label className="mb-3 block text-sm font-medium text-white/80">Type of Commercial Property</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {COMMERCIAL_TYPE_OPTIONS.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => updateField('commercialType', type.id)}
                          className={`rounded-lg border-2 px-3 py-2 text-sm font-medium transition ${
                            formData.commercialType === type.id
                              ? 'border-brand-red bg-brand-red/20 text-white'
                              : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Button type="button" onClick={handleStep1Continue} className="w-full py-4 text-lg font-semibold">
                Continue to Services →
              </Button>
            </div>
          )}

          {/* STEP 2: Services & Frequency */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">What do you need?</h2>
                <ServiceSelector
                  services={formData.services}
                  onChange={(services) => updateField('services', services)}
                  frequency={formData.frequency}
                  onFrequencyChange={(freq) => updateField('frequency', freq)}
                />
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="ghost" onClick={() => goToStep(1)} className="flex-1">
                  ← Back
                </Button>
                <Button type="button" onClick={handleStep2Continue} className="flex-1">
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Contact Details & Notes */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold text-white mb-6">Your Contact Details</h2>
              {/* Name fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="John"
                    className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 transition focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Smith"
                    className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 transition focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/20"
                  />
                </div>
              </div>

              {/* Contact fields */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 transition focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/20"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/80">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="07123 456789"
                    className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 transition focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/20"
                  />
                </div>
              </div>

              {/* Address */}
              <AddressInput
                address={formData.address}
                postcode={formData.postcode}
                onAddressChange={(value) => updateField('address', value)}
                onPostcodeChange={(value) => updateField('postcode', value)}
                onPlaceSelected={(place) => {
                  updateField('address', place.address)
                  updateField('postcode', place.postcode)
                }}
              />
              </div>

              {/* Divider */}
              <div className="border-t border-white/10"></div>

              {/* Additional notes */}
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Anything else we should know?</h3>
                <p className="mb-3 text-sm text-white/60">Optional - add any special requirements or notes</p>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={3}
                  placeholder="e.g., Parking info, gate code, pets, access notes, specific requirements..."
                  className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 leading-relaxed-body text-white placeholder:text-white/30 transition focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/20"
                />
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                autoComplete="off"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                className="hidden"
                tabIndex={-1}
                aria-hidden="true"
              />

              {/* reCAPTCHA */}
              <ReCaptcha onChange={setRecaptchaToken} />

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="button" variant="ghost" onClick={() => goToStep(2)} className="flex-1">
                  ← Back
                </Button>
                <Button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="flex flex-1 items-center justify-center gap-2"
                >
                  {status === 'submitting' ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    'Send Request'
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </>
  )
}
