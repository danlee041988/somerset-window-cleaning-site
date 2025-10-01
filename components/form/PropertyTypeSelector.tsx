"use client"

import React from 'react'

type PropertyType = 'residential' | 'commercial'

interface PropertyTypeSelectorProps {
  value: PropertyType
  onChange: (value: PropertyType) => void
  className?: string
}

const PROPERTY_OPTIONS = [
  {
    id: 'residential' as PropertyType,
    title: 'Residential',
    description: 'Home, flat, or apartment',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    id: 'commercial' as PropertyType,
    title: 'Commercial',
    description: 'Office, shop, or business',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    ),
  },
]

export default function PropertyTypeSelector({
  value,
  onChange,
  className = '',
}: PropertyTypeSelectorProps) {
  return (
    <div className={className}>
      <label className="mb-4 block text-lg font-semibold text-white">
        What type of property?
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        {PROPERTY_OPTIONS.map((option) => {
          const isSelected = option.id === value
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange(option.id)}
              className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-red/30 ${
                isSelected
                  ? 'border-brand-red bg-brand-red/10 shadow-lg shadow-brand-red/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Icon */}
              <div
                className={`mb-4 transition-colors ${
                  isSelected ? 'text-brand-red' : 'text-white/60 group-hover:text-white/80'
                }`}
              >
                {option.icon}
              </div>

              {/* Text */}
              <div className="space-y-1">
                <div className="text-xl font-semibold text-white">{option.title}</div>
                <div className="text-sm leading-relaxed-body text-white/60">{option.description}</div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-brand-red">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* Hover gradient effect */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-red/5 to-transparent" />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
