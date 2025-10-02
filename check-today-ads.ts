#!/usr/bin/env tsx
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env.local') })

const api = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = api.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

async function main() {
  const today = new Date().toISOString().split('T')[0].replace(/-/g, '')
  
  const rows = await customer.query(`
    SELECT
      metrics.impressions,
      metrics.clicks,
      metrics.conversions,
      metrics.cost_micros,
      metrics.average_cpc,
      campaign.name
    FROM campaign
    WHERE segments.date = '${today}'
      AND campaign.status = 'ENABLED'
  `)

  let totalImpressions = 0
  let totalClicks = 0
  let totalConversions = 0
  let totalCost = 0

  console.log(`\n📊 Google Ads Performance - ${new Date().toLocaleDateString('en-GB')}\n`)
  
  rows.forEach(row => {
    const impressions = Number(row.metrics?.impressions || 0)
    const clicks = Number(row.metrics?.clicks || 0)
    const conversions = Number(row.metrics?.conversions || 0)
    const cost = Number(row.metrics?.cost_micros || 0) / 1_000_000
    
    totalImpressions += impressions
    totalClicks += clicks
    totalConversions += conversions
    totalCost += cost
    
    if (impressions > 0) {
      console.log(`Campaign: ${row.campaign?.name}`)
      console.log(`  Impressions: ${impressions}`)
      console.log(`  Clicks: ${clicks}`)
      console.log(`  Conversions: ${conversions}`)
      console.log(`  Cost: £${cost.toFixed(2)}\n`)
    }
  })

  console.log('─'.repeat(50))
  console.log(`TOTAL TODAY:`)
  console.log(`  👁️  Impressions: ${totalImpressions}`)
  console.log(`  🖱️  Clicks: ${totalClicks}`)
  console.log(`  ✅ Conversions: ${totalConversions}`)
  console.log(`  💰 Spend: £${totalCost.toFixed(2)}`)
  
  if (totalClicks > 0) {
    console.log(`  📈 CTR: ${((totalClicks / totalImpressions) * 100).toFixed(2)}%`)
    console.log(`  💵 Avg CPC: £${(totalCost / totalClicks).toFixed(2)}`)
  }
  
  if (totalConversions > 0) {
    console.log(`  🎯 Cost/Conv: £${(totalCost / totalConversions).toFixed(2)}`)
  }
  console.log('─'.repeat(50))
}

main().catch(console.error)
