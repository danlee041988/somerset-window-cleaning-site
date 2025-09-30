#!/usr/bin/env tsx

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

type TargetConfig = {
  category: keyof typeof enums.ConversionActionCategory
  primary: boolean
}

const TARGETS: Record<string, TargetConfig> = {
  form_submit: { category: 'SUBMIT_LEAD_FORM', primary: true },
  form_start: { category: 'SUBMIT_LEAD_FORM', primary: false },
  quote_request: { category: 'REQUEST_QUOTE', primary: true },
  recaptcha_complete: { category: 'ENGAGEMENT', primary: false },
}

async function main() {
  const rows = await customer.query(`
    SELECT conversion_action.resource_name,
           conversion_action.name,
           conversion_action.type,
           conversion_action.status,
           conversion_action.primary_for_goal,
           conversion_action.category,
           conversion_action.google_analytics_4_settings.event_name
    FROM conversion_action
    WHERE conversion_action.type IN (GOOGLE_ANALYTICS_4_CUSTOM, GOOGLE_ANALYTICS_4_PURCHASE)
      AND conversion_action.name LIKE 'contact-form-8f996%'
  `)

  if (rows.length === 0) {
    console.log('No GA4 conversion actions found yet. Ensure GA4↔Ads linking is enabled and rerun later.')
    return
  }

  const ops: any[] = []
  for (const row of rows) {
    const ca = row.conversion_action
    if (!ca) continue
    const eventName = ca.google_analytics_4_settings?.event_name
    if (!eventName) {
      console.log(`Skipping ${ca.name}: no GA4 event name attached.`)
      continue
    }

    const target = TARGETS[eventName]
    if (!target) {
      console.log(`No target configuration for event '${eventName}' (${ca.name}).`)
      continue
    }

    const desiredStatus = enums.ConversionActionStatus.ENABLED
    const desiredCategory = enums.ConversionActionCategory[target.category]
    const needsStatus = ca.status !== desiredStatus
    const needsPrimary = Boolean(ca.primary_for_goal) !== target.primary
    const needsCategory = ca.category !== desiredCategory

    if (!needsStatus && !needsPrimary && !needsCategory) {
      console.log(`✓ ${ca.name} already configured`)
      continue
    }

    console.log(`→ Updating ${ca.name} (${eventName})`)
    ops.push({
      update: {
        resource_name: ca.resource_name,
        status: desiredStatus,
        primary_for_goal: target.primary,
        category: desiredCategory,
      },
      update_mask: {
        paths: ['status', 'primary_for_goal', 'category'],
      },
    })
  }

  if (ops.length === 0) {
    console.log('No GA4 conversion updates required.')
    return
  }

  const response = await customer.mutateConversionActions(ops)
  console.log('Updated conversions:', response)
}

main().catch((error) => {
  console.error('Failed to update GA4 conversions:', error)
  process.exit(1)
})
