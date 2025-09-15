# Somerset Window Cleaning Website

## Overview
Modern Next.js website for Somerset Window Cleaning with dark theme and professional design. Features automated Claude Code Review workflow, interactive service components, comprehensive image management system with advanced optimization (73% size reduction), EmailJS contact form integration with reCAPTCHA v2 protection, business hours detection system, advanced postcode checking, and robust error handling. Now hosted with 20i.co.uk DNS management for improved performance.

## Tech Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Email Service**: EmailJS with reCAPTCHA v2 integration
- **Image Optimization**: WebP/AVIF formats with automated compression pipeline
- **DNS Management**: 20i.co.uk with StackDNS nameservers
- **Testing**: Playwright E2E testing with automated frontend validation
- **Deployment**: Vercel with 20i.co.uk DNS integration
- **CI/CD**: GitHub Actions with Claude Code Review and E2E testing

## Brand & Design
- **Primary Color**: `#E11D2A` (brand-red)
- **Theme**: Dark with glass-morphism effects
- **Typography**: Clean, modern with gradient text effects
- **Logo**: SWC Narrow Logo (20% enlarged) with advanced blend modes for seamless header integration

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
- **UniformServiceCard**: Specialized service cards with consistent styling and animations
- **SimpleServiceCard**: Streamlined service cards for clean, consistent layout
- **BusinessHours**: Real-time business status with UK bank holiday detection
- **PostcodeChecker**: Advanced postcode validation with Somerset coverage checking
- **OpenBanner**: Dynamic "CALL NOW - We are OPEN" banner with animations
- **EnhancedServiceCard**: Professional service cards with tabbed content and dynamic pricing

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

## Interactive Services System
**Status**: ✅ **PRODUCTION READY** - Modern interactive service cards with animations

**Latest Implementation (Added 2025-09-15)**:
- **InteractiveServiceCard Component**: Modern service cards with hover effects and pricing
- **Professional Design**: Removed emoji bullets, replaced with clean bullet points (•)
- **Service Data Structure**: Centralized service data in `/content/services-data.ts`
- **Pricing Strategy**: Mix of fixed pricing and "Price on application" for specialized services

**Service Features**:
- **Hover Animations**: Image zoom effects, dynamic overlays, and smooth transitions
- **Expandable Content**: "Show more" functionality for detailed service information
- **Specialty Badges**: "Most Popular", "Essential", "High-Tech", "Business" indicators
- **Interactive CTAs**: Service-specific call-to-action buttons with animations
- **Professional Styling**: Clean bullet points instead of emojis for business appeal

**Current Service Pricing**:
- **Window Cleaning**: From £20 (Most Popular)
- **Gutter Clearing**: From £80 (Essential)
- **Conservatory Roof Cleaning**: Price on application (Specialist)
- **Solar Panel Cleaning**: Price on application (High-Tech)
- **Fascias & Soffits Cleaning**: From £80
- **External Commercial Cleaning**: Quote on request (Business)

**Service Components**:
- `components/InteractiveServiceCard.tsx` - Modern interactive cards
- `components/ServiceCard.tsx` - Traditional service cards (homepage preview)
- `content/services-data.ts` - Centralized service content and pricing

## Image Management & Optimization System
**Status**: ✅ **PRODUCTION READY** - Advanced image optimization with 73% size reduction

**Performance Optimization (Added 2025-09-15)**:
- **Massive Size Reduction**: 41.8MB → 11MB total (73% reduction)
- **WebP/AVIF Support**: Automatic modern format generation with Next.js
- **Automated Compression**: Custom compression script with backup functionality
- **1-Year Cache TTL**: Long-term caching for optimal performance
- **Responsive Sizing**: Device-specific breakpoints (640px-1920px)

**Critical File Optimizations**:
- **Window Clean.jpeg**: 8.4M → 1.1M (87% reduction)
- **Solar Panel.jpeg**: 8.1M → 1.1M (86% reduction)
- **IMG_0880.jpeg**: 6.1M → 760K (88% reduction)
- **All DJI photos**: 3.6-3.8M → 850K-1.2M each (~70% reduction)

**Enhanced Image Handling**:
- **ImageWithFallback Component**: Handles loading states, errors, and fallbacks
- **Priority/Loading Logic**: Conditional prop handling (priority OR loading, not both)
- **Image Manifest**: Centralized image imports in `/content/image-manifest.ts`
- **Next.js Optimization**: Advanced Image component with proper sizing strategies

**Service Images** (Updated 2025-09-15):
- **Gutter Clearing**: `DJI_0047.JPG` → `Gutter Clearing.jpg`
- **Conservatory**: Conservatory roof cleaning imagery
- **SWC Logo**: Blend-mode optimized for dark themes
- **Hero Image Enhancement**: 40% brightness increase with `brightness(1.4)` filter and `opacity-60`

**Image Loading Fixes**:
- **ImageWithFallback**: Fixed loading placeholder behavior for lazy images
- **Service Photos**: All 6 service images now display correctly on homepage and services page
- **Lazy Loading**: Improved loading logic prevents stuck placeholder states

**Compression Pipeline**:
- **Automated Script**: `/scripts/compress-images.sh` with backup functionality
- **Quality Preservation**: Professional quality maintained during compression
- **Backup System**: Original files preserved in `/public/images/photos/originals/`
- **macOS Integration**: Uses native `sips` tool for reliable compression

## EmailJS Integration System
**Status**: ✅ **PRODUCTION READY** - Contact form with reCAPTCHA protection

**Configuration**:
- **Service ID**: `service_yfnr1a9`
- **Public Key**: `cbA_IhBfxEeDwbEx6`
- **Template ID**: `template_contact_form`
- **reCAPTCHA Site Key**: `6LdwUDQrAAAAAM0HwqssAwwiFgCZ_ZrSA7gZciWC`

**Features**:
- **Form Validation**: React Hook Form with TypeScript validation
- **Spam Protection**: Google reCAPTCHA v2 integration
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

## DNS Management with 20i.co.uk
**Status**: ✅ **PRODUCTION READY** - Migrated from Cloudflare to 20i.co.uk (September 2025)

**DNS Configuration**:
- **Provider**: 20i.co.uk with StackDNS nameservers
- **Nameservers**: `ns1.stackdns.com`, `ns2.stackdns.com`, `ns3.stackdns.com`, `ns4.stackdns.com`
- **Management**: Direct DNS record management via 20i control panel

**Current DNS Records**:
- **A Record**: `somersetwindowcleaning.co.uk` → `216.198.79.1` (Vercel - Updated 2025-09-15)
- **CNAME**: `www.somersetwindowcleaning.co.uk` → `7399b06860f42f97.vercel-dns-017.com`
- **MX Records**: Google Workspace email routing (ASPMX.L.GOOGLE.COM + ALT servers)
- **TXT Record**: SPF record for Google + Stackmail email delivery
- **TTL**: 3600 seconds for optimal caching

**Migration Benefits**:
- **Improved Performance**: Faster DNS resolution through StackDNS
- **Simplified Management**: Direct control via 20i.co.uk panel
- **Cost Optimization**: Better pricing structure for DNS services
- **Email Continuity**: Seamless Google Workspace email integration

## MCP Tools Available
- **IDE Diagnostics**: Use `mcp__ide__getDiagnostics` for code issues
- **Code Execution**: Use `mcp__ide__executeCode` for testing
- **Vercel Integration**: Full deployment and domain management
- **20i.co.uk DNS**: Direct DNS management and monitoring

## File Structure
- `/app` - Pages (route-based)
  - `/get-in-touch` - Contact form page with EmailJS integration
  - `/services` - Interactive service cards with pricing
  - `/areas` - Service area coverage with postcode checking
  - `/pricing` - Comprehensive pricing calculator with business hours
- `/components` - Reusable UI components with error boundaries
  - `ContactForm.tsx` - EmailJS form with reCAPTCHA protection
  - `ReCaptcha.tsx` - Google reCAPTCHA v2 wrapper
  - `UniformServiceCard.tsx` - Consistent service card styling
- `/content` - Image manifests and service data
  - `services-data.ts` - Centralized service content and pricing
- `/public/images` - Optimized static assets
- `/tests` - Component and integration tests
  - `uniform-service-cards.spec.ts` - Service card layout validation
  - `verify-no-overlays.spec.ts` - UI overlap detection
- `/.github/workflows` - CI/CD automation
- `/scripts` - Development server and build scripts
  - `compress-images.sh` - Automated image compression with backup
  - `dev-server.sh` - Enhanced development server management
- `EMAILJS_SETUP.md` - EmailJS configuration documentation
- `TESTING.md` - Comprehensive testing guidelines
- `somersetwindowcleaning.co.uk.zone` - DNS zone file for migration reference

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

## Service Updates
- **"Quote me"** → **"Book Now"** (improved CTA)
- **Service Names**: "Gutter Clearing" and "Conservatory Roof Cleaning"
- **Case Study**: Enhanced featured badge spans across to founder quote section
- **Process Flow**: WhatsApp integration removed per user feedback

## Logo & Asset Updates (Updated: 2025-09-15)

### Advanced Logo Integration System
- **Seamless Header Blending**: Eliminated visible black background using advanced CSS blend modes
- **Mix Blend Mode**: `multiply` with `invert(1)` filter for perfect black header integration
- **Cross-browser Support**: Progressive enhancement with fallbacks for older browsers
- **Auto-sizing**: Added `w-auto` class for proper aspect ratio maintenance
- **Header Scaling**: Increased logo sizes - `h-24 md:h-32 lg:h-40` for better visibility
- **Footer Consistency**: Standardized footer logo sizing to `h-24 md:h-28 w-auto`
- **Asset Cleanup**: Removed duplicate `public/images/logos/logo.svg` file
- **E2E Validation**: Automated testing ensures logo displays seamlessly across devices

### Hero Section Enhancements
- **Three Red Dots**: Replaced bullet characters with three branded red dots (#E11D2A)
- **Proper Spacing**: Individual span elements for "Local • Reliable • Fully Insured"
- **Brand Consistency**: All dots use CSS custom property `var(--brand-red)`
- **Header Background**: Solid black header (`bg-black`) for seamless logo integration

### Image System Updates
- **Manifest Updates**: Refreshed image-manifest.ts with latest asset references
- **Asset Organization**: Maintained structured approach in `/public/images/` directory
- **Performance**: Optimized image loading with proper width/height ratios

## Business Hours System
**Status**: ✅ **PRODUCTION READY** - Real-time business status detection

**Latest Implementation (Added 2025-09-15)**:
- **Business Hours**: Monday-Friday 9:00 AM - 4:00 PM operational hours
- **Bank Holiday Support**: UK bank holiday detection (2024-2026) with automatic closure
- **Dynamic Header**: "CALL NOW - We are OPEN" banner appears during business hours
- **Real-time Status**: Live business status checking across all components
- **Weekend Closure**: Automatic closure detection for weekends

**Features**:
- **OpenBanner Component**: Prominent animated banner during business hours
- **BusinessHours Component**: Compact and full status displays with opening hours
- **DynamicLayout**: Automatic padding adjustment based on banner visibility
- **Cross-component Integration**: Consistent business status across site

**Business Logic**:
- **Operational Hours**: 9:00 AM - 4:00 PM, Monday-Friday
- **Closed**: Weekends and UK bank holidays
- **Status Indicators**: Green dot (open), red dot (closed) with animations
- **Call-to-Action**: Dynamic messaging based on current business status

## Recent Updates (Updated: 2025-09-15)

### Image Optimization & Performance Enhancement (2025-09-15)
- **Comprehensive Image Optimization**: Reduced total image payload from 41.8MB to 11MB (73% reduction)
- **WebP/AVIF Implementation**: Added modern image format support in next.config.mjs with 1-year caching
- **Automated Compression Pipeline**: Created `/scripts/compress-images.sh` with backup functionality
- **ESLint Compliance**: Fixed CaseStudy and ImageWithFallback components for accessibility
- **Quality Preservation**: Maintained professional visual quality while achieving massive size reductions
- **Performance Metrics**: Site load time improved to 340ms with 163KB compressed page size

### DNS Migration to 20i.co.uk (2025-09-15)
- **Complete Migration**: Successfully migrated from Cloudflare to 20i.co.uk DNS
- **StackDNS Nameservers**: Using ns1-ns4.stackdns.com for improved performance
- **Zone File Management**: Streamlined DNS record management via 20i control panel
- **Email Continuity**: Maintained Google Workspace email with proper MX records
- **SSL Integration**: Seamless SSL certificate provisioning through Vercel
- **Propagation Monitoring**: Real-time DNS propagation validation and testing

### Logo Enhancement & Visual Improvements (2025-09-15)
- **Narrow Logo Implementation**: Switched to "SWC narrow Logo.jpg" for better horizontal layout
- **20% Size Increase**: Enhanced logo visibility across header and footer
- **Advanced Blend Modes**: Optimized CSS blend modes for seamless dark header integration
- **Cross-browser Compatibility**: Progressive enhancement with fallback support
- **Asset Organization**: Cleaned up duplicate logo files and optimized image manifest

### Business Hours & Dynamic UI System (2025-09-15)
- **Real-time Business Detection**: Live business hours with UK bank holiday support
- **Dynamic OpenBanner**: Animated "CALL NOW - We are OPEN" banner during business hours
- **Intelligent Layout**: DynamicLayout component adjusts spacing based on banner visibility
- **Enhanced User Experience**: Clear business status indicators with appropriate call-to-actions
- **Cross-component Integration**: Consistent business status across all site components

### Areas & Pricing Pages Implementation (2025-09-15)
- **Service Areas Page**: Comprehensive coverage map with postcode validation
- **Advanced Postcode Checker**: Real-time Somerset postcode validation with visual feedback
- **Pricing Calculator**: Dynamic pricing based on property type, bedrooms, and surcharges
- **Business Hours Integration**: Pricing page shows current business status
- **Professional Layout**: Grid-based responsive design with enhanced user experience

### Enhanced Service Card System (2025-09-15)
- **EnhancedServiceCard**: Professional tabbed interface with benefits, process, and equipment tabs
- **Dynamic Tab Labels**: Context-aware tab labels based on service type
- **Fixed Height Layout**: Consistent 600px height with overflow handling
- **Professional Styling**: Removed emoji bullets, enhanced with clean bullet points
- **Improved CTAs**: Service-specific call-to-action buttons with enhanced animations

### EmailJS Integration & Contact Form Redesign (2025-09-15)
- **EmailJS Implementation**: Complete integration with service ID `service_yfnr1a9` and custom template
- **reCAPTCHA Protection**: Google reCAPTCHA v2 integration with dark theme styling
- **Form Restructure**: Moved customer type selection inside form, relocated WhatsApp/Call options below form
- **React Hook Form**: TypeScript validation with comprehensive error handling
- **Email Template**: Custom template with all customer information and property details
- **Page Migration**: `/contact` → `/get-in-touch` with improved URL structure
- **User Experience**: Streamlined form flow to encourage completion before alternative contact methods

### TypeScript & Build Improvements (2025-09-15)
- **ESLint Fixes**: Resolved unescaped apostrophes in JSX preventing Vercel deployment
- **TypeScript Compliance**: Fixed ContactForm pricing calculation and component type errors
- **Build Optimization**: Improved Next.js build configuration for better performance
- **Component Safety**: Enhanced error boundaries and fallback states
- **Development Experience**: Improved type safety across all components

### Service Cards Layout Optimization (2025-09-15)
- **UniformServiceCard Component**: New component for consistent service card styling
- **Layout Fixes**: Resolved overlapping service cards on homepage using Playwright validation
- **Category Badge Removal**: Removed "Most Popular", "Essential", "Specialist" badges for cleaner design
- **Grid System**: Improved responsive grid layout ensuring all 6 services display correctly
- **Animation Enhancements**: Hover effects and transitions for better user interaction
- **Cross-device Testing**: Playwright tests validate layout across multiple screen sizes (375px-1920px)

### Interactive Services Implementation (2025-09-15)
- **InteractiveServiceCard Component**: Modern service cards with hover animations and pricing
- **Professional Design Enhancement**: Removed emojis, replaced with clean bullet points (•)
- **Service Pricing Strategy**: Updated pricing - Window Cleaning £20, specialized services on application
- **Service Content Structure**: Centralized service data in `/content/services-data.ts`
- **Animation System**: Custom fadeIn animations for expandable content
- **CTA Optimization**: Service-specific call-to-action buttons with targeted URLs

### Image System Improvements (2025-09-15)
- **Hero Image Enhancement**: 40% brightness increase with CSS filters for better visibility
- **Service Photo Validation**: Fixed all 6 service images loading correctly
- **ImageWithFallback Fix**: Resolved lazy loading placeholder issues preventing image display
- **Image Loading Logic**: Improved conditional rendering for lazy vs priority images

### User Experience Enhancements (2025-09-15)
- **CaseStudy Layout**: Fixed duplicate quote sections and improved grid-based responsive layout
- **Quote Attribution**: Updated attribution from "Dan Lee, Founder" to "Alan Smith, Business Advisor"
- **Professional Aesthetics**: Removed tacky emoji styling in favor of clean, corporate design
- **Header Integration**: Solid black header background for seamless logo blending
- **Repository Cleanup**: Closed unnecessary test PRs (#8, #10) via GitHub Actions integration
- **Responsive Design**: Enhanced mobile-first approach with improved service card layouts

### CI/CD Optimization (2025-09-14)
- **Model Upgrade**: Successfully upgraded to `claude-sonnet-4-20250514` as production model
- **Model Testing**: Extensive testing across claude-3-haiku, claude-3-5-sonnet, and claude-sonnet-4
- **Production Stability**: Confirmed claude-sonnet-4-20250514 working with exact model from console
- **Workflow Refinement**: Dual workflow system with Lyra optimization methodology
- **Review Quality**: Enhanced with 4-D methodology for comprehensive code analysis

### Development Infrastructure (2025-09-14)
- **Enhanced Dev Server**: Added automated development server management script
- **Dependency Management**: Integrated Dependabot for GitHub Actions updates
- **Error Handling**: Improved error boundaries and fallback states across components
- **Testing Dependencies**: Added @testing-library/react and @testing-library/jest-dom

### Configuration Management (2025-09-14)
- **Settings Validation**: Fixed Claude Code settings file validation issues
- **Permission Management**: Streamlined tool permissions for enhanced security
- **Environment Optimization**: Refined deployment and development environment configurations

## Important Notes
- **Contact Forms**: Always use ContactForm component with EmailJS integration and reCAPTCHA protection
- **Service Pages**: Use InteractiveServiceCard component for full services page, UniformServiceCard for consistent layouts
- **Homepage Preview**: Use traditional ServiceCard for service previews
- **Image Loading**: ImageWithFallback handles all image loading with lazy loading support
- **Brand Consistency**: Always use #E11D2A for brand-red elements
- **DNS Management**: 20i.co.uk provides DNS management - use 20i control panel for DNS changes
- **Image Optimization**: Use `/scripts/compress-images.sh` for future image optimization needs
- **Performance**: All images now WebP/AVIF optimized with responsive sizing
- **Testing**: Run Playwright tests when making UI changes to validate functionality
- **Claude Code Review**: All PRs automatically reviewed with claude-sonnet-4-20250514 model
- **Environment Variables**: EmailJS credentials stored in `.env.local` and Vercel environment
- **Form Validation**: All contact forms require reCAPTCHA verification for spam protection