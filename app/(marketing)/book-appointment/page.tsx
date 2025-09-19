import Link from 'next/link'
import { Metadata } from 'next'
import Section from '@/components/ui/Section'
import BookingForm from '@/components/BookingForm'

export const metadata: Metadata = {
  title: 'Book A Clean | Somerset Window Cleaning Services',
  description:
    'Secure your Somerset Window Cleaning slot in minutes. Choose your frequency, confirm add-ons, and we will align you with the right 4-weekly window cleaning frequency covering Somerset postcodes.',
  keywords:
    'Somerset window cleaning booking, book window cleaner, recurring window cleaning Somerset, gutter cleaning schedule, Somerset cleaning frequency'
}


const WINDOW_BASE_PRICES = [
  {
    label: '2-3 bedrooms',
    price: '£25',
    description: 'Typical semis and terraces, up to 2 storeys, standard glass coverage.'
  },
  {
    label: '4 bedrooms',
    price: '£30',
    description: 'Generous semis and detached homes, up to 2 storeys.'
  },
  {
    label: '5 bedrooms',
    price: '£35',
    description: 'Larger detached homes with standard glazing footprint.'
  }
]

const WINDOW_ADD_ONS = [
  {
    label: 'Extension, porch or garden room',
    detail: 'Add £5 to cover extra glass or garden rooms.'
  },
  {
    label: 'Conservatory windows (sides only)',
    detail: 'Add £5 for the side panels alongside your standard clean.'
  },
  {
    label: 'Velux & roof windows',
    detail: 'First two are included. Extras £3 each when safely reachable.'
  },
  {
    label: 'Townhouse / 3 storeys',
    detail: 'Add £5 for extended pole work on upper levels.'
  },
  {
    label: 'First clean uplift',
    detail: 'Up to +50% if frames are oxidised or heavily soiled – agreed on arrival.'
  },
  {
    label: 'Non-standard glass walls / bifolds',
    detail: 'Allow £5–£15 if the glazing is significantly above standard coverage.'
  }
]

const SERVICE_HIGHLIGHTS = [
  {
    title: 'Gutter care bundle',
    highlight: '£80 terrace/semi · £100 detached',
    bullets: [
      'Vacuum clearing with inspection on the day',
      'Add +£10 per extra roofline or extension',
      'Pair with fascia & soffit wash (£100/£120) and the exterior window clean is FREE'
    ]
  },
  {
    title: 'Solar panel cleaning',
    highlight: '£10 per panel · minimum £60',
    bullets: [
      'Pure-water reach pole system only – no roof walking',
      'We confirm safe access before the visit and provide output notes'
    ]
  },
  {
    title: 'Conservatory roof refresh',
    highlight: '£8 per panel · minimum £60',
    bullets: [
      'Includes finials and roof bars for a complete refresh',
      'Pair with a window clean for pristine glass inside and out'
    ]
  }
]

const BOOKING_STEPS = [
  {
    title: 'Pick your service & extras',
    copy: 'Bedrooms give us the base price. Tick any add-ons you need and let us know how regular you\'d like visits.'
  },
  {
    title: 'We align your window frequency',
    copy: 'We match your address to the correct frequency week and confirm your next visit window by email and SMS.'
  },
  {
    title: 'Settle up simply',
    copy: 'Pay on completion (card or bank). Prefer Direct Debit? Set up once through GoCardless and you\'re done.'
  }
]

interface BookAppointmentPageProps {
  searchParams?: {
    service?: string
    address?: string
    intent?: string
    postcode?: string
  }
}

export default function BookAppointmentPage({ searchParams }: BookAppointmentPageProps) {
  const defaultService = searchParams?.service || ''
  const defaultAddress = searchParams?.address || ''
  const defaultIntent = searchParams?.intent === 'quote' ? 'quote' : 'book'
  const defaultPostcode = searchParams?.postcode || ''

  return (
    <div className="pb-24">
      <div className="relative isolate overflow-hidden border-y border-white/10 bg-gradient-to-br from-brand-black via-[#16070A] to-brand-black py-16 md:py-24">
        <div className="absolute inset-0 opacity-70" aria-hidden>
          <div className="absolute -top-32 -left-20 h-72 w-72 rounded-full bg-brand-red/40 blur-3xl" />
          <div className="absolute -bottom-40 -right-10 h-80 w-80 rounded-full bg-brand-red/20 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col gap-12 px-4 lg:flex-row lg:items-start">
          <div className="space-y-8 lg:w-[40%] xl:w-[36%]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              Book Somerset Window Cleaning
            </div>

            <div className="space-y-6">
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Set your window cleaning frequency and book your clean
              </h1>
              <p className="max-w-xl text-base text-white/75 sm:text-lg">
                Tell us the services, extras, and how frequent you’d like our window team. We’ll align your postcode with the right window cleaning frequency and confirm the next visit window within one working day.
              </p>
              <p className="text-sm text-white/60">
                All pricing assumes a standard property footprint—we’ll flag any adjustments before confirming your visit.
              </p>
            </div>

            <p className="text-xs uppercase tracking-[0.3em] text-white/50">
              Prefer to talk instead? Use the call, email, or WhatsApp buttons under the form.
            </p>
          </div>

          <div className="lg:flex-1">
            <BookingForm
              defaultService={defaultService}
              defaultAddress={defaultAddress}
              defaultIntent={defaultIntent}
              defaultPostcode={defaultPostcode}
              className="w-full shadow-[0_30px_70px_-35px_rgba(225,29,42,0.35)]"
            />
          </div>
        </div>
      </div>

      <Section
        title="Simple, transparent pricing"
        subtitle="Start with the bedroom count, add any extras, and we&apos;ll confirm if the property falls outside a standard footprint before the visit."
        spacing="relaxed"
      >
        <div className="space-y-10">
          <div className="grid gap-4 md:grid-cols-3">
            {WINDOW_BASE_PRICES.map((tier) => (
              <div
                key={tier.label}
                className="rounded-3xl border border-white/8 bg-white/[0.05] p-6 shadow-[0_30px_60px_-45px_rgba(0,0,0,0.6)] transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/50">{tier.label}</p>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-sm text-white/65">{tier.description}</span>
                  <span className="text-2xl font-semibold text-brand-red">{tier.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/8 bg-white/[0.06] p-6 md:p-8 shadow-[0_30px_60px_-45px_rgba(0,0,0,0.55)]">
                <h3 className="text-lg font-semibold text-white">Popular add-ons</h3>
                <dl className="mt-4 grid gap-x-6 gap-y-4 text-sm text-white/75 sm:grid-cols-2">
                  {WINDOW_ADD_ONS.map((addon) => (
                    <div key={addon.label}>
                      <dt className="font-medium text-white">{addon.label}</dt>
                      <dd className="mt-1 text-white/65">{addon.detail}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 text-xs text-white/55">
                  Front-only cleans (no rear access) are charged at 60% of the property price. Minimum call-out £25.
                </p>
              </div>

              <div className="rounded-3xl border border-white/8 bg-white/[0.04] p-6 md:p-8 text-sm text-white/80">
                <h3 className="text-lg font-semibold text-white">Bundle perk</h3>
                <p className="mt-3 text-white/70">
                  Book gutter clearing <span className="font-semibold text-white">and</span> fascia &amp; soffit washing on the
                  same visit and your standard exterior window clean is on us (worth £25-£35). Apply the bundle in the
                  form and we&apos;ll confirm it in your booking email.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {SERVICE_HIGHLIGHTS.map((service) => (
                <div
                  key={service.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-7 shadow-[0_20px_45px_-35px_rgba(0,0,0,0.6)]"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h4 className="text-lg font-semibold text-white">{service.title}</h4>
                    <span className="text-sm font-semibold text-brand-red">{service.highlight}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-white/70">
                    {service.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <span className="mt-1 inline-flex h-1.5 w-1.5 rounded-full bg-white/60" aria-hidden />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <div id="how-it-works">
        <Section
          title="How the booking works"
          subtitle="Share the essentials, choose a frequency, and we&rsquo;ll look after the rest."
          spacing="relaxed"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {BOOKING_STEPS.map((step) => (
              <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm text-white/70">{step.copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <p>
              Light rain doesn&rsquo;t affect pure water results. If you&rsquo;re ever unhappy, we&rsquo;ll revisit promptly. Payment can be made by card, bank transfer on completion, or set up once through GoCardless for automatic settlement.
            </p>
          </div>
        </Section>
      </div>
    </div>
  )
}
