import Section from '@/components/Section'
import Button from '@/components/Button'
import PostcodeChecker from '@/components/PostcodeChecker'

export const metadata = {
  title: 'Areas We Cover | Somerset Window Cleaning Service Areas',
  description: 'Professional window cleaning across Somerset. BA postcodes (Wells, Glastonbury), BS postcodes (Weston, Cheddar), TA postcodes (Taunton, Bridgwater). Check if we cover your area.',
  keywords: 'BA5 window cleaner, BS27 window cleaning, TA6 cleaning services, Somerset window cleaning areas, Wells, Glastonbury, Cheddar, Street, Bridgwater, Taunton, Yeovil'
}

// Organized by postcode prefix for clarity
const postcodeAreas = {
  "BA": {
    name: "Bath & East Somerset",
    color: "from-white/10 to-white/5",
    borderColor: "border-brand-red/20",
    iconColor: "text-brand-red",
    areas: [
      { code: "BA3", town: "Radstock", keywords: "Midsomer Norton, Paulton" },
      { code: "BA4", town: "Shepton Mallet", keywords: "Pilton, Croscombe" },
      { code: "BA5", town: "Wells", keywords: "Cathedral City, Coxley, Wookey" },
      { code: "BA6", town: "Glastonbury", keywords: "Street, Meare, Ashcott" },
      { code: "BA7", town: "Castle Cary", keywords: "Ansford, Galhampton" },
      { code: "BA8", town: "Templecombe", keywords: "Abbas Combe, Henstridge" },
      { code: "BA9", town: "Wincanton", keywords: "Bayford, Stoke Trister" },
      { code: "BA10", town: "Bruton", keywords: "Pitcombe, Cole" },
      { code: "BA11", town: "Frome", keywords: "Westbury, Warminster" },
      { code: "BA16", town: "Street", keywords: "Walton, Butleigh" },
      { code: "BA20/21/22", town: "Yeovil", keywords: "All areas - West, Central, East, Preston, Mudford" }
    ]
  },
  "BS": {
    name: "Bristol & North Somerset",
    color: "from-white/10 to-white/5",
    borderColor: "border-white/20",
    iconColor: "text-white/90",
    areas: [
      { code: "BS21", town: "Clevedon", keywords: "Walton Bay, Court House" },
      { code: "BS22/23/24", town: "Weston-super-Mare", keywords: "All areas - Worle, Milton, Town Centre, Hillside" },
      { code: "BS25", town: "Winscombe", keywords: "Churchill, Sandford" },
      { code: "BS26", town: "Axbridge", keywords: "Cross, Compton Bishop" },
      { code: "BS27", town: "Cheddar", keywords: "Draycott, Rodney Stoke" },
      { code: "BS28", town: "Wedmore", keywords: "Theale, Blackford" },
      { code: "BS29", town: "Banwell", keywords: "Locking, Hutton" },
      { code: "BS39", town: "Clutton", keywords: "Temple Cloud, Farrington" },
      { code: "BS40", town: "Chew Valley", keywords: "Blagdon, Ubley" },
      { code: "BS49", town: "Wrington", keywords: "Redhill, Langford" }
    ]
  },
  "TA": {
    name: "Taunton & West Somerset",
    color: "from-white/10 to-white/5",
    borderColor: "border-brand-red/30",
    iconColor: "text-brand-red/80",
    areas: [
      { code: "TA2", town: "Taunton", keywords: "County Town, Priorswood" },
      { code: "TA6/7", town: "Bridgwater", keywords: "All areas - North, South, Hamp, Eastover, Wembdon" },
      { code: "TA8", town: "Burnham-on-Sea", keywords: "Highbridge, Berrow" },
      { code: "TA9", town: "Highbridge", keywords: "West Huntspill, Watchfield" },
      { code: "TA10", town: "Langport", keywords: "Huish Episcopi, Long Sutton" },
      { code: "TA11", town: "Somerton", keywords: "Long Sutton, Kingsdon" },
      { code: "TA12", town: "Martock", keywords: "South Petherton, Ash" },
      { code: "TA13", town: "South Petherton", keywords: "Seavington, Shepton" },
      { code: "TA14", town: "Stoke-sub-Hamdon", keywords: "Norton, Chiselborough" },
      { code: "TA18", town: "Crewkerne", keywords: "Misterton, Haselbury" },
      { code: "TA19", town: "Ilminster", keywords: "Dowlish, Donyatt" },
      { code: "TA20", town: "Chard", keywords: "Tatworth, Forton" },
      { code: "TA21", town: "Wellington", keywords: "Rockwell Green, West Buckland" }
    ]
  },
  "DT": {
    name: "Dorset Border",
    color: "from-white/10 to-white/5",
    borderColor: "border-white/15",
    iconColor: "text-white/70",
    areas: [
      { code: "DT9", town: "Sherborne", keywords: "Milborne Port, Bishops Caundle" }
    ]
  }
}

export default function AreasPage() {
  return (
    <div className="py-16 md:py-20">
      <Section 
        title="Areas We Cover" 
        subtitle="Professional window cleaning service across Somerset and surrounding areas"
      >
        {/* Enhanced Postcode Checker with Autocomplete */}
        <div className="mb-12 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Quick Area Check</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Enter your postcode or start typing your town name to check coverage instantly
          </p>
          <div className="max-w-md mx-auto">
            <PostcodeChecker variant="hero" placeholder="Enter postcode or town (e.g. BA5 or Wells)" />
          </div>
          <p className="text-xs text-white/60 mt-3">
            💡 Tip: You can search by postcode (BA5) or town name (Wells)
          </p>
        </div>

        {/* Postcode Zone Overview */}
        <div className="mb-12 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Our Coverage by Postcode Area</h3>
          <div className="inline-flex flex-wrap gap-3 justify-center">
            {Object.entries(postcodeAreas).map(([prefix, data]) => (
              <div 
                key={prefix}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${data.color} border ${data.borderColor}`}
              >
                <span className="font-bold text-white">{prefix}</span>
                <span className="text-sm text-white/80">{data.areas.length} areas</span>
              </div>
            ))}
          </div>
        </div>

        {/* Postcode Areas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {Object.entries(postcodeAreas).map(([prefix, data]) => (
            <div 
              key={prefix} 
              className={`rounded-xl border ${data.borderColor} bg-gradient-to-br ${data.color} backdrop-blur-sm overflow-hidden`}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className={`text-2xl ${data.iconColor}`}>{prefix}</span>
                      <span>{data.name}</span>
                    </h3>
                    <p className="text-sm text-white/70 mt-1">{data.areas.length} service areas</p>
                  </div>
                  <Button href="/get-in-touch" variant="primary" className="text-sm">
                    Book in {prefix} Area
                  </Button>
                </div>
              </div>

              {/* Areas List */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-3">
                  {data.areas.map((area) => (
                    <div 
                      key={area.code}
                      className="group flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200"
                    >
                      <div className={`font-mono font-bold ${data.iconColor} bg-white/10 px-2 py-1 rounded text-xs min-w-[80px] text-center`}>
                        {area.code}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-white text-sm">{area.town}</div>
                        <div className="text-xs text-white/60">{area.keywords}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reference Section */}
        <div className="mb-12 p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          <h3 className="text-lg font-bold text-white mb-4 text-center">🔍 Quick Postcode Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">BA Areas</h4>
              <ul className="space-y-1 text-white/70">
                <li>BA5 - Wells</li>
                <li>BA6 - Glastonbury</li>
                <li>BA16 - Street</li>
                <li className="text-xs">+ 10 more areas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-400 mb-2">BS Areas</h4>
              <ul className="space-y-1 text-white/70">
                <li>BS27 - Cheddar</li>
                <li>BS26 - Axbridge</li>
                <li>BS23/24 - Weston</li>
                <li className="text-xs">+ 8 more areas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">TA Areas</h4>
              <ul className="space-y-1 text-white/70">
                <li>TA2 - Taunton</li>
                <li>TA6/7 - Bridgwater</li>
                <li>TA8 - Burnham</li>
                <li className="text-xs">+ 11 more areas</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-400 mb-2">DT Areas</h4>
              <ul className="space-y-1 text-white/70">
                <li>DT9 - Sherborne</li>
                <li className="text-xs italic">Dorset border area</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center p-8 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
          <h3 className="text-xl font-bold text-white mb-3">Ready to Book?</h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Found your area? Get your free quote today. Not listed? Call us - we're always expanding our coverage!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button href="/get-in-touch" variant="primary">
              Get Your Free Quote
            </Button>
            <a 
              href="tel:01458860339" 
              className="inline-flex items-center justify-center rounded-md px-5 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white border border-white/20"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call 01458 860339
            </a>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            45+ Towns Covered
          </span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            4 Postcode Zones
          </span>
          <span className="hidden md:inline">•</span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Professional Local Team
          </span>
        </div>
      </Section>
    </div>
  )
}