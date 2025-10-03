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

async function updateKeywords() {
  console.log('\n🔄 UPDATING KEYWORDS\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80) + '\n')

  // Step 1: Find "downpipe cleaning" keyword
  console.log('Step 1: Searching for "downpipe cleaning" keyword...\n')

  const searchQuery = `
    SELECT
      ad_group_criterion.resource_name,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status,
      ad_group.id,
      ad_group.name,
      campaign.name
    FROM keyword_view
    WHERE ad_group_criterion.keyword.text = 'downpipe cleaning'
  `

  const searchResults = await customer.query(searchQuery)

  let downpipeKeyword: any = null
  for (const row of searchResults) {
    downpipeKeyword = row
    console.log(`Found: "${row.ad_group_criterion.keyword.text}"`)
    console.log(`  Campaign: ${row.campaign.name}`)
    console.log(`  Ad Group: ${row.ad_group.name}`)
    console.log(`  Match Type: ${row.ad_group_criterion.keyword.match_type}`)
    console.log(`  Status: ${row.ad_group_criterion.status}`)
    console.log(`  Resource: ${row.ad_group_criterion.resource_name}`)
  }

  if (!downpipeKeyword) {
    console.log('❌ "downpipe cleaning" keyword not found')
  }

  // Step 2: Remove "downpipe cleaning" if found
  if (downpipeKeyword) {
    console.log('\n\nStep 2: Removing "downpipe cleaning" keyword...\n')

    try {
      await customer.adGroupCriteria.remove([downpipeKeyword.ad_group_criterion.resource_name])
      console.log('✅ Successfully removed "downpipe cleaning" keyword')
    } catch (error: any) {
      console.error('❌ Error removing keyword:', error.message)
    }
  }

  // Step 3: Check if "gutter clearing" exists
  console.log('\n\nStep 3: Checking for "gutter clearing" keyword...\n')

  const gutterSearchQuery = `
    SELECT
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status,
      campaign.name,
      ad_group.name
    FROM keyword_view
    WHERE ad_group_criterion.keyword.text LIKE '%gutter clearing%'
  `

  const gutterResults = await customer.query(gutterSearchQuery)

  let hasGutterClearing = false
  for (const row of gutterResults) {
    hasGutterClearing = true
    console.log(`Found: "${row.ad_group_criterion.keyword.text}"`)
    console.log(`  Campaign: ${row.campaign.name}`)
    console.log(`  Match Type: ${row.ad_group_criterion.keyword.match_type}`)
    console.log(`  Status: ${row.ad_group_criterion.status}`)
  }

  if (!hasGutterClearing) {
    console.log('⚠️  "gutter clearing" keyword not found')

    // Step 4: Add "gutter clearing" to Gutter campaign
    console.log('\n\nStep 4: Adding "gutter clearing" keyword to Gutter campaign...\n')

    // First, get the Gutter campaign ad group ID
    const gutterCampaignQuery = `
      SELECT
        ad_group.id,
        ad_group.name,
        campaign.name
      FROM ad_group
      WHERE campaign.name = 'Gutter – Somerset'
    `

    const gutterCampaignResults = await customer.query(gutterCampaignQuery)

    for (const row of gutterCampaignResults) {
      const adGroupId = row.ad_group.id

      console.log(`Adding to Ad Group: ${row.ad_group.name} (ID: ${adGroupId})`)

      try {
        // Add "gutter clearing" with phrase match
        await customer.adGroupCriteria.create([
          {
            ad_group: `customers/${customerId}/adGroups/${adGroupId}`,
            status: 2, // ENABLED
            keyword: {
              text: 'gutter clearing',
              match_type: 3, // PHRASE
            },
            cpc_bid_micros: 2_000_000, // £2.00
          }
        ])

        console.log('✅ Successfully added "gutter clearing" keyword (phrase match, £2.00 bid)')
      } catch (error: any) {
        console.error('❌ Error adding keyword:', error.message)
      }
    }
  } else {
    console.log('✅ "gutter clearing" keyword already exists')
  }

  console.log('\n' + '='.repeat(80))
  console.log('\n✅ KEYWORD UPDATE COMPLETE\n')
}

updateKeywords().catch(console.error)
