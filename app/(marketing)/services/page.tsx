import type { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Professional Window Cleaning Services | Somerset Window Cleaning',
  description:
    'Comprehensive window cleaning services across Somerset. From residential to commercial, conservatories to solar panels. Professional, reliable, and affordable.',
}

const services = [
  {
    slug: 'window-cleaning',
    title: 'Window Cleaning',
    description: 'Professional residential and commercial window cleaning using pure water technology.',
    icon: '🪟',
  },
  {
    slug: 'commercial-cleaning',
    title: 'Commercial Cleaning',
    description: 'Tailored cleaning solutions for businesses, offices, and commercial properties.',
    icon: '🏢',
  },
  {
    slug: 'conservatory-roof-cleaning',
    title: 'Conservatory Roof Cleaning',
    description: 'Specialist conservatory roof cleaning to restore clarity and brightness.',
    icon: '🏠',
  },
  {
    slug: 'gutter-clearing',
    title: 'Gutter Clearing',
    description: 'Professional gutter cleaning and clearing to prevent water damage.',
    icon: '🌧️',
  },
  {
    slug: 'fascias-soffits-cleaning',
    title: 'Fascias & Soffits Cleaning',
    description: 'Expert cleaning of fascias and soffits to maintain your property exterior.',
    icon: '🏘️',
  },
  {
    slug: 'solar-panel-cleaning',
    title: 'Solar Panel Cleaning',
    description: 'Specialist solar panel cleaning to maximize efficiency and energy output.',
    icon: '☀️',
  },
]

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-black via-brand-red/5 to-black py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(220,38,38,0.15),transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl">
              Our <span className="text-brand-red">Services</span>
            </h1>
            <p className="text-lg text-white/70 md:text-xl">
              Professional window cleaning and exterior maintenance services across Somerset.
              Trusted by homeowners and businesses for over a decade.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-8 transition-all hover:border-brand-red/40 hover:from-brand-red/10 hover:to-brand-red/5"
              >
                <div className="mb-4 text-5xl">{service.icon}</div>
                <h2 className="mb-3 text-2xl font-bold text-white group-hover:text-brand-red">
                  {service.title}
                </h2>
                <p className="mb-6 text-white/60">{service.description}</p>
                <div className="flex items-center gap-2 text-sm font-semibold text-brand-red">
                  Learn More
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-white/10 bg-gradient-to-b from-black to-brand-red/5 py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <h2 className="mb-6 text-3xl font-bold text-white md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-white/70 md:text-xl">
            Get a free, no-obligation quote for any of our services today.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href="/book-appointment?intent=quote"
              className="w-full px-8 py-4 text-base font-semibold sm:w-auto"
            >
              Get Free Quote
            </Button>
            <Button
              href="/contact"
              variant="secondary"
              className="w-full px-8 py-4 text-base font-semibold sm:w-auto"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
