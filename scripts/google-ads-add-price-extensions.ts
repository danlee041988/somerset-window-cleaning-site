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

const CAMPAIGNS = [
  'Windows – Somerset',
  'Gutter – Somerset',
  'Conservatory – Somerset',
  'Solar Panels – Somerset',
]

const PRICE_ITEMS = [
  {
    header: 'Window Cleaning',
    description: 'Spotless, streak-free windows',
    price_micros: 20000000, // £20
    final_url: 'https://somersetwindowcleaning.co.uk/services/window-cleaning',
    unit: enums.PriceExtensionPriceUnit.PER_HOUR,
  },
  {
    header: 'Gutter Clearing',
    description: 'Prevent water damage',
    price_micros: 70000000, // £70
    final_url: 'https://somersetwindowcleaning.co.uk/services/gutter-clearing',
    unit: enums.PriceExtensionPriceUnit.PER_HOUR,
  },
  {
    header: 'Fascias & Soffits',
    description: 'Brighten exterior PVC',
    price_micros: 60000000, // £60 (placeholder, adjust if needed)
    final_url: 'https://somersetwindowcleaning.co.uk/services/fascias-soffits-cleaning',
    unit: enums.PriceExtensionPriceUnit.PER_HOUR,
  },
]

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

async function ensurePriceAsset(): Promise<string> {
  // Check if price asset exists
  const rows = await customer.query(`
    SELECT asset.resource_name,
           asset.price_asset.type,
           asset.price_asset.language_code
    FROM asset
    WHERE asset.type = PRICE
  `)

  // Check for existing price asset matching our setup
  for (const row of rows) {
    const resource = row.asset?.resource_name
    const type = row.asset?.price_asset?.type
    const lang = row.asset?.price_asset?.language_code

    if (resource && type === 'SERVICES' && lang === 'en') {
      console.log('✅ Found existing price asset:', resource)
      return resource
    }
  }

  // Create new price asset
  console.log('📝 Creating new price asset...')
  const result = await customer.assets.create([
    {
      price_asset: {
        type: 'SERVICES',
        language_code: 'en',
        price_offerings: PRICE_ITEMS.map((item) => ({
          header: item.header,
          description: item.description,
          price: {
            amount_micros: item.price_micros,
            currency_code: 'GBP',
          },
          unit: item.unit,
          final_url: item.final_url,
        })),
      },
    },
  ])

  const resource = result.results?.[0]?.resource_name
  if (!resource) {
    throw new Error('Failed to create price asset')
  }

  console.log('✅ Created price asset:', resource)
  return resource
}

async function linkPriceAssetToCampaigns(priceAssetResource: string, campaignIds: Map<string, string>) {
  console.log('\n📎 Linking price asset to campaigns...')

  // Check existing campaign assets
  const ids = Array.from(campaignIds.values())
  const rows = await customer.query(`
    SELECT campaign_asset.resource_name,
           campaign_asset.asset,
           campaign.id,
           campaign.name
    FROM campaign_asset
    WHERE campaign.id IN (${ids.join(',')})
      AND campaign_asset.field_type = PRICE
  `)

  const existingLinks = new Set<string>()
  rows.forEach((row) => {
    const campaignId = row.campaign?.id
    const asset = row.campaign_asset?.asset
    if (campaignId && asset) {
      existingLinks.add(`${campaignId}:${asset}`)
    }
  })

  for (const [campaignName, campaignId] of campaignIds.entries()) {
    const linkKey = `${campaignId}:${priceAssetResource}`

    if (existingLinks.has(linkKey)) {
      console.log(`   ✓ Already linked to: ${campaignName}`)
      continue
    }

    await customer.campaignAssets.create([
      {
        campaign: `customers/${customerId}/campaigns/${campaignId}`,
        asset: priceAssetResource,
        field_type: enums.AssetFieldType.PRICE,
      },
    ])

    console.log(`   ✅ Linked to: ${campaignName}`)
  }
}

async function main() {
  console.log('🚀 Adding Price Extensions to Google Ads\n')

  const campaignIds = await fetchCampaignIds()
  if (campaignIds.size === 0) {
    console.log('⚠️  No campaigns found')
    return
  }

  console.log(`📊 Found ${campaignIds.size} campaigns:`)
  campaignIds.forEach((id, name) => {
    console.log(`   • ${name} (${id})`)
  })

  const priceAssetResource = await ensurePriceAsset()
  await linkPriceAssetToCampaigns(priceAssetResource, campaignIds)

  console.log('\n✅ Price extensions added successfully!')
  console.log('\n📋 Price Extensions:')
  console.log('   • Window Cleaning: From £20')
  console.log('   • Gutter Clearing: From £70')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed to add price extensions:')
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
