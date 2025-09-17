"use client"

import React from 'react'
import { validateAddress, type AddressValidationResult, getServiceAreaInfo } from '@/lib/google-maps'
import { analytics } from '@/lib/analytics'

interface PlaceResult {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
  types: string[]
}

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  onAddressSelect?: (validation: AddressValidationResult) => void
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

// Load Google Places API
const loadGooglePlacesAPI = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if already loaded
    if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
      resolve()
      return
    }

    // Check if script is already loading
    if (document.querySelector('script[src*="maps.googleapis.com"]')) {
      // Wait for existing script to load
      const checkLoaded = () => {
        if ((window as any).google && (window as any).google.maps && (window as any).google.maps.places) {
          resolve()
        } else {
          setTimeout(checkLoaded, 100)
        }
      }
      checkLoaded()
      return
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      reject(new Error('Google Maps API key not configured'))
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`
    script.async = true
    script.defer = true
    
    // Global callback for Google Maps
    ;(window as any).initGoogleMaps = () => {
      resolve()
    }
    
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps API'))
    }
    
    document.head.appendChild(script)
  })
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing your address...",
  className = "",
  required = false,
  disabled = false
}: AddressAutocompleteProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const autocompleteRef = React.useRef<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<PlaceResult[]>([])
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const [isValidating, setIsValidating] = React.useState(false)
  const [addressValidation, setAddressValidation] = React.useState<AddressValidationResult | null>(null)
  const [apiLoaded, setApiLoaded] = React.useState(false)

  // Initialize Google Places API
  React.useEffect(() => {
    const initAPI = async () => {
      try {
        setIsLoading(true)
        await loadGooglePlacesAPI()
        setApiLoaded(true)
        // analytics.trackCustomEvent('google_places_loaded', 'Address Input', 'API Loaded', 1)
      } catch (error) {
        console.error('Failed to load Google Places API:', error)
        // analytics.trackCustomEvent('google_places_error', 'Address Input', 'API Load Failed', 0)
      } finally {
        setIsLoading(false)
      }
    }

    initAPI()
  }, [])

  // Initialize autocomplete when API is loaded
  React.useEffect(() => {
    if (!apiLoaded || !inputRef.current) return

    try {
      // Configure autocomplete for UK addresses
      const autocomplete = new (window as any).google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'gb' },
        fields: ['place_id', 'formatted_address', 'address_components', 'geometry'],
        types: ['address']
      })

      autocompleteRef.current = autocomplete

      // Handle place selection
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (place.formatted_address) {
          handlePlaceSelect(place.formatted_address)
        }
      })

      // analytics.trackCustomEvent('autocomplete_initialized', 'Address Input', 'Autocomplete Ready', 1)
    } catch (error) {
      console.error('Failed to initialize autocomplete:', error)
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current)
      }
    }
  }, [apiLoaded])

  // Handle address selection and validation
  const handlePlaceSelect = async (selectedAddress: string) => {
    onChange(selectedAddress)
    setShowSuggestions(false)
    setIsValidating(true)

    try {
      const validation = await validateAddress(selectedAddress)
      setAddressValidation(validation)
      
      if (onAddressSelect) {
        onAddressSelect(validation)
      }

      // Track address selection
      analytics.trackCustomEvent('address_selected', 'Address Input', validation.inServiceArea ? 'Service Area' : 'Outside Area', 1)
    } catch (error) {
      console.error('Address validation error:', error)
      setAddressValidation(null)
    } finally {
      setIsValidating(false)
    }
  }

  // Handle manual typing (fallback when Places API isn't available)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Clear validation when user types
    if (addressValidation && newValue !== value) {
      setAddressValidation(null)
    }

    // If API not loaded, use fallback validation after user stops typing
    if (!apiLoaded && newValue.length > 5) {
      const timeoutId = setTimeout(async () => {
        setIsValidating(true)
        try {
          const validation = await validateAddress(newValue)
          setAddressValidation(validation)
          if (onAddressSelect) {
            onAddressSelect(validation)
          }
        } catch (error) {
          console.error('Fallback validation error:', error)
        } finally {
          setIsValidating(false)
        }
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % suggestions.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handlePlaceSelect(suggestions[selectedIndex].description)
        }
        break
      case 'Escape':
        setShowSuggestions(false)
        setSelectedIndex(-1)
        break
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full px-4 py-3 pr-12 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors ${className}`}
        />
        
        {/* Loading/Validation Indicator */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {(isLoading || isValidating) && (
            <svg className="w-5 h-5 animate-spin text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          {!isLoading && !isValidating && apiLoaded && (
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Address Validation Results */}
      {addressValidation && (
        <div className={`mt-3 p-4 rounded-lg border transition-all duration-300 ${
          addressValidation.inServiceArea
            ? 'border-green-500/30 bg-green-500/10'
            : 'border-orange-500/30 bg-orange-500/10'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
              addressValidation.inServiceArea ? 'bg-green-500/20' : 'bg-orange-500/20'
            }`}>
              {addressValidation.inServiceArea ? (
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01" />
                </svg>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className={`font-medium text-sm mb-1 ${
                addressValidation.inServiceArea ? 'text-green-400' : 'text-orange-400'
              }`}>
                {addressValidation.inServiceArea 
                  ? '✅ Address confirmed - within service area'
                  : '⚠️ Address outside standard service area'
                }
              </div>
              
              {addressValidation.formattedAddress && (
                <div className="text-white/80 text-sm mb-2">
                  📍 {addressValidation.formattedAddress}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {addressValidation.locality && (
                  <div className="text-white/70">
                    🏘️ {addressValidation.locality}
                  </div>
                )}
                {addressValidation.postcode && (
                  <div className="text-white/70">
                    📮 {addressValidation.postcode}
                  </div>
                )}
                {addressValidation.distanceFromBase && (
                  <div className="text-white/70">
                    🚗 {addressValidation.distanceFromBase.toFixed(1)}km from base
                  </div>
                )}
                {addressValidation.estimatedTravelTime && (
                  <div className="text-white/70">
                    ⏱️ {addressValidation.estimatedTravelTime} mins travel
                  </div>
                )}
              </div>
              
              {/* Service Area Information */}
              {addressValidation.inServiceArea ? (
                <div className="mt-3 p-2 rounded bg-green-500/10 border border-green-500/20">
                  <div className="text-green-400 font-medium text-xs mb-1">
                    {getServiceAreaInfo('primary').message}
                  </div>
                  <div className="text-white/70 text-xs">
                    {getServiceAreaInfo('primary').callToAction}
                  </div>
                </div>
              ) : (
                <div className="mt-3 p-2 rounded bg-orange-500/10 border border-orange-500/20">
                  <div className="text-orange-400 font-medium text-xs mb-1">
                    {getServiceAreaInfo('outside').message}
                  </div>
                  <div className="text-white/70 text-xs">
                    {getServiceAreaInfo('outside').callToAction}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* API Status Indicator */}
      {!apiLoaded && !isLoading && (
        <div className="mt-2 text-xs text-white/60 flex items-center gap-2">
          <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Address autocomplete unavailable - manual entry enabled
        </div>
      )}
    </div>
  )
}