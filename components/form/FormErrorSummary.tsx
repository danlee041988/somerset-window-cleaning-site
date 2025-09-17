"use client"

import React from 'react'
import { scrollToElement } from '@/lib/utils'

interface FormErrorSummaryProps {
  errors: Record<string, string>
  generalErrors?: string[]
  className?: string
}

export function FormErrorSummary({ errors, generalErrors = [], className }: FormErrorSummaryProps) {
  const fieldErrors = Object.entries(errors)
  const totalErrorCount = fieldErrors.length + generalErrors.length

  if (totalErrorCount === 0) return null

  const handleErrorClick = (fieldName: string) => {
    scrollToElement(fieldName, 120)
    
    // Focus the field
    const element = document.getElementById(fieldName) || 
                   document.querySelector(`[name="${fieldName}"]`) as HTMLElement
    if (element && 'focus' in element) {
      setTimeout(() => element.focus(), 300)
    }
  }

  const getFieldLabel = (fieldName: string): string => {
    const fieldLabels: Record<string, string> = {
      customer_type: 'Customer Type',
      first_name: 'First Name',
      last_name: 'Last Name',
      email: 'Email Address',
      mobile: 'Mobile Number',
      property_address: 'Property Address',
      preferred_contact: 'Preferred Contact Method',
      property_combo: 'Property Type & Size',
      property_type: 'Property Type',
      bedrooms: 'Property Size',
      services: 'Services',
      frequency: 'Cleaning Frequency',
      message: 'Message',
      property_notes: 'Property Notes',
      recaptcha: 'reCAPTCHA Verification',
    }
    
    return fieldLabels[fieldName] || fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div 
      className={`rounded-lg border border-red-400/50 bg-red-500/10 p-4 mb-6 ${className}`}
      role="alert"
      aria-labelledby="error-summary-title"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 id="error-summary-title" className="text-lg font-semibold text-red-400 mb-3">
            {totalErrorCount === 1 ? 'Please fix this error:' : `Please fix these ${totalErrorCount} errors:`}
          </h3>
          
          <ul className="space-y-2">
            {/* General errors */}
            {generalErrors.map((error, index) => (
              <li key={`general-${index}`} className="text-sm text-white/90">
                <span className="text-red-400">•</span> {error}
              </li>
            ))}
            
            {/* Field errors */}
            {fieldErrors.map(([fieldName, errorMessage]) => (
              <li key={fieldName} className="text-sm">
                <button
                  type="button"
                  onClick={() => handleErrorClick(fieldName)}
                  className="text-left hover:text-white transition-colors text-white/90 underline decoration-red-400/50 hover:decoration-red-400"
                >
                  <span className="text-red-400">•</span> <strong>{getFieldLabel(fieldName)}:</strong> {errorMessage}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-3 border-t border-red-400/30">
            <p className="text-xs text-white/70 flex items-center gap-2">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Click on any error above to jump directly to that field
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface SubmissionErrorProps {
  error: string
  retry?: () => void
  className?: string
}

export function SubmissionError({ error, retry, className }: SubmissionErrorProps) {
  return (
    <div 
      className={`rounded-lg border border-red-400/50 bg-red-500/10 p-4 ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Submission Failed
          </h3>
          <p className="text-white/90 text-sm mb-4">
            {error}
          </p>
          
          <div className="flex flex-wrap gap-3">
            {retry && (
              <button
                type="button"
                onClick={retry}
                className="px-4 py-2 bg-red-500/20 border border-red-400/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            )}
            <a
              href="tel:07415526331"
              className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Call Us: 07415 526331
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}