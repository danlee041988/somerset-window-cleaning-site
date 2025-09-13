import Section from '@/components/Section'
import ContactForm from '@/components/ContactForm'

export const metadata = {
  title: 'Quote me',
  description: 'Get a fast, no‑obligation quote from Somerset Window Cleaning.'
}

export default function QuotePage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Quote me" subtitle="Fill in the details and we’ll get straight back to you.">
        <div className="mx-auto max-w-2xl">
          <ContactForm />
        </div>
      </Section>
    </div>
  )
}

