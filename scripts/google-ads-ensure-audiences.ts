#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi, enums } from 'google-ads-api'

type AudienceTarget = {
  resourceName: string
  name: string
}

type ExistingAudience = {
  adGroupId: string
  criterionResource: string
  userListResource: string
  status: string
}

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

const formatEnum = (value: unknown, mapping: Record<string | number, string>): string => {
  if (value === undefined || value === null) return 'UNKNOWN'
  if (typeof value === 'number') return mapping[value] ?? `ENUM_${value}`
  if (typeof value === 'string') return value
  return String(value)
}

const fetchAudienceTarget = async (): Promise<AudienceTarget | null> => {
  const preferredNames = [
    'All visitors (AdWords)',
    'All visitors (Google Ads)',
    'AdWords optimized list',
  ]

  for (const name of preferredNames) {
    const rows = await customer.query(`
      SELECT user_list.resource_name, user_list.name, user_list.membership_status
      FROM user_list
      WHERE user_list.membership_status = OPEN
        AND user_list.name = '${name.replace(/'/g, "''")}'
      LIMIT 1
    `)

    if (rows.length) {
      const row = rows[0]
      if (row.user_list?.resource_name) {
        return {
          resourceName: row.user_list.resource_name,
          name: row.user_list.name ?? name,
        }
      }
    }
  }

  return null
}

const fetchEnabledAdGroups = async () => {
  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      ad_group.id,
      ad_group.name,
      ad_group.status,
      ad_group.type
    FROM ad_group
    WHERE campaign.status = ENABLED
      AND ad_group.status != REMOVED
      AND ad_group.type = SEARCH_STANDARD
  `)

  return rows
    .map((row) => {
      const adGroupId = row.ad_group?.id ? String(row.ad_group.id) : null
      if (!adGroupId) return null
      const adGroupStatus = formatEnum(row.ad_group?.status, enums.AdGroupStatus as any)
      if (adGroupStatus === 'PAUSED') return null
      return {
        campaignId: row.campaign?.id ? String(row.campaign.id) : 'unknown',
        campaignName: row.campaign?.name ?? 'Campaign',
        adGroupId,
        adGroupName: row.ad_group?.name ?? 'Ad Group',
      }
    })
    .filter(Boolean) as {
    campaignId: string
    campaignName: string
    adGroupId: string
    adGroupName: string
  }[]
}

const fetchExistingAudiences = async (): Promise<Map<string, ExistingAudience>> => {
  const rows = await customer.query(`
    SELECT
      ad_group.id,
      ad_group_criterion.resource_name,
      ad_group_criterion.status,
      ad_group_criterion.user_list.user_list
    FROM ad_group_criterion
    WHERE ad_group_criterion.type = USER_LIST
      AND ad_group_criterion.status != REMOVED
  `)

  const map = new Map<string, ExistingAudience>()
  rows.forEach((row) => {
    const adGroupId = row.ad_group?.id ? String(row.ad_group.id) : undefined
    const userListResource = row.ad_group_criterion?.user_list?.user_list
    const criterionResource = row.ad_group_criterion?.resource_name
    if (!adGroupId || !userListResource || !criterionResource) return
    map.set(`${adGroupId}:${userListResource}`, {
      adGroupId,
      criterionResource,
      userListResource,
      status: formatEnum(row.ad_group_criterion?.status, enums.AdGroupCriterionStatus as any),
    })
  })
  return map
}

const attachAudience = async (adGroupId: string, resourceName: string) => {
  const response = await customer.adGroupCriteria.create([
    {
      ad_group: `customers/${customerId}/adGroups/${adGroupId}`,
      user_list: { user_list: resourceName },
      status: enums.AdGroupCriterionStatus.ENABLED,
    },
  ])
  return response.results?.[0]?.resource_name
}

const enableAudience = async (criterionResource: string) => {
  await customer.adGroupCriteria.update([
    {
      resource_name: criterionResource,
      status: enums.AdGroupCriterionStatus.ENABLED,
    },
  ])
}

const main = async () => {
  const audience = await fetchAudienceTarget()
  if (!audience) {
    console.log('⚠️  No reusable user lists available to attach as an observation audience.')
    return
  }

  const adGroups = await fetchEnabledAdGroups()
  if (!adGroups.length) {
    console.log('⚠️  No active ad groups found to attach audiences to.')
    return
  }

  const existing = await fetchExistingAudiences()

  const added: string[] = []
  const reenabled: string[] = []

  for (const adGroup of adGroups) {
    const key = `${adGroup.adGroupId}:${audience.resourceName}`
    const current = existing.get(key)

    if (!current) {
      await attachAudience(adGroup.adGroupId, audience.resourceName)
      added.push(`${adGroup.campaignName} → ${adGroup.adGroupName}`)
      continue
    }

    if (current.status !== 'ENABLED') {
      await enableAudience(current.criterionResource)
      reenabled.push(`${adGroup.campaignName} → ${adGroup.adGroupName}`)
    }
  }

  if (added.length === 0 && reenabled.length === 0) {
    console.log(`✅ Audience "${audience.name}" already attached to all active ad groups.`)
    return
  }

  console.log(`Audience "${audience.name}" synced.`)
  if (added.length) {
    console.log(' ➕ Added to:')
    added.forEach((line) => console.log(`    • ${line}`))
  }
  if (reenabled.length) {
    console.log(' ♻️  Re-enabled on:')
    reenabled.forEach((line) => console.log(`    • ${line}`))
  }
}

main().catch((error) => {
  console.error('❌ Failed to ensure audiences:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
