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

async function verifyChanges() {
  console.log('\n✅ VERIFYING KEYWORD CHANGES\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80) + '\n')

  // Check that downpipe cleaning is gone
  console.log('1. Checking "downpipe cleaning" is removed...\n')

  const downpipeQuery = `
    SELECT
      ad_group_criterion.keyword.text,
      ad_group_criterion.status,
      campaign.name
    FROM keyword_view
    WHERE ad_group_criterion.keyword.text = 'downpipe cleaning'
  `

  const downpipeResults = await customer.query(downpipeQuery)

  let downpipeCount = 0
  let downpipeActive = 0
  for (const row of downpipeResults) {
    downpipeCount++
    const status = row.ad_group_criterion.status === 2 ? 'ENABLED' : row.ad_group_criterion.status === 4 ? 'REMOVED' : row.ad_group_criterion.status
    if (row.ad_group_criterion.status === 2) {
      downpipeActive++
      console.log(`  ❌ Still ENABLED: "${row.ad_group_criterion.keyword.text}" (Status: ${status})`)
    } else {
      console.log(`  ✅ Removed: "${row.ad_group_criterion.keyword.text}" (Status: ${status})`)
    }
  }

  if (downpipeCount === 0) {
    console.log('  ✅ "downpipe cleaning" not found in account')
  } else if (downpipeActive === 0) {
    console.log(`  ✅ All ${downpipeCount} "downpipe cleaning" keyword(s) successfully removed`)
  }

  // Check that gutter clearing exists
  console.log('\n2. Checking "gutter clearing" exists...\n')

  const gutterQuery = `
    SELECT
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status,
      ad_group_criterion.cpc_bid_micros,
      campaign.name,
      ad_group.name
    FROM keyword_view
    WHERE ad_group_criterion.keyword.text = 'gutter clearing'
  `

  const gutterResults = await customer.query(gutterQuery)

  let gutterCount = 0
  for (const row of gutterResults) {
    gutterCount++
    const matchType = row.ad_group_criterion.keyword.match_type === 3 ? 'PHRASE' : row.ad_group_criterion.keyword.match_type
    const status = row.ad_group_criterion.status === 2 ? 'ENABLED' : row.ad_group_criterion.status
    const bid = (row.ad_group_criterion.cpc_bid_micros / 1_000_000).toFixed(2)

    console.log(`  ✅ Found: "${row.ad_group_criterion.keyword.text}"`)
    console.log(`     Campaign: ${row.campaign.name}`)
    console.log(`     Ad Group: ${row.ad_group.name}`)
    console.log(`     Match Type: ${matchType}`)
    console.log(`     Status: ${status}`)
    console.log(`     Bid: £${bid}`)
  }

  if (gutterCount === 0) {
    console.log('  ❌ "gutter clearing" not found')
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n📊 SUMMARY:\n')
  console.log(`  Removed: ${downpipeActive === 0 ? '✅' : '❌'} "downpipe cleaning"`)
  console.log(`  Added: ${gutterCount > 0 ? '✅' : '❌'} "gutter clearing"\n`)
}

verifyChanges().catch(console.error)
