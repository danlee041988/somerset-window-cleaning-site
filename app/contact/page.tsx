import Section from '@/components/Section'
import ContactForm from '@/components/ContactForm'
import WhatsAppButton from '@/components/WhatsAppButton'

export const metadata = {
  title: 'Contact',
  description: 'Get a fast, no‑obligation quote from Somerset Window Cleaning.'
}

export default function ContactPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Get a free quote" subtitle="Fill in the form and we'll get back to you shortly.">
        <div className="mx-auto max-w-2xl">
          <ContactForm />
          <div className="mt-6">
            <WhatsAppButton text="WhatsApp us" />
            <p className="mt-2 text-xs text-white/70">Prefer WhatsApp? Message us directly and we'll reply during opening hours.</p>
            <div className="mt-6 rounded-md border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <h3 className="mb-2 font-semibold text-white">Our address</h3>
              <p>13 Rockhaven Business Centre<br />Gravenchon Way<br />BA16 0HW, UK</p>
              <p className="mt-2">Mon–Fri: 9am–4pm</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
