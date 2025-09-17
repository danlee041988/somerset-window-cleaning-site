/**
 * Google Ads Integration with Notion and GA4
 * 
 * Connects Google Ads optimization with customer data from Notion
 * and performance data from Google Analytics 4
 */

import { GoogleAdsClient } from './google-ads'

// Types for integration data
export interface NotionCustomerData {
  id: string
  name: string
  email: string
  services: string[]
  propertyType: string
  customerType: 'New' | 'Existing'
  propertySize: string
  location: string
  status: 'New Lead' | 'Contacted' | 'Booked' | 'Completed'
  acquisitionDate: string
  totalValue?: number
}

export interface GA4ConversionData {
  eventName: string
  eventCount: number
  conversionRate: number
  averageValue: number
  topSources: { source: string; conversions: number }[]
  topPages: { page: string; conversions: number }[]
}

export interface IntegratedOptimization {
  type: 'KEYWORD_BID' | 'NEGATIVE_KEYWORD' | 'AD_COPY' | 'BUDGET' | 'TARGETING'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  dataSource: 'NOTION' | 'GA4' | 'COMBINED'
  expectedImpact: string
  actionRequired: string
  supportingData: any
}

export class GoogleAdsIntegration {
  private googleAds: GoogleAdsClient

  constructor(googleAdsConfig: any) {
    this.googleAds = new GoogleAdsClient(googleAdsConfig)
  }

  /**
   * Analyze Notion customer data to generate Google Ads optimizations
   */
  async optimizeBasedOnNotionData(customers: NotionCustomerData[]): Promise<IntegratedOptimization[]> {
    const optimizations: IntegratedOptimization[] = []

    // Analyze service popularity
    const serviceAnalysis = this.analyzeServiceDemand(customers)
    optimizations.push(...this.generateServiceOptimizations(serviceAnalysis))

    // Analyze customer acquisition patterns
    const acquisitionAnalysis = this.analyzeCustomerAcquisition(customers)
    optimizations.push(...this.generateAcquisitionOptimizations(acquisitionAnalysis))

    // Analyze geographic performance
    const geoAnalysis = this.analyzeGeographicPerformance(customers)
    optimizations.push(...this.generateGeographicOptimizations(geoAnalysis))

    // Analyze customer value
    const valueAnalysis = this.analyzeCustomerValue(customers)
    optimizations.push(...this.generateValueOptimizations(valueAnalysis))

    return optimizations
  }

  /**
   * Analyze GA4 data to generate Google Ads optimizations
   */
  async optimizeBasedOnGA4Data(ga4Data: GA4ConversionData): Promise<IntegratedOptimization[]> {
    const optimizations: IntegratedOptimization[] = []

    // Optimize based on conversion sources
    if (ga4Data.topSources) {
      optimizations.push(...this.generateSourceOptimizations(ga4Data.topSources))
    }

    // Optimize based on landing page performance
    if (ga4Data.topPages) {
      optimizations.push(...this.generateLandingPageOptimizations(ga4Data.topPages))
    }

    // Optimize based on conversion rates
    if (ga4Data.conversionRate) {
      optimizations.push(...this.generateConversionRateOptimizations(ga4Data))
    }

    return optimizations
  }

  /**
   * Combine Notion and GA4 data for comprehensive optimization
   */
  async generateCombinedOptimizations(
    customers: NotionCustomerData[], 
    ga4Data: GA4ConversionData
  ): Promise<IntegratedOptimization[]> {
    const optimizations: IntegratedOptimization[] = []

    // Cross-reference high-value services with GA4 performance
    const highValueServices = this.identifyHighValueServices(customers)
    const topPerformingPages = ga4Data.topPages || []

    highValueServices.forEach(service => {
      const matchingPage = topPerformingPages.find(page => 
        page.page.includes(service.toLowerCase().replace(/\s+/g, '-'))
      )

      if (matchingPage) {
        optimizations.push({
          type: 'KEYWORD_BID',
          priority: 'HIGH',
          description: `${service} shows high customer value and strong landing page performance`,
          dataSource: 'COMBINED',
          expectedImpact: 'Increase high-value leads by 25-40%',
          actionRequired: `Increase bids for "${service}" keywords by 30% and create dedicated ad groups`,
          supportingData: {
            notionData: { service, customerCount: customers.filter(c => c.services.includes(service)).length },
            ga4Data: { page: matchingPage.page, conversions: matchingPage.conversions }
          }
        })
      }
    })

    // Identify underperforming areas
    const lowConversionPages = topPerformingPages.filter(page => page.conversions < 2)
    lowConversionPages.forEach(page => {
      optimizations.push({
        type: 'AD_COPY',
        priority: 'MEDIUM',
        description: `Landing page ${page.page} has low conversion rate`,
        dataSource: 'COMBINED',
        expectedImpact: 'Improve page conversion rate by 15-25%',
        actionRequired: 'Optimize ad copy to better match landing page content and user intent',
        supportingData: { ga4Data: page }
      })
    })

    return optimizations
  }

  // Helper methods for analysis

  private analyzeServiceDemand(customers: NotionCustomerData[]) {
    const serviceCounts = customers.reduce((acc, customer) => {
      customer.services.forEach(service => {
        acc[service] = (acc[service] || 0) + 1
      })
      return acc
    }, {} as Record<string, number>)

    return Object.entries(serviceCounts)
      .map(([service, count]) => ({ service, count, percentage: (count / customers.length) * 100 }))
      .sort((a, b) => b.count - a.count)
  }

  private generateServiceOptimizations(serviceAnalysis: any[]): IntegratedOptimization[] {
    const optimizations: IntegratedOptimization[] = []

    // Top 3 services get increased focus
    serviceAnalysis.slice(0, 3).forEach((service, index) => {
      optimizations.push({
        type: 'KEYWORD_BID',
        priority: index === 0 ? 'HIGH' : 'MEDIUM',
        description: `${service.service} represents ${service.percentage.toFixed(1)}% of customer inquiries`,
        dataSource: 'NOTION',
        expectedImpact: 'Align ad spend with actual demand patterns',
        actionRequired: `Increase keyword bids for "${service.service}" by ${20 + (3 - index) * 5}%`,
        supportingData: service
      })
    })

    // Services with low demand might need negative keywords
    const lowDemandServices = serviceAnalysis.filter(s => s.percentage < 5)
    if (lowDemandServices.length > 0) {
      optimizations.push({
        type: 'NEGATIVE_KEYWORD',
        priority: 'LOW',
        description: `Some services have very low demand (${lowDemandServices.map(s => s.service).join(', ')})`,
        dataSource: 'NOTION',
        expectedImpact: 'Reduce wasted spend on low-demand services',
        actionRequired: 'Consider adding negative keywords or reducing bids for underperforming service keywords',
        supportingData: lowDemandServices
      })
    }

    return optimizations
  }

  private analyzeCustomerAcquisition(customers: NotionCustomerData[]) {
    const newCustomers = customers.filter(c => c.customerType === 'New')
    const existingCustomers = customers.filter(c => c.customerType === 'Existing')

    return {
      newCustomerRate: (newCustomers.length / customers.length) * 100,
      averageNewCustomersPerMonth: this.calculateMonthlyAcquisition(newCustomers),
      customerLifetimeValue: this.calculateLifetimeValue(existingCustomers)
    }
  }

  private generateAcquisitionOptimizations(acquisitionData: any): IntegratedOptimization[] {
    const optimizations: IntegratedOptimization[] = []

    if (acquisitionData.newCustomerRate > 70) {
      optimizations.push({
        type: 'AD_COPY',
        priority: 'HIGH',
        description: `High new customer rate (${acquisitionData.newCustomerRate.toFixed(1)}%) indicates strong acquisition focus needed`,
        dataSource: 'NOTION',
        expectedImpact: 'Optimize for customer acquisition and first-time service messaging',
        actionRequired: 'Create ad copy focused on "first time customer offers" and "new customer discounts"',
        supportingData: acquisitionData
      })
    }

    return optimizations
  }

  private analyzeGeographicPerformance(customers: NotionCustomerData[]) {
    const locationCounts = customers.reduce((acc, customer) => {
      if (customer.location) {
        acc[customer.location] = (acc[customer.location] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
  }

  private generateGeographicOptimizations(geoData: any[]): IntegratedOptimization[] {
    const optimizations: IntegratedOptimization[] = []

    if (geoData.length > 0) {
      const topLocation = geoData[0]
      optimizations.push({
        type: 'TARGETING',
        priority: 'MEDIUM',
        description: `${topLocation.location} shows highest customer concentration (${topLocation.count} customers)`,
        dataSource: 'NOTION',
        expectedImpact: 'Focus ad spend on high-performing geographic areas',
        actionRequired: `Increase location bid adjustments for ${topLocation.location} and similar areas`,
        supportingData: geoData.slice(0, 5)
      })
    }

    return optimizations
  }

  private analyzeCustomerValue(customers: NotionCustomerData[]) {
    const completedCustomers = customers.filter(c => c.status === 'Completed' && c.totalValue)
    const averageValue = completedCustomers.reduce((sum, c) => sum + (c.totalValue || 0), 0) / completedCustomers.length

    return {
      averageValue,
      highValueCustomers: completedCustomers.filter(c => (c.totalValue || 0) > averageValue * 1.5),
      completionRate: (completedCustomers.length / customers.length) * 100
    }
  }

  private generateValueOptimizations(valueData: any): IntegratedOptimization[] {
    const optimizations: IntegratedOptimization[] = []

    if (valueData.averageValue > 0) {
      optimizations.push({
        type: 'BUDGET',
        priority: 'HIGH',
        description: `Average customer value is £${valueData.averageValue.toFixed(2)} with ${valueData.completionRate.toFixed(1)}% completion rate`,
        dataSource: 'NOTION',
        expectedImpact: 'Optimize bidding based on true customer lifetime value',
        actionRequired: `Set target CPA to £${(valueData.averageValue * 0.3).toFixed(2)} (30% of average customer value)`,
        supportingData: valueData
      })
    }

    return optimizations
  }

  private generateSourceOptimizations(topSources: any[]): IntegratedOptimization[] {
    const optimizations: IntegratedOptimization[] = []

    const topSource = topSources[0]
    if (topSource) {
      optimizations.push({
        type: 'BUDGET',
        priority: 'HIGH',
        description: `${topSource.source} is the top conversion source with ${topSource.conversions} conversions`,
        dataSource: 'GA4',
        expectedImpact: 'Allocate more budget to high-performing traffic sources',
        actionRequired: `Increase bids for ${topSource.source} by 25% and analyze keywords driving this traffic`,
        supportingData: topSources
      })
    }

    return optimizations
  }

  private generateLandingPageOptimizations(topPages: any[]): IntegratedOptimization[] {
    const optimizations: IntegratedOptimization[] = []

    const bestPage = topPages[0]
    if (bestPage) {
      optimizations.push({
        type: 'AD_COPY',
        priority: 'MEDIUM',
        description: `Landing page ${bestPage.page} has ${bestPage.conversions} conversions`,
        dataSource: 'GA4',
        expectedImpact: 'Align ad messaging with top-converting landing pages',
        actionRequired: 'Create ad copy that matches the messaging and value propositions on top-performing pages',
        supportingData: topPages
      })
    }

    return optimizations
  }

  private generateConversionRateOptimizations(ga4Data: GA4ConversionData): IntegratedOptimization[] {
    const optimizations: IntegratedOptimization[] = []

    if (ga4Data.conversionRate < 2) {
      optimizations.push({
        type: 'AD_COPY',
        priority: 'HIGH',
        description: `Overall conversion rate is low at ${ga4Data.conversionRate.toFixed(2)}%`,
        dataSource: 'GA4',
        expectedImpact: 'Improve traffic quality and landing page relevance',
        actionRequired: 'Review ad copy for relevance and ensure ads match landing page content',
        supportingData: ga4Data
      })
    }

    return optimizations
  }

  // Utility methods
  private identifyHighValueServices(customers: NotionCustomerData[]): string[] {
    const serviceValues = customers.reduce((acc, customer) => {
      if (customer.totalValue) {
        customer.services.forEach(service => {
          if (!acc[service]) acc[service] = { total: 0, count: 0 }
          acc[service].total += customer.totalValue!
          acc[service].count += 1
        })
      }
      return acc
    }, {} as Record<string, { total: number; count: number }>)

    return Object.entries(serviceValues)
      .map(([service, data]) => ({ service, avgValue: data.total / data.count }))
      .sort((a, b) => b.avgValue - a.avgValue)
      .slice(0, 3)
      .map(item => item.service)
  }

  private calculateMonthlyAcquisition(customers: NotionCustomerData[]): number {
    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    
    const recentCustomers = customers.filter(c => 
      new Date(c.acquisitionDate) >= oneMonthAgo
    )
    
    return recentCustomers.length
  }

  private calculateLifetimeValue(customers: NotionCustomerData[]): number {
    const customersWithValue = customers.filter(c => c.totalValue)
    if (customersWithValue.length === 0) return 0
    
    return customersWithValue.reduce((sum, c) => sum + (c.totalValue || 0), 0) / customersWithValue.length
  }
}

export default GoogleAdsIntegration