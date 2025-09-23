import { GoogleAdsApi, enums } from 'google-ads-api'

/**
 * Central Google Ads helper for Somerset Window Cleaning.
 *
 * The module wraps the official `google-ads-api` client to provide
 * high-level helpers that the dashboard, API route and automation
 * scripts can call without having to worry about GAQL syntax or
 * low-level mutation rules.
 */

export interface GoogleAdsConfig {
  customerId: string
  developerToken: string
  clientId: string
  clientSecret: string
  refreshToken: string
  /** Optional manager / login customer id for MCC accounts */
  loginCustomerId?: string
}

export class GoogleAdsConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GoogleAdsConfigError'
  }
}

const REQUIRED_ENV_VARS = [
  'GOOGLE_ADS_CUSTOMER_ID',
  'GOOGLE_ADS_DEVELOPER_TOKEN',
  'GOOGLE_ADS_CLIENT_ID',
  'GOOGLE_ADS_CLIENT_SECRET',
  'GOOGLE_ADS_REFRESH_TOKEN',
] as const

type RequiredEnv = (typeof REQUIRED_ENV_VARS)[number]

const sanitizeCustomerId = (value: string) => value.replace(/[^0-9]/g, '')

const toNumber = (value: unknown): number => {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') return value
  if (typeof value === 'bigint') return Number(value)
  if (typeof value === 'string') return Number(value)
  return Number(value)
}

const microsToCurrency = (value: unknown): number => Number((toNumber(value) / 1_000_000).toFixed(2))

let cachedConfig: GoogleAdsConfig | null = null
let cachedClient: GoogleAdsApi | null = null
let cachedCustomer: ReturnType<GoogleAdsApi['Customer']> | null = null

const readEnv = (name: RequiredEnv): string => {
  const value = process.env[name]
  if (!value) {
    throw new GoogleAdsConfigError(`Missing required environment variable: ${name}`)
  }
  return value
}

export const getGoogleAdsConfig = (): GoogleAdsConfig => {
  if (cachedConfig) return cachedConfig

  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key])
  if (missing.length) {
    throw new GoogleAdsConfigError(
      `Google Ads is not configured. Missing the following env vars: ${missing.join(', ')}`,
    )
  }

  const config: GoogleAdsConfig = {
    customerId: readEnv('GOOGLE_ADS_CUSTOMER_ID'),
    developerToken: readEnv('GOOGLE_ADS_DEVELOPER_TOKEN'),
    clientId: readEnv('GOOGLE_ADS_CLIENT_ID'),
    clientSecret: readEnv('GOOGLE_ADS_CLIENT_SECRET'),
    refreshToken: readEnv('GOOGLE_ADS_REFRESH_TOKEN'),
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID || undefined,
  }

  cachedConfig = config
  return config
}

const getGoogleAdsCustomer = () => {
  if (cachedCustomer) return cachedCustomer

  const config = getGoogleAdsConfig()

  if (!cachedClient) {
    cachedClient = new GoogleAdsApi({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      developer_token: config.developerToken,
    })
  }

  cachedCustomer = cachedClient.Customer({
    customer_id: sanitizeCustomerId(config.customerId),
    refresh_token: config.refreshToken,
    login_customer_id: config.loginCustomerId ? sanitizeCustomerId(config.loginCustomerId) : undefined,
  })

  return cachedCustomer
}

export const resetGoogleAdsClient = () => {
  cachedConfig = null
  cachedClient = null
  cachedCustomer = null
}

export const isGoogleAdsConfigured = (): boolean => {
  try {
    getGoogleAdsConfig()
    return true
  } catch (error) {
    return false
  }
}

export interface CampaignPerformance {
  id: string
  name: string
  status: string
  channelType?: string
  budgetMicros: number
  budgetId?: string
  impressions: number
  clicks: number
  costMicros: number
  cost: number
  conversions: number
  conversionValue: number
  ctr: number
  avgCpc: number
  cpa: number | null
}

export interface KeywordPerformance {
  campaignId: string
  campaignName: string
  adGroupId: string
  adGroupName: string
  criterionId: string
  text: string
  matchType: string
  status: string
  impressions: number
  clicks: number
  costMicros: number
  cost: number
  conversions: number
  conversionValue: number
  qualityScore?: number
  cpcBidMicros?: number
  ctr: number
}

export interface OptimizationRecommendation {
  resourceName?: string
  type: string
  description?: string
  dismissed?: boolean
  campaignResourceName?: string
  estimatedImpact?: {
    impressions?: number
    clicks?: number
    costMicros?: number
    conversions?: number
  }
}

type QueryOptions = {
  limit?: number
}

async function query<T = any>(gaql: string, options: QueryOptions = {}) {
  const customer = getGoogleAdsCustomer()
  const rows = await customer.query(gaql, options.limit ? { page_size: options.limit } : undefined)
  return rows as T[]
}

const extractBudgetId = (resourceName?: string | null): string | undefined => {
  if (!resourceName) return undefined
  const parts = resourceName.split('/')
  return parts[parts.length - 1] || undefined
}

export class GoogleAdsClient {
  private readonly config: GoogleAdsConfig

  constructor(config: Partial<GoogleAdsConfig> = {}) {
    const mergedConfig = { ...getGoogleAdsConfig(), ...config }
    this.config = mergedConfig
  }

  async getCampaigns(dateRange: string = 'LAST_30_DAYS', options: QueryOptions = {}): Promise<CampaignPerformance[]> {
    const rows = await query<any>(
      `SELECT
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.advertising_channel_type,
        campaign.campaign_budget,
        campaign_budget.id,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date DURING ${dateRange}
        AND campaign.status != 'REMOVED'
      ORDER BY metrics.cost_micros DESC`,
      options,
    )

    return rows.map((row) => {
      const campaign = row.campaign ?? {}
      const budget = row.campaign_budget ?? {}
      const metrics = row.metrics ?? {}

      const costMicros = toNumber(metrics.cost_micros ?? metrics.costMicros)
      const conversions = toNumber(metrics.conversions)

      return {
        id: String(campaign.id ?? ''),
        name: campaign.name ?? 'Unnamed campaign',
        status: campaign.status ?? 'UNSPECIFIED',
        channelType: campaign.advertising_channel_type ?? campaign.advertisingChannelType,
        budgetMicros: toNumber(budget.amount_micros ?? budget.amountMicros),
        budgetId: String(budget.id ?? extractBudgetId(campaign.campaign_budget)),
        impressions: toNumber(metrics.impressions),
        clicks: toNumber(metrics.clicks),
        costMicros,
        cost: microsToCurrency(costMicros),
        conversions,
        conversionValue: toNumber(metrics.conversions_value ?? metrics.conversionValue),
        ctr: Number((toNumber(metrics.ctr) || 0).toFixed(4)),
        avgCpc: microsToCurrency(metrics.average_cpc ?? metrics.averageCpc),
        cpa: conversions > 0 ? Number((microsToCurrency(costMicros) / conversions).toFixed(2)) : null,
      }
    })
  }

  async updateCampaignBudget(campaignId: string, newBudgetMicros: number) {
    const rows = await query<any>(
      `SELECT campaign.campaign_budget, campaign_budget.id
       FROM campaign
       WHERE campaign.id = ${campaignId}
       LIMIT 1`,
    )

    const row = rows[0]
    if (!row) {
      throw new Error(`Campaign ${campaignId} not found`)
    }

    const resourceName = row.campaign?.campaign_budget ?? row.campaignBudget
    const budgetId = String(row.campaign_budget?.id ?? extractBudgetId(resourceName))

    if (!budgetId) {
      throw new Error(`Unable to determine campaign budget for campaign ${campaignId}`)
    }

    const customer = getGoogleAdsCustomer()
    const customerId = sanitizeCustomerId(this.config.customerId)

    await customer.campaignBudgets.update([
      {
        resource_name: `customers/${customerId}/campaignBudgets/${budgetId}`,
        amount_micros: Math.round(newBudgetMicros),
      },
    ])

    return {
      budgetId,
      amountMicros: newBudgetMicros,
    }
  }

  async getKeywords(dateRange: string = 'LAST_30_DAYS', options: QueryOptions = {}): Promise<KeywordPerformance[]> {
    const rows = await query<any>(
      `SELECT
        campaign.id,
        campaign.name,
        ad_group.id,
        ad_group.name,
        ad_group_criterion.criterion_id,
        ad_group_criterion.status,
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.effective_cpc_bid_micros,
        ad_group_criterion.quality_info.quality_score,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_value,
        metrics.ctr
      FROM keyword_view
      WHERE segments.date DURING ${dateRange}
        AND ad_group_criterion.status != 'REMOVED'
      ORDER BY metrics.impressions DESC`,
      options,
    )

    return rows.map((row) => {
      const campaign = row.campaign ?? {}
      const adGroup = row.ad_group ?? row.adGroup ?? {}
      const criterion = row.ad_group_criterion ?? row.adGroupCriterion ?? {}
      const keyword = criterion.keyword ?? {}
      const metrics = row.metrics ?? {}

      return {
        campaignId: String(campaign.id ?? ''),
        campaignName: campaign.name ?? 'Campaign',
        adGroupId: String(adGroup.id ?? ''),
        adGroupName: adGroup.name ?? 'Ad group',
        criterionId: String(criterion.criterion_id ?? criterion.criterionId ?? ''),
        text: keyword.text ?? '(not set)',
        matchType: keyword.match_type ?? keyword.matchType ?? 'UNSPECIFIED',
        status: criterion.status ?? 'UNSPECIFIED',
        impressions: toNumber(metrics.impressions),
        clicks: toNumber(metrics.clicks),
        costMicros: toNumber(metrics.cost_micros ?? metrics.costMicros),
        cost: microsToCurrency(metrics.cost_micros ?? metrics.costMicros),
        conversions: toNumber(metrics.conversions),
        conversionValue: toNumber(metrics.conversions_value ?? metrics.conversionValue),
        qualityScore: toNumber(criterion.quality_info?.quality_score ?? criterion.qualityInfo?.qualityScore),
        cpcBidMicros: toNumber(criterion.effective_cpc_bid_micros ?? criterion.effectiveCpcBidMicros),
        ctr: Number((toNumber(metrics.ctr) || 0).toFixed(4)),
      }
    })
  }

  async updateKeywordBid(adGroupId: string, criterionId: string, bidMicros: number) {
    const customer = getGoogleAdsCustomer()
    const customerId = sanitizeCustomerId(this.config.customerId)

    const resourceName = `customers/${customerId}/adGroupCriteria/${sanitizeCustomerId(adGroupId)}~${sanitizeCustomerId(criterionId)}`

    await customer.adGroupCriteria.update([
      {
        resource_name: resourceName,
        cpc_bid_micros: Math.round(bidMicros),
      },
    ])

    return { resourceName, bidMicros }
  }

  async addNegativeKeyword(campaignId: string, keywordText: string, matchType: string = 'BROAD') {
    const customer = getGoogleAdsCustomer()
    const customerId = sanitizeCustomerId(this.config.customerId)

    const resolvedMatchType = enums.KeywordMatchType[matchType as keyof typeof enums.KeywordMatchType] ?? enums.KeywordMatchType.BROAD

    const result = await customer.campaignCriteria.create([
      {
        campaign: `customers/${customerId}/campaigns/${sanitizeCustomerId(campaignId)}`,
        negative: true,
        keyword: {
          text: keywordText,
          match_type: resolvedMatchType,
        },
      },
    ])

    return result
  }

  async getPerformanceReport(dateRange: string = 'LAST_30_DAYS', options: QueryOptions = {}) {
    const rows = await query<any>(
      `SELECT
        campaign.name,
        ad_group.name,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversions_from_interactions_rate,
        metrics.cost_per_conversion
      FROM ad_group
      WHERE segments.date DURING ${dateRange}
        AND campaign.status = 'ENABLED'
        AND ad_group.status = 'ENABLED'
      ORDER BY metrics.cost_micros DESC`,
      options,
    )

    return rows.map((row) => {
      const campaign = row.campaign ?? {}
      const adGroup = row.ad_group ?? row.adGroup ?? {}
      const metrics = row.metrics ?? {}

      return {
        campaign: campaign.name ?? 'Campaign',
        adGroup: adGroup.name ?? 'Ad group',
        impressions: toNumber(metrics.impressions),
        clicks: toNumber(metrics.clicks),
        ctr: Number((toNumber(metrics.ctr) || 0).toFixed(4)),
        averageCpc: microsToCurrency(metrics.average_cpc ?? metrics.averageCpc),
        cost: microsToCurrency(metrics.cost_micros ?? metrics.costMicros),
        conversions: toNumber(metrics.conversions),
        conversionRate: Number((
          toNumber(
            metrics.conversions_from_interactions_rate ?? metrics.conversionsFromInteractionsRate,
          ) || 0
        ).toFixed(4)),
        costPerConversion: microsToCurrency(metrics.cost_per_conversion ?? metrics.costPerConversion),
      }
    })
  }

  async getRecommendations(options: QueryOptions = {}): Promise<OptimizationRecommendation[]> {
    const rows = await query<any>(
      `SELECT
        recommendation.resource_name,
        recommendation.campaign,
        recommendation.type,
        recommendation.description,
        recommendation.dismissed,
        recommendation.impact.impressions.change_in_value,
        recommendation.impact.clicks.change_in_value,
        recommendation.impact.cost_micros.change_in_value,
        recommendation.impact.conversions.change_in_value
      FROM recommendation
      WHERE recommendation.dismissed = FALSE`,
      options,
    )

    return rows.map((row) => {
      const recommendation = row.recommendation ?? {}
      const impact = recommendation.impact ?? {}

      return {
        resourceName: recommendation.resource_name,
        type: recommendation.type ?? 'UNSPECIFIED',
        description: recommendation.description ?? undefined,
        dismissed: recommendation.dismissed ?? false,
        campaignResourceName: recommendation.campaign ?? undefined,
        estimatedImpact: {
          impressions: toNumber(impact.impressions?.change_in_value ?? impact.impressions?.changeInValue),
          clicks: toNumber(impact.clicks?.change_in_value ?? impact.clicks?.changeInValue),
          costMicros: toNumber(impact.cost_micros?.change_in_value ?? impact.costMicros?.changeInValue),
          conversions: toNumber(impact.conversions?.change_in_value ?? impact.conversions?.changeInValue),
        },
      }
    })
  }

  async generateOptimizationRecommendations(): Promise<OptimizationRecommendation[]> {
    const [campaigns, keywords, apiRecommendations] = await Promise.all([
      this.getCampaigns('LAST_30_DAYS'),
      this.getKeywords('LAST_30_DAYS', { limit: 200 }),
      this.getRecommendations({ limit: 50 }),
    ])

    const customRecommendations: OptimizationRecommendation[] = []

    campaigns.forEach((campaign) => {
      if (campaign.conversions > 0 && campaign.cpa && campaign.cpa > 80) {
        customRecommendations.push({
          type: 'COST_EFFICIENCY',
          description: `Campaign “${campaign.name}” has a high CPA (£${campaign.cpa.toFixed(2)}). Consider tightening targeting or lowering bids.`,
        })
      }

      if (campaign.ctr < 0.01 && campaign.impressions > 1_000) {
        customRecommendations.push({
          type: 'AD_COPY',
          description: `Campaign “${campaign.name}” CTR is ${campaign.ctr.toFixed(4)} — review ad copy and extensions.`,
        })
      }
    })

    const lowQualityKeywords = keywords.filter((keyword) => (keyword.qualityScore ?? 0) < 5 && keyword.impressions > 200)
    if (lowQualityKeywords.length) {
      customRecommendations.push({
        type: 'QUALITY_SCORE',
        description: `${lowQualityKeywords.length} keywords have Quality Score below 5. Improve ad relevance or landing page experience.`,
      })
    }

    return [...apiRecommendations, ...customRecommendations]
  }

  async optimizeForSeasonality(): Promise<OptimizationRecommendation[]> {
    const month = new Date().getMonth() + 1
    const recommendations: OptimizationRecommendation[] = []

    if (month >= 3 && month <= 5) {
      recommendations.push({
        type: 'SEASONAL_BID',
        description: 'Spring cleaning demand is peaking. Increase bids for “window cleaning” keywords by 15-20%.',
      })
    }

    if (month >= 9 && month <= 11) {
      recommendations.push({
        type: 'SEASONAL_BID',
        description: 'Autumn gutter maintenance season. Increase bids for gutter clearing keywords and ensure ad copy highlights slots.',
      })
    }

    return recommendations
  }
}

export async function automatedKeywordOptimization(): Promise<OptimizationRecommendation[]> {
  const client = new GoogleAdsClient()
  return client.generateOptimizationRecommendations()
}

export async function generateWeeklyReport() {
  const client = new GoogleAdsClient()
  const performance = await client.getPerformanceReport('LAST_7_DAYS')
  const summary = {
    campaignsAnalysed: performance.length,
    totalImpressions: performance.reduce((acc, item) => acc + item.impressions, 0),
    totalClicks: performance.reduce((acc, item) => acc + item.clicks, 0),
    totalConversions: performance.reduce((acc, item) => acc + item.conversions, 0),
    totalCost: Number(
      performance.reduce((acc, item) => acc + item.cost, 0).toFixed(2),
    ),
  }
  return { summary, performance }
}
