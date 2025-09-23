import { SERVICE_IMAGES } from '@/content/image-manifest'
import { servicesData } from '@/content/services-data'
import { ServicePageLayout } from './components/service-page-layout'

export const metadata = {
  title: 'Gutter Clearing Somerset | Safe Ground-Level Vacuum Cleaning',
  description:
    'Protect your property with professional gutter clearing across Somerset. High-reach vacuum systems and optional photo/video documentation keep rainwater moving without ladders.',
}

const FAQS = [
  {
    question: 'How often should gutters be cleared?',
    answer:
      'We recommend at least once a year, and twice if your property sits under trees. Clear gutters prevent damp, overflowing, and costly repairs.',
  },
  {
    question: 'Do you use ladders to clear gutters?',
    answer:
      'No. We work safely from the ground using commercial-grade vacuum systems and telescopic poles that reach over conservatories and extensions.',
  },
  {
    question: 'Can you show what has been removed?',
    answer:
      'Yes. On request we capture before/after photos or a short inspection video so you can see the gutter runs are clear.',
  },
  {
    question: 'Will the service affect my fascias or paintwork?',
    answer:
      'We use soft brush attachments and controlled suction so the guttering and fascias are protected throughout the clean.',
  },
]

export default function GutterClearingPage() {
  const service = servicesData.find((entry) => entry.slug === 'gutter-clearing')
  if (!service) {
    throw new Error('Gutter clearing service data missing')
  }

  return (
    <ServicePageLayout
      service={service}
      hero={{
        kicker: 'Prevent water damage',
        heading: 'Professional gutter clearing across Somerset',
        intro:
          'Camera-checked gutter clearing that keeps rainwater moving. We remove debris from every gutter run and can document each visit with photos or video on request.',
        highlights: [
          'Ground-level vacuum technology',
          'Reach over conservatories and extensions',
          'Photo/video evidence on request',
        ],
        imageSrc: SERVICE_IMAGES.gutter || '/images/photos/Gutter Clearing.jpg',
        imageAlt: 'Technician using high reach gutter vacuum',
      }}
      faqs={FAQS}
      bookingHref="/book-appointment?service=gutter-clearing&intent=quote"
      bookingLabel="Request gutter quote"
    />
  )
}
