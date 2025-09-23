'use client'

import { useState, useEffect, useCallback } from 'react'
import Button from '@/components/ui/Button'
import BusinessHours, { useBusinessStatus } from './BusinessHours'
import { analytics } from '@/lib/analytics'
import { pushToDataLayer } from '@/lib/dataLayer'

export default function StickyCTABar() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const businessStatus = useBusinessStatus()
  const trackPhoneClick = useCallback((source: string) => {
    analytics.quoteRequest('phone')
    pushToDataLayer('phone_click', { source })
  }, [])
  
  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (approximately 600px)
      const shouldShow = window.scrollY > 600
      setIsVisible(shouldShow)
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  // Don't render if not visible
  if (!isVisible) return null
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-500 ${
      isVisible ? 'translate-y-0' : 'translate-y-full'
    }`}>
      {/* Gradient fade from transparent to solid */}
      <div className="absolute inset-x-0 -top-8 h-8 bg-gradient-to-b from-transparent to-black/50 pointer-events-none" />
      
      {/* Main bar */}
      <div className="bg-black/95 backdrop-blur-lg border-t border-white/10">
        {!isMinimized ? (
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left side - Message and business hours */}
              <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <p className="text-white font-medium">
                  Ready for a tailored quote?
                </p>
                <BusinessHours variant="compact" />
              </div>
              
              {/* Right side - CTAs */}
              <div className="flex items-center gap-3">
                {businessStatus.isOpen && (
                  <a
                    href="tel:01458860339"
                    onClick={() => trackPhoneClick('sticky_cta_primary')}
                    className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-300 bg-transparent text-white hover:bg-white/10 active:scale-95 border border-white/20"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="hidden sm:inline">Call Now</span>
                    <span className="sm:hidden">Call</span>
                  </a>
                )}
                
                <Button href="/book-appointment?intent=quote" variant="primary" className="text-sm px-4 py-2">
                  Request Quote
                </Button>
                
                {/* Minimize button */}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="ml-2 p-1.5 rounded-md hover:bg-white/10 transition-colors"
                  aria-label="Minimize CTA bar"
                >
                  <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Minimized state
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/80">Ready to request a visit?</p>
              <div className="flex items-center gap-2">
                {businessStatus.isOpen && (
                  <>
                    <a
                      href="tel:01458860339"
                      onClick={() => trackPhoneClick('sticky_cta_minimised')}
                      className="text-sm text-brand-red hover:text-brand-red/80 font-medium"
                    >
                      01458 860339
                    </a>
                    <span className="text-white/40">|</span>
                  </>
                )}
                <a
                  href="/book-appointment?intent=quote"
                  className="text-sm text-brand-red hover:text-brand-red/80 font-medium"
                >
                  Request Quote
                </a>
                <button
                  onClick={() => setIsMinimized(false)}
                  className="ml-3 p-1 rounded-md hover:bg-white/10 transition-colors"
                  aria-label="Expand CTA bar"
                >
                  <svg className="w-4 h-4 text-white/60 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
