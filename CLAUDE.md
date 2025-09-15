# Somerset Window Cleaning Website

## Overview
Modern Next.js website for Somerset Window Cleaning with dark theme and professional design. Features automated Claude Code Review workflow, interactive service components, comprehensive image management system, and robust error handling.

## Tech Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Testing**: Playwright E2E testing with automated frontend validation
- **Deployment**: Static export ready (Vercel/Cloudflare)
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
- **Reviews**: Google reviews with 5-star ratings (gold #FBBC05)
- **CaseStudy**: Enhanced with gradients, animations, and spanning header design
- **ProcessFlow**: Service workflow visualization (WhatsApp removed per user feedback)
- **ServiceCard**: Traditional service preview cards with optimized images
- **InteractiveServiceCard**: Modern service cards with hover animations, pricing, and expandable content

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

## MCP Tools Available
- **IDE Diagnostics**: Use `mcp__ide__getDiagnostics` for code issues
- **Code Execution**: Use `mcp__ide__executeCode` for testing

## File Structure
- `/app` - Pages (route-based)
- `/components` - Reusable UI components with error boundaries
- `/content` - Image manifests and service data
- `/public/images` - Optimized static assets
- `/tests` - Component and integration tests
- `/.github/workflows` - CI/CD automation
- `/scripts` - Development server and build scripts

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

## Recent Updates (Updated: 2025-09-15)

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
- **Service Pages**: Use InteractiveServiceCard component for full services page
- **Homepage Preview**: Use traditional ServiceCard for service previews
- **Image Loading**: ImageWithFallback handles all image loading with lazy loading support
- **Brand Consistency**: Always use #E11D2A for brand-red elements
- **Testing**: Run Playwright tests when making UI changes to validate functionality
- **Claude Code Review**: All PRs automatically reviewed with claude-sonnet-4-20250514 model