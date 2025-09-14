# Somerset Window Cleaning Website

## Overview
Modern Next.js website for Somerset Window Cleaning with dark theme and professional design.

## Tech Stack
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom brand colors
- **Deployment**: Static export ready

## Brand & Design
- **Primary Color**: `#E11D2A` (brand-red)
- **Theme**: Dark with glass-morphism effects
- **Typography**: Clean, modern with gradient text effects

## Key Components
- **Section**: Wrapper with consistent spacing and optional title/subtitle
- **Button**: Primary/ghost variants with brand styling  
- **Reviews**: Google reviews with 5-star ratings (gold #FBBC05)
- **CaseStudy**: Enhanced with gradients and animations
- **ServiceCard**: Service preview cards with images

## Commands
```bash
# Development (always on localhost:3000)
npm run dev

# Build & Test
npm run build
npm run lint

# Static export
npm run build:static
npm run preview:static
```

## MCP Tools Available
- **IDE Diagnostics**: Use `mcp__ide__getDiagnostics` for code issues
- **Code Execution**: Use `mcp__ide__executeCode` for testing

## File Structure
- `/app` - Pages (route-based)
- `/components` - Reusable UI components  
- `/content` - Image manifests and content
- `/public` - Static assets

## Important Notes
- Always use brand-red (#E11D2A) for accents
- Follow dark theme patterns (white/10 borders, white/5 backgrounds)
- Use Section wrapper for consistent spacing
- Test responsiveness (mobile-first approach)