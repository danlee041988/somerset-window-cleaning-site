'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { SERVICE_IMAGES } from '@/content/image-manifest'

const MODES = [
  {
    id: 'maintenance',
    title: 'Maintenance mode',
    strapline: 'Lock in a recurring programme that keeps every elevation spotless.',
    description:
      'Designed for busy households and estates who want exterior care without the admin. We rotate services automatically and send media reports after every visit.',
    perks: [
      'Window cleaning every 4 weeks',
      'Quarterly gutter health check',
      'Annual conservatory & solar detail',
    ],
    metrics: ['12 visits / year', 'Crew of 2', 'Customer success manager'],
  },
  {
    id: 'project',
    title: 'Project mode',
    strapline: 'Intensive rejuvenation projects with a defined start and finish.',
    description:
      'For properties preparing to sell, handover, or kick off a renovation. We build a bespoke treatment sprint with photo documentation at each milestone.',
    perks: [
      'Deep clean fascias, soffits, and cladding',
      'Render and stone soft-wash options',
      'Drone-imaged completion reports',
    ],
    metrics: ['2-5 day sprint', 'Specialist crew', 'Documented sign-off'],
  },
] as const

const EXPERIENCE_TRACKS = [
  {
    label: 'Sparkle Core',
    focus: 'Window perfection',
    summary: 'Ideal for window frequencies that value glass clarity over everything else.',
    services: ['4-week exterior clean', 'Interior add-on twice yearly', 'Pure-water spot free finish'],
  },
  {
    label: 'Impact Elevation',
    focus: 'Full frontage polish',
    summary: 'Co-ordinate windows, fascias, signage, and shopfront glass in a single visit.',
    services: ['Window + fascia combo', 'Signage wipe-down', 'Ground-level jet rinse'],
  },
  {
    label: 'Solar Optimise',
    focus: 'Max panel output',
    summary: 'Homeowners and farms who rely on solar arrays for energy production.',
    services: ['Bi-annual array rinse', 'Performance photo proof', 'Optional bird deterrent fit'],
  },
]

const QANDA = [
  {
    q: 'How fast can you start?',
    a: 'Window frequencies can start within 7 days. Full project mode typically begins within 2 weeks once the survey and risk assessment are completed.',
  },
  {
    q: 'Do you work around tenants or trading hours?',
    a: 'Yes. We manage keyed access, open/close times, and send arrival ETAs via SMS so clients and tenants always know when we are due.',
  },
  {
    q: 'Can I pause the maintenance plan?',
    a: 'Absolutely. Pause or skip visits straight from our text reminders. We simply roll your slot to the following round.',
  },
]

export default function ServiceConceptThreeClient() {
  const [mode, setMode] = useState<(typeof MODES)[number]['id']>('maintenance')
  const activeMode = useMemo(() => MODES.find((item) => item.id === mode) ?? MODES[0], [mode])

  return (
    <div className="pb-24">
      <Section spacing="relaxed" className="pt-24">
        <div className="feature-card overflow-hidden">
          <div className="feature-card__content grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6 p-10 md:p-14">
              <span className="feature-chip feature-chip--accent">Concept 03</span>
              <h1 className="text-3xl font-semibold text-white md:text-5xl">
                Exterior care <span className="text-brand-red">programmes</span> built around your goals
              </h1>
              <p className="text-lg text-white/75 md:max-w-xl">
                Toggle between effortless upkeep and high-impact project work. Each path is managed by a dedicated customer success lead who keeps you updated from survey to final inspection.
              </p>
              <div className="flex flex-wrap gap-3">
                {MODES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMode(item.id)}
                    className={`rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-all ${
                      item.id === mode
                        ? 'border-brand-red/80 bg-brand-red text-white shadow-[0_0_28px_rgba(225,29,42,0.45)]'
                        : 'border-white/15 bg-white/5 text-white/70 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {item.title}
                  </button>
                ))}
              </div>
              <div className="rounded-2xl border border-white/12 bg-black/40 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-white/50">Current focus</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{activeMode.title}</h2>
                <p className="mt-2 text-white/75">{activeMode.strapline}</p>
                <ul className="mt-4 space-y-3 text-sm text-white/80">
                  {activeMode.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3">
                      <span className="feature-dot mt-1" aria-hidden="true" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/70">
                  {activeMode.metrics.map((metric) => (
                    <span key={metric} className="feature-chip feature-chip--accent">{metric}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button href="/get-in-touch" className="rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                  Book planning call
                </Button>
                <Button href="/compare-services" variant="ghost" className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                  Compare plans
                </Button>
              </div>
            </div>
            <div className="relative min-h-[460px]">
              <Image
                src={SERVICE_IMAGES.conservatory || '/photos/photo04.jpg'}
                alt="Exterior conservatory cleaning"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 580px, 100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/45" />
              <div className="feature-card__content absolute bottom-6 left-6 right-6 grid gap-3 rounded-2xl border border-white/10 bg-black/55 p-6 text-sm text-white/80">
                <p className="text-white/95 font-semibold">Customer success live feed</p>
                <p>
                  &ldquo;Hannah completed the maintenance audit for BA5 1TX · project mode recommended · quote ready to approve.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Choose a track" subtitle="Mix and match modules to build your ideal Somerset Window Cleaning programme." spacing="relaxed">
        <div className="grid gap-6 md:grid-cols-3">
          {EXPERIENCE_TRACKS.map((track) => (
            <div key={track.label} className="feature-card p-6">
              <div className="feature-card__content space-y-4">
                <div className="flex items-center justify-between">
                  <span className="feature-chip feature-chip--accent">{track.label}</span>
                  <span className="text-xs uppercase tracking-[0.25em] text-white/50">{track.focus}</span>
                </div>
                <p className="text-sm text-white/75">{track.summary}</p>
                <ul className="space-y-3 text-sm text-white/80">
                  {track.services.map((service) => (
                    <li key={service} className="flex items-start gap-2">
                      <span className="feature-dot mt-1" aria-hidden="true" />
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <Button href="/book-appointment" variant="ghost" className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
                  Add to programme
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Programme timeline" subtitle="See how we guide you from consultation to ongoing success." spacing="relaxed">
        <div className="feature-card p-6 md:p-10">
          <div className="feature-card__content grid gap-6 md:grid-cols-4">
            {[
              {
                heading: 'Discovery call',
                detail: 'Share priorities, budgets and timeframes. We select maintenance or project track and schedule a site survey.',
              },
              {
                heading: 'Survey & modelling',
                detail: 'We capture imagery, measure elevations, and build a care matrix that slots into your calendar.',
              },
              {
                heading: 'Launch sprint',
                detail: 'Teams execute the initial clean, documenting each milestone. You receive live updates via SMS and email.',
              },
              {
                heading: 'Success reviews',
                detail: 'Quarterly zoom or on-site check-in to review performance data and tweak cadence or services.',
              },
            ].map((stage) => (
              <div key={stage.heading} className="rounded-2xl border border-white/12 bg-black/35 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-brand-red/80">Stage</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{stage.heading}</h3>
                <p className="mt-2 text-sm text-white/75">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Questions we hear all the time" subtitle="Transparent answers so you know exactly what to expect." spacing="relaxed">
        <div className="grid gap-6 md:grid-cols-3">
          {QANDA.map((item) => (
            <div key={item.q} className="feature-card p-6">
              <div className="feature-card__content space-y-3">
                <span className="feature-chip feature-chip--accent">FAQ</span>
                <h3 className="text-lg font-semibold text-white">{item.q}</h3>
                <p className="text-sm text-white/75">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Button href="/get-in-touch" className="rounded-full px-8 py-3 text-sm font-semibold uppercase tracking-wide">
            Plan my programme
          </Button>
        </div>
      </Section>
    </div>
  )
}
