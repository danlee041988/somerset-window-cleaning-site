import Section from '@/components/Section'
import ServiceCard from '@/components/ServiceCard'
import { SERVICE_IMAGES } from '@/content/image-manifest'

export const metadata = {
  title: 'Services',
  description: 'Professional window, gutter, fascia, conservatory, and solar panel cleaning across Somerset for homes and businesses.'
}

export default function ServicesPage() {
  return (
    <div className="py-16 md:py-20">
      <Section title="Our services" subtitle="High standards, safe methods, and clear results every time.">
        <p className="mb-8 max-w-prose text-white/80">Professional exterior cleaning for homes and businesses across Somerset. We use safe, modern methods for a spotless finish and clear communication from quote to job completion.</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            title="Window Cleaning"
            imageSrc={SERVICE_IMAGES.window || '/photos/photo06.jpg'}
            description="Frames, sills and glass — interior and exterior options. Pure water for a streak‑free, spot‑free finish."
            bullets={[
              '4‑ or 8‑weekly; ad hoc available (additional cost)',
              'Frames & sills included',
              'No need to be home',
              'Satisfaction guarantee',
            ]}
          />
          <ServiceCard
            title="Gutter Clearing"
            imageSrc={SERVICE_IMAGES.gutter || '/photos/photo07.jpg'}
            description="High‑reach vacuum systems clear leaves and debris to help prevent overflows and damp."
            bullets={[
              'Ground‑level, safe methods',
              'Photos available on request',
              'Fully insured',
            ]}
          />
          <ServiceCard
            title="Conservatory Roof Cleaning"
            imageSrc={SERVICE_IMAGES.conservatory || '/photos/photo08.jpg'}
            description="Gentle, effective cleaning of roofs and panels to restore clarity without damage."
            bullets={[
              'Non‑abrasive, careful methods',
              'Panels, frames & roof',
              'Protects seals & coatings',
            ]}
          />
          <ServiceCard
            title="Solar Panel Cleaning"
            imageSrc={SERVICE_IMAGES.solar || '/photos/photo09.jpg'}
            description="Non‑abrasive, deionised water protects coatings and supports panel efficiency."
            bullets={[
              'Deionised water only',
              'Safe access methods',
              'Efficiency‑minded care',
            ]}
          />
          <ServiceCard
            title="Fascias & Soffits Cleaning"
            imageSrc={SERVICE_IMAGES.fascias || '/photos/photo10.jpg'}
            description="Lift kerb appeal with careful PVC cleaning around fascias, soffits and trims."
            bullets={[
              'Brightens exterior PVC',
              'Great paired with window or gutter service',
            ]}
          />
          <ServiceCard
            title="External Commercial Cleaning"
            imageSrc={SERVICE_IMAGES.commercial || '/photos/photo11.jpg'}
            description="Shops, offices and managed properties — flexible scheduling and safe methods."
            bullets={[
              'Regular schedules available',
              'Early/late slots on request',
              'RAMS available',
            ]}
          />
        </div>
      </Section>
    </div>
  )
}
