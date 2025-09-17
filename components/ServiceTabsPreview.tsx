"use client"

import { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/Button'
import { SERVICE_IMAGES } from '@/content/image-manifest'

const TAB_SERVICES = [
  {
    id: 'window-cleaning',
    name: 'Window Cleaning',
    description: 'Pure water cleaning of glass, frames, and sills with interior options for show homes and offices.',
    bullets: [
      'Routine 4- or 8-week visits',
      'Includes frames, sills, and doors',
      'Reach up to 4 storeys safely'
    ],
    price: 'from £18 per visit',
    image: SERVICE_IMAGES.window || '/photos/photo02.jpg',
    cta: {
      label: 'Book window cleaning',
      href: '/services/window-cleaning'
    }
  },
  {
    id: 'gutter-clearing',
    name: 'Gutter Clearing',
    description: 'Ground-based vacuum system that removes moss and debris to prevent overflow issues.',
    bullets: [
      'Camera inspection included',
      'Safe access over conservatories',
      'Downpipes flushed where needed'
    ],
    price: 'from £65 per property',
    image: SERVICE_IMAGES.gutter || '/photos/photo03.jpg',
    cta: {
      label: 'Schedule gutter clear',
      href: '/services/gutter-cleaning'
    }
  },
  {
    id: 'conservatory',
    name: 'Conservatory Roof',
    description: 'Gentle clean of roofs, glazing bars, and finials to let natural light back into the room.',
    bullets: [
      'Soft brush and purified rinse',
      'Safe on self-cleaning glass',
      'Paired with interior valet on request'
    ],
    price: 'bespoke pricing',
    image: SERVICE_IMAGES.conservatory || '/photos/photo04.jpg',
    cta: {
      label: 'Talk to us',
      href: '/services/conservatory-roof-cleaning'
    }
  },
  {
    id: 'fascias-soffits',
    name: 'Fascias & Soffits',
    description: 'Deep clean of uPVC fascias, soffits, and gutters to refresh curb appeal in a single visit.',
    bullets: [
      'Great add-on to gutter clearing',
      'Restore brilliant white finish',
      'Includes downpipe exteriors'
    ],
    price: 'bundle rates available',
    image: SERVICE_IMAGES.fascias || '/photos/photo06.jpg',
    cta: {
      label: 'See fascia bundles',
      href: '/services/fascia-cleaning'
    }
  }
] as const

export default function ServiceTabsPreview() {
  const [activeId, setActiveId] = useState<string>(TAB_SERVICES[0]?.id ?? '')
  const active = TAB_SERVICES.find(service => service.id === activeId) ?? TAB_SERVICES[0]

  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 md:p-8">
      <div className="flex flex-wrap gap-2 md:gap-3">
        {TAB_SERVICES.map(service => (
          <button
            key={service.id}
            onClick={() => setActiveId(service.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              service.id === active.id
                ? 'border-brand-red bg-brand-red text-white shadow-[0_0_20px_rgba(225,29,42,0.35)]'
                : 'border-white/10 bg-white/5 text-white/70 hover:border-white/25 hover:text-white'
            }`}
            type="button"
          >
            {service.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <div className="text-sm uppercase tracking-wide text-white/60">Service snapshot</div>
          <h3 className="mt-3 text-2xl font-semibold text-white">{active.name}</h3>
          <p className="mt-3 text-white/70">{active.description}</p>
          <ul className="mt-4 space-y-2 text-sm text-white/80">
            {active.bullets.map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-red)' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="rounded-full border border-brand-red/40 bg-brand-red/10 px-4 py-2 text-sm font-semibold text-brand-red">
              {active.price}
            </span>
            <Button href={active.cta.href}>{active.cta.label}</Button>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <Image
            src={active.image}
            alt={active.name}
            width={640}
            height={480}
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 400px, 100vw"
            priority
          />
        </div>
      </div>
    </div>
  )
}
