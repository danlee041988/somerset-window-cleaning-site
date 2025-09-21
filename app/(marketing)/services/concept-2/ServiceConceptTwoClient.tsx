'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { SERVICE_IMAGES } from '@/content/image-manifest'

const PROCESS_STEPS = [
  {
    id: 'survey',
    title: 'Digital site survey',
    blurb:
      'High-definition gutter camera captures before shots. Clients receive the gallery link in real time and can flag areas of concern directly in the app.',
    tip: 'Perfect for landlords and facilities teams who need photographic evidence.',
  },
  {
    id: 'clear',
    title: 'Vacuum clearance',
    blurb:
      'Ground-based carbon fibre poles remove moss and leaf build-up up to 40ft. We safely reach over conservatories and extensions without ladders.',
    tip: 'We safely reach over conservatories, garages, and extensions without ladders.',
  },
  {
    id: 'restore',
    title: 'Fascia refresh + rinse',
    blurb:
      'Purified water rinse removes staining from fascia and soffit boards. We finish with a hydrophobic treatment to slow down grime build-up.',
    tip: 'Bundle a solar panel rinse to keep your array operating at peak efficiency.',
  },
] as const

const MEMBERSHIP_PLANS = [
  {
    tier: 'Essential',
    target: '2-3 bed homes',
    price: '£18 / month',
    services: ['Annual gutter clearance', 'Quarterly fascia rinse', 'Priority bad-weather call outs'],
  },
  {
    tier: 'Prime',
    target: 'Detached & prestige',
    price: '£32 / month',
    services: ['Bi-annual gutter service', 'Gutter guard inspection', 'Drone roof inspection with report'],
  },
  {
    tier: 'Commercial',
    target: 'Shops & hospitality',
    price: 'POA',
    services: ['Monthly frontage washdown', 'Asset register + compliance pack', 'Emergency response in under 12 hrs'],
  },
]

const PROPERTY_SELECTOR = [
  {
    id: 'bungalow',
    label: 'Bungalow',
    estimate: '£85 fixed fee',
    duration: '90 minutes on site',
    notes: 'Includes fascia & soffit wipe down',
  },
  {
    id: 'semi',
    label: 'Semi-detached',
    estimate: '£110 typical',
    duration: '2 hours on site',
    notes: 'Add conservatory roof detail for £45',
  },
  {
    id: 'detached',
    label: 'Detached',
    estimate: '£135 - £165',
    duration: 'Team of two · 2.5 hours',
    notes: 'Camera survey and post-clean imagery included',
  },
]

export default function ServiceConceptTwoClient() {
  const [activeStepId, setActiveStepId] = useState<(typeof PROCESS_STEPS)[number]['id']>('survey')
  const [selectedProperty, setSelectedProperty] = useState<(typeof PROPERTY_SELECTOR)[number]['id']>('semi')

  const activeStep = useMemo(() => PROCESS_STEPS.find((step) => step.id === activeStepId) ?? PROCESS_STEPS[0], [activeStepId])
  const activeProperty = useMemo(
    () => PROPERTY_SELECTOR.find((option) => option.id === selectedProperty) ?? PROPERTY_SELECTOR[1],
    [selectedProperty],
  )

  return (
    <div className="pb-24">
      <Section spacing="relaxed" className="pt-24">
        <div className="feature-card overflow-hidden">
          <div className="feature-card__content grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-6 p-10 md:p-14">
              <span className="feature-chip feature-chip--accent">Concept 02</span>
              <h1 className="text-3xl font-semibold text-white md:text-5xl">
                Signature <span className="text-brand-red">Gutter &amp; Roof</span> detailing lab
              </h1>
              <p className="text-lg text-white/75 md:max-w-xl">
                We combined drone visuals, camera surveys, and high-reach vacuum systems so gutters stay clear and fascias gleam year-round. Explore the workflow, then lock in a membership that keeps every edge protected.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Camera documented', value: 'HD before/after proof' },
                  { label: 'Safety-first', value: 'No ladders · No damage' },
                  { label: 'Response time', value: 'Emergency callouts < 12h' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/12 bg-black/40 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">{stat.label}</p>
                    <p className="mt-2 text-white/90">{stat.value}</p>
                  </div>
                ))}
              </div>
              <Button href="/get-in-touch" className="rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                Book survey
              </Button>
            </div>
            <div className="relative min-h-[420px]">
              <Image
                src={SERVICE_IMAGES.gutter || '/photos/photo03.jpg'}
                alt="Technician clearing gutters"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 580px, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/25 via-transparent to-black/45" />
              <div className="feature-card__content absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/60 p-6 text-sm text-white/75">
                <p className="font-semibold text-white">Live drone feed</p>
                <p className="mt-2">
                  &ldquo;Gutter run 3 now clear · fascia rinse queued · photos uploaded to client hub&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="See the workflow" subtitle="Tap each stage to reveal what happens on site and the value it adds." spacing="relaxed">
        <div className="feature-card p-6 md:p-10">
          <div className="feature-card__content grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <div className="grid gap-3">
                {PROCESS_STEPS.map((step) => (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStepId(step.id)}
                    className={`rounded-2xl border px-5 py-4 text-left transition-all ${
                      activeStepId === step.id
                        ? 'border-brand-red/80 bg-brand-red/10 text-white shadow-[0_0_30px_rgba(225,29,42,0.35)]'
                        : 'border-white/12 bg-black/35 text-white/70 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">Stage</p>
                    <p className="mt-2 text-lg font-semibold">{step.title}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/12 bg-black/40 p-6 lg:p-10">
              <h3 className="text-2xl font-semibold text-white">{activeStep.title}</h3>
              <p className="mt-4 text-white/80 leading-relaxed">{activeStep.blurb}</p>
              <div className="mt-6 rounded-xl border border-brand-red/40 bg-brand-red/10 p-5 text-sm text-white/80">
                <p className="text-xs uppercase tracking-[0.25em] text-brand-red/80">Pro insight</p>
                <p className="mt-2">{activeStep.tip}</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Fast estimate builder" subtitle="Select the property type and get an instant pricing snapshot. Add-ons can be stacked during booking." spacing="relaxed">
        <div className="grid gap-6 md:grid-cols-3">
          {PROPERTY_SELECTOR.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedProperty(option.id)}
              className={`feature-card text-left transition-all ${
                selectedProperty === option.id ? 'ring-2 ring-brand-red/60 ring-offset-2 ring-offset-black' : ''
              }`}
            >
              <div className="feature-card__content space-y-3 p-6">
                <span className="feature-chip">{option.label}</span>
                <h3 className="text-xl font-semibold text-white">{option.estimate}</h3>
                <p className="text-sm text-white/70">{option.duration}</p>
                <p className="text-sm text-white/80">{option.notes}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="feature-card mt-8 p-6 md:p-10">
          <div className="feature-card__content grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-red/80">Current selection</p>
              <h3 className="mt-3 text-2xl font-semibold text-white">{activeProperty.label}</h3>
              <p className="mt-2 text-white/75">{activeProperty.notes}</p>
              <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
                <span className="feature-chip feature-chip--accent">Investment · {activeProperty.estimate}</span>
                <span className="feature-chip">{activeProperty.duration}</span>
              </div>
            </div>
            <Button href="/book-appointment" className="rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
              Reserve slot
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Memberships that keep you covered" subtitle="Pick a protection plan and layer in solar, conservatory, or roof extras when required." spacing="relaxed">
        <div className="grid gap-6 md:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan) => (
            <div key={plan.tier} className="feature-card p-6">
              <div className="feature-card__content space-y-4">
                <div className="flex items-center justify-between">
                  <span className="feature-chip feature-chip--accent">{plan.tier}</span>
                  <span className="text-sm uppercase tracking-[0.2em] text-white/50">{plan.target}</span>
                </div>
                <p className="text-3xl font-semibold text-white">{plan.price}</p>
                <ul className="space-y-3 text-sm text-white/80">
                  {plan.services.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="feature-dot mt-1" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button href="/get-in-touch" variant="ghost" className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  Talk to team
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
