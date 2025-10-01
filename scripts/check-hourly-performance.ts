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

async function checkHourlyPerformance() {
  console.log('🕐 HOURLY PERFORMANCE ANALYSIS\n')
  console.log('='.repeat(70))

  // Get hourly performance
  const rows = await customer.query(`
    SELECT
      campaign.name,
      segments.hour,
      segments.day_of_week,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND campaign.advertising_channel_type = 'SEARCH'
      AND segments.date DURING LAST_30_DAYS
  `)

  const hourlyData = new Map<number, {imp: number, clicks: number, cost: number, conversions: number}>()
  const dayData = new Map<number, {imp: number, clicks: number, cost: number, conversions: number}>()

  for (const row of rows) {
    const hour = row.segments.hour || 0
    const day = row.segments.day_of_week || 0
    const imp = row.metrics.impressions || 0
    const clicks = row.metrics.clicks || 0
    const cost = row.metrics.cost_micros || 0
    const conversions = row.metrics.conversions || 0

    // Hourly aggregation
    if (!hourlyData.has(hour)) {
      hourlyData.set(hour, {imp: 0, clicks: 0, cost: 0, conversions: 0})
    }
    const hourStats = hourlyData.get(hour)!
    hourStats.imp += imp
    hourStats.clicks += clicks
    hourStats.cost += cost
    hourStats.conversions += conversions

    // Daily aggregation
    if (!dayData.has(day)) {
      dayData.set(day, {imp: 0, clicks: 0, cost: 0, conversions: 0})
    }
    const dayStats = dayData.get(day)!
    dayStats.imp += imp
    dayStats.clicks += clicks
    dayStats.cost += cost
    dayStats.conversions += conversions
  }

  // Sort and display hourly data
  const sortedHours = Array.from(hourlyData.entries()).sort((a, b) => a[0] - b[0])

  console.log('\n⏰ PERFORMANCE BY HOUR (Last 30 Days):\n')
  console.log('Hour    | Impressions | Clicks | Cost    | CTR    | Conv')
  console.log('-'.repeat(70))

  let totalImp = 0
  let totalClicks = 0
  let totalCost = 0
  let totalConv = 0

  for (const [hour, stats] of sortedHours) {
    const ctr = stats.imp > 0 ? (stats.clicks / stats.imp * 100).toFixed(1) : '0.0'
    const costGBP = (stats.cost / 1000000).toFixed(2)
    const hourStr = `${String(hour).padStart(2, '0')}:00`

    console.log(
      `${hourStr}   | ${String(stats.imp).padStart(11)} | ${String(stats.clicks).padStart(6)} | £${String(costGBP).padStart(6)} | ${String(ctr).padStart(5)}% | ${stats.conversions}`
    )

    totalImp += stats.imp
    totalClicks += stats.clicks
    totalCost += stats.cost
    totalConv += stats.conversions
  }

  console.log('-'.repeat(70))
  const totalCTR = totalImp > 0 ? (totalClicks / totalImp * 100).toFixed(1) : '0.0'
  const totalCostGBP = (totalCost / 1000000).toFixed(2)
  console.log(
    `TOTAL   | ${String(totalImp).padStart(11)} | ${String(totalClicks).padStart(6)} | £${String(totalCostGBP).padStart(6)} | ${String(totalCTR).padStart(5)}% | ${totalConv}`
  )

  // Day of week analysis
  const dayNames: Record<number, string> = {
    2: 'Monday',
    3: 'Tuesday',
    4: 'Wednesday',
    5: 'Thursday',
    6: 'Friday',
    7: 'Saturday',
    1: 'Sunday',
  }

  console.log('\n\n📅 PERFORMANCE BY DAY (Last 30 Days):\n')
  console.log('Day       | Impressions | Clicks | Cost    | CTR    | Conv')
  console.log('-'.repeat(70))

  const sortedDays = Array.from(dayData.entries()).sort((a, b) => a[0] - b[0])

  for (const [day, stats] of sortedDays) {
    const dayName = dayNames[day] || `Day ${day}`
    const ctr = stats.imp > 0 ? (stats.clicks / stats.imp * 100).toFixed(1) : '0.0'
    const costGBP = (stats.cost / 1000000).toFixed(2)

    console.log(
      `${dayName.padEnd(9)} | ${String(stats.imp).padStart(11)} | ${String(stats.clicks).padStart(6)} | £${String(costGBP).padStart(6)} | ${String(ctr).padStart(5)}% | ${stats.conversions}`
    )
  }

  console.log('\n' + '='.repeat(70))

  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:\n')

  if (totalImp < 100) {
    console.log('⚠️  INSUFFICIENT DATA for bid adjustments')
    console.log('   • Current: ' + totalImp + ' impressions')
    console.log('   • Needed: 500+ impressions minimum')
    console.log('   • Wait: 25 more days before making changes\n')
    console.log('✅ ACTION: Keep all bids the same 24/7 for now')
  } else {
    console.log('✅ Sufficient data to analyze patterns')

    // Find best and worst hours
    const hoursWithData = sortedHours.filter(([_, stats]) => stats.imp > 5)

    if (hoursWithData.length > 0) {
      const bestHour = hoursWithData.reduce((best, current) =>
        (current[1].clicks / current[1].imp) > (best[1].clicks / best[1].imp) ? current : best
      )
      const worstHour = hoursWithData.reduce((worst, current) =>
        (current[1].clicks / current[1].imp) < (worst[1].clicks / worst[1].imp) ? current : worst
      )

      console.log(`\n📈 Best performing hour: ${String(bestHour[0]).padStart(2, '0')}:00`)
      console.log(`   CTR: ${(bestHour[1].clicks / bestHour[1].imp * 100).toFixed(1)}%`)
      console.log(`   Consider: +20% to +30% bid adjustment`)

      console.log(`\n📉 Worst performing hour: ${String(worstHour[0]).padStart(2, '0')}:00`)
      console.log(`   CTR: ${(worstHour[1].clicks / worstHour[1].imp * 100).toFixed(1)}%`)
      console.log(`   Consider: -30% to -50% bid adjustment`)
    }
  }

  console.log('\n' + '='.repeat(70))
}

checkHourlyPerformance().catch(console.error)
