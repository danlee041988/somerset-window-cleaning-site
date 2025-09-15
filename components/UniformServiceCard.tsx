'use client'

import React, { useState } from 'react'
import Button from './Button'
import ImageWithFallback from './ImageWithFallback'

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

export default function UniformServiceCard({ 
  title, 
  description, 
  longDescription,
  imageSrc,
  imageAlt,
  benefits = [],
  price,
  frequency,
  ctaText = "Get Quote",
  ctaHref = "/get-in-touch",
  specialty,
  process = [],
  equipment = [],
  guarantee
}: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'benefits' | 'process' | 'equipment'>('benefits')

  return (
    <div 
      data-testid="service-card"
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
        isExpanded 
          ? 'border-brand-red bg-gradient-to-br from-brand-red/20 to-brand-red/5 shadow-2xl shadow-brand-red/20' 
          : 'border-white/20 bg-gradient-to-br from-white/10 to-white/5 hover:border-white/30'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Swirl Animation Border */}
      <div className={`absolute inset-0 rounded-2xl transition-all duration-700 ${
        isExpanded ? 'animate-spin-slow' : ''
      }`}>
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-red via-transparent to-brand-red opacity-0 transition-opacity duration-500 ${
          isExpanded ? 'opacity-30' : ''
        }`} />
      </div>

      {/* Image Section */}
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
          
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-500 ${
            isHovered 
              ? 'from-black/60 via-black/20 to-transparent opacity-90' 
              : 'from-black/40 to-transparent opacity-70'
          }`} />
          
        </div>
      )}

      {/* Content Container */}
      <div className="relative flex-1 p-6 flex flex-col">
        {/* Header Section */}
        <div className="mb-4">
          {/* Specialty Badge - now shows for all cards */}
          {specialty && (
            <div data-testid="specialty-badge" className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-brand-red/20 border border-brand-red/30">
              <div className="w-2 h-2 rounded-full bg-brand-red" />
              <span className="text-xs font-medium text-brand-red uppercase tracking-wide">
                {specialty}
              </span>
            </div>
          )}

          {/* Title and Price */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className={`text-xl font-bold transition-colors duration-300 ${
                isExpanded ? 'text-brand-red' : 'text-white group-hover:text-brand-red'
              }`}>
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
        </div>

        {/* Description */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-white/80 leading-relaxed mb-4">
            {description}
          </p>

          {/* Benefits List */}
          {benefits.length > 0 && (
            <div className="space-y-2">
              {benefits.slice(0, 4).map((benefit, index) => (
                <div 
                  key={index} 
                  data-testid="benefit-item"
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    isHovered ? 'translate-x-1' : 'translate-x-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-red/20">
                    <span className="text-xs text-brand-red">{benefit.icon}</span>
                  </div>
                  <span className="text-xs text-white/90">{benefit.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Button - Always at bottom */}
        <div className="mt-auto">
          <Button 
            href={`${ctaHref}?service=${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`}
            variant="primary"
            className={`w-full transform transition-all duration-300 ${
              isHovered ? 'scale-105 shadow-lg shadow-brand-red/20' : 'scale-100'
            }`}
          >
            {ctaText}
          </Button>
        </div>

        {/* Selection indicator */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 ${
          isExpanded ? 'w-full opacity-100' : isHovered ? 'w-3/4 opacity-75' : 'w-0 opacity-0'
        }`} />
      </div>
    </div>
  )
}