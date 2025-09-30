import type { Metadata } from 'next'
import clsx from 'clsx'
import Button from '@/components/ui/Button'
import Section from '@/components/ui/Section'
import { HERO_IMAGES, GALLERY_IMAGES } from '@/content/image-manifest'
import Image from 'next/image'
import LightboxGallery from '@/components/LightboxGallery'
import Reviews from '@/components/Reviews'
import CaseStudy from '@/components/CaseStudy'
import ServiceTabsPreview from '@/components/ServiceTabsPreview'
import StickyMobileCTA from '@/components/StickyMobileCTA'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

const HERO_SUPPORT_STATS = [
  { label: 'Google reviews', value: '4.9★ · 195+' },
  { label: 'Regular cleans', value: 'From £20 per visit' },
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
    title: 'Request Quote',
    description: 'Fill in property details and service requirements. Takes just 2 minutes.'
  },
  {
    title: 'Get Pricing',
    description: 'We review your request and send tailored pricing within 1 working day.'
  },
  {
    title: 'Book Visit',
    description: 'Choose your preferred date. We confirm crew assignment and send reminders.'
  },
  {
    title: 'Pay Online',
    description: 'Receive a secure payment link once work is complete. Pay by card or direct debit.'
  }
]

export default function HomePage() {
  const galleryImages = Array.from(new Set(GALLERY_IMAGES ?? [])).slice(0, 12)
  const fallbackGallery = ['/photos/photo01.jpg','/photos/photo02.jpg','/photos/photo03.jpg','/photos/photo04.jpg']
  const heroImageSrc = (HERO_IMAGES && HERO_IMAGES[0]) || '/photos/photo01.jpg'

  return (
    <>
      <StickyMobileCTA />
      <div>
        <section className="relative overflow-hidden border-b border-white/10 bg-black">
          <Image
            src={heroImageSrc}
            alt=""
            aria-hidden="true"
            fill
            priority
            quality={75}
            className="absolute inset-0 object-cover opacity-40"
            sizes="(max-width: 768px) 100vw, 1920px"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

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

          <div className="rounded-2xl border border-brand-red/30 bg-gradient-to-br from-brand-red/10 to-transparent p-4 backdrop-blur-sm">
            <p className="text-sm text-white/85">
              <span className="font-semibold text-white">Regular cleans:</span> 3-bed semi from £25 per visit on 4 or 8-weekly schedule
            </p>
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
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-red">
                  <span className="h-2 w-2 rounded-full bg-brand-red" />
                  How It Works
                </div>
                <h2 className="text-2xl font-bold text-white md:text-3xl">
                  From quote to clean in 4 simple steps
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {HOME_QUOTE_STEPS.map((step, index) => {
                  const stepPosition = index + 1
                  const isLastStep = index === HOME_QUOTE_STEPS.length - 1
                  return (
                    <div key={step.title} className="group relative">
                        <div className="glass-noir-card glass-noir-card--tight relative flex h-full flex-col gap-4 p-6 transition-all duration-300 hover:border-brand-red/30 hover:shadow-[0_0_30px_-10px_rgba(225,29,42,0.3)]">

                          {/* Number Badge */}
                          <div className="mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand-red/30 bg-brand-red/10 text-xl font-bold text-brand-red">
                              {stepPosition}
                            </div>
                          </div>

                          {/* Title */}
                          <h3 className="text-lg font-semibold text-white">
                            {step.title}
                          </h3>

                          {/* Description */}
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

        <CaseStudy />

        {/* Services preview - Tabbed experience */}
        <Section
          title="Our most-requested services"
          subtitle="Switch between core services to see benefits, how we work, and what's included across Somerset."
          spacing="relaxed"
          animationDelay={100}
        >
          <ServiceTabsPreview />
        </Section>

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
    </>
  )
}
