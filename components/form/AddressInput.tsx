"use client"

import React from 'react'
import GooglePlacesAutocomplete from '@/components/features/contact/GooglePlacesAutocomplete'

interface AddressInputProps {
  address: string
  postcode: string
  onAddressChange: (address: string) => void
  onPostcodeChange: (postcode: string) => void
  onPlaceSelected?: (place: { address: string; postcode: string }) => void
  className?: string
}

export default function AddressInput({
  address,
  postcode,
  onAddressChange,
  onPostcodeChange,
  onPlaceSelected,
  className = '',
}: AddressInputProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Address field with search */}
      <div>
        <label className="mb-2 flex items-center justify-between text-sm font-medium text-white/80">
          <span>Property Address *</span>
          <span className="flex items-center gap-1 text-xs text-white/50">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Start typing to search
          </span>
        </label>

        <div className="relative">
          <GooglePlacesAutocomplete
            value={address}
            onChange={onAddressChange}
            onPlaceSelected={onPlaceSelected}
            placeholder="e.g., 123 High Street, Wells"
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 py-3 px-4 text-white placeholder:text-white/30 transition focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/20"
          />
        </div>

        <p className="mt-2 text-xs leading-relaxed-body text-white/50">
          Our Google Places search helps you find your address quickly. Just start typing and select from the suggestions.
        </p>
      </div>

      {/* Postcode field */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white/80">
          Postcode *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={postcode}
            onChange={(e) => onPostcodeChange(e.target.value.toUpperCase())}
            placeholder="e.g., BA5 1AA"
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-4 py-3 font-mono text-white placeholder:text-white/30 transition focus:border-brand-red focus:outline-none focus:ring-4 focus:ring-brand-red/20"
            maxLength={8}
          />
          {postcode && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Coverage check */}
      {postcode.length >= 4 && (
        <div className="rounded-lg border border-brand-green/30 bg-brand-green/10 p-3">
          <div className="flex items-start gap-2">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-sm leading-relaxed-body text-white/80">
              <strong className="text-white">Great news!</strong> We cover this area. We&apos;ll confirm availability when we reply to your quote.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
