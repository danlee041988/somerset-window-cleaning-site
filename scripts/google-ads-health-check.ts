#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi, enums } from 'google-ads-api'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const clientId = process.env.GOOGLE_ADS_CLIENT_ID
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID

if (!clientId || !clientSecret || !developerToken || !refreshToken || !customerId) {
  throw new Error('Missing Google Ads credentials in .env.local')
}

const api = new GoogleAdsApi({
  client_id: clientId,
  client_secret: clientSecret,
  developer_token: developerToken,
})

const customer = api.Customer({
  customer_id: customerId,
  refresh_token: refreshToken,
})

const formatStatus = (value: unknown, mapping: Record<string | number, string>): string => {
  if (value === undefined || value === null) return 'UNKNOWN'
  if (typeof value === 'number') return mapping[value] ?? `ENUM_${value}`
  if (typeof value === 'string') return value
  return String(value)
}

async function fetchAdGroupKeywordCoverage() {
  const rows = await customer.query(`
    SELECT
      campaign.name,
      campaign.status,
      ad_group.id,
      ad_group.name,
      ad_group.status,
      ad_group.type,
      ad_group_criterion.status,
      ad_group_criterion.type
    FROM ad_group_criterion
    WHERE ad_group_criterion.type IN (KEYWORD, WEBPAGE)
      AND campaign.status != REMOVED
  `)

  const groups = new Map<string, {
    campaign: string
    campaignStatus: string
    adGroupName: string
    adGroupStatus: string
    adGroupType: string
    keywordCount: number
    urlRuleCount: number
    enabledKeywords: number
    enabledUrlRules: number
  }>()

  rows.forEach((row) => {
    const adGroupId = row.ad_group?.id ? String(row.ad_group.id) : undefined
    if (!adGroupId) return

    const entry = groups.get(adGroupId) ?? {
      campaign: row.campaign?.name ?? 'Campaign',
      campaignStatus: formatStatus(row.campaign?.status, enums.CampaignStatus as any),
      adGroupName: row.ad_group?.name ?? 'Ad group',
      adGroupStatus: formatStatus(row.ad_group?.status, enums.AdGroupStatus as any),
      adGroupType: formatStatus(row.ad_group?.type, enums.AdGroupType as any),
      keywordCount: 0,
      urlRuleCount: 0,
      enabledKeywords: 0,
      enabledUrlRules: 0,
    }

    const criterionType = formatStatus(row.ad_group_criterion?.type, enums.CriterionType as any)
    const criterionStatus = formatStatus(row.ad_group_criterion?.status, enums.AdGroupCriterionStatus as any)

    if (criterionType === 'KEYWORD') {
      entry.keywordCount += 1
      if (criterionStatus === 'ENABLED') entry.enabledKeywords += 1
    } else if (criterionType === 'WEBPAGE') {
      entry.urlRuleCount += 1
      if (criterionStatus === 'ENABLED') entry.enabledUrlRules += 1
    }

    groups.set(adGroupId, entry)
  })

  return Array.from(groups.values())
}

async function fetchAdCoverage() {
  const rows = await customer.query(`
    SELECT
      campaign.name,
      ad_group.id,
      ad_group.name,
      ad_group_ad.resource_name,
      ad_group_ad.status,
      ad_group_ad.policy_summary.approval_status,
      ad_group_ad.ad.final_urls
    FROM ad_group_ad
    WHERE ad_group_ad.status != REMOVED
      AND campaign.status != REMOVED
  `)

  const ads = rows.map((row) => ({
    campaign: row.campaign?.name ?? 'Campaign',
    adGroup: row.ad_group?.name ?? 'Ad group',
    status: formatStatus(row.ad_group_ad?.status, enums.AdGroupAdStatus as any),
    approval: formatStatus(row.ad_group_ad?.policy_summary?.approval_status, enums.PolicyApprovalStatus as any),
    hasFinalUrl: Boolean(row.ad_group_ad?.ad?.final_urls?.length),
  }))

  return ads
}

async function main() {
  const [coverage, ads] = await Promise.all([fetchAdGroupKeywordCoverage(), fetchAdCoverage()])

  const issues: string[] = []

  coverage.forEach((entry) => {
    if (entry.adGroupStatus !== 'ENABLED' || entry.campaignStatus !== 'ENABLED') {
      return
    }
    const hasKeyword = entry.enabledKeywords > 0
    const hasUrlRule = entry.enabledUrlRules > 0
    if (!hasKeyword && !hasUrlRule) {
      issues.push(
        `❌ ${entry.campaign} → ${entry.adGroupName}: ENABLED but 0 active keywords and 0 active URL rules.`,
      )
    }
  })

  const adSummary = new Map<string, { total: number; enabled: number; withUrls: number }>()
  ads.forEach((ad) => {
    const key = `${ad.campaign}→${ad.adGroup}`
    const entry = adSummary.get(key) ?? { total: 0, enabled: 0, withUrls: 0 }
    entry.total += 1
    if (ad.status === 'ENABLED' && ad.approval !== 'DISAPPROVED') {
      entry.enabled += 1
      if (ad.hasFinalUrl) entry.withUrls += 1
    }
    adSummary.set(key, entry)
  })

  adSummary.forEach((entry, key) => {
    if (entry.enabled === 0) {
      issues.push(`❌ ${key}: no enabled ads.`)
    } else if (entry.withUrls < entry.enabled) {
      issues.push(`⚠️ ${key}: some enabled ads missing final URLs.`)
    }
  })

  if (issues.length === 0) {
    console.log('✅ No serving blockers detected (keywords/URL rules and ads present).')
  } else {
    console.log('Google Ads health check found issues:')
    issues.forEach((line) => console.log(line))
  }
}

main().catch((error) => {
  console.error('❌ Health check failed')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
