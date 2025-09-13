import Button from '@/components/Button'
import Section from '@/components/Section'
import ServiceCard from '@/components/ServiceCard'
import LightboxGallery from '@/components/LightboxGallery'
import ProcessFlow from '@/components/ProcessFlow'
import { HERO_IMAGES, GALLERY_IMAGES, SERVICE_IMAGES } from '@/content/image-manifest'
import Image from 'next/image'
import CaseStudy from '@/components/CaseStudy'

export default function HomePage() {
  return (
    <div>
      {/* Hero with background image */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        {/* Background image */}
        <Image
          src={(HERO_IMAGES && HERO_IMAGES[0]) || '/photos/photo01.jpg'}
          alt=""
          aria-hidden="true"
          fill
          priority
          className="absolute inset-0 object-cover opacity-50"
          sizes="100vw"
        />
        {/* Gradient overlay for readability but lighter */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-24 pt-24 md:pb-28 md:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-red)' }} />
            Local • Reliable • Fully Insured
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Somerset Window Cleaning
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Streak‑free, sparkling windows for homes and businesses across Somerset. Professional service, transparent pricing, flexible scheduling.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/quote">Quote me</Button>
            <Button href="/services" variant="ghost">Explore services</Button>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <Section
        title="Services tailored to your property"
        subtitle="From regular maintenance to one‑off deep cleans, we’ve got you covered."
        className="py-16 md:py-20"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ServiceCard title="Window Cleaning" imageSrc={SERVICE_IMAGES.window || '/photos/photo02.jpg'} description="Frames, sills, and glass. Pure water for a spotless finish." />
          <ServiceCard title="Gutter Cleaning" imageSrc={SERVICE_IMAGES.gutter || '/photos/photo03.jpg'} description="Clear debris to protect your home from damp and overflow." />
          <ServiceCard title="Conservatories" imageSrc={SERVICE_IMAGES.conservatory || '/photos/photo04.jpg'} description="Restore clarity to glass roofs, sides, and PVC frames." />
          <ServiceCard title="Solar Panels" imageSrc={SERVICE_IMAGES.solar || '/photos/photo05.jpg'} description="Maximise efficiency with gentle, safe cleaning methods." />
        </div>
      </Section>

      {/* Trust signals */}
      <Section className="py-4">
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
          <span className="rounded bg-white/10 px-3 py-1">Fully insured</span>
          <span className="rounded bg-white/10 px-3 py-1">Domestic & Commercial</span>
          <span className="rounded bg-white/10 px-3 py-1">Flexible bookings</span>
          <span className="rounded bg-white/10 px-3 py-1">Friendly local team</span>
        </div>
      </Section>

      <CaseStudy />

      {/* How it works */}
      <Section title="Clean and simple, start to finish" subtitle="Our straightforward process makes booking and paying easy.">
        <ProcessFlow />
      </Section>

      {/* Reviews strip */}
      <Section>
        <div className="rounded-xl border border-white/10 bg-white/10 p-5 md:p-6">
          <div className="mb-3 flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                <path fill="#E11D2A" d="M12 17.27 18.18 21 16.54 13.97 22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            ))}
            <span className="text-sm text-white/80">Friendly, reliable, guaranteed</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <blockquote className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">“Brilliant service and sparkling results. Booking was simple and the reminder was handy.”</blockquote>
            <blockquote className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80">“Professional, uniformed team. Love that we can pay online and don’t need to be home.”</blockquote>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-16 md:py-20">
        <div className="rounded-xl border border-white/10 bg-white/10 p-8 text-center md:p-10">
          <h2 className="text-2xl font-semibold">Ready for a streak‑free shine?</h2>
          <p className="mx-auto mt-2 max-w-2xl text-white/70">Tell us a little about your property and we’ll get back with a quick quote.</p>
          <div className="mt-6 flex justify-center">
            <Button href="/quote">Quote me</Button>
          </div>
        </div>
      </Section>

      {/* Recent work preview */}
      <Section title="Recent work" subtitle="A quick look at some of our cleaning results." className="pb-16 md:pb-24">
        <LightboxGallery images={(GALLERY_IMAGES && GALLERY_IMAGES.length ? GALLERY_IMAGES.slice(0, 12) : ['/photos/photo01.jpg','/photos/photo02.jpg','/photos/photo03.jpg','/photos/photo04.jpg'])} />
        <div className="mt-6"> 
          <Button href="/gallery" variant="ghost">View full gallery</Button>
        </div>
      </Section>
    </div>
  )
}
