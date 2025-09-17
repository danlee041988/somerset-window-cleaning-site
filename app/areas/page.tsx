import Section from '@/components/Section'
import Button from '@/components/Button'
import PostcodeChecker from '@/components/PostcodeChecker'
import AreaCombobox from '@/components/AreaCombobox'
import { POSTCODE_AREAS, FLATTENED_AREAS, buildAreaDomId } from '@/content/service-areas'

export const metadata = {
  title: 'Areas We Cover | Somerset Window Cleaning Service Areas',
  description: 'Professional window cleaning across Somerset. BA postcodes (Wells, Glastonbury), BS postcodes (Weston, Cheddar), TA postcodes (Taunton, Bridgwater). Check if we cover your area.',
  keywords: 'BA5 window cleaner, BS27 window cleaning, TA6 cleaning services, Somerset window cleaning areas, Wells, Glastonbury, Cheddar, Street, Bridgwater, Taunton, Yeovil'
}

// Organized by postcode prefix for clarity
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
            {Object.entries(POSTCODE_AREAS).map(([prefix, data]) => (
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
            {Object.entries(POSTCODE_AREAS).map(([prefix, data]) => (
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
                      id={buildAreaDomId(prefix, area.code)}
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

        {/* Area search combobox */}
        <div className="mt-12">
          <h3 className="text-lg font-bold text-white mb-4 text-center">Find your town or postcode</h3>
          <p className="text-center text-sm text-white/70 mb-6 max-w-2xl mx-auto">
            Start typing to jump straight to your area or view dedicated local pages where available.
          </p>
          <AreaCombobox areas={FLATTENED_AREAS} containerClassName="mx-auto" />
        </div>

      </Section>
    </div>
  )
}
