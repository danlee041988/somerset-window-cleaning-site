"use client"

import React from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface ReCaptchaProps {
  onChange: (token: string | null) => void
  onExpired?: () => void
  className?: string
}

export default function ReCaptcha({ onChange, onExpired, className = '' }: ReCaptchaProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  // Enhanced logging for debugging
  React.useEffect(() => {
    console.log('ReCAPTCHA Debug Info:', {
      siteKey: siteKey ? `${siteKey.substring(0, 10)}...` : 'MISSING',
      nodeEnv: process.env.NODE_ENV,
      hasKey: !!siteKey
    })
  }, [siteKey])

  if (!siteKey) {
    console.error('ReCAPTCHA site key not found in environment variables')
    
    // Show error in development but fail silently in production
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className={`flex justify-center ${className}`}>
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded text-sm">
            ⚠️ reCAPTCHA site key missing from environment variables
          </div>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ReCAPTCHA
        sitekey={siteKey}
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