#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi, enums } from 'google-ads-api'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

type NegativeKeywordRow = {
  keyword: string
  matchType: string
  notes?: string
}

const readCsv = (filePath: string): NegativeKeywordRow[] => {
  const content = fs.readFileSync(filePath, 'utf8')
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  const rows: NegativeKeywordRow[] = []
  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index]
    const parts = line
      .split(',')
      .map((part) => part.trim().replace(/^"|"$/g, ''))
    if (parts.length >= 2) {
      rows.push({
        keyword: parts[0],
        matchType: parts[1],
        notes: parts[2],
      })
    }
  }
  return rows
}

const clientId = process.env.GOOGLE_ADS_CLIENT_ID
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID

if (!clientId || !clientSecret || !developerToken || !refreshToken || !customerId) {
  throw new Error('Missing required Google Ads credentials in .env.local')
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

const resolveCampaigns = async () => {
  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type
    FROM campaign
    WHERE campaign.status IN ('ENABLED', 'PAUSED')
      AND campaign.advertising_channel_type = 'SEARCH'
  `)

  return rows.map((row) => ({
    id: `${row.campaign?.id ?? ''}`,
    name: row.campaign?.name ?? 'Campaign',
  }))
}

const loadExistingNegatives = async (campaignId: string) => {
  const rows = await customer.query(`
    SELECT
      campaign_criterion.criterion_id,
      campaign_criterion.negative,
      campaign_criterion.keyword.text,
      campaign_criterion.keyword.match_type
    FROM campaign_criterion
    WHERE campaign.id = ${campaignId}
      AND campaign_criterion.type = 'KEYWORD'
      AND campaign_criterion.negative = TRUE
  `)

  const existing = new Map<string, string>()
  rows.forEach((row) => {
    const text = row.campaign_criterion?.keyword?.text?.toLowerCase?.() ?? ''
    const matchType = row.campaign_criterion?.keyword?.match_type ?? 'UNSPECIFIED'
    if (text) {
      existing.set(`${matchType}::${text}`, row.campaign_criterion?.criterion_id ?? '')
    }
  })
  return existing
}

export const syncNegativeKeywords = async (): Promise<string[]> => {
  const negativePath = path.join(__dirname, '..', 'docs', 'ads', 'negatives.csv')
  const negatives = readCsv(negativePath)
  if (!negatives.length) {
    return ['No negative keywords found in CSV.']
  }

  const campaigns = await resolveCampaigns()
  if (campaigns.length === 0) {
    return ['No search campaigns found to update.']
  }

  const lines: string[] = []
  lines.push(`Found ${campaigns.length} search campaigns. Preparing to add ${negatives.length} negatives to each.`)

  for (const campaign of campaigns) {
    lines.push(`\n📋 Campaign: ${campaign.name} (${campaign.id})`)
    const existing = await loadExistingNegatives(campaign.id)
    let skipped = 0
    let inserted = 0
    const operations: any[] = []

    for (const negative of negatives) {
      const key = `${negative.matchType.toUpperCase()}::${negative.keyword.toLowerCase()}`
      if (existing.has(key)) {
        skipped += 1
        continue
      }

      const resolvedMatch = negative.matchType.toUpperCase()
      const matchEnum = enums.KeywordMatchType[resolvedMatch as keyof typeof enums.KeywordMatchType]
      if (!matchEnum) {
        skipped += 1
        continue
      }

      operations.push({
        campaign: `customers/${customerId}/campaigns/${campaign.id}`,
        negative: true,
        keyword: {
          text: negative.keyword,
          match_type: matchEnum,
        },
      })
      inserted += 1
    }

    if (operations.length) {
      await customer.campaignCriteria.create(operations)
    }

    lines.push(`   Added ${inserted} new negatives, skipped ${skipped} already present.`)
  }

  lines.push('\n✅ Negative keyword sync complete.')
  return lines
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  syncNegativeKeywords()
    .then((lines) => {
      console.log(lines.join('\n'))
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Failed to sync negative keywords:')
      console.error(error instanceof Error ? error.message : error)
      process.exit(1)
    })
}
