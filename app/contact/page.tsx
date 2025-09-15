"use client"

import React from 'react'
import Section from '@/components/Section'
import ContactForm from '@/components/ContactForm'

type CustomerType = 'new' | 'existing'

export default function ContactPage() {
  const [customerType, setCustomerType] = React.useState<CustomerType>('new')

  return (
    <div className="py-16 md:py-20">
      {/* Hero Section */}
      <Section 
        title="Get in touch" 
        subtitle="Tell us about your property and we'll provide transparent pricing with no hidden fees. We'll get back to you within the first working day."
        spacing="relaxed"
      >
        {/* Customer Type Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          {/* New Customer */}
          <div 
            className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 ${
              customerType === 'new' 
                ? 'border-brand-red bg-gradient-to-br from-brand-red/20 to-brand-red/5 transform scale-105' 
                : 'border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:border-white/30'
            }`}
            onClick={() => setCustomerType('new')}
          >
            {customerType === 'new' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            <div className="p-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">New Customer</h3>
              <p className="text-sm text-white/70 mb-6">
                Ready to book our services? Get in touch to discuss your property needs and receive a comprehensive quotation.
              </p>
              <div className="text-xs text-brand-red font-medium">Get Quote →</div>
            </div>
          </div>

          {/* Existing Customer */}
          <div 
            className={`relative overflow-hidden rounded-2xl border cursor-pointer transition-all duration-300 ${
              customerType === 'existing' 
                ? 'border-brand-red bg-gradient-to-br from-brand-red/20 to-brand-red/5 transform scale-105' 
                : 'border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:border-white/30'
            }`}
            onClick={() => setCustomerType('existing')}
          >
            {customerType === 'existing' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            <div className="p-8">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Existing Customer</h3>
              <p className="text-sm text-white/70 mb-6">
                Already a customer? Update your details, book additional services, or make changes to your regular cleaning schedule.
              </p>
              <div className="text-xs text-blue-400 font-medium">Update Details →</div>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.479 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-2.462-.96-4.779-2.705-6.526-1.746-1.746-4.065-2.709-6.526-2.711-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.092-.636z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">WhatsApp</h3>
            <p className="text-sm text-white/70 mb-4">Quick response via WhatsApp</p>
            <a
              href="https://wa.me/447415526331?text=Hi%20Somerset%20Window%20Cleaning%2C%20I%27d%20like%20to%20enquire%20about%20your%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.479 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-2.462-.96-4.779-2.705-6.526-1.746-1.746-4.065-2.709-6.526-2.711-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.092-.636z"/>
              </svg>
              Message Us
            </a>
          </div>

          <div className="text-center p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
            <p className="text-sm text-white/70 mb-4">Speak directly with our team</p>
            <a
              href="tel:07415526331"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              07415 526331
            </a>
          </div>

          <div className="text-center p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Online Form</h3>
            <p className="text-sm text-white/70 mb-4">Complete the form below</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-red text-white rounded-lg text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Form Below
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <ContactForm customerType={customerType} />
      </Section>
    </div>
  )
}