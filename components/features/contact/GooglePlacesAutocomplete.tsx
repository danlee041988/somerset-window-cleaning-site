/**
 * Google Places Autocomplete Component
 * Provides address autocomplete with UK bias
 */

'use client'

import React, { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    google?: any
    initGooglePlaces?: () => void
  }
}

interface GooglePlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onPlaceSelected?: (place: {
    address: string
    postcode: string
    city: string
    county: string
    lat: number
    lng: number
  }) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: boolean
}

export default function GooglePlacesAutocomplete({
  value,
  onChange,
  onPlaceSelected,
  placeholder = 'Start typing your address...',
  className = '',
  disabled = false,
  error = false,
}: GooglePlacesAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  // Load Google Places API
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

    if (!apiKey) {
      setLoadError('Google Places API key not configured')
      return
    }

    // Check if already loaded
    if (window.google?.maps?.places) {
      setIsLoaded(true)
      return
    }

    // Load script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&region=GB`
    script.async = true
    script.defer = true

    script.onload = () => {
      setIsLoaded(true)
    }

    script.onerror = () => {
      setLoadError('Failed to load Google Places API')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  // Initialize autocomplete
  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) {
      return
    }

    try {
      // Create autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'gb' },
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      })

      // Bias results to Somerset area
      const somersetBounds = {
        north: 51.35,
        south: 50.85,
        east: -2.25,
        west: -3.25,
      }

      autocomplete.setBounds(somersetBounds)

      // Handle place selection
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()

        if (!place.geometry || !place.address_components) {
          return
        }

        // Extract address components
        let street = ''
        let city = ''
        let county = ''
        let postcode = ''

        for (const component of place.address_components) {
          const types = component.types

          if (types.includes('street_number')) {
            street = component.long_name + ' '
          }
          if (types.includes('route')) {
            street += component.long_name
          }
          if (types.includes('postal_town') || types.includes('locality')) {
            city = component.long_name
          }
          if (types.includes('administrative_area_level_2')) {
            county = component.long_name
          }
          if (types.includes('postal_code')) {
            postcode = component.long_name
          }
        }

        const fullAddress = place.formatted_address || ''

        // Update input
        onChange(fullAddress)

        // Notify parent
        if (onPlaceSelected) {
          onPlaceSelected({
            address: fullAddress,
            postcode,
            city,
            county,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          })
        }
      })

      autocompleteRef.current = autocomplete
    } catch (err) {
      console.error('Error initializing Google Places:', err)
      setLoadError('Failed to initialize autocomplete')
    }
  }, [isLoaded, onChange, onPlaceSelected])

  // If API fails to load, show regular input
  if (loadError) {
    console.warn('Google Places Autocomplete:', loadError)
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2.5 rounded-lg border transition-colors
          ${error ? 'border-red-500 focus:border-red-600 focus:ring-red-600' : 'border-gray-300 focus:border-blue-600 focus:ring-blue-600'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
          focus:outline-none focus:ring-2
          ${className}
        `}
        aria-label="Address"
        autoComplete="off"
      />

      {isLoaded && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {loadError && (
        <p className="mt-1 text-xs text-gray-500">Using standard address input (autocomplete unavailable)</p>
      )}
    </div>
  )
}
