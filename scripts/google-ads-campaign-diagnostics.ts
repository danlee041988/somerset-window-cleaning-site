#!/usr/bin/env tsx
/**
 * Google Ads Campaign Diagnostics
 * Analyzes why campaigns have low spend and provides recommendations
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { GoogleAdsApi } from 'google-ads-api'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!
const api = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = api.Customer({
  customer_id: customerId,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

async function runDiagnostics() {
  console.log('🔍 GOOGLE ADS CAMPAIGN DIAGNOSTICS\n')
  console.log('=' .repeat(80) + '\n')

  // Get campaign performance for last 7 days
  const campaignQuery = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.ctr,
      metrics.average_cpc,
      campaign_budget.amount_micros
    FROM campaign
    WHERE segments.date DURING LAST_7_DAYS
    ORDER BY campaign.name
  `

  console.log('📊 CAMPAIGN PERFORMANCE (Last 7 Days):\n')

  const campaigns = await customer.query(campaignQuery)

  let totalSpend = 0
  let totalImpressions = 0
  let totalClicks = 0

  for (const row of campaigns) {
    const campaign = row.campaign
    const metrics = row.metrics
    const budget = row.campaign_budget

    const spend = Number(metrics.cost_micros) / 1_000_000
    const impressions = Number(metrics.impressions)
    const clicks = Number(metrics.clicks)
    const ctr = Number(metrics.ctr) * 100
    const cpc = Number(metrics.average_cpc) / 1_000_000
    const budgetGbp = Number(budget.amount_micros) / 1_000_000

    totalSpend += spend
    totalImpressions += impressions
    totalClicks += clicks

    console.log(`📌 ${campaign.name}`)
    console.log(`   Status: ${campaign.status}`)
    console.log(`   Budget: £${budgetGbp.toFixed(2)}/day`)
    console.log(`   Spend: £${spend.toFixed(2)} (${(spend/budgetGbp/7*100).toFixed(1)}% of weekly budget)`)
    console.log(`   Impressions: ${impressions}`)
    console.log(`   Clicks: ${clicks}`)
    console.log(`   CTR: ${ctr.toFixed(2)}%`)
    console.log(`   Avg CPC: £${cpc.toFixed(2)}\n`)
  }

  console.log(`📈 TOTALS:`)
  console.log(`   Total Spend: £${totalSpend.toFixed(2)}`)
  console.log(`   Total Impressions: ${totalImpressions}`)
  console.log(`   Total Clicks: ${totalClicks}\n`)

  // Get ad group and keyword diagnostics
  const keywordQuery = `
    SELECT
      campaign.name,
      ad_group.name,
      ad_group_criterion.keyword.text,
      ad_group_criterion.quality_info.quality_score,
      ad_group_criterion.status,
      ad_group_criterion.cpc_bid_micros,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM keyword_view
    WHERE segments.date DURING LAST_7_DAYS
      AND ad_group_criterion.type = 'KEYWORD'
    ORDER BY metrics.impressions DESC
    LIMIT 20
  `

  console.log('\n' + '='.repeat(80))
  console.log('\n🔑 TOP KEYWORDS (Last 7 Days):\n')

  const keywords = await customer.query(keywordQuery)

  if (keywords.length === 0) {
    console.log('   ⚠️  No keyword data found for the last 7 days\n')
  } else {
    for (const row of keywords) {
      const keyword = row.ad_group_criterion
      const metrics = row.metrics
      const qualityScore = keyword.quality_info?.quality_score || 'N/A'
      const bid = Number(keyword.cpc_bid_micros) / 1_000_000
      const spend = Number(metrics.cost_micros) / 1_000_000

      console.log(`   "${keyword.keyword?.text}"`)
      console.log(`   Campaign: ${row.campaign.name} | Ad Group: ${row.ad_group.name}`)
      console.log(`   Status: ${keyword.status} | Quality Score: ${qualityScore} | Bid: £${bid.toFixed(2)}`)
      console.log(`   Impressions: ${metrics.impressions} | Clicks: ${metrics.clicks} | Spend: £${spend.toFixed(2)}\n`)
    }
  }

  // Get ad diagnostics
  const adQuery = `
    SELECT
      campaign.name,
      ad_group.name,
      ad_group_ad.ad.type,
      ad_group_ad.status,
      ad_group_ad.policy_summary.approval_status,
      metrics.impressions,
      metrics.clicks
    FROM ad_group_ad
    WHERE segments.date DURING LAST_7_DAYS
    ORDER BY metrics.impressions DESC
    LIMIT 10
  `

  console.log('\n' + '='.repeat(80))
  console.log('\n📢 AD PERFORMANCE:\n')

  const ads = await customer.query(adQuery)

  if (ads.length === 0) {
    console.log('   ⚠️  No ad data found\n')
  } else {
    for (const row of ads) {
      const ad = row.ad_group_ad
      const metrics = row.metrics

      console.log(`   ${row.campaign.name} > ${row.ad_group.name}`)
      console.log(`   Type: ${ad.ad?.type} | Status: ${ad.status} | Approval: ${ad.policy_summary?.approval_status}`)
      console.log(`   Impressions: ${metrics.impressions} | Clicks: ${metrics.clicks}\n`)
    }
  }

  // Recommendations
  console.log('\n' + '='.repeat(80))
  console.log('\n💡 RECOMMENDATIONS:\n')

  if (totalSpend < 5) {
    console.log('⚠️  CRITICAL: Extremely low spend (£' + totalSpend.toFixed(2) + ' in 7 days)\n')
    console.log('Possible causes:')
    console.log('1. Low bids - Keywords may not be competitive enough')
    console.log('2. Low quality scores - Ads/landing pages not relevant')
    console.log('3. Narrow targeting - Geographic targeting too restrictive')
    console.log('4. Campaign/ad group issues - Check approval status\n')
  }

  if (totalImpressions < 100) {
    console.log('⚠️  LOW VISIBILITY: Very few impressions')
    console.log('   → Increase bids to improve ad rank')
    console.log('   → Broaden keyword match types')
    console.log('   → Review negative keywords (may be too restrictive)\n')
  }

  if (totalClicks === 0 && totalImpressions > 0) {
    console.log('⚠️  LOW CTR: Getting impressions but no clicks')
    console.log('   → Improve ad copy relevance')
    console.log('   → Add promotional offers')
    console.log('   → Test different headlines\n')
  }

  console.log('✅ Next steps:')
  console.log('1. Review and increase bids for top keywords')
  console.log('2. Check quality scores and improve low-scoring keywords')
  console.log('3. Review negative keyword list')
  console.log('4. Link GA4 to Google Ads for conversion tracking')
  console.log('5. Enable automated bidding once sufficient data is collected\n')
}

runDiagnostics()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Diagnostics failed:', error)
    process.exit(1)
  })
