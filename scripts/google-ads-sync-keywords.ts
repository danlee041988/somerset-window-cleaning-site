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

interface KeywordSeedRow {
  campaign: string
  adGroupLabel: string
  keyword: string
  matchType: string
}

const readCsv = (): KeywordSeedRow[] => {
  const filePath = path.join(__dirname, '..', 'docs', 'ads', 'keywords-seed.csv')
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw.split(/\r?\n/).filter(Boolean)
  const rows: KeywordSeedRow[] = []

  for (let i = 1; i < lines.length; i += 1) {
    const [campaign, label, keyword, matchType] = lines[i]
      .split(',')
      .map((value) => value.trim().replace(/^"|"$/g, ''))

    if (!campaign || !keyword || !matchType) continue

    rows.push({
      campaign,
      adGroupLabel: label || 'Default',
      keyword,
      matchType,
    })
  }

  return rows
}

const MATCH_TYPE_MAP: Record<string, enums.KeywordMatchType> = {
  EXACT: enums.KeywordMatchType.EXACT,
  PHRASE: enums.KeywordMatchType.PHRASE,
  BROAD: enums.KeywordMatchType.BROAD,
}

const toAdGroupName = (campaign: string) => `${campaign} Ad Group`

const normaliseCampaignName = (name: string) => {
  if (name.toLowerCase() === 'brand') return 'Brand Protection'
  return name
}

const fetchCampaigns = async (campaignNames: string[]) => {
  const rows = await customer.query<any>(
    `SELECT campaign.id, campaign.name, campaign.status
     FROM campaign
     WHERE campaign.name IN (${campaignNames.map((name) => `'${name.replace(/'/g, "''")}'`).join(',')})`
  )

  const map = new Map<string, { id: string; status: string | number }>()
  for (const row of rows) {
    const campaign = row.campaign ?? {}
    if (campaign.name && campaign.id) {
      map.set(String(campaign.name), {
        id: String(campaign.id),
        status: campaign.status,
      })
    }
  }
  return map
}

const fetchAdGroups = async (campaignIds: string[]) => {
  const rows = await customer.query<any>(
    `SELECT campaign.id, campaign.name, ad_group.id, ad_group.name, ad_group.status
     FROM ad_group
     WHERE campaign.id IN (${campaignIds.join(',')})`
  )

  const map = new Map<string, { id: string; status: string | number }>()
  for (const row of rows) {
    const adGroup = row.ad_group ?? {}
    if (adGroup.name && adGroup.id) {
      map.set(String(adGroup.name), {
        id: String(adGroup.id),
        status: adGroup.status,
      })
    }
  }
  return map
}

const fetchExistingKeywords = async (adGroupIds: string[]) => {
  if (adGroupIds.length === 0) return new Map<string, Set<string>>()

  const rows = await customer.query<any>(
    `SELECT ad_group.id, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status
     FROM keyword_view
     WHERE ad_group.id IN (${adGroupIds.join(',')})
       AND ad_group_criterion.type = 'KEYWORD'
       AND ad_group_criterion.status != 'REMOVED'`
  )

  const map = new Map<string, Set<string>>()
  for (const row of rows) {
    const adGroupId = String(row.ad_group?.id ?? '')
    const keyword = row.ad_group_criterion?.keyword?.text ?? ''
    const matchType = row.ad_group_criterion?.keyword?.match_type ?? ''
    if (!adGroupId || !keyword || !matchType) continue

    const key = `${keyword.toLowerCase()}::${matchType}`
    if (!map.has(adGroupId)) map.set(adGroupId, new Set())
    map.get(adGroupId)!.add(key)
  }
  return map
}

async function main() {
  const seeds = readCsv().map((row) => ({
    ...row,
    campaign: normaliseCampaignName(row.campaign),
  }))

  const campaignsNeeded = Array.from(new Set(seeds.map((row) => row.campaign)))
  const campaignMap = await fetchCampaigns(campaignsNeeded)

  const missing = campaignsNeeded.filter((name) => !campaignMap.has(name))
  if (missing.length) {
    console.error('⚠️  Missing campaigns in Google Ads:', missing.join(', '))
  }

  const adGroupNames = seeds.map((row) => toAdGroupName(row.campaign))
  const adGroupMap = await fetchAdGroups(
    Array.from(new Set(
      adGroupNames
        .map((name) => {
          const campaignName = name.replace(/ Ad Group$/, '')
          const campaign = campaignMap.get(campaignName)
          return campaign ? campaign.id : null
        })
        .filter(Boolean) as string[],
    )),
  )

  const adGroupIdByName = new Map<string, string>()
  for (const [campaignName, campaign] of campaignMap.entries()) {
    const adGroupName = toAdGroupName(campaignName)
    if (adGroupMap.has(adGroupName)) {
      adGroupIdByName.set(adGroupName, adGroupMap.get(adGroupName)!.id)
    } else {
      // Create the ad group if it doesn't exist yet
      const adGroupResult = await customer.adGroups.create([
        {
          campaign: `customers/${customerId}/campaigns/${campaign.id}`,
          name: adGroupName,
          status: enums.AdGroupStatus.ENABLED,
          type: enums.AdGroupType.SEARCH_STANDARD,
          cpc_bid_micros: 1_500_000,
        },
      ])
      const resource = adGroupResult.results?.[0]?.resource_name
      if (!resource) throw new Error(`Failed to create ad group ${adGroupName}`)
      const adGroupId = resource.split('/').pop()!
      adGroupIdByName.set(adGroupName, adGroupId)
    }
  }

  const existingKeywords = await fetchExistingKeywords(Array.from(adGroupIdByName.values()))

  let inserted = 0
  let skipped = 0

  for (const row of seeds) {
    const adGroupName = toAdGroupName(row.campaign)
    const adGroupId = adGroupIdByName.get(adGroupName)
    if (!adGroupId) {
      console.warn(`⚠️  Skipping ${row.keyword} — ad group not found for campaign ${row.campaign}`)
      continue
    }

    const matchEnum = MATCH_TYPE_MAP[row.matchType.toUpperCase()]
    if (!matchEnum) {
      console.warn(`⚠️  Unsupported match type ${row.matchType} for keyword ${row.keyword}`)
      continue
    }

    const key = `${row.keyword.toLowerCase()}::${matchEnum}`
    if (existingKeywords.get(adGroupId)?.has(key)) {
      skipped += 1
      continue
    }

    await customer.adGroupCriteria.create([
      {
        ad_group: `customers/${customerId}/adGroups/${adGroupId}`,
        status: enums.AdGroupCriterionStatus.ENABLED,
        keyword: {
          text: row.keyword,
          match_type: matchEnum,
        },
      },
    ])

    if (!existingKeywords.has(adGroupId)) existingKeywords.set(adGroupId, new Set())
    existingKeywords.get(adGroupId)!.add(key)
    inserted += 1
  }

  console.log(`✅ Keyword sync complete. Added ${inserted} keyword(s), skipped ${skipped} already present.`)
}

main().catch((error) => {
  console.error('❌ Failed to sync keywords:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
