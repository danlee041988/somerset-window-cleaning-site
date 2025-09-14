export type ServiceKey =
  | 'Window Cleaning'
  | 'Gutter Clearing'
  | 'Conservatory Roof Cleaning'
  | 'Solar Panel Cleaning'
  | 'Fascias & Soffits Cleaning'
  | 'External Commercial Cleaning'

export type Bedrooms = '1' | '2' | '3' | '4' | '5' | '6+'
export type PropertyType = 'Detached' | 'Semi-Detached' | 'Terraced' | 'Flat'
export type Frequency = '4-weekly' | '8-weekly' | 'ad-hoc'

export type QuoteRow = { label: string; display: string; amount: number }

const WINDOW_BASE_MAP: Record<Exclude<Bedrooms, '6+'>, number> = {
  '1': 18,
  '2': 20,
  '3': 25,
  '4': 30,
  '5': 35,
}

const GUTTER_BASE_MAP: Record<Bedrooms, number> = {
  '1': 80,
  '2': 80,
  '3': 95,
  '4': 110,
  '5': 125,
  '6+': 125,
}

function row(label: string, price?: number | 'FREE' | 'POA'): QuoteRow {
  if (price === 'FREE') return { label, display: 'FREE', amount: 0 }
  if (price === 'POA' || price === undefined) return { label, display: 'POA', amount: 0 }
  return { label, display: `from £${price}`, amount: price }
}

export function computeWindowPrice(
  bedrooms: Bedrooms,
  propertyType: PropertyType,
  extCount: number,
  frequency?: Frequency,
): number | 'POA' {
  if (bedrooms === '6+') return 'POA'
  let price = WINDOW_BASE_MAP[(bedrooms as Exclude<Bedrooms, '6+'>)]
  if (propertyType === 'Detached') price += 5
  price += 5 * (extCount || 0)
  if (frequency === 'ad-hoc') price += 10
  return price
}

export function computeGutterPrice(
  bedrooms: Bedrooms,
  propertyType: PropertyType,
  extCount: number,
): number {
  let price = GUTTER_BASE_MAP[bedrooms]
  if (propertyType === 'Detached') price += 15
  price += 5 * (extCount || 0)
  return price
}

export function computeQuote(params: {
  services: ServiceKey[]
  bedrooms: Bedrooms
  propertyType: PropertyType
  extCount: number
  windowFrequency?: Frequency
}): { rows: QuoteRow[]; total: number } {
  const { services, bedrooms, propertyType, extCount, windowFrequency } = params
  const rows: QuoteRow[] = []

  const hasWindow = services.includes('Window Cleaning')
  const hasGutter = services.includes('Gutter Clearing')
  const hasFascias = services.includes('Fascias & Soffits Cleaning')

  let windowRow: QuoteRow | undefined
  if (hasWindow) {
    const wp = computeWindowPrice(bedrooms, propertyType, extCount, windowFrequency)
    windowRow = row('Window Cleaning', wp)
  }
  if (hasWindow && hasGutter && hasFascias) {
    windowRow = row('Window Cleaning', 'FREE')
  }
  if (windowRow) rows.push(windowRow)

  if (hasGutter) {
    const g = computeGutterPrice(bedrooms, propertyType, extCount)
    rows.push(row('Gutter Clearing', g))
    if (hasFascias) rows.push(row('Fascias & Soffits Cleaning', g + 15))
  } else if (hasFascias) {
    const g = computeGutterPrice(bedrooms, propertyType, extCount)
    rows.push(row('Fascias & Soffits Cleaning', g + 15))
  }

  if (services.includes('Conservatory Roof Cleaning')) rows.push(row('Conservatory Roof Cleaning', 'POA'))
  if (services.includes('Solar Panel Cleaning')) rows.push(row('Solar Panel Cleaning', 'POA'))
  if (services.includes('External Commercial Cleaning')) rows.push(row('External Commercial Cleaning', 'POA'))

  const total = rows.reduce((s, r) => s + r.amount, 0)
  return { rows, total }
}