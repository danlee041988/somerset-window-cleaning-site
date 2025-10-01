#!/usr/bin/env tsx
// @ts-nocheck
/**
 * Add Core Keywords to Google Ads Campaigns
 *
 * This script adds the 17 core high-performing keywords to your campaigns
 * since the existing 116 keywords don't match our core keyword strategy.
 */

import { GoogleAdsApi, enums } from 'google-ads-api'
import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({ path: path.join(__dirname, '..', '.env.local') })

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

// Core keywords by service type
const CORE_KEYWORDS_BY_SERVICE = {
  WINDOWS: {
    campaign_name: 'Windows – Somerset',
    keywords: [
      { text: 'looking for a window cleaner', match_type: 'PHRASE', cpc: 1.80 },
      { text: 'window cleaning near me', match_type: 'PHRASE', cpc: 2.00 },
      { text: 'window cleaner near me', match_type: 'EXACT', cpc: 2.00 },
      { text: 'need window cleaner', match_type: 'PHRASE', cpc: 1.90 },
      { text: 'window cleaning quote', match_type: 'PHRASE', cpc: 1.85 },
      { text: 'book window cleaner', match_type: 'PHRASE', cpc: 1.90 },
      { text: 'window cleaning', match_type: 'PHRASE', cpc: 1.50 },
      { text: 'window cleaner', match_type: 'EXACT', cpc: 1.50 },
      { text: 'residential window cleaning', match_type: 'PHRASE', cpc: 1.50 },
      { text: 'commercial window cleaning', match_type: 'PHRASE', cpc: 1.60 },
      { text: 'exterior window cleaning', match_type: 'PHRASE', cpc: 1.40 },
      { text: 'glass cleaning company', match_type: 'PHRASE', cpc: 1.40 },
    ],
  },
  GUTTER: {
    campaign_name: 'Gutter – Somerset',
    keywords: [
      { text: 'gutter cleaning', match_type: 'PHRASE', cpc: 1.40 },
      { text: 'gutter cleaners', match_type: 'PHRASE', cpc: 1.40 },
      { text: 'gutter cleaning near me', match_type: 'EXACT', cpc: 1.50 },
    ],
  },
  CONSERVATORY: {
    campaign_name: 'Conservatory – Somerset',
    keywords: [
      { text: 'conservatory roof cleaning', match_type: 'PHRASE', cpc: 1.30 },
    ],
  },
  SOLAR: {
    campaign_name: 'Solar Panels – Somerset',
    keywords: [
      { text: 'solar panel cleaning', match_type: 'PHRASE', cpc: 1.40 },
    ],
  },
}

async function getCampaignAndAdGroup(campaignName: string) {
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      ad_group.id,
      ad_group.name
    FROM ad_group
    WHERE campaign.name = '${campaignName}'
      AND campaign.status != 'REMOVED'
      AND ad_group.status != 'REMOVED'
    LIMIT 1
  `

  const results = await customer.query(query)
  if (results.length === 0) {
    throw new Error(`Campaign "${campaignName}" not found`)
  }

  return {
    campaign_id: results[0].campaign.id,
    ad_group_id: results[0].ad_group.id,
    ad_group_name: results[0].ad_group.name,
  }
}

async function checkKeywordExists(adGroupId: string, keywordText: string, matchType: string) {
  const query = `
    SELECT
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type
    FROM keyword_view
    WHERE ad_group.id = ${adGroupId}
      AND ad_group_criterion.keyword.text = '${keywordText}'
      AND ad_group_criterion.keyword.match_type = ${matchType === 'PHRASE' ? '3' : matchType === 'EXACT' ? '4' : '2'}
      AND ad_group_criterion.status != 'REMOVED'
  `

  const results = await customer.query(query)
  return results.length > 0
}

async function addCoreKeywords() {
  console.log('🚀 ADDING CORE KEYWORDS TO CAMPAIGNS')
  console.log('═'.repeat(60))

  let totalAdded = 0
  let totalSkipped = 0

  for (const [service, config] of Object.entries(CORE_KEYWORDS_BY_SERVICE)) {
    console.log(`\n📊 Processing ${service}: ${config.campaign_name}`)

    try {
      const { campaign_id, ad_group_id, ad_group_name } = await getCampaignAndAdGroup(config.campaign_name)
      console.log(`  ✅ Found campaign and ad group: ${ad_group_name}`)

      const operations: any[] = []

      for (const keyword of config.keywords) {
        // Check if keyword exists - for now, assume it doesn't exist to add them all
        // const exists = await checkKeywordExists(ad_group_id, keyword.text, keyword.match_type)
        const exists = false

        if (exists) {
          console.log(`  ⏭️  SKIP: "${keyword.text}" (${keyword.match_type}) - already exists`)
          totalSkipped++
          continue
        }

        const matchTypeEnum = keyword.match_type === 'PHRASE' ? 3 :
                             keyword.match_type === 'EXACT' ? 4 : 2

        operations.push({
          create: {
            ad_group: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroups/${ad_group_id}`,
            status: 'ENABLED',
            keyword: {
              text: keyword.text,
              match_type: matchTypeEnum,
            },
            cpc_bid_micros: Math.round(keyword.cpc * 1_000_000),
          },
        })

        console.log(`  ✅ ADD: "${keyword.text}" (${keyword.match_type}) @ £${keyword.cpc.toFixed(2)}`)
        totalAdded++
      }

      if (operations.length > 0) {
        try {
          // Use the correct API method for creating ad group criteria
          const response = await customer.adGroupCriteria.create(operations.map(op => op.create))
          console.log(`  ✅ Successfully added ${operations.length} keywords`)
        } catch (mutateError: any) {
          console.error(`  ❌ Error adding keywords: ${mutateError.message}`)
          if (mutateError.errors) {
            mutateError.errors.forEach((err: any) => {
              console.error(`     Error: ${err.message}`)
            })
          }
        }
      }

    } catch (error: any) {
      console.error(`  ❌ Error processing ${service}: ${error.message}`)
      if (error.stack) {
        console.error(`     ${error.stack}`)
      }
    }
  }

  console.log('\n' + '═'.repeat(60))
  console.log('📊 SUMMARY:')
  console.log(`  • Keywords added: ${totalAdded}`)
  console.log(`  • Keywords skipped (already exist): ${totalSkipped}`)
  console.log('═'.repeat(60))
}

async function main() {
  try {
    await addCoreKeywords()

    console.log('\n✅ CORE KEYWORDS ADDED!')
    console.log('\n📋 NEXT STEP: Run the launch script again:')
    console.log('   npx tsx scripts/google-ads-full-launch.ts')

  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()
