import { Metadata } from 'next'
import BookAppointmentPageClient from '@/components/BookAppointmentPageClient'

export const metadata: Metadata = {
  title: 'Request A Quote | Somerset Window Cleaning Services',
  description:
    'Tell us about your property and the services you need. We\'ll follow up within one working day to confirm pricing and arrange your Somerset Window Cleaning visit.',
  keywords:
    'Somerset window cleaning quote, window cleaning enquiry Somerset, gutter cleaning quote Somerset, Somerset Window Cleaning contact',
  alternates: {
    canonical: '/book-appointment',
  },
}

interface BookAppointmentPageProps {
  searchParams?: {
    service?: string
    address?: string
    intent?: string
    postcode?: string
  }
}

export default function BookAppointmentPage({ searchParams }: BookAppointmentPageProps) {
  const defaultAddress = searchParams?.address || ''
  const defaultPostcode = searchParams?.postcode || ''

  return (
    <BookAppointmentPageClient
      defaultAddress={defaultAddress}
      defaultPostcode={defaultPostcode}
    />
  )
}
