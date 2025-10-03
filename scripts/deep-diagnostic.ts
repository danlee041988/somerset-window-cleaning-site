#!/usr/bin/env tsx
import dotenv from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

dotenv.config({ path: '.env.local' })

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

async function deepDiagnostic() {
  console.log('\n🔍 DEEP DIAGNOSTIC - Why No Impressions?\n')
  console.log('Time:', new Date().toLocaleString('en-GB'))
  console.log('='.repeat(80))

  // 1. Check account status
  console.log('\n📋 ACCOUNT STATUS:\n')
  const accountQuery = `
    SELECT
      customer.id,
      customer.descriptive_name,
      customer.currency_code,
      customer.test_account,
      customer.manager,
      customer.status
    FROM customer
  `
  const account = await customer.query(accountQuery)
  for (const row of account) {
    console.log('Account ID:', row.customer.id)
    console.log('Name:', row.customer.descriptive_name)
    console.log('Currency:', row.customer.currency_code)
    console.log('Test Account:', row.customer.test_account)
    console.log('Manager:', row.customer.manager)
    console.log('Status:', row.customer.status)
  }

  // 2. Check campaign details
  console.log('\n📊 WINDOWS – SOMERSET CAMPAIGN DETAILS:\n')
  const campaignQuery = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.serving_status,
      campaign.ad_serving_optimization_status,
      campaign_budget.amount_micros,
      campaign.bidding_strategy_type,
      campaign.target_cpa.target_cpa_micros,
      campaign.advertising_channel_type,
      campaign.start_date,
      campaign.end_date
    FROM campaign
    WHERE campaign.name = 'Windows – Somerset'
  `
  const campaigns = await customer.query(campaignQuery)
  for (const row of campaigns) {
    const c = row.campaign
    console.log('Campaign ID:', c.id)
    console.log('Status:', c.status, '(2=ENABLED, 3=PAUSED, 4=REMOVED)')
    console.log('Serving Status:', c.serving_status)
    console.log('Ad Serving Optimization:', c.ad_serving_optimization_status)
    console.log('Budget:', '£' + (Number(row.campaign_budget.amount_micros) / 1_000_000).toFixed(2))
    console.log('Bid Strategy:', c.bidding_strategy_type)
    console.log('Target CPA:', c.target_cpa?.target_cpa_micros ? '£' + (Number(c.target_cpa.target_cpa_micros) / 1_000_000).toFixed(2) : 'N/A')
    console.log('Channel:', c.advertising_channel_type)
    console.log('Start Date:', c.start_date)
    console.log('End Date:', c.end_date || 'None')
  }

  // 3. Check ad group status
  console.log('\n📁 AD GROUP STATUS:\n')
  const adGroupQuery = `
    SELECT
      ad_group.id,
      ad_group.name,
      ad_group.status,
      ad_group.cpc_bid_micros,
      ad_group.target_cpa_micros
    FROM ad_group
    WHERE campaign.name = 'Windows – Somerset'
  `
  const adGroups = await customer.query(adGroupQuery)
  for (const row of adGroups) {
    const ag = row.ad_group
    console.log('Ad Group:', ag.name)
    console.log('  Status:', ag.status, '(2=ENABLED)')
    console.log('  CPC Bid:', ag.cpc_bid_micros ? '£' + (Number(ag.cpc_bid_micros) / 1_000_000).toFixed(2) : 'N/A')
    console.log('  Target CPA:', ag.target_cpa_micros ? '£' + (Number(ag.target_cpa_micros) / 1_000_000).toFixed(2) : 'N/A')
  }

  // 4. Check keywords with approval status
  console.log('\n🔑 KEYWORD STATUS (Top 10):\n')
  const keywordQuery = `
    SELECT
      ad_group_criterion.criterion_id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.status,
      ad_group_criterion.approval_status,
      ad_group_criterion.cpc_bid_micros,
      ad_group_criterion.quality_info.quality_score
    FROM keyword_view
    WHERE campaign.name = 'Windows – Somerset'
      AND ad_group_criterion.type = KEYWORD
    LIMIT 10
  `
  const keywords = await customer.query(keywordQuery)
  for (const row of keywords) {
    const kw = row.ad_group_criterion
    console.log(`"${kw.keyword.text}"`)
    console.log(`  Match: ${kw.keyword.match_type === 4 ? 'EXACT' : kw.keyword.match_type === 5 ? 'PHRASE' : 'BROAD'}`)
    console.log(`  Status: ${kw.status} (2=ENABLED, 3=PAUSED, 4=REMOVED)`)
    console.log(`  Approval: ${kw.approval_status}`)
    console.log(`  Bid: £${kw.cpc_bid_micros ? (Number(kw.cpc_bid_micros) / 1_000_000).toFixed(2) : '0.00'}`)
    console.log(`  QS: ${kw.quality_info?.quality_score || 'N/A'}`)
  }

  // 5. Check ads
  console.log('\n📢 AD STATUS:\n')
  const adQuery = `
    SELECT
      ad_group_ad.ad.id,
      ad_group_ad.ad.type,
      ad_group_ad.status,
      ad_group_ad.policy_summary.approval_status,
      ad_group_ad.policy_summary.policy_topic_entries
    FROM ad_group_ad
    WHERE campaign.name = 'Windows – Somerset'
  `
  const ads = await customer.query(adQuery)
  for (const row of ads) {
    const ad = row.ad_group_ad
    console.log('Ad ID:', ad.ad.id)
    console.log('  Type:', ad.ad.type)
    console.log('  Status:', ad.status, '(2=ENABLED)')
    console.log('  Approval:', ad.policy_summary?.approval_status, '(2=APPROVED, 3=DISAPPROVED, 4=APPROVED_LIMITED)')
    if (ad.policy_summary?.policy_topic_entries) {
      console.log('  Policy Issues:', ad.policy_summary.policy_topic_entries.length)
    }
  }

  // 6. Check for account-level issues
  console.log('\n⚠️  ACCOUNT ALERTS:\n')
  const alertQuery = `
    SELECT
      account_budget.status,
      account_budget.approved_spending_limit_micros,
      account_budget.adjusted_spending_limit_micros
    FROM account_budget
  `
  try {
    const alerts = await customer.query(alertQuery)
    for (const row of alerts) {
      console.log('Budget Status:', row.account_budget.status)
      console.log('Approved Limit:', row.account_budget.approved_spending_limit_micros)
      console.log('Adjusted Limit:', row.account_budget.adjusted_spending_limit_micros)
    }
  } catch (e) {
    console.log('No account budget constraints found')
  }

  console.log('\n' + '='.repeat(80))
  console.log('Diagnostic complete.\n')
}

deepDiagnostic().catch(console.error)
