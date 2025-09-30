#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { runCampaignPlan } from './google-ads-apply-plan'
import { syncNegativeKeywords } from './google-ads-upload-negatives'
import { ensureExtensions } from './google-ads-ensure-extensions'
import { runAutomation } from './google-ads-automation'
import { generateSnapshot as generateAdsSnapshot } from './google-ads-snapshot'
import { generateSnapshot as generateGa4Snapshot } from './ga4-daily-snapshot'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const todayStamp = new Date().toISOString()
const historyDir = path.join(__dirname, '..', 'docs', 'ads', 'history')

if (!fs.existsSync(historyDir)) {
  fs.mkdirSync(historyDir, { recursive: true })
}

const logFile = path.join(historyDir, `${todayStamp.slice(0, 10)}-run.log`)

const writeLog = (lines: string[]) => {
  fs.writeFileSync(logFile, lines.join('\n') + '\n', { encoding: 'utf8' })
}

const main = async () => {
  const lines: string[] = []

  lines.push(`# Daily Sync ${todayStamp}`)

  const planLines = await runCampaignPlan()
  lines.push('', '## Campaign Plan', ...planLines)

  const negativeLines = await syncNegativeKeywords()
  lines.push('', '## Negative Keywords', ...negativeLines)

  const extensionLines = await ensureExtensions()
  lines.push('', '## Extensions', ...extensionLines)

  const automationLines = await runAutomation('daily')
  lines.push('', '## Automation', ...automationLines)

  const ga4Snapshot = await generateGa4Snapshot()
  lines.push('', '## GA4 Events', `Saved to ${ga4Snapshot.filePath}`)
  ga4Snapshot.summary.focus.forEach((row) => {
    lines.push(`• ${row.event}: last7=${row.last7} | last30=${row.last30}`)
  })

  const adsSnapshot = await generateAdsSnapshot()
  lines.push('', `## Snapshot`, `Saved to ${adsSnapshot.filePath}`)

  writeLog(lines)
  console.log(`Daily sync complete. Log written to ${logFile}`)
  process.exit(0)
}

main().catch((error) => {
  console.error('❌ Daily sync failed:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
