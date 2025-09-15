'use client'

import React, { useState } from 'react'
import ImageWithFallback from './ImageWithFallback'
import Button from './Button'

type ServiceBenefit = {
  icon: string
  text: string
}

type Props = {
  title: string
  description: string
  longDescription?: string
  imageSrc?: string
  imageAlt?: string
  benefits?: ServiceBenefit[]
  price?: string
  frequency?: string
  ctaText?: string
  ctaHref?: string
  specialty?: string
}

export default function InteractiveServiceCard({ 
  title, 
  description, 
  longDescription,
  imageSrc, 
  imageAlt, 
  benefits = [],
  price,
  frequency,
  ctaText = "Book Now",
  ctaHref = "/get-in-touch",
  specialty
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-brand-red/10 ${
        isExpanded ? 'row-span-2' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section with Dynamic Overlay */}
      {imageSrc && (
        <div className="relative aspect-[16/9] overflow-hidden">
          <ImageWithFallback
            src={imageSrc}
            fallbackSrc="/images/photos/photo02.jpg"
            alt={imageAlt || title}
            fill
            className={`object-cover transition-transform duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            loading="lazy"
          />
          
          {/* Dynamic gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
            isHovered 
              ? 'from-black/60 via-black/20 to-transparent opacity-90' 
              : 'from-black/40 to-transparent opacity-70'
          }`} />
          
          {/* Floating specialty badge */}
          {specialty && (
            <div className="absolute top-4 right-4 rounded-full border border-brand-red/30 bg-brand-red/20 px-3 py-1 backdrop-blur-sm">
              <span className="text-xs font-medium text-brand-red">{specialty}</span>
            </div>
          )}
          
          {/* Animated service icon overlay */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-500 ${
            isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-80'
          }`}>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm">
              <ServiceIcon title={title} className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="p-6">
        {/* Header with price */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white group-hover:text-brand-red transition-colors duration-300">
              {title}
            </h3>
            {frequency && (
              <p className="text-xs text-white/60 mt-1">{frequency}</p>
            )}
          </div>
          {price && (
            <div className="ml-4 text-right">
              <span className="text-lg font-bold text-brand-red">{price}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 leading-relaxed mb-4">
          {description}
        </p>

        {/* Benefits with icons */}
        {benefits.length > 0 && (
          <div className={`space-y-2 transition-all duration-500 ${
            isExpanded ? 'mb-6' : 'mb-4'
          }`}>
            {benefits.slice(0, isExpanded ? benefits.length : 3).map((benefit, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isHovered ? 'translate-x-1' : 'translate-x-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red/20">
                  <span className="text-xs">{benefit.icon}</span>
                </div>
                <span className="text-sm text-white/90">{benefit.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Expanded content */}
        {isExpanded && longDescription && (
          <div className="mb-6 animate-fadeIn">
            <p className="text-sm text-white/70 leading-relaxed">
              {longDescription}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <Button 
            href={ctaHref}
            variant="primary"
            className={`flex-1 transform transition-all duration-300 ${
              isHovered ? 'scale-105 shadow-lg shadow-brand-red/20' : 'scale-100'
            }`}
          >
            {ctaText}
          </Button>
          
          {benefits.length > 3 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-white/20 bg-white/10 text-white/80 transition-all duration-300 hover:bg-white/20 hover:text-white"
              aria-label={isExpanded ? 'Show less' : 'Show more'}
            >
              <svg 
                className={`h-4 w-4 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Hover effect indicator */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 ${
          isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`} />
      </div>
    </div>
  )
}

// Service Icon Component
function ServiceIcon({ title, className }: { title: string; className?: string }) {
  const icons = {
    'Window Cleaning': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    'Gutter Clearing': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16l-3-9m3 9l3-9" />
      </svg>
    ),
    'Conservatory Roof Cleaning': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4 4 4 0 004-4V5z" />
      </svg>
    ),
    'Solar Panel Cleaning': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    'Fascias & Soffits Cleaning': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    'External Commercial Cleaning': (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  }
  
  return icons[title as keyof typeof icons] || icons['Window Cleaning']
}