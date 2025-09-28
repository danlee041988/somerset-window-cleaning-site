import type { Metadata } from 'next'
import clsx from 'clsx'
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

const HERO_SUPPORT_STATS = [
  { label: 'Google reviews', value: '4.9★ · 195+' },
  { label: 'Follow-up', value: 'Replies within 1 business day' },
]

const HERO_BULLETS = [
  'Share property basics, access, and any notes so we prep the right crew.',
  'Pick the services and visit frequency that suit your home or business.',
  'We confirm tailored pricing and schedule details within one working day.',
  'Pay after each visit by card, bank transfer, or GoCardless direct debit.',
]

const HOME_QUOTE_STEPS = [
  {
    title: 'Share your details',
    description: 'Tell us about the property, access, and the services you’re considering. It only takes a couple of minutes.'
  },
  {
    title: 'We confirm your quote',
    description: 'A specialist reviews the request, checks coverage, and comes back within one working day with tailored pricing.'
  },
  {
    title: 'Schedule your visit',
    description: 'Choose a visit window that suits you. We lock in the crew, confirm access, and send reminders before arrival.'
  },
  {
    title: 'Stay in the loop',
    description: 'You’ll get reminders ahead of every visit and can adjust services or schedules whenever you need.'
  }
]

export default function HomePage() {
  const galleryImages = Array.from(new Set(GALLERY_IMAGES ?? [])).slice(0, 12)
  const fallbackGallery = ['/photos/photo01.jpg','/photos/photo02.jpg','/photos/photo03.jpg','/photos/photo04.jpg']
  const heroImageSrc = (HERO_IMAGES && HERO_IMAGES[0]) || '/photos/photo01.jpg'

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10 bg-transparent">
        <Image
          src={heroImageSrc}
          alt=""
          aria-hidden="true"
          fill
          priority
          className="absolute inset-0 object-cover opacity-70"
          style={{ filter: 'brightness(2)' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
        />
        <div className="pointer-events-none absolute inset-0 bg-radial-glow" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/45 to-black/75" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-4 pb-24 pt-32 md:pb-28 md:pt-36">
          <div className="flex flex-wrap items-center gap-3 text-[0.58rem] font-semibold uppercase tracking-[0.32em] text-white/60">
            <span className="noir-chip">Quote form takes minutes</span>
            <span className="noir-chip">Local • Reliable • Fully Insured</span>
          </div>

          <div className="space-y-4 md:max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-[var(--fg)] md:text-6xl">
              Request your window clean in minutes
            </h1>
            <p className="max-w-2xl text-lg noir-muted">
              Tell us about the property, choose the services you need, and we’ll confirm pricing and scheduling details by the next working day.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-white/70">
            {HERO_SUPPORT_STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="text-lg font-semibold text-white">{stat.value}</span>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/40">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <ul className="grid gap-3 text-sm text-white/75 sm:grid-cols-2">
            {HERO_BULLETS.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3">
                <span className="mt-2 inline-flex h-2 w-2 flex-none rounded-full bg-brand-red" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button href="/book-appointment?intent=quote">Start your quote</Button>
            <Button href="tel:01458860339" variant="ghost">
              Call 01458 860 339
            </Button>
          </div>
        </div>
      </section>

      {/* Quote steps */}
      <Section
        title="Getting a quote is straightforward"
        subtitle="Four quick touchpoints to align pricing, availability, and the crew that suits your property."
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

            <div className="grid gap-6 md:auto-rows-fr md:grid-cols-2 lg:gap-8 xl:grid-cols-4">
              {HOME_QUOTE_STEPS.map((step, index) => {
                const stepPosition = index + 1
                const displayNumber = stepPosition.toString().padStart(2, '0')
                const isLastStep = index === HOME_QUOTE_STEPS.length - 1
                return (
                  <div key={step.title} className="group relative h-full">
                    <div
                      className={clsx(
                        'relative flex h-full flex-col gap-6 rounded-3xl border border-white/12 bg-gradient-to-b from-white/[0.07] via-black/55 to-black/80 p-6 text-[#F5F7FA] shadow-[0_26px_60px_-42px_rgba(0,0,0,0.9)] transition-transform duration-300 hover:-translate-y-1 hover:border-brand-red/45 md:p-8',
                        !isLastStep &&
                          "after:pointer-events-none after:absolute after:top-[3.9rem] after:left-[calc(100%+1.5rem)] after:hidden after:h-px after:w-16 after:bg-gradient-to-r after:from-white/25 after:via-white/10 after:to-transparent after:content-[''] xl:after:block"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-2xl border border-brand-red/55 bg-brand-red/12 text-sm font-semibold uppercase tracking-[0.32em] text-brand-red">
                          {displayNumber}
                        </span>
                        <div className="flex flex-col gap-1">
                          <span className="text-[0.58rem] font-semibold uppercase tracking-[0.32em] text-white/50">
                            Step {stepPosition}
                          </span>
                          <h3 className="text-base font-semibold uppercase tracking-[0.2em] text-[var(--fg)]">
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
                Start your quote request
              </Button>
              <Button href="/book-appointment#how-it-works" variant="secondary" className="px-8 py-3 tracking-[0.28em] text-white/80">
                See what happens next
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Services preview - Tabbed experience */}
      <Section
        title="Our most-requested services"
        subtitle="Switch between core services to see benefits, how we work, and what’s included across Somerset."
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
