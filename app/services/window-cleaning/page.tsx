import Section from '@/components/Section'
import InteractiveServiceCard from '@/components/InteractiveServiceCard'
import Button from '@/components/Button'
import LightboxGallery from '@/components/LightboxGallery'
import Reviews from '@/components/Reviews'
import PostcodeChecker from '@/components/PostcodeChecker'
import { SERVICE_IMAGES, GALLERY_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import Image from 'next/image'

export const metadata = {
  title: 'Window Cleaning Services Somerset | Professional Window Cleaners',
  description: 'Crystal-clear window cleaning across Somerset using pure water technology. Regular service from £20. Frames, sills, and glass included. Book your local window cleaner today.',
  keywords: 'window cleaning Somerset, window cleaners near me, pure water window cleaning, residential window cleaning, commercial window cleaning'
}

export default function WindowCleaningPage() {
  // Get window cleaning service data
  const windowService = servicesData.find(service => service.title === 'Window Cleaning')!

  return (
    <div>
      {/* Hero Section with Service-Specific Image */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={SERVICE_IMAGES.window || '/photos/photo02.jpg'}
          alt="Professional window cleaning in Somerset"
          fill
          priority
          className="absolute inset-0 object-cover opacity-50"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-20 pt-28 md:pb-24 md:pt-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/20 px-4 py-2 text-sm font-medium text-brand-red backdrop-blur-sm">
            <span className="text-lg">✨</span>
            Most Popular Service
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Window Cleaning Services
          </h1>
          <p className="max-w-2xl text-lg text-white/80 leading-relaxed">
            Transform your property with streak-free, sparkling windows. Our pure water technology ensures 
            crystal-clear results that last longer, with no chemical residue.
          </p>
          
          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button href="/get-in-touch?service=window-cleaning" variant="primary" className="text-lg px-8 py-4">
              Get Free Quote
            </Button>
            <a 
              href="tel:01458860339" 
              className="inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white border border-white/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call 01458 860339
            </a>
          </div>
        </div>
      </section>

      {/* Service Details Using InteractiveServiceCard */}
      <Section 
        title="Service Overview" 
        subtitle="Everything you need to know about our window cleaning service"
        spacing="relaxed"
        animationDelay={100}
      >
        <div className="max-w-4xl mx-auto">
          <InteractiveServiceCard
            title={windowService.title}
            description={windowService.description}
            longDescription={windowService.longDescription}
            imageSrc={SERVICE_IMAGES.window || '/photos/photo02.jpg'}
            imageAlt="Window cleaning service"
            benefits={windowService.benefits}
            price={windowService.price}
            ctaText="Book Window Cleaning"
            ctaHref="/get-in-touch?service=window-cleaning"
            specialty={windowService.specialty}
          />
        </div>
      </Section>

      {/* Our Process Section */}
      <Section 
        title="Our Window Cleaning Process" 
        subtitle="Professional, systematic approach for perfect results every time"
        spacing="relaxed"
        animationDelay={200}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {windowService.process.map((step, index) => (
            <div key={index} className="relative">
              <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/20">
                    <span className="text-lg font-bold text-brand-red">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-white">Step {index + 1}</h3>
                </div>
                <p className="text-sm text-white/80">{step}</p>
              </div>
              {index < windowService.process.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-brand-red/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Pricing & Packages */}
      <Section 
        title="Transparent Pricing" 
        subtitle="Clear, upfront pricing with no hidden fees"
        spacing="relaxed"
        animationDelay={300}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Regular Service */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-2">4-Weekly Service</h3>
            <div className="text-3xl font-bold text-brand-red mb-4">From £20</div>
            <p className="text-sm text-white/80 mb-6">Best value option</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Lowest price per clean
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Windows stay cleaner
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Priority scheduling
              </li>
            </ul>
            <Button href="/get-in-touch?service=window-cleaning&frequency=4-weekly" variant="primary" className="w-full">
              Choose 4-Weekly
            </Button>
          </div>

          {/* Standard Service */}
          <div className="rounded-xl border border-brand-red/30 bg-gradient-to-br from-brand-red/20 to-brand-red/10 p-8 backdrop-blur-sm transform scale-105">
            <div className="inline-flex items-center rounded-full bg-brand-red/20 px-3 py-1 text-xs font-medium text-brand-red mb-4">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-white mb-2">8-Weekly Service</h3>
            <div className="text-3xl font-bold text-brand-red mb-4">From £25</div>
            <p className="text-sm text-white/80 mb-6">Perfect balance</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Most popular choice
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Great value
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Flexible scheduling
              </li>
            </ul>
            <Button href="/get-in-touch?service=window-cleaning&frequency=8-weekly" variant="primary" className="w-full">
              Choose 8-Weekly
            </Button>
          </div>

          {/* One-off Service */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-2">One-off Clean</h3>
            <div className="text-3xl font-bold text-brand-red mb-4">From £35</div>
            <p className="text-sm text-white/80 mb-6">Single service</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                No commitment
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Perfect for events
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Try our service
              </li>
            </ul>
            <Button href="/get-in-touch?service=window-cleaning&frequency=one-off" variant="primary" className="w-full">
              Book One-off Clean
            </Button>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section 
        title="Frequently Asked Questions" 
        subtitle="Everything you need to know about our window cleaning service"
        spacing="relaxed"
        animationDelay={400}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Do I need to be home during the clean?</h3>
            <p className="text-white/80">No, you don&apos;t need to be home. We clean external windows only and will text you before arrival. Payment can be made online after completion.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">What is pure water technology?</h3>
            <p className="text-white/80">Pure water is filtered to remove all minerals and impurities. It dries spot-free without squeegeeing, leaves no residue, and keeps windows cleaner for longer.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">What&apos;s included in the service?</h3>
            <p className="text-white/80">All external windows, frames, sills, and door glass. We also clean conservatory windows, skylights (if safely accessible), and garage windows at no extra charge.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">What happens in bad weather?</h3>
            <p className="text-white/80">We work in light rain as pure water cleaning is effective in most weather. We only postpone in extreme conditions (heavy rain, high winds, or ice) and will text you to reschedule.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">How do I pay?</h3>
            <p className="text-white/80">We offer multiple payment options: bank transfer, card payment via secure link, or cash. We&apos;ll send an invoice by text after each clean with payment details.</p>
          </div>
        </div>
      </Section>

      {/* Gallery Section */}
      <Section 
        title="Our Window Cleaning Results" 
        subtitle="See the difference professional window cleaning makes"
        spacing="relaxed"
        animationDelay={500}
      >
        <LightboxGallery 
          images={GALLERY_IMAGES.slice(0, 6)} 
        />
      </Section>

      {/* Area Coverage */}
      <Section 
        title="Check Your Area" 
        subtitle="We cover all of Somerset with regular window cleaning routes"
        spacing="relaxed"
        animationDelay={600}
      >
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm text-center">
            <h3 className="text-xl font-bold text-white mb-3">Is window cleaning available in your area?</h3>
            <p className="text-white/80 mb-6">Enter your postcode to check coverage and get an instant quote</p>
            <PostcodeChecker variant="inline" placeholder="Enter your postcode" />
            <p className="text-xs text-white/60 mt-4">
              Popular areas: Wells (BA5), Glastonbury (BA6), Street (BA16), Cheddar (BS27)
            </p>
          </div>
        </div>
      </Section>

      {/* Related Services */}
      <Section 
        title="Complete Your Property Care" 
        subtitle="Popular services to combine with window cleaning"
        spacing="relaxed"
        animationDelay={700}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Add Gutter Clearing</h3>
            <p className="text-sm text-white/80 mb-4">Protect your property from water damage with annual gutter maintenance.</p>
            <Button href="/services/gutter-clearing" variant="ghost" className="w-full">
              Learn More
            </Button>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Add Fascias & Soffits</h3>
            <p className="text-sm text-white/80 mb-4">Brighten your home&apos;s exterior with professional PVC cleaning.</p>
            <Button href="/services/fascias-soffits-cleaning" variant="ghost" className="w-full">
              Learn More
            </Button>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Package Deal</h3>
            <p className="text-sm text-white/80 mb-4">Save 15% when you combine window cleaning with other services.</p>
            <Button href="/pricing#packages" variant="ghost" className="w-full">
              View Packages
            </Button>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section spacing="generous">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12 backdrop-blur-sm text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Sparkling Clean Windows?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
            Join hundreds of satisfied customers across Somerset. Get your free quote today and see why we&apos;re the area&apos;s most trusted window cleaning service.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/get-in-touch?service=window-cleaning" variant="primary" className="text-lg px-8 py-4">
              Get Your Free Quote
            </Button>
            <a
              href="tel:01458860339"
              className="inline-flex items-center justify-center rounded-md px-8 py-4 text-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white border border-white/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call 01458 860339
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              No obligation quote
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Fully insured
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              100% satisfaction guarantee
            </span>
          </div>
        </div>
      </Section>
    </div>
  )
}