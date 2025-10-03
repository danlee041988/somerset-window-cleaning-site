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

async function getAdContent() {
  console.log('\n🔍 FETCHING AD CONTENT\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80) + '\n')

  // Query to get full ad details including headlines and descriptions
  const query = `
    SELECT
      ad_group_ad.ad.id,
      ad_group_ad.ad.name,
      ad_group_ad.ad.type,
      ad_group_ad.status,
      ad_group_ad.ad.responsive_search_ad.headlines,
      ad_group_ad.ad.responsive_search_ad.descriptions,
      ad_group_ad.ad.final_urls,
      ad_group_ad.policy_summary.approval_status
    FROM ad_group_ad
    WHERE campaign.name = 'Windows – Somerset'
      AND ad_group_ad.status IN (ENABLED, REMOVED)
  `

  const results = await customer.query(query)

  for (const row of results) {
    const ad = row.ad_group_ad

    console.log(`\n📝 Ad ID: ${ad.ad.id}`)
    console.log(`   Status: ${ad.status === 2 ? 'ENABLED' : ad.status === 4 ? 'REMOVED' : ad.status}`)
    console.log(`   Approval: ${ad.policy_summary?.approval_status}`)
    console.log(`   Type: ${ad.ad.type}`)

    if (ad.ad.responsive_search_ad) {
      console.log(`\n   Headlines (${ad.ad.responsive_search_ad.headlines?.length || 0}):`)
      ad.ad.responsive_search_ad.headlines?.forEach((h: any, idx: number) => {
        console.log(`     ${idx + 1}. "${h.text}"${h.pinned_field ? ` [pinned: ${h.pinned_field}]` : ''}`)
      })

      console.log(`\n   Descriptions (${ad.ad.responsive_search_ad.descriptions?.length || 0}):`)
      ad.ad.responsive_search_ad.descriptions?.forEach((d: any, idx: number) => {
        console.log(`     ${idx + 1}. "${d.text}"${d.pinned_field ? ` [pinned: ${d.pinned_field}]` : ''}`)
      })

      console.log(`\n   Final URLs:`)
      ad.ad.final_urls?.forEach((url: string) => {
        console.log(`     - ${url}`)
      })
    }

    console.log('\n' + '-'.repeat(80))
  }

  console.log('\n✅ Fetched ad content for Windows – Somerset campaign\n')
}

getAdContent().catch(console.error)
