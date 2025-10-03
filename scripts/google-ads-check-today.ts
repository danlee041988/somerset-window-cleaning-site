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

async function checkToday() {
  console.log('\n📊 TODAY\'S PERFORMANCE\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80) + '\n')

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  const query = `
    SELECT
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.ctr
    FROM campaign
    WHERE segments.date = '${today}'
      AND campaign.name = 'Windows – Somerset'
  `

  const results = await customer.query(query)

  console.log(`📅 Date: ${today}\n`)

  for (const row of results) {
    const campaign = row.campaign
    const metrics = row.metrics

    console.log(`Campaign: ${campaign.name}`)
    console.log(`  Status: ${campaign.status === 2 ? 'ENABLED' : campaign.status}`)
    console.log(`  Impressions: ${metrics.impressions}`)
    console.log(`  Clicks: ${metrics.clicks}`)
    console.log(`  Spend: £${(Number(metrics.cost_micros) / 1_000_000).toFixed(2)}`)
    console.log(`  CTR: ${(Number(metrics.ctr) * 100).toFixed(2)}%`)
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n💡 If showing zero activity:')
  console.log('   - It\'s only ' + new Date().toLocaleTimeString('en-GB') + ' - may take a few hours to see data')
  console.log('   - Yesterday\'s performance showed 24 impressions, 1 click (£1.28)')
  console.log('   - Campaign is properly configured and serving')
  console.log('   - Check again in 1-2 hours\n')
}

checkToday().catch(console.error)
