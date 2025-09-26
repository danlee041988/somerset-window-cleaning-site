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

export const runAutomation = async (modeArg?: string): Promise<string[]> => {
  try {
    getGoogleAdsConfig()
  } catch (error) {
    if (error instanceof GoogleAdsConfigError) {
      throw error
    }
    throw new GoogleAdsConfigError('Google Ads credentials are missing. Populate GOOGLE_ADS_* values in .env.local.')
  }

  const lines: string[] = []
  const mode = modeArg || process.argv[2] || 'daily'
  const dateRange = mode === 'weekly' ? 'LAST_7_DAYS' : 'LAST_30_DAYS'
  const targetCpa = Number(process.env.GOOGLE_ADS_AUTOMATION_TARGET_CPA || 80)
  const adjustmentRatio = Number(process.env.GOOGLE_ADS_AUTOMATION_ADJUSTMENT_RATIO || 0.1)
  const dryRun = process.env.GOOGLE_ADS_AUTOMATION_DRY_RUN !== 'false'

  const log = (message: string) => {
    lines.push(message)
  }

  log('🧠 Somerset Window Cleaning – Google Ads automation')
  log(`   Mode: ${mode}  |  Date range: ${dateRange}`)
  log(`   Target CPA: £${targetCpa.toFixed(2)}  |  Adjustment step: ${percent(adjustmentRatio)}`)
  log(`   Dry run: ${dryRun ? 'yes (no live changes)' : 'no (budgets will be updated)'}`)
  log('')

  const client = new GoogleAdsClient()
  let campaigns
  try {
    campaigns = await client.getCampaigns(dateRange)
  } catch (error) {
    if (isManagerMetricsError(error) || isPermissionError(error)) {
      log('⚠️  Google Ads API rejected the request because the configured customer ID belongs to a manager account.')
      log('   Metrics can only be retrieved from a standard ad account (not the manager/MCC).')
      log('   Update .env.local with:')
      log('     • GOOGLE_ADS_CUSTOMER_ID=<child ad account id>')
      log('     • GOOGLE_ADS_LOGIN_CUSTOMER_ID=<manager id> (optional, only if you use an MCC)')
      log('   Tip: run `npx tsx scripts/list-accessible-customers.ts` to see available account IDs.')
      return lines
    }
    throw error
  }

  const actionableCampaigns = campaigns.filter((campaign) => campaign.conversions >= 2 && campaign.budgetMicros > 0)
  const adjustments: BudgetAdjustment[] = []

  if (actionableCampaigns.length === 0) {
    log('No campaigns met the minimum data threshold for budget adjustments.')
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
    log('✅ All active campaigns are within the CPA guard rails. No budget changes proposed today.')
  } else {
    log(`📊 Proposed budget adjustments (${adjustments.length}):`)
    adjustments.forEach((item) => {
      const oldBudget = item.campaign.budgetMicros / 1_000_000
      const newBudget = item.newBudgetMicros / 1_000_000
      log(
        ` • ${item.campaign.name} → ${item.type === 'DECREASE_BUDGET' ? 'decrease' : 'increase'} budget from £${oldBudget.toFixed(2)} to £${newBudget.toFixed(2)} (${item.reason})`,
      )
    })

    if (!dryRun) {
      log('\n✏️  Applying changes…')
      for (const item of adjustments) {
        await client.updateCampaignBudget(item.campaign.id, item.newBudgetMicros)
      }
      log('✅ Budget adjustments submitted to Google Ads.')
    } else {
      log('\nℹ️  Dry run active – no budgets were changed. Set GOOGLE_ADS_AUTOMATION_DRY_RUN=false to push changes.')
    }
  }

  log('\n🔍 Generating fresh optimization recommendations…')
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
    log('No active recommendations from Google Ads or internal rules.')
  } else {
    combined.slice(0, 5).forEach((rec, index) => {
      log(` ${index + 1}. [${rec.type}] ${rec.description || 'Review recommendation details in the dashboard.'}`)
    })
    if (combined.length > 5) {
      log(` …and ${combined.length - 5} more. Check /admin/google-ads for the full list.`)
    }
  }

  log('\n🧾 Weekly report summary:')
  const weekly = await generateWeeklyReport()
  const { summary } = weekly

  log(` • Campaigns analysed: ${summary.campaignsAnalysed}`)
  log(` • Impressions: ${summary.totalImpressions.toLocaleString()}`)
  log(` • Clicks: ${summary.totalClicks.toLocaleString()}`)
  log(` • Conversions: ${summary.totalConversions.toLocaleString()}`)
  log(` • Spend (7d): £${summary.totalCost.toFixed(2)}`)
  log('\nAutomation complete.')

  return lines
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  runAutomation()
    .then((lines) => {
      console.log(lines.join('\n'))
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Automation run failed:')
      console.error(error instanceof Error ? error.message : error)
      process.exit(1)
    })
}
