import Link from 'next/link'
import { Metadata } from 'next'
import Section from '@/components/ui/Section'
import BookingForm from '@/components/BookingForm'

export const metadata: Metadata = {
  title: 'Book A Clean | Somerset Window Cleaning Services',
  description:
    'Secure your Somerset Window Cleaning slot in minutes. Choose your frequency, confirm add-ons, and we will align you with the right 4-weekly window cleaning frequency covering Somerset postcodes.',
  keywords:
    'Somerset window cleaning booking, book window cleaner, recurring window cleaning Somerset, gutter cleaning schedule, Somerset cleaning frequency',
  alternates: {
    canonical: '/book-appointment',
  }
}


const WINDOW_BASE_PRICES = [
  {
    label: '1-2 bedrooms',
    price: '£22',
    description: 'Compact terraces, semis, or flats with standard frontage.'
  },
  {
    label: '3 bedrooms',
    price: '£25',
    description: 'Somerset family homes with access front and back.'
  },
  {
    label: '4 bedrooms',
    price: '£30',
    description: 'Roomier semis and detached homes up to two storeys.'
  },
  {
    label: '5+ bedrooms',
    price: '£35',
    description: 'Large detached properties; detached access +£5 per visit.'
  }
]

const WINDOW_ADD_ONS = [
  {
    label: 'Extension, porch or garden room',
    detail: 'Add £5 to cover extra glass or garden rooms.'
  },
  {
    label: 'Conservatory windows (sides)',
    detail: 'Tick this when you’d like us to include the conservatory side panels during your exterior clean.'
  },
  {
    label: 'Velux & roof windows',
    detail: 'We clean every Velux we can safely reach, though some roof windows may remain out of reach.'
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

const GO_CARDLESS_URL = process.env.NEXT_PUBLIC_GOCARDLESS_PAYMENT_URL

const BOOKING_STEPS = [
  {
    title: 'Share property basics',
    copy: 'Bedrooms, layout, and extras so pricing updates in real time.'
  },
  {
    title: 'Add your details',
    copy: 'Contact info and notes help us match the right round and crew.'
  },
  {
    title: 'We confirm & schedule',
    copy: 'We follow up with timings, access checks, and billing preferences.'
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
          <ol className="flex flex-col gap-6 text-white/70 md:flex-row md:items-start md:gap-8">
            {BOOKING_STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-1 items-start gap-4">
                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-emerald-400/50 bg-emerald-500/10 text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-xs text-white/60">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-white/70">
            <p>
              Light rain doesn&rsquo;t affect pure water results, and we&rsquo;ll always revisit promptly if anything needs attention. Settle by card or transfer after the visit, or set up automatic payments once through{' '}
              {GO_CARDLESS_URL ? (
                <a
                  href={GO_CARDLESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-white underline decoration-brand-red/60 underline-offset-4 hover:text-brand-red"
                >
                  GoCardless
                </a>
              ) : (
                'GoCardless'
              )}
              .
            </p>
            {GO_CARDLESS_URL && (
              <p className="mt-2 text-xs text-white/60">
                Already a customer? Use the Direct Debit portal any time to review or settle outstanding balances.
              </p>
            )}
          </div>
        </Section>
      </div>
    </div>
  )
}
