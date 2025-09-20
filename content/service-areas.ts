export interface PostcodeAreaEntry {
  code: string
  town: string
  keywords?: string
}

export interface PostcodeAreaGroup {
  name: string
  color: string
  borderColor: string
  iconColor: string
  areas: PostcodeAreaEntry[]
}

export const POSTCODE_AREAS: Record<string, PostcodeAreaGroup> = {
  BA: {
    name: 'Bath & East Somerset',
    color: 'from-white/10 to-white/5',
    borderColor: 'border-brand-red/20',
    iconColor: 'text-white',
    areas: [
      { code: 'BA3', town: 'Radstock', keywords: 'Midsomer Norton, Paulton' },
      { code: 'BA4', town: 'Shepton Mallet', keywords: 'Pilton, Croscombe' },
      { code: 'BA5', town: 'Wells', keywords: 'Cathedral City, Coxley, Wookey' },
      { code: 'BA6', town: 'Glastonbury', keywords: 'Street, Meare, Ashcott' },
      { code: 'BA7', town: 'Castle Cary', keywords: 'Ansford, Galhampton' },
      { code: 'BA8', town: 'Templecombe', keywords: 'Abbas Combe, Henstridge' },
      { code: 'BA9', town: 'Wincanton', keywords: 'Bayford, Stoke Trister' },
      { code: 'BA10', town: 'Bruton', keywords: 'Pitcombe, Cole' },
      { code: 'BA11', town: 'Frome', keywords: 'Westbury, Warminster' },
      { code: 'BA16', town: 'Street', keywords: 'Walton, Butleigh' },
      { code: 'BA20/21/22', town: 'Yeovil', keywords: 'All areas - West, Central, East, Preston, Mudford' }
    ]
  },
  BS: {
    name: 'Bristol & North Somerset',
    color: 'from-white/10 to-white/5',
    borderColor: 'border-white/20',
    iconColor: 'text-white',
    areas: [
      { code: 'BS21', town: 'Clevedon', keywords: 'Walton Bay, Court House' },
      { code: 'BS22/23/24', town: 'Weston-super-Mare', keywords: 'All areas - Worle, Milton, Town Centre, Hillside' },
      { code: 'BS25', town: 'Winscombe', keywords: 'Churchill, Sandford' },
      { code: 'BS26', town: 'Axbridge', keywords: 'Cross, Compton Bishop' },
      { code: 'BS27', town: 'Cheddar', keywords: 'Draycott, Rodney Stoke' },
      { code: 'BS28', town: 'Wedmore', keywords: 'Theale, Blackford' },
      { code: 'BS29', town: 'Banwell', keywords: 'Locking, Hutton' },
      { code: 'BS39', town: 'Clutton', keywords: 'Temple Cloud, Farrington' },
      { code: 'BS40', town: 'Chew Valley', keywords: 'Blagdon, Ubley' },
      { code: 'BS49', town: 'Wrington', keywords: 'Redhill, Langford' }
    ]
  },
  TA: {
    name: 'Taunton & West Somerset',
    color: 'from-white/10 to-white/5',
    borderColor: 'border-brand-red/30',
    iconColor: 'text-white',
    areas: [
      { code: 'TA2', town: 'Taunton', keywords: 'County Town, Priorswood' },
      { code: 'TA6/7', town: 'Bridgwater', keywords: 'All areas - North, South, Hamp, Eastover, Wembdon' },
      { code: 'TA8', town: 'Burnham-on-Sea', keywords: 'Highbridge, Berrow' },
      { code: 'TA9', town: 'Highbridge', keywords: 'West Huntspill, Watchfield' },
      { code: 'TA10', town: 'Langport', keywords: 'Huish Episcopi, Long Sutton' },
      { code: 'TA11', town: 'Somerton', keywords: 'Long Sutton, Kingsdon' },
      { code: 'TA12', town: 'Martock', keywords: 'South Petherton, Ash' },
      { code: 'TA13', town: 'South Petherton', keywords: 'Seavington, Shepton' },
      { code: 'TA14', town: 'Stoke-sub-Hamdon', keywords: 'Norton, Chiselborough' },
      { code: 'TA18', town: 'Crewkerne', keywords: 'Misterton, Haselbury' },
      { code: 'TA19', town: 'Ilminster', keywords: 'Dowlish, Donyatt' },
      { code: 'TA20', town: 'Chard', keywords: 'Tatworth, Forton' },
      { code: 'TA21', town: 'Wellington', keywords: 'Rockwell Green, West Buckland' }
    ]
  },
  DT: {
    name: 'Dorset Border',
    color: 'from-white/10 to-white/5',
    borderColor: 'border-white/15',
    iconColor: 'text-white',
    areas: [
      { code: 'DT9', town: 'Sherborne', keywords: 'Milborne Port, Bishops Caundle' }
    ]
  }
}

export const AREA_DETAIL_ROUTES: Record<string, string> = {
  BA5: '/areas/wells-ba5'
}

const buildSearchTokens = (prefix: string, code: string): string[] => {
  const upperCode = code.toUpperCase()
  const compact = upperCode.replace(/\s+/g, '')
  const tokens = new Set<string>([
    prefix.toLowerCase(),
    upperCode.toLowerCase(),
    compact.toLowerCase(),
  ])

  let currentLetters = prefix

  upperCode.split('/').forEach((segment) => {
    const cleaned = segment.trim()
    if (!cleaned) return

    const noSpace = cleaned.replace(/\s+/g, '')
    const letterMatch = noSpace.match(/^[A-Z]+/)
    if (letterMatch) {
      currentLetters = letterMatch[0]
    }

    if (/^[A-Z]+\d/.test(noSpace)) {
      tokens.add(noSpace.toLowerCase())
    } else if (/^\d/.test(noSpace) && currentLetters) {
      tokens.add((currentLetters + noSpace).toLowerCase())
    } else {
      tokens.add(noSpace.toLowerCase())
    }
  })

  return Array.from(tokens)
}

export const buildAreaDomId = (prefix: string, code: string) => {
  return `area-${prefix}-${code.replace(/[^a-z0-9]/gi, '').toLowerCase()}`
}

export interface FlattenedArea {
  id: string
  prefix: string
  code: string
  town: string
  keywords?: string
  href?: string
  searchTokens: string[]
}

export const FLATTENED_AREAS: FlattenedArea[] = Object.entries(POSTCODE_AREAS).flatMap(([prefix, data]) => (
  data.areas.map((area) => {
    const href = AREA_DETAIL_ROUTES[area.code]
    return {
      id: `${prefix}-${area.code}`,
      prefix,
      code: area.code,
      town: area.town,
      keywords: area.keywords,
      href,
      searchTokens: buildSearchTokens(prefix, area.code),
    }
  })
))
