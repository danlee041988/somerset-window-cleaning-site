/**
 * Google Ads API Route Handler
 * 
 * Provides endpoints for Google Ads management and optimization
 */

import { NextRequest, NextResponse } from 'next/server'
import { GoogleAdsClient, automatedKeywordOptimization, generateWeeklyReport } from '@/lib/google-ads'

// Initialize Google Ads client with environment variables
function createGoogleAdsClient() {
  return new GoogleAdsClient({
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID!,
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
    clientId: process.env.GOOGLE_ADS_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN!
  })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID!

    if (!customerId) {
      return NextResponse.json(
        { error: 'Google Ads customer ID not configured' },
        { status: 500 }
      )
    }

    const client = createGoogleAdsClient()

    switch (action) {
      case 'campaigns': {
        const campaigns = await client.getCampaigns()
        return NextResponse.json({ campaigns })
      }

      case 'keywords': {
        const campaignId = searchParams.get('campaignId')
        const keywords = await client.getKeywords(campaignId || undefined)
        return NextResponse.json({ keywords })
      }

      case 'performance': {
        const dateRange = searchParams.get('dateRange') || 'LAST_30_DAYS'
        const performance = await client.getPerformanceReport(dateRange)
        return NextResponse.json({ performance })
      }

      case 'recommendations': {
        const recommendations = await client.generateOptimizationRecommendations()
        const seasonalRecs = await client.optimizeForSeasonality()
        
        return NextResponse.json({ 
          recommendations: [...recommendations, ...seasonalRecs]
        })
      }

      case 'weekly-report': {
        const report = await generateWeeklyReport(customerId)
        return NextResponse.json({ report })
      }

      case 'auto-optimize': {
        const optimizations = await automatedKeywordOptimization(customerId)
        return NextResponse.json({ 
          optimizations,
          message: `Generated ${optimizations.length} optimization recommendations`
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: campaigns, keywords, performance, recommendations, weekly-report, auto-optimize' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Google Ads API error:', error)
    return NextResponse.json(
      { error: 'Google Ads API request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const body = await request.json()
    const client = createGoogleAdsClient()

    switch (action) {
      case 'update-budget': {
        const { campaignId, budgetMicros } = body
        if (!campaignId || !budgetMicros) {
          return NextResponse.json(
            { error: 'campaignId and budgetMicros are required' },
            { status: 400 }
          )
        }

        const result = await client.updateCampaignBudget(campaignId, budgetMicros)
        return NextResponse.json({ 
          success: true, 
          message: 'Campaign budget updated successfully',
          result 
        })
      }

      case 'update-keyword-bid': {
        const { adGroupId, keywordId, bidMicros } = body
        if (!adGroupId || !keywordId || !bidMicros) {
          return NextResponse.json(
            { error: 'adGroupId, keywordId, and bidMicros are required' },
            { status: 400 }
          )
        }

        const result = await client.updateKeywordBid(adGroupId, keywordId, bidMicros)
        return NextResponse.json({ 
          success: true, 
          message: 'Keyword bid updated successfully',
          result 
        })
      }

      case 'add-negative-keyword': {
        const { campaignId, keywordText, matchType } = body
        if (!campaignId || !keywordText) {
          return NextResponse.json(
            { error: 'campaignId and keywordText are required' },
            { status: 400 }
          )
        }

        const result = await client.addNegativeKeyword(campaignId, keywordText, matchType)
        return NextResponse.json({ 
          success: true, 
          message: 'Negative keyword added successfully',
          result 
        })
      }

      case 'execute-optimizations': {
        const { optimizations } = body
        if (!optimizations || !Array.isArray(optimizations)) {
          return NextResponse.json(
            { error: 'optimizations array is required' },
            { status: 400 }
          )
        }

        const results = []
        for (const optimization of optimizations) {
          try {
            switch (optimization.type) {
              case 'INCREASE_BID':
                await client.updateKeywordBid(
                  optimization.adGroupId,
                  optimization.keywordId,
                  optimization.newBid
                )
                results.push({ 
                  success: true, 
                  optimization: optimization.type,
                  keywordId: optimization.keywordId 
                })
                break

              case 'ADD_NEGATIVE_KEYWORD':
                await client.addNegativeKeyword(
                  optimization.campaignId,
                  optimization.keywordText,
                  optimization.matchType || 'BROAD'
                )
                results.push({ 
                  success: true, 
                  optimization: optimization.type,
                  keyword: optimization.keywordText 
                })
                break

              default:
                results.push({ 
                  success: false, 
                  optimization: optimization.type,
                  error: 'Unsupported optimization type' 
                })
            }
          } catch (error) {
            results.push({ 
              success: false, 
              optimization: optimization.type,
              error: error instanceof Error ? error.message : 'Unknown error' 
            })
          }
        }

        return NextResponse.json({ 
          results,
          executed: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        })
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: update-budget, update-keyword-bid, add-negative-keyword, execute-optimizations' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Google Ads API POST error:', error)
    return NextResponse.json(
      { error: 'Google Ads API request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
