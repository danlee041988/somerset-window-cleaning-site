"use client"

import React from 'react'
import emailjs from '@emailjs/browser'
import Button from '@/components/ui/Button'
import ReCaptcha from '@/components/features/contact/ReCaptcha'
import GooglePlacesAutocomplete from '@/components/features/contact/GooglePlacesAutocomplete'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ProgressBar from '@/components/ui/ProgressBar'
import Alert from '@/components/ui/Alert'
import { analytics } from '@/lib/analytics'
import { pushToDataLayer } from '@/lib/dataLayer'
import { saveFormData, loadFormData, clearFormData, hasFormData, formatFormDataAge, getFormDataAge } from '@/lib/form-storage'
import { getUserFriendlyError } from '@/lib/error-messages'
import { announceToScreenReader, focusFirstError } from '@/lib/accessibility'

const SERVICE_ID = (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '').trim()
const TEMPLATE_ID = (process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_booking_form').trim()
const PUBLIC_KEY = (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '').trim()
const GO_CARDLESS_URL = process.env.NEXT_PUBLIC_GOCARDLESS_PAYMENT_URL

type PropertyCategory = 'residential' | 'commercial'
type BedroomBand = '1-2' | '3' | '4' | '5' | '6+'
type PropertyType = 'terraced' | 'semi' | 'detached' | 'bungalow' | 'townhouse' | 'flat'
type CommercialType = 'shopfront' | 'office' | 'industrial' | 'hospitality' | 'education' | 'other'
type FrequencyId =
  | '4'
  | '8'
  | 'one-off'
  | 'fortnightly'
  | 'monthly'
  | 'quarterly'
  | '26'
  | 'ad-hoc'
type IntentOption = 'book' | 'quote'
type CustomerType = 'new' | 'existing'

type Step = 1 | 2 | 3
const TOTAL_STEPS: Step = 3

type RequestState = {
  propertyCategory: PropertyCategory
  bedrooms: BedroomBand
  propertyType: PropertyType
  frequency: FrequencyId
  includeGutter: boolean
  includeFascia: boolean
  hasExtension: boolean
  hasConservatory: boolean
  isBespoke: boolean
  commercialType: CommercialType | ''
  commercialNotes: string
  commercialServices: string[]
}

type CustomerState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  postcode: string
  address: string
  notes: string
  intent: IntentOption
  customerType: CustomerType
  website: string
}

type SuccessSummaryState = {
  services: string[]
  frequency: string
  propertySummary: string
  extras: string[]
  manualReview: boolean
}

const STEP_LABELS: Array<{ id: Step; label: string; helper: string }> = [
  { id: 1, label: 'Property', helper: 'Tell us about the property' },
  { id: 2, label: 'Services', helper: 'Choose what you need' },
  { id: 3, label: 'Your details', helper: 'How we can reach you' },
]

const CONFIDENCE_COPY: Record<Step, { heading: string; points: string[]; helper: string }> = {
  1: {
    heading: 'Why people choose us',
    points: [
      'Replies within one working day with available visit windows',
      'Manual quotes so you only pay for what the property needs',
      'Reminder texts before every visit with easy rescheduling',
    ],
    helper: 'Prefer a quick chat? Call 01458 860339 or send us a WhatsApp message.',
  },
  2: {
    heading: 'What happens next',
    points: [
      'We review your details and match the right crew',
      'A team member will confirm access and timings before booking',
      'Add notes or photos so we can prep properly',
    ],
    helper: 'Need help choosing services? Call 01458 860339 and we’ll talk it through.',
  },
  3: {
    heading: 'Before you send',
    points: [
      'We use your details purely to coordinate the visit',
      'Update your preferences or frequency at any time',
      'A member of the team will confirm by phone or email',
    ],
    helper: 'Something complicated to explain? Call 01458 860339 or add it to the notes field.',
  },
}

const BEDROOM_OPTIONS: Array<{ id: BedroomBand; label: string; description: string }> = [
  {
    id: '1-2',
    label: '1-2 bedrooms',
    description: 'Compact terraces, semis, or flats.',
  },
  {
    id: '3',
    label: '3 bedrooms',
    description: 'Typical family homes across Somerset.',
  },
  {
    id: '4',
    label: '4 bedrooms',
    description: 'Roomier homes up to two storeys.',
  },
  {
    id: '5',
    label: '5 bedrooms',
    description: 'Large detached or extended properties.',
  },
  {
    id: '6+',
    label: '6+ bedrooms',
    description: 'Estates, annexes, or multi-dwelling homes (manual review).',
  },
]

const PROPERTY_STYLE_OPTIONS: Array<{ id: PropertyType; label: string; description: string }> = [
  {
    id: 'terraced',
    label: 'Terraced',
    description: 'Joined both sides with shared frontage access.',
  },
  {
    id: 'semi',
    label: 'Semi-detached',
    description: 'One shared wall with side or rear access.',
  },
  {
    id: 'detached',
    label: 'Detached',
    description: 'Fully detached with access all round.',
  },
  {
    id: 'bungalow',
    label: 'Bungalow',
    description: 'Single storey, full perimeter access.',
  },
  {
    id: 'townhouse',
    label: 'Townhouse / 3 storey',
    description: 'Vertical layout across three floors.',
  },
  {
    id: 'flat',
    label: 'Apartment',
    description: 'Upper level or shared entrance access.',
  },
]

const PROPERTY_CATEGORY_OPTIONS: Array<{ id: PropertyCategory; title: string; description?: string }> = [
  {
    id: 'residential',
    title: 'Residential home',
  },
  {
    id: 'commercial',
    title: 'Commercial premises',
  },
]

const COMMERCIAL_TYPE_OPTIONS: Array<{ id: CommercialType; label: string }> = [
  { id: 'shopfront', label: 'Shopfront / retail' },
  { id: 'office', label: 'Office or co-working space' },
  { id: 'industrial', label: 'Industrial / warehouse' },
  { id: 'hospitality', label: 'Hospitality (pub, restaurant, hotel)' },
  { id: 'education', label: 'School / educational' },
  { id: 'other', label: 'Other / bespoke premises' },
]

const COMMERCIAL_SERVICE_OPTIONS: Array<{ id: string; label: string; description?: string }> = [
  {
    id: 'external_windows',
    label: 'Exterior window cleaning',
    description: 'Frontage and elevation glazing using reach pole or cradle.',
  },
  {
    id: 'internal_windows',
    label: 'Internal window cleaning',
    description: 'Lobby, partition, and internal glazing wiped and detailed.',
  },
  {
    id: 'signage',
    label: 'Signage & cladding washing',
    description: 'Keep fascia signage, suites, and canopy panels presentable.',
  },
  {
    id: 'gutter_clearing',
    label: 'Roofline & gutter maintenance',
    description: 'Vacuum clearing for commercial rooflines and gutter runs.',
  },
  {
    id: 'solar',
    label: 'Solar / PV panel cleaning',
    description: 'Pure-water clean for roof arrays to maintain efficiency.',
  },
  {
    id: 'bespoke_additional',
    label: 'Other specialist cleaning',
    description: 'Let us know in notes—cladding, atriums, rope access, etc.',
  },
]

const RESIDENTIAL_FREQUENCY_OPTIONS: Array<{ id: FrequencyId; label: string; helper: string }> = [
  {
    id: '4',
    label: 'Every 4 weeks',
    helper: 'Our core round – keeps frames spotless.',
  },
  {
    id: '8',
    label: 'Every 8 weeks',
    helper: 'Bi-monthly for lower traffic homes.',
  },
  {
    id: 'one-off',
    label: 'One-off clean',
    helper: 'Perfect before events or listings. Charged at a premium rate.',
  },
]

const COMMERCIAL_FREQUENCY_OPTIONS: Array<{ id: FrequencyId; label: string; helper: string }> = [
  {
    id: '8',
    label: 'Every 8 weeks',
    helper: 'Bi-monthly cadence for regular frontage upkeep.',
  },
  {
    id: 'fortnightly',
    label: 'Every 2 weeks',
    helper: 'Keeps glazing presentable for steady customer traffic.',
  },
  {
    id: 'quarterly',
    label: 'Quarterly maintenance',
    helper: 'Ideal for signage, high-level glazing or larger sites.',
  },
  {
    id: '26',
    label: 'Every 26 weeks',
    helper: 'Twice-yearly deep maintenance for seasonal refreshes.',
  },
  {
    id: 'ad-hoc',
    label: 'One-off / ad-hoc',
    helper: 'Let us know when you need a visit and we\'ll align availability.',
  },
]

const SERVICE_PRESET_MAP: Record<string, (state: RequestState) => RequestState> = {
  'gutter-clearing': (state) => ({
    ...state,
    propertyCategory: 'residential',
    includeGutter: true,
    includeFascia: false,
    frequency: 'one-off',
  }),
  'fascias-soffits': (state) => ({
    ...state,
    propertyCategory: 'residential',
    includeGutter: false,
    includeFascia: true,
    frequency: 'one-off',
  }),
  'conservatory-cleaning': (state) => ({
    ...state,
    propertyCategory: 'residential',
    hasConservatory: true,
    isBespoke: true,
    frequency: 'one-off',
  }),
  'solar-cleaning': (state) => ({
    ...state,
    propertyCategory: 'residential',
    isBespoke: true,
    frequency: 'one-off',
  }),
  'commercial-cleaning': (state) => ({
    ...state,
    propertyCategory: 'commercial',
    includeGutter: false,
    includeFascia: false,
    hasExtension: false,
    isBespoke: false,
    frequency: 'monthly',
    commercialServices: state.commercialServices.length
      ? state.commercialServices
      : ['external_windows'],
  }),
}

const INITIAL_REQUEST_STATE: RequestState = {
  propertyCategory: 'residential',
  bedrooms: '3',
  propertyType: 'semi',
  frequency: '4',
  includeGutter: false,
  includeFascia: false,
  hasExtension: false,
  hasConservatory: false,
  isBespoke: false,
  commercialType: '',
  commercialNotes: '',
  commercialServices: [],
}

const initialCustomerState = (
  defaultIntent: IntentOption,
  defaultPostcode: string,
  defaultAddress: string,
): CustomerState => ({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  postcode: defaultPostcode.toUpperCase(),
  address: defaultAddress,
  notes: '',
  intent: defaultIntent,
  customerType: 'new',
  website: '',
})

const bedroomLabel = (id: BedroomBand) => BEDROOM_OPTIONS.find((option) => option.id === id)?.label ?? id
const propertyTypeLabel = (id: PropertyType) =>
  PROPERTY_STYLE_OPTIONS.find((option) => option.id === id)?.label ?? id
const commercialTypeLabel = (id: CommercialType | '') =>
  COMMERCIAL_TYPE_OPTIONS.find((option) => option.id === id)?.label ?? 'General commercial'
const commercialServiceLabel = (id: string) =>
  COMMERCIAL_SERVICE_OPTIONS.find((option) => option.id === id)?.label ?? id
const frequencyLabel = (id: FrequencyId) =>
  RESIDENTIAL_FREQUENCY_OPTIONS.find((option) => option.id === id)?.label ??
  COMMERCIAL_FREQUENCY_OPTIONS.find((option) => option.id === id)?.label ??
  id

interface BookingFormProps {
  defaultService?: string
  defaultAddress?: string
  defaultIntent?: IntentOption
  defaultPostcode?: string
  className?: string
}

export default function BookingForm({
  defaultAddress = '',
  defaultIntent = 'quote',
  defaultPostcode = '',
  className = '',
  defaultService = '',
}: BookingFormProps) {
  const [step, setStep] = React.useState<Step>(1)
  const [request, setRequest] = React.useState<RequestState>(INITIAL_REQUEST_STATE)
  const [customer, setCustomer] = React.useState<CustomerState>(
    initialCustomerState(defaultIntent, defaultPostcode, defaultAddress),
  )
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)
  const [successSummary, setSuccessSummary] = React.useState<SuccessSummaryState | null>(null)
  const [showDraftPrompt, setShowDraftPrompt] = React.useState(false)
  const [draftAge, setDraftAge] = React.useState<number | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const startTime = React.useRef<number>(Date.now())
  const formRef = React.useRef<HTMLFormElement>(null)

  const trackPhoneClick = React.useCallback((source: string) => {
    analytics.quoteRequest('phone')
    pushToDataLayer('phone_click', { source })
  }, [])

  // Check for saved draft on mount
  React.useEffect(() => {
    const saved = loadFormData('booking-form')
    if (saved && saved.data) {
      setDraftAge(getFormDataAge('booking-form'))
      setShowDraftPrompt(true)
    }
  }, [])

  // Auto-save form data every 30 seconds
  React.useEffect(() => {
    if (status === 'success' || step === 1) return // Don't save on success or first step
    
    const interval = setInterval(() => {
      saveFormData('booking-form', { request, customer }, step)
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [request, customer, step, status])

  // Restore draft
  const restoreDraft = React.useCallback(() => {
    const saved = loadFormData('booking-form')
    if (saved && saved.data) {
      if (saved.data.request) setRequest(saved.data.request)
      if (saved.data.customer) setCustomer(saved.data.customer)
      if (saved.step) setStep(saved.step as Step)
      setShowDraftPrompt(false)
      announceToScreenReader('Draft restored successfully')
    }
  }, [])

  // Dismiss draft
  const dismissDraft = React.useCallback(() => {
    clearFormData('booking-form')
    setShowDraftPrompt(false)
  }, [])

  React.useEffect(() => {
    setCustomer((prev) => ({
      ...prev,
      postcode: defaultPostcode ? defaultPostcode.toUpperCase() : prev.postcode,
      address: defaultAddress || prev.address,
      intent: defaultIntent,
    }))
  }, [defaultPostcode, defaultAddress, defaultIntent])

  React.useEffect(() => {
    if (!defaultService) return
    const presetKey = defaultService.toLowerCase()
    setRequest((prev) => {
      const preset = SERVICE_PRESET_MAP[presetKey]
      if (!preset) return prev
      return preset(prev)
    })
  }, [defaultService])

  const requiresManualReview = React.useMemo(
    () => request.isBespoke || request.propertyCategory === 'commercial' || request.bedrooms === '6+',
    [request.isBespoke, request.propertyCategory, request.bedrooms],
  )

  const propertySummary = React.useMemo(() => {
    if (request.propertyCategory === 'commercial') {
      return request.commercialType ? commercialTypeLabel(request.commercialType) : 'Commercial property'
    }
    return `${bedroomLabel(request.bedrooms)} · ${propertyTypeLabel(request.propertyType)}`
  }, [request.bedrooms, request.propertyCategory, request.propertyType, request.commercialType])

  const propertyExtras = React.useMemo(() => {
    const extras: string[] = []
    if (request.hasExtension) extras.push('Extension / porch')
    if (request.hasConservatory) extras.push('Conservatory windows')
    if (request.isBespoke) extras.push('Bespoke layout')
    if (request.propertyCategory === 'commercial' && request.commercialNotes.trim()) extras.push('Premises notes added')
    return extras
  }, [request.hasExtension, request.hasConservatory, request.isBespoke, request.propertyCategory, request.commercialNotes])

  const servicesSelected = React.useMemo(() => {
    const services: string[] = []

    if (request.propertyCategory === 'commercial') {
      if (request.commercialServices.length) {
        services.push(
          ...request.commercialServices.map((serviceId) => commercialServiceLabel(serviceId)),
        )
      } else {
        services.push('Commercial services to confirm with team')
      }
    } else {
      services.push('Exterior window cleaning')
      if (request.includeGutter) services.push('Gutter clearing requested')
      if (request.includeFascia) services.push('Fascia & soffit cleaning requested')
      if (request.hasExtension) services.push('Extension / porch included')
      if (request.hasConservatory) services.push('Conservatory windows included')
    }

    if (requiresManualReview) {
      services.push('Manual quote required')
    }

    return services
  }, [
    request.propertyCategory,
    request.commercialServices,
    request.includeGutter,
    request.includeFascia,
    request.hasExtension,
    request.hasConservatory,
    requiresManualReview,
  ])

  const manualReviewReason = React.useMemo(() => {
    if (!requiresManualReview) return ''
    const reasons: string[] = []
    if (request.propertyCategory === 'commercial') reasons.push('commercial property')
    if (request.isBespoke) reasons.push('bespoke layout')
    if (request.bedrooms === '6+') reasons.push('larger than standard footprint')
    return reasons.join(', ')
  }, [requiresManualReview, request.propertyCategory, request.isBespoke, request.bedrooms])

  const goToStep = (next: Step) => {
    setErrorMessage(null)
    setStep(next)
    if (typeof window !== 'undefined') {
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
  }

  const handleRequestChange = <K extends keyof RequestState>(key: K, value: RequestState[K]) => {
    setRequest((prev) => ({ ...prev, [key]: value }))
  }

  const toggleCommercialService = (serviceId: string) => {
    setRequest((prev) => {
      const exists = prev.commercialServices.includes(serviceId)
      return {
        ...prev,
        commercialServices: exists
          ? prev.commercialServices.filter((id) => id !== serviceId)
          : [...prev.commercialServices, serviceId],
      }
    })
  }

  const handleCustomerChange = <K extends keyof CustomerState>(key: K, value: CustomerState[K]) => {
    setCustomer((prev) => ({ ...prev, [key]: value }))
  }

  const handleRecaptcha = (token: string | null) => {
    setRecaptchaToken(token)
    if (token) analytics.recaptchaComplete()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)

    if (status === 'submitting') return

    if (customer.website.trim().length > 0) {
      return
    }

    const elapsed = Date.now() - startTime.current
    if (elapsed < 1500) {
      setErrorMessage('Please take a moment to review your request before sending.')
      analytics.formError('submission_ratelimit')
      return
    }

    const requiredFields: Array<[keyof CustomerState, string]> = [
      ['firstName', 'Enter your first name'],
      ['lastName', 'Enter your last name'],
      ['email', 'Enter a valid email'],
      ['phone', 'Enter your phone number'],
      ['postcode', 'Postcode is required'],
      ['address', 'Add your address so we can align the right round'],
    ]

    for (const [field, message] of requiredFields) {
      if (!customer[field].trim()) {
        setErrorMessage(message)
        analytics.formError(`missing_field_${field}`)
        return
      }
    }

    if (!recaptchaToken) {
      setErrorMessage('Please complete the reCAPTCHA before submitting.')
      analytics.recaptchaError('token_missing')
      return
    }

    const bedroomText =
      request.propertyCategory === 'commercial' ? 'Not applicable' : bedroomLabel(request.bedrooms)
    const propertyText =
      request.propertyCategory === 'commercial' ? 'Not applicable' : propertyTypeLabel(request.propertyType)
    const frequencyText = frequencyLabel(request.frequency)

    const summarySections = [
      'Customer',
      `- Name: ${customer.firstName} ${customer.lastName}`,
      `- Email: ${customer.email}`,
      `- Phone: ${customer.phone}`,
      '',
      'Property & Services',
      request.propertyCategory === 'residential' ? `- Bedrooms: ${bedroomText}` : null,
      request.propertyCategory === 'residential' ? `- Property type: ${propertyText}` : null,
      request.propertyCategory === 'commercial'
        ? `- Premises type: ${request.commercialType ? commercialTypeLabel(request.commercialType) : 'Not specified'}`
        : null,
      `- Property category: ${request.propertyCategory === 'commercial' ? 'Commercial' : 'Residential'}`,
      propertyExtras.length ? `- Extras: ${propertyExtras.join(', ')}` : '- Extras: None noted',
      `- Postcode: ${customer.postcode.toUpperCase()}`,
      `- Address: ${customer.address}`,
      `- Frequency: ${frequencyText}`,
      `- Services: ${servicesSelected.join(', ')}`,
      requiresManualReview
        ? `- Manual review reason: ${manualReviewReason || 'Team to confirm'}`
        : null,
      '',
      'Notes',
      `${customer.notes || 'No additional notes supplied.'}`,
    ].filter(Boolean) as string[]

    const summaryPlaintext = summarySections.join('\n')
    const now = new Date()
    const submittedAtIso = now.toISOString()
    const submittedAtDisplay = now.toLocaleString('en-GB')

    const servicesList = servicesSelected.join(', ') || 'Exterior window cleaning'

    const templateParams = {
      name: `${customer.firstName} ${customer.lastName}`.trim(),
      first_name: customer.firstName,
      last_name: customer.lastName,
      customer_email: customer.email,
      customer_phone: customer.phone,
      postcode: customer.postcode.toUpperCase(),
      property_address: customer.address,
      property_size: bedroomText,
      property_type: propertyText,
      property_category: request.propertyCategory,
      commercial_type:
        request.propertyCategory === 'commercial'
          ? commercialTypeLabel(request.commercialType)
          : 'Not applicable',
      commercial_notes:
        request.propertyCategory === 'commercial'
          ? request.commercialNotes || 'No additional commercial notes provided.'
          : 'Not applicable',
      commercial_services:
        request.propertyCategory === 'commercial'
          ? request.commercialServices.length
            ? request.commercialServices
                .map((serviceId) => commercialServiceLabel(serviceId))
                .join(', ')
            : 'Services not specified'
          : 'Not applicable',
      service_frequency: frequencyText,
      services_list: servicesList,
      services_json: JSON.stringify(servicesSelected),
      pricing_total: 'To be confirmed after manual review',
      pricing_breakdown: 'All pricing will be confirmed during follow-up.',
      pricing_discount_note: '',
      window_price: 'To be confirmed',
      gutter_price: request.includeGutter ? 'Requested' : 'Not requested',
      fascia_price: request.includeFascia ? 'Requested' : 'Not requested',
      extension_price: request.hasExtension ? 'Noted for quote' : 'Not selected',
      conservatory_price: request.hasConservatory ? 'Noted for quote' : 'Not selected',
      property_is_bespoke: request.isBespoke ? 'Yes' : 'No',
      manual_quote_required: requiresManualReview ? 'Yes' : 'No',
      manual_review_reason: requiresManualReview ? manualReviewReason || 'Team to confirm' : 'Standard request',
      property_extras: propertyExtras.length ? propertyExtras.join(', ') : 'None',
      frequency_match: 'Manual follow-up required',
      frequency_service_days: 'To be aligned',
      coverage_status: 'pending',
      coverage_label: 'Pending round confirmation',
      selected_date_option_id: 'manual-quote-flow',
      selected_date_match_label: frequencyText,
      pricing_lines_json: JSON.stringify(['Pricing to be confirmed manually']),
      submitted_at: submittedAtDisplay,
      recaptcha_token: recaptchaToken,
      'g-recaptcha-response': recaptchaToken,
      summary_plaintext: summaryPlaintext,
      raw_payload_json: JSON.stringify(
        {
          request,
          customer: { ...customer, website: undefined },
          requiresManualReview,
          servicesSelected,
        },
        null,
        2,
      ),
      intent: customer.intent,
      intent_label: customer.intent === 'quote' ? 'Quote request' : 'Booking request',
      email_subject: `${customer.intent === 'quote' ? 'Quote request' : 'Booking request'} – ${customer.firstName} ${customer.lastName} (${customer.postcode.toUpperCase()})`,
      notes: customer.notes,
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error('Missing EmailJS configuration. Set NEXT_PUBLIC_EMAILJS_SERVICE_ID / TEMPLATE_ID / PUBLIC_KEY.')
      setErrorMessage('We could not submit your request. Please try again shortly.')
      analytics.formError('missing_emailjs_config')
      return
    }

    try {
      setStatus('submitting')

      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
        publicKey: PUBLIC_KEY,
      })

      analytics.formSubmit({
        serviceType: servicesList,
        propertySize: bedroomText,
        customerType: customer.customerType,
        email: customer.email,
      })

      analytics.quoteRequest('form')

      try {
        const notionResponse = await fetch('/api/notion/leads', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customer,
            request,
            manualReviewReason,
            propertySummary,
            propertyExtras,
            servicesSelected,
            summaryPlaintext,
            submittedAt: submittedAtIso,
            frequencyText,
            bedroomText,
            recaptchaToken,
          }),
        })

        if (!notionResponse.ok) {
          const errorText = await notionResponse.text()
          console.error('Notion sync failed with response:', notionResponse.status, errorText)
          analytics.formError('notion_sync_failed', `HTTP ${notionResponse.status}`)
        }
      } catch (notionError) {
        console.error('Notion sync error:', notionError)
        analytics.formError(
          'notion_sync_failed',
          notionError instanceof Error ? notionError.message : 'Unknown error',
        )
      }

      pushToDataLayer('booking_form_submit', {
        service_list: servicesList,
        property_size: bedroomText,
        frequency_label: frequencyText,
        customer_type: customer.customerType,
        intent: customer.intent,
        manual_review: requiresManualReview,
        property_category: request.propertyCategory,
        first_name: customer.firstName,
        last_name: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        postcode: customer.postcode,
      })

      setSuccessSummary({
        services: servicesSelected.length ? servicesSelected : ['Exterior window cleaning'],
        frequency: frequencyText,
        propertySummary,
        extras: propertyExtras,
        manualReview: requiresManualReview,
      })
      
      // Clear saved draft on success
      clearFormData('booking-form')
      
      setStatus('success')
      setStep(1)
      setRequest(INITIAL_REQUEST_STATE)
      setCustomer(initialCustomerState(defaultIntent, defaultPostcode, defaultAddress))
      setRecaptchaToken(null)
      startTime.current = Date.now()
      
      announceToScreenReader('Request submitted successfully!')
    } catch (error) {
      console.error('Booking form submission error:', error)
      
      // Get user-friendly error message
      const friendlyError = getUserFriendlyError(error)
      setErrorMessage(friendlyError.message)
      
      analytics.formError('submission_failure', error instanceof Error ? error.message : 'Unknown error')
      setStatus('error')
      
      announceToScreenReader(`Error: ${friendlyError.message}`, 'assertive')
    } finally {
      setStatus((prev) => (prev === 'submitting' ? 'idle' : prev))
    }
  }

  if (status === 'success' && successSummary) {
    return (
      <div
        className={`rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center shadow-[0_30px_70px_-45px_rgba(225,29,42,0.45)] ${className}`}
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <svg className="h-8 w-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white">Request received!</h2>
        <p className="mt-3 text-white/70">
          Thank you – we’ll align your postcode with the right round and come back within one working day to confirm pricing and schedule options.
        </p>
        <div
          className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6 text-left text-sm text-white/70"
          data-testid="enquiry-success"
        >
          <p className="text-base font-semibold text-white">What we captured</p>
          <dl className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-white/50">Property</dt>
              <dd className="flex-1 text-right text-sm text-white">{successSummary.propertySummary}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-white/50">Frequency</dt>
              <dd className="text-sm text-white">{successSummary.frequency}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-white/50">Services</dt>
              <dd className="flex-1 text-right text-sm text-white">
                {successSummary.services.join(', ')}
              </dd>
            </div>
            {successSummary.extras.length ? (
              <div className="flex items-start justify-between gap-4">
                <dt className="text-xs uppercase tracking-[0.12em] text-white/50">Extras</dt>
                <dd className="flex-1 text-right text-sm text-white">{successSummary.extras.join(', ')}</dd>
              </div>
            ) : null}
          </dl>
          {successSummary.manualReview ? (
            <p className="mt-3 text-xs text-white/55" data-testid="manual-quote-note">
              We’ve flagged this for manual pricing so the team can confirm the quote before any work starts.
            </p>
          ) : (
            <p className="mt-3 text-xs text-white/55">
              We’ll confirm availability and get everything booked in once you’re happy with the schedule.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/60">
          <a
            href="tel:01458860339"
            onClick={() => trackPhoneClick('booking_success_message')}
            className="text-white underline decoration-brand-red/60 underline-offset-4 transition hover:text-white/80"
          >
            Need urgent help? Call 01458 860339.
          </a>
          <Button onClick={() => setStatus('idle')} className="px-6 py-2 text-sm font-semibold tracking-[0.08em]">
            Send another request
          </Button>
        </div>

        {GO_CARDLESS_URL ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-left text-sm text-white/75">
            <p className="text-base font-semibold text-white">Prefer automatic payments?</p>
            <p className="mt-2 text-xs text-white/60">
              Once your regular visit is confirmed you can set up GoCardless so each clean is settled automatically after completion.
            </p>
            <a
              href={GO_CARDLESS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold tracking-[0.08em] text-brand-black transition hover:bg-white/80"
            >
              Set up Direct Debit
            </a>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div className={`rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 ${className}`}>
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/60">Step {step} of {TOTAL_STEPS}</p>
            <h1 className="text-2xl font-semibold text-white">Request a quote</h1>
            <p className="text-sm text-white/60">
              Share your property details, choose the services you’re interested in, and we’ll follow up with tailored pricing.
            </p>
          </div>
        </div>
        {/* Visual Progress Bar */}
        <ProgressBar
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          labels={['Property', 'Services', 'Your Details']}
        />
      </header>

      {/* Draft Restoration Prompt */}
      {showDraftPrompt && draftAge && (
        <Alert
          type="info"
          title="Continue where you left off?"
          message={`We found a saved draft from ${formatFormDataAge(draftAge)}. Would you like to restore it?`}
          action={{
            label: 'Restore Draft',
            onClick: restoreDraft
          }}
          onClose={dismissDraft}
          className="mt-6"
        />
      )}

      {/* Error Messages */}
      {errorMessage && (
        <Alert
          type="error"
          title="Unable to Submit"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
          className="mt-6"
        />
      )}

      {status === 'error' && !errorMessage && (
        <Alert
          type="error"
          title="Something Went Wrong"
          message="Please try again or call 01458 860339 for immediate assistance."
          action={{
            label: 'Call Now',
            onClick: () => window.location.href = 'tel:01458860339'
          }}
          className="mt-6"
        />
      )}

      {step === 1 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.45fr)]">
          <div className="space-y-6">
            <OptionSection
              title="What type of property are we quoting?"
              subtitle="Pick the option that best matches your building."
              options={PROPERTY_CATEGORY_OPTIONS.map((option) => ({
                id: option.id,
                title: option.title,
              }))}
              name="property-category"
              value={request.propertyCategory}
              onChange={(value) => handleRequestChange('propertyCategory', value as PropertyCategory)}
              optionsClassName="sm:grid-cols-2"
            />

            {request.propertyCategory === 'residential' && (
              <>
                <OptionSection
                  title="How many bedrooms do you have?"
                  subtitle="A quick guide helps us estimate glazing coverage and visit time."
                  options={BEDROOM_OPTIONS.map((option) => ({
                    id: option.id,
                    title: option.label,
                  }))}
                  name="property-bedrooms"
                  value={request.bedrooms}
                  onChange={(value) => handleRequestChange('bedrooms', value as BedroomBand)}
                  optionsClassName="md:grid-cols-2 xl:grid-cols-4"
                />

                <OptionSection
                  title="What best describes your property style?"
                  subtitle="Different layouts change the reach and access we plan for."
                  options={PROPERTY_STYLE_OPTIONS.map((option) => ({
                    id: option.id,
                    title: option.label,
                    description: option.description,
                  }))}
                  name="property-style"
                  value={request.propertyType}
                  onChange={(value) => handleRequestChange('propertyType', value as PropertyType)}
                  optionsClassName="md:grid-cols-2 xl:grid-cols-3"
                />

                <OptionSection
                  title="Is the layout standard or bespoke?"
                  subtitle="Select bespoke for unusually large glazing, annexes, or non-standard architecture."
                  options={[
                    {
                      id: 'standard',
                      title: 'Standard layout',
                      description:
                        'Typical residential glazing and access. Includes most homes we clean routinely.',
                    },
                    {
                      id: 'bespoke',
                      title: 'Bespoke / unusually large',
                      description: 'We’ll confirm timings and pricing after reviewing your notes or photos.',
                    },
                  ]}
                  name="property-bespoke"
                  value={request.isBespoke ? 'bespoke' : 'standard'}
                  onChange={(value) => handleRequestChange('isBespoke', value === 'bespoke')}
                  optionsClassName="md:grid-cols-2"
                />

                <OptionSection
                  title="Do you have an extension or porch?"
                  options={[
                    { id: 'yes', title: 'Yes' },
                    { id: 'no', title: 'No' },
                  ]}
                  name="property-extension"
                  value={request.hasExtension ? 'yes' : 'no'}
                  onChange={(value) => handleRequestChange('hasExtension', value === 'yes')}
                  optionsClassName="sm:grid-cols-2"
                />

                <OptionSection
                  title="Do you have a conservatory?"
                  options={[
                    { id: 'yes', title: 'Yes' },
                    { id: 'no', title: 'No' },
                  ]}
                  name="property-conservatory"
                  value={request.hasConservatory ? 'yes' : 'no'}
                  onChange={(value) => handleRequestChange('hasConservatory', value === 'yes')}
                  optionsClassName="sm:grid-cols-2"
                />

                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-sm text-white/70">
                  <p>
                    These details help us align the right crew, reach poles, and time allowance for your visit. If anything feels unusual, pop a note below or select the bespoke option and we’ll follow up for photos before we confirm pricing.
                  </p>
                </div>
              </>
            )}

            {request.propertyCategory === 'commercial' && (
              <div className="space-y-6">
                <SelectField
                  label="What type of premises is it?"
                  value={request.commercialType}
                  onChange={(value) => handleRequestChange('commercialType', value as CommercialType)}
                  options={COMMERCIAL_TYPE_OPTIONS}
                />
                <TextArea
                  label="Anything we should know about access or glazing?"
                  placeholder="Opening hours, sections to include/exclude, preferred visit times..."
                  value={request.commercialNotes}
                  onChange={(value) => handleRequestChange('commercialNotes', value)}
                />
                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-sm text-white/70">
                  <p>
                    Commercial properties are priced individually. Share as much detail as you can here and we&apos;ll confirm availability, H&amp;S requirements, and a tailored quote once we review your request. You&apos;ll pick the specific services on the next step.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => goToStep(2)}
                className="px-7 py-3 text-sm font-semibold tracking-[0.08em]"
              >
                Continue to services
              </Button>
            </div>
          </div>

          <FormConfidencePanel
            step={1}
            servicesSelected={servicesSelected}
            manualReview={requiresManualReview}
          />
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.45fr)]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/15 bg-brand-black/30 p-6 text-sm text-white/70">
              <p className="text-sm font-semibold text-white/65">Property summary</p>
              <p className="mt-2 text-lg font-semibold text-white">{propertySummary}</p>
              {propertyExtras.length ? (
                <p className="mt-1 text-xs text-white/55">Extras: {propertyExtras.join(' · ')}</p>
              ) : (
                <p className="mt-1 text-xs text-white/55">No extras selected</p>
              )}
              <p className="mt-1 text-xs text-white/55">
                Layout: {requiresManualReview ? 'Manual quote required' : 'Standard'}
              </p>
            </div>

            <OptionSection
              title="How often would you like us to visit?"
              subtitle="Frequency helps us align you with the right round and reminder schedule."
              options={(request.propertyCategory === 'commercial'
                ? COMMERCIAL_FREQUENCY_OPTIONS
                : RESIDENTIAL_FREQUENCY_OPTIONS
              ).map((option) => ({
                id: option.id,
                title: option.label,
                description: option.helper,
                meta:
                  request.propertyCategory === 'residential'
                    ? option.id === '4'
                      ? 'Popular choice'
                      : option.id === '8'
                      ? 'Every other round'
                      : option.id === 'one-off'
                      ? 'One-time visit'
                      : undefined
                    : undefined,
              }))}
              name="visit-frequency"
              value={request.frequency}
              onChange={(value) => handleRequestChange('frequency', value as FrequencyId)}
            />

            {request.propertyCategory === 'commercial' ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Select the services you require</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {COMMERCIAL_SERVICE_OPTIONS.map((service) => (
                    <ServiceToggle
                      key={service.id}
                      label={service.label}
                      description={service.description ?? ''}
                      checked={request.commercialServices.includes(service.id)}
                      onChange={() => toggleCommercialService(service.id)}
                    />
                  ))}
                </div>
                <p className="text-xs text-white/55">
                  Need something bespoke? Tick the closest options and add detail in the notes above—our team will align the rest on the follow-up call.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <ServiceToggle
                  label="Gutter clearing"
                  description="Vacuum clearing with camera inspection on the day. One-off add-on." 
                  checked={request.includeGutter}
                  onChange={(checked) => handleRequestChange('includeGutter', checked)}
                />
                <ServiceToggle
                  label="Fascia & soffit cleaning"
                  description="Restore uPVC and finish the roofline with a bright, even glow. One-off add-on."
                  checked={request.includeFascia}
                  onChange={(checked) => handleRequestChange('includeFascia', checked)}
                />
                <div className="rounded-2xl border border-white/15 bg-white/5 p-5 text-xs text-white/60 md:col-span-2">
                  <p>
                    Add any photos or extra notes on the next step if there’s anything unusual. We’ll confirm the full quote before any work starts.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => goToStep(1)} className="px-6 py-3 text-sm font-semibold tracking-[0.08em]">
                Back to property
              </Button>
              <Button
                type="button"
                onClick={() => goToStep(3)}
                className="px-7 py-3 text-sm font-semibold tracking-[0.08em]"
              >
                Continue to details
              </Button>
            </div>
          </div>

          <FormConfidencePanel
            step={2}
            servicesSelected={servicesSelected}
            manualReview={requiresManualReview}
          />
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.45fr)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div
              className="rounded-2xl border border-white/15 bg-brand-black/40 p-5 text-sm text-white/70"
              data-testid="enquiry-summary"
            >
              <p className="text-base font-semibold text-white">You’re requesting</p>
              <p className="mt-2 text-xs text-white/60">{propertySummary}</p>
              {propertyExtras.length ? (
                <p className="text-xs text-white/55">Extras: {propertyExtras.join(' · ')}</p>
              ) : null}
              {request.propertyCategory === 'commercial' && request.commercialNotes ? (
                <p className="mt-2 text-xs text-white/55">
                  Premises notes: {request.commercialNotes}
                </p>
              ) : null}
              <p className="mt-3" data-testid="enquiry-services">
                {servicesSelected.join(', ')}
              </p>
              <p data-testid="enquiry-pricing-note">
                {frequencyLabel(request.frequency)} · Pricing confirmed after review
              </p>
              {requiresManualReview ? (
                <p className="mt-2 text-xs text-white/55" data-testid="manual-quote-note">
                  We’ve flagged this request for manual quoting so the team can confirm pricing before scheduling.
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextInput
                label="First name"
                placeholder="Alex"
                value={customer.firstName}
                onChange={(value) => handleCustomerChange('firstName', value)}
                required
              />
              <TextInput
                label="Last name"
                placeholder="Morgan"
                value={customer.lastName}
                onChange={(value) => handleCustomerChange('lastName', value)}
                required
              />
              <TextInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={customer.email}
                onChange={(value) => handleCustomerChange('email', value)}
                required
              />
              <TextInput
                label="Phone"
                placeholder="07123 456789"
                value={customer.phone}
                onChange={(value) => handleCustomerChange('phone', value)}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2 block text-sm text-white/70">
                <span className="block text-xs font-semibold text-white/65 tracking-[0.12em]">Property address</span>
                <GooglePlacesAutocomplete
                  value={customer.address}
                  onChange={(value) => handleCustomerChange('address', value)}
                  onPlaceSelected={(place) => {
                    handleCustomerChange('address', place.address)
                    handleCustomerChange('postcode', place.postcode)
                  }}
                  placeholder="Start typing your address..."
                  className="mt-2"
                />
              </label>
              <TextInput
                label="Postcode"
                placeholder="BA5 1PF"
                value={customer.postcode}
                onChange={(value) => handleCustomerChange('postcode', value.toUpperCase())}
                required
              />
            </div>

            <TextArea
              label="Anything else we should know?"
              placeholder="Parking, access notes, pets, key safe..."
              value={customer.notes}
              onChange={(value) => handleCustomerChange('notes', value)}
            />

            <input
              type="text"
              name="website"
              autoComplete="off"
              value={customer.website}
              onChange={(event) => handleCustomerChange('website', event.target.value)}
              className="hidden"
              tabIndex={-1}
            />

            <ReCaptcha onChange={handleRecaptcha} className="mt-2" />

            <div className="flex flex-wrap justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => goToStep(2)} className="px-6 py-3 text-sm font-semibold tracking-[0.08em]">
                Back to services
              </Button>
              <Button
                type="submit"
                disabled={status === 'submitting'}
                className="px-7 py-3 text-sm font-semibold tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-60 flex items-center gap-2"
              >
                {status === 'submitting' ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Sending request...</span>
                  </>
                ) : (
                  'Send request'
                )}
              </Button>
            </div>
          </form>

          <FormConfidencePanel
            step={3}
            servicesSelected={servicesSelected}
            manualReview={requiresManualReview}
          />
        </div>
      )}
    </div>
  )
}

function OptionSection({
  title,
  subtitle,
  options,
  name,
  value,
  onChange,
  optionsClassName,
}: {
  title: string
  subtitle?: string
  options: Array<{ id: string; title: string; description?: string; meta?: string }>
  name?: string
  value: string
  onChange: (value: string) => void
  optionsClassName?: string
}) {
  const sectionId = React.useId()
  const radioGroupName = name || sectionId
  const descriptionId = subtitle ? `${sectionId}-description` : undefined
  return (
    <section aria-labelledby={sectionId}>
      <div className="mb-3" id={sectionId}>
        <p className="text-sm font-semibold text-white">{title}</p>
        {subtitle ? (
          <p id={descriptionId} className="text-xs text-white/50">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div
        className={`grid gap-3 ${optionsClassName ?? 'md:grid-cols-2'}`}
        role="radiogroup"
        aria-labelledby={sectionId}
        aria-describedby={descriptionId}
      >
        {options.map((option) => {
          const active = option.id === value
          return (
            <label
              key={option.id}
              className={`relative cursor-pointer rounded-2xl border pl-5 pr-12 py-4 text-left transition duration-200 ease-out ${
                active
                  ? 'border-brand-green/60 bg-brand-green/20 text-white shadow-[0_20px_40px_-28px_rgba(22,163,74,0.55)]'
                  : 'border-white/12 bg-white/5 text-white/75 hover:-translate-y-0.5 hover:border-white/30 hover:text-white'
              }`}
            >
              <input
                type="radio"
                name={radioGroupName}
                value={option.id}
                checked={active}
                onChange={() => onChange(option.id)}
                className="sr-only"
              />
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-sm font-semibold tracking-[0.06em] text-white">{option.title}</span>
                  {option.description ? <p className="text-xs text-white/55">{option.description}</p> : null}
                </div>
                {option.meta ? <span className="rounded-full border border-white/20 px-2 py-0.5 text-xs text-white/65">{option.meta}</span> : null}
              </div>
              {active ? <CheckMark className="absolute right-4 top-4" /> : null}
            </label>
          )
        })}
      </div>
    </section>
  )
}

function ServiceToggle({
  label,
  description,
  checked,
  onChange,
  helper,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
  helper?: string
}) {
  return (
    <label
      className={`relative flex w-full cursor-pointer items-start gap-4 rounded-2xl border pl-6 pr-14 py-5 text-left transition duration-200 ease-out ${
        checked
          ? 'border-brand-green/60 bg-brand-green/20 text-white shadow-[0_20px_40px_-28px_rgba(22,163,74,0.55)]'
          : 'border-white/12 bg-white/5 text-white/75 hover:-translate-y-0.5 hover:border-white/30 hover:text-white'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
        aria-label={label}
      />
      <div className="flex flex-1 flex-col gap-3">
        <div>
          <p className="text-sm font-semibold tracking-[0.06em] text-white">{label}</p>
          <p className="mt-2 text-xs text-white/60">{description}</p>
        </div>
        {helper ? <p className="text-xs text-brand-red/80">{helper}</p> : null}
      </div>
      {checked ? (
        <CheckMark className="absolute right-5 top-5" />
      ) : (
        <span
          className="absolute right-5 top-5 inline-flex h-5 w-5 items-center justify-center rounded-md border border-white/25 bg-white/5 text-white/40"
          aria-hidden="true"
        >
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </label>
  )
}

function TextInput({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <label className="block text-sm text-white/70">
      <span className="block text-xs font-semibold text-white/65 tracking-[0.12em]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-red focus:outline-none"
      />
    </label>
  )
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <label className="block text-sm text-white/70">
      <span className="block text-xs font-semibold text-white/65 tracking-[0.12em]">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-brand-red focus:outline-none"
      />
    </label>
  )
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ id: string; label: string }>
}) {
  return (
    <label className="block text-sm text-white/70">
      <span className="block text-xs font-semibold text-white/65 tracking-[0.12em]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-brand-red focus:outline-none"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.id} value={option.id} className="bg-brand-black">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function CheckMark({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-md border border-brand-green/60 bg-brand-green/20 text-brand-green ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-3 w-3"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 11.5L8.5 15L15 7.5" />
      </svg>
    </span>
  )
}

function StepIndicator({
  currentStep,
  onStepChange,
}: {
  currentStep: Step
  onStepChange: (step: Step) => void
}) {
  return (
    <ol className="flex flex-col gap-4 text-sm sm:flex-row sm:flex-nowrap sm:items-center sm:gap-3">
      {STEP_LABELS.map((item, index) => {
        const status = item.id < currentStep ? 'complete' : item.id === currentStep ? 'current' : 'upcoming'
        const interactive = item.id < currentStep

        const buttonClasses = {
          complete:
            'border-brand-green/60 bg-brand-green/15 text-white shadow-[0_10px_28px_-24px_rgba(22,163,74,0.45)]',
          current: 'border-white/30 bg-white/10 text-white',
          upcoming: 'border-white/15 bg-white/5 text-white/55',
        }[status]

        return (
          <li key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={() => interactive && onStepChange(item.id)}
              disabled={!interactive}
              aria-current={status === 'current' ? 'step' : undefined}
              className={`flex w-full items-center gap-3 rounded-full border px-4 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/60 sm:flex-1 ${
                buttonClasses
              } ${interactive ? 'hover:border-white/40 hover:text-white' : ''}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  status === 'complete'
                    ? 'bg-brand-green text-brand-black'
                    : status === 'current'
                    ? 'bg-white text-brand-black'
                    : 'bg-white/10 text-white'
                }`}
              >
                {item.id}
              </span>
              <span className="flex flex-1 flex-col text-left">
                <span className="text-sm font-semibold text-white tracking-[0.08em] sm:text-base">
                  {item.label}
                </span>
                <span className="text-xs text-white/60">{item.helper}</span>
              </span>
              {status === 'current' ? <CheckMark className="hidden sm:inline-flex" /> : null}
            </button>
            {index < STEP_LABELS.length - 1 ? (
              <span className="hidden h-px w-8 bg-white/15 sm:block" aria-hidden />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}

function FormConfidencePanel({
  step,
  servicesSelected,
  manualReview,
}: {
  step: Step
  servicesSelected: string[]
  manualReview: boolean
}) {
  const copy = CONFIDENCE_COPY[step]
  const showCurrentSelection = step !== 1 && servicesSelected.length > 0

  return (
    <aside className="flex flex-col gap-5 rounded-2xl border border-white/12 bg-brand-black/40 p-5 text-sm text-white/70 lg:sticky lg:top-6">
      <div>
        <p className="text-base font-semibold text-white">{copy.heading}</p>
        <ul className="mt-3 space-y-2 list-none pl-0">
          {copy.points.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <CheckMark className="mt-0.5 flex-none" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {showCurrentSelection ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
          <p className="text-sm font-semibold text-white">Current selection</p>
          <p className="mt-2 text-xs text-white/60">Services: {servicesSelected.join(', ')}</p>
          {manualReview ? (
            <p className="mt-1 text-xs text-white/60" data-testid="manual-quote-banner">
              Manual quote required – we’ll confirm pricing with you directly.
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="text-sm font-semibold text-white">Talk to a person</p>
        <p className="mt-2 leading-relaxed">{copy.helper}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold text-white">
          <a
            href="tel:01458860339"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 transition hover:border-white/40 hover:text-white"
          >
            Call 01458 860339
          </a>
          <a
            href="mailto:info@somersetwindowcleaning.co.uk"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1.5 transition hover:border-white/40 hover:text-white"
          >
            Email the team
          </a>
        </div>
      </div>
    </aside>
  )
}
