"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import emailjs from '@emailjs/browser'

type FormValues = {
  first_name: string
  last_name: string
  email: string
  mobile?: string
  postcode: string
  contact_method: 'Email' | 'Mobile'
  services: string[]
  frequency?: '4-weekly' | '8-weekly' | 'ad-hoc'
  message?: string
  website?: string // honeypot
  photos?: FileList
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

export default function ContactForm() {
  const formRef = React.useRef<HTMLFormElement>(null)
  const { register, handleSubmit, watch, reset, setError, clearErrors, formState: { errors, isSubmitting } } = useForm<FormValues>({
    defaultValues: { contact_method: 'Email', services: [] }
  })
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const start = React.useRef<number>(Date.now())

  const selectedServices = watch('services') || []
  const contactMethod = watch('contact_method')

  const hasWindowCleaning = selectedServices.includes('Window Cleaning')

  const onSubmit = async (values: FormValues) => {
    setStatus('idle')
    // Honeypot + time-trap
    if (values.website) return
    const elapsed = Date.now() - start.current
    if (elapsed < 1200) return // very fast submissions are likely bots

    // Require at least one service
    if (!values.services || values.services.length === 0) {
      setError('services', { type: 'manual', message: 'Please select at least one service' })
      return
    }
    clearErrors('services')

    // If preferred contact is mobile, ensure mobile provided
    if (values.contact_method === 'Mobile' && !values.mobile) {
      setError('mobile', { type: 'manual', message: 'Please enter your mobile number' })
      return
    }

    // If Window Cleaning selected, require frequency
    if (values.services.includes('Window Cleaning') && !values.frequency) {
      setError('frequency', { type: 'manual', message: 'Please choose a preferred frequency' })
      return
    }

    // Prepare hidden fields for template compatibility
    const form = formRef.current
    if (!form) return
    const fullName = `${values.first_name} ${values.last_name}`.trim()

    // Ensure hidden fields
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
    ensureHidden('name', fullName)
    ensureHidden('services_joined', values.services.join(', '))
    ensureHidden('service', values.services.join(', '))
    ensureHidden('phone', values.mobile || '-')
    ensureHidden('submitted_at', new Date().toISOString())

    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      setStatus('success')
      reset()
    } catch (e) {
      console.error(e)
      setStatus('error')
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm">First name</label>
          <input
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red"
            placeholder="Jane"
            {...register('first_name', { required: 'Please enter your first name', minLength: { value: 2, message: 'First name looks too short' } })}
            aria-invalid={!!errors.first_name}
          />
          {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm">Last name</label>
          <input
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red"
            placeholder="Doe"
            {...register('last_name', { required: 'Please enter your last name', minLength: { value: 2, message: 'Last name looks too short' } })}
            aria-invalid={!!errors.last_name}
          />
          {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm">Email</label>
          <input
            type="email"
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red"
            placeholder="you@example.co.uk"
            {...register('email', { required: 'Email is required' })}
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm">Mobile phone</label>
          <input
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red"
            placeholder="Optional"
            {...register('mobile')}
            aria-invalid={!!errors.mobile}
          />
          {errors.mobile && <p className="mt-1 text-xs text-red-400">{errors.mobile.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm">Postcode</label>
          <input
            className="w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red"
            placeholder="e.g., TA1 1AA"
            {...register('postcode', { required: 'Postcode is required' })}
            aria-invalid={!!errors.postcode}
          />
          {errors.postcode && <p className="mt-1 text-xs text-red-400">{errors.postcode.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm">Preferred contact method</label>
          <div className="flex gap-4 rounded-md border border-white/10 bg-white/5 p-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="radio" value="Email" {...register('contact_method', { required: true })} className="accent-[var(--brand-red)]" /> Email
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="radio" value="Mobile" {...register('contact_method', { required: true })} className="accent-[var(--brand-red)]" /> Mobile
            </label>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Services required</label>
          <div className="grid grid-cols-1 gap-2 rounded-md border border-white/10 bg-white/5 p-3 sm:grid-cols-2">
            {SERVICE_OPTIONS.map((s) => (
              <label key={s} className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  value={s}
                  className="accent-[var(--brand-red)]"
                  {...register('services')}
                />
                {s}
              </label>
            ))}
          </div>
          {errors.services && <p className="mt-1 text-xs text-red-400">{errors.services.message as string}</p>}
        </div>

        {hasWindowCleaning && (
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Preferred frequency (for Window Cleaning)</label>
            <div className="flex flex-wrap gap-4 rounded-md border border-white/10 bg-white/5 p-3">
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" value="4-weekly" className="accent-[var(--brand-red)]" {...register('frequency')} /> 4 weekly
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" value="8-weekly" className="accent-[var(--brand-red)]" {...register('frequency')} /> 8 weekly
              </label>
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="radio" value="ad-hoc" className="accent-[var(--brand-red)]" {...register('frequency')} /> Ad hoc (additional cost)
              </label>
            </div>
            {errors.frequency && <p className="mt-1 text-xs text-red-400">{errors.frequency.message as string}</p>}
          </div>
        )}

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Photos (optional)</label>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            className="block w-full rounded-md border border-white/10 bg-white/5 file:mr-4 file:rounded-md file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-white"
            {...register('photos')}
          />
          <p className="mt-1 text-xs text-white/60">You can attach photos to help us quote accurately. Max 6 images.</p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm">Message</label>
          <textarea
            className="min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red"
            placeholder="Tell us about your property or special requirements"
            {...register('message')}
          />
        </div>
      </div>

      {/* Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />

      {/* Hidden derived fields for EmailJS template compatibility */}
      <input type="hidden" name="name" />
      <input type="hidden" name="services_joined" />
      <input type="hidden" name="submitted_at" />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md bg-[var(--brand-red)] px-5 py-3 font-medium text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-2 disabled:opacity-60"
        >
          {isSubmitting ? 'Sending…' : 'Send message'}
        </button>
        {status === 'success' && <p className="text-sm text-emerald-400">Thanks! We will be in touch shortly.</p>}
        {status === 'error' && <p className="text-sm text-red-400">Sorry, something went wrong. Please try again.</p>}
      </div>
      <p className="mt-2 text-xs text-white/50">We respect your privacy. Your details are only used to respond to your enquiry.</p>
    </form>
  )
}
