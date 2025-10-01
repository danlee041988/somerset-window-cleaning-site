import type { Metadata } from 'next'
import Section from '@/components/ui/Section'
import BusinessHours from '@/components/BusinessHours'
import Button from '@/components/ui/Button'
import GeneralEnquiryForm from '@/components/features/contact/GeneralEnquiryForm'

const TITLE = 'Get in touch'
const SUBTITLE = "Send us a quick message and we’ll respond within one working day. Ready to confirm a visit? Head over to our quote request page."

export const metadata: Metadata = {
  title: 'Contact Somerset Window Cleaning | Get In Touch',
  description:
    'Speak to Somerset Window Cleaning. Use the contact form for a call-back within one working day, or reach us directly by phone, email, or WhatsApp.',
  alternates: {
    canonical: '/get-in-touch',
  },
}

type GetInTouchPageProps = {
  searchParams?: {
    service?: string | string[]
  }
}

const normaliseServiceParam = (service?: string | string[]): string | undefined => {
  if (!service) return undefined
  if (Array.isArray(service)) {
    return service[0] || undefined
  }
  return service
}

export default function GetInTouchPage({ searchParams }: GetInTouchPageProps) {
  const defaultService = normaliseServiceParam(searchParams?.service)

  return (
    <div className="py-16 md:py-20">
      <Section title={TITLE} subtitle={SUBTITLE} spacing="relaxed">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <GeneralEnquiryForm defaultService={defaultService} />

          <div className="space-y-6">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Prefer to arrange straight away?</h3>
              <p className="mt-2 text-sm text-white/80">
                If you already know the services you need and want to lock in a slot, head to our quote request page to share the details and we&apos;ll confirm timings with you.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Button href="/book-appointment" variant="primary">
                  Go to quote form
                </Button>
                <Button href="/services/window-cleaning" variant="secondary">
                  View window cleaning
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Talk to us</h3>
              <div className="mt-4 space-y-3 text-sm text-white/85">
                <p>
                  Phone:{' '}
                  <a className="font-semibold text-white underline decoration-brand-red/60 underline-offset-4" href="tel:01458860339">
                    01458 860 339
                  </a>
                </p>
                <p>
                  Email:{' '}
                  <a className="font-semibold text-white underline decoration-brand-red/60 underline-offset-4" href="mailto:info@somersetwindowcleaning.co.uk">
                    info@somersetwindowcleaning.co.uk
                  </a>
                </p>
                <p>
                  WhatsApp:{' '}
                  <a
                    className="font-semibold text-white underline decoration-brand-red/60 underline-offset-4"
                    href="https://wa.me/441458860339"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Message us on WhatsApp
                  </a>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-white">Business hours</h3>
              <p className="mt-2 text-sm text-white/80">
                We operate Monday to Friday, 9am–4pm. Messages sent outside these hours are picked up first thing next day.
              </p>
              <div className="mt-4">
                <BusinessHours variant="full" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
