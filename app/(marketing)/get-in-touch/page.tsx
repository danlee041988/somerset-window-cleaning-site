"use client"

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Section from '@/components/ui/Section'
import BusinessHours from '@/components/BusinessHours'
import Button from '@/components/ui/Button'
import GeneralEnquiryForm from '@/components/features/contact/GeneralEnquiryForm'

function GetInTouchContent() {
  const searchParams = useSearchParams()
  const service = searchParams.get('service')

  return (
    <div className="py-16 md:py-20">
      {/* Hero Section */}
      <Section 
        title="Get in touch" 
        subtitle="Send us a quick message and we’ll respond within one working day. Ready to confirm a visit? Head over to our booking page."
        spacing="relaxed"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <GeneralEnquiryForm defaultService={service || undefined} />

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Prefer to book straight away?</h3>
              <p className="mt-2 text-sm text-white/70">
                If you already know the services you need and want to lock in a slot, head to our booking page to choose your frequency and request a visit date.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/book-appointment" variant="primary">
                  Go to booking form
                </Button>
                <Button href="/pricing" variant="secondary">
                  View pricing guide
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Talk to us</h3>
              <div className="mt-4 space-y-3 text-sm text-white/80">
                <p>Phone: <a className="font-semibold text-white underline decoration-brand-red/60 underline-offset-4" href="tel:01458860339">01458 860 339</a></p>
                <p>Email: <a className="font-semibold text-white underline decoration-brand-red/60 underline-offset-4" href="mailto:info@somersetwindowcleaning.co.uk">info@somersetwindowcleaning.co.uk</a></p>
                <p>WhatsApp: <a className="font-semibold text-white underline decoration-brand-red/60 underline-offset-4" href="https://wa.me/441458860339" target="_blank" rel="noopener noreferrer">Message us on WhatsApp</a></p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Business hours</h3>
              <p className="mt-2 text-sm text-white/70">We operate Monday to Friday, 9am–4pm. Messages sent outside these hours are picked up first thing next day.</p>
              <div className="mt-4">
                <BusinessHours variant="full" />
              </div>
            </div>
          </div>
        </div>

      </Section>
    </div>
  )
}

export default function GetInTouchPage() {
  return (
    <Suspense fallback={
      <div className="py-16 md:py-20">
        <Section 
          title="Get in touch" 
          subtitle="Send us a quick message and we’ll respond within one working day. Ready to confirm a visit? Head over to our booking page."
          spacing="relaxed"
        >
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
            <p>Loading contact form...</p>
          </div>
        </Section>
      </div>
    }>
      <GetInTouchContent />
    </Suspense>
  )
}
