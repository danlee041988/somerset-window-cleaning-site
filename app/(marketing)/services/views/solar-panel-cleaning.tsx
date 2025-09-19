import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import { ServicePageLayout } from './components/service-page-layout'

export const metadata = {
  title: 'Solar Panel Cleaning Somerset | Protect Efficiency & Warranty',
  description:
    'Boost solar output with manufacturer-safe panel cleaning. Deionised water, soft tools, and performance checks across Somerset.',
}

const FAQS = [
  {
    question: 'How does cleaning improve solar performance?',
    answer:
      'Dirt, pollen, and bird waste can reduce output by up to 25%. Removing them lets more light reach the cells so you reclaim lost generation.',
  },
  {
    question: 'Will cleaning void my panel warranty?',
    answer:
      'No. We use manufacturer-approved soft tools and deionised water only. No detergents or pressure washing touched the panels.',
  },
  {
    question: 'How often should panels be cleaned?',
    answer:
      'Most arrays benefit from quarterly or bi-annual cleaning, especially in agricultural areas or near busy roads where films build quickly.',
  },
  {
    question: 'Can you access hard-to-reach arrays?',
    answer:
      'Yes. We survey each property and choose the safest method, from pole systems to harness or platform work where needed.',
  },
]

export default function SolarPanelCleaningPage() {
  const service = servicesData.find((entry) => entry.slug === 'solar-panel-cleaning')
  if (!service) {
    throw new Error('Solar panel cleaning service data missing')
  }

  return (
    <ServicePageLayout
      service={service}
      hero={{
        kicker: 'Protect your kilowatts',
        heading: 'Solar panel cleaning for maximum output',
        intro:
          'We keep solar arrays performing at their peak with gentle, deionised water cleaning and safety-first access plans.',
        highlights: [
          'Manufacturer-safe methodology',
          'Detailed performance checks',
          'Ideal for domestic and commercial arrays',
        ],
        imageSrc: SERVICE_IMAGES.solar || '/images/photos/Solar Panel .jpeg',
        imageAlt: 'Technician cleaning roof-mounted solar panels',
      }}
      faqs={FAQS}
      bookingHref="/book-appointment?service=solar-panel-cleaning"
      bookingLabel="Book solar cleaning"
    />
  )
}
