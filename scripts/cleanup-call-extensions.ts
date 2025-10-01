#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const api = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = api.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

const CORRECT_PHONE = '01458860339'
const OLD_PHONE = '07415526331'

async function cleanupCallExtensions() {
  console.log('🧹 CLEANING UP CALL EXTENSIONS\n')
  console.log('='.repeat(60))

  // Get all call assets
  const rows = await customer.query(`
    SELECT
      asset.resource_name,
      asset.call_asset.phone_number
    FROM asset
    WHERE asset.type = CALL
  `)

  console.log('\n📞 Found call extensions:\n')

  const toRemove: string[] = []
  const toKeep: string[] = []

  for (const row of rows) {
    const resource = row.asset.resource_name
    const phone = (row.asset.call_asset.phone_number || '').replace(/\s+/g, '').replace('+44', '0')

    if (phone === OLD_PHONE) {
      console.log(`   ❌ ${phone} (OLD - WhatsApp only) → REMOVE`)
      toRemove.push(resource)
    } else if (phone === CORRECT_PHONE) {
      if (toKeep.length === 0) {
        console.log(`   ✅ ${phone} (CORRECT - Business line) → KEEP`)
        toKeep.push(resource)
      } else {
        console.log(`   ⚠️  ${phone} (DUPLICATE) → REMOVE`)
        toRemove.push(resource)
      }
    } else {
      console.log(`   ⚠️  ${phone} (Unknown) → Review manually`)
    }
  }

  if (toRemove.length === 0) {
    console.log('\n✅ No cleanup needed - all extensions are correct')
    return
  }

  console.log('\n' + '='.repeat(60))
  console.log(`\n🗑️  Removing ${toRemove.length} call extension(s)...\n`)

  for (const resource of toRemove) {
    try {
      await customer.assets.remove([resource])
      console.log(`   ✅ Removed: ${resource}`)
    } catch (error: any) {
      console.log(`   ❌ Failed to remove: ${resource}`)
      console.log(`      Error: ${error.message}`)
    }
  }

  console.log('\n✅ Call extension cleanup complete!')
  console.log(`   Kept: 1 extension with ${CORRECT_PHONE}`)
  console.log(`   Removed: ${toRemove.length} old/duplicate extensions`)
  console.log('\n' + '='.repeat(60))
}

cleanupCallExtensions().catch(console.error)
