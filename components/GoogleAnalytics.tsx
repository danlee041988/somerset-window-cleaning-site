'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { initGA4, trackPageView, GA_MEASUREMENT_ID, GA_ENABLED } from '@/lib/analytics'

/**
 * Google Analytics 4 Component
 * Initializes GA4 tracking and handles page view tracking
 */
export default function GoogleAnalytics() {
  const pathname = usePathname()

  useEffect(() => {
    // Initialize GA4 on first load
    if (GA_ENABLED && GA_MEASUREMENT_ID) {
      initGA4()
    }
  }, [])

  useEffect(() => {
    // Track page views on route changes
    if (GA_ENABLED && typeof window !== 'undefined') {
      const url = window.location.href
      const title = document.title
      trackPageView(url, title)
    }
  }, [pathname])

  // Only render script tags if GA4 is enabled
  if (!GA_ENABLED || !GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Usercentrics Consent Management */}
      <script
        id="usercentrics-cmp"
        src="https://app.usercentrics.eu/browser-ui/latest/loader.js"
        data-settings-id="MqXwjOMiYycT1h"
        async
      />
      
      {/* Google tag (gtag.js) */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: 'Somerset Window Cleaning',
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false
            });
          `,
        }}
      />
    </>
  )
}