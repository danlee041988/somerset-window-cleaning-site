"use client"

import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { buildAreaDomId, type FlattenedArea } from '@/content/service-areas'

interface AreaComboboxProps {
  areas: FlattenedArea[]
  containerClassName?: string
  placeholder?: string
  showLabel?: boolean
  inputId?: string
}

const normalize = (value: string) => value.trim().toLowerCase()
const compact = (value: string) => normalize(value).replace(/\s+/g, '')

export default function AreaCombobox({ areas, containerClassName, placeholder = 'Search by postcode or town', showLabel = true, inputId = 'area-search' }: AreaComboboxProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)
  const [selectedArea, setSelectedArea] = React.useState<FlattenedArea | null>(null)
  const redirectTimeoutRef = React.useRef<number | null>(null)

  React.useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current)
      }
    }
  }, [])

  React.useEffect(() => {
    // Close any open suggestions when navigating between pages via the header
    setIsFocused(false)
    setQuery('')
    setSelectedArea(null)

    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current)
      redirectTimeoutRef.current = null
    }
  }, [pathname])

  const filtered = React.useMemo(() => {
    const trimmed = normalize(query)
    if (!trimmed) {
      return []
    }

    const primaryToken = trimmed.split(/\s+/)[0] || ''
    const primaryCompact = compact(primaryToken)
    const fullCompact = compact(trimmed)

    type ScoredArea = { area: FlattenedArea; score: number; index: number }

    const scored = areas
      .map<ScoredArea | null>((area, index) => {
        const haystack = [area.prefix, area.code, area.town, area.keywords].join(' ').toLowerCase()
        const normalizedTown = area.town.toLowerCase()
        const normalizedPrefix = area.prefix.toLowerCase()
        const tokens = area.searchTokens

        const exactFullMatch = Boolean(fullCompact && tokens.includes(fullCompact))
        const exactPrimaryMatch = Boolean(
          primaryCompact && fullCompact !== primaryCompact && tokens.includes(primaryCompact)
        )
        const tokenStartsWithQuery = Boolean(fullCompact && tokens.some((token) => token?.startsWith(fullCompact)))
        const queryStartsWithToken = Boolean(
          fullCompact && tokens.some((token) => token && token.length > 1 && fullCompact.startsWith(token))
        )
        const townExactMatch = Boolean(trimmed && normalizedTown === trimmed)
        const townStartsWithQuery = Boolean(trimmed && normalizedTown.startsWith(trimmed))
        const prefixExactMatch = Boolean(primaryCompact && normalizedPrefix === primaryCompact)
        const prefixStartsWithQuery = Boolean(
          primaryCompact && primaryCompact.length > 1 && normalizedPrefix.startsWith(primaryCompact)
        )
        const haystackIncludes = Boolean(trimmed && haystack.includes(trimmed))
        const haystackIncludesPrimary = Boolean(
          primaryToken && primaryToken !== trimmed && haystack.includes(primaryToken)
        )

        if (
          !exactFullMatch &&
          !exactPrimaryMatch &&
          !tokenStartsWithQuery &&
          !queryStartsWithToken &&
          !townExactMatch &&
          !townStartsWithQuery &&
          !prefixExactMatch &&
          !prefixStartsWithQuery &&
          !haystackIncludes &&
          !haystackIncludesPrimary
        ) {
          return null
        }

        let score = 0
        if (exactFullMatch) score += 1000
        if (exactPrimaryMatch) score += 900
        if (townExactMatch) score += 850
        if (tokenStartsWithQuery) score += 750
        if (townStartsWithQuery) score += 650
        if (prefixExactMatch) score += 400
        if (prefixStartsWithQuery) score += 250
        if (queryStartsWithToken) score += 120
        if (haystackIncludes) score += 150
        if (haystackIncludesPrimary) score += 100

        score += Math.min(trimmed.length, 8)

        return { area, score, index }
      })
      .filter((entry): entry is ScoredArea => Boolean(entry))

    return scored
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score
        }
        return a.index - b.index
      })
      .slice(0, 10)
      .map((entry) => entry.area)
  }, [areas, query])

  const handleSelect = (area: FlattenedArea) => {
    setQuery('')
    setIsFocused(false)
    setSelectedArea(area)

    const targetId = buildAreaDomId(area.prefix, area.code)

    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current)
    }

    const primaryCode = area.code.split('/')[0]?.trim() || ''
    const compactPrimary = primaryCode.replace(/\s+/g, '')
    const normalizedCode = /^[A-Z]/i.test(compactPrimary)
      ? compactPrimary
      : `${area.prefix}${compactPrimary}`

    const params = new URLSearchParams()
    if (normalizedCode) params.set('postcode', normalizedCode.toUpperCase())
    if (area.town) params.set('area', area.town)

    redirectTimeoutRef.current = window.setTimeout(() => {
      router.push(`/book-appointment?intent=quote&${params.toString()}`)
      redirectTimeoutRef.current = null
      setSelectedArea(null)
    }, 1200)

    if (typeof window !== 'undefined') {
      const isAreasPage = window.location.pathname.startsWith('/areas')
      if (isAreasPage) {
        const target = document.getElementById(targetId)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }

  return (
    <div className={cn('w-full max-w-2xl', containerClassName)}>
      <div className="relative">
        {showLabel && (
          <label htmlFor={inputId} className="block text-sm font-medium text-white/80 mb-2 text-center">
            Search by postcode or town
          </label>
        )}
        <input
          id={inputId}
          type="search"
          autoComplete="off"
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-white/50 focus:border-brand-red focus:outline-none focus:ring-2 focus:ring-brand-red/30"
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              const firstMatch = filtered[0]
              if (firstMatch) {
                handleSelect(firstMatch)
              }
            }
          }}
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 125)
          }}
        />

        {isFocused && filtered.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl">
            {filtered.map((area) => (
              <li key={area.id}>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => handleSelect(area)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm text-white/80 hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                >
                  <span className="font-mono text-xs font-semibold text-brand-red/90 min-w-[68px]">{area.code}</span>
                  <span className="flex-1">
                    <span className="block font-medium text-white">{area.town}</span>
                    {area.keywords && <span className="text-xs text-white/60">{area.keywords}</span>}
                  </span>
                  <span className="text-xs text-white/40">{area.prefix}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {query && filtered.length === 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-xl border border-red-500/40 bg-black/90 px-4 py-3 text-sm text-red-300">
            No matches found. Try a different postcode or town name.
          </div>
        )}
      </div>

      {selectedArea && (
        <div className="mt-3 rounded-lg border border-green-500/30 bg-green-500/15 px-4 py-3 text-sm text-green-200 animate-fadeIn">
          <span className="font-semibold text-green-100">Yes!</span> We cover {selectedArea.town}. Redirecting to the quote form...
        </div>
      )}
    </div>
  )
}
