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
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`service-card group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-brand-red/10`}
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


        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-auto">
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

        {/* Hover effect indicator */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 ${
          isHovered ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`} />
      </div>
    </div>
  )
}

