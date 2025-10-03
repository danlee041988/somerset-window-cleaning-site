import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import type { CreatePageParameters } from '@notionhq/client/build/src/api-endpoints'
import { getNotionClient, getWebsiteCustomersDatabaseId } from '@/lib/server/notion'
import { verifyRecaptchaToken } from '@/lib/security/recaptcha'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { getOrCreateRequestId } from '@/lib/security/request-id'
import { logger } from '@/lib/logger'
import { captureError } from '@/lib/error-tracking'
import { RoutePerformance } from '@/lib/performance'

export const runtime = 'nodejs'

// Simplified schema for BookingFormImproved
const simpleLeadSchema = z.object({
  customer: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    postcode: z.string(),
    address: z.string(),
  }),
  request: z.object({
    propertyCategory: z.union([z.literal('residential'), z.literal('commercial')]),
    propertyType: z.string(),
    bedrooms: z.string(),
    hasExtension: z.boolean().optional(),
    hasConservatory: z.boolean().optional(),
    commercialType: z.string().optional(),
    services: z.array(z.string()),
    frequency: z.string(),
    notes: z.string().optional(),
  }),
  recaptchaToken: z.string().min(1, 'reCAPTCHA token is required'),
})

type SimpleLead = z.infer<typeof simpleLeadSchema>

const toTitle = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? [{ type: 'text' as const, text: { content: trimmed } }] : [{ type: 'text' as const, text: { content: 'Unnamed contact' } }]
}

const toRichText = (value: string) => {
  const trimmed = value.trim()
  return trimmed ? [{ type: 'text' as const, text: { content: trimmed } }] : []
}

const FREQUENCY_MAP: Record<string, string> = {
  'every-4-weeks': 'Every 4 weeks',
  'every-8-weeks': 'Every 8 weeks',
  'one-off': 'One-off cleaning',
  'monthly': 'Ad hoc basis',
}

const PROPERTY_TYPE_MAP: Record<string, string> = {
  detached: 'Detached house',
  terraced: 'Terraced / Semi-detached house',
  semi: 'Terraced / Semi-detached house',
  bungalow: 'Terraced / Semi-detached house',
  townhouse: 'Terraced / Semi-detached house',
  flat: 'Terraced / Semi-detached house',
}

const SERVICE_NAME_MAP: Record<string, string> = {
  windows: 'Window Cleaning',
  gutters: 'Gutter Clearing',
  fascias: 'Fascias & Soffits Cleaning',
  conservatory: 'Conservatory Roof Cleaning',
  solar: 'Solar Panel Cleaning',
}

const COMMERCIAL_TYPE_OPTIONS = [
  { id: 'office', label: 'Office Building' },
  { id: 'retail', label: 'Retail Store' },
  { id: 'restaurant', label: 'Restaurant/Café' },
  { id: 'warehouse', label: 'Warehouse' },
  { id: 'school', label: 'School/Education' },
  { id: 'medical', label: 'Medical Facility' },
  { id: 'other', label: 'Other' },
]

const toProperties = (lead: SimpleLead): CreatePageParameters['properties'] => {
  const { customer, request } = lead
  const fullName = `${customer.firstName.trim()} ${customer.lastName.trim()}`.trim()
  const submittedAt = new Date().toISOString()
  const customerReference = `WEB-${Date.now().toString(36).toUpperCase()}`

  // Map services to Notion format
  const servicesList = request.services.map((s) => SERVICE_NAME_MAP[s] || s)
  const servicesMultiSelect = servicesList.map((name) => ({ name }))

  // Build property summary
  const propertyExtras = []
  if (request.hasExtension) propertyExtras.push('Extension')
  if (request.hasConservatory) propertyExtras.push('Conservatory')

  const propertySummary = request.propertyCategory === 'residential'
    ? `${request.propertyType} (${request.bedrooms} bedrooms)${propertyExtras.length ? ' + ' + propertyExtras.join(', ') : ''}`
    : `${request.commercialType || 'Commercial'} property`

  // Build services summary
  const servicesSummary = [
    'Intent: Quote request',
    `Services: ${servicesList.join(', ')}`,
    `Property: ${propertySummary}`,
    request.propertyCategory === 'residential' ? `Bedrooms: ${request.bedrooms}` : undefined,
    request.propertyCategory === 'commercial' && request.commercialType ? `Commercial Type: ${COMMERCIAL_TYPE_OPTIONS.find(t => t.id === request.commercialType)?.label || request.commercialType}` : undefined,
    `Frequency: ${FREQUENCY_MAP[request.frequency] || request.frequency}`,
  ]
    .filter(Boolean)
    .join('\n')

  // Build notes
  const notesParts = []
  if (request.notes?.trim()) notesParts.push(`Customer notes: ${request.notes.trim()}`)
  if (propertyExtras.length) notesParts.push(`Property extras: ${propertyExtras.join(', ')}`)
  const notes = notesParts.join('\n\n')

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
      rich_text: toRichText(customer.postcode.toUpperCase()),
    },
    'Services & Agreed Prices': {
      rich_text: toRichText(servicesSummary),
    },
    Notes: {
      rich_text: toRichText(notes),
    },
    Services: {
      multi_select: servicesMultiSelect,
    },
    'Customer Type': {
      select: { name: 'New Customer' },
    },
    'Cleaning Frequency': {
      select: { name: FREQUENCY_MAP[request.frequency] || 'Not specified' },
    },
    'Squeegee Status': {
      select: { name: 'Not Processed' },
    },
    Status: {
      select: { name: 'New Lead' },
    },
    'Property Type': {
      select: { name: PROPERTY_TYPE_MAP[request.propertyType] || 'Terraced / Semi-detached house' },
    },
    'Date Added': {
      date: { start: submittedAt },
    },
    'Date & Time Submitted': {
      date: { start: submittedAt },
    },
    'Date & Time Submitted (UK Format)': {
      rich_text: toRichText(
        new Date(submittedAt).toLocaleString('en-GB', { timeZone: 'Europe/London' })
      ),
    },
    // Customer Reference Number field removed - doesn't exist in database
    // 'Customer Reference Number': {
    //   rich_text: toRichText(customerReference),
    // },
  }
}

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request.headers)
  const perf = new RoutePerformance('/api/notion/simple-leads')
  const log = logger.child({ requestId })

  console.log('🟢 [NOTION API] Request received at /api/notion/simple-leads')

  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown'

    console.log('🔍 [NOTION API] IP:', ip)

    const rateLimit = checkRateLimit(`notion-simple-leads:${ip}`, {
      limit: 5,
      windowMs: 60000,
    })

    if (!rateLimit.allowed) {
      log.warn(`Rate limit exceeded for IP: ${ip}`)
      perf.complete(429)
      return NextResponse.json(
        {
          error: 'rate_limit_exceeded',
          message: 'Too many requests. Please try again later.',
        },
        { status: 429, headers: { 'X-Request-ID': requestId } }
      )
    }

    const notion = getNotionClient()
    const databaseId = getWebsiteCustomersDatabaseId()

    // Make Notion optional - don't fail if not configured
    const notionConfigured = notion && databaseId
    if (!notionConfigured) {
      log.warn('Notion not configured - skipping Notion sync')
    }

    const payloadJson = await request.json()
    console.log('📦 [NOTION API] Received payload:', JSON.stringify(payloadJson, null, 2))

    const parsed = simpleLeadSchema.safeParse(payloadJson)

    if (!parsed.success) {
      console.error('❌ [NOTION API] Validation failed:', parsed.error.flatten())
      log.error('Invalid payload', { errors: parsed.error.flatten() })
      perf.complete(400)
      return NextResponse.json(
        { error: 'invalid_payload', details: parsed.error.flatten() },
        { status: 400, headers: { 'X-Request-ID': requestId } }
      )
    }

    console.log('✅ [NOTION API] Payload validated successfully')
    const lead = parsed.data

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptchaToken(lead.recaptchaToken)

    if (!recaptchaResult.valid) {
      log.error('reCAPTCHA verification failed', { error: recaptchaResult.error })
      perf.complete(403)
      return NextResponse.json(
        { error: 'recaptcha_verification_failed', message: 'Security verification failed.' },
        { status: 403, headers: { 'X-Request-ID': requestId } }
      )
    }

    // Only sync to Notion if configured
    if (notionConfigured) {
      console.log('📝 [NOTION API] Creating Notion page')
      log.info('Creating Notion page for simple lead')

      const properties = toProperties(lead)
      console.log('📋 [NOTION API] Properties:', JSON.stringify(properties, null, 2))

      await notion.pages.create({
        parent: {
          type: 'database_id',
          database_id: databaseId,
        },
        properties,
      })

      console.log('✅ [NOTION API] Page created successfully!')
      log.info('Simple lead successfully synced to Notion')
    } else {
      console.log('⚠️  [NOTION API] Notion not configured - skipping database sync')
      log.info('Lead processed but not synced to Notion (not configured)')
    }

    perf.complete(200)

    return NextResponse.json(
      { ok: true, notionSynced: notionConfigured },
      { headers: { 'X-Request-ID': requestId } }
    )
  } catch (error) {
    log.error('Notion sync failed', { error: error instanceof Error ? error.message : String(error) })
    captureError(error, { requestId, route: '/api/notion/simple-leads' })
    perf.complete(500)

    return NextResponse.json(
      { error: 'notion_error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500, headers: { 'X-Request-ID': requestId } }
    )
  }
}
