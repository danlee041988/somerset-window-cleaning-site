import Section from '@/components/Section'
import InteractiveServiceCard from '@/components/InteractiveServiceCard'
import Button from '@/components/Button'
import LightboxGallery from '@/components/LightboxGallery'
import PostcodeChecker from '@/components/PostcodeChecker'
import { SERVICE_IMAGES, GALLERY_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import Image from 'next/image'

export const metadata = {
  title: 'Solar Panel Cleaning Somerset | Maximize Your Solar Investment',
  description: 'Professional solar panel cleaning across Somerset. Increase energy output by up to 25%. Warranty-safe methods using deionised water. Get your free quote today.',
  keywords: 'solar panel cleaning Somerset, photovoltaic cleaning, PV panel cleaning, solar maintenance Somerset, solar panel efficiency'
}

export default function SolarPanelCleaningPage() {
  const solarService = servicesData.find(service => service.title === 'Solar Panel Cleaning')!

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <Image
          src={SERVICE_IMAGES.solar || '/photos/photo05.jpg'}
          alt="Professional solar panel cleaning in Somerset"
          fill
          priority
          className="absolute inset-0 object-cover opacity-50"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-20 pt-28 md:pb-24 md:pt-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/20 px-4 py-2 text-sm font-medium text-yellow-400 backdrop-blur-sm">
            <span className="text-lg">⚡</span>
            High-Tech Service
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Solar Panel Cleaning
          </h1>
          <p className="max-w-2xl text-lg text-white/80 leading-relaxed">
            Maximize your solar investment with professional panel cleaning. Dirty panels can lose up to 25% efficiency - 
            our warranty-safe cleaning restores peak performance and protects your green energy system.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button href="/get-in-touch?service=solar-panel-cleaning" variant="primary" className="text-lg px-8 py-4">
              Get Efficiency Assessment
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

      {/* ROI Calculator Section */}
      <Section 
        title="The Cost of Dirty Solar Panels" 
        subtitle="See how much energy and money you could be losing"
        spacing="relaxed"
        animationDelay={100}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">Efficiency Loss Calculator</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-white/80">Clean Panels Output:</span>
                <span className="font-bold text-white">100%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-white/80">Light Soiling (6 months):</span>
                <span className="font-bold text-orange-400">-5-10%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-white/80">Moderate Soiling (1 year):</span>
                <span className="font-bold text-orange-500">-10-15%</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                <span className="text-white/80">Heavy Soiling (2+ years):</span>
                <span className="font-bold text-red-500">-20-25%</span>
              </div>
            </div>
            <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-sm text-yellow-200">
                <strong>Example:</strong> A 4kW system losing 20% efficiency = 800W loss = £400+ per year in lost generation!
              </p>
            </div>
          </div>
          
          <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-6">What Reduces Panel Efficiency?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">🦅</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Bird Droppings</h4>
                  <p className="text-sm text-white/70">Create hotspots that can damage cells permanently</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">🌫️</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Dust & Pollen</h4>
                  <p className="text-sm text-white/70">Forms a film that blocks sunlight from cells</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">🍃</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Lichen & Moss</h4>
                  <p className="text-sm text-white/70">Grows on edges, spreading inward over time</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-sm">💨</span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Air Pollution</h4>
                  <p className="text-sm text-white/70">Traffic film and industrial deposits reduce output</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Card */}
        <div className="max-w-4xl mx-auto">
          <InteractiveServiceCard
            title={solarService.title}
            description={solarService.description}
            longDescription={solarService.longDescription}
            imageSrc={SERVICE_IMAGES.solar || '/photos/photo05.jpg'}
            imageAlt="Solar panel cleaning service"
            benefits={solarService.benefits}
            price={solarService.price}
            frequency={solarService.frequency}
            ctaText="Book Solar Panel Cleaning"
            ctaHref="/get-in-touch?service=solar-panel-cleaning"
            specialty={solarService.specialty}
          />
        </div>
      </Section>

      {/* Our Process */}
      <Section 
        title="Warranty-Safe Cleaning Process" 
        subtitle="Approved methods that protect your investment"
        spacing="relaxed"
        animationDelay={200}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {solarService.process.map((step, index) => (
            <div key={index} className="relative">
              <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500/20">
                    <span className="text-lg font-bold text-yellow-400">{index + 1}</span>
                  </div>
                  <h3 className="font-semibold text-white">Step {index + 1}</h3>
                </div>
                <p className="text-sm text-white/80">{step}</p>
              </div>
              {index < solarService.process.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-yellow-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Why Choose Professional Cleaning */}
      <Section 
        title="Why Professional Solar Panel Cleaning?" 
        subtitle="Protect your warranty and maximize efficiency"
        spacing="relaxed"
        animationDelay={300}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-xl border border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">✅</span>
              Professional Cleaning Benefits
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Deionised Water Only</p>
                  <p className="text-sm text-white/70">No chemicals, minerals, or residues</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Soft Brush Systems</p>
                  <p className="text-sm text-white/70">Gentle on anti-reflective coatings</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Safe Access Equipment</p>
                  <p className="text-sm text-white/70">No walking on roof or panels</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Efficiency Monitoring</p>
                  <p className="text-sm text-white/70">Before/after performance checks</p>
                </div>
              </li>
            </ul>
          </div>
          
          <div className="rounded-xl border border-red-500/20 bg-gradient-to-br from-red-500/10 to-red-500/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-2xl">❌</span>
              DIY Cleaning Risks
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Tap Water Minerals</p>
                  <p className="text-sm text-white/70">Leave deposits that reduce efficiency</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Pressure Washers</p>
                  <p className="text-sm text-white/70">Can damage seals and connections</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Warranty Voiding</p>
                  <p className="text-sm text-white/70">Wrong methods void manufacturer warranty</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-white font-medium">Safety Risks</p>
                  <p className="text-sm text-white/70">Falls, electrical hazards, panel damage</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Pricing */}
      <Section 
        title="Solar Panel Cleaning Investment" 
        subtitle="Professional service that pays for itself"
        spacing="relaxed"
        animationDelay={400}
      >
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Service Pricing Factors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">System Size</h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Residential: 8-16 panels (2-4kW)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Large residential: 16-30 panels (4-8kW)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Commercial: 30+ panels
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Ground-mounted arrays
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-3">Access & Location</h4>
                <ul className="space-y-2 text-sm text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Single story easy access
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Two story properties
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Steep or complex roofs
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-brand-red">•</span>
                    Conservation areas
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-sm text-green-200 mb-1">Annual Clean</p>
                <p className="text-lg font-bold text-white">Best for most systems</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-center">
                <p className="text-sm text-yellow-200 mb-1">Bi-Annual</p>
                <p className="text-lg font-bold text-white">Near trees/coast</p>
              </div>
              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20 text-center">
                <p className="text-sm text-orange-200 mb-1">Quarterly</p>
                <p className="text-lg font-bold text-white">Agricultural areas</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-2xl font-bold text-brand-red mb-2">Free System Assessment</p>
            <p className="text-white/80 mb-6">We&apos;ll assess your system and provide a tailored cleaning schedule</p>
            <Button href="/get-in-touch?service=solar-panel-cleaning" variant="primary" className="text-lg px-8 py-4">
              Book Your Assessment
            </Button>
          </div>
        </div>
      </Section>

      {/* FAQs */}
      <Section 
        title="Solar Panel Cleaning FAQs" 
        subtitle="Expert answers to common questions"
        spacing="relaxed"
        animationDelay={500}
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">How often should solar panels be cleaned?</h3>
            <p className="text-white/80">Most systems benefit from annual cleaning. Properties near farms, main roads, or the coast may need bi-annual cleaning. We&apos;ll assess your specific situation and recommend the optimal schedule.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Will cleaning void my panel warranty?</h3>
            <p className="text-white/80">No - our methods are approved by all major manufacturers. We use only deionised water and soft brushes, avoiding pressure washing and harsh chemicals that could void warranties.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Don&apos;t panels self-clean in the rain?</h3>
            <p className="text-white/80">Rain helps but isn&apos;t enough. It doesn&apos;t remove bird droppings, pollen films, or pollution deposits. Rain can actually make things worse by leaving mineral deposits as it evaporates.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">How much efficiency improvement can I expect?</h3>
            <p className="text-white/80">Typical improvements range from 5-25% depending on how dirty your panels are. We&apos;ve seen neglected systems improve by 30% or more. Even seemingly clean panels often show 5-10% improvement.</p>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Can you clean panels with bird protection?</h3>
            <p className="text-white/80">Yes, we can work around most bird protection systems. Our telescopic equipment allows us to clean effectively without removing mesh or spikes.</p>
          </div>
        </div>
      </Section>

      {/* Maintenance Packages */}
      <Section 
        title="Solar Maintenance Packages" 
        subtitle="Keep your system performing at its peak"
        spacing="relaxed"
        animationDelay={600}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Basic Maintenance</h3>
            <p className="text-sm text-white/80 mb-4">Annual clean for optimal performance</p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Annual cleaning visit
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Visual inspection
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Performance report
              </li>
            </ul>
            <Button href="/get-in-touch?service=solar-panel-cleaning&package=basic" variant="ghost" className="w-full">
              Enquire Now
            </Button>
          </div>
          
          <div className="rounded-xl border border-brand-red/30 bg-gradient-to-br from-brand-red/20 to-brand-red/10 p-6 backdrop-blur-sm transform scale-105">
            <div className="inline-flex items-center rounded-full bg-brand-red/20 px-3 py-1 text-xs font-medium text-brand-red mb-4">
              Most Popular
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Premium Maintenance</h3>
            <p className="text-sm text-white/80 mb-4">Bi-annual cleaning for maximum output</p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Bi-annual cleaning
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Priority scheduling
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                10% package discount
              </li>
            </ul>
            <Button href="/get-in-touch?service=solar-panel-cleaning&package=premium" variant="primary" className="w-full">
              Most Popular
            </Button>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-2">Complete Care</h3>
            <p className="text-sm text-white/80 mb-4">Full service with monitoring</p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Quarterly cleaning
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Output monitoring
              </li>
              <li className="flex items-center gap-2 text-white/90">
                <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Emergency callouts
              </li>
            </ul>
            <Button href="/get-in-touch?service=solar-panel-cleaning&package=complete" variant="ghost" className="w-full">
              Get Details
            </Button>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section spacing="generous">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12 backdrop-blur-sm text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Maximize Your Solar Investment Today
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
            Professional solar panel cleaning pays for itself through increased energy production. 
            Get your free assessment and see how much more your panels could be generating.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/get-in-touch?service=solar-panel-cleaning" variant="primary" className="text-lg px-8 py-4">
              Book Free Assessment
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
              Warranty-safe methods
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
              Performance guarantee
            </span>
          </div>
        </div>
      </Section>
    </div>
  )
}