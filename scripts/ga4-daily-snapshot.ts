#!/usr/bin/env tsx
// @ts-nocheck - Google Analytics API types are incompatible
/**
 * GA4 Daily Snapshot
 * Fetches key metrics from Google Analytics 4
 */

import { google } from 'googleapis'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const SERVICE_ACCOUNT_PATH = process.env.GA4_SERVICE_ACCOUNT ?? path.join(process.cwd(), 'config/ga4/service-account.json')

interface EventSummary {
  event: string
  last7: number
  last30: number
}

const TARGET_EVENTS = ['form_submit', 'form_start', 'quote_request', 'recaptcha_complete', 'conversion']

const toDateRange = (days: number) => ({ startDate: `${days}daysAgo`, endDate: 'today' })

async function runReport(property: string, dateRange: { startDate: string; endDate: string }) {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ['https://www.googleapis.com/auth/analytics.readonly']
  })
  const client = await auth.getClient()
  const analyticsdata = google.analyticsdata({ version: 'v1beta', auth: auth as any })

  const response = await analyticsdata.properties.runReport({
    property: `properties/${property}` as any,
    requestBody: {
      dateRanges: [dateRange],
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 200
    }
  })

  const rows = response.data.rows ?? []
  const summary: Record<string, number> = {}
  for (const row of rows) {
    const event = row.dimensionValues?.[0]?.value ?? 'unknown'
    const count = Number(row.metricValues?.[0]?.value ?? 0)
    summary[event] = count
  }
  return summary
}

async function generateSnapshot() {
  const property = PROPERTY_ID.replace(/[^0-9]/g, '')
  if (!property) {
    throw new Error('GA4 property ID missing. Set GA4_PROPERTY_ID env variable or update script constant.')
  }

  const [last7, last30] = await Promise.all([
    runReport(property, toDateRange(7)),
    runReport(property, toDateRange(30))
  ])

  const allEvents = new Set<string>([...Object.keys(last7), ...Object.keys(last30), ...TARGET_EVENTS])
  const eventSummaries: EventSummary[] = Array.from(allEvents)
    .sort()
    .map((event) => ({
      event,
      last7: last7[event] ?? 0,
      last30: last30[event] ?? 0
    }))

  const totals = {
    last7TotalEvents: Object.values(last7).reduce((acc, val) => acc + val, 0),
    last30TotalEvents: Object.values(last30).reduce((acc, val) => acc + val, 0)
  }

  const focus = TARGET_EVENTS.map((event) => ({
    event,
    last7: last7[event] ?? 0,
    last30: last30[event] ?? 0
  }))

  const summary = {
    generatedAt: new Date().toISOString(),
    propertyId: property,
    totals,
    events: eventSummaries,
    focus
  }

  const historyDir = path.join(process.cwd(), 'docs', 'ads', 'history')
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true })
  }

  const filePath = path.join(historyDir, `${new Date().toISOString().slice(0, 10)}-ga4.json`)
  fs.writeFileSync(filePath, JSON.stringify(summary, null, 2))
  return { filePath, summary }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  generateSnapshot()
    .then(({ filePath, summary }) => {
      console.log(`GA4 snapshot saved to ${filePath}`)
      console.table(summary.focus)
      process.exit(0)
    })
    .catch((error) => {
      console.error('Failed to generate GA4 snapshot:', error)
      process.exit(1)
    })
}

export { generateSnapshot }
