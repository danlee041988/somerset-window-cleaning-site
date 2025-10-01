import { Metadata } from 'next'
import Section from '@/components/ui/Section'
import BookingFormImproved from '@/components/BookingFormImproved'

export const metadata: Metadata = {
  title: 'Request A Quote | Somerset Window Cleaning Services',
  description:
    'Tell us about your property and the services you need. We’ll follow up within one working day to confirm pricing and arrange your Somerset Window Cleaning visit.',
  keywords:
    'Somerset window cleaning quote, window cleaning enquiry Somerset, gutter cleaning quote Somerset, Somerset Window Cleaning contact',
  alternates: {
    canonical: '/book-appointment',
  },
}

const GO_CARDLESS_URL = process.env.NEXT_PUBLIC_GOCARDLESS_PAYMENT_URL

const BOOKING_STEPS = [
  {
    title: 'Share property basics',
    copy: 'Bedrooms, layout, and access help us prep the right crew.'
  },
  {
    title: 'Choose services & cadence',
    copy: 'Select the services you’re interested in and how often you’d like a visit.'
  },
  {
    title: 'We follow up',
    copy: 'A team member confirms pricing, access, and a visit time that suits you.'
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
  const defaultIntent = searchParams?.intent === 'book' ? 'book' : 'quote'
  const defaultPostcode = searchParams?.postcode || ''

  return (
    <div className="pb-24">
      <div className="bg-brand-black py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <BookingFormImproved
            defaultAddress={defaultAddress}
            defaultPostcode={defaultPostcode}
          />
        </div>
      </div>

      <div id="how-it-works">
        <Section
          title="How the quote process works"
          subtitle="Share the essentials, choose a frequency, and we&rsquo;ll follow up with tailored pricing."
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
              Light rain doesn&rsquo;t affect pure water results, and we&rsquo;ll always revisit promptly if anything needs attention. After your quote is approved you can settle by card or transfer after each visit, or set up automatic payments through{' '}
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
