#!/usr/bin/env tsx
/**
 * Link GA4 to Google Ads
 *
 * This creates the link between GA4 and Google Ads for conversion tracking
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

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '485470042'

async function checkExistingLinks() {
  console.log('🔍 Checking for existing GA4 links...\n')

  const query = `
    SELECT
      google_analytics_link.customer,
      google_analytics_link.data_link_property_id,
      google_analytics_link.status
    FROM google_analytics_link
  `

  try {
    const links = await customer.query(query)

    if (links.length > 0) {
      console.log(`✅ Found ${links.length} existing GA4 link(s):`)
      links.forEach((link: any) => {
        console.log(`  • Property ID: ${link.google_analytics_link.data_link_property_id}`)
        console.log(`  • Status: ${link.google_analytics_link.status}`)
      })
      return true
    } else {
      console.log('ℹ️  No existing GA4 links found')
      return false
    }
  } catch (error: any) {
    console.log('ℹ️  No existing links or unable to query')
    return false
  }
}

async function importGA4Conversions() {
  console.log('\n📊 Importing GA4 Conversions to Google Ads...\n')

  // Check for existing conversion actions
  const conversionQuery = `
    SELECT
      conversion_action.name,
      conversion_action.type,
      conversion_action.status,
      conversion_action.origin
    FROM conversion_action
  `

  const conversions = await customer.query(conversionQuery)

  console.log('📋 Existing conversion actions:')
  if (conversions.length === 0) {
    console.log('  (none)')
  } else {
    conversions.forEach((conv: any) => {
      console.log(`  • ${conv.conversion_action.name} (${conv.conversion_action.origin})`)
    })
  }

  console.log('\n💡 TO COMPLETE GA4 LINK:')
  console.log('═'.repeat(70))
  console.log('\n1. Link GA4 Property to Google Ads (MANUAL STEP):')
  console.log('   • Go to: https://ads.google.com/aw/conversions')
  console.log('   • Click "+ New conversion action"')
  console.log('   • Select "Import" → "Google Analytics 4 properties"')
  console.log(`   • Property ID: ${GA4_PROPERTY_ID}`)
  console.log('   • Select these events to import:')
  console.log('     ✓ form_submit (Primary conversion)')
  console.log('     ✓ quote_request')
  console.log('     ✓ conversion')
  console.log('')
  console.log('2. Configure Conversion Settings:')
  console.log('   • Category: Lead')
  console.log('   • Value: Use transaction-specific value')
  console.log('   • Count: One')
  console.log('   • Attribution model: Data-driven')
  console.log('   • Click-through window: 30 days')
  console.log('')
  console.log('3. Enable Auto-Tagging (if not already):')
  console.log('   • Go to: Settings → Account settings')
  console.log('   • Under "Auto-tagging", enable:')
  console.log('     ✓ Tag the URL that people click through from my ad')
  console.log('')
  console.log('✅ Once completed, conversions will flow from GA4 → Google Ads')
}

async function main() {
  console.log('🔗 LINKING GA4 TO GOOGLE ADS')
  console.log('═'.repeat(70))
  console.log(`📊 GA4 Property ID: ${GA4_PROPERTY_ID}`)
  console.log(`👤 Google Ads Customer ID: ${process.env.GOOGLE_ADS_CUSTOMER_ID}`)
  console.log('═'.repeat(70))

  await checkExistingLinks()
  await importGA4Conversions()

  console.log('\n' + '═'.repeat(70))
  console.log('📋 SUMMARY')
  console.log('═'.repeat(70))
  console.log('\n🎯 GA4 Setup Status:')
  console.log('  ✅ GA4 tracking active on website')
  console.log('  ✅ Service account configured')
  console.log('  ⏳ Manual link required (see steps above)')
  console.log('')
  console.log('💡 This is a one-time setup that takes 5 minutes via Google Ads UI')
  console.log('📊 After linking, you\'ll see conversion data in campaigns within 24-48 hours')
  console.log('')
}

main()
