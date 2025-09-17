"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
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
  const [query, setQuery] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(false)

  const filtered = React.useMemo(() => {
    const trimmed = normalize(query)
    if (!trimmed) {
      return areas.slice(0, 8)
    }

    const primaryToken = trimmed.split(/\s+/)[0] || ''
    const primaryCompact = compact(primaryToken)
    const fullCompact = compact(trimmed)

    return areas
      .filter((area) => {
        const haystack = [area.prefix, area.code, area.town, area.keywords].join(' ').toLowerCase()

        if (haystack.includes(trimmed) || (primaryToken && haystack.includes(primaryToken))) {
          return true
        }

        return area.searchTokens.some((token) => {
          if (!token) return false
          return (
            token.startsWith(primaryCompact) ||
            primaryCompact.startsWith(token) ||
            (fullCompact && token.startsWith(fullCompact)) ||
            (fullCompact && fullCompact.startsWith(token))
          )
        })
      })
      .slice(0, 10)
  }, [areas, query])

  const handleSelect = (area: FlattenedArea) => {
    setQuery('')
    setIsFocused(false)

    if (area.href) {
      router.push(area.href)
      return
    }

    const targetId = buildAreaDomId(area.prefix, area.code)

    if (typeof window !== 'undefined') {
      const isAreasPage = window.location.pathname.startsWith('/areas')

      if (isAreasPage) {
        const target = document.getElementById(targetId)
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return
        }
      }

      router.push(`/areas#${targetId}`)
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
          onBlur={() => {
            setTimeout(() => setIsFocused(false), 125)
          }}
        />

        {(isFocused || query) && filtered.length > 0 && (
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

        {(isFocused || query) && filtered.length === 0 && (
          <div className="absolute z-10 mt-2 w-full rounded-xl border border-red-500/40 bg-black/90 px-4 py-3 text-sm text-red-300">
            No matches found. Try a different postcode or town name.
          </div>
        )}
      </div>
    </div>
  )
}
