#!/usr/bin/env tsx

import path from 'path'
import { config as loadEnv } from 'dotenv'
import { GoogleAdsApi, enums } from 'google-ads-api'

loadEnv({ path: path.join(process.cwd(), '.env.local') })

const {
  GOOGLE_ADS_CLIENT_ID,
  GOOGLE_ADS_CLIENT_SECRET,
  GOOGLE_ADS_DEVELOPER_TOKEN,
  GOOGLE_ADS_REFRESH_TOKEN,
  GOOGLE_ADS_CUSTOMER_ID,
  GOOGLE_ADS_LOGIN_CUSTOMER_ID,
} = process.env

if (!GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_CLIENT_SECRET || !GOOGLE_ADS_DEVELOPER_TOKEN || !GOOGLE_ADS_REFRESH_TOKEN || !GOOGLE_ADS_CUSTOMER_ID) {
  throw new Error('Missing Google Ads credentials in environment variables')
}

const sanitize = (value?: string) => (value ? value.replace(/[^0-9]/g, '') : undefined)

const api = new GoogleAdsApi({
  client_id: GOOGLE_ADS_CLIENT_ID,
  client_secret: GOOGLE_ADS_CLIENT_SECRET,
  developer_token: GOOGLE_ADS_DEVELOPER_TOKEN,
})

const customerOptions: any = {
  customer_id: sanitize(GOOGLE_ADS_CUSTOMER_ID)!,
  refresh_token: GOOGLE_ADS_REFRESH_TOKEN,
}

const loginId = sanitize(GOOGLE_ADS_LOGIN_CUSTOMER_ID)
if (loginId) {
  customerOptions.login_customer_id = loginId
}

const customer = api.Customer(customerOptions)

const desiredConversions = [
  {
    name: 'Lead - Quote Form',
    description: 'Captured when the quote request form is submitted. Triggered by booking_form_submit in GTM.',
    valueSettings: { defaultValue: 0, alwaysUseDefaultValue: false },
  },
  {
    name: 'Lead - Contact Form',
    description: 'Captured when the general contact form is submitted. Triggered by contact_form_submit in GTM.',
    valueSettings: { defaultValue: 0, alwaysUseDefaultValue: false },
  },
  {
    name: 'Lead - Phone Click (Website)',
    description: 'Captured when visitors tap the phone number on site. Triggered by phone_click in GTM.',
    valueSettings: { defaultValue: 0, alwaysUseDefaultValue: true },
  },
]

async function ensureConversions() {
  const existingRows = await customer.query(`
    SELECT conversion_action.id, conversion_action.name, conversion_action.type, conversion_action.category
    FROM conversion_action
    WHERE conversion_action.status != 'REMOVED'
  `)

  const existingMap = new Map<string, { id: string; type: string; category: string }>()
  for (const row of existingRows) {
    const action = (row as { conversion_action?: { name?: string; id?: string | number; type?: string; category?: string } }).conversion_action ?? {}
    existingMap.set(String(action.name ?? '').toLowerCase(), {
      id: String(action.id ?? ''),
      type: String(action.type ?? ''),
      category: String(action.category ?? ''),
    })
  }

  const creations: any[] = []
  const alreadyPresent: any[] = []

  for (const conversion of desiredConversions) {
    const key = conversion.name.toLowerCase()
    if (existingMap.has(key)) {
      alreadyPresent.push({ name: conversion.name, ...existingMap.get(key)! })
      continue
    }

    creations.push({
      name: conversion.name,
      type: enums.ConversionActionType.WEBPAGE,
      category: enums.ConversionActionCategory.SUBMIT_LEAD_FORM,
      status: enums.ConversionActionStatus.ENABLED,
      counting_type: enums.ConversionActionCountingType.ONE_PER_CLICK,
    })
  }

  if (creations.length) {
    const response = await customer.conversionActions.create(creations)
    console.log('Created conversion actions:')
    for (const result of response.results) {
      console.log(` - ${result.resource_name}`)
    }
  }

  if (alreadyPresent.length) {
    console.log('\nExisting conversion actions:')
    for (const existing of alreadyPresent) {
      console.log(` - ${existing.name} (ID ${existing.id})`)
    }
  }
}

ensureConversions().catch((error) => {
  console.error('Failed to ensure conversion actions:', error)
  process.exit(1)
})
