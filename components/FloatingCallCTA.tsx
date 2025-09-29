'use client'

import React from 'react'
import { useBusinessStatus } from './BusinessHours'
import { analytics } from '@/lib/analytics'
import { pushToDataLayer } from '@/lib/dataLayer'

const PhoneIcon = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
)

export default function FloatingCallCTA() {
  const businessStatus = useBusinessStatus()
  const [isDismissed, setIsDismissed] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    if (!businessStatus.isOpen || isDismissed) {
      setIsReady(false)
      return
    }

    const timeout = window.setTimeout(() => setIsReady(true), 400)
    return () => window.clearTimeout(timeout)
  }, [businessStatus.isOpen, isDismissed])

  const statusText = businessStatus.status ?? ''
  const openUntilLabel = (() => {
    if (!/^open\s+/i.test(statusText)) {
      return statusText
    }
    const trimmed = statusText.replace(/^open\s+/i, '').trim()
    return trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : ''
  })()

  const handleCallClick = React.useCallback(() => {
    analytics.quoteRequest('phone')
    pushToDataLayer('phone_click', { source: 'floating_cta' })
  }, [])

  if (!isReady) {
    return null
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-40 sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-xs" data-testid="floating-call-cta">
      <div className="pointer-events-auto overflow-hidden rounded-2xl border border-emerald-300/60 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-600 shadow-xl shadow-emerald-500/30 backdrop-blur">
        <div className="flex items-start justify-between gap-2 px-4 pt-4">
          <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
            Call our team
          </span>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Dismiss call prompt"
            className="rounded-full p-1 text-white/60 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <a
          href="tel:01458860339"
          onClick={handleCallClick}
          className="group mx-4 mt-3 flex items-center gap-4 rounded-xl bg-white/10 px-4 py-3 text-white transition duration-200 hover:bg-white/15"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white">
            <PhoneIcon />
          </span>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold tracking-[0.08em]">01458 860 339</span>
            <span className="inline-flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-white/90">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              {openUntilLabel ? `Open · ${openUntilLabel}` : statusText || 'Open now'}
            </span>
          </div>
        </a>
        <div className="mx-4 mb-4 mt-3 flex items-center justify-between text-[0.6rem] font-medium uppercase tracking-[0.18em] text-white/85">
          <span>Mon–Fri 9am–4pm</span>
          <span className="text-white/70">Free quote support</span>
        </div>
      </div>
    </div>
  )
}
