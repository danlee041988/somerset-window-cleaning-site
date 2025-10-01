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

const DAY_NAMES: Record<number, string> = {
  2: 'Monday',
  3: 'Tuesday',
  4: 'Wednesday',
  5: 'Thursday',
  6: 'Friday',
  7: 'Saturday',
  1: 'Sunday',
}

async function checkSchedule() {
  console.log('🕐 AD SCHEDULE & BID ADJUSTMENT CHECK\n')
  console.log('='.repeat(70))

  // Check for ad schedules
  const scheduleRows = await customer.query(`
    SELECT
      campaign.name,
      campaign_criterion.ad_schedule.day_of_week,
      campaign_criterion.ad_schedule.start_hour,
      campaign_criterion.ad_schedule.start_minute,
      campaign_criterion.ad_schedule.end_hour,
      campaign_criterion.ad_schedule.end_minute,
      campaign_criterion.bid_modifier
    FROM campaign_criterion
    WHERE campaign.status = 'ENABLED'
      AND campaign_criterion.type = 'AD_SCHEDULE'
  `)

  if (scheduleRows.length === 0) {
    console.log('\n✅ NO AD SCHEDULES SET')
    console.log('\n📅 This means: Your ads run 24/7')
    console.log('   • Monday - Sunday: 12:00 AM - 11:59 PM')
    console.log('   • All 168 hours per week')
    console.log('   • Every day including weekends and holidays\n')
  } else {
    console.log('\n📅 AD SCHEDULES FOUND:\n')
    const scheduleMap = new Map<string, any[]>()

    for (const row of scheduleRows) {
      const campaign = row.campaign.name
      const day = row.campaign_criterion.ad_schedule.day_of_week
      const startHour = row.campaign_criterion.ad_schedule.start_hour
      const startMin = row.campaign_criterion.ad_schedule.start_minute || 0
      const endHour = row.campaign_criterion.ad_schedule.end_hour
      const endMin = row.campaign_criterion.ad_schedule.end_minute || 0
      const bidMod = row.campaign_criterion.bid_modifier || 1.0

      if (!scheduleMap.has(campaign)) {
        scheduleMap.set(campaign, [])
      }

      scheduleMap.get(campaign)!.push({
        day: DAY_NAMES[day] || `Day ${day}`,
        startHour,
        startMin,
        endHour,
        endMin,
        bidMod,
      })
    }

    for (const [campaign, schedules] of scheduleMap) {
      console.log(`   📁 ${campaign}`)
      for (const s of schedules) {
        const start = `${String(s.startHour).padStart(2, '0')}:${String(s.startMin).padStart(2, '0')}`
        const end = `${String(s.endHour).padStart(2, '0')}:${String(s.endMin).padStart(2, '0')}`
        const bidModPercent = ((s.bidMod - 1) * 100).toFixed(0)
        const bidModStr = s.bidMod !== 1.0 ? ` (Bid: ${bidModPercent > 0 ? '+' : ''}${bidModPercent}%)` : ''
        console.log(`      ${s.day}: ${start} - ${end}${bidModStr}`)
      }
      console.log()
    }
  }

  // Check for other time-based settings
  console.log('='.repeat(70))
  console.log('\n🔍 OTHER CAMPAIGN SETTINGS:\n')

  const campaigns = await customer.query(`
    SELECT
      campaign.name,
      campaign.start_date,
      campaign.end_date,
      campaign_budget.delivery_method
    FROM campaign
    WHERE campaign.status = 'ENABLED'
      AND campaign.advertising_channel_type = 'SEARCH'
    ORDER BY campaign.name
  `)

  for (const row of campaigns) {
    const name = row.campaign.name
    const startDate = row.campaign.start_date
    const endDate = row.campaign.end_date
    const deliveryMethod = row.campaign_budget.delivery_method

    console.log(`   📁 ${name}`)
    console.log(`      Start Date: ${startDate}`)
    console.log(`      End Date: ${endDate}`)
    console.log(`      Budget Delivery: ${deliveryMethod === 2 ? 'Standard (Evenly throughout day)' : 'Accelerated'}`)
    console.log()
  }

  console.log('='.repeat(70))
  console.log('\n💡 WHAT THIS MEANS:\n')

  if (scheduleRows.length === 0) {
    console.log('✅ Your ads show 24/7 to anyone searching in your target areas')
    console.log('✅ No time restrictions = Maximum reach')
    console.log('✅ Budget spreads evenly throughout each day')
    console.log('\n📊 Impression Timeline:')
    console.log('   • 3 AM: Someone searches "window cleaner near me" → Your ad shows')
    console.log('   • 11 AM: Someone searches "gutter cleaning" → Your ad shows')
    console.log('   • 8 PM: Someone searches "book window cleaner" → Your ad shows')
    console.log('   • Midnight: Someone searches "window cleaning quote" → Your ad shows')
  } else {
    console.log('⚠️  Your ads ONLY show during scheduled hours')
    console.log('⚠️  Outside these hours, your ads do NOT appear')
  }

  console.log('\n' + '='.repeat(70))
}

checkSchedule().catch(console.error)
