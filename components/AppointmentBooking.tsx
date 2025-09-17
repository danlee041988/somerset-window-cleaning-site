"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { validateAddress, type AddressValidationResult } from '@/lib/google-maps'
import { 
  getAvailableSlots, 
  bookAppointment, 
  type BookingRequest, 
  type AvailableSlot,
  CALENDAR_CONFIG 
} from '@/lib/google-calendar'
import { analytics } from '@/lib/analytics'

interface BookingFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  propertyAddress: string
  serviceType: string
  preferredDate: string
  preferredTime: string
  specialRequirements?: string
}

interface AppointmentBookingProps {
  defaultService?: string
  defaultAddress?: string
  className?: string
}

export default function AppointmentBooking({ 
  defaultService = '', 
  defaultAddress = '', 
  className = '' 
}: AppointmentBookingProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<BookingFormData>({
    defaultValues: {
      serviceType: defaultService,
      propertyAddress: defaultAddress,
    }
  })

  const [step, setStep] = React.useState<'form' | 'slots' | 'confirmation'>('form')
  const [addressValidation, setAddressValidation] = React.useState<AddressValidationResult | null>(null)
  const [availableSlots, setAvailableSlots] = React.useState<AvailableSlot[]>([])
  const [selectedSlot, setSelectedSlot] = React.useState<AvailableSlot | null>(null)
  const [bookingResult, setBookingResult] = React.useState<any>(null)
  const [validatingAddress, setValidatingAddress] = React.useState(false)
  const [loadingSlots, setLoadingSlots] = React.useState(false)

  const selectedService = watch('serviceType')
  const propertyAddress = watch('propertyAddress')

  // Validate address when it changes
  React.useEffect(() => {
    const validatePropertyAddress = async () => {
      if (propertyAddress && propertyAddress.length > 10) {
        setValidatingAddress(true)
        try {
          const result = await validateAddress(propertyAddress)
          setAddressValidation(result)
          
          if (!result.inServiceArea) {
            setError('propertyAddress', {
              type: 'manual',
              message: 'This address is outside our current service area. Contact us for special arrangements.'
            })
          } else {
            clearErrors('propertyAddress')
          }
        } catch (error) {
          console.error('Address validation error:', error)
        } finally {
          setValidatingAddress(false)
        }
      }
    }

    const timeoutId = setTimeout(validatePropertyAddress, 500)
    return () => clearTimeout(timeoutId)
  }, [propertyAddress, setError, clearErrors])

  const getServiceDuration = (serviceType: string): number => {
    return CALENDAR_CONFIG.serviceTypes[serviceType as keyof typeof CALENDAR_CONFIG.serviceTypes]?.duration || 120
  }

  const onSubmit = async (data: BookingFormData) => {
    if (step === 'form') {
      // Validate address before proceeding
      if (!addressValidation?.inServiceArea) {
        setError('propertyAddress', {
          type: 'manual',
          message: 'Please enter a valid address within our service area'
        })
        return
      }

      // Load available slots
      setLoadingSlots(true)
      try {
        const startDate = new Date()
        const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
        
        const slots = await getAvailableSlots(
          data.serviceType,
          startDate.toISOString(),
          endDate.toISOString()
        )
        
        setAvailableSlots(slots)
        setStep('slots')
        
        // Track progression to slot selection
        analytics.trackCustomEvent('booking_form_completed', 'Appointments', data.serviceType, 1)
      } catch (error) {
        console.error('Error loading slots:', error)
        setError('serviceType', {
          type: 'manual',
          message: 'Unable to load available appointments. Please try again.'
        })
      } finally {
        setLoadingSlots(false)
      }
    } else if (step === 'slots' && selectedSlot) {
      // Book the appointment
      try {
        const bookingRequest: BookingRequest = {
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          serviceType: data.serviceType,
          propertyAddress: data.propertyAddress,
          preferredDate: selectedSlot.dateTime.split('T')[0],
          preferredTime: selectedSlot.dateTime.split('T')[1].substring(0, 5),
          specialRequirements: data.specialRequirements,
          estimatedDuration: selectedSlot.duration,
        }

        const result = await bookAppointment(bookingRequest)
        setBookingResult(result)
        setStep('confirmation')
        
        if (result.success) {
          // Track successful booking
          analytics.trackCustomEvent('appointment_booked', 'Appointments', data.serviceType, 10)
        } else {
          // Track booking failure
          analytics.trackCustomEvent('booking_failed', 'Appointments', result.error || 'Unknown error', 0)
        }
      } catch (error) {
        console.error('Booking error:', error)
        setBookingResult({
          success: false,
          error: 'Unable to complete booking. Please try again or contact us directly.'
        })
        setStep('confirmation')
      }
    }
  }

  const formatSlotDate = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatSlotTime = (dateTime: string) => {
    const date = new Date(dateTime)
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }

  const goBack = () => {
    if (step === 'slots') {
      setStep('form')
      setAvailableSlots([])
      setSelectedSlot(null)
    } else if (step === 'confirmation') {
      setStep('form')
      setBookingResult(null)
      setSelectedSlot(null)
      setAvailableSlots([])
    }
  }

  if (step === 'confirmation') {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${className}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-red to-transparent" />
        
        <div className="p-8 text-center">
          {bookingResult?.success ? (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Appointment Booked!</h3>
              <p className="text-white/80 mb-6">
                Your appointment has been successfully scheduled. We'll send you a confirmation email shortly.
              </p>
              
              {bookingResult.confirmationCode && (
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <div className="text-sm text-white/70 mb-1">Confirmation Code</div>
                  <div className="text-lg font-bold text-brand-red">{bookingResult.confirmationCode}</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/80 mb-6">
                <div className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email confirmation sent</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                  </svg>
                  <span>Calendar invite included</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Booking Failed</h3>
              <p className="text-white/80 mb-6">
                {bookingResult?.error || 'Something went wrong. Please try again or contact us directly.'}
              </p>
            </>
          )}
          
          <button
            onClick={goBack}
            className="px-6 py-2 bg-gradient-to-r from-brand-red to-brand-red/90 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-brand-red/25 transition-all duration-300"
          >
            {bookingResult?.success ? 'Book Another Appointment' : 'Try Again'}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'slots') {
    return (
      <div className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${className}`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-red to-transparent" />
        
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={goBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h2 className="text-2xl font-bold text-white">Available Appointments</h2>
            <div></div>
          </div>

          {loadingSlots ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 mx-auto mb-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/80">Loading available appointments...</p>
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/80 mb-4">No available appointments found for the next 30 days.</p>
              <p className="text-white/60 text-sm">Please contact us directly to arrange a suitable time.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {availableSlots.slice(0, 12).map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                      selectedSlot === slot
                        ? 'border-brand-red bg-brand-red/20 shadow-lg shadow-brand-red/25'
                        : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-white font-medium mb-1">
                      {formatSlotDate(slot.dateTime)}
                    </div>
                    <div className="text-white/80 text-sm mb-2">
                      {formatSlotTime(slot.dateTime)} ({slot.duration} mins)
                    </div>
                    <div className="text-xs text-white/60">
                      {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)}
                    </div>
                  </button>
                ))}
              </div>

              {selectedSlot && (
                <div className="bg-white/10 rounded-lg p-4 mb-6">
                  <h4 className="text-white font-medium mb-2">Selected Appointment</h4>
                  <div className="text-white/80 text-sm">
                    {formatSlotDate(selectedSlot.dateTime)} at {formatSlotTime(selectedSlot.dateTime)}
                  </div>
                  <div className="text-white/60 text-xs mt-1">
                    Duration: {selectedSlot.duration} minutes
                  </div>
                </div>
              )}

              <button
                onClick={handleSubmit(onSubmit)}
                disabled={!selectedSlot || isSubmitting}
                className="w-full px-6 py-3 bg-gradient-to-r from-brand-red to-brand-red/90 text-white font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand-red/25 transition-all duration-300"
              >
                {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-red via-brand-red to-transparent" />
      
      <div className="p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent mb-3">
            Book an Appointment
          </h2>
          <p className="text-white/80">
            Schedule a consultation, quote, or service appointment with our professional team.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                placeholder="Your full name"
                {...register('customerName', { required: 'Name is required' })}
              />
              {errors.customerName && <p className="mt-1 text-xs text-red-400">{errors.customerName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                placeholder="your.email@example.com"
                {...register('customerEmail', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address'
                  }
                })}
              />
              {errors.customerEmail && <p className="mt-1 text-xs text-red-400">{errors.customerEmail.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                placeholder="07123 456789"
                {...register('customerPhone', { required: 'Phone number is required' })}
              />
              {errors.customerPhone && <p className="mt-1 text-xs text-red-400">{errors.customerPhone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Service Type *
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors"
                {...register('serviceType', { required: 'Please select a service' })}
              >
                <option value="">Select a service</option>
                <option value="consultation">Free Consultation (30 mins)</option>
                <option value="quote">Property Quote Visit (45 mins)</option>
                <option value="window-cleaning">Window Cleaning (2 hours)</option>
                <option value="gutter-clearing">Gutter Clearing (3 hours)</option>
                <option value="conservatory-cleaning">Conservatory Roof Cleaning (2.5 hours)</option>
                <option value="solar-panel-cleaning">Solar Panel Cleaning (1.5 hours)</option>
              </select>
              {errors.serviceType && <p className="mt-1 text-xs text-red-400">{errors.serviceType.message}</p>}
            </div>
          </div>

          {/* Property Address */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Property Address *
            </label>
            <div className="relative">
              <textarea
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors resize-none"
                placeholder="Full property address including postcode"
                {...register('propertyAddress', { required: 'Property address is required' })}
              />
              {validatingAddress && (
                <div className="absolute right-3 top-3">
                  <svg className="w-4 h-4 animate-spin text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              )}
            </div>
            {errors.propertyAddress && <p className="mt-1 text-xs text-red-400">{errors.propertyAddress.message}</p>}
            
            {/* Address Validation Results */}
            {addressValidation && (
              <div className={`mt-2 p-3 rounded-lg border text-sm ${
                addressValidation.inServiceArea
                  ? 'border-green-500/30 bg-green-500/10 text-green-400'
                  : 'border-orange-500/30 bg-orange-500/10 text-orange-400'
              }`}>
                <div className="flex items-center gap-2">
                  {addressValidation.inServiceArea ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  )}
                  <span>
                    {addressValidation.inServiceArea 
                      ? 'Address verified - within service area' 
                      : 'Address outside standard service area'
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-white/90 mb-2">
              Special Requirements
            </label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-white/20 bg-white/5 text-white placeholder-white/50 focus:border-brand-red focus:ring-2 focus:ring-brand-red/20 focus:outline-none transition-colors resize-none"
              placeholder="Any specific requirements, access instructions, or questions..."
              {...register('specialRequirements')}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || loadingSlots || !addressValidation?.inServiceArea}
            className="w-full px-6 py-3 bg-gradient-to-r from-brand-red to-brand-red/90 text-white font-medium rounded-lg disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-brand-red/25 transition-all duration-300"
          >
            {loadingSlots ? 'Loading...' : 'Find Available Appointments'}
          </button>
        </form>
      </div>
    </div>
  )
}