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

  if (!siteKey) {
    console.warn('ReCAPTCHA site key not found in environment variables')
    return null
  }

  return (
    <div className={`flex justify-center ${className}`}>
      <ReCAPTCHA
        sitekey={siteKey}
        onChange={onChange}
        onExpired={onExpired}
        theme="dark"
        size="normal"
        className="recaptcha-container"
      />
    </div>
  )
}