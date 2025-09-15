import React from 'react'
import ImageWithFallback from './ImageWithFallback'

type Props = {
  title: string
  description: string
  imageSrc?: string
  imageAlt?: string
  bullets?: string[]
}

export default function ServiceCard({ title, description, imageSrc, imageAlt, bullets }: Props) {
  // Add click handler for enhanced interactivity
  const handleCardClick = () => {
    console.log(`Service card clicked: ${title}`)
  }

  return (
    <div 
      className="overflow-hidden rounded-xl border border-white/10 bg-white/10 transition-all duration-300 hover:bg-white/15 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E11D2A] focus:ring-offset-2 focus:ring-offset-black"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Learn more about ${title} service`}
    >
      {imageSrc && (
        <div className="relative aspect-[16/9]">
          <ImageWithFallback
            src={imageSrc}
            fallbackSrc="/images/photos/photo02.jpg"
            alt={imageAlt || title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" aria-hidden="true" />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/80 leading-relaxed">{description}</p>
        {bullets && bullets.length > 0 && (
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            {bullets.map((bullet, index) => (
              <li key={`${title}-bullet-${index}`} className="flex items-start gap-2">
                <span className="text-[#E11D2A] font-bold mt-0.5">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )}
