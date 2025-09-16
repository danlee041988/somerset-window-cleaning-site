import Section from '@/components/Section'
import Button from '@/components/Button'
import ServiceCard from '@/components/ServiceCard'
import Reviews from '@/components/Reviews'
import PostcodeChecker from '@/components/PostcodeChecker'
import { SERVICE_IMAGES } from '@/content/image-manifest'
import Image from 'next/image'

export const metadata = {
  title: 'Window Cleaning Wells BA5 | Somerset Window Cleaning Services',
  description: 'Professional window cleaning in Wells BA5 and surrounding areas. Covering Cathedral City, Coxley, Wookey, and nearby villages. Local, reliable service from £20.',
  keywords: 'window cleaning Wells, BA5 window cleaner, Wells Somerset cleaning, Cathedral City window cleaning, Coxley window cleaner, Wookey cleaning services'
}

export default function WellsBA5Page() {
  const localTestimonials = [
    {
      author: 'Sarah Mitchell',
      location: 'Cathedral Green, Wells',
      rating: 5,
      text: 'Excellent service! Dan and his team are always punctual and do a fantastic job on our period property windows. Highly recommend to anyone in Wells.'
    },
    {
      author: 'John Roberts',
      location: 'Wookey',
      rating: 5,
      text: 'Been using Somerset Window Cleaning for 2 years now. Reliable, professional, and great value. They even clean my conservatory roof!'
    },
    {
      author: 'Emma Thompson',
      location: 'Coxley',
      rating: 5,
      text: 'Brilliant service - they text the night before, work around my schedule, and my windows have never looked better. So glad to have found a reliable local service.'
    }
  ]

  return (
    <div>
      {/* Hero Section with Wells Cathedral */}
      <section className="relative overflow-hidden border-b border-white/10 bg-black">
        <Image
          src="/photos/wells-cathedral.jpg"
          alt="Wells Cathedral and surrounding area"
          fill
          priority
          className="absolute inset-0 object-cover opacity-40"
          sizes="100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 pb-20 pt-28 md:pb-24 md:pt-32">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/20 px-4 py-2 text-sm font-medium text-brand-red backdrop-blur-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Covering All BA5 Postcodes
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
            Window Cleaning in Wells BA5
          </h1>
          <p className="max-w-2xl text-lg text-white/80 leading-relaxed">
            Professional window cleaning services throughout Wells and surrounding BA5 areas. 
            From Cathedral Green to Wookey, we&apos;re your local, trusted cleaning experts with 
            over 500 satisfied customers in the Wells area.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button href="/get-in-touch?area=wells-ba5" variant="primary" className="text-lg px-8 py-4">
              Get Free Wells Quote
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

      {/* Local Service Areas */}
      <Section 
        title="Window Cleaning Across Wells BA5" 
        subtitle="Comprehensive coverage of Wells and all surrounding villages"
        spacing="relaxed"
        animationDelay={100}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">Wells City Centre</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Cathedral Green & Market Place
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                St Thomas Street & Priory Road
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Chamberlain Street & Union Street
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                New Street & High Street
              </li>
            </ul>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">Wells Suburbs</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Keward & Strawberry Way
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Portway & St Andrews Road
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Burcott Road & Glastonbury Road
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Milton Lane & Tor Street
              </li>
            </ul>
          </div>
          
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-white mb-3">BA5 Villages</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Coxley & Polsham
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Wookey & Wookey Hole
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Haybridge & Upper Milton
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-red">•</span>
                Easton & Westbury-sub-Mendip
              </li>
            </ul>
          </div>
        </div>

        {/* Local Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="text-center p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5">
            <div className="text-3xl font-bold text-brand-red mb-2">500+</div>
            <p className="text-sm text-white/70">Wells Customers</p>
          </div>
          <div className="text-center p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5">
            <div className="text-3xl font-bold text-brand-red mb-2">8</div>
            <p className="text-sm text-white/70">Years in BA5</p>
          </div>
          <div className="text-center p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5">
            <div className="text-3xl font-bold text-brand-red mb-2">15</div>
            <p className="text-sm text-white/70">BA5 Villages Covered</p>
          </div>
          <div className="text-center p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5">
            <div className="text-3xl font-bold text-brand-red mb-2">4.9★</div>
            <p className="text-sm text-white/70">Google Rating</p>
          </div>
        </div>

        {/* Postcode Checker */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm text-center">
            <h3 className="text-xl font-bold text-white mb-3">Check Your Wells Postcode</h3>
            <p className="text-white/80 mb-6">Confirm we cover your specific BA5 location</p>
            <PostcodeChecker variant="inline" placeholder="Enter your BA5 postcode" />
          </div>
        </div>
      </Section>

      {/* Popular Services in Wells */}
      <Section 
        title="Popular Services in Wells" 
        subtitle="Tailored to BA5 properties and local needs"
        spacing="relaxed"
        animationDelay={200}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ServiceCard 
            title="Residential Window Cleaning" 
            imageSrc={SERVICE_IMAGES.window || '/photos/photo02.jpg'} 
            description="Regular window cleaning for Wells homes. Perfect for period properties, modern estates, and everything in between." 
          />
          <ServiceCard 
            title="Gutter Clearing" 
            imageSrc={SERVICE_IMAGES.gutter_clearing || '/photos/photo03.jpg'} 
            description="Essential in Wells due to tree-lined streets. Protect your property from water damage year-round." 
          />
          <ServiceCard 
            title="Conservatory Cleaning" 
            imageSrc={SERVICE_IMAGES.conservatory || '/photos/photo04.jpg'} 
            description="Many Wells properties have conservatories. Keep them bright and inviting with our specialist cleaning." 
          />
        </div>
        
        <div className="rounded-xl border border-brand-red/30 bg-gradient-to-br from-brand-red/20 to-brand-red/10 p-8 backdrop-blur-sm text-center">
          <h3 className="text-xl font-bold text-white mb-3">Wells Special Offer</h3>
          <p className="text-white/80 mb-4">Book 3 services together and save 15% - Popular with BA5 customers!</p>
          <Button href="/pricing#packages" variant="primary">View Package Deals</Button>
        </div>
      </Section>

      {/* Local Testimonials */}
      <Section 
        title="What Wells Customers Say" 
        subtitle="Real reviews from your BA5 neighbors"
        spacing="relaxed"
        animationDelay={300}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {localTestimonials.map((review, index) => (
            <div key={index} className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/90 mb-3 text-sm italic">&ldquo;{review.text}&rdquo;</p>
              <div>
                <p className="font-semibold text-white">{review.author}</p>
                <p className="text-xs text-white/60">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/80 mb-4">See more reviews from Wells customers</p>
          <a 
            href="https://g.page/r/CYYz0MzUhvD-EBM/review" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md px-5 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white"
          >
            Read All Google Reviews
          </a>
        </div>
      </Section>

      {/* Why Choose Local */}
      <Section 
        title="Why Choose a Local Wells Window Cleaner?" 
        subtitle="The benefits of working with a BA5-based service"
        spacing="relaxed"
        animationDelay={400}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
              <span className="text-2xl">🏘️</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Know Your Area</h4>
            <p className="text-sm text-white/70">Familiar with Wells properties, from Cathedral Green period homes to modern developments</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Quick Response</h4>
            <p className="text-sm text-white/70">Based locally means faster service and flexible scheduling for Wells residents</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Community Trust</h4>
            <p className="text-sm text-white/70">Recommended by your Wells neighbors and local businesses</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
              <span className="text-2xl">🌧️</span>
            </div>
            <h4 className="font-semibold text-white mb-2">Weather Wise</h4>
            <p className="text-sm text-white/70">We know Wells weather patterns and work around them efficiently</p>
          </div>
        </div>
      </Section>

      {/* Service Routes */}
      <Section 
        title="Wells Service Schedule" 
        subtitle="Regular routes throughout BA5"
        spacing="relaxed"
        animationDelay={500}
      >
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-white mb-6">Our Wells Routes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-white mb-3">Monday & Tuesday</h4>
                <p className="text-sm text-white/80">Wells city centre, Cathedral Green area, Market Place, High Street</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Wednesday</h4>
                <p className="text-sm text-white/80">Keward, Strawberry Way, Portway, residential estates</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Thursday</h4>
                <p className="text-sm text-white/80">Coxley, Wookey, Haybridge, outer villages</p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-3">Friday</h4>
                <p className="text-sm text-white/80">Commercial properties, schools, business premises</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-200">
                <strong>Note:</strong> We&apos;re in Wells every week! Flexible scheduling available to suit your needs.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section spacing="generous">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-12 backdrop-blur-sm text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join 500+ Happy Wells Customers
          </h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
            Get sparkling clean windows with Wells&apos; most trusted cleaning service. 
            Free quotes, competitive prices, and a service you can rely on.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/get-in-touch?area=wells-ba5" variant="primary" className="text-lg px-8 py-4">
              Get Your Wells Quote
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
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Covering all BA5 postcodes
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Fully insured local service
            </span>
          </div>
        </div>
      </Section>
    </div>
  )
}