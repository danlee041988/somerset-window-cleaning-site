#!/usr/bin/env tsx
/**
 * Enable ALL Keywords in All Campaigns
 * Simple script to enable every keyword that has a bid set
 */

import { GoogleAdsApi } from 'google-ads-api'
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

async function enableAllKeywords() {
  console.log('🚀 ENABLING ALL KEYWORDS')
  console.log('═'.repeat(60))

  const query = `
    SELECT
      ad_group_criterion.resource_name,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status,
      ad_group_criterion.cpc_bid_micros,
      campaign.name
    FROM keyword_view
    WHERE ad_group_criterion.status = 'PAUSED'
      AND ad_group_criterion.cpc_bid_micros > 0
    ORDER BY campaign.name, ad_group_criterion.keyword.text
  `

  const keywords = await customer.query(query)
  console.log(`\n📊 Found ${keywords.length} paused keywords with bids\n`)

  const operations: any[] = []

  for (const row of keywords) {
    const matchTypeName = row.ad_group_criterion.keyword.match_type === 3 ? 'PHRASE' :
                         row.ad_group_criterion.keyword.match_type === 4 ? 'EXACT' : 'BROAD'
    const cpc = (row.ad_group_criterion.cpc_bid_micros / 1_000_000).toFixed(2)

    operations.push({
      update_mask: {
        paths: ['status'],
      },
      update: {
        resource_name: row.ad_group_criterion.resource_name,
        status: 'ENABLED',
      },
    })

    console.log(
      `✅ ENABLE: "${row.ad_group_criterion.keyword.text}" (${matchTypeName}) @ £${cpc} | ${row.campaign.name}`
    )
  }

  if (operations.length === 0) {
    console.log('✅ No keywords to enable - all are already active!')
    return
  }

  console.log(`\n🚀 Enabling ${operations.length} keywords...`)

  try {
    await customer.adGroupCriteria.update(operations)
    console.log(`✅ Successfully enabled ${operations.length} keywords!`)
  } catch (error: any) {
    console.error('❌ Error enabling keywords:', error.message)
    throw error
  }
}

async function enableAllCampaigns() {
  console.log('\n📢 ENABLING ALL CAMPAIGNS')
  console.log('═'.repeat(60))

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status
    FROM campaign
    WHERE campaign.status = 'PAUSED'
  `

  const campaigns = await customer.query(query)
  console.log(`\n📊 Found ${campaigns.length} paused campaigns\n`)

  const operations: any[] = []

  for (const row of campaigns) {
    operations.push({
      update_mask: {
        paths: ['status'],
      },
      update: {
        resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaigns/${row.campaign.id}`,
        status: 'ENABLED',
      },
    })

    console.log(`✅ ENABLE: ${row.campaign.name}`)
  }

  if (operations.length === 0) {
    console.log('✅ All campaigns already enabled!')
    return
  }

  console.log(`\n🚀 Enabling ${operations.length} campaigns...`)

  try {
    await customer.campaigns.update(operations)
    console.log(`✅ Successfully enabled ${operations.length} campaigns!`)
  } catch (error: any) {
    console.error('❌ Error enabling campaigns:', error.message)
    throw error
  }
}

async function verifyActive() {
  console.log('\n🔍 VERIFICATION')
  console.log('═'.repeat(60))

  // Check campaigns
  const campaignQuery = `
    SELECT
      campaign.name,
      campaign.status
    FROM campaign
    WHERE campaign.status != 'REMOVED'
    ORDER BY campaign.name
  `

  const campaigns = await customer.query(campaignQuery)
  console.log('\n📊 Campaign Status:')
  campaigns.forEach(row => {
    const status = row.campaign.status === 2 ? '⏸️  PAUSED' : '✅ ENABLED'
    console.log(`  ${status} ${row.campaign.name}`)
  })

  // Check keywords
  const keywordQuery = `
    SELECT
      ad_group_criterion.status,
      ad_group_criterion.cpc_bid_micros
    FROM keyword_view
    WHERE ad_group_criterion.status IN ('ENABLED', 'PAUSED')
      AND ad_group_criterion.cpc_bid_micros > 0
  `

  const keywords = await customer.query(keywordQuery)
  const enabled = keywords.filter(k => k.ad_group_criterion.status === 2).length
  const paused = keywords.filter(k => k.ad_group_criterion.status === 4).length

  console.log(`\n📊 Keyword Status (with bids):`)
  console.log(`  ✅ ENABLED: ${enabled}`)
  console.log(`  ⏸️  PAUSED: ${paused}`)

  if (paused > 0) {
    console.log(`\n⚠️  Warning: ${paused} keywords still paused!`)
  } else {
    console.log('\n🎉 All keywords with bids are now ENABLED!')
  }
}

async function main() {
  try {
    await enableAllKeywords()
    await enableAllCampaigns()
    await verifyActive()

    console.log('\n' + '═'.repeat(60))
    console.log('✅ LAUNCH COMPLETE - CAMPAIGNS ARE LIVE!')
    console.log('═'.repeat(60))
    console.log('\n💡 Your ads should start showing within 1-2 hours')
    console.log('📞 Check back tomorrow morning for your first leads!')
    console.log('\n')

  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()
