import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import { getNotionClient, getWebsiteCustomersDatabaseId } from '@/lib/server/notion'
import { verifyRecaptchaToken } from '@/lib/security/recaptcha'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { getOrCreateRequestId, formatLogWithRequestId } from '@/lib/security/request-id'

export const runtime = 'nodejs'

const customerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  phone: z.string(),
  postcode: z.string(),
  address: z.string(),
  notes: z.string(),
  intent: z.union([z.literal('book'), z.literal('quote')]),
  customerType: z.union([z.literal('new'), z.literal('existing')]),
  website: z.string().optional(),
})

const requestSchema = z.object({
  propertyCategory: z.union([z.literal('residential'), z.literal('commercial')]),
  bedrooms: z.union([z.literal('1-2'), z.literal('3'), z.literal('4'), z.literal('5'), z.literal('6+')]),
  propertyType: z.union([
    z.literal('terraced'),
    z.literal('semi'),
    z.literal('detached'),
    z.literal('bungalow'),
    z.literal('townhouse'),
    z.literal('flat'),
  ]),
  frequency: z.string(),
  includeGutter: z.boolean(),
  includeFascia: z.boolean(),
  hasExtension: z.boolean(),
  hasConservatory: z.boolean(),
  isBespoke: z.boolean(),
  commercialType: z.string(),
  commercialNotes: z.string(),
  commercialServices: z.array(z.string()),
})

const payloadSchema = z.object({
  customer: customerSchema,
  request: requestSchema,
  manualReviewReason: z.string().optional(),
  propertySummary: z.string(),
  propertyExtras: z.array(z.string()),
  servicesSelected: z.array(z.string()),
  summaryPlaintext: z.string(),
  submittedAt: z.string().datetime(),
  frequencyText: z.string(),
  bedroomText: z.string(),
  recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
})

type Payload = z.infer<typeof payloadSchema>

type NotionPropertyValue = Record<string, unknown>
type NotionPageProperties = CreatePageParameters['properties']

type ServicesAccumulator = Set<string>

const blankRichText: Array<{ type: 'text'; text: { content: string } }> = []

const toTitle = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) {
    return [
      {
        type: 'text' as const,
        text: { content: 'Unnamed contact' },
      },
    ]
  }
  return [
    {
      type: 'text' as const,
      text: { content: trimmed },
    },
  ]
}

const toRichText = (value: string) => {
  const trimmed = value.trim()
  return trimmed
    ? [
        {
          type: 'text' as const,
          text: { content: trimmed },
        },
      ]
    : blankRichText
}

const toUpper = (value: string) => value.trim().toUpperCase()

const SERVICE_MAP_RESIDENTIAL = {
  gutter: 'Gutter Clearing',
  fascia: 'Fascias & Soffits Cleaning',
  conservatory: 'Conservatory Roof Cleaning',
  solar: 'Solar Panel Cleaning',
} as const

const SERVICE_MAP_COMMERCIAL: Record<string, string> = {
  external_windows: 'External Commercial Cleaning',
  internal_windows: 'External Commercial Cleaning',
  signage: 'External Commercial Cleaning',
  gutter_clearing: 'Gutter Clearing',
  solar: 'Solar Panel Cleaning',
  bespoke_additional: 'External Commercial Cleaning',
}

const FREQUENCY_MAP: Record<string, string> = {
  '4': 'Every 4 weeks',
  '8': 'Every 8 weeks',
  'one-off': 'One-off cleaning',
  fortnightly: 'Ad hoc basis',
  monthly: 'Ad hoc basis',
  quarterly: 'Every 12 weeks',
  '26': 'Every 12 weeks',
  'ad-hoc': 'Ad hoc basis',
}

const PROPERTY_TYPE_MAP: Record<string, string> = {
  detached: 'Detached house',
  terraced: 'Terraced / Semi-detached house',
  semi: 'Terraced / Semi-detached house',
  bungalow: 'Terraced / Semi-detached house',
  townhouse: 'Terraced / Semi-detached house',
  flat: 'Terraced / Semi-detached house',
}

const toServicesMultiSelect = (payload: Payload): Array<{ name: string }> => {
  const { request, servicesSelected } = payload
  const services: ServicesAccumulator = new Set()

  const addService = (name: string | undefined) => {
    if (name) services.add(name)
  }

  if (request.propertyCategory === 'commercial') {
    addService('External Commercial Cleaning')
    for (const id of request.commercialServices) {
      addService(SERVICE_MAP_COMMERCIAL[id])
    }
  } else {
    addService('Window Cleaning')
    if (request.includeGutter) addService(SERVICE_MAP_RESIDENTIAL.gutter)
    if (request.includeFascia) addService(SERVICE_MAP_RESIDENTIAL.fascia)
    if (request.hasConservatory) addService(SERVICE_MAP_RESIDENTIAL.conservatory)

    const servicesText = servicesSelected.join(' ').toLowerCase()
    if (servicesText.includes('solar')) addService(SERVICE_MAP_RESIDENTIAL.solar)
  }

  return Array.from(services).map((name) => ({ name }))
}

const formatUkDateTime = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-GB', { timeZone: 'Europe/London' })
}

const buildNotes = (payload: Payload) => {
  const chunks: string[] = []
  const { customer, manualReviewReason, propertyExtras, request, summaryPlaintext } = payload

  if (summaryPlaintext.trim()) chunks.push(summaryPlaintext.trim())
  if (customer.notes.trim()) chunks.push(`Customer notes: ${customer.notes.trim()}`)
  if (manualReviewReason?.trim()) chunks.push(`Manual review: ${manualReviewReason.trim()}`)
  if (propertyExtras.length) chunks.push(`Extras: ${propertyExtras.join(', ')}`)
  if (request.commercialNotes.trim()) chunks.push(`Commercial notes: ${request.commercialNotes.trim()}`)

  return chunks.join('\n\n')
}

const toProperties = (payload: Payload): NotionPageProperties => {
  const { customer, request, propertySummary, summaryPlaintext, submittedAt, frequencyText, bedroomText } = payload

  const fullName = `${customer.firstName.trim()} ${customer.lastName.trim()}`.trim()
  const customerTypeName = request.propertyCategory === 'commercial' ? 'Existing Customer' : customer.customerType === 'existing' ? 'Existing Customer' : 'New Customer'
  const frequencyName = FREQUENCY_MAP[request.frequency] || 'Not specified'
  const propertyTypeName =
    request.propertyCategory === 'commercial' ? 'Commercial property' : PROPERTY_TYPE_MAP[request.propertyType] || 'Terraced / Semi-detached house'
  const servicesSummary = [
    `Intent: ${customer.intent === 'book' ? 'Booking request' : 'Quote request'}`,
    `Services: ${payload.servicesSelected.join(', ') || 'Window cleaning'}`,
    `Property: ${propertySummary}`,
    request.propertyCategory === 'residential' ? `Bedrooms: ${bedroomText}` : undefined,
    `Frequency: ${frequencyText}`,
  ]
    .filter(Boolean)
    .join('\n')

  const customerReference = `WEB-${Date.now().toString(36).toUpperCase()}`

  return {
    Name: {
      title: toTitle(fullName || customer.email || 'New enquiry'),
    },
    Email: {
      email: customer.email.trim() || null,
    },
    Phone: {
      phone_number: customer.phone.trim() || null,
    },
    Postcode: {
      rich_text: toRichText(toUpper(customer.postcode)),
    },
    'Services & Agreed Prices': {
      rich_text: toRichText(servicesSummary),
    },
    Notes: {
      rich_text: toRichText(buildNotes(payload)),
    },
    Services: {
      multi_select: toServicesMultiSelect(payload),
    },
    'Customer Type': {
      select: { name: customerTypeName },
    },
    'Cleaning Frequency': {
      select: { name: frequencyName },
    },
    'Squeegee Status': {
      select: { name: 'Not Processed' },
    },
    Status: {
      select: { name: 'New Lead' },
    },
    'Property Type': {
      select: { name: propertyTypeName },
    },
    'Date Added': {
      date: { start: submittedAt },
    },
    'Date & Time Submitted': {
      date: { start: submittedAt },
    },
    'Date & Time Submitted (UK Format)': {
      rich_text: toRichText(formatUkDateTime(submittedAt)),
    },
    'Customer Reference Number': {
      rich_text: toRichText(customerReference),
    },
  }
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request.headers)
  const log = (msg: string) => console.log(formatLogWithRequestId(requestId, msg))
  const logError = (msg: string) => console.error(formatLogWithRequestId(requestId, msg))

  try {
    // Rate limiting by IP address
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    const rateLimit = checkRateLimit(`notion-leads:${ip}`, {
      limit: 5,
      windowMs: 60000, // 5 requests per minute
    })

    if (!rateLimit.allowed) {
      logError(`Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json(
        {
          error: 'rate_limit_exceeded',
          message: 'Too many requests. Please try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimit.resetAt).toISOString(),
            'Retry-After': String(rateLimit.retryAfter || 60),
            'X-Request-ID': requestId,
          },
        }
      )
    }

    const notion = getNotionClient()
    const databaseId = getWebsiteCustomersDatabaseId()

    if (!notion || !databaseId) {
      logError('Notion not configured')
      return NextResponse.json(
        {
          error: 'notion_unavailable',
          message: 'Notion is not configured. Set NOTION_API_TOKEN and NOTION_WEBSITE_CUSTOMERS_DB_ID.',
        },
        { 
          status: 503,
          headers: { 'X-Request-ID': requestId },
        }
      )
    }

    const payloadJson = await request.json()
    const parsed = payloadSchema.safeParse(payloadJson)

    if (!parsed.success) {
      logError('Invalid payload: ' + JSON.stringify(parsed.error.flatten()))
      return NextResponse.json(
        {
          error: 'invalid_payload',
          details: parsed.error.flatten(),
        },
        { 
          status: 400,
          headers: { 'X-Request-ID': requestId },
        }
      )
    }

    const payload = parsed.data

    // Verify reCAPTCHA token server-side
    log('Verifying reCAPTCHA token')
    const recaptchaResult = await verifyRecaptchaToken(payload.recaptchaToken)

    if (!recaptchaResult.valid) {
      logError(`reCAPTCHA verification failed: ${recaptchaResult.error}`)
      return NextResponse.json(
        {
          error: 'recaptcha_verification_failed',
          message: recaptchaResult.error || 'Security verification failed. Please try again.',
        },
        { 
          status: 403,
          headers: { 'X-Request-ID': requestId },
        }
      )
    }

    log(`reCAPTCHA verified successfully (score: ${recaptchaResult.score || 'N/A'})`)

    log('Creating Notion page')
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: toProperties(payload),
    })

    log('Lead successfully synced to Notion')
    return NextResponse.json(
      { ok: true },
      {
        headers: {
          'X-Request-ID': requestId,
          'X-RateLimit-Remaining': String(rateLimit.remaining),
        },
      }
    )
  } catch (error) {
    logError('Notion sync failed: ' + (error instanceof Error ? error.message : String(error)))
    return NextResponse.json(
      {
        error: 'notion_error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { 
        status: 500,
        headers: { 'X-Request-ID': requestId },
      }
    )
  }
}
