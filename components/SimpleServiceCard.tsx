'use client'

import React from 'react'
import Button from './Button'
import ImageWithFallback from './ImageWithFallback'

type Props = {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  price?: string
  frequency?: string
  ctaText?: string
  ctaHref?: string
}

export default function SimpleServiceCard({ 
  title, 
  description, 
  imageSrc,
  imageAlt,
  price,
  frequency,
  ctaText,
  ctaHref = "/get-in-touch"
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:shadow-lg">
      {/* Image Section */}
      {imageSrc && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <ImageWithFallback
            src={imageSrc}
            fallbackSrc="/images/photos/photo02.jpg"
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            loading="lazy"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
      )}

      {/* Content Section */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-brand-red transition-colors duration-300">
              {title}
            </h3>
            {price && (
              <span className="text-lg font-bold text-brand-red ml-3">
                {price}
              </span>
            )}
          </div>
          {frequency && (
            <p className="text-xs text-white/60">{frequency}</p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-white/80 leading-relaxed mb-4 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>
          {description}
        </p>

        {/* CTA Button */}
        <Button 
          href={`/get-in-touch?service=${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`}
          variant="primary"
          className="w-full text-sm py-2.5"
        >
          {ctaText || `Book ${title}`}
        </Button>
      </div>
    </div>
  )
}