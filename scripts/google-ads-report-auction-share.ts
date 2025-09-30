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
      metrics.search_impression_share,
      metrics.search_top_impression_share,
      metrics.search_absolute_top_impression_share,
      metrics.search_budget_lost_impression_share,
      metrics.search_rank_lost_impression_share
    FROM campaign
    WHERE segments.date DURING LAST_7_DAYS
      AND campaign.advertising_channel_type = SEARCH
    ORDER BY segments.date DESC, campaign.name
  `)

  if (rows.length === 0) {
    console.log('No search auction data available for the last 7 days.')
    return
  }

  console.log('Search auction share (last 7 days):')
  rows.forEach((row) => {
    const date = row.segments?.date ?? ''
    const name = row.campaign?.name ?? 'Campaign'
    const impressionShare = Number(row.segments?.search_impression_share ?? 0)
    const topShare = Number(row.segments?.search_top_impression_share ?? 0)
    const absTopShare = Number(row.segments?.search_absolute_top_impression_share ?? 0)
    const lostBudget = Number(row.segments?.search_budget_lost_impression_share ?? 0)
    const lostRank = Number(row.segments?.search_rank_lost_impression_share ?? 0)

    console.log(
      `${date} | ${name} | IS=${(impressionShare * 100).toFixed(1)}% | top=${(topShare * 100).toFixed(1)}% | absTop=${(absTopShare * 100).toFixed(1)}% | lost_budget=${(lostBudget * 100).toFixed(1)}% | lost_rank=${(lostRank * 100).toFixed(1)}%`
    )
  })
}

main().catch((error) => {
  console.error('Failed to pull search auction share report:', error)
  process.exit(1)
})
