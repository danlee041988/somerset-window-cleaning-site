#!/usr/bin/env tsx
import path from 'path'
import { config as loadEnv } from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

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
    SELECT conversion_action.id,
           conversion_action.name,
           conversion_action.type,
           conversion_action.category,
           conversion_action.resource_name
    FROM conversion_action
    WHERE conversion_action.status != 'REMOVED'
    ORDER BY conversion_action.id DESC
  `)

  console.log('Active conversion actions:')
  for (const row of rows) {
    const ca = row.conversion_action ?? {}
    console.log(`- ${ca.name} | ID ${ca.id} | Type ${ca.type} | Category ${ca.category}`)
  }
}

main().catch((error) => {
  console.error('Failed to list conversions:', error)
  process.exit(1)
})
