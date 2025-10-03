#!/usr/bin/env tsx
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

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

const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!

// Ads to re-enable (from audit)
// Prioritizing the one with actual performance first, then others
const adsToEnable = [
  775725537960, // Has performance: 24 impr, 1 click - ENABLE THIS ONE FIRST
  775725188334,
  775771802521,
  775772187823,
  776015530938,
  776143983065,
  776190393309,
  776235889092,
  776299614951,
  776396913559,
]

async function reEnableAds() {
  console.log('\n🔄 RE-ENABLING ADS\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80) + '\n')

  console.log(`Planning to re-enable ${adsToEnable.length} ads...\n`)

  const operations = adsToEnable.map(adId => {
    // Get ad group ID from ad (we know it's 186804898798 from diagnostics)
    const adGroupId = '186804898798'
    const resourceName = `customers/${customerId}/adGroupAds/${adGroupId}~${adId}`

    return {
      resource_name: resourceName,
      status: 2, // ENABLED
    }
  })

  try {
    console.log('Sending update request to Google Ads API...\n')

    const response = await customer.adGroupAds.update(operations)

    console.log('✅ SUCCESS! Ads re-enabled.\n')
    console.log(`Updated ${operations.length} ads\n`)

    operations.forEach((op, idx) => {
      console.log(`  ✓ Ad ID: ${adsToEnable[idx]} → ENABLED`)
    })

    console.log('\n' + '='.repeat(80))
    console.log('\n⏳ Wait 5-10 minutes for Google to process changes')
    console.log('Then run: npx tsx check-today-ads.ts\n')

    return response
  } catch (error: any) {
    console.error('❌ ERROR re-enabling ads:')
    console.error(error.message)

    if (error.errors) {
      error.errors.forEach((err: any) => {
        console.error(`  - ${err.error_code?.request_error}: ${err.message}`)
      })
    }

    throw error
  }
}

reEnableAds().catch(console.error)
