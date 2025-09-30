#!/usr/bin/env tsx
import path from 'path'
import { config as loadEnv } from 'dotenv'
import { GoogleAdsApi, enums } from 'google-ads-api'

loadEnv({ path: path.join(process.cwd(), '.env.local') })

const sanitize = (value?: string) => (value ? value.replace(/[^0-9]/g, '') : undefined)

const {
  GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET,
  GOOGLE_ADS_DEVELOPER_TOKEN,
  GOOGLE_ADS_REFRESH_TOKEN,
  GOOGLE_ADS_CUSTOMER_ID,
  GOOGLE_ADS_LOGIN_CUSTOMER_ID,
} = process.env

if (!GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_CLIENT_SECRET || !GOOGLE_ADS_DEVELOPER_TOKEN || !GOOGLE_ADS_REFRESH_TOKEN || !GOOGLE_ADS_CUSTOMER_ID) {
  throw new Error('Missing Google Ads credentials in environment')
}

const api = new GoogleAdsApi({
  client_id: GOOGLE_ADS_CLIENT_ID,
  client_secret: GOOGLE_ADS_CLIENT_SECRET,
  developer_token: GOOGLE_ADS_DEVELOPER_TOKEN,
})

const customer = api.Customer({
  customer_id: sanitize(GOOGLE_ADS_CUSTOMER_ID)!,
  login_customer_id: sanitize(GOOGLE_ADS_LOGIN_CUSTOMER_ID),
  refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
})

async function main() {
  const rows = await customer.query(`
    SELECT conversion_action.resource_name,
           conversion_action.name,
           conversion_action.type,
           conversion_action.status,
           conversion_action.primary_for_goal,
           conversion_action.category,
           conversion_action.origin,
           conversion_action.google_analytics_4_settings.property_id,
           conversion_action.google_analytics_4_settings.event_name
    FROM conversion_action
    WHERE conversion_action.type IN (GOOGLE_ANALYTICS_4_CUSTOM, GOOGLE_ANALYTICS_4_PURCHASE)
  `)

  if (rows.length === 0) {
    console.log('No GA4 conversions available yet. If you just created the link, retry in a few minutes.')
    return
  }

  console.log('GA4 conversions visible in Ads:')
  for (const row of rows) {
    const ca = row.conversion_action
    if (!ca) continue
    const status = typeof ca.status === 'number' ? enums.ConversionActionStatus[ca.status] ?? ca.status : ca.status
    const category = typeof ca.category === 'number' ? enums.ConversionActionCategory[ca.category] ?? ca.category : ca.category
    console.log(`- ${ca.name} | event=${ca.google_analytics_4_settings?.event_name ?? '-'} | status=${status} | category=${category} | primary=${ca.primary_for_goal}`)
  }
}

main().catch((error) => {
  console.error('Failed to inspect GA4 conversions:', error)
  process.exit(1)
})
