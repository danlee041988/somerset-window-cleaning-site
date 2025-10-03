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

async function removeRemainingDownpipe() {
  console.log('\n🗑️  REMOVING REMAINING DOWNPIPE KEYWORDS\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80) + '\n')

  const query = `
    SELECT
      ad_group_criterion.resource_name,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type
    FROM keyword_view
    WHERE ad_group_criterion.keyword.text = 'downpipe cleaning'
  `

  const results = await customer.query(query)

  const resourcesToRemove: string[] = []

  for (const row of results) {
    const matchType = row.ad_group_criterion.keyword.match_type === 3 ? 'PHRASE' : row.ad_group_criterion.keyword.match_type === 4 ? 'EXACT' : row.ad_group_criterion.keyword.match_type
    console.log(`Found: "${row.ad_group_criterion.keyword.text}" (${matchType})`)
    console.log(`  Resource: ${row.ad_group_criterion.resource_name}`)
    resourcesToRemove.push(row.ad_group_criterion.resource_name)
  }

  if (resourcesToRemove.length > 0) {
    console.log(`\nRemoving ${resourcesToRemove.length} keyword(s)...\n`)

    try {
      await customer.adGroupCriteria.remove(resourcesToRemove)
      console.log(`✅ Successfully removed ${resourcesToRemove.length} "downpipe cleaning" keyword(s)`)
    } catch (error: any) {
      console.error('❌ Error:', error.message)
    }
  } else {
    console.log('✅ No "downpipe cleaning" keywords found')
  }

  console.log('\n' + '='.repeat(80) + '\n')
}

removeRemainingDownpipe().catch(console.error)
