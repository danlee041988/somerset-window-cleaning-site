import Section from '@/components/Section'
import InteractiveServiceCard from '@/components/InteractiveServiceCard'
import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'

export const metadata = {
  title: 'Our Exterior Cleaning Services | Somerset Window Cleaning',
  description: 'Professional window, gutter, conservatory, solar panel & commercial cleaning across Somerset. Advanced equipment, expert techniques, guaranteed results.'
}

export default function ServicesPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Our Exterior Cleaning Services" subtitle="Professional cleaning solutions with advanced equipment and expert techniques.">
        <p className="mb-12 max-w-prose text-white/80 text-lg leading-relaxed">
          Transform your property with our comprehensive cleaning services. Using state-of-the-art equipment and proven techniques, we deliver exceptional results that protect and enhance your investment.
        </p>
        
        {/* Enhanced interactive service grid */}
        <div className="services-equal-height gap-6 md:gap-8 lg:gap-6">
          {servicesData.map((service) => {
            // Map service titles to image sources
            const imageMap: Record<string, string> = {
              'Window Cleaning': SERVICE_IMAGES.window || '/photos/photo06.jpg',
              'Gutter Clearing': SERVICE_IMAGES.gutter_clearing || '/photos/photo07.jpg', 
              'Conservatory Roof Cleaning': SERVICE_IMAGES.conservatory || '/photos/photo08.jpg',
              'Solar Panel Cleaning': SERVICE_IMAGES.solar || '/photos/photo09.jpg',
              'Fascias & Soffits Cleaning': SERVICE_IMAGES.fascias || '/photos/photo10.jpg',
              'External Commercial Cleaning': SERVICE_IMAGES.commercial || '/photos/photo11.jpg'
            }
            
            return (
              <div key={service.title} className="flex">
                <InteractiveServiceCard
                  title={service.title}
                  description={service.description}
                  longDescription={service.longDescription}
                  imageSrc={imageMap[service.title]}
                  imageAlt={`${service.title} - Somerset Window Cleaning`}
                  benefits={service.benefits}
                  price={service.price}
                  ctaText={service.ctaText}
                  ctaHref={service.ctaHref}
                  specialty={service.specialty}
                />
              </div>
            )
          })}
        </div>
        
        {/* Professional Service Features */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Why Choose Somerset Window Cleaning?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Uniformed Staff */}
            <div className="text-center p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Uniformed Staff</h4>
              <p className="text-sm text-white/70">Professional appearance with clearly identifiable Somerset Window Cleaning uniforms for your peace of mind.</p>
            </div>

            {/* Sign-written Vans */}
            <div className="text-center p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707L16 7.586A1 1 0 0015.414 7H14z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Sign-written Vans</h4>
              <p className="text-sm text-white/70">All vehicles are professionally sign-written and easily identifiable, so you know exactly who&apos;s on your property.</p>
            </div>

            {/* Text Reminders */}
            <div className="text-center p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Text Reminders</h4>
              <p className="text-sm text-white/70">Convenient text message reminders before each visit, so you&apos;re always informed about scheduled cleaning.</p>
            </div>

            {/* Online Payments */}
            <div className="text-center p-6 rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-red/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Online Payments</h4>
              <p className="text-sm text-white/70">Secure online payment options for your convenience. Pay easily via card, bank transfer, or digital wallet.</p>
            </div>
          </div>
        </div>


        {/* Call to action section */}
        <div className="mt-16 text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">
              Need a custom quote or multiple services?
            </h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Get a personalized quote for your specific needs. We offer package deals for multiple services and can create a maintenance schedule that works for you.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/get-in-touch"
                className="inline-flex items-center justify-center rounded-md px-8 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed bg-[var(--brand-red)] text-white hover:opacity-90 active:scale-95 focus:ring-brand-red"
              >
                Get Custom Quote
              </a>
              <a
                href="tel:01458860339"
                className="inline-flex items-center justify-center rounded-md px-8 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white border border-white/20"
              >
                Call 01458 860339
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
