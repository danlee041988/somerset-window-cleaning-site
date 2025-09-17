import { Metadata } from 'next'
import Section from '@/components/Section'
import BookingForm from '@/components/BookingForm'

export const metadata: Metadata = {
  title: 'Book Appointment | Somerset Window Cleaning Services',
  description: 'Book your professional window cleaning appointment online. Choose your preferred date, time, and service with Somerset Window Cleaning. Same-day response guaranteed.',
  keywords: 'book window cleaner, appointment booking, Somerset window cleaning, schedule service, online booking, appointment'
}

interface BookAppointmentPageProps {
  searchParams?: {
    service?: string
    address?: string
  }
}

export default function BookAppointmentPage({ searchParams }: BookAppointmentPageProps) {
  const defaultService = searchParams?.service || ''
  const defaultAddress = searchParams?.address || ''

  return (
    <div className="py-16 md:py-20">
      <Section 
        title="Book Your Appointment" 
        subtitle="Schedule professional window cleaning services at your convenience"
      >
        {/* Key Benefits */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Quick Response</h3>
            <p className="text-sm text-white/70">Appointment confirmation within 4 hours during business hours</p>
          </div>

          <div className="text-center p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Professional Service</h3>
            <p className="text-sm text-white/70">Fully insured, uniformed team with professional equipment</p>
          </div>

          <div className="text-center p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Transparent Pricing</h3>
            <p className="text-sm text-white/70">No hidden fees, clear pricing with detailed quotations</p>
          </div>
        </div>

        {/* Booking Form */}
        <BookingForm 
          defaultService={defaultService}
          defaultAddress={defaultAddress}
        />

        {/* Business Hours Info */}
        <div className="mt-12 p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Business Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-white mb-2">Service Hours</h4>
                <div className="space-y-1 text-sm text-white/80">
                  <div>Monday - Friday: 9:00 AM - 4:00 PM</div>
                  <div>Saturday: 9:00 AM - 2:00 PM</div>
                  <div className="text-red-400">Sunday: Closed</div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-white mb-2">Contact</h4>
                <div className="space-y-1 text-sm text-white/80">
                  <div>📞 <a href="tel:01458860339" className="hover:text-white">01458 860 339</a></div>
                  <div>📧 <a href="mailto:info@somersetwindowcleaning.co.uk" className="hover:text-white">info@somersetwindowcleaning.co.uk</a></div>
                  <div>📍 Wells, Somerset BA5</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Areas */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-white mb-4">Service Areas</h3>
          <p className="text-white/80 mb-6">
            We provide professional window cleaning services across Somerset and surrounding areas including:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Wells BA5', 'Glastonbury BA6', 'Street BA16', 'Cheddar BS27', 
              'Axbridge BS26', 'Weston-super-Mare BS23', 'Bridgwater TA6', 
              'Burnham-on-Sea TA8', 'Taunton TA2'
            ].map((area) => (
              <span 
                key={area}
                className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm border border-white/20"
              >
                {area}
              </span>
            ))}
          </div>
          <p className="text-xs text-white/60 mt-4">
            Don&apos;t see your area? Contact us - we may be able to arrange special service.
          </p>
        </div>
      </Section>
    </div>
  )
}