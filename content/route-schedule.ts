const monthMap: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

export type FrequencyId = 'north' | 'east' | 'south' | 'west'

export interface FrequencyDate {
  iso: string
  label: string
}

export interface FrequencyDay {
  day: string
  postcodes: string[]
  areas: string
  dates: FrequencyDate[]
}

export interface FrequencyCalendarEntry {
  id: FrequencyId
  title: string
  strapline: string
  summary: string
  days: FrequencyDay[]
}

export interface FrequencyMatch {
  day: string
  areas: string
  postcodes: string[]
  dates: FrequencyDate[]
}

export interface FrequencyLookupResult {
  code: string
  frequencyId: FrequencyId
  frequencyTitle: string
  strapline: string
  summary: string
  matches: FrequencyMatch[]
}

interface DateSeriesConfig {
  startYear: number
  labels: string[]
}

const createDateEntries = ({ startYear, labels }: DateSeriesConfig): FrequencyDate[] => {
  let currentYear = startYear
  let previousMonth = -1

  return labels.map((raw) => {
    const [dayPart, monthPart] = raw.split(' ')
    const month = monthMap[monthPart as keyof typeof monthMap]
    if (month === undefined) {
      throw new Error(`Unknown month label: ${raw}`)
    }

    if (previousMonth !== -1 && month < previousMonth) {
      currentYear += 1
    }
    previousMonth = month

    const day = Number.parseInt(dayPart, 10)
    const date = new Date(Date.UTC(currentYear, month, day))
    const iso = date.toISOString().split('T')[0]
    const label = date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

    return { iso, label }
  })
}

const createDay = (
  day: string,
  postcodes: string[],
  areas: string,
  labels: string[],
): FrequencyDay => ({
  day,
  postcodes,
  areas,
  dates: createDateEntries({ startYear: 2025, labels }),
})

export const WINDOW_FREQUENCY_CALENDAR: FrequencyCalendarEntry[] = [
  {
    id: 'north',
    title: 'North Somerset window cleaning schedule',
    strapline: 'Next visit dates',
    summary: 'Window cleaning frequency covering Weston-super-Mare, Backwell, Yatton, Clevedon, Banwell, Winscombe, Axbridge & Cheddar.',
    days: [
      createDay('Monday', ['BS40', 'BS48', 'BS49', 'BS22', 'BS23', 'BS24', 'BS21'], 'Weston, Backwell, Blagdon, Yatton, Clevedon', ['12 May', '09 Jun', '07 Jul', '04 Aug', '01 Sep', '29 Sep', '27 Oct', '24 Nov', '22 Dec', '19 Jan', '16 Feb', '16 Mar', '13 Apr', '11 May']),
      createDay('Tuesday', ['BS25', 'BS29'], 'Banwell, Winscombe', ['13 May', '10 Jun', '08 Jul', '05 Aug', '02 Sep', '30 Sep', '28 Oct', '25 Nov', '23 Dec', '20 Jan', '17 Feb', '17 Mar', '14 Apr', '12 May']),
      createDay('Wednesday', ['BS26'], 'Axbridge', ['14 May', '11 Jun', '09 Jul', '06 Aug', '03 Sep', '01 Oct', '29 Oct', '26 Nov', '24 Dec', '21 Jan', '18 Feb', '18 Mar', '15 Apr', '13 May']),
      createDay('Thursday', ['BS26', 'BS27'], 'Axbridge & Cheddar', ['15 May', '12 Jun', '10 Jul', '07 Aug', '04 Sep', '02 Oct', '30 Oct', '27 Nov', '25 Dec', '22 Jan', '19 Feb', '19 Mar', '16 Apr', '14 May']),
      createDay('Friday', ['BS27'], 'Cheddar', ['16 May', '13 Jun', '11 Jul', '08 Aug', '05 Sep', '03 Oct', '31 Oct', '28 Nov', '26 Dec', '23 Jan', '20 Feb', '20 Mar', '17 Apr', '15 May']),
    ],
  },
  {
    id: 'east',
    title: 'East Somerset window cleaning schedule',
    strapline: 'Next visit dates',
    summary: 'Window cleaning frequency covering Wincanton, Bruton, Castle Cary, Frome, Templecombe, Paulton, Radstock, Shepton Mallet & Wells.',
    days: [
      createDay('Monday', ['BA7', 'BA9', 'BA10', 'BA11', 'BA8'], 'Wincanton, Bruton, Castle Cary, Frome, Templecombe', ['19 May', '16 Jun', '14 Jul', '11 Aug', '08 Sep', '06 Oct', '03 Nov', '01 Dec', '29 Dec', '26 Jan', '23 Feb', '23 Mar', '20 Apr', '18 May']),
      createDay('Tuesday', ['BS39', 'BA3', 'BA4'], 'Paulton, Radstock, Shepton', ['20 May', '17 Jun', '15 Jul', '12 Aug', '09 Sep', '07 Oct', '04 Nov', '02 Dec', '30 Dec', '27 Jan', '24 Feb', '24 Mar', '21 Apr', '19 May']),
      createDay('Wednesday', ['BA5', 'BA4'], 'Shepton Mallet, Wells', ['21 May', '18 Jun', '16 Jul', '13 Aug', '10 Sep', '08 Oct', '05 Nov', '03 Dec', '31 Dec', '28 Jan', '25 Feb', '25 Mar', '22 Apr', '20 May']),
      createDay('Thursday', ['BA5'], 'Wells (central)', ['22 May', '19 Jun', '17 Jul', '14 Aug', '11 Sep', '09 Oct', '06 Nov', '04 Dec', '01 Jan', '29 Jan', '26 Feb', '26 Mar', '23 Apr', '21 May']),
      createDay('Friday', ['BA5'], 'Wells (Cathedral Quarter & surrounds)', ['23 May', '20 Jun', '18 Jul', '15 Aug', '12 Sep', '10 Oct', '07 Nov', '05 Dec', '02 Jan', '30 Jan', '27 Feb', '27 Mar', '24 Apr', '22 May']),
    ],
  },
  {
    id: 'south',
    title: 'South Somerset window cleaning schedule',
    strapline: 'Next visit dates',
    summary: 'Window cleaning frequency covering Yeovil, Ilminster, Chard, Crewkerne, Ilchester, Stoke-sub-Hamdon, Martock, Sherborne, Langport & Somerton.',
    days: [
      createDay('Monday', ['TA18', 'TA19', 'TA20', 'BA22', 'TA17', 'TA12', 'TA13', 'TA14', 'DT9'], 'Yeovil, Ilminster, Chard, Crewkerne, Ilchester, Stoke-sub-Hamdon, Martock, Sherborne', ['26 May', '23 Jun', '21 Jul', '18 Aug', '15 Sep', '13 Oct', '10 Nov', '08 Dec', '05 Jan', '02 Feb', '02 Mar', '30 Mar', '27 Apr', '25 May']),
      createDay('Tuesday', ['TA10', 'TA11'], 'Langport, Somerton', ['27 May', '24 Jun', '22 Jul', '19 Aug', '16 Sep', '14 Oct', '11 Nov', '09 Dec', '06 Jan', '03 Feb', '03 Mar', '31 Mar', '28 Apr', '26 May']),
      createDay('Wednesday', ['TA10', 'TA11'], 'Langport, Somerton (follow-up & missed properties)', ['28 May', '25 Jun', '23 Jul', '20 Aug', '17 Sep', '15 Oct', '12 Nov', '10 Dec', '07 Jan', '04 Feb', '04 Mar', '01 Apr', '29 Apr', '27 May']),
      createDay('Thursday', ['BA6'], 'Glastonbury', ['29 May', '26 Jun', '24 Jul', '21 Aug', '18 Sep', '16 Oct', '13 Nov', '11 Dec', '08 Jan', '05 Feb', '05 Mar', '02 Apr', '30 Apr', '28 May']),
      createDay('Friday', ['BA6'], 'Glastonbury (Estates & Tor side)', ['30 May', '27 Jun', '25 Jul', '22 Aug', '19 Sep', '17 Oct', '14 Nov', '12 Dec', '09 Jan', '06 Feb', '06 Mar', '03 Apr', '01 May', '29 May']),
    ],
  },
  {
    id: 'west',
    title: 'West Somerset window cleaning schedule',
    strapline: 'Next visit dates',
    summary: 'Window cleaning frequency covering Bridgwater, Taunton, Mark, Highbridge, Wedmore, Meare & Street.',
    days: [
      createDay('Monday', ['TA7', 'TA6', 'TA2', 'TA3', 'TA9', 'TA8', 'TA1'], 'Bridgwater, Taunton, Mark, Highbridge', ['02 Jun', '30 Jun', '28 Jul', '25 Aug', '22 Sep', '20 Oct', '17 Nov', '15 Dec', '12 Jan', '09 Feb', '09 Mar', '06 Apr', '04 May', '01 Jun']),
      createDay('Tuesday', ['BS28'], 'Wedmore', ['03 Jun', '01 Jul', '29 Jul', '26 Aug', '23 Sep', '21 Oct', '18 Nov', '16 Dec', '13 Jan', '10 Feb', '10 Mar', '07 Apr', '05 May', '02 Jun']),
      createDay('Wednesday', ['BS28'], 'Wedmore (follow-up)', ['04 Jun', '02 Jul', '30 Jul', '27 Aug', '24 Sep', '22 Oct', '19 Nov', '17 Dec', '14 Jan', '11 Feb', '11 Mar', '08 Apr', '06 May', '03 Jun']),
      createDay('Thursday', ['BS28', 'BA6'], 'Wedmore & Meare', ['05 Jun', '03 Jul', '31 Jul', '28 Aug', '25 Sep', '23 Oct', '20 Nov', '18 Dec', '15 Jan', '12 Feb', '12 Mar', '09 Apr', '07 May', '04 Jun']),
      createDay('Friday', ['BA16'], 'Street', ['06 Jun', '04 Jul', '01 Aug', '29 Aug', '26 Sep', '24 Oct', '21 Nov', '19 Dec', '16 Jan', '13 Feb', '13 Mar', '10 Apr', '08 May', '05 Jun']),
    ],
  },
]

export const WINDOW_FREQUENCY_NEXT_DATES: Record<FrequencyId, FrequencyDate[]> = {
  north: WINDOW_FREQUENCY_CALENDAR.find((entry) => entry.id === 'north')!.days[0].dates,
  east: WINDOW_FREQUENCY_CALENDAR.find((entry) => entry.id === 'east')!.days[0].dates,
  south: WINDOW_FREQUENCY_CALENDAR.find((entry) => entry.id === 'south')!.days[0].dates,
  west: WINDOW_FREQUENCY_CALENDAR.find((entry) => entry.id === 'west')!.days[0].dates,
}

const expandPostcodeGroup = (codes: string[]): string[] => {
  return codes.flatMap((value) => {
    const cleaned = value.trim().toUpperCase()
    if (!cleaned) return []
    return cleaned.split('/')
  }).map((code) => code.trim())
}

const POSTCODE_FREQUENCY_LOOKUP: Map<string, FrequencyLookupResult> = new Map()

WINDOW_FREQUENCY_CALENDAR.forEach((frequency) => {
  frequency.days.forEach((day) => {
    const postcodeTokens = expandPostcodeGroup(day.postcodes)

    postcodeTokens.forEach((token) => {
      const code = token.replace(/\s+/g, '')
      const existing = POSTCODE_FREQUENCY_LOOKUP.get(code)

      if (!existing) {
        POSTCODE_FREQUENCY_LOOKUP.set(code, {
          code,
          frequencyId: frequency.id,
          frequencyTitle: frequency.title,
          strapline: frequency.strapline,
          summary: frequency.summary,
          matches: [
            {
              day: day.day,
              areas: day.areas,
              postcodes: postcodeTokens,
              dates: day.dates,
            },
          ],
        })
      } else {
        existing.matches.push({
          day: day.day,
          areas: day.areas,
          postcodes: postcodeTokens,
          dates: day.dates,
        })
      }
    })
  })
})

const derivePostcodeCandidates = (raw: string): string[] => {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const withoutSpaces = raw.toUpperCase().replace(/\s+/g, '')
  const parts = raw.toUpperCase().split(/\s+/)
  const candidates = new Set<string>()

  if (raw) {
    candidates.add(raw.toUpperCase())
  }

  if (withoutSpaces) {
    candidates.add(withoutSpaces)
  }

  if (parts[0]) {
    candidates.add(parts[0].replace(/[^A-Z0-9]/g, ''))
  }

  if (cleaned) {
    const outwardMatch = cleaned.match(/^[A-Z]{1,2}\d{1,2}/)
    if (outwardMatch) {
      const outward = outwardMatch[0]
      candidates.add(outward)
      if (/\d$/.test(outward) && outward.length > 0) {
        candidates.add(outward.slice(0, -1))
      }
    }
  }

  return Array.from(candidates)
    .map((candidate) => candidate.replace(/\s+/g, '').toUpperCase())
    .filter(Boolean)
}

export const getPostcodeCandidates = (raw: string): string[] => derivePostcodeCandidates(raw)

export const findFrequencyForPostcode = (postcode: string): FrequencyLookupResult | null => {
  if (!postcode) return null
  const candidates = derivePostcodeCandidates(postcode)

  for (const candidate of candidates) {
    if (!candidate) continue

    const entry = POSTCODE_FREQUENCY_LOOKUP.get(candidate)
    if (entry) {
      return {
        ...entry,
        // ensure unique matches for duplicate postcode tokens
        matches: entry.matches.reduce<FrequencyMatch[]>((acc, match) => {
          const key = `${match.day}-${match.areas}`
          if (!acc.some((existing) => `${existing.day}-${existing.areas}` === key)) {
            acc.push(match)
          }
          return acc
        }, []),
      }
    }
  }

  return null
}
