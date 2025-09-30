#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi, enums } from 'google-ads-api'

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

type UpdateConfig = {
  campaignName: string
  adGroupName: string
  cpcBidMicros: number
}

const updates: UpdateConfig[] = [
  { campaignName: 'Gutter – Somerset', adGroupName: 'Gutter – Somerset Ad Group', cpcBidMicros: 1_800_000 },
  { campaignName: 'Conservatory – Somerset', adGroupName: 'Conservatory – Somerset Ad Group', cpcBidMicros: 1_700_000 },
  { campaignName: 'Solar Panels – Somerset', adGroupName: 'Solar Panels – Somerset Ad Group', cpcBidMicros: 1_700_000 },
]

const formatCurrency = (micros: number) => `£${(micros / 1_000_000).toFixed(2)}`

const findAdGroupId = async (campaignName: string, adGroupName: string): Promise<string | null> => {
  const rows = await customer.query(`
    SELECT ad_group.id
    FROM ad_group
    WHERE campaign.name = '${campaignName.replace(/'/g, "''")}'
      AND ad_group.name = '${adGroupName.replace(/'/g, "''")}'
    LIMIT 1
  `)
  const row = rows[0]
  if (!row?.ad_group?.id) return null
  return String(row.ad_group.id)
}

const main = async () => {
  const results: string[] = []

  for (const update of updates) {
    const adGroupId = await findAdGroupId(update.campaignName, update.adGroupName)
    if (!adGroupId) {
      results.push(`⚠️  Could not find ${update.campaignName} → ${update.adGroupName}`)
      continue
    }

    await customer.adGroups.update([
      {
        resource_name: `customers/${customerId}/adGroups/${adGroupId}`,
        cpc_bid_micros: update.cpcBidMicros,
        status: enums.AdGroupStatus.ENABLED,
      },
    ])

    results.push(`✅ ${update.campaignName} → ${update.adGroupName} CPC set to ${formatCurrency(update.cpcBidMicros)}`)
  }

  results.forEach((line) => console.log(line))
}

main().catch((error) => {
  console.error('❌ Failed to set manual CPC bids:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
