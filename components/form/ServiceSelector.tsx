"use client"

import React from 'react'

interface Service {
  id: string
  label: string
  description?: string
  popular?: boolean
  icon: React.ReactNode
}

interface ServiceSelectorProps {
  services: string[]
  onChange: (services: string[]) => void
  frequency?: string
  onFrequencyChange?: (frequency: string) => void
  className?: string
}

const SERVICE_OPTIONS: Service[] = [
  {
    id: 'windows',
    label: 'Window Cleaning',
    description: 'Exterior window cleaning with pure water system',
    popular: true,
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    id: 'gutters',
    label: 'Gutter Cleaning',
    description: 'Vacuum clearing with camera inspection',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
  },
  {
    id: 'fascia',
    label: 'Fascia & Soffit',
    description: 'Restore uPVC and roofline appearance',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
    id: 'conservatory',
    label: 'Conservatory',
    description: 'Roof and glass cleaning',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
]

const FREQUENCY_OPTIONS = [
  { id: 'every-4-weeks', label: 'Every 4 weeks', subtitle: 'Most popular', badge: 'Recommended' },
  { id: 'every-8-weeks', label: 'Every 8 weeks', subtitle: 'Great value' },
  { id: 'one-off', label: 'One-off clean', subtitle: 'Single visit' },
]

export default function ServiceSelector({ services, onChange, frequency, onFrequencyChange, className = '' }: ServiceSelectorProps) {
  const toggleService = (serviceId: string) => {
    if (services.includes(serviceId)) {
      onChange(services.filter((s) => s !== serviceId))
    } else {
      onChange([...services, serviceId])
    }
  }

  return (
    <div className={className}>
      <label className="mb-4 block text-lg font-semibold text-white">
        What services do you need?
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICE_OPTIONS.map((service) => {
          const isSelected = services.includes(service.id)
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => toggleService(service.id)}
              className={`group relative flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-red/30 ${
                isSelected
                  ? 'border-brand-red bg-brand-red/10 shadow-lg shadow-brand-red/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Icon */}
              <div
                className={`mt-0.5 flex-shrink-0 transition-colors ${
                  isSelected ? 'text-brand-red' : 'text-white/60 group-hover:text-white/80'
                }`}
              >
                {service.icon}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pr-8">
                <div className="mb-1">
                  <div className="font-semibold text-white">{service.label}</div>
                  {service.popular && !isSelected && (
                    <span className="mt-1 inline-block rounded-full border border-brand-gold/30 bg-brand-gold/10 px-2 py-0.5 text-xs font-semibold text-brand-gold">
                      Popular
                    </span>
                  )}
                </div>
                {service.description && (
                  <div className="mt-1 text-sm leading-relaxed-body text-white/60">{service.description}</div>
                )}
              </div>

              {/* Checkbox indicator */}
              <div className="absolute right-4 top-4">
                {isSelected ? (
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-red">
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-md border-2 border-white/20 bg-white/5 group-hover:border-white/30">
                    <svg className="h-3 w-3 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {services.length === 0 && (
        <p className="mt-3 text-sm text-white/50">Please select at least one service to continue</p>
      )}

      {/* Frequency Selection - Only show if windows are selected */}
      {services.includes('windows') && onFrequencyChange && frequency && (
        <div className="mt-8">
          <div className="mb-4 rounded-lg border border-brand-red/20 bg-brand-red/5 p-4">
            <h3 className="text-base font-medium text-white mb-1">Window Cleaning Frequency</h3>
            <p className="text-sm text-white/60">How often would you like your windows cleaned?</p>
          </div>

          <div className="space-y-3">
            {FREQUENCY_OPTIONS.map((freq) => {
              const isSelected = frequency === freq.id
              return (
                <button
                  key={freq.id}
                  type="button"
                  onClick={() => onFrequencyChange(freq.id)}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-red/30 ${
                    isSelected
                      ? 'border-brand-red bg-brand-red/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{freq.label}</div>
                      <div className="text-sm leading-relaxed-body text-white/60">{freq.subtitle}</div>
                    </div>
                    {freq.badge && isSelected && (
                      <span className="rounded-full bg-brand-gold px-2 py-0.5 text-xs font-semibold text-brand-black">
                        {freq.badge}
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
