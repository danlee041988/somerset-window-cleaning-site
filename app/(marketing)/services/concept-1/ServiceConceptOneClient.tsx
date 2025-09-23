'use client'

import { useState } from 'react'
import Image from 'next/image'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { SERVICE_IMAGES } from '@/content/image-manifest'

const PROPERTY_PROFILES = [
  {
    id: 'residential',
    label: 'Residential frequency plan',
    lead: 'Perfect for homes that want always-on kerb appeal.',
    price: '£18 - £28 per visit',
    cadence: 'Every 4 or 8 weeks',
    highlights: [
      'Pure-water pole system reaches 4 storeys',
      'Includes frames, sills, and doors each visit',
      'SMS reminders + contactless payments',
    ],
  },
  {
    id: 'prestige',
    label: 'Prestige homes',
    lead: 'Discreet teams for estates, show homes, and heritage builds.',
    price: 'From £45 per visit',
    cadence: 'Curated service calendar',
    highlights: [
      'Interior & chandelier glass on request',
      'Dedicated crew with before/after media',
      'Seasonal detailing & conservatory roof care',
    ],
  },
  {
    id: 'commercial',
    label: 'Commercial frontage',
    lead: 'Retail, hospitality, and mixed-use sites across Somerset.',
    price: 'Quarterly contracts from £95',
    cadence: 'Weekly, fortnightly, or monthly',
    highlights: [
      'Out-of-hours cleans to avoid disruption',
      'Water-fed and reach & wash systems combined',
      'Compliance logs + risk assessments supplied',
    ],
  },
] as const

const FREQUENCY_TIMELINE = [
  {
    title: '01 · Pre-visit message',
    description:
      'Automated text 24 hours before we arrive so you can unlock gates or move vehicles. Need to skip a visit? Reply to reschedule instantly.',
  },
  {
    title: '02 · Spotless execution',
    description:
      'Crew leader logs arrival inside the app, uploads site photos, and signs off once frames, sills, and doors are pristine.',
  },
  {
    title: '03 · Proof of sparkle',
    description:
      'Before/after media plus payment link sent straight to your phone. Recurring invoices auto-settle through GoCardless or Stripe.',
  },
]

const ADD_ONS = [
  {
    label: 'Glass roof valet',
    description: 'Soft brush + purified rinse to bring light back into conservatories.',
    price: '£65 add-on',
  },
  {
    label: 'Signature detail',
    description: 'Deep clean of frames, vents, and trickle covers twice a year.',
    price: '£45 per session',
  },
  {
    label: 'Solar panel clarity',
    description: 'Boost efficiency with a gentle pure-water wash of array surfaces.',
    price: '£80 per array',
  },
]

export default function ServiceConceptOneClient() {
  const [activeProfile, setActiveProfile] = useState<(typeof PROPERTY_PROFILES)[number]>(PROPERTY_PROFILES[0])

  return (
    <div className="pb-24">
      <Section spacing="relaxed" className="pt-24">
        <div className="feature-card grid gap-10 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
          <div className="feature-card__content space-y-6 p-10 md:p-14">
            <span className="feature-chip feature-chip--accent">Concept 01</span>
            <h1 className="text-3xl font-semibold text-white md:text-5xl">
              Flagship <span className="text-brand-red">Window Cleaning</span> frequency
            </h1>
            <p className="text-lg text-white/75 md:max-w-xl">
              Built for homes and commercial frontages that refuse streaks. Follow the live frequency experience: automated reminders, immaculate execution, and media proof delivered the moment we pack away the poles.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {['4,000+ yearly visits', '98% repeat custom', 'Crew ETA tracking'].map((stat) => (
                <div key={stat} className="rounded-2xl border border-white/10 bg-black/35 p-4 text-center shadow-[0_12px_30px_-18px_rgba(0,0,0,0.65)]">
                  <span className="text-sm uppercase tracking-[0.2em] text-white/50">Performance</span>
                  <p className="mt-2 text-base font-semibold text-white/90">{stat}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button href="/book-appointment" className="rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                Build my frequency plan
              </Button>
              <Button href="/gallery" variant="ghost" className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                See results
              </Button>
            </div>
          </div>
          <div className="relative">
            <Image
              src={SERVICE_IMAGES.window || '/photos/photo02.jpg'}
              alt="Crew cleaning exterior windows"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 600px, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
            <div className="feature-card__content absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/55 p-5 backdrop-blur">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span className="feature-chip feature-chip--accent">Live Frequency Feed</span>
                <span>ETA · 14 mins</span>
              </div>
              <p className="mt-3 text-white/85">
                &ldquo;Dan is on site at BA6 9DX · Frames finished · Uploading photos&rdquo;
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Choose your service profile" subtitle="Switch between our core window cleaning frequencies to tailor cadence, crew size, and reporting.">
        <div className="feature-card p-6 md:p-10">
          <div className="feature-card__content">
            <div className="flex flex-wrap gap-3">
              {PROPERTY_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  type="button"
                  onClick={() => setActiveProfile(profile)}
                  className={`rounded-full border px-5 py-2 text-sm font-semibold uppercase tracking-wide transition-all ${
                    activeProfile.id === profile.id
                      ? 'border-brand-red/80 bg-brand-red text-white shadow-[0_0_28px_rgba(225,29,42,0.45)]'
                      : 'border-white/15 bg-white/5 text-white/70 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {profile.label}
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6">
                <div>
                  <span className="feature-chip feature-chip--accent">Frequency details</span>
                  <h2 className="mt-4 text-2xl font-semibold text-white">{activeProfile.label}</h2>
                  <p className="mt-2 text-white/70">{activeProfile.lead}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/12 bg-black/40 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">Investment</p>
                    <p className="mt-2 text-xl font-semibold text-white">{activeProfile.price}</p>
                  </div>
                  <div className="rounded-2xl border border-white/12 bg-black/40 p-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">Service cadence</p>
                    <p className="mt-2 text-xl font-semibold text-white">{activeProfile.cadence}</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-white/80">
                  {activeProfile.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="feature-dot mt-1" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-white/12 bg-black/40 p-6 lg:p-8">
                <h3 className="text-lg font-semibold text-white">Frequency snapshot</h3>
                <div className="mt-4 grid gap-5 text-sm text-white/75">
                  {FREQUENCY_TIMELINE.map((step) => (
                    <div key={step.title} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.25em] text-white/50">{step.title}</p>
                      <p className="mt-2 text-white/80">{step.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Frequency add-ons</h4>
                  <ul className="space-y-3 text-sm text-white/80">
                    {ADD_ONS.map((addOn) => (
                      <li key={addOn.label} className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
                        <div>
                          <p className="font-medium text-white">{addOn.label}</p>
                          <p className="text-xs text-white/60">{addOn.description}</p>
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">{addOn.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Frequency deliverables"
        subtitle="Everything is captured, logged, and delivered to your inbox. Transparent reporting keeps property managers, owners, and facility teams aligned."
        spacing="relaxed"
      >
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Photo verification',
              description: 'Before/after gallery shared after each visit plus cloud archive for future reference.',
            },
            {
              title: 'Service manifests',
              description: 'Detailed job log with timestamps, crew notes, and QR scan for onsite sign-off.',
            },
            {
              title: 'Risk & compliance',
              description: 'RAMS, insurance docs, and PAT certificates ready for procurement teams.',
            },
          ].map((item) => (
            <div key={item.title} className="feature-card feature-card--minimal p-6">
              <div className="feature-card__content space-y-3">
                <span className="feature-chip feature-chip--accent">Included</span>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-white/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section spacing="relaxed">
        <div className="feature-card overflow-hidden">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="feature-card__content space-y-6 p-10">
              <span className="feature-chip feature-chip--accent">Playbook ready</span>
              <h2 className="text-2xl font-semibold text-white md:text-3xl">Ready to launch your flagship frequency?</h2>

              <p className="text-sm text-white/70">
                We&apos;ll map cadence, assign a dedicated crew, and build an always-on maintenance plan so your glazing stays marketing-ready.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/book-appointment?intent=quote" className="rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                  Let&apos;s build your frequency plan
                </Button>
                <Button href="/services" variant="ghost" className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                  Explore more services
                </Button>
              </div>
            </div>
            <div className="relative min-h-[320px]">
              <Image
                src={SERVICE_IMAGES.pureWaterCleaning || '/photos/photo03.jpg'}
                alt="Technician cleaning conservatory roof"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 600px, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/20" />
              <div className="feature-card__content absolute bottom-6 left-6 right-6 rounded-2xl border border-white/10 bg-black/60 p-5 backdrop-blur">
                <p className="text-sm text-white/75">
                &ldquo;Our frequency specialists look after premium homes, showrooms, and multi-site portfolios across Somerset. Arrange a discovery call to map your schedule.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
