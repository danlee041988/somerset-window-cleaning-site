"use client"

import React from 'react'
import emailjs from '@emailjs/browser'
import Button from '@/components/ui/Button'
import ReCaptcha from '@/components/features/contact/ReCaptcha'
import SimpleAddressInput from '@/components/features/contact/SimpleAddressInput'
import { analytics } from '@/lib/analytics'

const SERVICE_ID = (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '').trim()
const TEMPLATE_ID = (process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_booking_form').trim()
const PUBLIC_KEY = (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '').trim()
const GO_CARDLESS_URL = process.env.NEXT_PUBLIC_GOCARDLESS_PAYMENT_URL

const DETACHED_SURCHARGE = 5
const EXTENSION_SURCHARGE = 5
const CONSERVATORY_SURCHARGE = 5
const TOWNHOUSE_WINDOW_SURCHARGE = 5
const TOWNHOUSE_GUTTER_SURCHARGE = 20
const TOWNHOUSE_FASCIA_SURCHARGE = 20

const formatCurrency = (value: number) => `£${value.toFixed(0)}`

type PropertyCategory = 'residential' | 'commercial'
type BedroomBand = '1-2' | '3' | '4' | '5' | '6+'
type PropertyType =
  | 'terraced'
  | 'semi'
  | 'detached'
  | 'bungalow'
  | 'townhouse'
  | 'flat'
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

type SuccessSummaryState = {
  total: string
  services: string
  frequency: string
  breakdown: Array<{ label: string; value: string }>
  discountNote: string
  manualQuote: boolean
}

const CONFIDENCE_COPY: Record<Step, { heading: string; points: string[]; helper: string }> = {
  1: {
    heading: 'Why people book with us',
    points: [
      'Reply within one working day with available slots',
      'No payment due until the clean is complete',
      'Reminder text before every visit with easy rescheduling',
    ],
    helper: 'Prefer a quick chat? Call 01458 860339 or send us a WhatsApp message.',
  },
  2: {
    heading: 'Your plan so far',
    points: [
      'Live pricing updates as you toggle services on or off',
      'Bundle gutter & fascia care to unlock complimentary window cleaning',
      'We double-check access and timings before confirming the round',
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

const GUTTER_BASE_PRICING: Record<BedroomBand, Record<'semi' | 'detached', number>> = {
  '1-2': { semi: 70, detached: 90 },
  '3': { semi: 80, detached: 100 },
  '4': { semi: 100, detached: 120 },
  '5': { semi: 120, detached: 140 },
  '6+': { semi: 140, detached: 160 },
}

const FASCIA_BASE_PRICING: Record<BedroomBand, Record<'semi' | 'detached', number>> = {
  '1-2': { semi: 90, detached: 110 },
  '3': { semi: 100, detached: 120 },
  '4': { semi: 120, detached: 140 },
  '5': { semi: 140, detached: 160 },
  '6+': { semi: 160, detached: 180 },
}

const STEP_LABELS: Array<{ id: Step; label: string; helper: string }> = [
  { id: 1, label: 'Property', helper: 'Share your property basics' },
  { id: 2, label: 'Services', helper: 'Pick the services you need' },
  { id: 3, label: 'Your details', helper: 'Add your contact information' },
]

const SERVICE_PRESET_MAP: Record<string, (state: PricingState) => PricingState> = {
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

const normalisePropertyTypeForPricing = (propertyType: PropertyType): 'semi' | 'detached' => {
  switch (propertyType) {
    case 'detached':
    case 'bungalow':
      return 'detached'
    default:
      return 'semi'
  }
}

const getGutterPrice = (bedrooms: BedroomBand, propertyType: PropertyType): number => {
  const bedroomPrices = GUTTER_BASE_PRICING[bedrooms] ?? GUTTER_BASE_PRICING['3']
  const normalisedType = normalisePropertyTypeForPricing(propertyType)
  return bedroomPrices?.[normalisedType] ?? bedroomPrices?.semi ?? 80
}

const getFasciaPrice = (bedrooms: BedroomBand, propertyType: PropertyType): number => {
  const bedroomPrices = FASCIA_BASE_PRICING[bedrooms] ?? FASCIA_BASE_PRICING['3']
  const normalisedType = normalisePropertyTypeForPricing(propertyType)
  return bedroomPrices?.[normalisedType] ?? bedroomPrices?.semi ?? 100
}

type PricingState = {
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

const BEDROOM_OPTIONS: Array<{
  id: BedroomBand
  label: string
  description: string
  price: number
}> = [
  {
    id: '1-2',
    label: '1-2 bedrooms',
    description: 'Compact terraces, semis, or flats.',
    price: 22,
  },
  {
    id: '3',
    label: '3 bedrooms',
    description: 'Typical family homes across Somerset.',
    price: 25,
  },
  {
    id: '4',
    label: '4 bedrooms',
    description: 'Roomier homes up to two storeys.',
    price: 30,
  },
  {
    id: '5',
    label: '5 bedrooms',
    description: 'Large detached or extended properties.',
    price: 35,
  },
  {
    id: '6+',
    label: '6+ bedrooms',
    description: 'Estates, annexes, or multi-dwelling homes (manual quote).',
    price: 40,
  },
]

const PROPERTY_STYLE_OPTIONS: Array<{
  id: PropertyType
  label: string
  description: string
}> = [
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

const PROPERTY_CATEGORY_OPTIONS: Array<{
  id: PropertyCategory
  title: string
  description?: string
}> = [
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
    description: 'Pure-water pole or cradle work for frontage and elevation glass.',
  },
  {
    id: 'internal_windows',
    label: 'Internal window cleaning',
    description: 'Lobby, partition, and internal glazing wiped and detailed.',
  },
  {
    id: 'signage',
    label: 'Signage & cladding washing',
    description: 'Keep fascia signage, suits, and canopy panels presentable.',
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

const RESIDENTIAL_FREQUENCY_OPTIONS: Array<{
  id: FrequencyId
  label: string
  helper: string
}> = [
  {
    id: '4',
    label: 'Every 4 weeks',
    helper: 'Our core round – keeps frames spotless',
  },
  {
    id: '8',
    label: 'Every 8 weeks',
    helper: 'Bi-monthly for lower traffic homes',
  },
  {
    id: 'one-off',
    label: 'One-off clean',
    helper: 'Perfect before events or listings',
  },
]

const COMMERCIAL_FREQUENCY_OPTIONS: Array<{
  id: FrequencyId
  label: string
  helper: string
}> = [
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
    id: 'monthly',
    label: 'Every month',
    helper: 'Popular for offices and shared workspace.',
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
    helper: 'Let us know when you need a visit and we’ll align availability.',
  },
]

const INITIAL_PRICING_STATE: PricingState = {
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
  defaultIntent = 'book',
  defaultPostcode = '',
  className = '',
  defaultService = '',
}: BookingFormProps) {
  const [step, setStep] = React.useState<Step>(1)
  const [pricing, setPricing] = React.useState<PricingState>(INITIAL_PRICING_STATE)
  const [customer, setCustomer] = React.useState<CustomerState>(
    initialCustomerState(defaultIntent, defaultPostcode, defaultAddress),
  )
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(null)
  const [successSummary, setSuccessSummary] = React.useState<SuccessSummaryState>({
    total: '',
    services: '',
    frequency: '',
    breakdown: [],
    discountNote: '',
    manualQuote: false,
  })

  const startTime = React.useRef<number>(Date.now())

  const goToStep = (next: Step) => {
    setErrorMessage(null)
    setStep(next)
    if (typeof window !== 'undefined') {
      const prefersReducedMotion =
        typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
  }

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
    setPricing((prev) => {
      const preset = SERVICE_PRESET_MAP[presetKey]
      if (!preset) return prev
      return preset(prev)
    })
  }, [defaultService])

  const windowBase = BEDROOM_OPTIONS.find((option) => option.id === pricing.bedrooms)?.price ?? 0
  const normalisedPropertyType = normalisePropertyTypeForPricing(pricing.propertyType)
  const detachedFee = normalisedPropertyType === 'detached' ? DETACHED_SURCHARGE : 0
  const conservatoryFee = pricing.hasConservatory ? CONSERVATORY_SURCHARGE : 0
  const townhouseWindowFee = pricing.propertyType === 'townhouse' ? TOWNHOUSE_WINDOW_SURCHARGE : 0
  const baseWindowPrice = windowBase + detachedFee + townhouseWindowFee
  const oneOffWindowPrice = baseWindowPrice > 0 ? Math.ceil((baseWindowPrice * 1.3) / 5) * 5 : 0
  const baseGutterPrice = getGutterPrice(pricing.bedrooms, pricing.propertyType)
  const baseFasciaPrice = getFasciaPrice(pricing.bedrooms, pricing.propertyType)
  const requiresManualQuote =
    pricing.isBespoke || pricing.propertyCategory === 'commercial' || pricing.bedrooms === '6+'
  const windowBundleUnlocked =
    !requiresManualQuote &&
    pricing.propertyCategory === 'residential' &&
    pricing.includeGutter &&
    pricing.includeFascia
  const extensionFee = pricing.hasExtension ? (windowBundleUnlocked ? 0 : EXTENSION_SURCHARGE) : 0
  const windowPrice = windowBundleUnlocked
    ? 0
    : pricing.frequency === 'one-off'
    ? oneOffWindowPrice
    : baseWindowPrice
  const gutterPrice = pricing.includeGutter
    ? baseGutterPrice + (pricing.propertyType === 'townhouse' ? TOWNHOUSE_GUTTER_SURCHARGE : 0)
    : 0
  const fasciaPrice = pricing.includeFascia
    ? baseFasciaPrice + (pricing.propertyType === 'townhouse' ? TOWNHOUSE_FASCIA_SURCHARGE : 0)
    : 0
  const visitTotal = windowPrice + gutterPrice + fasciaPrice + extensionFee + conservatoryFee
  const discountNote = windowBundleUnlocked
    ? 'Window cleaning included with gutter & fascia bundle.'
    : ''
  const residentialWindowNote =
    pricing.propertyCategory === 'residential' && pricing.hasConservatory
      ? 'Conservatory windows are included with your exterior clean when selected.'
      : ''

  const getFrequencyMeta = (frequencyId: FrequencyId) => {
    if (pricing.propertyCategory !== 'residential') return undefined

    const bundledLabel = 'Included with gutter & fascia bundle'
    const basePriceLabel = baseWindowPrice > 0 ? formatCurrency(baseWindowPrice) : undefined

    switch (frequencyId) {
      case '4':
      case '8':
        return windowBundleUnlocked ? bundledLabel : basePriceLabel
      case 'one-off':
        if (windowBundleUnlocked) return bundledLabel
        return oneOffWindowPrice > 0 ? formatCurrency(oneOffWindowPrice) : undefined
      default:
        return undefined
    }
  }

  const servicesSelected = React.useMemo(() => {
    const services: string[] = []

    if (pricing.propertyCategory === 'commercial') {
      if (pricing.commercialServices.length) {
        services.push(
          ...pricing.commercialServices.map((serviceId) => commercialServiceLabel(serviceId)),
        )
      } else {
        services.push('Commercial enquiry – services to be confirmed')
      }
    } else {
      services.push('Window Cleaning')
      if (pricing.includeGutter) services.push('Gutter Clearing (one-off add-on)')
      if (pricing.includeFascia) services.push('Fascia & Soffit Cleaning (one-off add-on)')
      if (pricing.hasExtension) {
        services.push(
          windowBundleUnlocked
            ? 'Extension allowance (included with gutter & fascia bundle)'
            : 'Extension allowance (one-off add-on)',
        )
      }
      if (pricing.hasConservatory)
        services.push(`Conservatory windows (+£${CONSERVATORY_SURCHARGE} per visit)`)
    }

    if (requiresManualQuote) services.push('Manual quote required')
    return services
  }, [
    pricing.includeGutter,
    pricing.includeFascia,
    pricing.hasExtension,
    pricing.hasConservatory,
    pricing.propertyCategory,
    pricing.commercialServices,
    requiresManualQuote,
    windowBundleUnlocked,
  ])

  const propertySummary =
    pricing.propertyCategory === 'commercial'
      ? `Commercial property${pricing.commercialType ? ` · ${commercialTypeLabel(pricing.commercialType)}` : ''}`
      : `${bedroomLabel(pricing.bedrooms)} · ${propertyTypeLabel(pricing.propertyType)}`
  const propertyExtras = [
    pricing.hasExtension ? 'Extension or porch' : null,
    pricing.hasConservatory ? 'Conservatory windows included' : null,
  ].filter(Boolean) as string[]

  const handlePricingChange = <K extends keyof PricingState>(key: K, value: PricingState[K]) => {
    setPricing((prev) => {
      if (key === 'propertyCategory') {
        const category = value as PropertyCategory
        const commercialFrequencyIds = COMMERCIAL_FREQUENCY_OPTIONS.map((option) => option.id)
        return {
          ...prev,
          propertyCategory: category,
          commercialType: '',
          commercialNotes: '',
          commercialServices: [],
          isBespoke: category === 'commercial' ? false : prev.isBespoke,
          frequency:
            category === 'commercial'
              ? (COMMERCIAL_FREQUENCY_OPTIONS[0]?.id ?? 'monthly')
              : commercialFrequencyIds.includes(prev.frequency)
              ? '4'
              : prev.frequency,
          ...(category === 'commercial'
            ? {
                includeGutter: false,
                includeFascia: false,
                hasExtension: false,
                hasConservatory: false,
              }
            : {}),
        }
      }

      if (key === 'commercialType') {
        return { ...prev, commercialType: value as CommercialType | '' }
      }

      if (key === 'commercialNotes') {
        return { ...prev, commercialNotes: value as string }
      }

      if (key === 'bedrooms') {
        return { ...prev, bedrooms: value as BedroomBand }
      }

      if (key === 'propertyType') {
        return { ...prev, propertyType: value as PropertyType }
      }

      if (key === 'isBespoke') {
        return { ...prev, isBespoke: Boolean(value) }
      }

      return { ...prev, [key]: value }
    })
  }

  const toggleCommercialService = (serviceId: string) => {
    setPricing((prev) => {
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
      pricing.propertyCategory === 'commercial' ? 'Not applicable' : bedroomLabel(pricing.bedrooms)
    const propertyText =
      pricing.propertyCategory === 'commercial' ? 'Not applicable' : propertyTypeLabel(pricing.propertyType)
    const frequencyText = frequencyLabel(pricing.frequency)
    const pricingLines: string[] = []
    const confirmationBreakdown: Array<{ label: string; value: string }> = []

    if (pricing.propertyCategory === 'commercial') {
      if (pricing.commercialServices.length) {
        pricingLines.push(
          ...pricing.commercialServices.map(
            (serviceId) => `Commercial service: ${commercialServiceLabel(serviceId)}`,
          ),
        )
        confirmationBreakdown.push({
          label: 'Commercial services',
          value: pricing.commercialServices
            .map((serviceId) => commercialServiceLabel(serviceId))
            .join(', '),
        })
      } else {
        pricingLines.push('Commercial services to be confirmed with our team')
        confirmationBreakdown.push({
          label: 'Commercial services',
          value: 'To be confirmed with our commercial team',
        })
      }
    } else {
      const windowValue = requiresManualQuote
        ? 'To be confirmed'
        : windowBundleUnlocked
        ? 'Included with gutter & fascia bundle'
        : formatCurrency(windowPrice)
      confirmationBreakdown.push({ label: 'Window cleaning', value: windowValue })
      if (requiresManualQuote) {
        pricingLines.push('Window cleaning – To be confirmed (manual quote required)')
      } else if (windowBundleUnlocked) {
      pricingLines.push('Window cleaning – Included with gutter & fascia bundle')
      } else {
        pricingLines.push(`Window cleaning – ${formatCurrency(windowPrice)}`)
      }

      if (pricing.includeGutter) {
        confirmationBreakdown.push({
          label: 'Gutter clearing',
          value: requiresManualQuote ? 'To be confirmed' : formatCurrency(gutterPrice),
        })
        pricingLines.push(
          requiresManualQuote
            ? 'Gutter clearing (one-off) – To be confirmed'
            : `Gutter clearing (one-off) – ${formatCurrency(gutterPrice)}`,
        )
      }
      if (pricing.includeFascia) {
        confirmationBreakdown.push({
          label: 'Fascia & soffit cleaning',
          value: requiresManualQuote ? 'To be confirmed' : formatCurrency(fasciaPrice),
        })
        pricingLines.push(
          requiresManualQuote
            ? 'Fascia & soffit cleaning (one-off) – To be confirmed'
            : `Fascia & soffit cleaning (one-off) – ${formatCurrency(fasciaPrice)}`,
        )
      }
      if (pricing.hasExtension) {
        confirmationBreakdown.push({
          label: 'Extension allowance',
          value: requiresManualQuote
            ? 'To be confirmed'
            : windowBundleUnlocked
            ? 'Included with gutter & fascia bundle'
            : `+${formatCurrency(EXTENSION_SURCHARGE)} per visit`,
        })
        pricingLines.push(
          requiresManualQuote
            ? 'Extension allowance (one-off) – To be confirmed'
            : windowBundleUnlocked
            ? 'Extension allowance – Included with gutter & fascia bundle'
            : `Extension allowance (one-off) – +£${EXTENSION_SURCHARGE}`,
        )
      }
      if (pricing.hasConservatory) {
        confirmationBreakdown.push({
          label: 'Conservatory windows',
          value: requiresManualQuote ? 'To be confirmed' : `+${formatCurrency(CONSERVATORY_SURCHARGE)} per visit`,
        })
        pricingLines.push(
          requiresManualQuote
            ? 'Conservatory windows – To be confirmed'
            : `Conservatory windows – +£${CONSERVATORY_SURCHARGE} per visit`,
        )
      }
    }

    if (pricing.propertyCategory !== 'commercial') {
      pricingLines.push(
        requiresManualQuote
          ? 'Per visit total – To be confirmed after team review'
          : `Per visit total – ${formatCurrency(visitTotal)}`
      )
    }

    const summarySections = [
      'Customer',
      `- Name: ${customer.firstName} ${customer.lastName}`,
      `- Email: ${customer.email}`,
      `- Phone: ${customer.phone}`,
      '',
      'Property & Services',
      pricing.propertyCategory === 'residential' ? `- Bedrooms: ${bedroomText}` : null,
      pricing.propertyCategory === 'residential' ? `- Property type: ${propertyText}` : null,
      pricing.propertyCategory === 'commercial'
        ? `- Premises type: ${pricing.commercialType ? commercialTypeLabel(pricing.commercialType) : 'Not specified'}`
        : null,
      `- Layout: ${requiresManualQuote ? 'Manual quote required' : 'Standard'}`,
      `- Property category: ${pricing.propertyCategory === 'commercial' ? 'Commercial' : 'Residential'}`,
      `- Extras: ${propertyExtras.length ? propertyExtras.join(', ') : 'None noted'}`,
      `- Postcode: ${customer.postcode.toUpperCase()}`,
      `- Address: ${customer.address}`,
      `- Frequency: ${frequencyText}`,
      `- Services: ${servicesSelected.join(', ')}`,
      discountNote ? `- Offer: ${discountNote}` : null,
      '',
      'Pricing',
      ...pricingLines.map((line) => `- ${line}`),
      '',
      'Notes',
      `${customer.notes || 'No additional notes supplied.'}`,
    ].filter(Boolean) as string[]

    const summaryPlaintext = summarySections.join('\n')
    const now = new Date()
    const submittedAt = now.toLocaleString('en-GB')

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
      property_category: pricing.propertyCategory,
      commercial_type:
        pricing.propertyCategory === 'commercial'
          ? commercialTypeLabel(pricing.commercialType)
          : 'Not applicable',
      commercial_notes:
        pricing.propertyCategory === 'commercial'
          ? pricing.commercialNotes || 'No additional commercial notes provided.'
          : 'Not applicable',
      commercial_services:
        pricing.propertyCategory === 'commercial'
          ? pricing.commercialServices.length
            ? pricing.commercialServices
                .map((serviceId) => commercialServiceLabel(serviceId))
                .join(', ')
            : 'Services not specified'
          : 'Not applicable',
      service_frequency: frequencyText,
      services_list: servicesSelected.join(', '),
      services_json: JSON.stringify(servicesSelected),
      pricing_total: requiresManualQuote ? 'To be confirmed' : formatCurrency(visitTotal),
      pricing_breakdown: pricingLines.join('\n'),
      pricing_discount_note: discountNote,
      window_price: requiresManualQuote
        ? 'To be confirmed'
        : windowPrice
        ? formatCurrency(windowPrice)
        : 'Included',
      gutter_price: pricing.includeGutter
        ? requiresManualQuote
          ? 'To be confirmed'
          : formatCurrency(gutterPrice)
        : 'Not selected',
      fascia_price: pricing.includeFascia
        ? requiresManualQuote
          ? 'To be confirmed'
          : formatCurrency(fasciaPrice)
        : 'Not selected',
      extension_price: pricing.hasExtension
        ? requiresManualQuote
          ? 'To be confirmed'
          : `+${formatCurrency(EXTENSION_SURCHARGE)}`
        : 'Not selected',
      conservatory_price: pricing.hasConservatory
        ? requiresManualQuote
          ? 'To be confirmed'
          : `+${formatCurrency(CONSERVATORY_SURCHARGE)} per visit`
        : 'Not selected',
      property_is_bespoke: pricing.isBespoke ? 'Yes' : 'No',
      manual_quote_required: requiresManualQuote ? 'Yes' : 'No',
      property_extras: propertyExtras.length ? propertyExtras.join(', ') : 'None',
      frequency_match: 'Manual follow-up required',
      frequency_service_days: 'To be aligned',
      coverage_status: 'pending',
      coverage_label: 'Pending round confirmation',
      selected_date_option_id: 'pricing-first-flow',
      selected_date_match_label: frequencyText,
      pricing_lines_json: JSON.stringify(pricingLines),
      submitted_at: submittedAt,
      recaptcha_token: recaptchaToken,
      'g-recaptcha-response': recaptchaToken,
      summary_plaintext: summaryPlaintext,
      raw_payload_json: JSON.stringify(
        {
          pricing,
          customer: { ...customer, website: undefined },
          totals: {
            windowPrice,
            gutterPrice,
            fasciaPrice,
            visitTotal,
          },
          discountNote,
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
        serviceType: servicesSelected.join(', '),
        propertySize: bedroomText,
        customerType: customer.customerType,
        email: customer.email,
      })

      setSuccessSummary({
        total: requiresManualQuote ? 'To be confirmed' : formatCurrency(visitTotal),
        services: servicesSelected.join(', '),
        frequency: frequencyText,
        breakdown: confirmationBreakdown,
        discountNote,
        manualQuote: requiresManualQuote,
      })
      setStatus('success')
      setStep(1)
      setPricing(INITIAL_PRICING_STATE)
      setCustomer(initialCustomerState(defaultIntent, defaultPostcode, defaultAddress))
      setRecaptchaToken(null)
      startTime.current = Date.now()
    } catch (error) {
      const serviceError = error as { status?: number; text?: string } | undefined
      console.error('Booking form submission error:', serviceError ?? error)
      const errorMessage =
        serviceError?.text?.trim()
          ? `Email service error: ${serviceError.text}`
          : error instanceof Error
          ? error.message
          : 'Unknown error'
      analytics.formError('submission_failure', errorMessage)
      setStatus('error')
      if (serviceError?.status === 400 && serviceError?.text) {
        setErrorMessage(`Email service error: ${serviceError.text}`)
      } else {
        setErrorMessage('Something went wrong sending your request. Please try again or call 01458 860339.')
      }
    } finally {
      setStatus((prev) => (prev === 'submitting' ? 'idle' : prev))
    }
  }

  if (status === 'success') {
    return (
      <div className={`rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 text-center shadow-[0_30px_70px_-45px_rgba(225,29,42,0.45)] ${className}`} role="status" aria-live="polite">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white">Request received!</h2>
        <p className="mt-3 text-white/70">
          Thank you – we’ll align your postcode with the right round and confirm within one working day.
        </p>
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6 text-left text-sm text-white/70">
          <p className="text-base font-semibold text-white">Visit summary</p>
          <dl className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-white/50">Services</dt>
              <dd className="flex-1 text-right text-sm text-white">{successSummary.services || 'We’ll confirm on the follow-up call'}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-white/50">Frequency</dt>
              <dd className="text-sm text-white">{successSummary.frequency || 'To be confirmed'}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt className="text-xs uppercase tracking-[0.12em] text-white/50">Per visit total</dt>
              <dd className="text-lg font-semibold text-white">{successSummary.total}</dd>
            </div>
          </dl>

          {successSummary.breakdown.length ? (
            <div className="mt-4 space-y-2">
              {successSummary.breakdown.map((item) => (
                <div key={`${item.label}-${item.value}`} className="flex items-start justify-between gap-3 text-xs">
                  <span className="text-white/55">{item.label}</span>
                  <span className="text-white/80 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          ) : null}

          {successSummary.discountNote ? (
            <p className="mt-3 text-xs text-emerald-400">{successSummary.discountNote}</p>
          ) : null}

          {successSummary.manualQuote ? (
            <p className="mt-3 text-xs text-white/55">
              We&rsquo;ve flagged this request for manual pricing. Our team will double-check glazing and confirm costs before the visit is scheduled.
            </p>
          ) : null}

          <p className="mt-3 text-xs text-white/55">
            Prices are based on standard property sizes. If we think extra time is needed we&rsquo;ll let you know before we start any work.
          </p>
          <p className="mt-2 text-xs text-white/50">
            We reach most Velux windows with our poles and clean every window we can safely access.
          </p>
        </div>

        {GO_CARDLESS_URL ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-6 text-left text-sm text-white/75">
            <p className="text-base font-semibold text-white">Make payments easier with Direct Debit</p>
            <p className="mt-2 text-xs text-white/60">
              Set up GoCardless once and we&rsquo;ll only bill you after each visit. No need to be home or remember transfers.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-white/70 list-disc list-inside">
              <li>Charged only after the clean is complete</li>
              <li>Email receipts after every visit</li>
              <li>Pause or cancel any time in a couple of taps</li>
              <li>Protected by the Direct Debit Guarantee</li>
            </ul>
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
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-white/60">
          <span>Need urgent help? Call 01458 860339.</span>
          <Button onClick={() => setStatus('idle')} className="px-6 py-2 text-sm font-semibold tracking-[0.08em]">
            Send another request
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-3xl border border-white/15 bg-white/5 p-6 md:p-8 ${className}`}>
      <header className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/60">Step {step} of {TOTAL_STEPS}</p>
            <h1 className="text-2xl font-semibold text-white">Book your clean</h1>
            <p className="text-sm text-white/60">
              Share your property details, choose the services you need, then confirm your visit in minutes.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-brand-black/40 px-3 py-2 text-sm text-white/65">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400"></span>
            Pricing updates live as you choose options
          </div>
        </div>
        <StepIndicator
          currentStep={step}
          onStepChange={(target) => {
            if (target < step) {
              goToStep(target)
            }
          }}
        />
      </header>

      {errorMessage ? (
        <div
          className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200"
          role="alert"
          aria-live="assertive"
        >
          {errorMessage}
        </div>
      ) : null}

      {status === 'error' && !errorMessage ? (
        <div
          className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200"
          role="alert"
          aria-live="assertive"
        >
          Something went wrong sending your request. Please try again or call 01458 860339.
        </div>
      ) : null}

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
              value={pricing.propertyCategory}
              onChange={(value) => handlePricingChange('propertyCategory', value as PropertyCategory)}
              optionsClassName="sm:grid-cols-2"
            />

            {pricing.propertyCategory === 'residential' && (
              <>
              <OptionSection
                title="How many bedrooms do you have?"
                subtitle="A quick guide helps us estimate glazing coverage and visit time."
                options={BEDROOM_OPTIONS.map((option) => ({
                  id: option.id,
                  title: option.label,
                  description: option.description,
                }))}
                name="property-bedrooms"
                value={pricing.bedrooms}
                onChange={(value) => handlePricingChange('bedrooms', value as BedroomBand)}
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
                  value={pricing.propertyType}
                  onChange={(value) => handlePricingChange('propertyType', value as PropertyType)}
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
                  value={pricing.isBespoke ? 'bespoke' : 'standard'}
                  onChange={(value) => handlePricingChange('isBespoke', value === 'bespoke')}
                  optionsClassName="md:grid-cols-2"
                />

                <OptionSection
                  title="Do you have an extension or porch?"
                  options={[
                    { id: 'yes', title: 'Yes' },
                    { id: 'no', title: 'No' },
                  ]}
                  name="property-extension"
                  value={pricing.hasExtension ? 'yes' : 'no'}
                  onChange={(value) => handlePricingChange('hasExtension', value === 'yes')}
                  optionsClassName="sm:grid-cols-2"
                />

                <OptionSection
                  title="Do you have a conservatory?"
                  options={[
                    { id: 'yes', title: 'Yes' },
                    { id: 'no', title: 'No' },
                  ]}
                  name="property-conservatory"
                  value={pricing.hasConservatory ? 'yes' : 'no'}
                  onChange={(value) => handlePricingChange('hasConservatory', value === 'yes')}
                  optionsClassName="sm:grid-cols-2"
                />
                <p className="text-xs text-white/60">
                  We include conservatory windows when selected and reflect the additional time in your visit total. Conservatory roof cleaning is quoted separately—add a note if you&rsquo;d like that too.
                </p>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-6 text-sm text-white/70">
                  <p>
                    These details help us align the right crew, reach poles, and time allowance for your visit. If anything feels unusual, pop a note below or select the bespoke option and we’ll follow up for photos before we confirm pricing.
                  </p>
                </div>
              </>
            )}

            {pricing.propertyCategory === 'commercial' && (
              <div className="space-y-6">
                <SelectField
                  label="What type of premises is it?"
                  value={pricing.commercialType}
                  onChange={(value) => handlePricingChange('commercialType', value as CommercialType)}
                  options={COMMERCIAL_TYPE_OPTIONS}
                />
                <TextArea
                  label="Anything we should know about access or glazing?"
                  placeholder="Opening hours, sections to include/exclude, preferred visit times..."
                  value={pricing.commercialNotes}
                  onChange={(value) => handlePricingChange('commercialNotes', value)}
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
            visitTotal={visitTotal}
            requiresManualQuote={requiresManualQuote}
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
                Layout: {requiresManualQuote ? 'Manual quote required' : 'Standard'}
              </p>
            </div>

          <OptionSection
            title="How often would you like us to visit?"
            subtitle="Frequency helps us align you with the right round and reminder schedule."
            options={(pricing.propertyCategory === 'commercial'
              ? COMMERCIAL_FREQUENCY_OPTIONS
              : RESIDENTIAL_FREQUENCY_OPTIONS
            ).map((option) => ({
              id: option.id,
              title: option.label,
              description: option.helper,
              meta: getFrequencyMeta(option.id as FrequencyId),
            }))}
            name="visit-frequency"
            value={pricing.frequency}
            onChange={(value) => handlePricingChange('frequency', value as FrequencyId)}
          />

            {pricing.propertyCategory === 'commercial' ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-white">Select the services you require</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {COMMERCIAL_SERVICE_OPTIONS.map((service) => (
                    <ServiceToggle
                      key={service.id}
                      label={service.label}
                      description={service.description ?? ''}
                      checked={pricing.commercialServices.includes(service.id)}
                      onChange={(_checked) => toggleCommercialService(service.id)}
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
                  price={requiresManualQuote ? 'To be confirmed' : formatCurrency(getGutterPrice(pricing.bedrooms, pricing.propertyType))}
                  checked={pricing.includeGutter}
                  onChange={(checked) => handlePricingChange('includeGutter', checked)}
                />
                <ServiceToggle
                  label="Fascia & soffit cleaning"
                  description="Restore uPVC and finish the roofline with a bright, even glow. One-off add-on."
                  price={requiresManualQuote ? 'To be confirmed' : formatCurrency(getFasciaPrice(pricing.bedrooms, pricing.propertyType))}
                  checked={pricing.includeFascia}
                  onChange={(checked) => handlePricingChange('includeFascia', checked)}
                  helper={
                    requiresManualQuote
                      ? undefined
                      : 'Select this with gutter clearing and your window clean is complimentary.'
                  }
                />
                <p className="md:col-span-2 text-xs text-white/55">
                  Gutter and fascia cleans are one-off visits—add them when you need a refresh.
                </p>
              </div>
            )}

            <div className="rounded-2xl border border-white/15 bg-brand-black/40 p-5 text-sm text-white/70">
              <div
                className={`flex flex-wrap items-start gap-3 ${
                  pricing.propertyCategory !== 'commercial' ? 'justify-between' : ''
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-white/70">You’re building</p>
                  <p className="text-white font-semibold">{servicesSelected.join(', ')}</p>
                  <p className="text-xs text-white/55">{frequencyLabel(pricing.frequency)}</p>
                </div>
                {pricing.propertyCategory !== 'commercial' ? (
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white/70">Per visit total</p>
                    <span className="text-2xl font-semibold text-white" data-testid="visit-total">
                      {requiresManualQuote ? 'To be confirmed' : formatCurrency(visitTotal)}
                    </span>
                  </div>
                ) : null}
              </div>

              <div className="mt-4 grid gap-3 text-xs text-white/60 md:grid-cols-2">
                {pricing.propertyCategory === 'commercial' ? (
                pricing.commercialServices.length ? (
                  pricing.commercialServices.map((serviceId) => (
                    <p
                      key={serviceId}
                      data-testid={serviceId === 'external_windows' ? 'window-line' : undefined}
                    >
                      {commercialServiceLabel(serviceId)}
                    </p>
                  ))
                ) : (
                  <p>Services to be confirmed with our commercial team</p>
                )
                ) : (
                  <>
                  <div>
                    <p className="text-white/80">Window cleaning</p>
                    <p data-testid="window-line">
                      {requiresManualQuote
                        ? 'Manual quote required'
                        : windowBundleUnlocked
                        ? 'Included with gutter & fascia bundle'
                        : formatCurrency(windowPrice)}
                    </p>
                  </div>
                  {pricing.includeGutter ? (
                    <div>
                      <p className="text-white/80">Gutter clearing</p>
                      <p data-testid="gutter-line">
                        {requiresManualQuote ? 'Manual quote required' : formatCurrency(gutterPrice)}
                      </p>
                    </div>
                  ) : null}
                  {pricing.includeFascia ? (
                    <div>
                      <p className="text-white/80">Fascia & soffit cleaning</p>
                      <p data-testid="fascia-line">
                        {requiresManualQuote ? 'Manual quote required' : formatCurrency(fasciaPrice)}
                      </p>
                    </div>
                  ) : null}
                  {pricing.hasExtension ? (
                    <div>
                      <p className="text-white/80">Extension allowance</p>
                      <p data-testid="extension-line">
                        {requiresManualQuote
                          ? 'Manual quote required'
                          : windowBundleUnlocked
                          ? 'Included with gutter & fascia bundle'
                          : `+${formatCurrency(EXTENSION_SURCHARGE)} per visit`}
                      </p>
                    </div>
                  ) : null}
                  {pricing.hasConservatory ? (
                    <div>
                      <p className="text-white/80">Conservatory windows</p>
                      <p data-testid="conservatory-line">
                        {requiresManualQuote
                          ? 'Manual quote required'
                          : `+${formatCurrency(CONSERVATORY_SURCHARGE)} per visit`}
                      </p>
                    </div>
                  ) : null}
                  </>
                )}
              </div>

              <p className="mt-3 text-xs text-white/50">
                We reach most Velux windows with our poles and will clean those we can safely access, but some roof windows may remain out of reach.
              </p>
              {pricing.propertyCategory === 'commercial' ? (
                <p className="mt-2 text-xs text-white/55">
                  We’ll confirm your bespoke schedule and pricing once we review these details.
                </p>
              ) : null}
              <p className="mt-2 text-xs text-emerald-400">
                {requiresManualQuote
                  ? 'We’ll confirm your tailored quote after reviewing these details.'
                  : windowBundleUnlocked
                  ? 'Bundle locked – window cleaning is complimentary with gutter and fascia selected.'
                  : 'Add gutter clearing and fascia cleaning together to unlock a complimentary window clean.'}
              </p>
              {residentialWindowNote ? (
                <p className="mt-2 text-xs text-white/55">{residentialWindowNote}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => goToStep(1)} className="px-6 py-3 text-sm font-semibold tracking-[0.08em]">
                Back to property
              </Button>
              <Button
                type="button"
                onClick={() => goToStep(3)}
                disabled={
                  pricing.propertyCategory === 'commercial' && pricing.commercialServices.length === 0
                }
                className="px-7 py-3 text-sm font-semibold tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Continue to your details
              </Button>
            </div>
          </div>

          <FormConfidencePanel
            step={2}
            servicesSelected={servicesSelected}
            visitTotal={visitTotal}
            requiresManualQuote={requiresManualQuote}
          />
        </div>
      )}


      {step === 3 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.45fr)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-white/15 bg-brand-black/40 p-5 text-sm text-white/70">
              <p className="text-base font-semibold text-white">You’re booking</p>
              <p className="mt-2 text-xs text-white/60">{propertySummary}</p>
              {propertyExtras.length ? (
                <p className="text-xs text-white/55">Extras: {propertyExtras.join(' · ')}</p>
              ) : null}
              {pricing.propertyCategory === 'commercial' && pricing.commercialNotes ? (
                <p className="mt-2 text-xs text-white/55">
                  Premises notes: {pricing.commercialNotes}
                </p>
              ) : null}
              <p className="mt-3">{servicesSelected.join(', ')}</p>
              <p>
                {pricing.propertyCategory === 'commercial'
                  ? `${frequencyLabel(pricing.frequency)} · Pricing confirmed after review`
                  : `${frequencyLabel(pricing.frequency)} · ${requiresManualQuote ? 'To be confirmed after review' : `${formatCurrency(visitTotal)} per visit`}`}
              </p>
              {discountNote ? (
                <p className="mt-2 text-xs text-emerald-400">{discountNote}</p>
              ) : null}
              {residentialWindowNote ? (
                <p className="mt-2 text-xs text-white/55">{residentialWindowNote}</p>
              ) : null}
              {requiresManualQuote ? (
                <p className="mt-2 text-xs text-white/55">
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
                <SimpleAddressInput
                  value={customer.address}
                  onChange={(value) => handleCustomerChange('address', value)}
                  placeholder="Full address including house number"
                  required
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
                className="px-7 py-3 text-sm font-semibold tracking-[0.08em] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'submitting' ? 'Sending...' : customer.intent === 'quote' ? 'Request a quote' : 'Send booking request'}
              </Button>
            </div>
          </form>

          <FormConfidencePanel
            step={3}
            servicesSelected={servicesSelected}
            visitTotal={visitTotal}
            requiresManualQuote={requiresManualQuote}
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
  value,
  onChange,
  optionsClassName,
  name,
}: {
  title: string
  subtitle?: string
  options: Array<{ id: string; title: string; meta?: string; description?: string }>
  value: string
  onChange: (value: string) => void
  optionsClassName?: string
  name?: string
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
              className={`cursor-pointer rounded-2xl border px-4 py-4 text-left transition ${
                active
                  ? 'border-emerald-400/70 bg-emerald-500/15 text-white shadow-[0_12px_30px_-20px_rgba(16,185,129,0.65)]'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
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
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{option.title}</span>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  {option.meta ? <span>{option.meta}</span> : null}
                  {active ? <CheckMark /> : null}
                </div>
              </div>
              {option.description ? <p className="mt-2 text-xs text-white/50">{option.description}</p> : null}
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
  price,
  checked,
  onChange,
  helper,
}: {
  label: string
  description: string
  price?: string
  checked: boolean
  onChange: (checked: boolean) => void
  helper?: string
}) {
  return (
    <label
      className={`flex w-full cursor-pointer items-start justify-between gap-4 rounded-2xl border px-5 py-5 text-left transition ${
        checked
          ? 'border-emerald-400/70 bg-emerald-500/15 text-white shadow-[0_12px_30px_-20px_rgba(16,185,129,0.65)]'
          : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
        aria-label={label}
      />
      <div className="flex flex-1 items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{label}</p>
          <p className="mt-2 text-xs text-white/60">{description}</p>
          {helper ? <p className="mt-3 text-xs text-emerald-400">{helper}</p> : null}
        </div>
        <div className="flex flex-col items-end gap-2 text-right">
          {price ? <p className="text-sm font-semibold text-white">{price}</p> : null}
          <div className="flex items-center justify-center">
            {checked ? (
              <CheckMark />
            ) : (
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/25 text-white/40"
                aria-hidden="true"
              >
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
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
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
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
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-emerald-400 focus:outline-none"
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
        className="mt-2 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-emerald-400 focus:outline-none"
      >
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
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 ${className}`}
      aria-hidden="true"
    >
      <svg
        className="h-3 w-3 text-emerald-300"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 13l4 4L19 7" />
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
            'border-emerald-400/50 bg-emerald-500/15 text-white shadow-[0_10px_28px_-24px_rgba(16,185,129,0.65)]',
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
              className={`flex w-full items-center gap-3 rounded-full border px-4 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 sm:flex-1 ${
                buttonClasses
              } ${interactive ? 'hover:border-white/40 hover:text-white' : ''}`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  status === 'complete'
                    ? 'bg-emerald-400 text-brand-black'
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
  visitTotal,
  requiresManualQuote,
}: {
  step: Step
  servicesSelected: string[]
  visitTotal: number
  requiresManualQuote: boolean
}) {
  const copy = CONFIDENCE_COPY[step]
  const showCurrentSelection = step !== 1 && servicesSelected.length > 0
  const visitLabel = requiresManualQuote ? 'To be confirmed' : formatCurrency(visitTotal)

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
          <p className="mt-1 text-xs text-white/60">
            Next visit total: <span className="font-semibold text-white">{visitLabel}</span>
          </p>
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
