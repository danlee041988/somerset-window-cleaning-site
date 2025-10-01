"use client"

import React from 'react'
import Image from 'next/image'

interface ServiceAreaMapProps {
  className?: string
}

const COVERAGE_AREAS = [
  'Wells',
  'Glastonbury',
  'Street',
  'Shepton Mallet',
  'Cheddar',
  'Frome',
  'Bruton',
  'Castle Cary',
  'Somerton',
  'Langport',
  'Wedmore',
  'Axbridge',
]

export default function ServiceAreaMap({ className = '' }: ServiceAreaMapProps) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 p-8 md:p-12 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Map visualization */}
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-brand-red/5 to-brand-black">
            {/* Placeholder for actual map - you can replace this with an SVG map or Google Maps embed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative h-full w-full">
                {/* Central point (Wells) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="h-4 w-4 rounded-full bg-brand-red shadow-lg shadow-brand-red/50" />
                    <div className="absolute inset-0 animate-ping rounded-full bg-brand-red opacity-75" />
                  </div>
                  <span className="absolute left-6 top-0 whitespace-nowrap text-sm font-semibold text-white">
                    Wells
                  </span>
                </div>

                {/* Coverage radius circles */}
                <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-red/30 bg-brand-red/5" />
                <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-red/20 bg-brand-red/[0.02]" />
                <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand-red/10" />

                {/* Surrounding areas */}
                <div className="absolute left-1/4 top-1/4">
                  <div className="h-2 w-2 rounded-full bg-brand-gold" />
                  <span className="absolute left-4 -top-1 whitespace-nowrap text-xs text-white/70">Glastonbury</span>
                </div>
                <div className="absolute right-1/4 top-1/3">
                  <div className="h-2 w-2 rounded-full bg-brand-gold" />
                  <span className="absolute left-4 -top-1 whitespace-nowrap text-xs text-white/70">Shepton M.</span>
                </div>
                <div className="absolute bottom-1/3 left-1/3">
                  <div className="h-2 w-2 rounded-full bg-brand-gold" />
                  <span className="absolute left-4 -top-1 whitespace-nowrap text-xs text-white/70">Cheddar</span>
                </div>
                <div className="absolute bottom-1/4 right-1/3">
                  <div className="h-2 w-2 rounded-full bg-brand-gold" />
                  <span className="absolute left-4 -top-1 whitespace-nowrap text-xs text-white/70">Street</span>
                </div>
              </div>
            </div>

            {/* Gradient overlay for depth */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black/40 to-transparent" />
          </div>

          {/* Coverage badge */}
          <div className="mt-4 flex items-center justify-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-2 text-sm font-semibold text-brand-gold">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Serving All of Somerset
          </div>
        </div>

        {/* Coverage details */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-white md:text-3xl">
              Local Coverage You Can Count On
            </h3>
            <p className="mt-3 leading-relaxed-body text-white/70">
              Based in Wells, we provide professional window cleaning services throughout Somerset. Our local knowledge means we understand the unique challenges of cleaning properties in the area.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/60">
              Areas We Cover
            </h4>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {COVERAGE_AREAS.map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 transition hover:border-brand-gold/30 hover:bg-brand-gold/5"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  {area}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-brand-red/20 bg-brand-red/5 p-4">
            <p className="text-sm leading-relaxed-body text-white/80">
              <strong className="text-white">Don&apos;t see your area?</strong> We&apos;re always expanding our coverage. Give us a call on{' '}
              <a
                href="tel:01458860339"
                className="font-semibold text-brand-red underline decoration-brand-red/40 underline-offset-2 transition hover:text-brand-red/80"
              >
                01458 860339
              </a>{' '}
              to check if we can help.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
