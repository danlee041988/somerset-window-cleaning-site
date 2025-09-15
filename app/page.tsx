import Button from '@/components/Button'
import Section from '@/components/Section'
import ServiceCard from '@/components/ServiceCard'
import LightboxGallery from '@/components/LightboxGallery'
import ProcessFlow from '@/components/ProcessFlow'
import Reviews from '@/components/Reviews'
import StrategicCTA from '@/components/StrategicCTA'
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
          className="absolute inset-0 object-cover opacity-60"
          style={{ filter: 'brightness(1.4)' }}
          sizes="100vw"
        />
        {/* Gradient overlay for readability but lighter */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-24 pt-24 md:pb-28 md:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-red)' }} />
            Local
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-red)' }} />
            Reliable
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: 'var(--brand-red)' }} />
            Fully Insured
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Somerset Window Cleaning
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            Streak‑free, sparkling windows for homes and businesses across Somerset. Professional service, transparent pricing, flexible scheduling.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/contact">Get in Touch</Button>
            <Button href="/services" variant="ghost">Explore services</Button>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <Section
        title="Services tailored to your property"
        subtitle="From regular maintenance to one‑off deep cleans, we've got you covered."
        spacing="relaxed"
        animationDelay={100}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ServiceCard title="Window Cleaning" imageSrc={SERVICE_IMAGES.window || '/photos/photo02.jpg'} description="Frames, sills, and glass. Pure water for a spotless finish." />
          <ServiceCard title="Gutter Clearing" imageSrc={SERVICE_IMAGES.gutter_clearing || '/photos/photo03.jpg'} description="Clear debris to protect your home from damp and overflow." />
          <ServiceCard title="Conservatory Roof Cleaning" imageSrc={SERVICE_IMAGES.conservatory || '/photos/photo04.jpg'} description="Restore clarity to glass roofs, sides, and PVC frames." />
          <ServiceCard title="Solar Panels" imageSrc={SERVICE_IMAGES.solar || '/photos/photo05.jpg'} description="Maximise efficiency with gentle, safe cleaning methods." />
        </div>
      </Section>

      {/* Trust signals */}
      <Section spacing="compact" animationDelay={200}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Fully insured</span>
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Domestic & Commercial</span>
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Flexible bookings</span>
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Friendly local team</span>
        </div>
      </Section>

      <CaseStudy />

      {/* How it works */}
      <Section 
        title="Clean and simple, start to finish" 
        subtitle="Our straightforward process makes booking and paying easy."
        spacing="relaxed"
        animationDelay={300}
      >
        <ProcessFlow />
      </Section>

      {/* Reviews section */}
      <Section 
        title="What our customers say"
        subtitle="Real reviews from verified Google customers across Somerset."
        spacing="relaxed"
        animationDelay={400}
      >
        <Reviews />
      </Section>

      {/* Strategic CTA */}
      <Section spacing="relaxed" animationDelay={500}>
        <StrategicCTA />
      </Section>

      {/* Recent work preview */}
      <Section 
        title="Recent work" 
        subtitle="A quick look at some of our cleaning results." 
        spacing="generous"
        animationDelay={600}
      >
        <LightboxGallery images={(GALLERY_IMAGES && GALLERY_IMAGES.length ? GALLERY_IMAGES.slice(0, 12) : ['/photos/photo01.jpg','/photos/photo02.jpg','/photos/photo03.jpg','/photos/photo04.jpg'])} />
        <div className="mt-6"> 
          <Button href="/gallery" variant="ghost">View full gallery</Button>
        </div>
      </Section>
    </div>
  )
}
