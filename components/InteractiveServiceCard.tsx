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
  process?: string[]
  equipment?: string[]
  guarantee?: string
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
  specialty,
  process = [],
  equipment = [],
  guarantee
}: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div 
      className={`service-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-brand-red/10`}
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
          
          {/* Minimal gradient overlay for better image visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {specialty && (
            <div className="absolute left-4 top-4 rounded-full bg-brand-red/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
              {specialty}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Header with price */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white transition-colors duration-300">
              {title}
            </h3>
          </div>
          {price && (
            <div className="ml-4 text-right">
              <span className="text-sm font-semibold uppercase tracking-wide text-brand-red whitespace-nowrap">
                {price}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 leading-relaxed mb-2">
          {description}
        </p>

        {frequency && (
          <p className="mb-4 text-xs font-semibold tracking-wide text-brand-red/80">
            Suggested schedule: {frequency}
          </p>
        )}

        {/* Benefits with icons */}
        {benefits.length > 0 && (
          <div className="space-y-2 mb-4">
            {benefits.slice(0, 4).map((benefit, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isHovered ? 'translate-x-1' : 'translate-x-0'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="flex h-6 w-6 items-center justify-center">
                  <span className="text-brand-red font-bold text-lg">{benefit.icon}</span>
                </div>
                <span className="text-sm text-white/90">{benefit.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Details toggle + action */}
        <div className="mt-auto space-y-3">
          {(longDescription || process.length > 0 || equipment.length > 0 || guarantee) && (
            <div>
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                className="text-sm font-semibold text-brand-red transition-colors hover:text-brand-red/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                aria-expanded={showDetails}
              >
                {showDetails ? 'Hide detailed breakdown' : 'View service breakdown'}
              </button>

              {showDetails && (
                <div className="mt-4 space-y-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  {longDescription && (
                    <p className="text-sm text-white/80 leading-relaxed">
                      {longDescription}
                    </p>
                  )}

                  {process.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-2">How we work</h4>
                      <ol className="space-y-1 text-sm text-white/70 list-decimal list-inside">
                        {process.slice(0, 5).map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {equipment.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-2">Best suited for</h4>
                      <ul className="space-y-1 text-sm text-white/70 list-disc list-inside">
                        {equipment.slice(0, 5).map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {guarantee && (
                    <div className="rounded-lg bg-white/5 p-3 text-sm text-white/80 border border-white/10">
                      <span className="font-semibold text-white">Our Guarantee:</span> {guarantee}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

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
          </div>
        </div>

        {/* Hover effect indicator */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 ${
          isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`} />
      </div>
    </div>
  )
}
