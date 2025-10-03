#!/usr/bin/env tsx
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

dotenv.config({ path: '.env.local' })

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

async function checkServingStatus() {
  console.log('\n🔍 SERVING STATUS CHECK\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80) + '\n')

  // Check campaign serving status
  const campaignQuery = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.serving_status,
      campaign.primary_status,
      campaign.primary_status_reasons,
      campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.name = 'Windows – Somerset'
  `

  console.log('📊 CAMPAIGN STATUS:\n')
  const campaignResults = await customer.query(campaignQuery)

  for (const row of campaignResults) {
    const campaign = row.campaign
    const budget = row.campaign_budget

    console.log(`Campaign: ${campaign.name}`)
    console.log(`  Status: ${campaign.status}`)
    console.log(`  Serving Status: ${campaign.serving_status}`)
    console.log(`  Primary Status: ${campaign.primary_status}`)
    console.log(`  Primary Status Reasons: ${campaign.primary_status_reasons?.join(', ') || 'None'}`)
    console.log(`  Budget: £${(budget.amount_micros / 1_000_000).toFixed(2)}/day`)
  }

  // Check ad group serving status
  const adGroupQuery = `
    SELECT
      ad_group.id,
      ad_group.name,
      ad_group.status,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status,
      ad_group_criterion.cpc_bid_micros,
      ad_group_criterion.quality_info.quality_score
    FROM keyword_view
    WHERE campaign.name = 'Windows – Somerset'
      AND ad_group_criterion.status = ENABLED
  `

  console.log('\n\n🔑 ACTIVE KEYWORDS:\n')
  const keywordResults = await customer.query(adGroupQuery)

  let keywordCount = 0
  for (const row of keywordResults) {
    const keyword = row.ad_group_criterion
    const adGroup = row.ad_group

    keywordCount++
    console.log(`\nKeyword: "${keyword.keyword.text}"`)
    console.log(`  Match Type: ${keyword.keyword.match_type}`)
    console.log(`  Status: ${keyword.status}`)
    console.log(`  Ad Group: ${adGroup.name} (${adGroup.status})`)
    console.log(`  Bid: £${(keyword.cpc_bid_micros / 1_000_000).toFixed(2)}`)
    console.log(`  Quality Score: ${keyword.quality_info?.quality_score || 'Not available'}`)
  }

  console.log(`\n\nTotal ENABLED keywords: ${keywordCount}`)

  // Check enabled ads
  const adQuery = `
    SELECT
      ad_group_ad.ad.id,
      ad_group_ad.status,
      ad_group_ad.policy_summary.approval_status,
      ad_group_ad.policy_summary.review_status
    FROM ad_group_ad
    WHERE campaign.name = 'Windows – Somerset'
      AND ad_group_ad.status = ENABLED
  `

  console.log('\n\n📢 ENABLED ADS:\n')
  const adResults = await customer.query(adQuery)

  let adCount = 0
  for (const row of adResults) {
    const ad = row.ad_group_ad

    adCount++
    console.log(`Ad ID: ${ad.ad.id}`)
    console.log(`  Status: ENABLED`)
    console.log(`  Approval: ${ad.policy_summary?.approval_status === 4 ? 'APPROVED_LIMITED' : ad.policy_summary?.approval_status}`)
    console.log(`  Review Status: ${ad.policy_summary?.review_status}`)
    console.log('')
  }

  console.log(`Total ENABLED ads: ${adCount}`)

  console.log('\n' + '='.repeat(80))
  console.log('\n💡 DIAGNOSIS:\n')

  if (keywordCount === 0) {
    console.log('❌ NO ENABLED KEYWORDS - Ads cannot serve without active keywords')
    console.log('   → Need to enable or create keywords')
  } else if (keywordCount < 3) {
    console.log('⚠️  FEW KEYWORDS - Limited reach with only ${keywordCount} active keyword(s)')
  } else {
    console.log(`✅ ${keywordCount} active keywords`)
  }

  if (adCount === 0) {
    console.log('❌ NO ENABLED ADS - Campaign cannot serve')
    console.log('   → Need to enable or create ads')
  } else if (adCount < 2) {
    console.log('⚠️  ONLY 1 AD - Google recommends 2+ ads per ad group for best performance')
  } else {
    console.log(`✅ ${adCount} enabled ads`)
  }

  console.log('\n')
}

checkServingStatus().catch(console.error)
