"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

// Somerset postcodes we cover
const COVERED_POSTCODES = new Set([
  // BS postcodes
  'BS21', 'BS22', 'BS23', 'BS24', 'BS25', 'BS26', 'BS27', 'BS28', 'BS29', 'BS39', 'BS40', 'BS49',
  // BA postcodes
  'BA3', 'BA4', 'BA5', 'BA6', 'BA7', 'BA8', 'BA9', 'BA10', 'BA11', 'BA16', 'BA20', 'BA21', 'BA22',
  // TA postcodes
  'TA2', 'TA6', 'TA7', 'TA8', 'TA9', 'TA10', 'TA11', 'TA12', 'TA13', 'TA14', 'TA18', 'TA19', 'TA20', 'TA21',
  // DT postcode (Sherborne)
  'DT9'
])

// Postcode to area name mapping
const postcodeAreas: Record<string, string> = {
  'BS21': 'Clevedon',
  'BS22': 'Weston-super-Mare', 'BS23': 'Weston-super-Mare', 'BS24': 'Weston-super-Mare', 'BS25': 'Winscombe',
  'BS26': 'Axbridge', 'BS27': 'Cheddar', 'BS28': 'Wedmore', 'BS29': 'Banwell',
  'BS39': 'Clutton', 'BS40': 'Chew Valley', 'BS49': 'Wrington',
  'BA3': 'Radstock', 'BA4': 'Shepton Mallet', 'BA5': 'Wells', 'BA6': 'Glastonbury & Meare',
  'BA7': 'Castle Cary', 'BA8': 'Templecombe', 'BA9': 'Wincanton', 'BA10': 'Bruton', 'BA11': 'Frome',
  'BA16': 'Street', 'BA20': 'Yeovil', 'BA21': 'Yeovil', 'BA22': 'Yeovil',
  'TA2': 'Taunton', 'TA6': 'Bridgwater', 'TA7': 'Bridgwater', 'TA8': 'Burnham-on-Sea', 'TA9': 'Highbridge',
  'TA10': 'Langport', 'TA11': 'Somerton', 'TA12': 'Martock', 'TA13': 'South Petherton', 'TA14': 'Stoke-Sub-Hamdon',
  'TA18': 'Crewkerne', 'TA19': 'Ilminster', 'TA20': 'Chard', 'TA21': 'Wellington',
  'DT9': 'Sherborne'
}

// Utility function to format postcodes with proper spacing
const formatPostcode = (input: string): string => {
  // Remove all spaces and convert to uppercase
  const cleaned = input.replace(/\s/g, '').toUpperCase()
  
  // UK postcode format: AA9A 9AA, AA9 9AA, AA99 9AA, A9A 9AA, A9 9AA, A99 9AA
  // Match the pattern and add space before the last 3 characters
  if (cleaned.length >= 5) {
    const beforeSpace = cleaned.slice(0, -3)
    const afterSpace = cleaned.slice(-3)
    return `${beforeSpace} ${afterSpace}`
  }
  
  return cleaned
}

// Utility function to normalize postcode for checking (remove spaces, uppercase)
const normalizePostcode = (input: string): string => {
  return input.replace(/\s/g, '').toUpperCase()
}

interface PostcodeCheckerProps {
  className?: string
  variant?: 'header' | 'hero' | 'inline'
  placeholder?: string
}

export default function PostcodeChecker({ 
  className = '', 
  variant = 'inline',
  placeholder = 'Enter your postcode' 
}: PostcodeCheckerProps) {
  const [postcode, setPostcode] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle')
  const [areaName, setAreaName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Apply formatting as user types
    const formatted = formatPostcode(value)
    setPostcode(formatted)
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!postcode.trim()) return
    
    setStatus('checking')
    setErrorMessage('')
    
    // Normalize postcode for checking
    const normalizedPostcode = normalizePostcode(postcode)

    // Quick validation to avoid false negatives on incomplete input
    if (!/[A-Z]{1,2}\d/.test(normalizedPostcode) || normalizedPostcode.length < 3) {
      setStatus('error')
      setErrorMessage('Please enter your full Somerset postcode (e.g. BA5 1AB).')
      setTimeout(() => {
        setStatus('idle')
        setErrorMessage('')
      }, 4000)
      return
    }
    
    // Extract postcode area - we need to handle 3-4 character area codes
    // Examples: BA5, BA16, TA10, BS27, DT9
    // First try 4 characters (like BA16, TA10)
    let postcodeArea = normalizedPostcode.substring(0, 4)
    if (!COVERED_POSTCODES.has(postcodeArea)) {
      // If 4 characters don't match, try 3 characters (like BA5, TA6)
      postcodeArea = normalizedPostcode.substring(0, 3)
    }
    const matchedAreaName = postcodeAreas[postcodeArea]

    setTimeout(() => {
      if (COVERED_POSTCODES.has(postcodeArea)) {
        setStatus('success')
        setAreaName(matchedAreaName || 'your area')
        const redirectParams = new URLSearchParams({ intent: 'book' })
        const formattedPostcode = formatPostcode(normalizedPostcode)

        if (formattedPostcode) {
          redirectParams.set('postcode', formattedPostcode)
        }
        if (matchedAreaName) {
          redirectParams.set('coverageArea', matchedAreaName)
        }

        // Redirect to the quote form with postcode context once the success state is visible
        setTimeout(() => {
          router.push(`/book-appointment?${redirectParams.toString()}`)
        }, 1500)
      } else {
        setStatus('error')
        setAreaName('')
        setErrorMessage(`Sorry, we don't currently cover ${formatPostcode(postcode)}. Call us on 01458 860339.`)
        setTimeout(() => {
          setStatus('idle')
          setErrorMessage('')
        }, 3000)
      }
    }, 500)
  }

  const getInputStyles = () => {
    const base = "px-4 py-2 rounded-lg border bg-white/5 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-brand-red/20 transition-all"
    
    switch (variant) {
      case 'header':
        return `${base} text-sm w-40 md:w-48`
      case 'hero':
        return `${base} text-base w-full md:w-64`
      default:
        return `${base} text-sm w-full`
    }
  }

  const getButtonStyles = () => {
    const base = "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red/20 active:scale-95"
    
    switch (variant) {
      case 'header':
        return `${base} bg-brand-red text-white hover:bg-brand-red/80 hover:shadow-lg text-sm`
      case 'hero':
        return `${base} bg-brand-red text-white hover:bg-brand-red/80 hover:shadow-lg text-base px-6`
      default:
        return `${base} bg-brand-red text-white hover:bg-brand-red/80 hover:shadow-lg text-sm`
    }
  }

  if (status === 'success') {
    return (
      <div className={`${className} animate-fadeIn`} aria-live="polite">
        <div className="flex items-center gap-3 rounded-lg bg-green-500/20 border border-green-500/30 px-4 py-3">
          <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-white">
            <span className="font-semibold">Congratulations!</span> We cover {areaName}. Redirecting to the quote form...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} relative`}>
      <form onSubmit={handleCheck} className="flex items-center gap-2" aria-live="polite">
        <input
          type="text"
          value={postcode}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`${getInputStyles()} ${
            status === 'error' ? 'border-red-500/50' : 'border-white/20'
          }`}
          disabled={status === 'checking'}
          maxLength={8}
        />
        <button
          type="submit"
          disabled={status === 'checking' || !postcode.trim()}
          className={`${getButtonStyles()} ${!postcode.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {status === 'checking' ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span className="sr-only">Checking...</span>
            </span>
          ) : variant === 'header' ? (
            'Check'
          ) : (
            'Check Coverage'
          )}
        </button>
      </form>
      
      {status === 'error' && (
        <div className="absolute top-full mt-2 left-0 right-0 z-10">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-2 text-center">
            <span className="text-xs text-red-400">{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
