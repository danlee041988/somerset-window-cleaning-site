# Somerset Window Cleaning Website

## Overview
Modern Next.js website for Somerset Window Cleaning with dark theme and professional design. Features automated Claude Code Review workflow and robust error handling.

## Tech Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Deployment**: Static export ready (Vercel/Cloudflare)
- **CI/CD**: GitHub Actions with Claude Code Review

## Brand & Design
- **Primary Color**: `#E11D2A` (brand-red)
- **Theme**: Dark with glass-morphism effects
- **Typography**: Clean, modern with gradient text effects
- **Logo**: SWC Logo with blend modes for transparency

## Key Components
- **Section**: Wrapper with consistent spacing and optional title/subtitle
- **Button**: Primary/secondary/ghost variants with active animations (scale-95, 300ms transitions)
- **ImageWithFallback**: Robust image loading with error handling and loading states
- **Reviews**: Google reviews with 5-star ratings (gold #FBBC05)
- **CaseStudy**: Enhanced with gradients, animations, and service-specific imagery
- **ProcessFlow**: Service workflow visualization (WhatsApp removed per user feedback)
- **ServiceCard**: Service preview cards with optimized images

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

**Latest Configuration (Updated 2025-09-14)**:
- **Production Model**: `claude-sonnet-4-20250514` (confirmed working in production)
- **Test Model**: `claude-3-5-sonnet` (fallback for complex reviews)
- **API Key**: `secrets.SWC_WEBSITE` 
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

## Image Management System
**Enhanced Image Handling**:
- **ImageWithFallback Component**: Handles loading states, errors, and fallbacks
- **Priority/Loading Logic**: Conditional prop handling (priority OR loading, not both)
- **Image Manifest**: Centralized image imports in `/content/image-manifest.ts`
- **Optimization**: Next.js Image component with proper sizing and loading strategies

**Service Images**:
- **Gutter Clearing**: `DJI_0047.JPG` → `Gutter Clearing.jpg`
- **Conservatory**: Conservatory roof cleaning imagery
- **SWC Logo**: Blend-mode optimized for dark themes

## MCP Tools Available
- **IDE Diagnostics**: Use `mcp__ide__getDiagnostics` for code issues
- **Code Execution**: Use `mcp__ide__executeCode` for testing

## File Structure
- `/app` - Pages (route-based)
- `/components` - Reusable UI components with error boundaries
- `/content` - Image manifests and content
- `/public/images` - Optimized static assets
- `/tests` - Component and integration tests
- `/.github/workflows` - CI/CD automation

## Development Standards
- **Brand Colors**: Always use `#E11D2A` for brand-red accents
- **Theme Patterns**: Dark theme with `white/10` borders, `white/5` backgrounds
- **Components**: Use Section wrapper for consistent spacing
- **Responsiveness**: Mobile-first approach (test on multiple devices)
- **Error Handling**: Comprehensive error boundaries and fallback states
- **Performance**: Optimize images, lazy loading, smooth animations
- **Testing**: Jest + React Testing Library (70% coverage threshold)

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
- **Case Study**: Uses gutter clearing imagery with proper padding (`py-16 md:py-20`)
- **Process Flow**: WhatsApp integration removed per user feedback

## Logo & Asset Updates (Updated: 2025-09-14)

### Logo Component Enhancements
- **Auto-sizing**: Added `w-auto` class for proper aspect ratio maintenance
- **Header Scaling**: Increased logo sizes - `h-24 md:h-32 lg:h-40` for better visibility
- **Footer Consistency**: Standardized footer logo sizing to `h-24 md:h-28 w-auto`
- **Asset Cleanup**: Removed duplicate `public/images/logos/logo.svg` file
- **Logo Management**: Centralized logo handling through Logo component

### Image System Updates
- **Manifest Updates**: Refreshed image-manifest.ts with latest asset references
- **Asset Organization**: Maintained structured approach in `/public/images/` directory
- **Performance**: Optimized image loading with proper width/height ratios

## Recent Updates (Updated: 2025-09-14)

### CI/CD Optimization
- **Model Upgrade**: Successfully upgraded to `claude-sonnet-4-20250514` as production model
- **Model Testing**: Extensive testing across claude-3-haiku, claude-3-5-sonnet, and claude-sonnet-4
- **Production Stability**: Confirmed claude-sonnet-4-20250514 working with exact model from console
- **Workflow Refinement**: Dual workflow system with Lyra optimization methodology
- **Review Quality**: Enhanced with 4-D methodology for comprehensive code analysis

### Development Infrastructure
- **Enhanced Dev Server**: Added automated development server management script
- **Dependency Management**: Integrated Dependabot for GitHub Actions updates
- **Error Handling**: Improved error boundaries and fallback states across components

### Configuration Management
- **Settings Validation**: Fixed Claude Code settings file validation issues
- **Permission Management**: Streamlined tool permissions for enhanced security
- **Environment Optimization**: Refined deployment and development environment configurations