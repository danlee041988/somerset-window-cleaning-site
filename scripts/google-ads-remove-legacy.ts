#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const clientId = process.env.GOOGLE_ADS_CLIENT_ID
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID

if (!clientId || !clientSecret || !developerToken || !refreshToken || !customerId) {
  throw new Error('Missing Google Ads credentials in .env.local')
}

const api = new GoogleAdsApi({
  client_id: clientId,
  client_secret: clientSecret,
  developer_token: developerToken,
})

const customer = api.Customer({
  customer_id: customerId,
  refresh_token: refreshToken,
})

const LEGACY_CAMPAIGNS = [
  'Somerset Window Cleaning',
  'Multi - Search - Window Cleaning - Leads - Max. Conversion',
]

async function main() {
  const rows = await customer.query(`
    SELECT campaign.id, campaign.name
    FROM campaign
    WHERE campaign.name IN (${LEGACY_CAMPAIGNS.map((name) => `'${name}'`).join(',')})
  `)

  const ids = rows.map((row) => ({
    id: row.campaign?.id ? String(row.campaign.id) : null,
    name: row.campaign?.name ?? 'Campaign',
  })).filter((item) => item.id) as { id: string; name: string }[]

  if (!ids.length) {
    console.log('No legacy campaigns found to remove.')
    return
  }

  await customer.campaigns.remove(
    ids.map((item) => `customers/${customerId}/campaigns/${item.id}`),
  )

  ids.forEach((item) => console.log(`🗑️  Removed legacy campaign: ${item.name}`))
}

main().catch((error) => {
  console.error('❌ Failed to remove legacy campaigns:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
