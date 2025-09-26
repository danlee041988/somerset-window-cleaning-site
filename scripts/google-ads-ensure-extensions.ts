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

const SITELINKS = [
  {
    linkText: 'Request a Quote',
    description1: 'Share cleaning details online',
    description2: 'Replies within one working day',
    finalUrl: 'https://somersetwindowcleaning.co.uk/book-appointment?intent=quote',
  },
  {
    linkText: 'Areas We Cover',
    description1: 'Somerset coverage map',
    description2: 'Check your postcode availability',
    finalUrl: 'https://somersetwindowcleaning.co.uk/areas',
  },
  {
    linkText: 'Services & Pricing',
    description1: 'Window, gutter & more services',
    description2: 'Tailored plans for every home',
    finalUrl: 'https://somersetwindowcleaning.co.uk/services',
  },
  {
    linkText: 'Contact Us',
    description1: 'Call, email or WhatsApp the team',
    description2: 'Friendly support Mon–Sat 8-5',
    finalUrl: 'https://somersetwindowcleaning.co.uk/get-in-touch',
  },
] as const

const CALLOUTS = [
  'Fully insured cleaners',
  '4,000+ happy customers',
  'Pure water pole system',
  'Fast quotes & reminders',
]

const STRUCTURED_SNIPPET_VALUES = ['Window Cleaning', 'Gutter Clearing', 'Conservatory Roofs', 'Solar Panels']

const CALL_ASSET = {
  countryCode: 'GB',
  phoneNumber: '07415526331',
}

const CAMPAIGNS = [
  'Windows – Somerset',
  'Gutter – Somerset',
  'Conservatory – Somerset',
  'Solar Panels – Somerset',
  'Brand Protection',
]

type AssetResources = {
  sitelinks: string[]
  callouts: string[]
  structured: string[]
  call: string | null
}

async function fetchCampaignIds() {
  const rows = await customer.query(`
    SELECT campaign.id, campaign.name
    FROM campaign
    WHERE campaign.name IN (${CAMPAIGNS.map((name) => `'${name}'`).join(',')})
  `)

  const ids = new Map<string, string>()
  rows.forEach((row) => {
    const name = row.campaign?.name
    const id = row.campaign?.id
    if (name && id) ids.set(name, String(id))
  })
  return ids
}

async function ensureSitelinkAssets(): Promise<string[]> {
  const rows = await customer.query(`
    SELECT asset.resource_name, asset.sitelink_asset.link_text
    FROM asset
    WHERE asset.type = SITELINK
  `)

  const existing = new Map<string, string>()
  rows.forEach((row) => {
    const text = row.asset?.sitelink_asset?.link_text
    const resource = row.asset?.resource_name
    if (text && resource) existing.set(text.toLowerCase(), resource)
  })

  const resources: string[] = []
  for (const item of SITELINKS) {
    const key = item.linkText.toLowerCase()
    if (existing.has(key)) {
      resources.push(existing.get(key)!)
      continue
    }

    const result = await customer.assets.create([
      {
        final_urls: [item.finalUrl],
        sitelink_asset: {
          link_text: item.linkText,
          description1: item.description1,
          description2: item.description2,
        },
      },
    ])

    const resource = result.results?.[0]?.resource_name
    if (!resource) {
      throw new Error(`Failed to create sitelink asset ${item.linkText}`)
    }
    resources.push(resource)
  }

  return resources
}

async function ensureCalloutAssets(): Promise<string[]> {
  const rows = await customer.query(`
    SELECT asset.resource_name, asset.callout_asset.callout_text
    FROM asset
    WHERE asset.type = CALLOUT
  `)

  const existing = new Map<string, string>()
  rows.forEach((row) => {
    const text = row.asset?.callout_asset?.callout_text
    const resource = row.asset?.resource_name
    if (text && resource) existing.set(text.toLowerCase(), resource)
  })

  const resources: string[] = []
  for (const text of CALLOUTS) {
    const key = text.toLowerCase()
    if (existing.has(key)) {
      resources.push(existing.get(key)!)
      continue
    }

    const result = await customer.assets.create([
      {
        callout_asset: {
          callout_text: text,
        },
      },
    ])

    const resource = result.results?.[0]?.resource_name
    if (!resource) {
      throw new Error(`Failed to create callout asset ${text}`)
    }
    resources.push(resource)
  }

  return resources
}

async function ensureStructuredSnippetAsset(): Promise<string[]> {
  const desiredKey = STRUCTURED_SNIPPET_VALUES.slice().sort().join('|').toLowerCase()

  const rows = await customer.query(`
    SELECT asset.resource_name, asset.structured_snippet_asset.header, asset.structured_snippet_asset.values
    FROM asset
    WHERE asset.type = STRUCTURED_SNIPPET
  `)

  for (const row of rows) {
    const header = row.asset?.structured_snippet_asset?.header
    const values: string[] = row.asset?.structured_snippet_asset?.values ?? []
    const resource = row.asset?.resource_name
    const key = values.slice().sort().join('|').toLowerCase()
    if (header && header.toUpperCase() === 'SERVICES' && key === desiredKey && resource) {
      return [resource]
    }
  }

  const result = await customer.assets.create([
    {
      structured_snippet_asset: {
        header: 'Services',
        values: STRUCTURED_SNIPPET_VALUES,
      },
    },
  ])

  const resource = result.results?.[0]?.resource_name
  if (!resource) {
    throw new Error('Failed to create structured snippet asset')
  }
  return [resource]
}

async function ensureCallAsset(): Promise<string | null> {
  const targetPhone = CALL_ASSET.phoneNumber.replace(/\s+/g, '')
  const rows = await customer.query(`
    SELECT asset.resource_name, asset.call_asset.phone_number
    FROM asset
    WHERE asset.type = CALL
  `)

  for (const row of rows) {
    const phone = (row.asset?.call_asset?.phone_number || '').replace(/\s+/g, '')
    const resource = row.asset?.resource_name
    if (phone === targetPhone && resource) {
      return resource
    }
  }

  const result = await customer.assets.create([
    {
      call_asset: {
        country_code: CALL_ASSET.countryCode,
        phone_number: CALL_ASSET.phoneNumber,
      },
    },
  ])

  return result.results?.[0]?.resource_name ?? null
}

async function ensureCampaignAssets(assets: AssetResources, campaignIds: Map<string, string>) {
  const ids = Array.from(campaignIds.values())
  if (!ids.length) return

  const rows = await customer.query(`
    SELECT campaign_asset.resource_name, campaign_asset.field_type, campaign_asset.asset, campaign.id
    FROM campaign_asset
    WHERE campaign.id IN (${ids.join(',')})
  `)

  const key = (campaignId: string, fieldType: enums.AssetFieldType) => `${campaignId}:${fieldType}`

  const existing = new Map<string, { resource: string; asset: string }[]>()
  rows.forEach((row) => {
    const campaignId = row.campaign?.id
    const fieldType = row.campaign_asset?.field_type
    const resource = row.campaign_asset?.resource_name
    const asset = row.campaign_asset?.asset
    if (campaignId && fieldType && resource && asset) {
      const mapKey = key(String(campaignId), fieldType)
      const list = existing.get(mapKey) ?? []
      list.push({ resource, asset })
      existing.set(mapKey, list)
    }
  })

  const attach = async (campaignId: string, fieldType: enums.AssetFieldType, assetsToLink: string[]) => {
    const mapKey = key(campaignId, fieldType)
    const current = existing.get(mapKey) ?? []
    const currentAssets = new Set(current.map((item) => item.asset))

    for (const desired of assetsToLink) {
      if (!currentAssets.has(desired)) {
        await customer.campaignAssets.create([
          {
            campaign: `customers/${customerId}/campaigns/${campaignId}`,
            asset: desired,
            field_type: fieldType,
          },
        ])
      }
    }
  }

  for (const [, campaignId] of campaignIds.entries()) {
    await attach(campaignId, enums.AssetFieldType.SITELINK, assets.sitelinks)
    await attach(campaignId, enums.AssetFieldType.CALLOUT, assets.callouts)
    await attach(campaignId, enums.AssetFieldType.STRUCTURED_SNIPPET, assets.structured)
    if (assets.call) {
      await attach(campaignId, enums.AssetFieldType.CALL, [assets.call])
    }
  }
}

export const ensureExtensions = async (): Promise<string[]> => {
  const lines: string[] = []
  const campaignIds = await fetchCampaignIds()
  if (campaignIds.size === 0) {
    return ['⚠️  No campaigns found to attach extensions.']
  }

  const sitelinks = await ensureSitelinkAssets()
  const callouts = await ensureCalloutAssets()
  const structured = await ensureStructuredSnippetAsset()
  const call = await ensureCallAsset()

  await ensureCampaignAssets(
    {
      sitelinks,
      callouts,
      structured,
      call,
    },
    campaignIds,
  )

  lines.push(
    `Assets linked → sitelinks (${sitelinks.length}), callouts (${callouts.length}), structured snippets (${structured.length}), call asset ${call ? 'linked' : 'skipped'}.`,
  )

  return lines
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  ensureExtensions()
    .then((lines) => {
      console.log(lines.join('\n'))
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Failed to ensure extensions:')
      if (error && typeof error === 'object') {
        try {
          console.error(JSON.stringify(error, null, 2))
        } catch {
          console.error(error)
        }
      } else {
        console.error(error)
      }
      process.exit(1)
    })
}
