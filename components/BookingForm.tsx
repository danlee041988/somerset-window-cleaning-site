"use client"

import React from 'react'
import { useForm, useController } from 'react-hook-form'
import emailjs from '@emailjs/browser'
import ReCaptcha from './features/contact/ReCaptcha'
import SimpleAddressInput from './features/contact/SimpleAddressInput'
import { analytics } from '@/lib/analytics'
import {
  POSTCODE_PRIMARY_AREAS,
  findFrequencyForPostcode,
  type FrequencyLookupResult,
} from '@/content/route-schedule'

interface BookingFormData {
  first_name: string
  last_name: string
  customer_email: string
  customer_phone: string
  postcode: string
  property_address: string
  services: string[]
  service_frequency: string
  preferred_contact_method: ContactMethod
  bedroom_band: BedroomBand
  property_type: PropertyType
  has_extension: BooleanChoice
  has_conservatory: BooleanChoice
  preferred_date: string
  intent: IntentOption
  special_requirements?: string
  customer_type: 'new' | 'existing'
  submission_date?: string
  submission_time?: string
  website?: string
  recaptcha?: string
}

type BedroomBand = '2-3' | '4' | '5'
type PropertyType = 'detached' | 'semi' | 'terraced' | 'bungalow'
type IntentOption = 'book' | 'quote'
type ContactMethod = 'email' | 'phone'
type BooleanChoice = 'yes' | 'no'
type StepKey = 'contact' | 'property' | 'services'

type PriceLine = {
  label: string
  amount?: number
  note?: string
}

type DateOption = {
  id: string
  iso: string
  label: string
  matchLabel: string
}

type ServiceDetail = {
  priceLabel?: string
  frequencyLabel?: string
  secondary?: string
  bonusNote?: string
}

type StepCardProps = {
  index: number
  title: string
  description: string
  isActive: boolean
  isComplete: boolean
  locked?: boolean
  onOpen: () => void
  onContinue?: () => void
  onBack?: () => void
  continueDisabled?: boolean
  children: React.ReactNode
}

function StepCard({
  index,
  title,
  description,
  isActive,
  isComplete,
  locked = false,
  onOpen,
  onContinue,
  onBack,
  continueDisabled,
  children,
}: StepCardProps) {
  const statusLabel = locked ? 'Locked' : isComplete ? 'Completed' : isActive ? 'In progress' : 'Ready'

  return (
    <div className={`overflow-hidden rounded-3xl border ${isActive ? 'border-brand-red/60 bg-white/10' : 'border-white/10 bg-white/5'}`}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        onClick={() => {
          if (!locked) onOpen()
        }}
        disabled={locked}
      >
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">Step {index + 1}</span>
          <h3 className="mt-1 text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-white/60">{description}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] ${
            isComplete
              ? 'bg-emerald-500/20 text-emerald-300'
              : locked
              ? 'bg-white/5 text-white/40'
              : 'bg-white/10 text-white/70'
          }`}
        >
          {statusLabel}
        </span>
      </button>
      <div className={`border-t border-white/10 px-5 pb-6 pt-6 ${isActive ? 'space-y-6' : 'hidden'}`}>
        {children}
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-white/40 hover:text-white"
            >
              Back
            </button>
          ) : (
            <span />
          )}

          {onContinue ? (
            <button
              type="button"
              onClick={onContinue}
              disabled={continueDisabled}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                continueDisabled
                  ? 'border-white/10 text-white/40'
                  : 'border-brand-red/60 bg-brand-red/15 text-white hover:border-brand-red'
              }`}
            >
              Continue
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </div>
  )
}

const SERVICE_OPTIONS = [
  'Window Cleaning',
  'Gutter Clearing',
  'Conservatory Roof Cleaning',
  'Solar Panel Cleaning',
  'Fascias & Soffits Cleaning',
  'External Commercial Cleaning',
] as const

type ServiceName = (typeof SERVICE_OPTIONS)[number]

const SERVICE_SUMMARY: Record<(typeof SERVICE_OPTIONS)[number], string> = {
  'Window Cleaning': 'Pure water finish with frames, sills, and doors every visit.',
  'Gutter Clearing': 'High-reach vacuum clearing with camera inspection.',
  'Conservatory Roof Cleaning': 'Gentle treatment to restore clarity and seals.',
  'Solar Panel Cleaning': 'Deionised water to keep arrays at peak efficiency.',
  'Fascias & Soffits Cleaning': 'Detail clean to brighten exterior PVC.',
  'External Commercial Cleaning': 'RAMS-ready exterior cleaning for businesses.',
}

const SERVICE_FREQUENCIES = [
  'Every 4 weeks (core window frequency)',
  'Every 8 weeks',
  'One-off clean',
  'Unsure - please advise',
] as const

const BEDROOM_OPTIONS: { id: BedroomBand; label: string; description: string }[] = [
  { id: '2-3', label: '2-3 bedrooms', description: 'Standard semis, terraces, and bungalows.' },
  { id: '4', label: '4 bedrooms', description: 'Larger semis or detached homes.' },
  { id: '5', label: '5+ bedrooms', description: 'Large detached or extended properties.' },
]

const PROPERTY_TYPES: { id: PropertyType; label: string; description: string; attached: boolean }[] = [
  { id: 'detached', label: 'Detached', description: 'No shared walls.', attached: false },
  { id: 'semi', label: 'Semi-detached', description: 'One shared wall.', attached: false },
  { id: 'terraced', label: 'Terraced / End terrace', description: 'Attached property (add £5).', attached: true },
  { id: 'bungalow', label: 'Bungalow / Flat', description: 'Single level with easy access.', attached: false },
]

const CONTACT_METHOD_OPTIONS: { id: ContactMethod; label: string; description: string }[] = [
  {
    id: 'email',
    label: 'Email updates',
    description: 'We will confirm details and send reminders to your email address.',
  },
  {
    id: 'phone',
    label: 'Phone call',
    description: 'Prefer a call back? We will ring the number you provide.',
  },
]

const YES_NO_OPTIONS: { id: BooleanChoice; label: string; description: string }[] = [
  { id: 'no', label: 'No', description: 'Not applicable or none on the property.' },
  { id: 'yes', label: 'Yes', description: 'Please allow for additional access/cleaning.' },
]

const WINDOW_BASE_PRICE: Record<BedroomBand, number> = {
  '2-3': 25,
  '4': 30,
  '5': 35,
}

const PROPERTY_TYPE_ADJUSTMENT: Record<PropertyType, number> = {
  detached: 0,
  semi: 0,
  terraced: 5,
  bungalow: 0,
}

const GUTTER_CLEAN_PRICE = 80
const FASCIA_SOFT_PRICE = 100

const GO_CARDLESS_URL = process.env.NEXT_PUBLIC_GOCARDLESS_PAYMENT_URL || ''
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_booking_form'

const EMPTY_SERVICES: string[] = []
const MAX_DATES_PER_MATCH = 4

const BANK_HOLIDAYS = new Set([
  '2025-05-05',
  '2025-05-26',
  '2025-08-25',
  '2025-12-25',
  '2025-12-26',
  '2026-01-01',
  '2026-04-03',
  '2026-04-06',
  '2026-05-04',
  '2026-05-25',
  '2026-08-31',
  '2026-12-25',
  '2026-12-28',
])

const adjustForBankHoliday = (iso: string): string => {
  let date = new Date(`${iso}T00:00:00Z`)
  while (date.getUTCDay() === 0 || date.getUTCDay() === 6 || BANK_HOLIDAYS.has(date.toISOString().split('T')[0])) {
    date = new Date(date.getTime() + 24 * 60 * 60 * 1000)
  }
  return date.toISOString().split('T')[0]
}

const getTodayIso = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatDateForDisplay = (iso: string): string => {
  const date = new Date(`${iso}T00:00:00Z`)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const generateFallbackDateOptions = (count = 4): DateOption[] => {
  const today = new Date(`${getTodayIso()}T00:00:00Z`)
  const options: DateOption[] = []
  let cursor = new Date(today.getTime())

  while (options.length < count) {
    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)
    const iso = adjustForBankHoliday(cursor.toISOString().split('T')[0])
    if (options.some((option) => option.iso === iso)) {
      continue
    }
    options.push({
      id: `fallback-${options.length}`,
      iso,
      label: `${formatDateForDisplay(iso)} · Somerset route`,
      matchLabel: 'Somerset route',
    })
    cursor = new Date(`${iso}T00:00:00Z`)
  }

  return options
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value)

interface PricingSummary {
  lines: PriceLine[]
  total: number
  totalFormatted: string
  breakdownText: string
  discountNote?: string
}

export default function BookingForm({
  defaultService = '',
  defaultAddress = '',
  defaultIntent = 'book',
  defaultPostcode = '',
  className = '',
}: {
  defaultService?: string
  defaultAddress?: string
  defaultIntent?: IntentOption
  defaultPostcode?: string
  className?: string
}) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    setValue,
    unregister,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    defaultValues: {
      first_name: '',
      last_name: '',
      customer_email: '',
      customer_phone: '',
      postcode: defaultPostcode ? defaultPostcode.toUpperCase() : '',
      property_address: defaultAddress || '',
      services: defaultService ? [defaultService] : [],
      service_frequency: 'Every 4 weeks (core window frequency)',
      bedroom_band: '2-3',
      property_type: 'semi',
      preferred_contact_method: 'email',
      has_extension: 'no',
      has_conservatory: 'no',
      preferred_date: '',
      intent: defaultIntent,
      customer_type: 'new',
    },
  })

  const { field: contactMethodField } = useController({
    name: 'preferred_contact_method',
    control,
    defaultValue: 'email',
  })

  const {
    name: preferredContactFieldName,
    value: preferredContactValue,
    onChange: setPreferredContactMethod,
    ref: preferredContactRef,
  } = contactMethodField

  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)
  const [formStarted, setFormStarted] = React.useState(false)
  const [frequencyMatch, setFrequencyMatch] = React.useState<FrequencyLookupResult | null>(null)
  const [coverageStatus, setCoverageStatus] = React.useState<'unknown' | 'covered' | 'outside'>('unknown')
  const [dateOptions, setDateOptions] = React.useState<DateOption[]>([])
  const [selectedDateId, setSelectedDateId] = React.useState<string>('')
  const [selectedDateLabel, setSelectedDateLabel] = React.useState<string>('')
  const [lastIntent, setLastIntent] = React.useState<IntentOption>(defaultIntent)
  const start = React.useRef<number>(Date.now())
  const firstNameInputRef = React.useRef<HTMLInputElement | null>(null)
  const lastNameInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (!PUBLIC_KEY) {
      console.error('EmailJS public key missing: configure NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to enable booking submissions')
      return
    }

    try {
      emailjs.init(PUBLIC_KEY)
      console.info('EmailJS initialised for booking form')
    } catch (error) {
      console.error('Booking form failed to initialise EmailJS:', error)
    }
  }, [])

  const handleEnterToFocus = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, nextRef: React.RefObject<HTMLInputElement>) => {
      if (event.key !== 'Enter') return
      event.preventDefault()
      nextRef.current?.focus()
    },
    [],
  )

  const selectedServices = watch('services') ?? EMPTY_SERVICES
  const customerType = watch('customer_type') || 'new'
  const postcodeValue = watch('postcode') || ''
  const postcodeProgressLength = React.useMemo(
    () => postcodeValue.replace(/[^A-Za-z0-9]/g, '').length,
    [postcodeValue],
  )
  const bedroomBand = watch('bedroom_band')
  const propertyType = watch('property_type')
  const preferredDateValue = watch('preferred_date')
  const intent = watch('intent') as IntentOption | undefined
  const currentIntent: IntentOption = intent || 'book'
  const firstNameValue = watch('first_name') || ''
  const lastNameValue = watch('last_name') || ''
  const customerEmailValue = watch('customer_email') || ''
  const customerPhoneValue = watch('customer_phone') || ''
  const preferredContactMethod = (preferredContactValue as ContactMethod) || 'email'
  const propertyAddressValue = watch('property_address') || ''
  const hasExtension = watch('has_extension') || 'no'
  const hasConservatory = watch('has_conservatory') || 'no'
  const serviceFrequencyValue = watch('service_frequency') || SERVICE_FREQUENCIES[0]
  const firstNameField = register('first_name', {
    required: 'First name is required',
    minLength: { value: 2, message: 'Please enter at least 2 characters' },
  })
  const lastNameField = register('last_name', {
    required: 'Last name is required',
    minLength: { value: 2, message: 'Please enter at least 2 characters' },
  })

  const stepOrder = React.useMemo<StepKey[]>(() => ['contact', 'property', 'services'], [])
  const [activeStep, setActiveStep] = React.useState<StepKey>('contact')

  const contactComplete = Boolean(
    firstNameValue &&
    lastNameValue &&
    customerEmailValue &&
    customerPhoneValue &&
    postcodeValue &&
    preferredContactMethod,
  )

  const propertyComplete = Boolean(
    propertyAddressValue &&
    bedroomBand &&
    propertyType &&
    hasExtension &&
    hasConservatory,
  )

  const propertyReady = propertyComplete

  const openStep = React.useCallback(
    (step: StepKey) => {
      if (step === 'property' && !contactComplete) return
      if (step === 'services' && !propertyComplete) return
      setActiveStep(step)
    },
    [contactComplete, propertyComplete],
  )

  const goToNextStep = React.useCallback(() => {
    const index = stepOrder.indexOf(activeStep)
    const next = stepOrder[index + 1]
    if (!next) return
    openStep(next)
  }, [activeStep, openStep, stepOrder])

  const goToPreviousStep = React.useCallback(() => {
    const index = stepOrder.indexOf(activeStep)
    const prev = stepOrder[index - 1]
    if (!prev) return
    setActiveStep(prev)
  }, [activeStep, stepOrder])

  type StepCardProps = {
    index: number
    title: string
    description: string
    isActive: boolean
    isComplete: boolean
    locked?: boolean
    onOpen: () => void
    onContinue?: () => void
    onBack?: () => void
    continueDisabled?: boolean
    children: React.ReactNode
  }

  const getServiceDetails = React.useCallback(
    (service: ServiceName): ServiceDetail => {
      if (!propertyReady) {
        return {
          priceLabel: 'Complete property details to see personalised pricing.',
          frequencyLabel: undefined,
          secondary: undefined,
          bonusNote: undefined,
        }
      }

      const includesGutter = selectedServices.includes('Gutter Clearing')
      const includesFascia = selectedServices.includes('Fascias & Soffits Cleaning')

      switch (service) {
        case 'Window Cleaning': {
          const base = WINDOW_BASE_PRICE[bedroomBand]
          const adjustment = PROPERTY_TYPE_ADJUSTMENT[propertyType]
          let estimate = base + adjustment
          const notes: string[] = []
          if (adjustment) notes.push('+£5 for attached frontage')
          if (hasExtension === 'yes') notes.push('Extension access included')
          if (hasConservatory === 'yes') notes.push('Conservatory glass noted')

          if (includesGutter && includesFascia) {
            return {
              priceLabel: 'Included with gutter & fascia bundle',
              frequencyLabel: serviceFrequencyValue,
              secondary: notes.length ? notes.join(' · ') : undefined,
              bonusNote: 'Bundle automatically removes the window clean charge.',
            }
          }

          return {
            priceLabel: `${formatCurrency(estimate)} per visit`,
            frequencyLabel: serviceFrequencyValue,
            secondary: notes.length ? notes.join(' · ') : undefined,
            bonusNote: undefined,
          }
        }
        case 'Gutter Clearing': {
          const notes: string[] = ['Photo report provided']
          if (hasExtension === 'yes') notes.push('Extension gutters covered')
          return {
            priceLabel: `${formatCurrency(GUTTER_CLEAN_PRICE)} per visit`,
            frequencyLabel: 'Cleaned alongside your window appointment',
            secondary: notes.join(' · '),
            bonusNote: includesFascia ? 'Pair with fascias for a complimentary window clean.' : undefined,
          }
        }
        case 'Fascias & Soffits Cleaning':
          return {
            priceLabel: `${formatCurrency(FASCIA_SOFT_PRICE)} per visit`,
            frequencyLabel: 'Scheduled with your booking',
            secondary: 'Full exterior PVC refresh',
            bonusNote: includesGutter ? 'Pair with gutter clearing for a complimentary window clean.' : undefined,
          }
        case 'Conservatory Roof Cleaning':
          return {
            priceLabel: hasConservatory === 'yes' ? 'Tailored on-site pricing' : 'Optional add-on',
            frequencyLabel: hasConservatory === 'yes' ? 'Completed during your booked visit' : undefined,
            secondary:
              hasConservatory === 'yes'
                ? 'Soft-wash approach keeps seals and glazing safe.'
                : 'Select if you would like us to restore the roof during the visit.',
            bonusNote: undefined,
          }
        case 'Solar Panel Cleaning':
          return {
            priceLabel: 'Performance-based quote',
            frequencyLabel: 'Completed on the same visit',
            secondary: 'Deionised water, warranty-safe.',
            bonusNote: undefined,
          }
        case 'External Commercial Cleaning':
          return {
            priceLabel: 'Tailored RAMS-backed proposal',
            frequencyLabel: undefined,
            secondary: 'Ideal for storefronts and estates.',
            bonusNote: undefined,
          }
        default:
          return {
            priceLabel: 'Custom quote',
            frequencyLabel: undefined,
            secondary: undefined,
            bonusNote: undefined,
          }
      }
    },
    [propertyReady, bedroomBand, propertyType, serviceFrequencyValue, hasExtension, hasConservatory, selectedServices],
  )

  const trackFormStart = React.useCallback(
    (context?: string) => {
      if (process.env.NODE_ENV === 'test') return
      if (!formStarted) {
        setFormStarted(true)
        const label = context || (selectedServices.length ? selectedServices.join(', ') : 'not_selected')
        analytics.formStart(label)
      }
    },
    [formStarted, selectedServices],
  )

  const handleServiceToggle = React.useCallback(
    (service: string) => {
      if (!propertyReady) {
        return
      }
      const current = new Set(selectedServices)
      if (current.has(service)) {
        current.delete(service)
      } else {
        current.add(service)
      }
      const updated = Array.from(current)
      setValue('services', updated, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
      if (updated.length > 0) {
        clearErrors('services')
      }
      trackFormStart(service)
    },
    [selectedServices, setValue, clearErrors, trackFormStart, propertyReady],
  )

  React.useEffect(() => {
    register('services', {
      validate: (value) => (value && value.length > 0) || 'Please choose at least one service',
    })
    register('preferred_date', {
      required: 'Select the date you would like us to visit',
    })

    return () => {
      unregister('services')
      unregister('preferred_date')
    }
  }, [register, unregister])

  React.useEffect(() => {
    const raw = postcodeValue.trim()
    const progressLength = postcodeProgressLength

    if (!raw || progressLength < 3) {
      setFrequencyMatch(null)
      setCoverageStatus('unknown')
      setDateOptions([])
      setSelectedDateId('')
      setSelectedDateLabel('')
      setValue('preferred_date', '', { shouldValidate: true })
      return
    }

    const frequency = findFrequencyForPostcode(raw)
    if (!frequency) {
      setFrequencyMatch(null)
      setCoverageStatus('outside')
      const fallback = generateFallbackDateOptions()
      setDateOptions(fallback)
      if (fallback.length > 0) {
        const first = fallback[0]
        setSelectedDateId(first.id)
        setSelectedDateLabel(first.label)
        setValue('preferred_date', first.iso, { shouldValidate: true })
      } else {
        setSelectedDateId('manual')
        setSelectedDateLabel('Manual scheduling required')
        setValue('preferred_date', 'Manual scheduling required', { shouldValidate: true })
      }
      clearErrors('preferred_date')
      return
    }

    setFrequencyMatch(frequency)
    setCoverageStatus('covered')

    const todayIso = getTodayIso()
    const options: DateOption[] = []
    frequency.matches.forEach((match, matchIndex) => {
      match.dates.slice(0, MAX_DATES_PER_MATCH).forEach((entry) => {
        const adjustedIso = adjustForBankHoliday(entry.iso)
        if (adjustedIso >= todayIso) {
          options.push({
            id: `${matchIndex}-${entry.iso}`,
            iso: adjustedIso,
            label: `${formatDateForDisplay(adjustedIso)} · ${match.areas}`,
            matchLabel: `${match.day} · ${match.areas}`,
          })
        }
      })
    })

    options.sort((a, b) => a.iso.localeCompare(b.iso))

    if (options.length === 0) {
      const fallback = generateFallbackDateOptions()
      setDateOptions(fallback)
      if (fallback.length > 0) {
        const first = fallback[0]
        setSelectedDateId(first.id)
        setSelectedDateLabel(first.label)
        setValue('preferred_date', first.iso, { shouldValidate: true })
        clearErrors('preferred_date')
      } else {
        setSelectedDateId('')
        setSelectedDateLabel('')
        setValue('preferred_date', '', { shouldValidate: true })
      }
      return
    }

    setDateOptions(options)

    const first = options[0]
    setSelectedDateId(first.id)
    setSelectedDateLabel(first.label)
    setValue('preferred_date', first.iso, { shouldValidate: true })
    clearErrors('preferred_date')

    clearErrors('postcode')
  }, [postcodeValue, postcodeProgressLength, setValue, clearErrors])

  const postcodeAreaName = React.useMemo(() => {
    if (!frequencyMatch) return ''
    const outwardCode = frequencyMatch.code.replace(/[^A-Z0-9]/g, '').toUpperCase()
    return POSTCODE_PRIMARY_AREAS[outwardCode] ?? `${outwardCode} area`
  }, [frequencyMatch])

  const coverageMatchLabel = React.useMemo(() => {
    if (!frequencyMatch || frequencyMatch.matches.length === 0) return ''
    const [primaryMatch] = frequencyMatch.matches
    return `${primaryMatch.day} · ${postcodeAreaName}`
  }, [frequencyMatch, postcodeAreaName])

  const serviceErrorMessage =
    errors.services && typeof errors.services === 'object' && 'message' in errors.services
      ? (errors.services as { message?: string }).message
      : undefined

  const hasDateSelection = !!selectedDateLabel && dateOptions.length > 0

  const buttonText = isSubmitting
    ? currentIntent === 'quote'
      ? 'Sending quote request…'
      : 'Booking appointment…'
    : currentIntent === 'quote'
    ? 'Request my quote'
    : hasDateSelection
    ? `Book ${selectedDateLabel}`
    : 'Book my appointment'

  const pricingSummary: PricingSummary | null = React.useMemo(() => {
    if (!selectedServices.length) return null

    const includesWindow = selectedServices.includes('Window Cleaning')
    const includesGutter = selectedServices.includes('Gutter Clearing')
    const includesFascia = selectedServices.includes('Fascias & Soffits Cleaning')

    const lines: PriceLine[] = []
    let total = 0
    let discountNote: string | undefined

    if (includesWindow) {
      const base = WINDOW_BASE_PRICE[bedroomBand]
      const adjustment = PROPERTY_TYPE_ADJUSTMENT[propertyType]
      let amount = base + adjustment
      let note: string | undefined

      if (includesGutter && includesFascia) {
        amount = 0
        note = 'Complimentary when gutter & fascia cleaning booked together.'
        discountNote = 'Window cleaning included free with gutter & fascia cleaning.'
      } else if (adjustment) {
        note = '+£5 for attached frontage.'
      }

      if (hasExtension === 'yes' || hasConservatory === 'yes') {
        const extra = 'Extension / conservatory access noted for setup.'
        note = note ? `${note} ${extra}` : extra
      }

      if (serviceFrequencyValue) {
        note = note ? `${note} · ${serviceFrequencyValue}` : serviceFrequencyValue
      }

      lines.push({ label: 'Window Cleaning', amount, note })
      total += amount
    }

    if (includesGutter) {
      lines.push({ label: 'Gutter Clearing', amount: GUTTER_CLEAN_PRICE })
      total += GUTTER_CLEAN_PRICE
    }

    if (includesFascia) {
      lines.push({ label: 'Fascia & Soffit Cleaning', amount: FASCIA_SOFT_PRICE })
      total += FASCIA_SOFT_PRICE
    }

    const handled = new Set(['Window Cleaning', 'Gutter Clearing', 'Fascias & Soffits Cleaning'])
    selectedServices.forEach((service) => {
      if (!handled.has(service)) {
        lines.push({ label: service, note: 'Priced on arrival for bespoke coverage.' })
      }
    })

    const totalFormatted = formatCurrency(total)
    const breakdownText = lines
      .map((line) => `${line.label}: ${line.amount !== undefined ? formatCurrency(line.amount) : 'Priced on arrival'}${line.note ? ` (${line.note})` : ''}`)
      .join('\n')

    return {
      lines,
      total,
      totalFormatted,
      breakdownText,
      discountNote,
    }
  }, [bedroomBand, propertyType, selectedServices, hasExtension, hasConservatory, serviceFrequencyValue])

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    if (token) {
      clearErrors('recaptcha')
      analytics.recaptchaComplete()
    }
  }

  const handleRecaptchaExpired = () => {
    setRecaptchaToken(null)
    setError('recaptcha', { type: 'manual', message: 'reCAPTCHA expired, please try again' })
    analytics.recaptchaError('expired')
  }

  React.useEffect(() => {
    const now = new Date()
    setValue('submission_date', now.toISOString().split('T')[0])
    setValue('submission_time', now.toTimeString().split(' ')[0])
  }, [setValue])

  React.useEffect(() => {
    if (defaultPostcode) {
      setValue('postcode', defaultPostcode.toUpperCase(), { shouldValidate: true, shouldDirty: true })
    }
  }, [defaultPostcode, setValue])

  const onSubmit = async (values: BookingFormData) => {
    if (values.website) return

    const elapsed = Date.now() - start.current
    if (elapsed < 2000) {
      setStatus('error')
      return
    }

    if (!values.services || values.services.length === 0) {
      setError('services', { type: 'manual', message: 'Please choose at least one service' })
      return
    }

    if (!values.postcode) {
      setError('postcode', { type: 'manual', message: 'Enter your postcode so we can align a window cleaning frequency' })
      return
    }

    const matchedFrequency = findFrequencyForPostcode(values.postcode)

    if (!matchedFrequency) {
      // Allow manual scheduling submissions when a postcode is outside automated routes.
      analytics.formError('postcode_manual_review', values.postcode)
    }

    clearErrors('postcode')

    if (!values.preferred_date) {
      setError('preferred_date', {
        type: 'manual',
        message: 'Select the date you would like us to visit',
      })
      return
    }

    if (!recaptchaToken) {
      setError('recaptcha', { type: 'manual', message: 'Please complete the reCAPTCHA verification' })
      return
    }

    const now = new Date()
    const customerName = `${values.first_name} ${values.last_name}`.trim()
    const preferredDateLabel = selectedDateLabel || (values.preferred_date ? formatDateForDisplay(values.preferred_date) : '')
    const bedroomLabel = BEDROOM_OPTIONS.find((option) => option.id === values.bedroom_band)?.label ?? values.bedroom_band
    const propertyTypeLabel =
      PROPERTY_TYPES.find((type) => type.id === values.property_type)?.label ?? values.property_type
    const frequencyTitle = matchedFrequency
      ? matchedFrequency.frequencyTitle
      : 'Manual scheduling required'
    const frequencyServiceDays = matchedFrequency
      ? matchedFrequency.matches.map((match) => `${match.day} · ${match.areas}`).join(' | ')
      : 'Outside automated route coverage'
    const serviceList = values.services.join(', ')
    const coverageLabel =
      coverageStatus === 'covered'
        ? 'Covered - automated scheduling available'
        : coverageStatus === 'outside'
        ? 'Outside - manual scheduling required'
        : 'Unknown'
    const extensionLabel = values.has_extension === 'yes' ? 'Yes' : 'No'
    const conservatoryLabel = values.has_conservatory === 'yes' ? 'Yes' : 'No'
    const customerTypeLabel = customerType === 'new' ? 'New Customer' : 'Existing Customer'

    const submittedAt = now.toLocaleString('en-GB')
    const submittedDate = now.toLocaleDateString('en-GB')
    const submittedTime = now.toLocaleTimeString('en-GB')

    const pricingLines = pricingSummary?.lines ?? []
    const pricingBreakdown = pricingSummary?.breakdownText ?? 'No pricing calculated'
    const pricingTotal = pricingSummary?.totalFormatted ?? 'Select services to see pricing'
    const pricingDiscount = pricingSummary?.discountNote ?? ''

    const summarySections = [
      'Customer Information:',
      `- Name: ${customerName}`,
      `- Email: ${values.customer_email}`,
      `- Phone: ${values.customer_phone}`,
      `- Customer Type: ${customerTypeLabel}`,
      '',
      'Property Details:',
      `- Address: ${values.property_address}`,
      `- Postcode: ${values.postcode.toUpperCase()}`,
      `- Bedrooms: ${bedroomLabel}`,
      `- Property Type: ${propertyTypeLabel}`,
      `- Extension: ${extensionLabel}`,
      `- Conservatory: ${conservatoryLabel}`,
      '',
      'Service Selection:',
      `- Services: ${serviceList}`,
      `- Frequency: ${values.service_frequency}`,
      `- Preferred Date: ${preferredDateLabel}`,
      `- Preferred Contact: ${values.preferred_contact_method}`,
      `- Intent: ${values.intent === 'quote' ? 'Quote request' : 'Booking request'}`,
      '',
      'Coverage & Scheduling:',
      `- Coverage: ${coverageLabel}`,
      `- Route Match: ${frequencyTitle}`,
      `- Service Days: ${frequencyServiceDays}`,
      `- Selected Slot: ${preferredDateLabel || 'Manual scheduling'}`,
      '',
      'Pricing Summary:',
      `- Total: ${pricingTotal}`,
      `- Notes: ${pricingDiscount || '—'}`,
      '',
      'Additional Requirements:',
      `${values.special_requirements?.trim() || 'None provided.'}`,
      '',
      'System Metadata:',
      `- Submission Time: ${submittedAt}`,
      `- reCAPTCHA Token: ${recaptchaToken}`,
    ]

    const summaryPlaintext = summarySections.join('\n')

    const templateParams = {
      to_email: 'info@somersetwindowcleaning.co.uk',
      name: customerName,
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.customer_email,
      phone: values.customer_phone,
      postcode: values.postcode.toUpperCase(),
      address: values.property_address,
      preferred_contact_method: values.preferred_contact_method,
      customer_type: values.customer_type,
      customer_type_field: customerTypeLabel,
      services: serviceList,
      services_json: JSON.stringify(values.services),
      service_frequency: values.service_frequency,
      bedroom_band: values.bedroom_band,
      bedroom_label: bedroomLabel,
      property_type: values.property_type,
      property_type_label: propertyTypeLabel,
      has_extension: values.has_extension,
      has_extension_label: extensionLabel,
      has_conservatory: values.has_conservatory,
      has_conservatory_label: conservatoryLabel,
      preferred_date: values.preferred_date,
      preferred_date_label: preferredDateLabel,
      intent: values.intent,
      intent_label: values.intent === 'quote' ? 'Quote request' : 'Booking request',
      special_requirements: values.special_requirements || 'None provided',
      frequency_match: frequencyTitle,
      frequency_service_days: frequencyServiceDays,
      coverage_status: coverageStatus,
      coverage_label: coverageLabel,
      selected_date_option_id: selectedDateId,
      selected_date_match_label: selectedDateLabel,
      pricing_total: pricingTotal,
      pricing_breakdown: pricingBreakdown,
      pricing_discount_note: pricingDiscount,
      pricing_lines_json: JSON.stringify(pricingLines),
      submitted_at: submittedAt,
      submitted_date: submittedDate,
      submitted_time: submittedTime,
      submission_date: values.submission_date || submittedDate,
      submission_time: values.submission_time || submittedTime,
      recaptcha_token: recaptchaToken,
      'g-recaptcha-response': recaptchaToken,
      elapsed_ms: `${elapsed}`,
      summary_plaintext: summaryPlaintext,
      raw_payload_json: JSON.stringify(
        {
          ...values,
          postcode: values.postcode.toUpperCase(),
          services: values.services,
          pricingSummary,
          coverageStatus,
          frequencyMatch,
          selectedDateLabel,
        },
        null,
        2,
      ),
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error('Missing EmailJS configuration. Please set NEXT_PUBLIC_EMAILJS_* env vars.')
      setStatus('error')
      return
    }

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
        publicKey: PUBLIC_KEY,
      })

      analytics.formSubmit({
        serviceType: values.services.join(', '),
        customerType: customerType,
        email: values.customer_email,
      })

      setLastIntent(values.intent)
      setStatus('success')
      setRecaptchaToken(null)
      reset()
      setFrequencyMatch(null)
      setCoverageStatus('unknown')
      setDateOptions([])
      setSelectedDateId('')
      setSelectedDateLabel('')
      clearErrors(['services', 'postcode', 'preferred_date'])
    } catch (error) {
      console.error('Booking form submission error:', error)
      analytics.formError('submission_failed', error instanceof Error ? error.message : 'Unknown error')
      setStatus('error')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  if (status === 'success') {
    const successTitle = lastIntent === 'quote' ? 'Quote request sent!' : 'Booking request sent!'
    const successBody =
      lastIntent === 'quote'
        ? 'Thank you for your request. We will align your postcode with the right window cleaning frequency, share the pricing summary, and get back to you within one working day to agree the best visit date.'
        : 'Thank you for your booking request. We will align your postcode with the right window cleaning frequency, double-check the schedule, and get back to you within one working day to confirm your visit.'

    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-4 text-2xl font-bold text-white">{successTitle}</h3>
        <p className="mb-6 text-white/80">{successBody}</p>
        <div className="grid gap-4 text-sm md:grid-cols-3">
          <div className="flex items-center justify-center gap-2 text-white/70">
            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Response within one working day
          </div>
          <div className="flex items-center justify-center gap-2 text-white/70">
            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Professional service
          </div>
          <div className="flex items-center justify-center gap-2 text-white/70">
            <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Fully insured team
          </div>
        </div>
        <div className="mt-6 space-y-4 text-sm text-white/80">
          <p>Prefer to pay automatically? Set up your Direct Debit once and every visit will settle through GoCardless.</p>
          {GO_CARDLESS_URL ? (
            <a
              href={GO_CARDLESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-red to-brand-red/90 px-5 py-3 font-semibold text-white shadow-lg shadow-brand-red/30 transition hover:shadow-xl hover:shadow-brand-red/40"
            >
              Complete GoCardless setup
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          ) : (
            <p className="text-xs text-white/50">Add your GoCardless link via NEXT_PUBLIC_GOCARDLESS_PAYMENT_URL to offer automatic payments.</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm ${className}`}>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-red via-brand-red to-transparent" />

      <div className="p-8">
        <div className="mb-8 text-center">
          <h2 className="mb-3 bg-gradient-to-r from-white to-white/90 bg-clip-text text-2xl font-bold text-transparent">
            Book an appointment
          </h2>
          <p className="text-white/80">
            Tell us the services, extras, and window cleaning frequency you prefer. We&apos;ll confirm the exact visit day and keep you updated every step.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <StepCard
            index={0}
            title="Your details"
            description="Tell us who to contact and how you'd like us to respond."
            isActive={activeStep === 'contact'}
            isComplete={contactComplete}
            onOpen={() => openStep('contact')}
            onContinue={contactComplete ? () => openStep('property') : undefined}
            continueDisabled={!contactComplete}
          >
            {/* Customer type */}
          {/* Contact info */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <svg className="h-5 w-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Contact information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">First name *</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  placeholder="Alex"
                  onFocus={() => trackFormStart()}
                  {...firstNameField}
                  ref={(element) => {
                    firstNameInputRef.current = element
                    firstNameField.ref(element)
                  }}
                  onKeyDown={(event) => handleEnterToFocus(event, lastNameInputRef)}
                />
                {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">Last name *</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  placeholder="Morgan"
                  onFocus={() => trackFormStart()}
                  {...lastNameField}
                  ref={(element) => {
                    lastNameInputRef.current = element
                    lastNameField.ref(element)
                  }}
                />
                {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">Email address *</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  placeholder="your.email@example.com"
                  {...register('customer_email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                />
                {errors.customer_email && <p className="mt-1 text-xs text-red-400">{errors.customer_email.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">Phone number *</label>
                <input
                  type="tel"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                  placeholder="07123 456789"
                  {...register('customer_phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^(\+44|0)[0-9\s-()]{10,}$/,
                      message: 'Please enter a valid UK phone number',
                    },
                  })}
                />
                {errors.customer_phone && <p className="mt-1 text-xs text-red-400">{errors.customer_phone.message}</p>}
              </div>

              <div className="md:col-span-2">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Preferred contact method</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <label
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                        preferredContactMethod === 'email'
                          ? 'border-brand-red/60 bg-brand-red/15 text-white'
                          : 'border-white/15 bg-black/30 text-white/70 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="email"
                          className="accent-brand-red"
                          checked={preferredContactMethod === 'email'}
                          onChange={() => setPreferredContactMethod('email')}
                          name={preferredContactFieldName}
                          ref={preferredContactRef}
                        />
                        Email updates
                      </span>
                    </label>
                    <label
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                        preferredContactMethod === 'phone'
                          ? 'border-brand-red/60 bg-brand-red/15 text-white'
                          : 'border-white/15 bg-black/30 text-white/70 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="radio"
                          value="phone"
                          className="accent-brand-red"
                          checked={preferredContactMethod === 'phone'}
                          onChange={() => setPreferredContactMethod('phone')}
                          name={preferredContactFieldName}
                        />
                        Mobile call or SMS
                      </span>
                    </label>
                  </div>
                  <p className="mt-3 text-xs text-white/60">We’ll use this for booking confirmations and reminders.</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-white/90">Property address *</label>
                <SimpleAddressInput
                  value={watch('property_address') || ''}
                  onChange={(address) => setValue('property_address', address, { shouldDirty: true, shouldValidate: true })}
                  placeholder="Enter your full address including street and town"
                  required
                />
                <input
                  type="hidden"
                  {...register('property_address', {
                    required: 'Property address is required',
                    minLength: {
                      value: 10,
                      message: 'Please enter a complete address including postcode',
                    },
                  })}
                />
                {errors.property_address && <p className="mt-1 text-xs text-red-400">{errors.property_address.message}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-white/90">Postcode *</label>
                <input
                  type="text"
                  className={`w-full rounded-lg px-4 py-3 text-white placeholder-white/40 transition focus:outline-none focus:ring-2 ${
                    coverageStatus === 'covered'
                      ? 'border-emerald-400/60 bg-emerald-500/10 focus:border-emerald-400 focus:ring-emerald-400/20'
                      : coverageStatus === 'outside'
                      ? 'border-brand-red/60 bg-brand-red/10 focus:border-brand-red focus:ring-brand-red/25'
                      : 'border-white/20 bg-white/5 focus:border-brand-red focus:ring-brand-red/20'
                  }`}
                  placeholder="BA5 1AA"
                  {...register('postcode', {
                    required: 'Postcode is required',
                    pattern: {
                      value: /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i,
                      message: 'Please enter a valid UK postcode',
                    },
                    setValueAs: (value) => value.toUpperCase(),
                  })}
                />
                {errors.postcode && <p className="mt-1 text-xs text-red-400">{errors.postcode.message}</p>}

                {coverageStatus === 'covered' && frequencyMatch && (
                  <div className="mt-3 flex items-start gap-3 rounded-lg border border-emerald-400/40 bg-emerald-500/10 p-3 text-sm text-emerald-100">
                    <svg className="mt-0.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <p className="font-semibold">
                        We clean {coverageMatchLabel || postcodeAreaName}
                      </p>
                      {activeStep !== 'contact' && selectedDateLabel && (
                        <p className="text-emerald-100/80">Next available visit: {selectedDateLabel}</p>
                      )}
                    </div>
                  </div>
                )}

                {coverageStatus === 'outside' && postcodeProgressLength >= 3 && (
                  <div className="mt-3 flex items-start gap-3 rounded-lg border border-brand-red/40 bg-brand-red/10 p-3 text-sm text-brand-red/85">
                    <svg className="mt-0.5 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
                    </svg>
                    <div>
                      <p className="font-semibold">We’ll double-check this postcode manually.</p>
                      <p className="text-brand-red/70">We’ll confirm availability by the next working day.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          </StepCard>

          <StepCard
            index={1}
            title="Property details"
            description="Share the address and property layout so we can tailor pricing."
            isActive={activeStep === 'property'}
            isComplete={propertyComplete}
            locked={!contactComplete}
            onOpen={() => openStep('property')}
            onBack={() => goToPreviousStep()}
            onContinue={propertyComplete ? () => openStep('services') : undefined}
            continueDisabled={!propertyComplete}
          >
          {/* Property details */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <svg className="h-5 w-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Tell us about the property
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-white/90">Bedrooms *</p>
                <div className="grid gap-2">
                  {BEDROOM_OPTIONS.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                        bedroomBand === option.id
                          ? 'border-brand-red/70 bg-brand-red/10 shadow-[0_0_20px_rgba(225,29,42,0.25)]'
                          : 'border-white/15 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.id}
                        className="mt-1 accent-brand-red"
                        {...register('bedroom_band', { required: true })}
                      />
                      <div>
                        <p className="font-semibold text-white">{option.label}</p>
                        <p className="text-xs text-white/70">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-white/90">Property type *</p>
                <div className="grid gap-2">
                  {PROPERTY_TYPES.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition ${
                        propertyType === option.id
                          ? 'border-brand-red/70 bg-brand-red/10 shadow-[0_0_20px_rgba(225,29,42,0.25)]'
                          : 'border-white/15 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <input
                        type="radio"
                        value={option.id}
                        className="mt-1 accent-brand-red"
                        {...register('property_type', { required: true })}
                      />
                      <div>
                        <p className="font-semibold text-white">{option.label}</p>
                        <p className="text-xs text-white/70">{option.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <p className="text-sm font-medium text-white/90">Do you have an extension or conservatory?</p>
                <p className="text-xs text-white/60">Let us know so we can factor in extra glass area and access requirements.</p>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Extension</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                          hasExtension === 'yes'
                            ? 'border-brand-red/60 bg-brand-red/15 text-white shadow-[0_0_18px_rgba(225,29,42,0.25)]'
                            : 'border-white/15 bg-black/30 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span>Yes</span>
                        <input
                          type="radio"
                          value="yes"
                          className="accent-brand-red"
                          {...register('has_extension', { required: true })}
                        />
                      </label>
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                          hasExtension === 'no'
                            ? 'border-brand-red/60 bg-brand-red/15 text-white shadow-[0_0_18px_rgba(225,29,42,0.25)]'
                            : 'border-white/15 bg-black/30 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span>No</span>
                        <input
                          type="radio"
                          value="no"
                          className="accent-brand-red"
                          {...register('has_extension', { required: true })}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">Conservatory</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                          hasConservatory === 'yes'
                            ? 'border-brand-red/60 bg-brand-red/15 text-white shadow-[0_0_18px_rgba(225,29,42,0.25)]'
                            : 'border-white/15 bg-black/30 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span>Yes</span>
                        <input
                          type="radio"
                          value="yes"
                          className="accent-brand-red"
                          {...register('has_conservatory', { required: true })}
                        />
                      </label>
                      <label
                        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                          hasConservatory === 'no'
                            ? 'border-brand-red/60 bg-brand-red/15 text-white shadow-[0_0_18px_rgba(225,29,42,0.25)]'
                            : 'border-white/15 bg-black/30 text-white/70 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        <span>No</span>
                        <input
                          type="radio"
                          value="no"
                          className="accent-brand-red"
                          {...register('has_conservatory', { required: true })}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          </StepCard>

          <StepCard
            index={2}
            title="Services & schedule"
            description="Select the services you need and your preferred visit."
            isActive={activeStep === 'services'}
            isComplete={selectedServices.length > 0 && (currentIntent === 'quote' || Boolean(preferredDateValue))}
            locked={!propertyComplete}
            onOpen={() => openStep('services')}
            onBack={() => goToPreviousStep()}
          >
          {/* Services & scheduling */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
              <svg className="h-5 w-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v8a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
              </svg>
              Services & appointment
            </h3>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-white/90">Services required *</label>
              <p className="text-xs text-white/60">Tick every service you&apos;d like included in your visit. Extras can be added later if needed.</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICE_OPTIONS.map((service) => {
                  const selected = selectedServices.includes(service)
                  const details = getServiceDetails(service)
                  return (
                    <label
                      key={service}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        selected
                          ? 'border-brand-red/70 bg-brand-red/10 shadow-[0_0_20px_rgba(225,29,42,0.25)]'
                          : 'border-white/15 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <input type="checkbox" className="sr-only" checked={selected} onChange={() => handleServiceToggle(service)} />
                      <div>
                        <p className="font-semibold text-white">{service}</p>
                        <p className="mt-1 text-xs text-white/70">{SERVICE_SUMMARY[service]}</p>
                        {details.priceLabel && (
                          <p className="mt-3 text-sm font-semibold text-brand-red">{details.priceLabel}</p>
                        )}
                        {details.frequencyLabel && (
                          <p className="text-xs text-white/65">{details.frequencyLabel}</p>
                        )}
                        {details.secondary && (
                          <p className="mt-2 text-xs text-white/60">{details.secondary}</p>
                        )}
                        {details.bonusNote && (
                          <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">{details.bonusNote}</p>
                        )}
                      </div>
                    </label>
                  )
                })}
              </div>
              {errors.services && (
                <p className="mt-1 text-xs text-red-400">{serviceErrorMessage || 'Please choose at least one service'}</p>
              )}
              <p className="text-xs text-emerald-200">
                Book gutter clearing <span className="font-semibold">and</span> fascia &amp; soffit cleaning on the same visit to receive your window clean free of charge.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/90">How often would you like visits? *</label>
              <select
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                {...register('service_frequency', { required: 'Please choose how often you would like us to visit' })}
              >
                {SERVICE_FREQUENCIES.map((frequency) => (
                  <option key={frequency} value={frequency} className="bg-gray-800 text-white">
                    {frequency}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-white/60">
                Our core window cleaning cadence is every four weeks, with an every-eight-week option available on request.
              </p>
              {errors.service_frequency && <p className="mt-1 text-xs text-red-400">{errors.service_frequency.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/90">Choose your first visit *</label>
              {dateOptions.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {dateOptions.map((option) => {
                    const isSelected = selectedDateId === option.id
                    const isFallback = option.id.startsWith('fallback')
                    return (
                      <label
                        key={option.id}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-4 transition ${
                          isSelected
                            ? 'border-emerald-400/70 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                            : 'border-white/15 bg-white/5 hover:border-white/30'
                        }`}
                      >
                        <input
                          type="radio"
                          value={option.iso}
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => {
                            setValue('preferred_date', option.iso, { shouldValidate: true })
                            setSelectedDateId(option.id)
                            setSelectedDateLabel(option.label)
                            clearErrors('preferred_date')
                          }}
                        />
                        <div>
                          <p className="font-semibold text-white">{option.label}</p>
                          <p className="text-xs text-white/70">{isFallback ? 'Priority booking slot' : option.matchLabel}</p>
                        </div>
                        {isSelected && (
                          <svg className="h-5 w-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </label>
                    )
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white/70">
                  Enter your postcode above to display available weeks and choose the slot that works best for you.
                </div>
              )}
              {errors.preferred_date && <p className="mt-1 text-xs text-red-400">{errors.preferred_date.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-white/90">Special requirements</label>
              <textarea
                rows={3}
                className="w-full resize-none rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                placeholder="Access notes, locked gates, conservatory details, pets, or anything else we should know."
                {...register('special_requirements')}
              />
            </div>
          </div>

          {pricingSummary && (
            <div className="space-y-3 rounded-2xl border border-white/15 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-white">Estimated investment</h4>
                <span className="text-xl font-semibold text-brand-red">{pricingSummary.totalFormatted}</span>
              </div>
              <ul className="space-y-2 text-sm text-white/80">
                {pricingSummary.lines.map((line) => (
                  <li key={line.label} className="flex items-start justify-between gap-3">
                    <span>{line.label}</span>
                    <span className="text-white/90">
                      {line.amount !== undefined ? formatCurrency(line.amount) : 'To be confirmed'}
                    </span>
                  </li>
                ))}
              </ul>
              {pricingSummary.discountNote && (
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  {pricingSummary.discountNote}
                </p>
              )}
              <p className="text-xs text-white/60">
                All prices shown assume standard property sizes. If we feel an uplift is needed on the day, we&apos;ll always let you know before we start any work.
              </p>
            </div>
          )}

          {/* Hidden fields for EmailJS */}
          <input type="hidden" {...register('customer_type')} />
          <input type="hidden" {...register('submission_date')} />
          <input type="hidden" {...register('submission_time')} />
          <input type="hidden" {...register('intent')} />

          <input type="hidden" name="frequency_match" />
          <input type="hidden" name="frequency_service_days" />
          <input type="hidden" name="frequency_date_label" />
          <input type="hidden" name="pricing_total" />
          <input type="hidden" name="pricing_breakdown" />
          <input type="hidden" name="pricing_notes" />

          <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register('website')} />

          <div className="space-y-2">
            <ReCaptcha onChange={handleRecaptchaChange} onExpired={handleRecaptchaExpired} className="pt-4" />
            {errors.recaptcha && <p className="text-center text-xs text-red-400">{errors.recaptcha.message}</p>}
          </div>

          <div className="pt-4 space-y-4">
            <button
              type="submit"
              disabled={isSubmitting || !recaptchaToken}
              className={`w-full rounded-xl px-8 py-4 font-semibold transition ${
                isSubmitting || !recaptchaToken
                  ? 'cursor-not-allowed bg-gray-600 text-gray-300 opacity-60'
                  : 'bg-gradient-to-r from-brand-red to-brand-red/90 text-white shadow-lg shadow-brand-red/25 hover:shadow-xl hover:shadow-brand-red/35'
              }`}
            >
              {buttonText}
            </button>
            {!recaptchaToken && (
              <p className="mt-2 flex items-center justify-center gap-1 text-center text-sm text-brand-red/80">
                <svg className="h-4 w-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Please complete the reCAPTCHA verification above to book your appointment.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-4 text-center text-sm text-red-400">
                Sorry, something went wrong. Please try again or contact us directly at 01458 860339.
              </p>
            )}
            <p className="mt-4 text-center text-xs text-white/60">
              You&apos;ll receive your booking pack within one working day (Mon-Sat, 9am-4pm).
            </p>
            {GO_CARDLESS_URL && (
              <div className="mt-4 space-y-3 rounded-xl border border-white/12 bg-white/5 p-4 text-center">
                <p className="text-sm font-semibold text-white">Paying an existing balance?</p>
                <p className="text-xs text-white/70">
                  Use our secure GoCardless portal to set up Direct Debit for existing accounts and settle invoices automatically.
                </p>
                <a
                  href={GO_CARDLESS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-brand-red/70 bg-brand-red/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-brand-red hover:bg-brand-red/20"
                >
                  Pay by Direct Debit
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm text-white/80">
              <a
                href="tel:01458860339"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 transition hover:border-brand-red/60 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call 01458 860 339
              </a>
              <a
                href="mailto:info@somersetwindowcleaning.co.uk"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 transition hover:border-brand-red/60 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12l-4 4-4-4m8-5a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                Email us
              </a>
              <a
                href="https://wa.me/441458860339"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-transparent bg-[#25D366] px-4 py-2 font-semibold text-[#0a0f0a] transition hover:bg-[#1ebe5b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ebe5b]/60"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2a10 10 0 00-8.94 14.56L2 22l5.61-1.47A10 10 0 1012 2zm0 18a8 8 0 114.9-14.36l.6.46-.6.46A8 8 0 0112 20z" />
                  <path d="M8.59 9.53c0 .2.06.4.18.57.27.38.86.87 1.02.96.16.09.22.08.38.02.16-.06.64-.3.73-.34.09-.03.16-.05.23.05.07.11.26.34.53.56.26.23.46.37.63.47.16.1.31.08.43.05.13-.03.4-.15.62-.31.21-.16.37-.29.42-.45.05-.16.05-.29-.02-.41-.06-.12-.24-.37-.5-.63-.26-.26-.41-.27-.56-.23-.14.04-.3.18-.47.37-.11.12-.25.14-.38.07-.13-.06-.89-.41-1.7-1.16-.62-.58-1.05-1.31-1.17-1.53-.12-.22-.01-.34.05-.4.05-.05.12-.13.18-.2.06-.07.08-.12.11-.2.03-.08.02-.16-.01-.23-.03-.07-.29-.7-.4-.96-.1-.26-.21-.22-.36-.22-.09 0-.17 0-.25.01-.08.01-.2.03-.31.15-.11.12-.43.42-.43 1.02z" />
                </svg>
                🟢 WhatsApp chat
              </a>
            </div>
            <p className="text-center text-xs text-white/55">
              Prefer to chat first? Call, email, or message us—your pricing summary stays on record so we can pick up right away.
            </p>
          </div>
          </StepCard>
        </form>
      </div>
    </div>
  )
}
