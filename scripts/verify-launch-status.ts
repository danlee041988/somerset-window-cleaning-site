#!/usr/bin/env tsx
/**
 * Verify Launch Status
 */

import { GoogleAdsApi } from 'google-ads-api'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.join(__dirname, '..', '.env.local') })

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

async function main() {
  console.log('🚀 SOMERSET WINDOW CLEANING - CAMPAIGN STATUS')
  console.log('═'.repeat(70))

  // Get campaign status
  const campaignQuery = `
    SELECT
      campaign.name,
      campaign.status,
      campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.name LIKE '%Somerset%'
    ORDER BY campaign.name
  `

  const campaigns = await customer.query(campaignQuery)
  console.log(`\n📊 CAMPAIGNS (${campaigns.length} total):`)
  campaigns.forEach((row: any) => {
    const status = row.campaign.status === 2 ? '✅ ENABLED' : '⏸️  PAUSED'
    const budget = row.campaign_budget?.amount_micros
      ? `£${(row.campaign_budget.amount_micros / 1000000).toFixed(0)}/day`
      : 'N/A'
    console.log(`  ${status} | ${row.campaign.name} | Budget: ${budget}`)
  })

  // Get keyword counts
  const keywordQuery = `
    SELECT
      campaign.name,
      ad_group_criterion.keyword.text,
      ad_group_criterion.status,
      ad_group_criterion.cpc_bid_micros
    FROM keyword_view
    WHERE campaign.name LIKE '%Somerset%'
      AND ad_group_criterion.cpc_bid_micros > 0
    ORDER BY campaign.name
  `

  const keywords = await customer.query(keywordQuery)
  const enabled = keywords.filter((k: any) => k.ad_group_criterion.status === 2).length
  const paused = keywords.filter((k: any) => k.ad_group_criterion.status === 4).length

  console.log(`\n📊 KEYWORDS WITH BIDS (${keywords.length} total):`)
  console.log(`  ✅ ENABLED: ${enabled}`)
  console.log(`  ⏸️  PAUSED: ${paused}`)

  // Calculate average CPC
  const enabledKeywords = keywords.filter((k: any) => k.ad_group_criterion.status === 2)
  const totalCpc = enabledKeywords.reduce((sum: number, k: any) => sum + k.ad_group_criterion.cpc_bid_micros, 0)
  const avgCpc = enabled > 0 ? (totalCpc / enabled / 1000000).toFixed(2) : '0.00'

  console.log(`\n💰 BIDDING:`)
  console.log(`  • Average CPC: £${avgCpc}`)
  console.log(`  • Daily Budget: £50`)
  console.log(`  • Expected clicks: ~${Math.floor(50 / parseFloat(avgCpc))} per day`)

  if (enabled > 0) {
    console.log('\n🎉 SUCCESS! YOUR CAMPAIGNS ARE LIVE!')
    console.log('═'.repeat(70))
    console.log(`✅ ${enabled} keywords actively bidding`)
    console.log('💡 Ads should start showing within 1-2 hours')
    console.log('📞 Check for leads in 24-48 hours')
    console.log('\n📋 NEXT STEPS:')
    console.log('  1. Monitor spend tomorrow morning')
    console.log('  2. Link GA4 to Google Ads for conversion tracking')
    console.log('  3. Check search terms report in 3-4 days')
    console.log('  4. Add call extensions via Google Ads UI')
  } else {
    console.log('\n⚠️  WARNING: No keywords are enabled yet!')
  }
}

main()
