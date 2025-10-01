"use client"

import React from 'react'
import Button from '@/components/ui/Button'
import { analytics } from '@/lib/analytics'

interface ExitIntentPopupProps {
  onClose?: () => void
  phoneNumber?: string
}

export default function ExitIntentPopup({
  onClose,
  phoneNumber = '01458860339',
}: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [hasShown, setHasShown] = React.useState(false)

  React.useEffect(() => {
    // Check if user has already seen popup in this session
    const seen = sessionStorage.getItem('exitIntentShown')
    if (seen) return

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from top of page (user trying to close tab/navigate away)
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true)
        setHasShown(true)
        sessionStorage.setItem('exitIntentShown', 'true')
        analytics.formError('exit_intent_triggered')
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [hasShown])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const handleCallClick = () => {
    analytics.quoteRequest('exit_intent_phone')
    handleClose()
  }

  const handleCallbackClick = () => {
    analytics.quoteRequest('exit_intent_callback')
    // Could open a callback form modal here
    handleClose()
  }

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
    >
      <div className="relative w-full max-w-md animate-fadeIn rounded-3xl border border-white/20 bg-gradient-to-br from-brand-black via-brand-black to-brand-red/10 p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-brand-red/50"
          aria-label="Close popup"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/20">
          <svg className="h-8 w-8 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center">
          <h2 id="exit-popup-title" className="text-2xl font-bold text-white">
            Need Help Choosing?
          </h2>
          <p className="mt-3 leading-relaxed-body text-white/70">
            We understand choosing the right window cleaning service can be tricky. Our friendly team is here to help answer any questions.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <Button
            href={`tel:${phoneNumber}`}
            onClick={handleCallClick}
            className="w-full justify-center py-4 text-base font-semibold"
          >
            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            Call {phoneNumber}
          </Button>

          <button
            onClick={handleClose}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-base font-semibold text-white transition hover:border-white/30 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-brand-red/50"
          >
            Continue Browsing
          </button>
        </div>

        {/* Helper text */}
        <p className="mt-4 text-center text-xs text-white/50">
          Or WhatsApp us at 07415 526 331
        </p>
      </div>
    </div>
  )
}
