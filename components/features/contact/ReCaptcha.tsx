"use client"

import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'
import { recaptchaConfig } from '@/lib/config/env'

const LOCAL_RECAPTCHA_TEST_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
const LOCAL_OVERRIDE_SITE_KEY = (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY_LOCAL || '').trim()

const isLocalHostname = (hostname: string) =>
  hostname === 'localhost' ||
  hostname === '127.0.0.1' ||
  hostname === '::1' ||
  hostname.endsWith('.local')

interface ReCaptchaProps {
  onChange: (token: string | null) => void
  onExpired?: () => void
  className?: string
}

export default function ReCaptcha({ onChange, onExpired, className = '' }: ReCaptchaProps) {
  const siteKey = recaptchaConfig.siteKey
  const hostname = typeof window !== 'undefined' ? window.location.hostname : ''
  const resolvedSiteKey = React.useMemo(() => {
    if (hostname && isLocalHostname(hostname)) {
      return LOCAL_OVERRIDE_SITE_KEY || LOCAL_RECAPTCHA_TEST_KEY
    }

    return siteKey
  }, [hostname, siteKey])

  // Enhanced logging for debugging
  React.useEffect(() => {
    const masked = (key: string) => (key ? `${key.substring(0, 10)}...` : 'MISSING')
    console.log('ReCAPTCHA Debug Info:', {
      configuredSiteKey: masked(siteKey),
      resolvedSiteKey: masked(resolvedSiteKey),
      hostname: hostname || 'unknown',
      nodeEnv: process.env.NODE_ENV,
    })

    if (hostname && isLocalHostname(hostname)) {
      if (LOCAL_OVERRIDE_SITE_KEY) {
        console.info('[reCAPTCHA] Using local override site key for development environment.')
      } else {
        console.info('[reCAPTCHA] Falling back to Google test site key for local development.')
      }
    }
  }, [hostname, siteKey, resolvedSiteKey])

  if (!resolvedSiteKey) {
    console.error('ReCAPTCHA site key not found in environment variables')

    // Always show error - this is critical for form functionality
    return (
      <div className={`flex justify-center ${className}`}>
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded text-sm text-center">
          ⚠️ reCAPTCHA configuration error
          <div className="text-xs mt-1">Please contact support if this persists</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ReCAPTCHA
        sitekey={resolvedSiteKey}
        onChange={onChange}
        onExpired={onExpired}
        onLoad={() => console.log('reCAPTCHA loaded successfully')}
        onError={(error) => console.error('reCAPTCHA error:', error)}
        theme="dark"
        size="normal"
        className="recaptcha-container"
      />
    </div>
  )
}
