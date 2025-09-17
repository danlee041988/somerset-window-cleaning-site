import Section from '@/components/Section'
import InteractiveServiceCard from '@/components/InteractiveServiceCard'
import Button from '@/components/Button'
import LightboxGallery from '@/components/LightboxGallery'
import PostcodeChecker from '@/components/PostcodeChecker'
import { SERVICE_IMAGES, GALLERY_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import Image from 'next/image'

export const metadata = {
  title: 'Conservatory Roof Cleaning Somerset | Professional Conservatory Cleaners',
  description: 'Restore your conservatory&apos;s brightness with professional roof cleaning across Somerset. Gentle, seal-safe methods for glass and polycarbonate. Get a free quote today.',
  keywords: 'conservatory roof cleaning Somerset, conservatory cleaning near me, glass roof cleaning, polycarbonate roof cleaning, conservatory restoration'
}

export default function ConservatoryRoofCleaningPage() {
  const conservatoryService = servicesData.find(service => service.title === 'Conservatory Roof Cleaning')!

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={SERVICE_IMAGES.conservatory || '/photos/photo04.jpg'}
          alt="Professional conservatory roof cleaning in Somerset"
          fill
          priority
          className="absolute inset-0 object-cover opacity-50"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-20 pt-28 md:pb-24 md:pt-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/20 px-4 py-2 text-sm font-medium text-green-400 backdrop-blur-sm">
            <span className="text-lg">☀️</span>
            Specialist Service
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Conservatory Roof Cleaning
          </h1>
          <p className="max-w-2xl text-lg text-white/80 leading-relaxed">
            Transform your conservatory from dark and dingy to bright and inviting. Our specialist cleaning 
            removes years of algae, moss, and dirt without damaging delicate seals or coatings.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button href="/get-in-touch?service=conservatory-roof-cleaning" variant="primary" className="text-lg px-8 py-4">
              Get Free Assessment
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

      {/* Benefits of Clean Conservatory Roof */}
      <Section 
        title="Transform Your Conservatory" 
        subtitle="See the incredible difference professional roof cleaning makes"
        spacing="relaxed"
        animationDelay={100}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 backdrop-blur-sm">
            <div className="w-12 h-12 mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">80% More Light</h3>
            <p className="text-sm text-white/80">Dramatically increase natural light by removing years of accumulated dirt and algae growth.</p>
          </div>
          
          <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-6 backdrop-blur-sm">
            <div className="w-12 h-12 mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-2xl">🌡️</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Temperature Control</h3>
            <p className="text-sm text-white/80">Clean roofs reflect heat better in summer and let more warmth in during winter months.</p>
          </div>
          
          <div className="rounded-xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 backdrop-blur-sm">
            <div className="w-12 h-12 mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Extended Lifespan</h3>
            <p className="text-sm text-white/80">Regular cleaning prevents permanent staining and protects seals from degradation.</p>
          </div>
          
          <div className="rounded-xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6 backdrop-blur-sm">
            <div className="w-12 h-12 mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Added Value</h3>
            <p className="text-sm text-white/80">A clean, bright conservatory adds appeal and value to your property.</p>
          </div>
        </div>

        {/* Service Card */}
        <div className="max-w-4xl mx-auto">
          <InteractiveServiceCard
            title={conservatoryService.title}
            description={conservatoryService.description}
            longDescription={conservatoryService.longDescription}
            imageSrc={SERVICE_IMAGES.conservatory || '/photos/photo04.jpg'}
            imageAlt="Conservatory roof cleaning service"
            benefits={conservatoryService.benefits}
            price={conservatoryService.price}
            ctaText="Book Conservatory Cleaning"
            ctaHref="/get-in-touch?service=conservatory-roof-cleaning"
            specialty={conservatoryService.specialty}
          />
        </div>
      </Section>

      {/* Types of Conservatory Roofs */}
      <Section 
        title="We Clean All Conservatory Roof Types" 
        subtitle="Specialist methods for every material"
        spacing="relaxed"
        animationDelay={200}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold text-white">Glass Roofs</h3>
            </div>
            <p className="text-white/80 mb-6">Self-cleaning glass still needs professional attention to remove stubborn algae and atmospheric pollution.</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Pure water cleaning for streak-free finish
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Safe for all glass coatings
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Removes green algae buildup
              </li>
            </ul>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <span className="text-2xl">🏗️</span>
              </div>
              <h3 className="text-xl font-bold text-white">Polycarbonate Roofs</h3>
            </div>
            <p className="text-white/80 mb-6">Requires gentle cleaning to avoid scratching while effectively removing moss and lichen growth.</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Soft brush techniques
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Non-abrasive cleaning agents
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Restores clarity and light transmission
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Our Process */}
      <Section 
        title="Our Conservatory Cleaning Process" 
        subtitle="Thorough, safe, and effective every time"
        spacing="relaxed"
        animationDelay={300}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {conservatoryService.process.map((step, index) => (
            <div key={index} className="relative">
              <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                    <span className="text-lg font-bold text-green-400">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-white">Step {index + 1}</h3>
                </div>
                <p className="text-sm text-white/80">{step}</p>
              </div>
              {index < conservatoryService.process.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-green-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* What We Remove */}
      <Section 
        title="Common Conservatory Roof Problems We Solve" 
        subtitle="Years of neglect reversed in one visit"
        spacing="relaxed"
        animationDelay={400}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-green-900/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🌿</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Green Algae</h3>
            <p className="text-sm text-white/80">The most common issue - green film that blocks light and looks unsightly. We remove it completely.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-gray-900/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">🍄</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Moss & Lichen</h3>
            <p className="text-sm text-white/80">Stubborn growths that can damage seals. Our treatments safely remove without scrubbing.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="aspect-video relative mb-4 rounded-lg overflow-hidden bg-yellow-900/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">💨</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Bird Droppings</h3>
            <p className="text-sm text-white/80">Acidic deposits that can etch glass. We remove safely and apply protective treatment.</p>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section 
        title="Conservatory Cleaning Pricing" 
        subtitle="Transparent pricing based on your conservatory size and condition"
        spacing="relaxed"
        animationDelay={500}
      >
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Pricing Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Size & Type</h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Lean-to conservatories
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Victorian/Edwardian styles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    P-shaped/T-shaped designs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Orangeries and atriums
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Condition</h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Light soiling (annual clean)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Moderate algae growth
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Heavy moss/lichen
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Restoration cleaning
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-red mb-2">Free Assessment & Quote</p>
            <p className="text-white/80 mb-6">Every conservatory is unique - we&apos;ll provide a tailored quote based on your specific needs</p>
            <Button href="/get-in-touch?service=conservatory-roof-cleaning" variant="primary" className="text-lg px-8 py-4">
              Get Your Free Quote
            </Button>
          </div>
        </div>
      </Section>

      {/* Before & After Gallery */}
      <Section 
        title="Conservatory Transformations" 
        subtitle="See the dramatic difference our cleaning makes"
        spacing="relaxed"
        animationDelay={600}
      >
        <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20 max-w-3xl mx-auto text-center">
          <p className="text-sm text-green-200">
            <strong>Typical results:</strong> 70-80% increase in light transmission after professional cleaning
          </p>
        </div>
        <LightboxGallery 
          images={GALLERY_IMAGES.slice(4, 10)} 
        />
      </Section>

      {/* FAQs */}
      <Section 
        title="Frequently Asked Questions" 
        subtitle="Everything about conservatory roof cleaning"
        spacing="relaxed"
        animationDelay={700}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">How often should I clean my conservatory roof?</h3>
            <p className="text-white/80">We recommend annual cleaning for most conservatories. Those under trees or in exposed locations may benefit from bi-annual cleaning to maintain optimal light transmission.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Will cleaning damage the seals?</h3>
            <p className="text-white/80">No - we use seal-safe methods and avoid high pressure that could compromise your conservatory&apos;s weatherproofing. Our techniques actually help preserve seals by removing damaging growths.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Do you clean the inside too?</h3>
            <p className="text-white/80">Our standard service is external only, but we can arrange internal cleaning for an additional fee. Most light improvement comes from external cleaning.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">What about self-cleaning glass?</h3>
            <p className="text-white/80">Even self-cleaning glass needs professional attention. The coating helps but doesn&apos;t prevent all buildup, especially algae in shaded areas or where water pools.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">How long does it take?</h3>
            <p className="text-white/80">Most conservatory roofs take 2-4 hours depending on size and condition. We&apos;ll give you a time estimate with your quote.</p>
          </div>
        </div>
      </Section>

      {/* Combined Services */}
      <Section 
        title="Complete Conservatory Care" 
        subtitle="Combine services for the full transformation"
        spacing="relaxed"
        animationDelay={800}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">+ Window Cleaning</h3>
            <p className="text-sm text-white/80 mb-4">Add conservatory windows and doors for a complete clean inside and out.</p>
            <Button href="/services/window-cleaning" variant="ghost" className="w-full">
              Learn More
            </Button>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">+ Gutter Clearing</h3>
            <p className="text-sm text-white/80 mb-4">Keep water flowing properly with professional gutter clearing service.</p>
            <Button href="/services/gutter-clearing" variant="ghost" className="w-full">
              Learn More
            </Button>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">+ Frame Cleaning</h3>
            <p className="text-sm text-white/80 mb-4">Restore uPVC frames to brilliant white with our specialist cleaning.</p>
            <Button href="/services/fascias-soffits-cleaning" variant="ghost" className="w-full">
              Learn More
            </Button>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section spacing="generous">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12 backdrop-blur-sm text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Love Your Conservatory Again?
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
            Transform your dark, dingy conservatory back into the bright, beautiful space it was meant to be. 
            Get your free assessment and quote today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/get-in-touch?service=conservatory-roof-cleaning" variant="primary" className="text-lg px-8 py-4">
              Get Your Free Assessment
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
      </Section>
    </div>
  )
}