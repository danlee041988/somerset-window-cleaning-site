import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import ServiceTabsPreview from '@/components/ServiceTabsPreview'

export const metadata = {
  title: 'Pricing & Bundles | Somerset Window Cleaning',
  description:
    'Transparent pricing for window cleaning, gutter care, fascias & soffits, and conservatory roof cleaning across Somerset. Explore bundle savings and book in minutes.',
}

const WINDOW_PRICING = [
  {
    label: '1–2 bedrooms',
    price: '£22',
    description: 'Compact terraces, semis, or flats with standard frontage.',
  },
  {
    label: '3 bedrooms',
    price: '£27',
    description: 'Typical family homes with access front and back.',
  },
  {
    label: '4 bedrooms',
    price: '£32',
    description: 'Larger semis or detached properties up to two storeys.',
  },
  {
    label: '5 bedrooms',
    price: '£38',
    description: 'Extended or high-footprint homes. Detached +£5.',
  },
]

const BUNDLE_DEALS = [
  {
    title: 'Gutter care bundle',
    price: 'From £80',
    highlight: 'Pair gutter clearing with fascias & soffits',
    bullets: [
      'Vacuum clearing with on-the-day inspection photos on request',
      'Add fascias & soffits cleaning to unlock a complimentary exterior window clean',
      'Extensions or additional rooflines quoted at +£10 each',
    ],
  },
  {
    title: 'Conservatory refresh',
    price: 'Custom quote',
    highlight: 'Roof, finials, glazing bars & optional interior valet',
    bullets: [
      'Soft-brush clean that protects self-cleaning glass and seals',
      'Ideal to pair with a full house window clean for inside/outside clarity',
      'Let us know the panel count for a tailored schedule',
    ],
  },
  {
    title: 'Solar performance boost',
    price: '£10 per panel · min £60',
    highlight: 'Protect your solar output',
    bullets: [
      'Deionised water clean with ultra-soft brushes',
      'Performance notes supplied on request after each visit',
      'Bundle with a routine window round for multi-service savings',
    ],
  },
]

const ADD_ONS = [
  'Extension, porch or garden room · +£5',
  'Conservatory side windows · +£5',
  'Velux & roof windows · first two included, +£3 thereafter',
  'Townhouse / 3 storeys · +£5 for elevated pole work',
  'First clean uplift · up to +50% agreed on arrival',
]

export default function PricingPage() {
  return (
    <div className="pb-24 pt-24">
      <Section
        spacing="relaxed"
        title="Transparent pricing for Somerset homes & sites"
        subtitle="Start with your property size, then stack bundles for the finish you need. We confirm every visit by email & SMS before we arrive."
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/12 bg-white/5 p-6 md:p-8 shadow-[0_30px_60px_-45px_rgba(0,0,0,0.6)]">
              <h3 className="text-lg font-semibold text-white">Window cleaning guide pricing</h3>
              <p className="mt-2 text-sm text-white/70">
                Regular rounds keep properties spotless and help us deliver bundle perks (like free exterior cleans when you stack gutter services). Pricing below is for exterior visits every 4–8 weeks.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {WINDOW_PRICING.map((tier) => (
                  <div key={tier.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">{tier.label}</p>
                    <div className="mt-3 flex items-baseline justify-between gap-3">
                      <span className="text-sm text-white/70">{tier.description}</span>
                      <span className="text-xl font-semibold text-brand-red">{tier.price}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-white/55">
                Detached access +£5 · One-off deep cleans priced at ~50% uplift · We’ll flag anything outside a standard footprint before confirming.
              </p>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/5 p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white">Popular add-ons</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/70">
                {ADD_ONS.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-brand-red" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-5">
            {BUNDLE_DEALS.map((bundle) => (
              <div
                key={bundle.title}
                className="rounded-3xl border border-white/12 bg-gradient-to-br from-white/10 to-transparent p-6 md:p-8 shadow-[0_30px_60px_-45px_rgba(0,0,0,0.55)]"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-brand-red/80">{bundle.highlight}</span>
                    <h3 className="mt-2 text-xl font-semibold text-white">{bundle.title}</h3>
                  </div>
                  <span className="text-sm font-semibold text-brand-red">{bundle.price}</span>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-white/70">
                  {bundle.bullets.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button href="/book-appointment" className="rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-[0.35em]">
            Book your clean
          </Button>
          <Button
            href="/book-appointment?intent=quote"
            variant="ghost"
            className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold uppercase tracking-[0.35em]"
          >
            Request a quote first
          </Button>
        </div>
      </Section>

      <Section
        spacing="relaxed"
        title="Compare service combinations"
        subtitle="Option B (our recommended layout) shows how core window cleaning pairs with gutter care, fascias & soffits, and solar panel rinses."
      >
        <ServiceTabsPreview />
      </Section>

      <Section
        spacing="relaxed"
        title="How pricing is confirmed"
        subtitle="Your booking confirmation includes the agreed visit type, frequency, and any bundle perks applied. We notify you within one working day."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: '1. Share property details',
              copy: 'Bedrooms, access, and any extras help us estimate the time on site and flag detached uplifts.',
            },
            {
              title: '2. Select services & bundles',
              copy: 'Choose gutter care, fascias, solar, or conservatory add-ons. Bundle perks show instantly in the booking form.',
            },
            {
              title: '3. Confirm visit window',
              copy: 'We align your postcode with our rounds, then confirm pricing & scheduling via email/SMS within one working day.',
            },
          ].map((step) => (
            <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/75">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">{step.title}</h3>
              <p className="mt-3 text-white/70">{step.copy}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
