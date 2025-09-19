"use client"

import React from 'react'
import clsx from 'clsx'
import Section from '@/components/ui/Section'

type SectionMode = 'showcase' | 'standalone'
type ReviewsVariant = 'spotlight' | 'carousel' | 'mosaic'

type ReviewsProps = {
  variant?: ReviewsVariant
  mode?: SectionMode
  className?: string
}

type SpotlightMetric = {
  label: string
  value: string
  helper: string
}

type CarouselReview = {
  name: string
  service: string
  quote: string
  location: string
}

type MosaicCard = {
  title: string
  quote: string
  attribution: string
}

type SharedSectionProps = {
  mode?: SectionMode
  className?: string
}

const GOOGLE_RATING_SCORE = '4.9'
const GOOGLE_REVIEW_TOTAL = '195+'

const SPOTLIGHT_REVIEW = {
  name: 'Jodie Cater',
  quote: 'Second window clean with Somerset Window Cleaning and the windows still sparkle. Friendly reminders and easy payments keep everything effortless.',
  service: 'Window Cleaning',
  timeframe: 'February 2024'
}

const SPOTLIGHT_METRICS: SpotlightMetric[] = [
  {
    label: 'Local towns covered',
    value: '12',
    helper: 'From Wells BA5 to Street, Glastonbury, and surrounding villages'
  },
  {
    label: 'Average response time',
    value: '<24 hrs',
    helper: 'Quote, schedule, and confirmation handled within one business day'
  },
  {
    label: 'Repeat bookings',
    value: '78%',
    helper: 'Customers stay on the 4- or 8-week rotation after the first visit'
  }
]

const CAROUSEL_REVIEWS: CarouselReview[] = [
  {
    name: 'Jodie Cater',
    service: 'Window Cleaning',
    quote: 'Second window clean with Somerset Window Cleaning and the windows still sparkle. Friendly reminders and easy payments keep everything effortless.',
    location: 'Street BA16'
  },
  {
    name: 'Sandra',
    service: 'Routine Clean',
    quote: 'Dylan did a fantastic window clean for me this morning. The high windows were spotless and the text updates were really helpful.',
    location: 'Glastonbury BA6'
  },
  {
    name: 'Ben at Orchard Deli',
    service: 'Commercial Frontage',
    quote: 'Shopfront glass and frames look brand new every time. Pre-opening visits slot into our rota without fail.',
    location: 'Wells BA5'
  },
  {
    name: 'Amelia',
    service: 'Solar Panel Cleaning',
    quote: 'Panels were covered in debris but now they shine. Output is already up after the Somerset Window Cleaning deep clean.',
    location: 'Somerton TA11'
  }
]

const MOSAIC_CARDS: MosaicCard[] = [
  {
    title: 'Window Cleaning',
    quote: 'Windows, frames, and doors gleam after every 4-week visit. Payment links arrive the same day.',
    attribution: 'Claire — Wells BA5'
  },
  {
    title: 'Routine Clean',
    quote: 'Routine clean after our kitchen extension. Ladders, sills, and inside glass all finished without any fuss.',
    attribution: 'Oliver & Jess — Street'
  },
  {
    title: 'Commercial Frontage',
    quote: 'Somerset Window Cleaning keeps the frontage spotless before we open. Customers notice the difference.',
    attribution: 'Ben at Orchard Deli — Glastonbury'
  },
  {
    title: 'Specialist Treatments',
    quote: 'Solar panels, fascias, and conservatory roofs all revived with the same glass noir finish.',
    attribution: 'Amelia — Somerton'
  }
]

const MOSAIC_METRICS = [
  {
    label: 'Verified review volume',
    detail: 'Over 190 Google reviews from Somerset homeowners and businesses'
  },
  {
    label: '4.9 overall score',
    detail: 'Responsive communication, professional crews, and spotless results'
  }
]

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      className={clsx('h-6 w-6 flex-none', className)}
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0 1 90 341" />
      <path fill="#4285f4" d="m386 400 0.06-0.04a140 175 0 0 0 52.94-178.96H260v74h102q-7 37-38 57" />
      <path fill="#fbbc04" d="M90 341a208 200 0 0 1 0-171l63 49q-12 37 0 73" />
      <path fill="#ea4335" d="M153 219c22-69 116-109 179-50l55-54C309 40 157 43 90 170" />
    </svg>
  )
}

function GoogleReviewBadge({ title = 'Google Reviews', subtitle, className }: { title?: string; subtitle?: string; className?: string }) {
  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <GoogleLogo />
      <div className="leading-tight">
        <p className="text-sm font-semibold text-[var(--fg)]">{title}</p>
        {subtitle ? (
          <p className="text-xs text-[color:var(--muted)]">{subtitle}</p>
        ) : null}
      </div>
    </div>
  )
}

function ReviewStars({ className, label = 'Rated five out of five' }: { className?: string; label?: string }) {
  return (
    <div
      className={clsx('flex items-center gap-1 text-[#FACC15]', className)}
      role="img"
      aria-label={label}
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.071 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.071 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.036a1 1 0 00-1.176 0l-2.8 2.036c-.785.57-1.84-.197-1.54-1.118l1.071-3.292a1 1 0 00-.364-1.118L2.978 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.071-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews({ variant = 'carousel', mode, className }: ReviewsProps = {}) {
  const resolvedMode: SectionMode = mode ?? 'standalone'

  switch (variant) {
    case 'spotlight':
      return <SpotlightReviewsSection mode={resolvedMode} className={className} />
    case 'mosaic':
      return <MosaicReviewsSection mode={resolvedMode} className={className} />
    case 'carousel':
    default:
      return <CarouselReviewsSection mode={resolvedMode} className={className} />
  }
}

export function ReviewsShowcase() {
  return (
    <div className="space-y-16">
      <SpotlightReviewsSection />
      <CarouselReviewsSection />
      <MosaicReviewsSection />
    </div>
  )
}

export function SpotlightReviewsSection({ mode = 'showcase', className }: SharedSectionProps = {}) {
  const content = <SpotlightReviewSurface className={className} />

  if (mode === 'standalone') {
    return content
  }

  return (
    <Section
      title="Concept A: Customer Spotlight"
      subtitle="Hero layout designed for key service pages that need a high-trust social proof moment."
      spacing="relaxed"
    >
      {content}
    </Section>
  )
}

export function CarouselReviewsSection({ mode = 'showcase', className }: SharedSectionProps = {}) {
  if (mode === 'standalone') {
    return <CarouselReviewSurface className={className} />
  }

  return (
    <Section
      title="Concept B: Guided Carousel"
      subtitle="Interactive module with clear navigation for pages that need rotating proof without leaving the layout."
      spacing="relaxed"
    >
      <CarouselReviewSurface className={className} />
    </Section>
  )
}

export function MosaicReviewsSection({ mode = 'showcase', className }: SharedSectionProps = {}) {
  if (mode === 'standalone') {
    return <MosaicReviewSurface className={className} />
  }

  return (
    <Section
      title="Concept C: Review Mosaic"
      subtitle="Grid layout for comparison pages and long-form content where multiple proof points reinforce trust."
      spacing="relaxed"
    >
      <MosaicReviewSurface className={className} />
    </Section>
  )
}

function SpotlightReviewSurface({ className }: { className?: string }) {
  return (
    <div className={clsx('glass-noir-panel overflow-hidden rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] p-8 md:p-12 backdrop-blur-xl', className)}>
      <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <GoogleReviewBadge title="Google rating" subtitle="Real feedback from verified customers" />
            <p className="text-4xl font-semibold text-[var(--fg)] md:text-5xl">
              {GOOGLE_RATING_SCORE} out of 5 on Google
            </p>
            <p className="max-w-md text-base text-[color:var(--muted)]">
              {GOOGLE_REVIEW_TOTAL} verified reviews from Somerset homeowners, landlords, and commercial clients.
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-3">
            {SPOTLIGHT_METRICS.map((metric) => (
              <div key={metric.label} className="glass-card glass-noir-card--tight h-full rounded-2xl border border-white/10 bg-white/5 p-6 text-[var(--fg)]">
                <dt className="text-sm noir-subtle">{metric.label}</dt>
                <dd className="mt-2 text-2xl font-semibold text-[var(--fg)]">{metric.value}</dd>
                <p className="mt-3 text-xs text-[color:var(--muted-subtle)]">{metric.helper}</p>
              </div>
            ))}
          </dl>
        </div>

        <article className="glass-card glass-noir-card--tight relative flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 text-[var(--fg)] shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-subtle)]">
              <GoogleLogo className="h-5 w-5" />
              <span>Verified Google review</span>
            </div>
            <ReviewStars className="text-lg" />
            <p className="text-lg leading-relaxed text-[var(--fg)]">
              “{SPOTLIGHT_REVIEW.quote}”
            </p>
          </div>
          <footer className="space-y-1 text-sm">
            <p className="font-semibold text-[var(--fg)]">{SPOTLIGHT_REVIEW.name}</p>
            <p className="text-[color:var(--muted)]">{SPOTLIGHT_REVIEW.service} • {SPOTLIGHT_REVIEW.timeframe}</p>
          </footer>
        </article>
      </div>
    </div>
  )
}

function CarouselReviewSurface({ className }: { className?: string }) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  const handleNext = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % CAROUSEL_REVIEWS.length)
  }, [])

  const handlePrev = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + CAROUSEL_REVIEWS.length) % CAROUSEL_REVIEWS.length)
  }, [])

  const activeReview = CAROUSEL_REVIEWS[activeIndex]
  const supportingReviews = React.useMemo(() => {
    return CAROUSEL_REVIEWS.filter((_, idx) => idx !== activeIndex).slice(0, 2)
  }, [activeIndex])

  return (
    <div className={clsx('glass-noir-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] p-8 md:p-12 backdrop-blur-xl', className)}>
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3">
          <GoogleReviewBadge subtitle="Real feedback from verified customers" />
          <h3 className="text-3xl font-semibold text-[var(--fg)]">{GOOGLE_RATING_SCORE} out of 5 on Google</h3>
          <p className="text-sm text-[color:var(--muted)]">{GOOGLE_REVIEW_TOTAL} Somerset customers across domestic and commercial routes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="glass-card glass-noir-card--tight flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            aria-label="Previous review"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="glass-card glass-noir-card--tight flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/20"
            aria-label="Next review"
          >
            <span aria-hidden>→</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <article
          data-testid="review-card-emphasis"
          className="glass-card glass-noir-card--tight flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-white/12 to-white/6 p-8 text-[var(--fg)] shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="space-y-4">
            <p className="text-sm font-semibold text-[color:var(--muted-subtle)]">{activeReview.service}</p>
            <ReviewStars />
            <p className="text-lg leading-relaxed text-[var(--fg)]">“{activeReview.quote}”</p>
          </div>
          <footer className="space-y-1 text-sm">
            <p className="font-semibold text-[var(--fg)]">{activeReview.name}</p>
            <p className="text-[color:var(--muted)]">{activeReview.location}</p>
          </footer>
        </article>

        <div className="grid gap-4 sm:grid-cols-2">
          {supportingReviews.map((review) => (
            <article
              key={review.name}
              className="glass-card glass-noir-card--tight flex h-full flex-col gap-4 rounded-3xl border border-white/8 bg-white/5 p-6 text-[var(--fg)]"
            >
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-subtle)]">{review.service}</p>
                <ReviewStars className="text-sm" />
                <p className="text-sm text-[var(--fg)]">“{review.quote}”</p>
              </div>
              <footer className="mt-auto text-xs text-[color:var(--muted)]">{review.name} — {review.location}</footer>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

function MosaicReviewSurface({ className }: { className?: string }) {
  return (
    <div className={clsx('glass-noir-panel rounded-3xl border border-[var(--glass-border)] bg-[var(--glass)] p-8 md:p-12 backdrop-blur-xl', className)}>
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-6">
          <div className="space-y-3">
            <GoogleReviewBadge subtitle={`${GOOGLE_REVIEW_TOTAL} Google reviews across Somerset`} />
            <h3 className="text-3xl font-semibold text-[var(--fg)]">Somerset voices, Glass Noir finish</h3>
            <p className="text-sm text-[color:var(--muted)]">
              Layered proof modules for SEO landing pages, comparison layouts, and service explorers.
            </p>
          </div>
          <dl className="space-y-4">
            {MOSAIC_METRICS.map((metric) => (
              <div key={metric.label}>
                <dt className="text-sm font-semibold text-[var(--fg)]">{metric.label}</dt>
                <dd className="text-sm text-[color:var(--muted)]">{metric.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {MOSAIC_CARDS.map((card) => (
            <article
              key={card.title}
              className="glass-card glass-noir-card--tight flex h-full flex-col gap-4 rounded-3xl border border-white/8 bg-white/6 p-6 text-[var(--fg)]"
            >
              <header>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted-subtle)]">{card.title}</p>
              </header>
              <ReviewStars className="text-sm" />
              <p className="text-sm leading-relaxed text-[var(--fg)]">“{card.quote}”</p>
              <footer className="mt-auto text-xs text-[color:var(--muted)]">{card.attribution}</footer>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
