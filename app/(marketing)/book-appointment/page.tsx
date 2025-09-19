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
      <div className="bg-brand-black py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <BookingForm
            defaultService={defaultService}
            defaultAddress={defaultAddress}
            defaultIntent={defaultIntent}
            defaultPostcode={defaultPostcode}
            className="w-full shadow-[0_30px_70px_-35px_rgba(225,29,42,0.35)]"
          />
        </div>
      </div>

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
