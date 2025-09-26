#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import { GoogleAdsApi, enums } from 'google-ads-api'
import { GoogleAdsClient, GoogleAdsConfigError } from '../lib/google-ads'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const clientId = process.env.GOOGLE_ADS_CLIENT_ID
const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET
const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN
const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN
const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID

if (!clientId || !clientSecret || !developerToken || !refreshToken || !customerId) {
  throw new Error('Missing Google Ads credentials in .env.local')
}

const api = new GoogleAdsApi({
  client_id: clientId,
  client_secret: clientSecret,
  developer_token: developerToken,
})

const customer = api.Customer({
  customer_id: customerId,
  refresh_token: refreshToken,
})

const configDir = path.join(__dirname, '..', 'config', 'google-ads')
const planPath = path.join(configDir, 'campaign-plan.json')
if (!fs.existsSync(planPath)) {
  throw new Error('config/google-ads/campaign-plan.json not found')
}

const serviceAreasPath = path.join(configDir, 'service-areas.json')
if (!fs.existsSync(serviceAreasPath)) {
  throw new Error('config/google-ads/service-areas.json not found')
}

const plan = JSON.parse(fs.readFileSync(planPath, 'utf8')) as {
  weekdayBudgetCapGBP?: number
  campaigns: Array<{ name: string; dailyBudgetGBP: number; status: string }>
  pause?: string[]
}

const serviceAreas = JSON.parse(fs.readFileSync(serviceAreasPath, 'utf8')) as {
  tier1: Array<{ name: string; geoTargetConstant: string }>
}

const TIER1_LOCATIONS = (serviceAreas.tier1 || []).map((item) => item.geoTargetConstant)
if (TIER1_LOCATIONS.length === 0) {
  throw new Error('No Tier-1 service areas defined in service-areas.json')
}

const LOCATION_NAME_LOOKUP = new Map<string, string>(
  (serviceAreas.tier1 || []).map((item) => [item.geoTargetConstant, item.name]),
)

const toMicros = (value: number) => Math.round(value * 1_000_000)
const formatDate = (date: Date) => date.toISOString().slice(0, 10).replace(/-/g, '')

const HEADLINES: Record<string, string[]> = {
  'Windows – Somerset': [
    'Somerset Window Cleaner',
    '4-Weekly Window Cleaning',
    'Frames, Sills & Doors Included',
    'Pure Water Pole Reach 3 Floors',
    'Friendly DBS Checked Team',
    'Book Local Window Cleaners',
    'Fast Online Quotes',
    'One-Off or Regular Visits',
  ],
  'Gutter – Somerset': [
    'Somerset Gutter Cleaning',
    'Prevent Overflow & Damp',
    'Safe Ground-Based Cleaning',
    'Downpipes Cleared & Tested',
    'Photo Proof After Every Clean',
    'Combine Gutters & Windows',
    'Blocked Gutters? We Can Help',
    'Fast Local Gutter Quotes',
  ],
  'Conservatory – Somerset': [
    'Conservatory Roof Cleaning',
    'Restore Conservatory Shine',
    'Algae & Moss Removed',
    'Pure Water Soft Brush Clean',
    'Glass & Polycarbonate Safe',
    'Somerset Conservatory Experts',
    'Book Conservatory Cleaners',
    'Fast Conservatory Quotes',
  ],
  'Solar Panels – Somerset': [
    'Somerset Solar Panel Cleaning',
    'Boost Solar Output Again',
    'Pure Water Solar Cleaning',
    'Protect Your Panel Warranty',
    'Quarterly Service Plans',
    'Safe Reach Up To 3 Floors',
    'Local Solar Panel Cleaners',
    'Fast Solar Cleaning Quotes',
  ],
  'Brand Protection': [
    'Somerset Window Cleaning®',
    'Trusted Local Window Cleaners',
    'Book Somerset Cleaning Team',
    '4,000+ Happy Customers',
    'Pure Water Pole Specialists',
    'Fast Quotes & Reminders',
    'Fully Insured Since 2019',
    'Request Your Cleaning Slot',
  ],
}

const DESCRIPTIONS: Record<string, string[]> = {
  'Windows – Somerset': [
    'Pure water pole cleans glass, frames and doors with no streaks.',
    '4-week or one-off visits with text reminders before every clean.',
    'Fully insured local team serving Street, Glastonbury and Wells.',
    'Book online in minutes - pay by Direct Debit or card.',
  ],
  'Gutter – Somerset': [
    'Vacuum gutter clearing keeps rainwater flowing and prevents damp.',
    'Downpipes cleared and photos provided so you can see the results.',
    'Serving Street, Glastonbury, Wells, Somerton and Langport.',
    'Bundle with window cleaning for tidy finishes and smart pricing.',
  ],
  'Conservatory – Somerset': [
    'Gentle pure water cleaning removes algae and staining safely.',
    'Includes roof panels, finials and skylights for a bright conservatory.',
    'Local Somerset specialists with flexible scheduling across Tier-1 towns.',
    'Request a quote online - photo updates available on completion.',
  ],
  'Solar Panels – Somerset': [
    'Pure water solar cleaning restores output without harsh chemicals.',
    'Quarterly or one-off cleans with performance photos on request.',
    'Serving Street, Glastonbury, Wells, Somerton and Langport.',
    'Book online in minutes - we work safely up to three-storey panels.',
  ],
  'Brand Protection': [
    'Official Somerset Window Cleaning - manage quotes and visits online.',
    'Window, gutter, conservatory and solar specialists across Somerset.',
    'DBS-checked cleaners with reminders, photo proof and easy payments.',
    'Call 07415 526331 or request your quote in under 60 seconds.',
  ],
}

const FINAL_URLS: Record<string, string> = {
  'Windows – Somerset': 'https://somersetwindowcleaning.co.uk/services/window-cleaning',
  'Gutter – Somerset': 'https://somersetwindowcleaning.co.uk/services/gutter-clearing',
  'Conservatory – Somerset': 'https://somersetwindowcleaning.co.uk/services/conservatory-cleaning',
  'Solar Panels – Somerset': 'https://somersetwindowcleaning.co.uk/services/solar-panel-cleaning',
  'Brand Protection': 'https://somersetwindowcleaning.co.uk/',
}

async function fetchCampaignMap() {
  const rows = await customer.query(`
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      campaign.advertising_channel_type,
      campaign_budget.id,
      campaign_budget.amount_micros
    FROM campaign
  `)

  const map = new Map<string, {
    id: string
    status: string | number
    budgetId: string
    budgetMicros: number
    channelType: string | number
  }>()

  rows.forEach((row) => {
    const name = row.campaign?.name
    if (!name) return
    map.set(name, {
      id: String(row.campaign?.id ?? ''),
      status: row.campaign?.status ?? 'UNSPECIFIED',
      budgetId: String(row.campaign_budget?.id ?? ''),
      budgetMicros: Number(row.campaign_budget?.amount_micros ?? 0),
      channelType: row.campaign?.advertising_channel_type ?? 'UNKNOWN',
    })
  })
  return map
}

async function createCampaignShell(item: { name: string; dailyBudgetGBP: number }) {
  const budgetName = `${item.name} Budget`
  const budgetResult = await customer.campaignBudgets.create([
    {
      name: budgetName,
      amount_micros: toMicros(item.dailyBudgetGBP),
      delivery_method: enums.BudgetDeliveryMethod.STANDARD,
      explicitly_shared: false,
    },
  ])

  const budgetResource = budgetResult.results?.[0]?.resource_name
  if (!budgetResource) {
    throw new Error(`Failed to create budget for ${item.name}`)
  }

  const startDate = formatDate(new Date())
  const campaignResult = await customer.campaigns.create([
    {
      name: item.name,
      campaign_budget: budgetResource,
      advertising_channel_type: enums.AdvertisingChannelType.SEARCH,
      status: enums.CampaignStatus.PAUSED,
      start_date: startDate,
      network_settings: {
        target_google_search: true,
        target_search_network: true,
        target_content_network: false,
        target_partner_search_network: false,
      },
      contains_eu_political_advertising: enums.EuPoliticalAdvertisingStatus.DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING,
      maximize_conversions: {},
    },
  ])

  const campaignResource = campaignResult.results?.[0]?.resource_name
  if (!campaignResource) {
    throw new Error(`Failed to create campaign ${item.name}`)
  }

  const campaignId = campaignResource.split('/').pop() ?? ''

  await customer.campaignCriteria.create([
    {
      campaign: campaignResource,
      language: {
        language_constant: 'languageConstants/1000',
      },
    },
  ])

  const headlines = HEADLINES[item.name] ?? [item.name, 'Request a Quote', 'Somerset Cleaning Experts']
  const descriptions = DESCRIPTIONS[item.name] ?? [
    'Professional cleaning service across Somerset. Request your free quote today.',
    'Friendly, insured team ready to help. Book your clean in minutes.',
  ]

  const adGroupResult = await customer.adGroups.create([
    {
      campaign: campaignResource,
      name: `${item.name} Ad Group`,
      status: enums.AdGroupStatus.PAUSED,
      type: enums.AdGroupType.SEARCH_STANDARD,
      cpc_bid_micros: 2_000_000,
    },
  ])

  const adGroupResource = adGroupResult.results?.[0]?.resource_name
  if (adGroupResource) {
    await customer.adGroupAds.create([
      {
        ad_group: adGroupResource,
        status: enums.AdGroupAdStatus.PAUSED,
        ad: {
          final_urls: ['https://somersetwindowcleaning.co.uk/book-appointment'],
          responsive_search_ad: {
            headlines: headlines.map((text) => ({ text })),
            descriptions: descriptions.map((text) => ({ text })),
          },
        },
      },
    ])
  }

  return {
    id: campaignId,
    status: enums.CampaignStatus.PAUSED,
    budgetId: budgetResource.split('/').pop() ?? '',
    budgetMicros: toMicros(item.dailyBudgetGBP),
    channelType: enums.AdvertisingChannelType.SEARCH,
  }
}

async function ensureLocationTargets(campaignId: string) {
  const desired = new Set(TIER1_LOCATIONS)

  const rows = await customer.query(`
    SELECT
      campaign_criterion.resource_name,
      campaign_criterion.negative,
      campaign_criterion.location.geo_target_constant,
      campaign_criterion.type
    FROM campaign_criterion
    WHERE campaign.id = ${campaignId}
      AND campaign_criterion.type = 'LOCATION'
  `)

  const present = new Set<string>()
  const toRemove: string[] = []

  rows.forEach((row) => {
    const criterion = row.campaign_criterion || {}
    const geo = criterion.location?.geo_target_constant
    if (!geo) return
    if (criterion.negative) return
    present.add(geo)
    if (!desired.has(geo)) {
      if (criterion.resource_name) {
        toRemove.push(criterion.resource_name)
      }
    }
  })

  const toAdd = Array.from(desired).filter((geo) => !present.has(geo))

  if (toRemove.length) {
    await customer.campaignCriteria.remove(toRemove)
  }

  if (toAdd.length) {
    await customer.campaignCriteria.create(
      toAdd.map((geo) => ({
        campaign: `customers/${customerId}/campaigns/${campaignId}`,
        negative: false,
        location: {
          geo_target_constant: geo,
        },
      })),
    )
  }

  return {
    added: toAdd.length,
    removed: toRemove.length,
    applied: Array.from(desired).map((geo) => LOCATION_NAME_LOOKUP.get(geo) || geo),
  }
}

async function ensureAdCopy(campaignName: string, campaignId: string) {
  const copy = {
    headlines: HEADLINES[campaignName] ?? [],
    descriptions: DESCRIPTIONS[campaignName] ?? [],
    finalUrl: FINAL_URLS[campaignName] ?? 'https://somersetwindowcleaning.co.uk/book-appointment',
  }

  if (!copy.headlines.length || !copy.descriptions.length) {
    return '   No ad copy template defined.'
  }

  const adGroupName = `${campaignName} Ad Group`

  const adGroupRows = await customer.query(`
    SELECT ad_group.id, ad_group.name, ad_group.status
    FROM ad_group
    WHERE campaign.id = ${campaignId}
  `)

  let adGroupId: string | undefined
  let adGroupStatus: string | number | undefined

  adGroupRows.forEach((row) => {
    if (row.ad_group?.name === adGroupName) {
      adGroupId = row.ad_group?.id ? String(row.ad_group.id) : undefined
      const statusValue = row.ad_group?.status
      adGroupStatus = typeof statusValue === 'string' || typeof statusValue === 'number' ? statusValue : undefined
    }
  })

  if (!adGroupId) {
    const adGroupResult = await customer.adGroups.create([
      {
        campaign: `customers/${customerId}/campaigns/${campaignId}`,
        name: adGroupName,
        status: enums.AdGroupStatus.ENABLED,
        type: enums.AdGroupType.SEARCH_STANDARD,
        cpc_bid_micros: 2_000_000,
      },
    ])

    adGroupId = adGroupResult.results?.[0]?.resource_name?.split('/').pop()
    adGroupStatus = enums.AdGroupStatus.ENABLED
  }

  if (!adGroupId) {
    throw new Error(`Failed to locate or create ad group for ${campaignName}`)
  }

  if (adGroupStatus !== enums.AdGroupStatus.ENABLED) {
    await customer.adGroups.update([
      {
        resource_name: `customers/${customerId}/adGroups/${adGroupId}`,
        status: enums.AdGroupStatus.ENABLED,
      },
    ])
  }

  const adRows = await customer.query(`
    SELECT ad_group_ad.resource_name,
           ad_group_ad.status,
           ad_group_ad.ad.final_urls,
           ad_group_ad.ad.responsive_search_ad.headlines,
           ad_group_ad.ad.responsive_search_ad.descriptions
    FROM ad_group_ad
    WHERE ad_group.id = ${adGroupId}
      AND ad_group_ad.ad.type = RESPONSIVE_SEARCH_AD
      AND ad_group_ad.status != 'REMOVED'
  `)

  const formattedHeadlines = copy.headlines.map((text) => ({ text }))
  const formattedDescriptions = copy.descriptions.map((text) => ({ text }))

  if (adRows.length) {
    const resourcesToRemove = adRows
      .map((row) => row.ad_group_ad?.resource_name)
      .filter((resource): resource is string => Boolean(resource))
    if (resourcesToRemove.length) {
      await customer.adGroupAds.remove(resourcesToRemove)
    }
  }

  await customer.adGroupAds.create([
    {
      ad_group: `customers/${customerId}/adGroups/${adGroupId}`,
      status: enums.AdGroupAdStatus.ENABLED,
      ad: {
        final_urls: [copy.finalUrl],
        responsive_search_ad: {
          headlines: formattedHeadlines,
          descriptions: formattedDescriptions,
        },
      },
    },
  ])

  return '   RSA copy enforced and enabled.'
}

async function applyBudgets(client: GoogleAdsClient, campaigns: typeof plan.campaigns) {
  const current = await fetchCampaignMap()
  const results: string[] = []

  for (const item of campaigns) {
    let entry = current.get(item.name)
    if (!entry) {
      results.push(`⚙️  Creating campaign ${item.name}`)
      entry = await createCampaignShell(item)
      current.set(item.name, entry)
    }

    const targetMicros = toMicros(item.dailyBudgetGBP)
    if (entry.budgetMicros !== targetMicros) {
      await client.updateCampaignBudget(entry.id, targetMicros)
      results.push(`✅ Budget set to £${item.dailyBudgetGBP.toFixed(2)} for ${item.name}`)
    } else {
      results.push(`• Budget already £${item.dailyBudgetGBP.toFixed(2)} for ${item.name}`)
    }

    const desiredStatus = item.status.toUpperCase()
    const statusEnum = enums.CampaignStatus[desiredStatus as keyof typeof enums.CampaignStatus]
    if (!statusEnum) {
      results.push(`⚠️  Unknown status '${item.status}' for ${item.name}`)
      continue
    }

    const currentStatus: number | undefined =
      typeof entry.status === 'number'
        ? entry.status
        : entry.status
          ? (enums.CampaignStatus[entry.status as keyof typeof enums.CampaignStatus] as number | undefined)
          : undefined

    if (currentStatus !== statusEnum) {
      await customer.campaigns.update([
        {
          resource_name: `customers/${customerId}/campaigns/${entry.id}`,
          status: statusEnum,
        },
      ])
      results.push(`✅ Status set to ${desiredStatus} for ${item.name}`)
    }

    const locationResult = await ensureLocationTargets(entry.id)
    results.push(
      `   Locations enforced: +${locationResult.added} / -${locationResult.removed} → ${locationResult.applied.join(', ')}`,
    )

    const adResult = await ensureAdCopy(item.name, entry.id)
    results.push(adResult)
  }

  return results
}

async function pauseCampaigns(names: string[]) {
  const current = await fetchCampaignMap()
  const results: string[] = []

  for (const name of names) {
    const entry = current.get(name)
    if (!entry) {
      results.push(`⚠️  Could not find campaign '${name}' to pause`)
      continue
    }

    const statusEnum = enums.CampaignStatus.PAUSED
    const currentStatus: number | undefined =
      typeof entry.status === 'number'
        ? entry.status
        : entry.status
          ? (enums.CampaignStatus[entry.status as keyof typeof enums.CampaignStatus] as number | undefined)
          : undefined

    if (currentStatus !== statusEnum) {
      await customer.campaigns.update([
        {
          resource_name: `customers/${customerId}/campaigns/${entry.id}`,
          status: statusEnum,
        },
      ])
      results.push(`✅ Paused ${name}`)
    } else {
      results.push(`• ${name} already paused`)
    }
  }

  return results
}

export const runCampaignPlan = async (): Promise<string[]> => {
  const client = new GoogleAdsClient()
  const lines: string[] = []

  lines.push('Applying campaign plan…')

  const budgetResults = await applyBudgets(client, plan.campaigns)
  lines.push(...budgetResults)

  if (plan.pause?.length) {
    lines.push('\nPausing campaigns…')
    const pauseResults = await pauseCampaigns(plan.pause)
    lines.push(...pauseResults)
  }

  const totalBudget = plan.campaigns.reduce((sum, item) => sum + item.dailyBudgetGBP, 0)
  lines.push(`\nTotal planned weekday budget: £${totalBudget.toFixed(2)} (cap ${plan.weekdayBudgetCapGBP ?? 'n/a'})`)

  return lines
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  runCampaignPlan()
    .then((lines) => {
      console.log(lines.join('\n'))
      process.exit(0)
    })
    .catch((error) => {
      if (error instanceof GoogleAdsConfigError) {
        console.error('❌ Google Ads configuration error:', error.message)
      } else if (error && typeof error === 'object') {
        console.error(JSON.stringify(error, null, 2))
      } else {
        console.error(error)
      }
      process.exit(1)
    })
}
