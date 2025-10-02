"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import ReCaptcha from './ReCaptcha'
import { analytics } from '@/lib/analytics'
import { pushToDataLayer } from '@/lib/dataLayer'
import { emailJsConfig } from '@/lib/config/env'

const SERVICE_OPTIONS = [
  'Window Cleaning',
  'Gutter Clearing',
  'Conservatory Roof Cleaning',
  'Solar Panel Cleaning',
  'Fascias & Soffits Cleaning',
  'Other / not sure',
] as const

const CUSTOMER_TYPES = [
  { id: 'new', label: 'New customer' },
  { id: 'existing', label: 'Existing customer' },
] as const

type FormValues = {
  first_name: string
  last_name: string
  email: string
  phone?: string
  customer_type: 'new' | 'existing'
  service_interest: (typeof SERVICE_OPTIONS)[number]
  message: string
  website?: string
  recaptcha?: string
}

interface GeneralEnquiryFormProps {
  defaultService?: string
}

const {
  publicKey: PUBLIC_KEY,
  serviceId: SERVICE_ID,
  templateId: BOOKING_TEMPLATE_ID,
  contactTemplateId: CONTACT_TEMPLATE_ID,
} = emailJsConfig

const TEMPLATE_FOR_CONTACT = CONTACT_TEMPLATE_ID || BOOKING_TEMPLATE_ID

const SERVICE_PARAM_MAP: Record<string, (typeof SERVICE_OPTIONS)[number]> = {
  'window-cleaning': 'Window Cleaning',
  'gutter-clearing': 'Gutter Clearing',
  'conservatory-cleaning': 'Conservatory Roof Cleaning',
  'solar-cleaning': 'Solar Panel Cleaning',
  'fascias-soffits': 'Fascias & Soffits Cleaning',
  'commercial-cleaning': 'Other / not sure',
}

export default function GeneralEnquiryForm({ defaultService }: GeneralEnquiryFormProps = {}) {
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)

  const trackPhoneClick = React.useCallback((source: string) => {
    analytics.quoteRequest('phone')
    pushToDataLayer('phone_click', { source })
  }, [])

  const firstNameRef = React.useRef<HTMLInputElement | null>(null)
  const lastNameRef = React.useRef<HTMLInputElement | null>(null)
  const emailRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (typeof window === 'undefined' || !PUBLIC_KEY) return
    try {
      emailjs.init({ publicKey: PUBLIC_KEY })
    } catch (error) {
      console.error('EmailJS init failed:', error)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      customer_type: 'new',
      service_interest: SERVICE_PARAM_MAP[defaultService || ''] || 'Window Cleaning',
      message: '',
    },
  })

  const handleRecaptchaChange = React.useCallback(
    (token: string | null) => {
      setRecaptchaToken(token)
      setValue('recaptcha', token || '')
      if (token) {
        clearErrors('recaptcha')
      }
    },
    [clearErrors, setValue],
  )

  const handleRecaptchaExpired = React.useCallback(() => {
    setRecaptchaToken(null)
  }, [])

  const focusNext = (nextRef?: React.RefObject<HTMLElement>) => {
    if (!nextRef?.current) return
    nextRef.current.focus()
  }

  const onSubmit = async (values: FormValues) => {
    if (values.website) return
    if (!recaptchaToken) {
      setError('recaptcha', { type: 'manual', message: 'Please complete the reCAPTCHA verification' })
      return
    }

    if (!SERVICE_ID || !PUBLIC_KEY || !TEMPLATE_FOR_CONTACT) {
      console.error('EmailJS configuration missing for general enquiry form', {
        SERVICE_ID,
        PUBLIC_KEY_PRESENT: Boolean(PUBLIC_KEY),
        TEMPLATE_FOR_CONTACT,
      })
      setStatus('error')
      return
    }

    setStatus('submitting')

    const fullName = `${values.first_name} ${values.last_name}`.trim()
    const submittedAt = new Date().toISOString()

    const summaryLines = [
      'New general enquiry received:',
      `Name: ${fullName || 'Unknown'}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone || 'Not provided'}`,
      `Customer type: ${values.customer_type === 'existing' ? 'Existing customer' : 'New customer'}`,
      `Service interest: ${values.service_interest}`,
      '',
      'Message:',
      values.message || 'No message provided.',
    ]

    const templateParams = {
      to_email: 'info@somersetwindowcleaning.co.uk',
      name: fullName || 'Anonymous',
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      phone: values.phone || 'Not provided',
      customer_type: values.customer_type,
      customer_type_label: values.customer_type === 'existing' ? 'Existing customer' : 'New customer',
      service_interest: values.service_interest,
      message: values.message,
      summary_plaintext: summaryLines.join('\n'),
      submitted_at_iso: submittedAt,
      recaptcha_token: recaptchaToken,
    }

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_FOR_CONTACT, templateParams, PUBLIC_KEY)

      analytics.formSubmit({
        serviceType: values.service_interest,
        customerType: values.customer_type,
        email: values.email,
      })

      analytics.quoteRequest('form')

      pushToDataLayer('contact_form_submit', {
        service_interest: values.service_interest,
        customer_type: values.customer_type,
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        phone: values.phone,
        message_length: values.message?.length || 0,
      })

      setStatus('success')
      setRecaptchaToken(null)
      setValue('recaptcha', '')
      reset()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('General enquiry submission error:', error)
      analytics.formError('general_enquiry_submission_failed', error instanceof Error ? error.message : 'Unknown error')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
          <svg className="h-8 w-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-3 text-2xl font-bold text-white">Thanks for getting in touch!</h3>
        <p className="text-white/75">
          We have your message and will reply within one working day. For anything urgent please call 01458 860339.
        </p>
        <a
          href="tel:01458860339"
          onClick={() => trackPhoneClick('contact_success_message')}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-2 text-sm font-semibold tracking-[0.08em] text-white transition hover:border-brand-red/60 hover:text-white"
        >
          Call 01458 860339
        </a>
      </div>
    )
  }

  const firstNameRegister = register('first_name', { required: 'First name is required' })
  const lastNameRegister = register('last_name', { required: 'Last name is required' })
  const emailRegister = register('email', {
    required: 'Email is required',
    pattern: {
      value: /^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/,
      message: 'Enter a valid email address',
    },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-red via-brand-red/70 to-transparent" />

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-semibold text-white">Send us a message</h2>
        <p className="mt-2 text-sm text-white/70">
          Share a few details and we&apos;ll follow up within one working day.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">First name *</label>
            <input
              type="text"
              placeholder="Your first name"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              {...firstNameRegister}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  focusNext(lastNameRef)
                }
              }}
              ref={(node) => {
                firstNameRegister.ref(node)
                firstNameRef.current = node || null
              }}
            />
            {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">Last name *</label>
            <input
              type="text"
              placeholder="Your last name"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              {...lastNameRegister}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  focusNext(emailRef)
                }
              }}
              ref={(node) => {
                lastNameRegister.ref(node)
                lastNameRef.current = node || null
              }}
            />
            {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name.message}</p>}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">Email *</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              {...emailRegister}
              ref={(node) => {
                emailRegister.ref(node)
                emailRef.current = node || null
              }}
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">Phone</label>
            <input
              type="tel"
              placeholder="Optional phone number"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              {...register('phone')}
            />
            <p className="mt-1 text-xs text-white/50">Share if you prefer us to call back.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <span className="mb-2 block text-sm font-medium text-white/90">Are you a new or existing customer? *</span>
            <div className="grid gap-2 sm:grid-cols-2">
              {CUSTOMER_TYPES.map((option) => (
                <label
                  key={option.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm text-white transition hover:border-brand-red/60"
                >
                  <input
                    type="radio"
                    className="h-4 w-4 accent-brand-red"
                    value={option.id}
                    {...register('customer_type', { required: true })}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-white/90">What do you need help with? *</label>
            <select
              className="w-full rounded-lg border border-white/20 bg-black px-4 py-3 text-white transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
              {...register('service_interest', { required: true })}
            >
              {SERVICE_OPTIONS.map((service) => (
                <option key={service} value={service} className="bg-black text-white">
                  {service}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-white/90">Message *</label>
          <textarea
            rows={5}
            placeholder="Tell us about your property, availability, or any questions you have."
            className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
            {...register('message', { required: 'Please let us know how we can help' })}
          />
          {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
        </div>

        <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register('website')} />

        <div>
          <ReCaptcha onChange={handleRecaptchaChange} onExpired={handleRecaptchaExpired} className="pt-2" />
          {errors.recaptcha && <p className="mt-1 text-xs text-red-400">{errors.recaptcha.message}</p>}
        </div>

        <input type="hidden" {...register('recaptcha')} />
        {status === 'error' && (
          <p className="text-center text-sm text-red-400">
            Something went wrong while sending your message. Please try again or call 01458 860339.
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`w-full rounded-xl px-8 py-4 font-semibold transition ${
            status === 'submitting'
              ? 'cursor-not-allowed bg-gray-600 text-gray-300 opacity-60'
              : 'bg-gradient-to-r from-brand-red to-brand-red/90 text-white shadow-lg shadow-brand-red/25 hover:shadow-xl hover:shadow-brand-red/35'
          }`}
        >
          {status === 'submitting' ? 'Sending your message…' : 'Send message'}
        </button>

        <p className="text-center text-xs text-white/60">
          Prefer to speak now? Call{' '}
          <a
            href="tel:01458860339"
            onClick={() => trackPhoneClick('contact_form_footer')}
            className="font-semibold text-white underline decoration-brand-red/60 underline-offset-4"
          >
            01458 860339
          </a>{' '}
          or message us on WhatsApp.
        </p>
      </div>
    </form>
  )
}
