#!/usr/bin/env tsx
import path from 'path'
import { config as loadEnv } from 'dotenv'
import { GoogleAdsApi } from 'google-ads-api'

loadEnv({ path: path.join(process.cwd(), '.env.local') })

const sanitize = (value?: string) => (value ? value.replace(/[^0-9]/g, '') : undefined)

const api = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
})

const customer = api.Customer({
  customer_id: sanitize(process.env.GOOGLE_ADS_CUSTOMER_ID)!,
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
})

async function main() {
  const rows = await customer.query(`
    SELECT conversion_action.id,
           conversion_action.name,
           conversion_action.tag_snippets
    FROM conversion_action
    WHERE conversion_action.name IN ('Lead - Quote Form', 'Lead - Contact Form', 'Lead - Phone Click (Website)')
  `)

  for (const row of rows) {
    const ca = row.conversion_action
    if (!ca) continue
    console.log('---')
    console.log('Name:', ca.name)
    console.log('ID:', ca.id)
    if (ca.tag_snippets) {
      for (const snippet of ca.tag_snippets) {
        if (snippet.type === 2 && snippet.page_format === 3) {
          console.log('Event snippet:', snippet.event_snippet)
        }
      }
    }
  }
}

main().catch((error) => {
  console.error('Failed to fetch tag snippets:', error)
  process.exit(1)
})
