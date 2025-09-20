"use client"

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { SERVICE_IMAGES } from '@/content/image-manifest'

type ServiceCategory = 'core' | 'add-on'

type Service = {
  id: string
  name: string
  description: string
  bullets: string[]
  price: string
  image: string
  href: string
  ctaLabel: string
  category: ServiceCategory
  tagline?: string
  supportingCopy?: string
}

const SERVICES: readonly Service[] = [
  {
    id: 'window-cleaning',
    name: 'Window Cleaning',
    description: 'Pure water cleaning of glass, frames, and sills with optional interior work for show homes and offices.',
    bullets: [
      'Routine 4- or 8-week visits',
      'Frames, sills, and doors included',
      'Reach up to 4 storeys safely',
    ],
    price: 'From £18 per visit',
    image: SERVICE_IMAGES.window || '/photos/photo02.jpg',
    href: '/services/window-cleaning',
    ctaLabel: 'Book window cleaning',
    category: 'core',
    tagline: 'Core service',
    supportingCopy:
      'Our most requested service keeps properties spotless using pole-fed pure water systems that protect frames and glass.',
  },
  {
    id: 'gutter-clearing',
    name: 'Gutter Clearing',
    description: 'Ground-based vacuum system that removes moss and debris to prevent overflow issues and damp walls.',
    bullets: [
      'Camera inspection included',
      'Safe access over conservatories',
      'Downpipes flushed where needed',
    ],
    price: 'From £65 per property',
    image: SERVICE_IMAGES.gutter || '/photos/photo03.jpg',
    href: '/services/gutter-clearing',
    ctaLabel: 'Schedule gutter clear',
    category: 'add-on',
    tagline: 'Most popular add-on',
  },
  {
    id: 'conservatory',
    name: 'Conservatory Roof Cleaning',
    description: 'Gentle clean of roofs, glazing bars, and finials to let natural light back into the room without damaging seals.',
    bullets: [
      'Soft brush and purified rinse',
      'Safe on self-cleaning glass',
      'Interior valet available on request',
    ],
    price: 'Custom quote',
    image: SERVICE_IMAGES.conservatory || '/photos/photo04.jpg',
    href: '/services/conservatory-roof-cleaning',
    ctaLabel: 'Discuss conservatory clean',
    category: 'add-on',
    tagline: 'Bring back the light',
  },
  {
    id: 'fascias-soffits',
    name: 'Fascias & Soffits Cleaning',
    description: 'Deep clean of uPVC fascias, soffits, and gutter exteriors to refresh curb appeal in a single visit.',
    bullets: [
      'Ideal after gutter clearing',
      'Restores brilliant white finish',
      'Includes fascia and gutter exteriors',
    ],
    price: 'Bundle rates available',
    image: SERVICE_IMAGES.fascias || '/photos/photo06.jpg',
    href: '/services/fascias-soffits-cleaning',
    ctaLabel: 'See fascia bundles',
    category: 'add-on',
    tagline: 'Exterior refresh',
  },
]

type ServiceCombinationLayoutProps = {
  services: readonly Service[]
  activeService: Service
  onSelect: (id: string) => void
}

export default function ServiceTabsPreview() {
  const [activeId, setActiveId] = useState<string>(SERVICES[1]?.id ?? SERVICES[0].id)

  const activeService = useMemo(() => {
    return SERVICES.find((service) => service.id === activeId) ?? SERVICES[0]
  }, [activeId])

  return (
    <div className="feature-card feature-card--minimal space-y-8 p-6 md:p-10" aria-live="polite">
      <ServiceCombinationLayout services={SERVICES} activeService={activeService} onSelect={setActiveId} />
    </div>
  )
}

function ServiceCombinationLayout({ services, activeService, onSelect }: ServiceCombinationLayoutProps) {
  const secondaryServices = services.filter((service) => service.id !== activeService.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {services.map((service) => {
          const isActive = service.id === activeService.id
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/70 ${
                isActive
                  ? 'border-brand-red bg-brand-red text-white'
                  : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
              }`}
            >
              {service.name}
            </button>
          )
        })}
      </div>

      <div className="feature-card feature-card--minimal overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-stretch">
          <div className="relative h-full min-h-[260px]">
            <Image
              src={activeService.image}
              alt={activeService.name}
              width={960}
              height={640}
              className="h-full w-full object-cover"
              sizes="(min-width: 768px) 600px, 100vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/35 via-black/55 to-black/20" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-black/55 p-4 text-sm text-white/75 backdrop-blur">
              {activeService.supportingCopy ?? 'Add-on services use the same trusted team so visits stay efficient and familiar.'}
            </div>
          </div>

          <div className="p-6 md:p-10">
            <span className="feature-chip feature-chip--accent">{activeService.tagline ?? 'Service focus'}</span>
            <h3 className="mt-4 text-3xl font-semibold text-white">{activeService.name}</h3>
            <p className="mt-3 text-white/75">{activeService.description}</p>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {activeService.bullets.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="feature-dot mt-1" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-white/60">
              <span>{activeService.price}</span>
              <Button
                href={activeService.href}
                className="rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.35em]"
              >
                {activeService.ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
