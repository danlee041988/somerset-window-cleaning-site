#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

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

// A/B Test Ad for Windows Campaign
// TEST: Price-focused headlines vs. Feature-focused headlines
const AB_TEST_AD = {
  campaign: 'Windows – Somerset',
  adGroup: 'Windows – Somerset Ad Group',
  headlines: [
    'Window Cleaning From £20',       // TEST: Price in headline
    'Affordable Window Cleaning',      // TEST: Value messaging
    'Somerset Window Cleaner',         // CONTROL: Brand + Service
    'Frames, Sills & Doors Included',  // CONTROL: Feature
    'Pure Water Pole Reach 3 Floors',  // CONTROL: Feature
    'Book Local Window Cleaners',      // CONTROL: Action
    'Fast Online Quotes',              // CONTROL: Action
    'One-Off or Regular Visits',       // CONTROL: Flexibility
  ],
  descriptions: [
    'Window cleaning from £20. Pure water technology. Book online today.',
    'Streak-free windows with frames and sills included. No minimum charge.',
    'Fully insured local team serving Street, Glastonbury and Wells.',
    'Book online in minutes - pay by Direct Debit or card.',
  ],
  finalUrl: 'https://somersetwindowcleaning.co.uk/services/window-cleaning',
}

async function findAdGroupId() {
  console.log(`🔍 Finding ad group: ${AB_TEST_AD.adGroup}`)

  const rows = await customer.query(`
    SELECT
      campaign.name,
      ad_group.id,
      ad_group.name
    FROM ad_group
    WHERE campaign.name = '${AB_TEST_AD.campaign}'
      AND ad_group.name = '${AB_TEST_AD.adGroup}'
      AND campaign.status = 'ENABLED'
  `)

  for (const row of rows) {
    const adGroupId = row.ad_group?.id
    if (adGroupId) {
      console.log(`✅ Found ad group ID: ${adGroupId}`)
      return String(adGroupId)
    }
  }

  throw new Error(`Ad group not found: ${AB_TEST_AD.adGroup}`)
}

async function countExistingAds(adGroupId: string) {
  const rows = await customer.query(`
    SELECT
      ad_group_ad.ad.id,
      ad_group_ad.status
    FROM ad_group_ad
    WHERE ad_group.id = ${adGroupId}
      AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'
  `)

  const count = rows.length
  console.log(`📊 Found ${count} existing ads in ad group`)
  return count
}

async function createABTestAd(adGroupId: string) {
  console.log('\n📝 Creating A/B test ad...')

  const adGroupResourceName = `customers/${customerId}/adGroups/${adGroupId}`

  const result = await customer.adGroupAds.create([
    {
      ad_group: adGroupResourceName,
      status: 'ENABLED',
      ad: {
        final_urls: [AB_TEST_AD.finalUrl],
        responsive_search_ad: {
          headlines: AB_TEST_AD.headlines.map((text) => ({ text })),
          descriptions: AB_TEST_AD.descriptions.map((text) => ({ text })),
        },
      },
    },
  ])

  const adId = result.results?.[0]?.resource_name
  if (!adId) {
    throw new Error('Failed to create A/B test ad')
  }

  console.log(`✅ Created A/B test ad: ${adId}`)
  return adId
}

async function main() {
  console.log('🚀 Adding A/B Test Ad to Windows Campaign\n')
  console.log('📋 Test Hypothesis:')
  console.log('   Price-focused headlines ("Window Cleaning From £20")')
  console.log('   vs.')
  console.log('   Feature-focused headlines ("4-Weekly Window Cleaning")\n')

  const adGroupId = await findAdGroupId()
  const existingCount = await countExistingAds(adGroupId)

  if (existingCount >= 3) {
    console.log('\n⚠️  Warning: Ad group already has 3+ ads.')
    console.log('   Google Ads recommends max 3 ads per ad group.')
    console.log('   Consider pausing an existing ad before adding this one.\n')
  }

  await createABTestAd(adGroupId)

  console.log('\n✅ A/B Test Ad Added Successfully!')
  console.log('\n📊 Next Steps:')
  console.log('   1. Wait 14 days for statistical significance')
  console.log('   2. Go to: https://ads.google.com/aw/ads')
  console.log('   3. Filter by "Windows – Somerset" campaign')
  console.log('   4. Check "Ad strength" and performance metrics')
  console.log('   5. Pause the losing ad variant')
  console.log('\n💡 Key Metrics to Compare:')
  console.log('   • CTR (Click-Through Rate)')
  console.log('   • Conversion Rate')
  console.log('   • Cost Per Conversion')
  console.log('   • Impressions share')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Failed to add A/B test ad:')
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
