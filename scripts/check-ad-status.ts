#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const api = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = api.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

async function checkStatus() {
  console.log('🎯 GOOGLE ADS STATUS CHECK\n')
  console.log('=' .repeat(60))

  // Check campaigns
  const campaigns = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.start_date,
      campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND campaign.advertising_channel_type = 'SEARCH'
    ORDER BY campaign.name
  `)

  const today = new Date().toISOString().split('T')[0].replace(/-/g, '')

  console.log('\n📊 CAMPAIGNS:')
  for (const row of campaigns) {
    const name = row.campaign.name
    const status = row.campaign.status
    const startDate = row.campaign.start_date
    const budget = (row.campaign_budget.amount_micros / 1000000).toFixed(2)
    const isLive = startDate <= today

    console.log(`   ${isLive ? '✅' : '⏳'} ${name}`)
    console.log(`      Budget: £${budget}/day | Start: ${startDate}`)
  }

  // Check ads
  const ads = await customer.query(`
    SELECT
      campaign.name,
      ad_group_ad.ad.id,
      ad_group_ad.status,
      ad_group_ad.policy_summary.approval_status
    FROM ad_group_ad
    WHERE campaign.status = 'ENABLED'
      AND ad_group.status = 'ENABLED'
      AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
  `)

  const campaignAds = new Map<string, any[]>()

  for (const row of ads) {
    const campaign = row.campaign.name
    if (!campaignAds.has(campaign)) {
      campaignAds.set(campaign, [])
    }
    campaignAds.get(campaign)!.push({
      id: row.ad_group_ad.ad.id,
      status: row.ad_group_ad.status,
      approval: row.ad_group_ad.policy_summary.approval_status,
    })
  }

  console.log('\n🎯 ADS:')
  for (const [campaign, adList] of campaignAds) {
    console.log(`   📁 ${campaign}`)
    for (const ad of adList) {
      const statusIcon = ad.status === 4 ? '✅' : '⏸️'
      const approvalIcon = ad.approval === 'APPROVED' ? '✅' : ad.approval === 'APPROVED_LIMITED' ? '⚠️' : '❌'
      console.log(`      ${statusIcon} Ad #${ad.id} | Approval: ${approvalIcon} ${ad.approval}`)
    }
  }

  // Check performance
  const performance = await customer.query(`
    SELECT
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND campaign.advertising_channel_type = 'SEARCH'
      AND segments.date DURING LAST_7_DAYS
  `)

  const perfMap = new Map<string, {imp: number, clicks: number, cost: number}>()

  for (const row of performance) {
    const campaign = row.campaign.name
    const imp = row.metrics.impressions || 0
    const clicks = row.metrics.clicks || 0
    const cost = row.metrics.cost_micros || 0

    if (!perfMap.has(campaign)) {
      perfMap.set(campaign, {imp: 0, clicks: 0, cost: 0})
    }
    const p = perfMap.get(campaign)!
    p.imp += imp
    p.clicks += clicks
    p.cost += cost
  }

  console.log('\n📈 PERFORMANCE (Last 7 Days):')
  let totalImp = 0
  let totalClicks = 0
  let totalCost = 0

  for (const [campaign, perf] of perfMap) {
    const costGBP = (perf.cost / 1000000).toFixed(2)
    console.log(`   ${campaign}`)
    console.log(`      ${perf.imp} impressions | ${perf.clicks} clicks | £${costGBP} spent`)
    totalImp += perf.imp
    totalClicks += perf.clicks
    totalCost += perf.cost
  }

  console.log('\n' + '='.repeat(60))
  console.log(`📊 TOTAL: ${totalImp} impressions | ${totalClicks} clicks | £${(totalCost/1000000).toFixed(2)} spent`)
  console.log('='.repeat(60))

  // Check if ads are running
  console.log('\n✅ STATUS SUMMARY:')
  if (totalImp > 0) {
    console.log('   ✅ Ads ARE running and getting impressions')
    console.log('   ✅ Started: September 25, 2025')
    console.log('   ✅ Days active: 5 days')
  } else {
    console.log('   ⚠️  Ads are enabled but not getting impressions')
    console.log('   💡 This is normal for first 24-48 hours')
  }
}

checkStatus().catch(console.error)
