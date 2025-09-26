#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsClient, GoogleAdsConfigError } from '../lib/google-ads'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const usage = () => {
  console.log('Usage: npx tsx scripts/google-ads-set-budget.ts <campaignId> <budgetInGBP>')
  process.exit(1)
}

const [campaignId, budgetGBP] = process.argv.slice(2)
if (!campaignId || !budgetGBP) usage()

const amount = Number(budgetGBP)
if (!Number.isFinite(amount) || amount <= 0) {
  console.error('Budget must be a positive number (GBP).')
  process.exit(1)
}

const main = async () => {
  try {
    const client = new GoogleAdsClient()
    const micros = Math.round(amount * 1_000_000)
    await client.updateCampaignBudget(campaignId, micros)
    console.log(`✅ Updated campaign ${campaignId} budget to £${amount.toFixed(2)}`)
  } catch (error) {
    if (error instanceof GoogleAdsConfigError) {
      console.error('❌ Google Ads is not configured:', error.message)
      process.exit(1)
    }
    console.error('❌ Failed to update budget:', error)
    process.exit(1)
  }
}

main()
