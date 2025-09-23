import Image from 'next/image'
import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import type { servicesData } from '@/content/services-data'

type ServiceEntry = (typeof servicesData)[number]

type FAQItem = {
  question: string
  answer: string
}

type HeroConfig = {
  kicker?: string
  heading: string
  intro: string
  highlights: string[]
  imageSrc: string
  imageAlt: string
}

type ServicePageLayoutProps = {
  service: ServiceEntry
  hero: HeroConfig
  faqs: FAQItem[]
  bookingHref: string
  bookingLabel: string
}

export function ServicePageLayout({ service, hero, faqs, bookingHref, bookingLabel }: ServicePageLayoutProps) {
  return (
    <div className="pb-24">
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={hero.imageSrc}
          alt={hero.imageAlt}
          fill
          priority
          className="absolute inset-0 object-cover opacity-60"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" aria-hidden />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-6 px-4 pb-20 pt-28 md:pb-24 md:pt-32">
          {hero.kicker && (
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-red/35 bg-brand-red/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-brand-red">
              {hero.kicker}
            </span>
          )}
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
            {hero.heading}
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-white/80">
            {hero.intro}
          </p>
          <ul className="flex flex-wrap gap-3 text-sm text-white/75">
            {hero.highlights.map((item) => (
              <li key={item} className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2">
                <span className="flex h-2 w-2 rounded-full bg-brand-red" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button href={bookingHref} className="rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em]">
              {bookingLabel}
            </Button>
          </div>
        </div>
      </section>

      <Section
        spacing="relaxed"
        title={`Why choose ${service.title}`}
        subtitle={service.longDescription}
      >
        <div className="grid gap-5 md:grid-cols-2">
          {service.benefits.map((benefit) => (
            <div key={benefit.text} className="rounded-2xl border border-white/15 bg-white/5 p-6 text-white/80">
              <p className="text-sm font-semibold text-white">{benefit.text}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        spacing="relaxed"
        title={`Our ${service.title.toLowerCase()} process`}
        subtitle="Every visit follows the same careful, proven workflow."
        className="pt-0"
      >
        <ol className="space-y-4">
          {service.process.map((step, index) => (
            <li key={step} className="rounded-2xl border border-white/10 bg-black/40 p-5 text-white/80">
              <div className="mb-2 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-red/50 text-sm font-semibold text-brand-red">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">Step {index + 1}</span>
              </div>
              <p className="text-base text-white/85 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      {service.equipment?.length ? (
        <Section spacing="normal" className="pt-0" title="What this service covers">
          <ul className="flex flex-wrap gap-3 text-sm text-white/75">
            {service.equipment.map((item) => (
              <li key={item} className="rounded-full border border-white/15 bg-white/5 px-3 py-1">
                {item}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {service.guarantee ? (
        <Section spacing="normal" className="pt-0">
          <div className="rounded-3xl border border-brand-red/40 bg-brand-red/10 p-6 text-sm text-white/85">
            <p className="text-xs uppercase tracking-[0.3em] text-brand-red/80">Our promise</p>
            <p className="mt-3 text-base leading-relaxed text-white/90">{service.guarantee}</p>
          </div>
        </Section>
      ) : null}

      <Section spacing="relaxed" className="pt-0" title="Frequently asked questions">
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-2xl border border-white/10 bg-black/40 p-5 text-white/80">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-white">
                {faq.question}
                <span className="ml-4 text-sm text-white/60 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/75">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section spacing="normal" className="pt-0">
        <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-center text-white/80">
          <h2 className="text-2xl font-semibold text-white">Ready to request {service.title.toLowerCase()}?</h2>
          <p className="mt-3 text-sm text-white/70">
            Share your property details and availability and we&apos;ll confirm a tailored quote within one working day.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button href={bookingHref} className="rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em]">
              {bookingLabel}
            </Button>
            <Button href="/book-appointment?intent=quote" variant="ghost" className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.35em]">
              Talk to the team
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
