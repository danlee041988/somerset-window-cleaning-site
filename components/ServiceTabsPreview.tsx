"use client"

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { SERVICE_IMAGES } from '@/content/image-manifest'

type Service = {
  id: string
  name: string
  description: string
  keyBenefit: string
  price: string
  priceDetail?: string
  image: string
  href: string
  popular?: boolean
}

const SERVICES: readonly Service[] = [
  {
    id: 'window-cleaning',
    name: 'Window Cleaning',
    description: 'Pure water cleaning of glass, frames, and sills. Routine 4 or 8-week visits.',
    keyBenefit: 'Spotless windows, streak-free finish',
    price: 'From £20',
    priceDetail: 'per visit',
    image: SERVICE_IMAGES.window || '/photos/photo02.jpg',
    href: '/services/window-cleaning',
    popular: true,
  },
  {
    id: 'gutter-clearing',
    name: 'Gutter Clearing',
    description: 'Ground-based vacuum system removes moss and debris to prevent overflow and damp.',
    keyBenefit: 'Camera inspection included',
    price: 'Custom Quote',
    image: SERVICE_IMAGES.gutter || '/photos/photo03.jpg',
    href: '/services/gutter-clearing',
  },
  {
    id: 'conservatory',
    name: 'Conservatory Roof',
    description: 'Gentle clean of roofs, glazing bars, and finials to restore natural light.',
    keyBenefit: 'Bring back the light',
    price: 'Custom Quote',
    image: SERVICE_IMAGES.conservatory || '/photos/photo04.jpg',
    href: '/services/conservatory-roof-cleaning',
  },
  {
    id: 'fascias-soffits',
    name: 'Fascias & Soffits',
    description: 'Deep clean of uPVC fascias, soffits, and gutter exteriors for instant curb appeal.',
    keyBenefit: 'Restores brilliant white finish',
    price: 'Bundle Available',
    image: SERVICE_IMAGES.fascias || '/photos/photo06.jpg',
    href: '/services/fascias-soffits-cleaning',
  },
]

export default function ServiceTabsPreview() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      {/* Services Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.slice(0, 3).map((service) => (
          <Link
            key={service.id}
            href={service.href}
            onMouseEnter={() => setHoveredId(service.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group glass-noir-card glass-noir-card--tight relative overflow-hidden transition-all duration-300 hover:border-brand-red/30 hover:shadow-[0_0_30px_-10px_rgba(225,29,42,0.3)]"
          >
            {/* Popular Badge */}
            {service.popular && (
              <div className="absolute left-4 top-4 z-10 rounded-full border border-brand-red/30 bg-brand-red/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                Most Popular
              </div>
            )}

            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${hoveredId === service.id ? 'opacity-100' : 'opacity-0'}`}>
                <div className="flex h-full items-center justify-center">
                  <div className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm">
                    View Details →
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-3">
              {/* Title & Price */}
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold text-white">{service.name}</h3>
                <div className="flex-shrink-0 text-right">
                  <div className="text-base font-bold text-brand-red">{service.price}</div>
                  {service.priceDetail && (
                    <div className="text-xs text-white/50">{service.priceDetail}</div>
                  )}
                </div>
              </div>

              {/* Key Benefit */}
              <div className="flex items-center gap-2 text-sm text-white/70">
                <svg className="h-4 w-4 flex-shrink-0 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{service.keyBenefit}</span>
              </div>

              {/* Description */}
              <p className="text-sm leading-relaxed text-white/60">{service.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Bottom CTA Row */}
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-6 md:flex-row md:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-white">Ready for spotless windows?</h4>
          <p className="text-sm text-white/60">Get a tailored quote for your property in minutes</p>
        </div>
        <Button
          href="/book-appointment?intent=quote"
          variant="primary"
          className="group flex-shrink-0"
        >
          Request Your Quote
          <svg
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Button>
      </div>
    </div>
  )
}
