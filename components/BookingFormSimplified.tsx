"use client"

/**
 * Simplified Booking Form - 2 Steps, Modern UI
 * Step 1: What You Need (Property + Services combined)
 * Step 2: Your Details (Contact info)
 */

import React from 'react'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProgressBar from '@/components/ui/ProgressBar'
import Alert from '@/components/ui/Alert'
import ReCaptcha from '@/components/features/contact/ReCaptcha'
import { saveFormData, loadFormData, clearFormData, formatFormDataAge, getFormDataAge } from '@/lib/form-storage'
import { getUserFriendlyError } from '@/lib/error-messages'
import { announceToScreenReader } from '@/lib/accessibility'
import { analytics } from '@/lib/analytics'

type Step = 1 | 2
const TOTAL_STEPS: Step = 2

interface FormData {
  // Step 1: What You Need
  propertyType: 'residential' | 'commercial'
  propertyStyle: string // terraced, semi, detached, etc.
  bedrooms: string
  services: string[]
  frequency: string
  notes: string
  
  // Step 2: Your Details
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  postcode: string
}

const INITIAL_FORM_DATA: FormData = {
  propertyType: 'residential',
  propertyStyle: 'semi',
  bedrooms: '3',
  services: ['windows'],
  frequency: 'every-4-weeks',
  notes: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  postcode: '',
}

const PROPERTY_STYLE_OPTIONS = [
  { id: 'terraced', label: 'Terraced' },
  { id: 'semi', label: 'Semi-detached' },
  { id: 'detached', label: 'Detached' },
  { id: 'bungalow', label: 'Bungalow' },
  { id: 'flat', label: 'Flat/Apartment' },
  { id: 'townhouse', label: 'Townhouse' },
]

const SERVICE_OPTIONS = [
  { id: 'windows', label: 'Window Cleaning', popular: true },
  { id: 'gutters', label: 'Gutter Cleaning' },
  { id: 'fascia', label: 'Fascia & Soffit' },
  { id: 'conservatory', label: 'Conservatory' },
]

const FREQUENCY_OPTIONS = [
  { id: 'every-4-weeks', label: 'Every 4 weeks', subtitle: 'Most popular' },
  { id: 'every-8-weeks', label: 'Every 8 weeks', subtitle: 'Great value' },
  { id: 'one-off', label: 'One-off clean', subtitle: 'Single visit' },
  { id: 'monthly', label: 'Monthly', subtitle: 'Regular service' },
]

export default function BookingFormSimplified() {
  const [step, setStep] = React.useState<Step>(1)
  const [formData, setFormData] = React.useState<FormData>(INITIAL_FORM_DATA)
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)
  const [showDraftPrompt, setShowDraftPrompt] = React.useState(false)
  const [draftAge, setDraftAge] = React.useState<number | null>(null)

  // Check for saved draft
  React.useEffect(() => {
    const saved = loadFormData('booking-form-v2')
    if (saved?.data) {
      setDraftAge(getFormDataAge('booking-form-v2'))
      setShowDraftPrompt(true)
    }
  }, [])

  // Auto-save
  React.useEffect(() => {
    if (status === 'success') return
    const interval = setInterval(() => {
      saveFormData('booking-form-v2', formData, step)
    }, 30000)
    return () => clearInterval(interval)
  }, [formData, step, status])

  const restoreDraft = () => {
    const saved = loadFormData('booking-form-v2')
    if (saved?.data) {
      setFormData(saved.data as FormData)
      if (saved.step) setStep(saved.step as Step)
      setShowDraftPrompt(false)
      announceToScreenReader('Draft restored')
    }
  }

  const dismissDraft = () => {
    clearFormData('booking-form-v2')
    setShowDraftPrompt(false)
  }

  const updateField = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!recaptchaToken) {
      setErrorMessage('Please complete the security check')
      return
    }

    setStatus('submitting')
    setErrorMessage(null)

    try {
      // Submit to API
      const response = await fetch('/api/notion/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            postcode: formData.postcode,
            address: formData.address,
          },
          request: {
            propertyCategory: formData.propertyType,
            propertyType: formData.propertyStyle,
            bedrooms: formData.bedrooms,
            services: formData.services,
            frequency: formData.frequency,
            notes: formData.notes,
          },
          recaptchaToken,
        }),
      })

      if (!response.ok) {
        throw new Error('Submission failed')
      }

      clearFormData('booking-form-v2')
      setStatus('success')
      announceToScreenReader('Request submitted successfully!')
      analytics.formSubmit({ serviceType: formData.services.join(',') })
    } catch (error) {
      const friendlyError = getUserFriendlyError(error)
      setErrorMessage(friendlyError.message)
      setStatus('error')
      announceToScreenReader(`Error: ${friendlyError.message}`, 'assertive')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white">Request Received!</h2>
        <p className="mt-2 text-white/70">
          We'll review your request and get back to you within one working day.
        </p>
        <Button onClick={() => setStatus('idle')} className="mt-6">
          Send Another Request
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 md:p-10 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Get Your Free Quote</h1>
        <p className="mt-2 text-white/60">
          Tell us what you need and we'll send you a tailored quote within 24 hours
        </p>
      </div>

      {/* Progress */}
      <ProgressBar
        currentStep={step}
        totalSteps={TOTAL_STEPS}
        labels={['What You Need', 'Your Details']}
        className="mb-8"
      />

      {/* Draft Prompt */}
      {showDraftPrompt && draftAge && (
        <Alert
          type="info"
          title="Continue where you left off?"
          message={`We found a saved draft from ${formatFormDataAge(draftAge)}`}
          action={{ label: 'Restore', onClick: restoreDraft }}
          onClose={dismissDraft}
          className="mb-6"
        />
      )}

      {/* Errors */}
      {errorMessage && (
        <Alert
          type="error"
          title="Unable to Submit"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
          className="mb-6"
        />
      )}

      <form onSubmit={handleSubmit}>
        {/* STEP 1: What You Need */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Property Type */}
            <div>
              <label className="mb-4 block text-lg font-semibold text-white">
                What type of property?
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => updateField('propertyType', 'residential')}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${
                    formData.propertyType === 'residential'
                      ? 'border-brand-red bg-brand-red/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-xl font-semibold text-white">Residential</div>
                  <div className="text-sm text-white/60">Home, flat, or apartment</div>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('propertyType', 'commercial')}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${
                    formData.propertyType === 'commercial'
                      ? 'border-brand-red bg-brand-red/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-xl font-semibold text-white">Commercial</div>
                  <div className="text-sm text-white/60">Office, shop, or business</div>
                </button>
              </div>
            </div>

            {/* Property Details (Residential only) */}
            {formData.propertyType === 'residential' && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-lg font-semibold text-white">
                      Property type
                    </label>
                    <select
                      value={formData.propertyStyle}
                      onChange={(e) => updateField('propertyStyle', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                    >
                      {PROPERTY_STYLE_OPTIONS.map((style) => (
                        <option key={style.id} value={style.id}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-3 block text-lg font-semibold text-white">
                      Bedrooms
                    </label>
                    <select
                      value={formData.bedrooms}
                      onChange={(e) => updateField('bedrooms', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                    >
                      <option value="1-2">1-2 bedrooms</option>
                      <option value="3">3 bedrooms</option>
                      <option value="4">4 bedrooms</option>
                      <option value="5">5 bedrooms</option>
                      <option value="6+">6+ bedrooms</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Services */}
            <div>
              <label className="mb-4 block text-lg font-semibold text-white">
                What services do you need?
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICE_OPTIONS.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => toggleService(service.id)}
                    className={`relative flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all ${
                      formData.services.includes(service.id)
                        ? 'border-brand-red bg-brand-red/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-white">{service.label}</div>
                      {service.popular && (
                        <div className="text-xs text-brand-red">Most popular</div>
                      )}
                    </div>
                    {formData.services.includes(service.id) && (
                      <svg className="h-6 w-6 text-brand-red flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="mb-3 block text-lg font-semibold text-white">
                How often would you like your windows cleaned?
              </label>
              <p className="mb-3 text-sm text-white/60">
                This frequency applies to window cleaning only. Other services are typically done less frequently.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {FREQUENCY_OPTIONS.map((freq) => (
                  <button
                    key={freq.id}
                    type="button"
                    onClick={() => updateField('frequency', freq.id)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      formData.frequency === freq.id
                        ? 'border-brand-red bg-brand-red/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="font-semibold text-white">{freq.label}</div>
                    <div className="text-sm text-white/60">{freq.subtitle}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <Button
              type="button"
              onClick={() => {
                if (formData.services.length === 0) {
                  setErrorMessage('Please select at least one service')
                  return
                }
                setStep(2)
                announceToScreenReader('Moving to step 2: Your details')
              }}
              className="w-full py-4 text-lg font-semibold"
            >
              Continue to Your Details →
            </Button>
          </div>
        )}

        {/* STEP 2: Your Details */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Name */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                  placeholder="Smith"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-white/80">
                  Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                  placeholder="07123 456789"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Property Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                placeholder="123 High Street, Wells"
              />
            </div>

            {/* Postcode */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Postcode *
              </label>
              <input
                type="text"
                required
                value={formData.postcode}
                onChange={(e) => updateField('postcode', e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                placeholder="BA5 1AA"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/50"
                placeholder="Access instructions, parking, pets, etc."
              />
            </div>

            {/* reCAPTCHA */}
            <ReCaptcha onChange={setRecaptchaToken} />

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                ← Back
              </Button>
              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="flex-1 flex items-center justify-center gap-2"
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
  )
}
