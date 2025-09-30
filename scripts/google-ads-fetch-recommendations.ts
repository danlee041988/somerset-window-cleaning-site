#!/usr/bin/env tsx

import fs from 'fs'
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
    SELECT
      recommendation.resource_name,
      recommendation.type,
      recommendation.campaign,
      recommendation.campaign_budget,
      recommendation.dismissed
    FROM recommendation
    ORDER BY recommendation.type
  `)

  if (rows.length === 0) {
    console.log('No active recommendations for this account.')
    return
  }

  const summary = rows.map((row) => {
    const rec = row.recommendation
    const type = typeof rec?.type === 'number' ? enums.RecommendationType[rec.type] ?? rec.type : rec?.type
    return {
      resourceName: rec?.resource_name,
      type,
      campaign: rec?.campaign,
      campaignBudget: rec?.campaign_budget,
      dismissed: rec?.dismissed ?? false,
    }
  })

  const historyDir = path.join(process.cwd(), 'docs', 'ads', 'history')
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true })
  }
  const date = new Date().toISOString().slice(0, 10)
  const filePath = path.join(historyDir, `${date}-recommendations.json`)
  fs.writeFileSync(filePath, JSON.stringify(summary, null, 2))

  console.log(`Fetched ${summary.length} recommendations. Saved to ${filePath}`)
  summary.forEach((item) => {
    console.log(`- ${item.type} | campaign=${item.campaign ?? 'n/a'} | dismissed=${item.dismissed}`)
  })
}

main().catch((error) => {
  console.error('Failed to fetch recommendations:', error)
  process.exit(1)
})
