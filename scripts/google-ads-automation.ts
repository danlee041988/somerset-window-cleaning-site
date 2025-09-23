#!/usr/bin/env tsx

import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import {
  GoogleAdsClient,
  GoogleAdsConfigError,
  automatedKeywordOptimization,
  generateWeeklyReport,
  getGoogleAdsConfig,
} from '../lib/google-ads'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const percent = (value: number) => `${(value * 100).toFixed(1)}%`

type GoogleAdsApiError = {
  errors?: Array<{ message?: string }>
}

const extractErrorMessages = (error: unknown): string[] => {
  if (error && typeof error === 'object' && 'errors' in error) {
    const typed = error as GoogleAdsApiError
    return (typed.errors ?? []).map((item) => item.message ?? '')
  }
  return []
}

const isManagerMetricsError = (error: unknown): boolean =>
  extractErrorMessages(error).some((message) =>
    message.includes('Metrics cannot be requested for a manager account'),
  )

const isPermissionError = (error: unknown): boolean =>
  extractErrorMessages(error).some((message) =>
    message.includes("User doesn't have permission to access customer"),
  )

type BudgetAdjustment = {
  type: 'DECREASE_BUDGET' | 'INCREASE_BUDGET'
  reason: string
  campaign: Awaited<ReturnType<GoogleAdsClient['getCampaigns']>>[number]
  newBudgetMicros: number
}

async function run() {
  try {
    getGoogleAdsConfig()
  } catch (error) {
    if (error instanceof GoogleAdsConfigError) {
      throw error
    }
    throw new GoogleAdsConfigError('Google Ads credentials are missing. Populate GOOGLE_ADS_* values in .env.local.')
  }

  const mode = process.argv[2] || 'daily'
  const dateRange = mode === 'weekly' ? 'LAST_7_DAYS' : 'LAST_30_DAYS'
  const targetCpa = Number(process.env.GOOGLE_ADS_AUTOMATION_TARGET_CPA || 80)
  const adjustmentRatio = Number(process.env.GOOGLE_ADS_AUTOMATION_ADJUSTMENT_RATIO || 0.1)
  const dryRun = process.env.GOOGLE_ADS_AUTOMATION_DRY_RUN !== 'false'

  console.log('🧠 Somerset Window Cleaning – Google Ads automation')
  console.log(`   Mode: ${mode}  |  Date range: ${dateRange}`)
  console.log(`   Target CPA: £${targetCpa.toFixed(2)}  |  Adjustment step: ${percent(adjustmentRatio)}`)
  console.log(`   Dry run: ${dryRun ? 'yes (no live changes)' : 'no (budgets will be updated)'}`)
  console.log('')

  const client = new GoogleAdsClient()
  let campaigns
  try {
    campaigns = await client.getCampaigns(dateRange)
  } catch (error) {
    if (isManagerMetricsError(error) || isPermissionError(error)) {
      console.error(
        '\n⚠️  Google Ads API rejected the request because the configured customer ID belongs to a manager account.',
      )
      console.error('   Metrics can only be retrieved from a standard ad account (not the manager/MCC).')
      console.error('   Update .env.local with:')
      console.error('     • GOOGLE_ADS_CUSTOMER_ID=<child ad account id>')
      console.error('     • GOOGLE_ADS_LOGIN_CUSTOMER_ID=<manager id> (optional, only if you use an MCC)')
      console.error('   Tip: run `npx tsx scripts/list-accessible-customers.ts` to see available account IDs.')
      process.exit(1)
    }
    throw error
  }

  const actionableCampaigns = campaigns.filter((campaign) => campaign.conversions >= 2 && campaign.budgetMicros > 0)
  const adjustments: BudgetAdjustment[] = []

  if (actionableCampaigns.length === 0) {
    console.log('No campaigns met the minimum data threshold for budget adjustments.')
  }

  for (const campaign of actionableCampaigns) {
    if (!campaign.cpa) continue

    if (campaign.cpa > targetCpa * 1.1) {
      const newBudgetMicros = Math.max(Math.round(campaign.budgetMicros * (1 - adjustmentRatio)), 0)
      adjustments.push({
        type: 'DECREASE_BUDGET',
        reason: `CPA £${campaign.cpa.toFixed(2)} above £${targetCpa.toFixed(2)}`,
        campaign,
        newBudgetMicros,
      })
    } else if (campaign.cpa < targetCpa * 0.6) {
      const newBudgetMicros = Math.round(campaign.budgetMicros * (1 + adjustmentRatio))
      adjustments.push({
        type: 'INCREASE_BUDGET',
        reason: `CPA £${campaign.cpa.toFixed(2)} well below £${targetCpa.toFixed(2)}`,
        campaign,
        newBudgetMicros,
      })
    }
  }

  if (adjustments.length === 0) {
    console.log('✅ All active campaigns are within the CPA guard rails. No budget changes proposed today.')
  } else {
    console.log(`📊 Proposed budget adjustments (${adjustments.length}):`)
    adjustments.forEach((item) => {
      const oldBudget = item.campaign.budgetMicros / 1_000_000
      const newBudget = item.newBudgetMicros / 1_000_000
      console.log(
        ` • ${item.campaign.name} → ${item.type === 'DECREASE_BUDGET' ? 'decrease' : 'increase'} budget from £${oldBudget.toFixed(2)} to £${newBudget.toFixed(2)} (${item.reason})`,
      )
    })

    if (!dryRun) {
      console.log('\n✏️  Applying changes…')
      for (const item of adjustments) {
        await client.updateCampaignBudget(item.campaign.id, item.newBudgetMicros)
      }
      console.log('✅ Budget adjustments submitted to Google Ads.')
    } else {
      console.log('\nℹ️  Dry run active – no budgets were changed. Set GOOGLE_ADS_AUTOMATION_DRY_RUN=false to push changes.')
    }
  }

  console.log('\n🔍 Generating fresh optimization recommendations…')
  const [recommendations, seasonality] = await Promise.all([
    automatedKeywordOptimization().catch((error) => {
      if (isManagerMetricsError(error) || isPermissionError(error)) {
        return []
      }
      throw error
    }),
    client.optimizeForSeasonality().catch((error) => {
      if (isManagerMetricsError(error) || isPermissionError(error)) {
        return []
      }
      throw error
    }),
  ])

  const combined = [...recommendations, ...seasonality]
  if (combined.length === 0) {
    console.log('No active recommendations from Google Ads or internal rules.')
  } else {
    combined.slice(0, 5).forEach((rec, index) => {
      console.log(` ${index + 1}. [${rec.type}] ${rec.description || 'Review recommendation details in the dashboard.'}`)
    })
    if (combined.length > 5) {
      console.log(` …and ${combined.length - 5} more. Check /admin/google-ads for the full list.`)
    }
  }

  console.log('\n🧾 Weekly report summary:')
  const weekly = await generateWeeklyReport()
  const { summary } = weekly

  console.log(` • Campaigns analysed: ${summary.campaignsAnalysed}`)
  console.log(` • Impressions: ${summary.totalImpressions.toLocaleString()}`)
  console.log(` • Clicks: ${summary.totalClicks.toLocaleString()}`)
  console.log(` • Conversions: ${summary.totalConversions.toLocaleString()}`)
  console.log(` • Spend (7d): £${summary.totalCost.toFixed(2)}`)
  console.log('\nAutomation complete.')
}

run().catch((error) => {
  console.error('❌ Automation run failed:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
