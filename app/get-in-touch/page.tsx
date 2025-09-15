import React from 'react'
import Section from '@/components/Section'
import ContactForm from '@/components/ContactForm'

export default function GetInTouchPage() {
  return (
    <div className="py-16 md:py-20">
      {/* Hero Section */}
      <Section 
        title="Get in touch" 
        subtitle="Tell us about your property and we'll provide transparent pricing with no hidden fees. We'll get back to you within the first working day."
        spacing="relaxed"
      >
        {/* Contact Form */}
        <ContactForm />

        {/* Alternative Contact Options */}
        <div className="mt-16 border-t border-white/10 pt-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">Prefer to contact us directly?</h3>
            <p className="text-white/70">We&apos;re here to help via WhatsApp or phone if you&apos;d rather speak to us directly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
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
                href="tel:01458860339"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                01458 860339
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}