#!/usr/bin/env tsx
/**
 * Google Ads Optimized Fix - Based on Historical Performance
 *
 * Historical Performance (Aug-Sep 2025):
 * - Average CPC: £1.46
 * - Average CTR: 6.30%
 * - Total Spend: £143.26
 * - Total Clicks: 98
 *
 * New Strategy: £1.50-2.00 CPC range optimized for Somerset market
 */

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

// Optimized bid strategy based on historical data
function calculateOptimizedBid(keywordText: string, campaignName: string): number {
  const keyword = keywordText.toLowerCase()
  const campaign = campaignName.toLowerCase()

  // TIER 1: High Intent Keywords (£1.80-2.00)
  // Historical proof: "looking for a window cleaner" = £1.47 CPC, 46 clicks
  const highIntentTerms = ['near me', 'looking for', 'quote', 'book', 'best', 'need']
  if (highIntentTerms.some(term => keyword.includes(term))) {
    if (keyword.includes('near me')) return 2.00 // Proven winner
    if (keyword.includes('looking for')) return 1.80 // Top performer
    return 1.90
  }

  // TIER 2: Town-Specific Keywords (£1.40-1.70)
  // Historical proof: Town keywords performed at £1.43-1.50
  const somersetTowns = [
    'taunton', 'weston', 'wells', 'glastonbury', 'frome', 'yeovil',
    'bridgwater', 'clevedon', 'burnham', 'cheddar', 'wedmore',
    'ilminster', 'chard', 'radstock', 'shepton', 'street'
  ]
  const hasTown = somersetTowns.some(town => keyword.includes(town))
  if (hasTown) {
    // High-value towns get premium bids
    if (keyword.includes('taunton') || keyword.includes('weston') || keyword.includes('wells')) {
      return 1.60
    }
    return 1.50 // Standard town bid
  }

  // TIER 3: Service-Specific Keywords (£1.20-1.60)
  // Historical proof: Services performed at £1.30-1.46
  if (campaign.includes('window')) {
    if (keyword.includes('commercial') || keyword.includes('professional')) return 1.60
    if (keyword.includes('exterior') || keyword.includes('clean')) return 1.50
    return 1.50 // Window cleaning default
  }

  if (campaign.includes('gutter')) {
    // Historical: £1.46 CPC for "gutter cleaners", 9.09% CTR
    if (keyword.includes('service') || keyword.includes('near me')) return 1.60
    return 1.40
  }

  if (campaign.includes('conservatory')) {
    // Historical: £1.30 CPC, 14.81% CTR (excellent performer!)
    return 1.30
  }

  if (campaign.includes('solar')) {
    // Historical: £1.44 CPC, 8.57% CTR
    return 1.40
  }

  // TIER 4: Brand Protection (£0.80-1.00)
  if (campaign.includes('brand') || keyword.includes('somerset window') || keyword.includes('dan lee')) {
    return 0.90
  }

  // Default: Conservative bid
  return 1.50
}

console.log(`
================================================================================
🎯 GOOGLE ADS OPTIMIZED BID STRATEGY
================================================================================

Based on Historical Performance (Aug-Sep 2025):
  ✅ Proven Average CPC: £1.46
  ✅ Excellent CTR: 6.30%
  ✅ Top Keyword: "looking for a window cleaner" (£1.47, 46 clicks)

New Bid Strategy:
  🎯 High Intent: £1.80-2.00 (near me, looking for, etc.)
  🎯 Town-Specific: £1.40-1.70 (taunton, weston, wells, etc.)
  🎯 Service Keywords: £1.20-1.60 (windows, gutters, etc.)
  🎯 Brand Protection: £0.80-1.00 (your brand terms)

Expected Results:
  📊 Average CPC: £1.55 (slight increase for scale)
  📊 Daily Spend: £45-50
  📊 Daily Clicks: 30-35
  📊 Weekly Leads: 9-11 (at 4% conversion)
  📊 Cost Per Lead: £35-40 (much better than £80 target!)

================================================================================
`)

// Sample bid calculations
const sampleKeywords = [
  'looking for a window cleaner',
  'window cleaning near me',
  'window cleaning taunton',
  'window cleaning weston super mare',
  'gutter cleaning near me',
  'conservatory roof cleaning',
  'solar panel cleaning',
  'window cleaning',
  'somerset window cleaning'
]

console.log('📋 SAMPLE BID CALCULATIONS:\n')
sampleKeywords.forEach(keyword => {
  const bid = calculateOptimizedBid(keyword, 'Windows – Somerset')
  console.log(`"${keyword}" → £${bid.toFixed(2)}`)
})

console.log(`
================================================================================
✅ READY TO IMPLEMENT

To apply this strategy:
1. Review bid calculations above
2. Confirm you're happy with £1.50-2.00 range
3. Run the main fix script with these bids
4. Monitor performance daily for first week

================================================================================
`)

export { calculateOptimizedBid }