import Section from '@/components/Section'
import InteractiveServiceCard from '@/components/InteractiveServiceCard'
import Button from '@/components/Button'
import LightboxGallery from '@/components/LightboxGallery'
import PostcodeChecker from '@/components/PostcodeChecker'
import { SERVICE_IMAGES, GALLERY_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import Image from 'next/image'

export const metadata = {
  title: 'Gutter Clearing Services Somerset | Professional Gutter Cleaning',
  description: 'Protect your property with professional gutter clearing across Somerset. Safe ground-level vacuum clearing from £80. Before & after photos provided. Book today.',
  keywords: 'gutter clearing Somerset, gutter cleaning near me, blocked gutter clearing, gutter vacuum cleaning, downpipe clearing'
}

export default function GutterClearingPage() {
  const gutterService = servicesData.find(service => service.title === 'Gutter Clearing')!

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={SERVICE_IMAGES.gutter || '/photos/photo03.jpg'}
          alt="Professional gutter clearing in Somerset"
          fill
          priority
          className="absolute inset-0 object-cover opacity-50"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-20 pt-28 md:pb-24 md:pt-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-sm font-medium text-blue-400 backdrop-blur-sm">
            <span className="text-lg">🛡️</span>
            Essential Property Protection
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Gutter Clearing Services
          </h1>
          <p className="max-w-2xl text-lg text-white/80 leading-relaxed">
            Protect your property from costly water damage with professional gutter clearing. 
            Our advanced vacuum systems safely remove all debris from ground level, ensuring free-flowing gutters year-round.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button href="/get-in-touch?service=gutter-clearing" variant="primary" className="text-lg px-8 py-4">
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

      {/* Why Gutter Clearing is Essential */}
      <Section 
        title="Why Regular Gutter Clearing is Essential" 
        subtitle="Blocked gutters can cause serious and expensive damage to your property"
        spacing="relaxed"
        animationDelay={100}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5 p-6 backdrop-blur-sm">
            <div className="w-12 h-12 mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Roof Damage</h3>
            <p className="text-sm text-white/80">Overflowing water can damage roof tiles, fascias, and cause leaks into your loft space.</p>
          </div>
          
          <div className="rounded-xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-orange-500/5 p-6 backdrop-blur-sm">
            <div className="w-12 h-12 mb-4 rounded-full bg-orange-500/20 flex items-center justify-center">
              <span className="text-2xl">💧</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Damp & Mould</h3>
            <p className="text-sm text-white/80">Water running down walls causes penetrating damp, leading to mould and health issues.</p>
          </div>
          
          <div className="rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 p-6 backdrop-blur-sm">
            <div className="w-12 h-12 mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <span className="text-2xl">🧱</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Foundation Issues</h3>
            <p className="text-sm text-white/80">Overflowing water can erode soil around foundations, causing structural problems.</p>
          </div>
          
          <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 backdrop-blur-sm">
            <div className="w-12 h-12 mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <span className="text-2xl">🐛</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Pest Problems</h3>
            <p className="text-sm text-white/80">Blocked gutters attract birds, rodents, and insects that can damage your property.</p>
          </div>
        </div>

        {/* Service Card */}
        <div className="max-w-4xl mx-auto">
          <InteractiveServiceCard
            title={gutterService.title}
            description={gutterService.description}
            longDescription={gutterService.longDescription}
            imageSrc={SERVICE_IMAGES.gutter || '/photos/photo03.jpg'}
            imageAlt="Gutter clearing service"
            benefits={gutterService.benefits}
            price={gutterService.price}
            ctaText="Book Gutter Clearing"
            ctaHref="/get-in-touch?service=gutter-clearing"
            specialty={gutterService.specialty}
          />
        </div>
      </Section>

      {/* Our Process */}
      <Section 
        title="Our Gutter Clearing Process" 
        subtitle="Safe, thorough, and professional service every time"
        spacing="relaxed"
        animationDelay={200}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {gutterService.process.map((step, index) => (
            <div key={index} className="relative">
              <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                    <span className="text-lg font-bold text-blue-400">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-white">Step {index + 1}</h3>
                </div>
                <p className="text-sm text-white/80">{step}</p>
              </div>
              {index < gutterService.process.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-blue-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Equipment & Technology */}
      <Section 
        title="Advanced Equipment & Technology" 
        subtitle="Professional tools for safe and effective gutter clearing"
        spacing="relaxed"
        animationDelay={300}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">State-of-the-Art Vacuum Systems</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/20 shrink-0">
                  <span className="text-lg">🔧</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">High-Powered Vacuum</h4>
                  <p className="text-sm text-white/80">Industrial-grade vacuum systems that remove even the most stubborn debris</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/20 shrink-0">
                  <span className="text-lg">📏</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Telescopic Poles</h4>
                  <p className="text-sm text-white/80">Reach up to 40ft safely from ground level - no ladders required</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/20 shrink-0">
                  <span className="text-lg">📸</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Camera Inspection</h4>
                  <p className="text-sm text-white/80">High-resolution cameras to inspect and document gutter condition</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/20 shrink-0">
                  <span className="text-lg">🌿</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Eco-Friendly</h4>
                  <p className="text-sm text-white/80">All debris collected and disposed of responsibly - no mess left behind</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4">What We Remove</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white/90">Leaves & twigs</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white/90">Moss growth</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white/90">Bird nests</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white/90">Dirt & sludge</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white/90">Roof debris</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-white/90">Tennis balls!</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-200">
                <strong>Note:</strong> We also check and clear downpipes to ensure complete water flow
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section 
        title="Service Frequency & Pricing" 
        subtitle="How often should you clear your gutters?"
        spacing="relaxed"
        animationDelay={400}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Annual Service */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-2">Annual Service</h3>
            <div className="text-3xl font-bold text-brand-red mb-4">From £80</div>
            <p className="text-sm text-white/80 mb-6">Minimum recommendation</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Properties with few trees
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Clear after autumn
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Basic protection
              </li>
            </ul>
            <Button href="/get-in-touch?service=gutter-clearing&frequency=annual" variant="primary" className="w-full">
              Book Annual Clear
            </Button>
          </div>

          {/* Bi-Annual Service */}
          <div className="rounded-xl border border-brand-red/30 bg-gradient-to-br from-brand-red/20 to-brand-red/10 p-8 backdrop-blur-sm transform scale-105">
            <div className="inline-flex items-center rounded-full bg-brand-red/20 px-3 py-1 text-xs font-medium text-brand-red mb-4">
              Recommended
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Bi-Annual Service</h3>
            <div className="text-3xl font-bold text-brand-red mb-4">From £140</div>
            <p className="text-sm text-white/80 mb-6">Best protection</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Properties near trees
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Spring & autumn clear
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Optimal protection
              </li>
            </ul>
            <Button href="/get-in-touch?service=gutter-clearing&frequency=bi-annual" variant="primary" className="w-full">
              Book Bi-Annual Plan
            </Button>
          </div>

          {/* Emergency Service */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-2">Emergency Clear</h3>
            <div className="text-3xl font-bold text-brand-red mb-4">Quote</div>
            <p className="text-sm text-white/80 mb-6">Urgent blockages</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Overflowing gutters
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Priority scheduling
              </li>
              <li className="flex items-center gap-2 text-sm text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Fast response
              </li>
            </ul>
            <Button href="/get-in-touch?service=gutter-clearing&frequency=emergency" variant="primary" className="w-full">
              Get Emergency Quote
            </Button>
          </div>
        </div>
      </Section>

      {/* Before & After Gallery */}
      <Section 
        title="Before & After Results" 
        subtitle="See the difference professional gutter clearing makes"
        spacing="relaxed"
        animationDelay={500}
      >
        <div className="mb-8 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 max-w-3xl mx-auto text-center">
          <p className="text-sm text-blue-200">
            <strong>Every job includes:</strong> Before & after photos sent directly to your phone for complete peace of mind
          </p>
        </div>
        <LightboxGallery 
          images={GALLERY_IMAGES.slice(2, 8)} 
        />
      </Section>

      {/* FAQs */}
      <Section 
        title="Frequently Asked Questions" 
        subtitle="Everything you need to know about gutter clearing"
        spacing="relaxed"
        animationDelay={600}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">How do I know if my gutters need clearing?</h3>
            <p className="text-white/80">Signs include: water overflowing during rain, plants growing in gutters, birds nesting, sagging gutters, or water stains on walls. If you can&apos;t remember when they were last cleared, they probably need doing!</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Is it safe to clear gutters from the ground?</h3>
            <p className="text-white/80">Yes! Our vacuum systems reach up to 40ft safely from ground level. This eliminates ladder risks and allows us to work in conditions where ladder use would be dangerous.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Do you check downpipes too?</h3>
            <p className="text-white/80">Yes, we check all downpipes are flowing freely. If blocked, we&apos;ll clear them at no extra charge. This ensures your entire gutter system works properly.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">What happens to the debris?</h3>
            <p className="text-white/80">All debris is collected in our vacuum system and disposed of responsibly. We leave no mess on your property - you won&apos;t even know we&apos;ve been except for the clean gutters!</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Can you install gutter guards?</h3>
            <p className="text-white/80">We can advise on gutter protection options. However, we find regular clearing is often more cost-effective than guards, which can still accumulate debris on top and reduce water flow.</p>
          </div>
        </div>
      </Section>

      {/* Service Combinations */}
      <Section 
        title="Save with Service Combinations" 
        subtitle="Protect your entire property with our complete exterior care packages"
        spacing="relaxed"
        animationDelay={700}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Gutters + Windows</h3>
            <p className="text-sm text-white/80 mb-4">Complete exterior maintenance. Keep your property looking great and functioning properly.</p>
            <div className="text-2xl font-bold text-brand-red mb-4">Save 10%</div>
            <Button href="/pricing#packages" variant="ghost" className="w-full">
              View Package
            </Button>
          </div>
          
          <div className="rounded-xl border border-brand-red/30 bg-gradient-to-br from-brand-red/20 to-brand-red/10 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Complete Property Care</h3>
            <p className="text-sm text-white/80 mb-4">Windows, gutters, fascias & soffits. Everything your property needs in one service.</p>
            <div className="text-2xl font-bold text-brand-red mb-4">Save 15%</div>
            <Button href="/pricing#packages" variant="primary" className="w-full">
              Most Popular
            </Button>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Add Roof Cleaning</h3>
            <p className="text-sm text-white/80 mb-4">Conservatory or solar panels? Add specialist cleaning to your gutter service.</p>
            <div className="text-2xl font-bold text-brand-red mb-4">Bundle Price</div>
            <Button href="/services" variant="ghost" className="w-full">
              Explore Services
            </Button>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section spacing="generous">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12 backdrop-blur-sm text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Protect Your Property Today
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
            Don&apos;t wait for water damage - blocked gutters cause expensive problems. 
            Get your free quote now and protect your biggest investment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/get-in-touch?service=gutter-clearing" variant="primary" className="text-lg px-8 py-4">
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
        </div>
      </Section>
    </div>
  )
}
