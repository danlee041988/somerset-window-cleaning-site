import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import LightboxGallery from '@/components/LightboxGallery'
import Reviews from '@/components/Reviews'
import { HERO_IMAGES, GALLERY_IMAGES } from '@/content/image-manifest'
import Image from 'next/image'
import CaseStudy from '@/components/CaseStudy'
import ServiceTabsPreview from '@/components/ServiceTabsPreview'

const HOME_BOOKING_STEPS = [
  {
    title: 'Book online',
    description: 'Fill out our booking form, pick the services you need, and choose your preferred visit window.'
  },
  {
    title: 'We handle the clean',
    description: 'Our crew arrives on the agreed day, works through your checklist, and keeps everything spotless.'
  },
  {
    title: 'Invoice your way',
    description: 'We send your invoice via your preferred contact method with easy payment options attached.'
  },
  {
    title: 'Stay in the loop',
    description: 'You’ll get reminders ahead of every visit and can adjust services or schedules whenever you need.'
  }
]

export default function HomePage() {
  const galleryImages = Array.from(new Set(GALLERY_IMAGES ?? [])).slice(0, 12)
  const fallbackGallery = ['/photos/photo01.jpg','/photos/photo02.jpg','/photos/photo03.jpg','/photos/photo04.jpg']

  return (
    <div>
      {/* Hero with background image */}
      <section className="relative overflow-hidden border-b border-white/10 bg-transparent">
        {/* Background image */}
        <Image
          src={(HERO_IMAGES && HERO_IMAGES[0]) || '/photos/photo01.jpg'}
          alt=""
          aria-hidden="true"
          fill
          priority
          className="absolute inset-0 object-cover opacity-70"
          style={{ filter: 'brightness(2.1)' }}
          sizes="100vw"
        />
        {/* Softer gradient overlay for improved brightness */}
        <div className="pointer-events-none absolute inset-0 bg-radial-glow" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/70" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-24 pt-32 md:pb-28 md:pt-36">
          <span className="noir-chip">Local • Reliable • Fully Insured</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--fg)] md:text-6xl">
            Somerset Window Cleaning
          </h1>
          <p className="max-w-2xl text-lg noir-muted">
            Streak‑free, sparkling windows for homes and businesses across Somerset. Professional service, transparent pricing, flexible scheduling.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <Button href="/book-appointment">Book now</Button>
            <Button href="/services" variant="ghost">Explore services</Button>
          </div>
        </div>
      </section>

      {/* Booking steps */}
      <Section
        title="Booking is straightforward"
        subtitle="Four quick steps and we’ll have your property locked into the correct Somerset frequency."
        spacing="relaxed"
      >
        <div className="glass-noir-panel overflow-visible p-8 md:p-12">
          <div className="feature-card__content grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {HOME_BOOKING_STEPS.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="glass-card glass-noir-card--tight group flex h-full flex-col gap-4 p-6 text-[#F5F7FA] transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-4">
                    <span className="relative inline-flex h-12 w-12 items-center justify-center">
                      <span
                        className="absolute inset-0 rounded-full bg-brand-red/80 shadow-[0_0_22px_rgba(225,29,42,0.45)]"
                        aria-hidden
                      />
                      <span className="relative flex h-full w-full items-center justify-center rounded-full text-xl font-semibold tracking-[0.2em] text-white">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </span>
                    <h3 className="text-base font-semibold uppercase tracking-[0.25em] text-[var(--fg)]">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed noir-muted">
                    {step.description}
                  </p>
                </div>
                {index < HOME_BOOKING_STEPS.length - 1 && (
                  <span className="pointer-events-none absolute top-1/2 right-[-18px] hidden h-px w-9 -translate-y-1/2 bg-gradient-to-r from-white/15 via-brand-red/50 to-transparent xl:block" aria-hidden />
                )}
              </div>
            ))}
          </div>

          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/book-appointment" className="px-8 py-3">
              Start your booking
            </Button>
            <Button href="/book-appointment#faq" variant="secondary" className="px-8 py-3">
              See what happens next
            </Button>
          </div>
        </div>
      </Section>

      {/* Services preview - Tabbed experience */}
      <Section
        title="Our most-requested services"
        subtitle="Switch between core services to see benefits, pricing, and how we schedule them across Somerset."
        spacing="relaxed"
        animationDelay={100}
      >
        <ServiceTabsPreview />
      </Section>

      <CaseStudy />

      {/* Reviews section */}
      <Section
        title="What our customers say"
        subtitle="Real reviews from verified Google customers across Somerset."
        spacing="relaxed"
        animationDelay={300}
      >
        <Reviews variant="carousel" />
      </Section>

      {/* Recent work preview */}
      <Section 
        title="Recent work" 
        subtitle="A quick look at some of our cleaning results." 
        spacing="generous"
        animationDelay={400}
      >
        <LightboxGallery images={galleryImages.length ? galleryImages : fallbackGallery} />
      </Section>
    </div>
  )
}
