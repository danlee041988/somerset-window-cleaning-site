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

export default function EnhancedServiceCard({ 
  title, 
  description, 
  longDescription,
  imageSrc,
  imageAlt,
  benefits = [],
  price,
  frequency,
  ctaText,
  ctaHref = "/get-in-touch",
  specialty,
  process = [],
  equipment = [],
  guarantee
}: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<'benefits' | 'process' | 'equipment'>('benefits')

  // Dynamic tab labels based on service type
  const getTabLabels = () => {
    switch(title) {
      case 'Window Cleaning':
        return {
          benefits: 'Frequency Options',
          equipment: 'Includes',
          process: 'Process'
        }
      case 'Gutter Clearing':
        return {
          benefits: 'Service Includes',
          equipment: 'Recommended',
          process: 'Process'
        }
      case 'Conservatory Roof Cleaning':
        return {
          benefits: 'Factors Affecting Price',
          equipment: 'Benefits',
          process: 'Process'
        }
      default:
        return {
          benefits: 'Benefits',
          equipment: 'Equipment',
          process: 'Process'
        }
    }
  }

  const tabLabels = getTabLabels()

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
      {/* Enhanced Border Animation */}
      <div className="absolute inset-0 rounded-2xl transition-all duration-700">
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

      {/* Content Container - Fixed Height Structure */}
      <div className="relative flex-1 p-6 flex flex-col h-[600px]">
        {/* Fixed Header Section */}
        <div className="mb-4">
          {/* Title and Price */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className={`text-xl font-bold transition-colors duration-300 ${
                isExpanded ? 'text-brand-red' : 'text-white group-hover:text-brand-red'
              }`}>
                {title}
              </h3>
              {frequency && (
                <p className="text-xs text-white mt-1">{frequency}</p>
              )}
            </div>
            {price && (
              <div className="ml-4 text-right">
                <span className="text-lg font-bold text-brand-red">{price}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Description - Fixed Height */}
        <div className="mb-4">
          <p className="text-sm text-white/80 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Flexible Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Expanded Content */}
          {isExpanded ? (
            <div className="flex-1 space-y-4">
              {/* Long Description */}
              {longDescription && (
                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <p className="text-sm text-white/90 leading-relaxed">
                    {longDescription}
                  </p>
                </div>
              )}

              {/* Content Tabs */}
              {(benefits.length > 0 || process.length > 0 || equipment.length > 0) && (
                <div>
                  {/* Tab Navigation */}
                  <div className="flex gap-1 mb-3 p-1 bg-black/30 rounded-lg">
                    {benefits.length > 0 && (
                      <button
                        onClick={() => setActiveTab('benefits')}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                          activeTab === 'benefits' 
                            ? 'bg-brand-red text-white' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {tabLabels.benefits}
                      </button>
                    )}
                    {process.length > 0 && (
                      <button
                        onClick={() => setActiveTab('process')}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                          activeTab === 'process' 
                            ? 'bg-brand-red text-white' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {tabLabels.process}
                      </button>
                    )}
                    {equipment.length > 0 && (
                      <button
                        onClick={() => setActiveTab('equipment')}
                        className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                          activeTab === 'equipment' 
                            ? 'bg-brand-red text-white' 
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {tabLabels.equipment}
                      </button>
                    )}
                  </div>

                  {/* Tab Content - Fixed Height */}
                  <div className="h-[160px] overflow-y-auto">
                    {activeTab === 'benefits' && benefits.length > 0 && (
                      <div className="space-y-2">
                        {benefits.map((benefit, index) => (
                          <div 
                            key={index} 
                            data-testid="benefit-item"
                            className="flex items-center gap-3 transition-all duration-300"
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

                    {activeTab === 'process' && process.length > 0 && (
                      <div className="space-y-2">
                        {process.map((step, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red/20 text-xs font-bold text-brand-red">
                              {index + 1}
                            </div>
                            <span className="text-xs text-white/90">{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'equipment' && equipment.length > 0 && (
                      <div className="space-y-2">
                        {equipment.map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-red/20">
                              <span className="text-xs text-brand-red">⚡</span>
                            </div>
                            <span className="text-xs text-white/90">{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Guarantee Section */}
              {guarantee && (
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-green-400">✓</span>
                    <span className="text-xs font-semibold text-green-400">Our Guarantee</span>
                  </div>
                  <p className="text-xs text-white/90">{guarantee}</p>
                </div>
              )}
            </div>
          ) : (
            /* Collapsed Content - Fixed Height Preview */
            <div className="flex-1">
              {benefits.length > 0 && (
                <div className="space-y-2">
                  {benefits.slice(0, 3).map((benefit, index) => (
                    <div 
                      key={index} 
                      data-testid="benefit-item"
                      className={`flex items-center gap-3 transition-all duration-300 ${
                        isHovered ? 'translate-x-1' : 'translate-x-0'
                      }`}
                      style={{ transitionDelay: `${index * 50}ms` }}
                    >
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-red/20">
                        <span className="text-xs text-brand-red">{benefit.icon}</span>
                      </div>
                      <span className="text-xs text-white/90">{benefit.text}</span>
                    </div>
                  ))}
                  {benefits.length > 3 && (
                    <p className="text-xs text-white/60 ml-7">+{benefits.length - 3} more...</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fixed Footer Section - Always at Bottom */}
        <div className="mt-auto pt-4 space-y-3">
          {/* Show More/Less Button */}
          <div className="text-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-brand-red hover:text-white transition-colors duration-300 underline"
            >
              {isExpanded ? 'Show Less' : 'Show More Details'}
            </button>
          </div>

          {/* CTA Button - Always aligned */}
          <div>
            <Button 
              href={`/get-in-touch?service=${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}`}
              variant="primary"
              className={`w-full transform transition-all duration-300 ${
                isHovered ? 'scale-105 shadow-lg shadow-brand-red/20' : 'scale-100'
              }`}
            >
              {ctaText || `Book ${title}`}
            </Button>
          </div>
        </div>

        {/* Expansion indicator */}
        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 ${
          isExpanded ? 'w-full opacity-100' : isHovered ? 'w-3/4 opacity-75' : 'w-0 opacity-0'
        }`} />
      </div>
    </div>
  )
}