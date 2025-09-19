import Section from '@/components/ui/Section'
import Image from 'next/image'

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
            <Image src="/images/photos/DJI_0045.JPG" alt="Somerset Window Cleaning team working on site" className="aspect-[4/3] w-full rounded-lg object-cover" width={400} height={300} />
            <Image src="/images/photos/DJI_0064.JPG" alt="Close-up of sparkling windows after cleaning" className="aspect-[4/3] w-full rounded-lg object-cover" width={400} height={300} />
            <Image src="/images/photos/DJI_0052.JPG" alt="Conservatory roof cleaning in progress" className="aspect-[4/3] w-full rounded-lg object-cover" width={400} height={300} />
            <Image src="/images/photos/DJI_0092.JPG" alt="Commercial property with freshly cleaned exterior" className="aspect-[4/3] w-full rounded-lg object-cover" width={400} height={300} />
          </div>
        </div>
      </Section>

    </div>
  )
}
