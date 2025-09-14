import Section from '@/components/Section'
import QuoteForm from '@/components/QuoteForm'

export const metadata = {
  title: 'Quote me',
  description: 'Get a fast, no‑obligation quote from Somerset Window Cleaning.'
}

export default function QuotePage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Get a Quote" subtitle="Four quick steps: Property → Services → Contact → T&Cs. We’ll review and confirm your price and availability.">
        <div className="mx-auto max-w-2xl">
          <QuoteForm />
        </div>
      </Section>
    </div>
  )
}
