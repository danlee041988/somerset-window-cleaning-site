import Image from 'next/image'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'

export const metadata = {
  title: 'Our Exterior Cleaning Services | Somerset Window Cleaning',
  description:
    'Professional window, gutter, conservatory, solar panel & commercial cleaning across Somerset. Advanced equipment, expert techniques, guaranteed results.',
}

const SERVICE_IMAGE_MAP: Record<string, string> = {
  'Window Cleaning': SERVICE_IMAGES.window || '/photos/photo06.jpg',
  'Gutter Clearing': SERVICE_IMAGES.gutter || '/photos/photo07.jpg',
  'Conservatory Roof Cleaning': SERVICE_IMAGES.conservatory || '/photos/photo08.jpg',
  'Solar Panel Cleaning': SERVICE_IMAGES.solar || '/photos/photo09.jpg',
  'Fascias & Soffits Cleaning': SERVICE_IMAGES.fascias || '/photos/photo10.jpg',
  'External Commercial Cleaning': SERVICE_IMAGES.commercial || '/photos/photo11.jpg',
}

const GUTTER_SERVICE_SLUGS = ['gutter-clearing', 'fascias-soffits-cleaning'] as const

function PrimaryServiceFeature() {
  const primaryService =
    servicesData.find((service) => service.slug === 'window-cleaning') || servicesData[0]

  if (!primaryService) return null

  const imageSrc =
    SERVICE_IMAGE_MAP[primaryService.title] || SERVICE_IMAGES.window || '/photos/photo06.jpg'
  const quoteHref = `/book-appointment?service=${primaryService.slug}&intent=quote`

  const stats = [
    { label: 'Frequency coverage', value: '4–8 week pure-water rounds' },
    { label: 'Reach', value: 'Carbon poles to 4 storeys' },
    { label: 'Experience', value: '4,000+ panes each month' },
  ]

  return (
    <Section id="window-cleaning" spacing="generous" className="pt-0">
      <article className="feature-card overflow-hidden">
        <div className="feature-card__content grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-6 p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="feature-chip feature-chip--accent">Core service</span>
              {primaryService.specialty && (
                <span className="feature-chip">{primaryService.specialty}</span>
              )}
              <span className="feature-chip">{primaryService.frequency}</span>
            </div>

            <div className="space-y-4 text-white/85">
              <h3 className="text-4xl font-semibold text-white md:text-5xl">
                {primaryService.title}
              </h3>
              <p className="text-lg text-white/80">{primaryService.longDescription}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/12 bg-black/40 p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-white/50">{stat.label}</p>
                  <p className="mt-2 text-base font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <ServiceList
                title="Every visit includes"
                items={primaryService.benefits.map((benefit) => benefit.text)}
              />
              <ServiceList title="Our visit method" items={primaryService.process} />
            </div>

            <ServiceList
              title="Equipment we bring"
              items={primaryService.equipment ?? []}
              layout="inline"
            />

            {primaryService.guarantee && (
              <div className="rounded-2xl border border-brand-red/40 bg-brand-red/10 p-6 text-sm text-white/85">
                <p className="text-xs uppercase tracking-[0.25em] text-brand-red/80">48-hour promise</p>
                <p className="mt-2 leading-relaxed">{primaryService.guarantee}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                href={quoteHref}
                className="rounded-full px-7 py-3 text-sm font-semibold uppercase tracking-wide"
              >
                Request window quote
              </Button>
              <Button
                href={`/services/${primaryService.slug}`}
                variant="ghost"
                className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold uppercase tracking-wide"
              >
                View service details
              </Button>
            </div>
          </div>

          <div className="relative min-h-[360px] lg:min-h-full">
            <Image
              src={imageSrc}
              alt="Window cleaning crew at work"
              fill
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50" />
          </div>
        </div>
      </article>
    </Section>
  )
}

export default function ServicesPage() {
  const gutterServices = servicesData.filter((service) =>
    GUTTER_SERVICE_SLUGS.includes(service.slug as (typeof GUTTER_SERVICE_SLUGS)[number]),
  )
  const additionalServices = servicesData.filter(
    (service) => service.slug !== 'window-cleaning' && !GUTTER_SERVICE_SLUGS.includes(service.slug as (typeof GUTTER_SERVICE_SLUGS)[number]),
  )

  return (
    <div className="pb-20 pt-16 md:pb-28 md:pt-24">
      <Section
        spacing="relaxed"
        title="Exterior cleaning, perfected"
        subtitle="One page, every service. Choose the treatment that fits your property and request a tailored quote in minutes."
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="space-y-6 text-white/80">
              <p className="text-lg leading-relaxed text-white/80">
                Somerset Window Cleaning keeps homes, estates, and commercial frontages presentation-ready with proven pure-water systems, camera-documented gutter care, and specialist restoration treatments.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[{
                  label: 'Coverage',
                  value: 'Somerset-wide window frequencies, 4–8 week visits',
                },
                {
                  label: 'Guarantee',
                  value: '48-hour no-quibble revisit promise',
                },
                {
                  label: 'Reporting',
                  value: 'Photo proof and maintenance logs on request',
                },
                {
                  label: 'Quoting',
                  value: 'Online request reviewed within one working day',
                }].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-black/40 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.25em] text-white/50">{item.label}</p>
                    <p className="mt-2 text-sm text-white/85">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[260px] rounded-3xl">
              <Image
                src={SERVICE_IMAGES.window || '/photos/photo02.jpg'}
                alt="Somerset Window Cleaning crew working on site"
                fill
                sizes="(min-width: 1024px) 540px, 100vw"
                className="rounded-3xl object-cover"
                priority
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-black/45 via-black/10 to-black/40" />
            </div>
          </div>
        </div>
      </Section>

      <PrimaryServiceFeature />
      {gutterServices.length > 0 && (
        <Section id="gutter-clearing" spacing="relaxed" className="pt-0">
          <h3 className="mb-6 text-xl font-semibold uppercase tracking-[0.2em] text-white/60">
            Gutter & fascia care
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            {gutterServices.map((service) => (
              <SecondaryServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Section>
      )}

      {additionalServices.length > 0 && (
        <Section id="specialist-treatments" spacing="relaxed" className="pt-0">
          <h3 className="mb-6 text-xl font-semibold uppercase tracking-[0.2em] text-white/60">
            Specialist treatments
          </h3>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {additionalServices.map((service) => (
              <SecondaryServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </Section>
      )}

      <Section spacing="generous" className="pt-0">
        <div className="feature-card feature-card--no-overlay overflow-hidden">
          <div className="feature-card__content grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-6 p-8 md:p-12">
              <span className="feature-chip feature-chip--accent">Ready when you are</span>
              <h3 className="text-3xl font-semibold text-white md:text-4xl">Let's get your next quote prepared</h3>
              <p className="text-white/75 text-base leading-relaxed">
                Share your preferred timing, add access notes, and we'll confirm availability with reminders plus contactless payment links after each visit.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href="/book-appointment" className="rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                  Request quote
                </Button>
                <Button href="/compare-services" variant="ghost" className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide">
                  Compare plans
                </Button>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-4 rounded-3xl border border-white/12 bg-black/45 p-6 text-sm text-white/75">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">What to expect</p>
              <ul className="space-y-2 text-white/70">
                <li>ETA tracking and arrival updates before every visit</li>
                <li>Uniformed, fully insured crew on site</li>
                <li>Contactless payment links and 48-hour revisit promise</li>
              </ul>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

function ServiceList({
  title,
  items,
  layout = 'stacked',
  variant = 'default',
}: {
  title: string
  items: string[]
  layout?: 'stacked' | 'inline'
  variant?: 'default' | 'compact'
}) {
  if (!items.length) return null

  const titleClasses =
    variant === 'compact'
      ? 'text-[0.65rem] uppercase tracking-[0.3em] text-white/45'
      : 'text-xs uppercase tracking-[0.25em] text-white/50'

  const listSpacing = variant === 'compact' ? 'mt-2' : 'mt-3'
  const textSize = variant === 'compact' ? 'text-[0.82rem]' : 'text-sm'
  const stackedSpacing = variant === 'compact' ? 'space-y-2' : 'space-y-3'

  const stackedClasses = `${listSpacing} ${stackedSpacing} ${textSize} text-white/80`
  const inlineClasses = `${listSpacing} flex flex-wrap gap-2 ${textSize} text-white/75`

  return (
    <div>
      <p className={titleClasses}>{title}</p>
      <ul
        className={layout === 'inline' ? inlineClasses : stackedClasses}
      >
        {items.map((item) => (
          <li
            key={item}
            className={
              layout === 'inline'
                ? 'rounded-full border border-white/15 px-3 py-1'
                : 'flex items-start gap-2'
            }
          >
            {layout === 'inline' ? (
              <span>{item}</span>
            ) : (
              <>
                <span className="feature-dot mt-1" aria-hidden="true" />
                <span>{item}</span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SecondaryServiceCard({
  service,
}: {
  service: (typeof servicesData)[number]
}) {
  const imageSrc = SERVICE_IMAGE_MAP[service.title] || SERVICE_IMAGES.window || '/photos/photo06.jpg'
  const quoteHref = `/book-appointment?service=${service.slug}&intent=quote`
  const topBenefits = service.benefits.map((benefit) => benefit.text).slice(0, 3)

  return (
    <article id={service.slug} className="feature-card h-full">
      <div className="feature-card__content flex h-full flex-col gap-4 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {service.specialty && (
            <span className="feature-chip feature-chip--accent">{service.specialty}</span>
          )}
          <span className="feature-chip text-xs">{service.frequency}</span>
        </div>
        <div className="space-y-2 text-white/85">
          <h3 className="text-xl font-semibold text-white">{service.title}</h3>
          <p className="text-sm text-white/70">{service.description}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl border border-white/12 bg-black/35 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/45">Quote</p>
            <p className="mt-1 text-base font-semibold text-white">{service.price}</p>
          </div>
          <div className="flex-1 rounded-2xl border border-white/12 bg-black/35 p-4">
            <p className="text-[0.65rem] uppercase tracking-[0.3em] text-white/45">Cadence</p>
            <p className="mt-1 text-base font-semibold text-white">{service.frequency}</p>
          </div>
        </div>
        <ServiceList title="What you get" items={topBenefits} variant="compact" />
        <div className="mt-auto space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              href={quoteHref}
              className="w-full rounded-full px-6 py-2.5 text-sm font-semibold uppercase tracking-wide"
            >
              Request quote
            </Button>
            <Button
              href={`/services/${service.slug}`}
              variant="ghost"
              className="w-full rounded-full border border-white/15 px-6 py-2.5 text-sm font-semibold uppercase tracking-wide"
            >
              View details
            </Button>
          </div>
          <figure className="relative h-36 overflow-hidden rounded-2xl">
            <Image
              src={imageSrc}
              alt={`${service.title} in action`}
              fill
              sizes="(min-width: 1024px) 320px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </figure>
        </div>
      </div>
    </article>
  )
}
