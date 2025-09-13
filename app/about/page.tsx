import Section from '@/components/Section'

export const metadata = {
  title: 'About Somerset Window Cleaning | Trusted Local Experts',
  description: 'Learn about Somerset Window Cleaning—your trusted local experts in professional window, gutter, and fascia cleaning services.'
}

export default function AboutPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Somerset Window Cleaning: Your Local Exterior Cleaning Experts" subtitle="Professional, reliable service for homes and businesses across Somerset.">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="prose prose-invert max-w-none text-white/80">
            <p>We’re a Somerset-based team delivering expert residential and commercial window, gutter, and fascia cleaning. Customers choose us for dependable service, clear communication, and results that make properties shine.</p>
            <p>We use safe, modern methods to protect your glass, frames, and exteriors while achieving a spotless finish. Fully insured and DBS checked, with flexible booking options to suit your schedule.</p>
            <p>Areas we cover include Taunton, Bridgwater, Yeovil, Weston‑super‑Mare, and surrounding towns.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src="/photos/photo12.jpg" alt="On-site work" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <img src="/photos/photo05.jpg" alt="Clean windows close-up" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <img src="/photos/photo06.jpg" alt="Conservatory cleaning" className="aspect-[4/3] w-full rounded-lg object-cover" />
            <img src="/photos/photo02.jpg" alt="Commercial property" className="aspect-[4/3] w-full rounded-lg object-cover" />
          </div>
        </div>
      </Section>
    </div>
  )
}
