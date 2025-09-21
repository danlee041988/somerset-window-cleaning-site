import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import LightboxGallery from '@/components/LightboxGallery'
import Reviews from '@/components/Reviews'
import { HERO_IMAGES, GALLERY_IMAGES } from '@/content/image-manifest'
import Image from 'next/image'
import CaseStudy from '@/components/CaseStudy'
import ServiceTabsPreview from '@/components/ServiceTabsPreview'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

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
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
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
        <div className="feature-card feature-card--minimal relative overflow-hidden">
          <span className="pointer-events-none absolute bottom-[-100px] right-[-80px] h-72 w-72 rounded-full bg-white/12 blur-[160px]" aria-hidden />

          <div className="feature-card__content space-y-10 p-8 md:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="feature-chip feature-chip--accent">How it works</span>
              <span className="hidden rounded-full border border-white/15 px-4 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-white/55 sm:inline-flex">
                4 touchpoints from quote to sparkling glass
              </span>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {HOME_BOOKING_STEPS.map((step, index) => {
                const stepPosition = index + 1
                const displayNumber = stepPosition.toString().padStart(2, '0')
                return (
                  <div key={step.title} className="group relative h-full">
                    <div className="relative flex h-full flex-col gap-6 rounded-3xl border border-white/12 bg-black/65 p-6 text-[#F5F7FA] shadow-[0_26px_60px_-42px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-1 hover:border-brand-red/45">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-red/55 bg-brand-red/12 text-sm font-semibold uppercase tracking-[0.32em] text-brand-red">
                          {displayNumber}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.32em] text-white/45">
                            Step {stepPosition}
                          </span>
                          <h3 className="text-base font-semibold uppercase tracking-[0.25em] text-[var(--fg)]">
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <div className="h-px w-full bg-gradient-to-r from-white/15 via-white/8 to-transparent" aria-hidden />
                      <p className="text-sm leading-relaxed text-white/70">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/book-appointment" className="px-8 py-3 tracking-[0.28em]">
                Start your booking
              </Button>
              <Button href="/book-appointment#faq" variant="secondary" className="px-8 py-3 tracking-[0.28em] text-white/80">
                See what happens next
              </Button>
            </div>
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
