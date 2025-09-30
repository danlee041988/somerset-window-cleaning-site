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
      campaign.id,
      campaign.name,
      ad_group.id,
      ad_group.name,
      segments.date,
      search_term_view.search_term,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.average_cpc,
      metrics.conversions
    FROM search_term_view
    WHERE segments.date DURING LAST_7_DAYS
      AND campaign.advertising_channel_type = SEARCH
      AND metrics.impressions > 0
    ORDER BY metrics.clicks DESC
    LIMIT 100
  `)

  if (rows.length === 0) {
    console.log('No search term activity during the last 7 days.')
    return
  }

  console.log('Top search terms (last 7 days):')
  rows.forEach((row) => {
    const searchTerm = row.search_term_view?.search_term ?? '(not provided)'
    const campaign = `${row.campaign?.name ?? 'Campaign'} (#${row.campaign?.id ?? '-'})`
    const clicks = Number(row.metrics?.clicks ?? 0)
    const impressions = Number(row.metrics?.impressions ?? 0)
    const costMicros = Number(row.metrics?.cost_micros ?? 0)
    const avgCpc = Number(row.metrics?.average_cpc ?? 0) / 1_000_000
    const conversions = Number(row.metrics?.conversions ?? 0)
    const date = row.segments?.date ?? ''

    console.log(
      `${date} | ${campaign} | term="${searchTerm}" | imp=${impressions} | clicks=${clicks} | avgCPC=£${avgCpc.toFixed(2)} | cost=£${(costMicros / 1_000_000).toFixed(2)} | conv=${conversions}`
    )
  })
}

main().catch((error) => {
  console.error('Failed to pull search term report:', error)
  process.exit(1)
})
