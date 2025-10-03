#!/usr/bin/env tsx
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'
import fs from 'fs'
import path from 'path'

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

const STATUS_LABELS: Record<number, string> = {
  0: 'UNSPECIFIED',
  1: 'UNKNOWN',
  2: 'ENABLED',
  3: 'PAUSED',
  4: 'REMOVED',
}

const APPROVAL_LABELS: Record<number, string> = {
  0: 'UNSPECIFIED',
  1: 'UNKNOWN',
  2: 'APPROVED',
  3: 'DISAPPROVED',
  4: 'APPROVED_LIMITED',
}

async function auditAds() {
  console.log('\n🔍 AD AUDIT - Windows – Somerset Campaign\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80) + '\n')

  const query = `
    SELECT
      ad_group_ad.ad.id,
      ad_group_ad.ad.name,
      ad_group_ad.ad.type,
      ad_group_ad.status,
      ad_group_ad.policy_summary.approval_status,
      ad_group_ad.policy_summary.review_status,
      ad_group_ad.policy_summary.policy_topic_entries,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_search_ad.descriptions,
      ad_group_ad.ad.final_urls,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM ad_group_ad
    WHERE campaign.name = 'Windows – Somerset'
      AND segments.date DURING LAST_30_DAYS
  `

  const results = await customer.query(query)

  const ads: any[] = []
  const summary = {
    total: 0,
    enabled: 0,
    paused: 0,
    removed: 0,
    approved: 0,
    approved_limited: 0,
    disapproved: 0,
  }

  for (const row of results) {
    const ad = row.ad_group_ad
    const metrics = row.metrics

    const status = ad.status
    const approval = ad.policy_summary?.approval_status || 0

    const adData = {
      id: ad.ad.id,
      name: ad.ad.name || 'Unnamed',
      type: ad.ad.type,
      status: {
        code: status,
        label: STATUS_LABELS[status] || status,
      },
      approval: {
        code: approval,
        label: APPROVAL_LABELS[approval] || approval,
      },
      review_status: ad.policy_summary?.review_status,
      policy_issues: ad.policy_summary?.policy_topic_entries?.length || 0,
      policy_details: ad.policy_summary?.policy_topic_entries || [],
      headlines_count: ad.ad.responsive_search_ad?.headlines?.length || 0,
      descriptions_count: ad.ad.responsive_search_ad?.descriptions?.length || 0,
      final_urls: ad.ad.final_urls || [],
      performance: {
        impressions: Number(metrics.impressions || 0),
        clicks: Number(metrics.clicks || 0),
        cost_gbp: Number(metrics.cost_micros || 0) / 1_000_000,
      }
    }

    ads.push(adData)
    summary.total++

    if (status === 2) summary.enabled++
    if (status === 3) summary.paused++
    if (status === 4) summary.removed++

    if (approval === 2) summary.approved++
    if (approval === 4) summary.approved_limited++
    if (approval === 3) summary.disapproved++
  }

  console.log('📊 SUMMARY:\n')
  console.log(`Total Ads: ${summary.total}`)
  console.log(`  ENABLED: ${summary.enabled}`)
  console.log(`  PAUSED: ${summary.paused}`)
  console.log(`  REMOVED: ${summary.removed}`)
  console.log(`\nApproval Status:`)
  console.log(`  APPROVED: ${summary.approved}`)
  console.log(`  APPROVED_LIMITED: ${summary.approved_limited}`)
  console.log(`  DISAPPROVED: ${summary.disapproved}`)
  console.log('\n' + '='.repeat(80) + '\n')

  console.log('📋 AD DETAILS:\n')

  // Group by status
  const enabledAds = ads.filter(a => a.status.code === 2)
  const pausedAds = ads.filter(a => a.status.code === 3)
  const removedAds = ads.filter(a => a.status.code === 4)

  if (enabledAds.length > 0) {
    console.log(`✅ ENABLED ADS (${enabledAds.length}):\n`)
    enabledAds.forEach(ad => {
      console.log(`  Ad ID: ${ad.id}`)
      console.log(`  Name: ${ad.name}`)
      console.log(`  Approval: ${ad.approval.label}`)
      console.log(`  Headlines: ${ad.headlines_count}, Descriptions: ${ad.descriptions_count}`)
      console.log(`  Performance: ${ad.performance.impressions} impr, ${ad.performance.clicks} clicks, £${ad.performance.cost_gbp.toFixed(2)}`)
      if (ad.policy_issues > 0) {
        console.log(`  ⚠️  Policy Issues: ${ad.policy_issues}`)
      }
      console.log('')
    })
  }

  if (removedAds.length > 0) {
    console.log(`❌ REMOVED ADS (${removedAds.length}):\n`)

    // Separate by approval status
    const removedApproved = removedAds.filter(a => a.approval.code === 2)
    const removedApprovedLimited = removedAds.filter(a => a.approval.code === 4)
    const removedDisapproved = removedAds.filter(a => a.approval.code === 3)

    console.log(`  Can re-enable (APPROVED): ${removedApproved.length}`)
    console.log(`  Can re-enable (APPROVED_LIMITED): ${removedApprovedLimited.length}`)
    console.log(`  Cannot re-enable (DISAPPROVED): ${removedDisapproved.length}\n`)

    // Show candidates for re-enabling
    const reEnableCandidates = [...removedApproved, ...removedApprovedLimited]
    if (reEnableCandidates.length > 0) {
      console.log(`\n🔄 RE-ENABLE CANDIDATES (${reEnableCandidates.length}):\n`)
      reEnableCandidates.forEach(ad => {
        console.log(`  Ad ID: ${ad.id}`)
        console.log(`  Approval: ${ad.approval.label}`)
        console.log(`  Past Performance: ${ad.performance.impressions} impr, ${ad.performance.clicks} clicks`)
        console.log(`  Headlines: ${ad.headlines_count}, Descriptions: ${ad.descriptions_count}`)
        console.log('')
      })
    }
  }

  // Save backup
  const backupDir = path.join(process.cwd(), 'docs', 'ads', 'history')
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  const backupFile = path.join(backupDir, `2025-10-03-ad-audit-${Date.now()}.json`)
  fs.writeFileSync(backupFile, JSON.stringify({ summary, ads }, null, 2))
  console.log(`\n💾 Backup saved to: ${backupFile}\n`)

  return { summary, ads, enabledAds, removedAds }
}

auditAds().catch(console.error)
