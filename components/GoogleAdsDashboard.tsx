"use client"

import { useEffect, useMemo, useState, useTransition } from 'react'

type Campaign = {
  id: string
  name: string
  status: string
  channelType?: string
  budgetMicros: number
  budgetId?: string
  impressions: number
  clicks: number
  cost: number
  costMicros: number
  conversions: number
  conversionValue: number
  ctr: number
  avgCpc: number
  cpa: number | null
}

type Recommendation = {
  type: string
  description?: string
  dismissed?: boolean
  estimatedImpact?: {
    impressions?: number
    clicks?: number
    costMicros?: number
    conversions?: number
  }
}

type ApiError = {
  error?: string
  message?: string
}

const DATE_RANGES = [
  { value: 'YESTERDAY', label: 'Yesterday' },
  { value: 'LAST_7_DAYS', label: 'Last 7 days' },
  { value: 'LAST_30_DAYS', label: 'Last 30 days' },
  { value: 'THIS_MONTH', label: 'This month' },
  { value: 'LAST_MONTH', label: 'Last month' },
]

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
})

async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init)
  const json = (await response.json()) as T & ApiError

  if (!response.ok) {
    throw new Error(json.error || json.message || 'Unexpected Google Ads API error')
  }

  return json as T
}

export default function GoogleAdsDashboard() {
  const [dateRange, setDateRange] = useState<string>('LAST_30_DAYS')
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    let isCancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)

      try {
        const [campaignData, recommendationData] = await Promise.all([
          fetchJson<{ campaigns: Campaign[] }>(`/api/google-ads?action=campaigns&dateRange=${dateRange}`),
          fetchJson<{ recommendations: Recommendation[] }>(`/api/google-ads?action=recommendations`),
        ])

        if (!isCancelled) {
          setCampaigns(campaignData.campaigns || [])
          setRecommendations(recommendationData.recommendations || [])
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load Google Ads data')
          setCampaigns([])
          setRecommendations([])
        }
      } finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      isCancelled = true
    }
  }, [dateRange])

  const totals = useMemo(() => {
    const totalImpressions = campaigns.reduce((acc, campaign) => acc + campaign.impressions, 0)
    const totalClicks = campaigns.reduce((acc, campaign) => acc + campaign.clicks, 0)
    const totalConversions = campaigns.reduce((acc, campaign) => acc + campaign.conversions, 0)
    const totalSpend = campaigns.reduce((acc, campaign) => acc + campaign.cost, 0)
    const ctr = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0
    const cpc = totalClicks ? totalSpend / totalClicks : 0
    const cpa = totalConversions ? totalSpend / totalConversions : 0

    return {
      totalImpressions,
      totalClicks,
      totalConversions,
      totalSpend,
      ctr,
      cpc,
      cpa,
    }
  }, [campaigns])

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8">
        <header className="flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-white/40">Somerset Window Cleaning</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Google Ads Performance Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/60">
              Monitor live campaign performance, review optimization recommendations, and keep budgets aligned with
              lead quality goals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs uppercase tracking-[0.28em] text-white/50">Date Range</label>
            <select
              value={dateRange}
              onChange={(event) => {
                const value = event.target.value
                startTransition(() => setDateRange(value))
              }}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold tracking-[0.2em] text-white shadow-[0_18px_42px_-32px_rgba(225,29,42,0.6)] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            >
              {DATE_RANGES.map((option) => (
                <option key={option.value} value={option.value} className="bg-black text-white">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-5 text-sm text-red-200">
            <p className="font-semibold">Google Ads connection issue</p>
            <p className="mt-1 text-red-100/80">{error}</p>
            <p className="mt-3 text-xs text-red-200/70">
              Verify the Google Ads credentials in <code>.env.local</code> and confirm that the API has Basic access.
            </p>
          </div>
        ) : (
          <>
            <section className="grid gap-4 pb-6 sm:grid-cols-2 lg:grid-cols-4">
              <SummaryTile title="Spend" value={formatter.format(totals.totalSpend)} subtitle="Across selected range" loading={loading || isPending} />
              <SummaryTile title="Impressions" value={totals.totalImpressions.toLocaleString()} subtitle="All campaigns" loading={loading || isPending} />
              <SummaryTile title="Clicks" value={totals.totalClicks.toLocaleString()} subtitle={`CTR ${(totals.ctr || 0).toFixed(2)}%`} loading={loading || isPending} />
              <SummaryTile title="Conversions" value={totals.totalConversions.toLocaleString()} subtitle={`CPA ${totals.cpa ? formatter.format(totals.cpa) : '—'}`} loading={loading || isPending} />
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)]">
              <div className="flex flex-col gap-2 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">Campaign snapshot</h2>
                  <p className="text-sm text-white/60">Key metrics for the selected date range</p>
                </div>
                <p className="text-xs uppercase tracking-[0.32em] text-white/40">Sorted by spend</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/5 text-sm">
                  <thead className="text-xs uppercase tracking-[0.28em] text-white/40">
                    <tr>
                      <th className="py-3 pr-6 text-left">Campaign</th>
                      <th className="py-3 pr-6 text-left">Status</th>
                      <th className="py-3 pr-6 text-left">Spend</th>
                      <th className="py-3 pr-6 text-left">Impr.</th>
                      <th className="py-3 pr-6 text-left">Clicks</th>
                      <th className="py-3 pr-6 text-left">CTR</th>
                      <th className="py-3 pr-6 text-left">Conv.</th>
                      <th className="py-3 pr-6 text-left">CPA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {(loading || isPending) && campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-white/50">
                          Loading campaign metrics…
                        </td>
                      </tr>
                    ) : campaigns.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-white/50">
                          No campaign data returned for the selected date range.
                        </td>
                      </tr>
                    ) : (
                      campaigns
                        .slice()
                        .sort((a, b) => b.cost - a.cost)
                        .map((campaign) => (
                          <tr key={campaign.id}>
                            <td className="py-3 pr-6 font-medium text-white/90">{campaign.name}</td>
                            <td className="py-3 pr-6">
                              <StatusBadge status={campaign.status} />
                            </td>
                            <td className="py-3 pr-6">{formatter.format(campaign.cost)}</td>
                            <td className="py-3 pr-6">{campaign.impressions.toLocaleString()}</td>
                            <td className="py-3 pr-6">{campaign.clicks.toLocaleString()}</td>
                            <td className="py-3 pr-6">{(campaign.ctr * 100).toFixed(2)}%</td>
                            <td className="py-3 pr-6">{campaign.conversions.toLocaleString()}</td>
                            <td className="py-3 pr-6">{campaign.cpa ? formatter.format(campaign.cpa) : '—'}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-8 grid gap-5 lg:grid-cols-[2fr_1fr]">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)]">
                <div className="flex items-center justify-between pb-4">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">Optimization opportunities</h2>
                    <p className="text-sm text-white/60">Blend of Google recommendations and custom Somerset rules</p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-white/40">
                    {recommendations.length} items
                  </span>
                </div>

                <div className="space-y-4">
                  {loading && recommendations.length === 0 ? (
                    <div className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/60">
                      Analysing account performance…
                    </div>
                  ) : recommendations.length === 0 ? (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                      All clear! No new recommendations for this period.
                    </div>
                  ) : (
                    recommendations.slice(0, 6).map((item, index) => (
                      <article
                        key={`${item.type}-${index}`}
                        className="rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white/80"
                      >
                        <p className="text-xs uppercase tracking-[0.28em] text-white/40">{item.type.replace(/_/g, ' ')}</p>
                        {item.description && <p className="mt-2 text-sm text-white/80">{item.description}</p>}
                        {item.estimatedImpact && (
                          <dl className="mt-3 grid grid-cols-2 gap-3 text-xs text-white/50 md:grid-cols-4">
                            {item.estimatedImpact.impressions !== undefined && (
                              <div>
                                <dt className="uppercase tracking-[0.28em]">Impr.</dt>
                                <dd>{item.estimatedImpact.impressions.toLocaleString()}</dd>
                              </div>
                            )}
                            {item.estimatedImpact.clicks !== undefined && (
                              <div>
                                <dt className="uppercase tracking-[0.28em]">Clicks</dt>
                                <dd>{item.estimatedImpact.clicks.toLocaleString()}</dd>
                              </div>
                            )}
                            {item.estimatedImpact.costMicros !== undefined && (
                              <div>
                                <dt className="uppercase tracking-[0.28em]">Spend</dt>
                                <dd>{formatter.format(item.estimatedImpact.costMicros / 1_000_000)}</dd>
                              </div>
                            )}
                            {item.estimatedImpact.conversions !== undefined && (
                              <div>
                                <dt className="uppercase tracking-[0.28em]">Conv.</dt>
                                <dd>{item.estimatedImpact.conversions.toLocaleString()}</dd>
                              </div>
                            )}
                          </dl>
                        )}
                      </article>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)]">
                  <h2 className="text-lg font-semibold tracking-tight">Action checklist</h2>
                  <ul className="mt-3 space-y-2 text-sm text-white/70">
                    <li>• Review campaigns with CPA above £80 and tighten location targeting.</li>
                    <li>• Refresh ad copy for campaigns with CTR below 1%.</li>
                    <li>• Validate seasonal bid adjustments for gutter and spring cleaning terms.</li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 text-sm text-white/70 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)]">
                  <h3 className="text-lg font-semibold tracking-tight text-white">Quick tips</h3>
                  <p className="mt-2 text-white/60">
                    Need to make a manual change? Use the API tools below or run <code className="rounded bg-white/10 px-1">node scripts/google-ads-automation.cjs</code> for a rules-based pass.
                  </p>
                  <div className="mt-4 space-y-2 text-xs uppercase tracking-[0.32em] text-white/40">
                    <p>API endpoints</p>
                    <p className="font-mono text-[0.7rem] text-white/70">GET /api/google-ads?action=campaigns</p>
                    <p className="font-mono text-[0.7rem] text-white/70">POST /api/google-ads?action=update-budget</p>
                    <p className="font-mono text-[0.7rem] text-white/70">GET /api/google-ads?action=recommendations</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

type SummaryTileProps = {
  title: string
  value: string
  subtitle: string
  loading?: boolean
}

function SummaryTile({ title, value, subtitle, loading }: SummaryTileProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)]">
      <p className="text-xs uppercase tracking-[0.32em] text-white/40">{title}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
        {loading ? <span className="text-white/50">…</span> : value}
      </p>
      <p className="mt-1 text-xs text-white/50">{subtitle}</p>
    </div>
  )
}

type StatusBadgeProps = {
  status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
  const normalised = status?.toUpperCase?.() ?? 'UNKNOWN'

  const colours: Record<string, string> = {
    ENABLED: 'bg-emerald-500/15 text-emerald-200 border border-emerald-400/30',
    PAUSED: 'bg-amber-500/15 text-amber-200 border border-amber-400/30',
    REMOVED: 'bg-red-500/15 text-red-200 border border-red-400/30',
  }

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] ${colours[normalised] || 'bg-white/10 text-white/60 border border-white/15'}`}>
      {normalised}
    </span>
  )
}
