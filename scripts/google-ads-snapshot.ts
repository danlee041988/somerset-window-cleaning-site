#!/usr/bin/env tsx

import fs from 'fs'
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

const toCurrency = (micros: unknown) => Number(((Number(micros) || 0) / 1_000_000).toFixed(2))
const formatDate = (date: Date) => date.toISOString().slice(0, 10)

async function fetchCampaigns() {
  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign.start_date,
      campaign.end_date,
      campaign_budget.id,
      campaign_budget.name,
      campaign_budget.amount_micros
    FROM campaign
    WHERE campaign.status IN ('ENABLED', 'PAUSED')
  `)

  return rows.map((row) => {
    const channelRaw = row.campaign?.advertising_channel_type
    const channelType = typeof channelRaw === 'number'
      ? enums.AdvertisingChannelType[channelRaw] ?? `TYPE_${channelRaw}`
      : channelRaw ?? 'UNKNOWN'
    const statusRaw = row.campaign?.status
    const status = typeof statusRaw === 'number'
      ? enums.CampaignStatus[statusRaw] ?? `STATUS_${statusRaw}`
      : statusRaw ?? 'UNSPECIFIED'

    return {
      id: String(row.campaign?.id ?? ''),
      name: row.campaign?.name ?? 'Campaign',
      status,
      channelType,
      startDate: row.campaign?.start_date ?? null,
      endDate: row.campaign?.end_date ?? null,
      budgetId: String(row.campaign_budget?.id ?? ''),
      budgetName: row.campaign_budget?.name ?? null,
      budgetMicros: Number(row.campaign_budget?.amount_micros ?? 0),
      budgetGBP: toCurrency(row.campaign_budget?.amount_micros ?? 0),
    }
  })
}

async function fetchAdGroups() {
  const rows = await customer.query(`
    SELECT
      campaign.id,
      ad_group.id,
      ad_group.name,
      ad_group.status,
      ad_group.type
    FROM ad_group
    WHERE ad_group.status IN ('ENABLED', 'PAUSED')
  `)

  return rows.map((row) => {
    const statusRaw = row.ad_group?.status
    const status = typeof statusRaw === 'number'
      ? enums.AdGroupStatus[statusRaw] ?? `STATUS_${statusRaw}`
      : statusRaw ?? 'UNSPECIFIED'
    const typeRaw = row.ad_group?.type
    const type = typeof typeRaw === 'number'
      ? enums.AdGroupType[typeRaw] ?? `TYPE_${typeRaw}`
      : typeRaw ?? 'UNSPECIFIED'

    return {
      campaignId: String(row.campaign?.id ?? ''),
      id: String(row.ad_group?.id ?? ''),
      name: row.ad_group?.name ?? 'Ad group',
      status,
      type,
    }
  })
}

async function fetchStats(range: 'LAST_7_DAYS' | 'LAST_30_DAYS') {
  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value
    FROM campaign
    WHERE segments.date DURING ${range}
  `)

  return rows.map((row) => ({
    campaignId: String(row.campaign?.id ?? ''),
    name: row.campaign?.name ?? 'Campaign',
    impressions: Number(row.metrics?.impressions ?? 0),
    clicks: Number(row.metrics?.clicks ?? 0),
    costMicros: Number(row.metrics?.cost_micros ?? 0),
    costGBP: toCurrency(row.metrics?.cost_micros ?? 0),
    conversions: Number(row.metrics?.conversions ?? 0),
    conversionValue: Number(row.metrics?.conversions_value ?? 0),
  }))
}

async function fetchNegativeCounts() {
  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign_criterion.criterion_id,
      campaign_criterion.keyword.text
    FROM campaign_criterion
    WHERE campaign_criterion.type = 'KEYWORD'
      AND campaign_criterion.negative = TRUE
  `)

  const counts = new Map<string, number>()
  rows.forEach((row) => {
    const id = String(row.campaign?.id ?? '')
    if (!counts.has(id)) counts.set(id, 0)
    counts.set(id, counts.get(id)! + 1)
  })
  return counts
}

export const generateSnapshot = async (): Promise<{ filePath: string; summary: any }> => {
  const [campaigns, adGroups, stats7, stats30, negativeCounts] = await Promise.all([
    fetchCampaigns(),
    fetchAdGroups(),
    fetchStats('LAST_7_DAYS'),
    fetchStats('LAST_30_DAYS'),
    fetchNegativeCounts(),
  ])

  const summary = {
    generatedAt: new Date().toISOString(),
    totals: {
      campaigns: campaigns.length,
      adGroups: adGroups.length,
      searchCampaigns: campaigns.filter((c) => c.channelType === 'SEARCH').length,
      displayCampaigns: campaigns.filter((c) => c.channelType === 'DISPLAY').length,
    },
    campaigns: campaigns.map((campaign) => {
      const last7 = stats7.find((s) => s.campaignId === campaign.id)
      const last30 = stats30.find((s) => s.campaignId === campaign.id)
      return {
        ...campaign,
        negatives: negativeCounts.get(campaign.id) ?? 0,
        stats: {
          last7: last7 ?? null,
          last30: last30 ?? null,
        },
        adGroups: adGroups
          .filter((group) => group.campaignId === campaign.id)
          .map(({ id, name, status, type }) => ({ id, name, status, type })),
      }
    }),
  }

  const historyDir = path.join(__dirname, '..', 'docs', 'ads', 'history')
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true })
  }

  const filePath = path.join(historyDir, `${formatDate(new Date())}-snapshot.json`)
  fs.writeFileSync(filePath, JSON.stringify(summary, null, 2))
  return { filePath, summary }
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  generateSnapshot()
    .then(({ filePath }) => {
      console.log(`Snapshot saved to ${filePath}`)
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Failed to generate snapshot:', error instanceof Error ? error.message : error)
      process.exit(1)
    })
}
