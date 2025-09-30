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
    SELECT
      segments.date,
      campaign.id,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.average_cpc,
      metrics.conversions
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
      AND campaign.advertising_channel_type = SEARCH
    ORDER BY segments.date DESC, campaign.name
  `)

  if (rows.length === 0) {
    console.log('No campaign activity logged in the last 30 days.')
    return
  }

  console.log('Campaign CPC trend (last 30 days):')
  rows.forEach((row) => {
    const date = row.segments?.date ?? ''
    const name = row.campaign?.name ?? 'Campaign'
    const impressions = Number(row.metrics?.impressions ?? 0)
    const clicks = Number(row.metrics?.clicks ?? 0)
    const costMicros = Number(row.metrics?.cost_micros ?? 0)
    const avgCpc = Number(row.metrics?.average_cpc ?? 0) / 1_000_000
    const conversions = Number(row.metrics?.conversions ?? 0)

    console.log(
      `${date} | ${name} | imp=${impressions} | clicks=${clicks} | cost=£${(costMicros / 1_000_000).toFixed(2)} | avgCPC=£${avgCpc.toFixed(2)} | conv=${conversions}`
    )
  })
}

main().catch((error) => {
  console.error('Failed to pull CPC trend report:', error)
  process.exit(1)
})
