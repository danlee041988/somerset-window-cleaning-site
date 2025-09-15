import Button from '@/components/Button'
import Section from '@/components/Section'
import ServiceCard from '@/components/ServiceCard'
import LightboxGallery from '@/components/LightboxGallery'
import Reviews from '@/components/Reviews'
import PostcodeChecker from '@/components/PostcodeChecker'
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
          style={{ filter: 'brightness(1.8)' }}
          sizes="100vw"
        />
        {/* Gradient overlay for readability but lighter */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-24 pt-32 md:pb-28 md:pt-36">
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
          
          {/* Postcode Checker in Hero */}
          <div className="w-full max-w-lg">
            <div className="mb-3">
              <h2 className="text-lg font-semibold text-white">Check if we cover your area:</h2>
              <p className="text-sm text-white/70">Enter your postcode to see if we service your location</p>
            </div>
            <PostcodeChecker variant="hero" placeholder="Enter your postcode (e.g. BA5 1TX)" />
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button href="/get-in-touch">Get in Touch</Button>
            <Button href="/services" variant="ghost">Explore services</Button>
          </div>
        </div>
      </section>

      {/* Services preview - Top 4 services */}
      <Section
        title="Our Most Popular Services"
        subtitle="Professional cleaning solutions that transform your property's appearance."
        spacing="relaxed"
        animationDelay={100}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <ServiceCard 
            title="Window Cleaning" 
            imageSrc={SERVICE_IMAGES.window || '/photos/photo02.jpg'} 
            description="Crystal-clear windows using pure water technology. Frames, sills, and glass included." 
          />
          <ServiceCard 
            title="Gutter Clearing" 
            imageSrc={SERVICE_IMAGES.gutter_clearing || '/photos/photo03.jpg'} 
            description="Protect your property from water damage. Safe ground-level vacuum clearing." 
          />
          <ServiceCard 
            title="Conservatory Roof Cleaning" 
            imageSrc={SERVICE_IMAGES.conservatory || '/photos/photo04.jpg'} 
            description="Restore brightness to glass and polycarbonate roofs. Gentle, seal-safe methods." 
          />
          <ServiceCard 
            title="Solar Panel Cleaning" 
            imageSrc={SERVICE_IMAGES.solar || '/photos/photo05.jpg'} 
            description="Maximize energy efficiency. Specialist cleaning that won't void warranties." 
          />
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button href="/services" variant="primary" className="text-lg px-8 py-4">
            View All Services
          </Button>
          <p className="flex items-center gap-2 text-sm text-white/70">
            <span>Also offering:</span>
            <span className="font-medium">Fascias & Soffits</span>
            <span>•</span>
            <span className="font-medium">Commercial Cleaning</span>
          </p>
        </div>
      </Section>

      {/* Trust signals */}
      <Section spacing="compact" animationDelay={200}>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Uniformed staff</span>
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Sign-written vans</span>
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Text reminders</span>
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Online payments</span>
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Fully insured</span>
          <span className="rounded-full bg-white/10 px-4 py-2 transition-colors hover:bg-white/15">Flexible bookings</span>
        </div>
      </Section>

      {/* Case Study - Featured more prominently */}
      <CaseStudy />

      {/* Reviews section */}
      <Section 
        title="What our customers say"
        subtitle="Real reviews from verified Google customers across Somerset."
        spacing="relaxed"
        animationDelay={300}
      >
        <Reviews />
      </Section>

      {/* Recent work preview */}
      <Section 
        title="Recent work" 
        subtitle="A quick look at some of our cleaning results." 
        spacing="generous"
        animationDelay={400}
      >
        <LightboxGallery images={(GALLERY_IMAGES && GALLERY_IMAGES.length ? GALLERY_IMAGES.slice(0, 12) : ['/photos/photo01.jpg','/photos/photo02.jpg','/photos/photo03.jpg','/photos/photo04.jpg'])} />
        <div className="mt-6"> 
          <Button href="/gallery" variant="ghost">View full gallery</Button>
        </div>
      </Section>
    </div>
  )
}
