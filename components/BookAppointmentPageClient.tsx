'use client'

import React from 'react'
import Section from '@/components/ui/Section'
import BookingFormImproved from '@/components/BookingFormImproved'

const BOOKING_STEPS = [
  {
    title: 'Tell us about your property',
    copy: 'Property type, bedrooms, and any extras like conservatories or extensions.',
    icon: 'home'
  },
  {
    title: 'Pick your services',
    copy: 'Windows, gutters, fascias—select what you need and how often.',
    icon: 'checkmark'
  },
  {
    title: 'Get your quote fast',
    copy: 'We\'ll confirm pricing and schedule within one working day.',
    icon: 'calendar'
  }
]

interface BookAppointmentPageClientProps {
  defaultAddress?: string
  defaultPostcode?: string
}

export default function BookAppointmentPageClient({
  defaultAddress = '',
  defaultPostcode = '',
}: BookAppointmentPageClientProps) {
  const [formStatus, setFormStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  return (
    <div className="pb-24">
      <div className="bg-brand-black py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <BookingFormImproved
            defaultAddress={defaultAddress}
            defaultPostcode={defaultPostcode}
            onStatusChange={setFormStatus}
          />
        </div>
      </div>

      {/* Only show "How it works" section when form hasn't been successfully submitted */}
      {formStatus !== 'success' && (
        <div id="how-it-works">
          <Section
            title="How it works"
            subtitle="Three simple steps to get your quote"
            spacing="relaxed"
          >
            <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
              {BOOKING_STEPS.map((step, index) => (
                <li key={step.title} className="group relative rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-brand-red/30 hover:bg-brand-red/5">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/20 to-brand-red/5 ring-2 ring-brand-red/30 transition-all group-hover:ring-brand-red/50">
                      {step.icon === 'home' && (
                        <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      )}
                      {step.icon === 'checkmark' && (
                        <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      )}
                      {step.icon === 'calendar' && (
                        <svg className="h-6 w-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-bold text-brand-red/60">Step {index + 1}</span>
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{step.copy}</p>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-start md:gap-6">
              <div className="flex-shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/20">
                  <svg className="h-5 w-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-2">Good to know</h4>
                <p className="text-sm text-white/70 leading-relaxed">
                  Light rain doesn&apos;t affect pure water results. We&apos;ll always revisit promptly if anything needs attention. Payment is flexible—settle by card or bank transfer after each visit, or set up automatic payments through GoCardless.
                </p>
              </div>
            </div>
          </Section>
        </div>
      )}
    </div>
  )
}
