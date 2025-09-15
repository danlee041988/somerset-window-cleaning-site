import Section from '@/components/Section'
import UniformServiceCard from '@/components/UniformServiceCard'
import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'

export const metadata = {
  title: 'Our Services | Somerset Window Cleaning',
  description: 'Professional window, gutter, conservatory, solar panel & commercial cleaning across Somerset. Advanced equipment, expert techniques, guaranteed results.'
}

export default function ServicesPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Our Services" subtitle="Professional cleaning solutions with advanced equipment and expert techniques.">
        <p className="mb-12 max-w-prose text-white/80 text-lg leading-relaxed">
          Transform your property with our comprehensive cleaning services. Using state-of-the-art equipment and proven techniques, we deliver exceptional results that protect and enhance your investment.
        </p>
        
        {/* Uniform service grid with consistent sizing */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
              <UniformServiceCard
                key={service.title}
                title={service.title}
                description={service.description}
                longDescription={service.longDescription}
                imageSrc={imageMap[service.title]}
                imageAlt={`${service.title} - Somerset Window Cleaning`}
                benefits={service.benefits}
                price={service.price}
                frequency={service.frequency}
                specialty={service.specialty}
                ctaText={service.ctaText}
                ctaHref={service.ctaHref}
              />
            )
          })}
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
                href="/quote"
                className="inline-flex items-center justify-center rounded-md px-8 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed bg-[var(--brand-red)] text-white hover:opacity-90 active:scale-95 focus:ring-brand-red"
              >
                Get Custom Quote
              </a>
              <a
                href="/get-in-touch"
                className="inline-flex items-center justify-center rounded-md px-8 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white border border-white/20"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
