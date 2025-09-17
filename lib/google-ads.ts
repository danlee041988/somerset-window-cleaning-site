/**
 * Google Ads API Integration for Somerset Window Cleaning
 * 
 * Provides comprehensive Google Ads management including:
 * - Campaign optimization
 * - Keyword management
 * - Performance tracking
 * - Automated bidding strategies
 * - Integration with GA4 and Notion data
 */

import { GoogleAuth } from 'google-auth-library'

// Types for Google Ads API responses
export interface GoogleAdsConfig {
  customerId: string
  developerToken: string
  clientId: string
  clientSecret: string
  refreshToken: string
}

export interface CampaignData {
  id: string
  name: string
  status: 'ENABLED' | 'PAUSED' | 'REMOVED'
  budget: number
  impressions: number
  clicks: number
  cost: number
  conversions: number
  ctr: number
  cpc: number
  conversionRate: number
}

export interface KeywordData {
  id: string
  text: string
  matchType: 'EXACT' | 'PHRASE' | 'BROAD'
  cpc: number
  impressions: number
  clicks: number
  conversions: number
  qualityScore: number
  adGroupId: string
}

export interface AdData {
  id: string
  type: 'RESPONSIVE_SEARCH_AD' | 'EXPANDED_TEXT_AD'
  headlines: string[]
  descriptions: string[]
  status: 'ENABLED' | 'PAUSED' | 'REMOVED'
  impressions: number
  clicks: number
  conversions: number
}

export interface OptimizationRecommendation {
  type: 'KEYWORD_BID' | 'NEGATIVE_KEYWORD' | 'AD_COPY' | 'BUDGET'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  expectedImpact: string
  actionRequired: string
}

class GoogleAdsClient {
  private auth: GoogleAuth
  private config: GoogleAdsConfig
  private baseUrl = 'https://googleads.googleapis.com/v14'

  constructor(config: GoogleAdsConfig) {
    this.config = config
    this.auth = new GoogleAuth({
      credentials: {
        client_id: config.clientId,
        client_secret: config.clientSecret,
        refresh_token: config.refreshToken,
        type: 'authorized_user'
      },
      scopes: ['https://www.googleapis.com/auth/adwords']
    })
  }

  private async makeRequest(endpoint: string, method = 'GET', body?: any) {
    const client = await this.auth.getClient()
    const accessToken = await client.getAccessToken()

    const response = await fetch(`${this.baseUrl}/customers/${this.config.customerId}${endpoint}`, {
      method,
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'developer-token': this.config.developerToken,
        'Content-Type': 'application/json'
      },
      body: body ? JSON.stringify(body) : undefined
    })

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Campaign Management
  async getCampaigns(): Promise<CampaignData[]> {
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        campaign_budget.amount_micros,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros,
        metrics.conversions,
        metrics.ctr,
        metrics.average_cpc,
        metrics.conversions_from_interactions_rate
      FROM campaign
      WHERE campaign.status != 'REMOVED'
      AND segments.date DURING LAST_30_DAYS
    `

    const response = await this.makeRequest('/googleAds:search', 'POST', {
      query,
      pageSize: 100
    })

    return response.results?.map((result: any) => ({
      id: result.campaign.id,
      name: result.campaign.name,
      status: result.campaign.status,
      budget: result.campaignBudget?.amountMicros ? result.campaignBudget.amountMicros / 1000000 : 0,
      impressions: result.metrics?.impressions || 0,
      clicks: result.metrics?.clicks || 0,
      cost: result.metrics?.costMicros ? result.metrics.costMicros / 1000000 : 0,
      conversions: result.metrics?.conversions || 0,
      ctr: result.metrics?.ctr || 0,
      cpc: result.metrics?.averageCpc ? result.metrics.averageCpc / 1000000 : 0,
      conversionRate: result.metrics?.conversionsFromInteractionsRate || 0
    })) || []
  }

  async updateCampaignBudget(campaignId: string, newBudgetMicros: number) {
    const operations = [{
      update: {
        resourceName: `customers/${this.config.customerId}/campaigns/${campaignId}`,
        campaignBudget: {
          amountMicros: newBudgetMicros
        }
      }
    }]

    return this.makeRequest('/campaigns:mutate', 'POST', { operations })
  }

  // Keyword Management
  async getKeywords(campaignId?: string): Promise<KeywordData[]> {
    const campaignFilter = campaignId ? `AND campaign.id = ${campaignId}` : ''
    
    const query = `
      SELECT 
        ad_group_criterion.criterion_id,
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        metrics.average_cpc,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        ad_group_criterion.quality_info.quality_score,
        ad_group.id
      FROM keyword_view
      WHERE ad_group_criterion.status != 'REMOVED'
      ${campaignFilter}
      AND segments.date DURING LAST_30_DAYS
    `

    const response = await this.makeRequest('/googleAds:search', 'POST', {
      query,
      pageSize: 1000
    })

    return response.results?.map((result: any) => ({
      id: result.adGroupCriterion.criterionId,
      text: result.adGroupCriterion.keyword.text,
      matchType: result.adGroupCriterion.keyword.matchType,
      cpc: result.metrics?.averageCpc ? result.metrics.averageCpc / 1000000 : 0,
      impressions: result.metrics?.impressions || 0,
      clicks: result.metrics?.clicks || 0,
      conversions: result.metrics?.conversions || 0,
      qualityScore: result.adGroupCriterion?.qualityInfo?.qualityScore || 0,
      adGroupId: result.adGroup.id
    })) || []
  }

  async updateKeywordBid(adGroupId: string, keywordId: string, bidMicros: number) {
    const operations = [{
      update: {
        resourceName: `customers/${this.config.customerId}/adGroupCriteria/${adGroupId}~${keywordId}`,
        cpcBidMicros: bidMicros
      }
    }]

    return this.makeRequest('/adGroupCriteria:mutate', 'POST', { operations })
  }

  async addNegativeKeyword(campaignId: string, keywordText: string, matchType = 'BROAD') {
    const operations = [{
      create: {
        campaign: `customers/${this.config.customerId}/campaigns/${campaignId}`,
        criterion: {
          keyword: {
            text: keywordText,
            matchType
          },
          negative: true
        }
      }
    }]

    return this.makeRequest('/campaignCriteria:mutate', 'POST', { operations })
  }

  // Performance Analysis
  async getPerformanceReport(dateRange = 'LAST_30_DAYS') {
    const query = `
      SELECT 
        campaign.name,
        ad_group.name,
        metrics.impressions,
        metrics.clicks,
        metrics.ctr,
        metrics.average_cpc,
        metrics.cost_micros,
        metrics.conversions,
        metrics.conversion_rate,
        metrics.cost_per_conversion
      FROM ad_group
      WHERE segments.date DURING ${dateRange}
      AND campaign.status = 'ENABLED'
      AND ad_group.status = 'ENABLED'
      ORDER BY metrics.cost_micros DESC
    `

    const response = await this.makeRequest('/googleAds:search', 'POST', {
      query,
      pageSize: 100
    })

    return response.results?.map((result: any) => ({
      campaign: result.campaign.name,
      adGroup: result.adGroup.name,
      impressions: result.metrics?.impressions || 0,
      clicks: result.metrics?.clicks || 0,
      ctr: result.metrics?.ctr || 0,
      cpc: result.metrics?.averageCpc ? result.metrics.averageCpc / 1000000 : 0,
      cost: result.metrics?.costMicros ? result.metrics.costMicros / 1000000 : 0,
      conversions: result.metrics?.conversions || 0,
      conversionRate: result.metrics?.conversionRate || 0,
      costPerConversion: result.metrics?.costPerConversion ? result.metrics.costPerConversion / 1000000 : 0
    })) || []
  }

  // Optimization Recommendations
  async generateOptimizationRecommendations(): Promise<OptimizationRecommendation[]> {
    const campaigns = await this.getCampaigns()
    const keywords = await this.getKeywords()
    const recommendations: OptimizationRecommendation[] = []

    // Analyze campaign performance
    for (const campaign of campaigns) {
      // Low conversion rate recommendations
      if (campaign.conversionRate < 0.02 && campaign.cost > 50) {
        recommendations.push({
          type: 'KEYWORD_BID',
          priority: 'HIGH',
          description: `Campaign "${campaign.name}" has low conversion rate (${(campaign.conversionRate * 100).toFixed(2)}%)`,
          expectedImpact: 'Reduce wasted spend by 20-30%',
          actionRequired: 'Review and pause underperforming keywords, add negative keywords'
        })
      }

      // High cost per conversion
      if (campaign.conversions > 0) {
        const costPerConversion = campaign.cost / campaign.conversions
        if (costPerConversion > 100) {
          recommendations.push({
            type: 'BUDGET',
            priority: 'MEDIUM',
            description: `Campaign "${campaign.name}" has high cost per conversion (£${costPerConversion.toFixed(2)})`,
            expectedImpact: 'Improve ROI by 15-25%',
            actionRequired: 'Optimize targeting and bid adjustments'
          })
        }
      }
    }

    // Analyze keyword performance
    const lowQualityKeywords = keywords.filter(k => k.qualityScore < 5 && k.impressions > 100)
    if (lowQualityKeywords.length > 0) {
      recommendations.push({
        type: 'AD_COPY',
        priority: 'MEDIUM',
        description: `${lowQualityKeywords.length} keywords have low quality scores`,
        expectedImpact: 'Improve ad relevance and reduce costs',
        actionRequired: 'Update ad copy to better match keyword intent'
      })
    }

    return recommendations
  }

  // Somerset Window Cleaning Specific Optimizations
  async optimizeForSeasonality() {
    const currentMonth = new Date().getMonth() + 1 // 1-12
    const isSpringCleaning = currentMonth >= 3 && currentMonth <= 5
    const isAutumnMaintenance = currentMonth >= 9 && currentMonth <= 11

    const recommendations: OptimizationRecommendation[] = []

    if (isSpringCleaning) {
      recommendations.push({
        type: 'KEYWORD_BID',
        priority: 'HIGH',
        description: 'Spring cleaning season - increase bids for relevant keywords',
        expectedImpact: 'Capture 30% more seasonal demand',
        actionRequired: 'Increase bids for "spring cleaning", "window cleaning service" keywords by 25%'
      })
    }

    if (isAutumnMaintenance) {
      recommendations.push({
        type: 'KEYWORD_BID',
        priority: 'HIGH',
        description: 'Autumn maintenance season - focus on gutter clearing',
        expectedImpact: 'Increase gutter clearing leads by 40%',
        actionRequired: 'Increase bids for "gutter clearing", "gutter cleaning" keywords by 30%'
      })
    }

    return recommendations
  }

  async optimizeBasedOnNotionData(customerData: any[]) {
    const recommendations: OptimizationRecommendation[] = []
    
    // Analyze most valuable services from Notion data
    const serviceDistribution = customerData.reduce((acc, customer) => {
      customer.services?.forEach((service: string) => {
        acc[service] = (acc[service] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    const topServices = Object.entries(serviceDistribution)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)

    topServices.forEach(([service, count]) => {
      recommendations.push({
        type: 'KEYWORD_BID',
        priority: 'HIGH',
        description: `${service} is popular (${count} inquiries) - optimize keywords`,
        expectedImpact: 'Increase relevant lead quality by 25%',
        actionRequired: `Increase bids for "${service}" related keywords and create dedicated ad groups`
      })
    })

    // Analyze property types for targeting
    const propertyTypes = customerData.map(c => c.propertyType).filter(Boolean)
    const commercialInquiries = propertyTypes.filter(type => type.includes('Commercial')).length
    
    if (commercialInquiries > propertyTypes.length * 0.3) {
      recommendations.push({
        type: 'AD_COPY',
        priority: 'MEDIUM',
        description: 'High commercial inquiry rate detected',
        expectedImpact: 'Target commercial market more effectively',
        actionRequired: 'Create dedicated commercial cleaning ad copy and landing pages'
      })
    }

    return recommendations
  }
}

// Automation Functions
export async function automatedKeywordOptimization(customerId: string) {
  const client = new GoogleAdsClient({
    customerId,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!
  })

  const keywords = await client.getKeywords()
  const actions = []

  // Auto-pause low performing keywords
  const lowPerformers = keywords.filter(k => 
    k.impressions > 500 && 
    k.clicks < 5 && 
    k.conversions === 0
  )

  for (const keyword of lowPerformers) {
    actions.push({
      type: 'PAUSE_KEYWORD',
      keywordId: keyword.id,
      reason: 'Low performance: High impressions, low clicks, no conversions'
    })
  }

  // Increase bids for high converters
  const highConverters = keywords.filter(k => 
    k.conversions > 2 && 
    k.conversionRate > 0.05
  )

  for (const keyword of highConverters) {
    const newBid = Math.min(keyword.cpc * 1.2, keyword.cpc + 0.5) // Increase by 20% or max £0.50
    actions.push({
      type: 'INCREASE_BID',
      keywordId: keyword.id,
      newBid: newBid * 1000000, // Convert to micros
      reason: 'High conversion rate - increase bid to capture more traffic'
    })
  }

  return actions
}

export async function generateWeeklyReport(customerId: string) {
  const client = new GoogleAdsClient({
    customerId,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!
  })

  const campaigns = await client.getCampaigns()
  const keywords = await client.getKeywords()
  const recommendations = await client.generateOptimizationRecommendations()

  const totalSpend = campaigns.reduce((sum, c) => sum + c.cost, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const avgCostPerConversion = totalConversions > 0 ? totalSpend / totalConversions : 0

  return {
    summary: {
      totalSpend: `£${totalSpend.toFixed(2)}`,
      totalConversions,
      avgCostPerConversion: `£${avgCostPerConversion.toFixed(2)}`,
      activeCampaigns: campaigns.filter(c => c.status === 'ENABLED').length,
      activeKeywords: keywords.filter(k => k.impressions > 0).length
    },
    topPerformingCampaigns: campaigns
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 3),
    recommendations: recommendations.filter(r => r.priority === 'HIGH'),
    keywordOpportunities: keywords
      .filter(k => k.conversions > 0 && k.cpc < 2.0)
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 10)
  }
}

export { GoogleAdsClient }
export default GoogleAdsClient