import Section from '@/components/Section'
import Button from '@/components/Button'
import PostcodeChecker from '@/components/PostcodeChecker'

export const metadata = {
  title: 'Pricing Guide | Transparent Window Cleaning Prices Somerset',
  description: 'Clear, upfront pricing for window cleaning, gutter clearing, and specialist cleaning services across Somerset. No hidden fees, instant quotes available.',
  keywords: 'window cleaning prices Somerset, gutter clearing cost, conservatory roof cleaning price, solar panel cleaning rates'
}

export default function PricingPage() {
  return (
    <div className="py-16 md:py-20">
      <Section 
        title="Transparent Pricing Guide" 
        subtitle="Honest, upfront pricing for all our services. No hidden fees, no surprises."
      >
        {/* Pricing Introduction */}
        <div className="mb-12 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Fair Pricing, Exceptional Service
              </h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                Our pricing is based on property size, service type, and frequency. Regular customers enjoy 
                discounted rates, and we offer package deals for multiple services.
              </p>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free quotes for all services
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  No upfront payment required
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-red" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Discounts for regular service
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Quick Price Check</h3>
                <p className="text-sm text-white/70">Enter your postcode for area-specific pricing</p>
              </div>
              <PostcodeChecker variant="inline" placeholder="Enter postcode for pricing" />
            </div>
          </div>
        </div>

        {/* Service Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Window Cleaning */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Window Cleaning</h3>
              <div className="inline-flex items-center rounded-full bg-brand-red/20 px-3 py-1 text-xs font-medium text-brand-red">
                Most Popular
              </div>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-white">From £20</div>
              <p className="text-sm text-white/60">Per clean</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="text-sm text-white/80">
                <strong className="text-white">Frequency Options:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Every 4 weeks (best value)</li>
                  <li>• Every 8 weeks</li>
                  <li>• Every 12 weeks</li>
                  <li>• One-off cleans available</li>
                </ul>
              </div>
              <div className="text-sm text-white/80">
                <strong className="text-white">Includes:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• All windows & frames</li>
                  <li>• Sills & door frames</li>
                  <li>• Pure water technology</li>
                  <li>• No need to be home</li>
                </ul>
              </div>
            </div>
            <Button href="/get-in-touch?service=window-cleaning" variant="primary" className="w-full">
              Get Window Cleaning Quote
            </Button>
          </div>

          {/* Gutter Clearing */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Gutter Clearing</h3>
              <div className="inline-flex items-center rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-400">
                Essential Service
              </div>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-white">From £80</div>
              <p className="text-sm text-white/60">Annual service</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="text-sm text-white/80">
                <strong className="text-white">Service Includes:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Complete gutter clearing</li>
                  <li>• Downpipe checks</li>
                  <li>• Before & after photos</li>
                  <li>• Ground-level vacuum system</li>
                </ul>
              </div>
              <div className="text-sm text-white/80">
                <strong className="text-white">Recommended:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Annually (minimum)</li>
                  <li>• After autumn leaves fall</li>
                  <li>• Properties near trees: 2x yearly</li>
                </ul>
              </div>
            </div>
            <Button href="/get-in-touch?service=gutter-clearing" variant="primary" className="w-full">
              Book Gutter Clearing
            </Button>
          </div>

          {/* Conservatory Roof */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Conservatory Roof Cleaning</h3>
              <div className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                Specialist Service
              </div>
            </div>
            <div className="mb-6">
              <div className="text-2xl font-bold text-white">Price on Application</div>
              <p className="text-sm text-white/60">Custom quote required</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="text-sm text-white/80">
                <strong className="text-white">Factors Affecting Price:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Roof size & type</li>
                  <li>• Access requirements</li>
                  <li>• Level of soiling</li>
                  <li>• Glass or polycarbonate</li>
                </ul>
              </div>
              <div className="text-sm text-white/80">
                <strong className="text-white">Benefits:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Increases natural light</li>
                  <li>• Extends roof lifespan</li>
                  <li>• Improves appearance</li>
                </ul>
              </div>
            </div>
            <Button href="/get-in-touch?service=conservatory-cleaning" variant="primary" className="w-full">
              Get Free Assessment
            </Button>
          </div>

          {/* Solar Panel Cleaning */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Solar Panel Cleaning</h3>
              <div className="inline-flex items-center rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
                High-Tech Clean
              </div>
            </div>
            <div className="mb-6">
              <div className="text-2xl font-bold text-white">Price on Application</div>
              <p className="text-sm text-white/60">System assessment needed</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="text-sm text-white/80">
                <strong className="text-white">Pricing Based On:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Number of panels</li>
                  <li>• Roof accessibility</li>
                  <li>• Cleaning frequency</li>
                  <li>• System size (kW)</li>
                </ul>
              </div>
              <div className="text-sm text-white/80">
                <strong className="text-white">ROI Benefits:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Up to 25% efficiency gain</li>
                  <li>• Warranty-safe methods</li>
                  <li>• Deionised water only</li>
                </ul>
              </div>
            </div>
            <Button href="/get-in-touch?service=solar-cleaning" variant="primary" className="w-full">
              Arrange Assessment
            </Button>
          </div>

          {/* Fascias & Soffits */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">Fascias & Soffits Cleaning</h3>
              <div className="inline-flex items-center rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-400">
                Curb Appeal
              </div>
            </div>
            <div className="mb-6">
              <div className="text-3xl font-bold text-white">From £80</div>
              <p className="text-sm text-white/60">Standalone or add-on</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="text-sm text-white/80">
                <strong className="text-white">Service Covers:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• All PVC fascias</li>
                  <li>• Soffit boards</li>
                  <li>• Downpipes</li>
                  <li>• Cladding (if applicable)</li>
                </ul>
              </div>
              <div className="text-sm text-white/80">
                <strong className="text-white">Best Value:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Add to window cleaning</li>
                  <li>• Annual service recommended</li>
                  <li>• Package deals available</li>
                </ul>
              </div>
            </div>
            <Button href="/get-in-touch?service=fascias-soffits" variant="primary" className="w-full">
              Book Fascia Cleaning
            </Button>
          </div>

          {/* Commercial Cleaning */}
          <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-sm">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white mb-2">External Commercial Cleaning</h3>
              <div className="inline-flex items-center rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-400">
                Business Service
              </div>
            </div>
            <div className="mb-6">
              <div className="text-2xl font-bold text-white">Quote on Request</div>
              <p className="text-sm text-white/60">Tailored to your business</p>
            </div>
            <div className="space-y-3 mb-6">
              <div className="text-sm text-white/80">
                <strong className="text-white">Options Include:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Weekly to monthly service</li>
                  <li>• Early morning slots</li>
                  <li>• Weekend availability</li>
                  <li>• RAMS documentation</li>
                </ul>
              </div>
              <div className="text-sm text-white/80">
                <strong className="text-white">Sectors Served:</strong>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• Retail & hospitality</li>
                  <li>• Office buildings</li>
                  <li>• Healthcare facilities</li>
                  <li>• Schools & colleges</li>
                </ul>
              </div>
            </div>
            <Button href="/get-in-touch?service=commercial-cleaning" variant="primary" className="w-full">
              Get Commercial Quote
            </Button>
          </div>
        </div>

        {/* Package Deals */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">💰 Save with Package Deals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Essential Package</h3>
              <p className="text-sm text-white/70 mb-4">Windows + Gutters</p>
              <div className="text-2xl font-bold text-brand-red mb-4">Save 10%</div>
              <p className="text-xs text-white/60">Perfect for regular maintenance</p>
            </div>
            <div className="rounded-xl border border-brand-red/30 bg-gradient-to-br from-brand-red/20 to-brand-red/10 p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Complete Package</h3>
              <p className="text-sm text-white/70 mb-4">Windows + Gutters + Fascias</p>
              <div className="text-2xl font-bold text-brand-red mb-4">Save 15%</div>
              <p className="text-xs text-white/60">Most popular choice</p>
            </div>
            <div className="rounded-xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Premium Package</h3>
              <p className="text-sm text-white/70 mb-4">All services combined</p>
              <div className="text-2xl font-bold text-brand-red mb-4">Save 20%</div>
              <p className="text-xs text-white/60">Maximum value & convenience</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready for a Free Quote?
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Every property is unique. Get a personalized quote based on your specific needs and location. 
              No obligation, no pushy sales - just honest pricing.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button href="/get-in-touch" variant="primary">
                Get Your Free Quote
              </Button>
              <a
                href="tel:01458860339"
                className="inline-flex items-center justify-center rounded-md px-8 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white border border-white/20"
              >
                Call 01458 860339
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}