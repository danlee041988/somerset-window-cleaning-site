#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { config as loadEnv } from 'dotenv'
import { GoogleAdsApi, enums } from 'google-ads-api'

loadEnv({ path: path.join(process.cwd(), '.env.local') })

const sanitize = (value?: string) => (value ? value.replace(/[^0-9]/g, '') : undefined)

const {
  GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET,
  GOOGLE_ADS_DEVELOPER_TOKEN,
  GOOGLE_ADS_REFRESH_TOKEN,
  GOOGLE_ADS_CUSTOMER_ID,
  GOOGLE_ADS_LOGIN_CUSTOMER_ID,
} = process.env

if (!GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_CLIENT_SECRET || !GOOGLE_ADS_DEVELOPER_TOKEN || !GOOGLE_ADS_REFRESH_TOKEN || !GOOGLE_ADS_CUSTOMER_ID) {
  throw new Error('Missing Google Ads credentials in environment')
}

const api = new GoogleAdsApi({
  client_id: GOOGLE_ADS_CLIENT_ID,
  client_secret: GOOGLE_ADS_CLIENT_SECRET,
  developer_token: GOOGLE_ADS_DEVELOPER_TOKEN,
})

const customer = api.Customer({
  customer_id: sanitize(GOOGLE_ADS_CUSTOMER_ID)!,
  login_customer_id: sanitize(GOOGLE_ADS_LOGIN_CUSTOMER_ID),
  refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
})

const LANGUAGE_EN_GB = 'languageConstants/1000'
const GEO_UK = 'geoTargetConstants/2826'

function loadSeedKeywords(): string[] {
  const manual = process.argv.slice(2)
  if (manual.length > 0) return manual

  const csvPath = path.join(process.cwd(), 'docs', 'ads', 'keywords-seed.csv')
  if (!fs.existsSync(csvPath)) {
    throw new Error('Seed keywords not provided via CLI and docs/ads/keywords-seed.csv not found.')
  }
  const content = fs.readFileSync(csvPath, 'utf8')
  return content
    .split(/\r?\n/)
    .map((line) => line.split(',')[0]?.trim())
    .filter(Boolean)
    .slice(0, 20)
}

async function main() {
  const keywords = loadSeedKeywords()
  console.log(`Querying forecast metrics for ${keywords.length} keywords...`)

  const ideaService = customer.keywordPlanIdeas

  const ideas = await ideaService.generateKeywordIdeas({
    customer_id: sanitize(GOOGLE_ADS_CUSTOMER_ID)!,
    language: LANGUAGE_EN_GB,
    geo_target_constants: [GEO_UK],
    keyword_plan_network: enums.KeywordPlanNetwork.GOOGLE_SEARCH,
    keyword_seed: { keywords },
  })

  if (!ideas || ideas.length === 0) {
    console.log('No keyword ideas returned. Try different seed terms or broaden geo/language.')
    return
  }

  ideas
    .sort((a: any, b: any) => (Number(b.keyword_idea_metrics?.avg_monthly_searches ?? 0) - Number(a.keyword_idea_metrics?.avg_monthly_searches ?? 0)))
    .forEach((idea: any) => {
      const metrics = idea.keyword_idea_metrics ?? {}
      const avgMonthlySearches = metrics.avg_monthly_searches ?? 0
      const competition = metrics.competition_level ?? 'UNKNOWN'
      const lowTop = Number(metrics.low_top_of_page_bid_micros ?? 0) / 1_000_000
      const highTop = Number(metrics.high_top_of_page_bid_micros ?? 0) / 1_000_000
      console.log(
        `${idea.text} | searches=${avgMonthlySearches} | competition=${competition} | top_of_page_bid=£${lowTop.toFixed(2)}-£${highTop.toFixed(2)}`
      )
    })
}

main().catch((error) => {
  console.error('Failed to generate keyword forecasts:', error)
  process.exit(1)
})
