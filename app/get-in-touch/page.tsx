"use client"

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Section from '@/components/Section'
import ContactForm from '@/components/ContactForm'
import BusinessHours from '@/components/BusinessHours'

function GetInTouchContent() {
  const searchParams = useSearchParams()
  const postcode = searchParams.get('postcode')
  const area = searchParams.get('area')
  const service = searchParams.get('service')

  return (
    <div className="py-16 md:py-20">
      {/* Hero Section */}
      <Section 
        title="Get in touch" 
        subtitle="Tell us about your property and we'll provide transparent pricing with no hidden fees. We'll get back to you within the first working day."
        spacing="relaxed"
      >
        {/* Success Message from Postcode Checker */}
        {postcode && area && (
          <div className="mb-8 rounded-lg bg-green-500/20 border border-green-500/30 px-6 py-4 text-center">
            <p className="text-white">
              <span className="font-semibold">Great news!</span> We cover {area}. 
              Your postcode <span className="font-mono bg-white/10 px-2 py-1 rounded">{postcode}</span> has been added to the form below.
            </p>
          </div>
        )}

        {/* Contact Form */}
        <ContactForm 
          defaultPostcode={postcode || undefined}
          defaultService={service || undefined}
        />

        {/* Business Hours and Service Features */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Business Hours */}
          <BusinessHours variant="full" />
          
          {/* Professional Service Features */}
          <div className="p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">What to Expect After Booking</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  </svg>
                </div>
                <span className="text-sm text-white/90">Text reminders before each visit</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-white/90">Uniformed, professional staff</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  </svg>
                </div>
                <span className="text-sm text-white/90">Convenient online payments</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-red/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  </svg>
                </div>
                <span className="text-sm text-white/90">Sign-written, identifiable vans</span>
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
          subtitle="Tell us about your property and we'll provide transparent pricing with no hidden fees. We'll get back to you within the first working day."
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