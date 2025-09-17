"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface CampaignData {
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

interface KeywordData {
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

interface OptimizationRecommendation {
  type: 'KEYWORD_BID' | 'NEGATIVE_KEYWORD' | 'AD_COPY' | 'BUDGET'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  description: string
  expectedImpact: string
  actionRequired: string
}

export default function GoogleAdsDashboard() {
  const [campaigns, setCampaigns] = useState<CampaignData[]>([])
  const [keywords, setKeywords] = useState<KeywordData[]>([])
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [optimizing, setOptimizing] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [campaignsRes, keywordsRes, recommendationsRes] = await Promise.all([
        fetch('/api/google-ads?action=campaigns'),
        fetch('/api/google-ads?action=keywords'),
        fetch('/api/google-ads?action=recommendations')
      ])

      if (!campaignsRes.ok || !keywordsRes.ok || !recommendationsRes.ok) {
        throw new Error('Failed to load Google Ads data')
      }

      const [campaignsData, keywordsData, recommendationsData] = await Promise.all([
        campaignsRes.json(),
        keywordsRes.json(),
        recommendationsRes.json()
      ])

      setCampaigns(campaignsData.campaigns || [])
      setKeywords(keywordsData.keywords || [])
      setRecommendations(recommendationsData.recommendations || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const runOptimization = async () => {
    try {
      setOptimizing(true)
      const response = await fetch('/api/google-ads?action=auto-optimize')
      
      if (!response.ok) {
        throw new Error('Optimization failed')
      }

      const data = await response.json()
      
      // Show success message or update UI
      alert(`Generated ${data.optimizations?.length || 0} optimization recommendations`)
      
      // Reload data to show updated information
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed')
    } finally {
      setOptimizing(false)
    }
  }

  const executeRecommendation = async (recommendation: OptimizationRecommendation) => {
    try {
      // This would implement the actual execution of recommendations
      // For now, just show an alert
      alert(`Would execute: ${recommendation.actionRequired}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute recommendation')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="animate-pulse">Loading Google Ads data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="text-red-400">Error: {error}</div>
        <Button onClick={loadData} className="mt-4">Retry</Button>
      </div>
    )
  }

  // Calculate totals
  const totalSpend = campaigns.reduce((sum, c) => sum + c.cost, 0)
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0)
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0)
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0)
  const avgCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0
  const avgCostPerConversion = totalConversions > 0 ? totalSpend / totalConversions : 0

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Google Ads Dashboard</h1>
          <p className="text-white/70">Somerset Window Cleaning - Performance & Optimization</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/10 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Total Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">£{totalSpend.toFixed(2)}</div>
              <p className="text-xs text-white/50">Last 30 days</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalConversions}</div>
              <p className="text-xs text-white/50">
                £{avgCostPerConversion.toFixed(2)} avg cost
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Click Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{avgCtr.toFixed(2)}%</div>
              <p className="text-xs text-white/50">{totalClicks.toLocaleString()} clicks</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {campaigns.filter(c => c.status === 'ENABLED').length}
              </div>
              <p className="text-xs text-white/50">of {campaigns.length} total</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="bg-white/10 border-white/10">
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-[var(--brand-red)]">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="keywords" className="data-[state=active]:bg-[var(--brand-red)]">
              Keywords
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-[var(--brand-red)]">
              Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns">
            <Card className="bg-white/10 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">{campaign.name}</h3>
                          <Badge 
                            variant={campaign.status === 'ENABLED' ? 'default' : 'secondary'}
                            className={campaign.status === 'ENABLED' ? 'bg-green-600' : ''}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/70">Spend:</span>
                            <span className="ml-2 text-white">£{campaign.cost.toFixed(2)}</span>
                          </div>
                          <div>
                            <span className="text-white/70">Conversions:</span>
                            <span className="ml-2 text-white">{campaign.conversions}</span>
                          </div>
                          <div>
                            <span className="text-white/70">CTR:</span>
                            <span className="ml-2 text-white">{(campaign.ctr * 100).toFixed(2)}%</span>
                          </div>
                          <div>
                            <span className="text-white/70">CPC:</span>
                            <span className="ml-2 text-white">£{campaign.cpc.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="keywords">
            <Card className="bg-white/10 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Top Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keywords.slice(0, 20).map((keyword) => (
                    <div
                      key={keyword.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium text-white">{keyword.text}</h3>
                          <Badge variant="outline" className="text-white/70 border-white/20">
                            {keyword.matchType}
                          </Badge>
                          <Badge 
                            variant={keyword.qualityScore >= 7 ? 'default' : keyword.qualityScore >= 5 ? 'secondary' : 'destructive'}
                            className={
                              keyword.qualityScore >= 7 ? 'bg-green-600' : 
                              keyword.qualityScore >= 5 ? 'bg-yellow-600' : 'bg-red-600'
                            }
                          >
                            QS: {keyword.qualityScore}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-white/70">Impressions:</span>
                            <span className="ml-2 text-white">{keyword.impressions.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-white/70">Clicks:</span>
                            <span className="ml-2 text-white">{keyword.clicks}</span>
                          </div>
                          <div>
                            <span className="text-white/70">Conversions:</span>
                            <span className="ml-2 text-white">{keyword.conversions}</span>
                          </div>
                          <div>
                            <span className="text-white/70">CPC:</span>
                            <span className="ml-2 text-white">£{keyword.cpc.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations">
            <Card className="bg-white/10 border-white/10">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Optimization Recommendations</CardTitle>
                <Button 
                  onClick={runOptimization}
                  disabled={optimizing}
                  className="bg-[var(--brand-red)] hover:opacity-90"
                >
                  {optimizing ? 'Running...' : 'Run Auto-Optimization'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border-l-4 border-l-brand-red"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge 
                            variant={rec.priority === 'HIGH' ? 'destructive' : rec.priority === 'MEDIUM' ? 'secondary' : 'outline'}
                            className={
                              rec.priority === 'HIGH' ? 'bg-red-600' : 
                              rec.priority === 'MEDIUM' ? 'bg-yellow-600' : ''
                            }
                          >
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline" className="text-white/70 border-white/20">
                            {rec.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => executeRecommendation(rec)}
                          className="bg-[var(--brand-red)] hover:opacity-90"
                        >
                          Execute
                        </Button>
                      </div>
                      <h3 className="font-medium text-white mb-2">{rec.description}</h3>
                      <p className="text-sm text-white/70 mb-2">
                        <strong>Expected Impact:</strong> {rec.expectedImpact}
                      </p>
                      <p className="text-sm text-white/70">
                        <strong>Action Required:</strong> {rec.actionRequired}
                      </p>
                    </div>
                  ))}
                  {recommendations.length === 0 && (
                    <div className="text-center py-8 text-white/70">
                      No optimization recommendations at this time.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}