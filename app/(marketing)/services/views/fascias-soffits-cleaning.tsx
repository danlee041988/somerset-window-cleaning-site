import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import { ServicePageLayout } from './components/service-page-layout'

export const metadata = {
  title: 'Fascias & Soffits Cleaning Somerset | Brighten Exterior PVC',
  description:
    'Refresh tired fascias and soffits with gentle exterior cleaning across Somerset. Remove staining, algae, and weathering safely.',
}

const FAQS = [
  {
    question: 'What finish can I expect after cleaning?',
    answer:
      'We brighten the PVC back towards its original colour by breaking down grime, algae, and traffic film. Stubborn staining is pre-treated before rinsing.',
  },
  {
    question: 'Do you need ladders or scaffolding?',
    answer:
      'Most fascia and soffit cleans are completed from the ground using telescopic poles and low-pressure systems. We organise access platforms when properties require it.',
  },
  {
    question: 'Will you protect nearby planting and surfaces?',
    answer:
      'Yes. We sheet or dampen surrounding areas and use PVC-safe products only. Rinsing is done with pure water so no residue is left behind.',
  },
  {
    question: 'Can you combine this with gutter clearing?',
    answer:
      'Absolutely. Many customers pair fascia cleaning with gutter clearing or window cleaning to refresh the exterior in one visit.',
  },
]

export default function FasciasSoffitsCleaningPage() {
  const service = servicesData.find((entry) => entry.slug === 'fascias-soffits-cleaning')
  if (!service) {
    throw new Error('Fascias & soffits service data missing')
  }

  return (
    <ServicePageLayout
      service={service}
      hero={{
        kicker: 'Refresh the frontage',
        heading: 'Fascias & soffits cleaning across Somerset',
        intro:
          'Lift years of weathering from PVC trims and boards with a careful clean that restores kerb appeal without harsh pressure.',
        highlights: [
          'PVC-safe cleaning chemistry',
          'Detailing around joints and corners',
          'Combine with gutter or window cleaning',
        ],
        imageSrc: SERVICE_IMAGES.fascias || '/images/photos/DJI_0045.JPG',
        imageAlt: 'Technician cleaning exterior fascias with soft brush',
      }}
      faqs={FAQS}
      bookingHref="/book-appointment?service=fascias-soffits-cleaning"
      bookingLabel="Book fascia cleaning"
    />
  )
}
