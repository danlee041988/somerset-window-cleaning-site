"use client"

import React from 'react'
import { SERVICE_AREAS, BUSINESS_BASE, generateServiceAreaMapData } from '@/lib/google-maps'
import { analytics } from '@/lib/analytics'

interface ServiceAreaMapProps {
  className?: string
  showCoverage?: boolean
  interactive?: boolean
}

export default function ServiceAreaMap({ 
  className = '', 
  showCoverage = true, 
  interactive = true 
}: ServiceAreaMapProps) {
  const [selectedArea, setSelectedArea] = React.useState<string | null>(null)
  const mapData = generateServiceAreaMapData()

  React.useEffect(() => {
    // Track service area map interaction
    analytics.trackCustomEvent('service_area_map_view', 'Service Areas', 'Map Loaded', 1)
  }, [])

  const handleAreaClick = (areaName: string) => {
    if (!interactive) return
    
    setSelectedArea(selectedArea === areaName ? null : areaName)
    analytics.trackCustomEvent('service_area_clicked', 'Service Areas', areaName, 1)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'primary':
        return '#E11D2A'
      case 'secondary':
        return '#FF6B6B'
      case 'extended':
        return '#FFA07A'
      default:
        return '#888888'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'primary':
        return 'Primary Service Area'
      case 'secondary':
        return 'Secondary Service Area'
      case 'extended':
        return 'Extended Service Area'
      default:
        return 'Service Area'
    }
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-red to-transparent" />
      
      <div className="p-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent mb-3">
            Service Coverage Areas
          </h2>
          <p className="text-white/80">
            We provide professional window cleaning services across Somerset and surrounding areas.
          </p>
        </div>

        {/* Service Area Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {SERVICE_AREAS.map((area) => {
            const isSelected = selectedArea === area.name
            const priorityColor = getPriorityColor(area.priority)
            
            return (
              <div
                key={area.name}
                className={`relative p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-brand-red bg-brand-red/10 shadow-lg shadow-brand-red/25'
                    : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                } ${interactive ? 'cursor-pointer' : 'cursor-default'}`}
                onClick={() => handleAreaClick(area.name)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: priorityColor }}
                    />
                    <h3 className="text-lg font-semibold text-white">
                      {area.name}
                    </h3>
                  </div>
                  {interactive && (
                    <svg 
                      className={`w-5 h-5 text-white/60 transition-transform duration-300 ${
                        isSelected ? 'rotate-180' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-white/80">
                    <span className="font-medium">{getPriorityLabel(area.priority)}</span>
                  </div>
                  
                  <div className="text-xs text-white/60">
                    Coverage: {area.radius}km radius
                  </div>
                  
                  <div className="text-xs text-white/60">
                    Postcodes: {area.postcodes.join(', ')}
                  </div>
                </div>

                {isSelected && showCoverage && (
                  <div className="mt-4 pt-3 border-t border-white/20">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-white/90">
                          {area.priority === 'primary' && 'Regular weekly/fortnightly service'}
                          {area.priority === 'secondary' && 'Scheduled monthly service'}
                          {area.priority === 'extended' && 'Quarterly service available'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-white/90">
                          {area.priority === 'primary' && 'Same-day emergency service'}
                          {area.priority === 'secondary' && 'Next-day service available'}
                          {area.priority === 'extended' && 'Scheduled service visits'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        <span className="text-white/90">
                          {area.priority === 'primary' && 'Standard pricing'}
                          {area.priority === 'secondary' && 'Standard pricing'}
                          {area.priority === 'extended' && 'Small travel surcharge may apply'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Business Base Information */}
        <div className="rounded-lg border border-brand-red/30 bg-gradient-to-br from-brand-red/10 to-brand-red/5 p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                Somerset Window Cleaning Base
              </h3>
              <p className="text-white/80 text-sm mb-2">
                {BUSINESS_BASE.address}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/80">Central Somerset location</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-white/80">Rapid response across all areas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coverage Legend */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <h4 className="text-sm font-semibold text-white/90 mb-3">Service Area Legend</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E11D2A' }} />
              <span className="text-xs text-white/80">Primary Areas (Regular Service)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF6B6B' }} />
              <span className="text-xs text-white/80">Secondary Areas (Scheduled)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFA07A' }} />
              <span className="text-xs text-white/80">Extended Areas (Quarterly)</span>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-white/60">
            <p>
              📍 Don&apos;t see your area listed? Contact us to discuss special arrangements for locations outside our standard service areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}