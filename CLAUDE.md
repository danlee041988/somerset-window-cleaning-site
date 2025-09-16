# Somerset Window Cleaning Website

## Overview
Modern Next.js website for Somerset Window Cleaning with dark theme and professional design. Features automated Claude Code Review workflow, comprehensive service pages with individual route structures, service comparison tools, area-specific pages, Vercel DNS management, EmailJS contact form integration with reCAPTCHA v2 protection, and robust error handling with advanced testing infrastructure.

## Tech Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Email Service**: EmailJS with reCAPTCHA v2 integration
- **DNS Management**: Vercel DNS with SPF record automation
- **Testing**: Playwright E2E testing with automated frontend validation
- **Deployment**: Vercel with automated DNS management
- **CI/CD**: GitHub Actions with Claude Code Review and E2E testing

## Brand & Design
- **Primary Color**: `#E11D2A` (brand-red)
- **Theme**: Dark with glass-morphism effects
- **Typography**: Clean, modern with gradient text effects
- **Logo**: SWC Logo with advanced blend modes for seamless header integration

## Key Components
- **Section**: Wrapper with consistent spacing and optional title/subtitle
- **Button**: Primary/secondary/ghost variants with active animations (scale-95, 300ms transitions)
- **ImageWithFallback**: Robust image loading with error handling and loading states
- **ContactForm**: EmailJS integration with reCAPTCHA v2 protection and form validation
- **ReCaptcha**: Google reCAPTCHA v2 wrapper component with dark theme support
- **Reviews**: Google reviews with 5-star ratings (gold #FBBC05)
- **CaseStudy**: Enhanced with gradients, animations, and spanning header design
- **ProcessFlow**: Service workflow visualization (WhatsApp removed per user feedback)
- **ServiceCard**: Traditional service preview cards with optimized images
- **InteractiveServiceCard**: Modern service cards with hover animations, pricing, and expandable content
- **StickyCTABar**: Persistent call-to-action bar for service pages

## Commands
```bash
# Development (always on localhost:3000)
npm run dev

# Build & Test
npm run build
npm run lint
npm test

# Static export
npm run build:static
npm run preview:static
```

## Development Workflow Enhancements
**Enhanced Development Server** (Added 2025-09-14):
- **Script**: `/scripts/dev-server.sh` - Automated development server management
- **Features**: Process monitoring, automatic restart, and enhanced logging
- **Port Management**: Auto-detects port availability (3000 → 3001 fallback)
- **Browser Integration**: Automatic browser opening with correct URL
- **Clean Shutdown**: Graceful process termination with Ctrl+C

**Usage**: 
```bash
# Use enhanced dev server instead of npm run dev
./scripts/dev-server.sh
```

**GitHub Actions Integration**:
- **Dependabot**: Automated dependency updates for GitHub Actions
- **Multi-model Testing**: Parallel testing across different Claude models
- **Production Model**: Upgraded to claude-sonnet-4-20250514 for comprehensive reviews
- **Manual Trigger**: Workflow dispatch for on-demand code reviews

## Claude Code Review System
**Status**: ✅ **PRODUCTION READY** - Automated PR reviews via GitHub Actions

**Latest Configuration (Updated 2025-09-15)**:
- **Production Model**: `claude-sonnet-4-20250514` (confirmed working in production)
- **Test Model**: `claude-3-5-sonnet` (fallback for complex reviews)
- **API Key**: `secrets.ANTHROPIC_API_KEY` 
- **Cost**: Premium tier for comprehensive reviews
- **Workflows**: 
  - `.github/workflows/claude-code-review.yml` (production)
  - `.github/workflows/test-claude-action.yml` (testing)

**Model Evolution History**:
Recent testing confirmed optimal model selection:
- ✅ `claude-sonnet-4-20250514` - Current production model (exact model from console)
- ✅ `claude-3-5-sonnet` - Enhanced for complex code analysis
- ✅ `claude-3-haiku` - Fast, cost-effective for standard reviews

**Features**:
- Automated code quality reviews on PRs
- Brand consistency checks (#E11D2A usage)
- Next.js 14 best practices validation
- TypeScript compliance checking
- Performance and accessibility guidance
- Mobile-first design verification
- Dual workflow system (production + testing)

**Specialized Review Framework**: Uses Lyra prompt optimization methodology with 4-D approach:
- **DECONSTRUCT**: Extract code intent and architecture decisions
- **DIAGNOSE**: Audit for quality gaps and technical debt
- **DEVELOP**: Apply systematic optimization techniques
- **DELIVER**: Provide actionable feedback with code examples

**Review Focus**: Brand consistency (#E11D2A), Next.js 14 best practices, TypeScript compliance, accessibility (WCAG), performance optimization, and mobile-first responsive design.

## Service Architecture System
**Status**: ✅ **PRODUCTION READY** - Complete service ecosystem with individual pages

**Individual Service Pages (Added 2025-09-16)**:
- **Window Cleaning**: `/app/services/window-cleaning/page.tsx` - Comprehensive 400+ line service page
- **Gutter Clearing**: `/app/services/gutter-clearing/page.tsx` - Full service documentation with processes
- **Conservatory Roof Cleaning**: `/app/services/conservatory-roof-cleaning/page.tsx` - Specialist service details
- **Solar Panel Cleaning**: `/app/services/solar-panel-cleaning/page.tsx` - High-tech service specifications

**Service Comparison Tool (Added 2025-09-16)**:
- **Comparison Page**: `/app/compare-services/page.tsx` - Side-by-side service comparison
- **Layout Component**: `/app/compare-services/layout.tsx` - Specialized layout for comparison views
- **Features**: Direct service comparisons, pricing, and suitability analysis

**Area-Specific Services (Added 2025-09-16)**:
- **Wells BA5 Page**: `/app/areas/wells-ba5/page.tsx` - Location-specific service delivery
- **Local Testimonials**: Area-specific customer reviews and success stories
- **Coverage Maps**: Detailed area coverage with postcode validation

**Service Components**:
- `components/InteractiveServiceCard.tsx` - Modern interactive cards (redesigned)
- `components/ServiceCard.tsx` - Traditional service cards (homepage preview)
- `components/StickyCTABar.tsx` - Persistent conversion element
- `content/services-data.ts` - Centralized service content and pricing

**Current Service Pricing**:
- **Window Cleaning**: From £20 (Most Popular)
- **Gutter Clearing**: From £80 (Essential)
- **Conservatory Roof Cleaning**: Price on application (Specialist)
- **Solar Panel Cleaning**: Price on application (High-Tech)
- **Fascias & Soffits Cleaning**: From £80
- **External Commercial Cleaning**: Quote on request (Business)

## Vercel DNS Integration System
**Status**: ✅ **PRODUCTION READY** - Complete DNS migration from 20i.co.uk

**DNS Migration Success (Completed 2025-09-16)**:
- **DNS Provider**: Migrated from 20i.co.uk StackDNS to Vercel DNS
- **Nameservers**: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`
- **Domain Registration**: Kept at 20i.co.uk (domain ownership unchanged)
- **Email Continuity**: Google Workspace MX records migrated successfully

**Current DNS Configuration**:
- **A Records**: `216.198.79.1`, `64.29.17.1` (Vercel edge infrastructure)
- **CNAME**: `www.somersetwindowcleaning.co.uk` → Project-specific Vercel target
- **MX Records**: Complete Google Workspace email setup (5 records)
- **SPF Record**: `v=spf1 include:_spf.google.com include:spf.stackmail.com -all`
- **SSL**: Automatic Let's Encrypt certificate provisioning

**Vercel CLI Integration**:
- **CLI Version**: 48.0.0 installed and configured
- **DNS Management**: `npx vercel dns add/ls/rm` commands available
- **SPF Automation**: Automated SPF record creation via CLI
- **Record ID**: `rec_a3d3a2a0e3213dc125d251a7` for SPF record tracking

**Migration Benefits**:
- **Faster Propagation**: Immediate DNS updates (no 20i.co.uk delays)
- **Unified Management**: Single dashboard for hosting + DNS
- **API Access**: Programmatic DNS management capabilities
- **Global Performance**: Vercel's edge network for DNS resolution

## Image Management System
**Enhanced Image Handling**:
- **ImageWithFallback Component**: Handles loading states, errors, and fallbacks
- **Priority/Loading Logic**: Conditional prop handling (priority OR loading, not both)
- **Image Manifest**: Centralized image imports in `/content/image-manifest.ts`
- **Optimization**: Next.js Image component with proper sizing and loading strategies

**Service Images** (Updated 2025-09-15):
- **Gutter Clearing**: `DJI_0047.JPG` → `Gutter Clearing.jpg`
- **Conservatory**: Conservatory roof cleaning imagery
- **SWC Logo**: Blend-mode optimized for dark themes
- **Hero Image Enhancement**: 40% brightness increase with `brightness(1.4)` filter and `opacity-60`

**Image Loading Fixes**:
- **ImageWithFallback**: Fixed loading placeholder behavior for lazy images
- **Service Photos**: All 6 service images now display correctly on homepage and services page
- **Lazy Loading**: Improved loading logic prevents stuck placeholder states

## EmailJS Integration System
**Status**: ✅ **PRODUCTION READY** - Contact form with reCAPTCHA protection

**Configuration**:
- **Service ID**: `service_yfnr1a9`
- **Public Key**: `cbA_IhBfxEeDwbEx6`
- **Template ID**: `template_contact_form`
- **reCAPTCHA Site Key**: `6LdwUDQrAAAAAM0HwqssAwwiFgCZ_ZrSA7gZciWC`

**reCAPTCHA Integration** (Fixed 2025-09-16):
- **Production Status**: ✅ **FULLY OPERATIONAL** - Environment variable properly configured
- **Environment Setup**: `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` set in all Vercel environments
- **Error Handling**: Enhanced debugging with comprehensive logging and fallback states
- **Theme Integration**: Dark theme styling with seamless brand integration
- **Spam Protection**: Form submission blocked without reCAPTCHA completion

**Features**:
- **Form Validation**: React Hook Form with TypeScript validation
- **Spam Protection**: Google reCAPTCHA v2 integration with enhanced error handling
- **Customer Types**: Radio button selection (New/Existing customer)
- **Service Integration**: Property size and service type selection
- **Error Handling**: Comprehensive error states and user feedback
- **Dark Theme**: reCAPTCHA styled for dark theme consistency

**Form Fields**:
- Customer type selection (New/Existing)
- Full name and email (required)
- Phone number and property address
- Property size and service type
- Additional message/requirements
- reCAPTCHA verification

**Email Template Structure**:
```
New Contact Form Submission

Customer Information:
- Name: {{name}}
- Email: {{email}}
- Phone: {{phone}}
- Customer Type: {{customerType}}

Property Details:
- Address: {{address}}
- Size: {{propertySize}}
- Service: {{serviceType}}

Message:
{{message}}
```

## Testing Infrastructure
**Enhanced Testing Suite (Added 2025-09-16)**:
- **EmailJS Testing**: Multiple test files for EmailJS integration validation
  - `test-emailjs-simple.cjs` - Browser-based testing script
  - `tests/emailjs-integration.spec.ts` - Playwright integration tests
  - `tests/emailjs-live-test.spec.ts` - Live deployment testing
  - `scripts/test-emailjs.html` - Manual testing interface

**Test Coverage**:
- Component and integration tests
- UI overlap detection
- Service card layout validation
- Cross-device responsive testing
- Email form submission workflows

## MCP Tools Available
- **IDE Diagnostics**: Use `mcp__ide__getDiagnostics` for code issues
- **Code Execution**: Use `mcp__ide__executeCode` for testing
- **Vercel Integration**: Full deployment and domain management
- **Vercel DNS**: Automated DNS management and monitoring

## File Structure
- `/app` - Pages (route-based)
  - `/get-in-touch` - Contact form page with EmailJS integration
  - `/services` - Service overview page + individual service pages
    - `/window-cleaning` - Dedicated window cleaning service page
    - `/gutter-clearing` - Dedicated gutter clearing service page
    - `/conservatory-roof-cleaning` - Specialist conservatory service page
    - `/solar-panel-cleaning` - High-tech solar panel service page
  - `/areas` - Service area coverage
    - `/wells-ba5` - Wells-specific service page with local testimonials
  - `/compare-services` - Service comparison tool with dedicated layout
- `/components` - Reusable UI components with error boundaries
  - `ContactForm.tsx` - EmailJS form with reCAPTCHA protection
  - `ReCaptcha.tsx` - Google reCAPTCHA v2 wrapper
  - `InteractiveServiceCard.tsx` - Redesigned service cards with professional styling
  - `StickyCTABar.tsx` - Persistent call-to-action component
- `/content` - Service data and image manifests
  - `services-data.ts` - Centralized service content and pricing
- `/public/images` - Optimized static assets
  - `/photos/originals` - Backup of original images pre-compression
- `/tests` - Comprehensive testing suite
  - `emailjs-integration.spec.ts` - EmailJS workflow testing
  - `uniform-service-cards.spec.ts` - Service card layout validation
  - `verify-no-overlays.spec.ts` - UI overlap detection
- `/.github/workflows` - CI/CD automation
- `/scripts` - Development and build scripts
  - `dev-server.sh` - Enhanced development server management
  - `test-emailjs.html` - Manual EmailJS testing interface
- `test-emailjs-simple.cjs` - Simplified EmailJS testing script
- `EMAILJS_SETUP.md` - EmailJS configuration documentation
- `TESTING.md` - Comprehensive testing guidelines

## Development Standards
- **Brand Colors**: Always use `#E11D2A` for brand-red accents
- **Theme Patterns**: Dark theme with `white/10` borders, `white/5` backgrounds
- **Components**: Use Section wrapper for consistent spacing
- **Responsiveness**: Mobile-first approach (test on multiple devices)
- **Error Handling**: Comprehensive error boundaries and fallback states
- **Performance**: Optimize images, lazy loading, smooth animations
- **Testing**: Jest + React Testing Library (70% coverage threshold)
- **Component Development**: Use InteractiveServiceCard for services pages, ServiceCard for previews

## Button Component Enhancements
```typescript
// Enhanced with active animations and improved transitions
const base = 'inline-flex items-center justify-center rounded-md px-5 py-3 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red disabled:opacity-60 disabled:cursor-not-allowed'

const variants = {
  primary: 'bg-[var(--brand-red)] text-white hover:opacity-90 active:scale-95 focus:ring-brand-red',
  secondary: 'bg-white text-black hover:bg-neutral-200 active:scale-95 focus:ring-white',
  ghost: 'bg-transparent text-white hover:bg-white/10 active:scale-95 focus:ring-white'
}
```

## Recent Major Updates (Updated: 2025-09-16)

### Complete DNS Migration to Vercel (2025-09-16)
- **Successful Migration**: Completed full DNS migration from 20i.co.uk to Vercel DNS
- **Nameserver Change**: Updated domain registration to use `ns1.vercel-dns.com` and `ns2.vercel-dns.com`
- **Vercel CLI Integration**: Installed Vercel CLI v48.0.0 for programmatic DNS management
- **SPF Record Automation**: Added SPF record via CLI (`rec_a3d3a2a0e3213dc125d251a7`)
- **Global DNS Propagation**: Verified successful propagation across Google DNS, Cloudflare DNS
- **Email Continuity**: Maintained Google Workspace email with proper MX record migration
- **SSL Automation**: Automatic Let's Encrypt certificate provisioning through Vercel

### Major Service Architecture Expansion (2025-09-16)
- **Individual Service Pages**: Created dedicated pages for all major services
  - Window Cleaning: Comprehensive 400+ line service page with process details
  - Gutter Clearing: Full service documentation with equipment and techniques
  - Conservatory Roof Cleaning: Specialist service with safety protocols
  - Solar Panel Cleaning: High-tech service with efficiency improvements
- **Service Comparison Tool**: Built comprehensive comparison page with side-by-side analysis
- **Area-Specific Pages**: Wells BA5 page with local testimonials and coverage maps
- **StickyCTABar Component**: Added persistent conversion element for service pages

### Component Redesign and Professional Styling (2025-09-16)
- **InteractiveServiceCard Redesign**: Removed expandable content, standardized height to 600px
- **Professional Styling**: Eliminated emoji bullets, implemented clean bullet points (•)
- **Fixed Height Layout**: Consistent card sizing with proper content overflow handling
- **Service Card Consolidation**: Removed EnhancedServiceCard and UniformServiceCard components
- **Brand Consistency**: Implemented CSS custom properties for brand color management

### TypeScript Build Optimization (2025-09-16)
- **Build Error Resolution**: Fixed TypeScript errors preventing Vercel deployment
- **Button Component Fix**: Removed unsupported `target` prop from Button component usage
- **LightboxGallery Fix**: Removed invalid `columns` prop across all service pages
- **Component Type Safety**: Enhanced type safety across InteractiveServiceCard component
- **Frequency Property Cleanup**: Removed unused frequency property from service data structure

### Enhanced Testing Infrastructure (2025-09-16)
- **EmailJS Testing Suite**: Multiple testing approaches for EmailJS integration
  - Browser-based testing script (`test-emailjs-simple.cjs`)
  - Playwright integration tests (`emailjs-integration.spec.ts`)
  - Live deployment testing (`emailjs-live-test.spec.ts`)
  - Manual testing interface (`scripts/test-emailjs.html`)
- **DNS Migration Validation**: Comprehensive DNS propagation testing and monitoring
- **Cross-browser Testing**: Validated service card layouts across multiple screen sizes

### Service Content Structure Refinement (2025-09-16)
- **Centralized Service Data**: Enhanced `content/services-data.ts` with comprehensive service information
- **Service Pricing Updates**: Refined pricing strategy with clear "From £X" and "Price on application" structure
- **Professional Descriptions**: Removed casual language, implemented business-focused messaging
- **Service Categorization**: Clear differentiation between standard and specialist services

## Important Notes
- **DNS Management**: Now handled entirely through Vercel DNS - use `npx vercel dns` commands
- **Service Pages**: Each major service has dedicated route with comprehensive content
- **Contact Forms**: Always use ContactForm component with EmailJS integration and reCAPTCHA protection
- **Service Cards**: Use InteractiveServiceCard for service pages, ServiceCard for homepage previews
- **Image Loading**: ImageWithFallback handles all image loading with lazy loading support
- **Brand Consistency**: Always use #E11D2A for brand-red elements
- **Testing**: Comprehensive EmailJS testing suite available for integration validation
- **Claude Code Review**: All PRs automatically reviewed with claude-sonnet-4-20250514 model
- **Environment Variables**: EmailJS credentials stored in `.env.local` and Vercel environment
- **Form Validation**: All contact forms require reCAPTCHA verification for spam protection
- **Vercel CLI**: Use `npx vercel dns ls somersetwindowcleaning.co.uk` to view current DNS records