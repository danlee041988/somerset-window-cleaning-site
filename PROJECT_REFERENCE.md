# Somerset Window Cleaning – Project Reference

This document distills the high-level architecture, feature set, and day-to-day tooling for the Codex-managed Somerset Window Cleaning web application.

## Product Overview
- Marketing-focused Next.js 14 site with a dark "glass noir" aesthetic and accent red `#E11D2A`
- Primary journeys: postcode coverage discovery, detailed service marketing, and lead capture (booking + contact forms)
- Backed by EmailJS (lead delivery), Notion (CRM persistence), Google Analytics 4, Google Ads automations, and WhatsApp webhook logging

## Core Stack
- **Framework**: Next.js 14 App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with project-specific tokens (see `app/globals.css`, `docs/GLASS_NOIR_STYLE.md`)
- **Forms**: React Hook Form with EmailJS browser SDK + reCAPTCHA v2 gating
- **Testing**: Jest for units, Playwright for E2E (`jest.config.cjs`, `playwright.config.ts`)
- **Automation Scripts**: `scripts/` hosts Notion + Google Ads helpers, dev ergonomics, and env tooling

## Key Feature Modules
- `components/BookingForm.tsx` – Lightweight EmailJS booking request with honeypot/time trap, reCAPTCHA, and pricing hints
- `components/features/contact/ContactForm.tsx` – Full lead form with photo uploads (Notion + EmailJS), anti-spam traps, analytics hooks
- `components/features/contact/PostcodeChecker.tsx` – Normalizes postcodes, checks coverage areas, and deep-links to `/get-in-touch`
- `components/Header.tsx` / `Footer.tsx` – Responsive masthead + trust elements, CTA orchestration
- `components/ui/Button.tsx`, `Section.tsx`, `ImageWithFallback.tsx` – UI primitives that enforce brand styling and resilience
- `lib/notion`, `app/api/notion-direct-v2` – Notion CRM integration with file upload handshake via `/api/upload-photo`
- `lib/google-ads*.ts`, `app/api/google-ads*` – Google Ads campaign tooling and automation endpoints
- `lib/analytics.ts` – GA4 + conversion helpers, enabled when `NEXT_PUBLIC_GA_TRACKING_ENABLED=true`
- `components/StructuredData.tsx` – Business schema + SEO metadata

## Operational Integrations
- **EmailJS**: Requires `NEXT_PUBLIC_EMAILJS_*` keys (public) and optional `EMAILJS_PRIVATE_KEY`. Forms call `emailjs.sendForm`, surfacing errors to users.
- **Notion CRM**: `/api/notion-direct-v2` writes submission payloads and photo IDs; `/api/upload-photo` handles Notion file upload constraints (≤5 files, ≤10 MB each). Refer to `NOTION_API_FIX.md` for credential setup.
- **Analytics & Ads**: GA4 instrumentation is wrapped in `lib/analytics`; Google Ads automation lives under `/api/google-ads` + `/api/google-ads-integration` and the internal dashboard (`app/(internal)/admin/google-ads`).
- **WhatsApp Webhook**: `/api/whatsapp/webhook` validates the verify token and logs inbound messages when `WHATSAPP_*` env vars are present.

## Command Cheat Sheet
```bash
npm run dev           # Uses ./scripts/dev-server.sh for smart port handling
npm run dev:fallback  # Direct next dev on port 3001
npm run build         # Production build
npm run lint          # ESLint
npm test              # Jest unit tests
npm run test:e2e      # Playwright regression suite
npm run build:static  # Static export for offline preview (see README)
```

## Development Workflow Notes
- `./scripts/dev-server.sh` manages port detection (3000→3001), auto-opens the browser, and cleans up stale Next.js processes.
- For blocked ports, fall back to `npm run dev:fallback` or run the static preview (`npm run preview:static`).
- Keep Vercel and `.env.local` in sync with the variables listed in `AGENTS.md`.
- When modifying the booking/contact flows, rerun the targeted Playwright specs under `tests/e2e/` (contact submission, validation, reCAPTCHA).

## Related Documentation
- `AGENTS.md` – Operational guide and environment expectations
- `README.md` – Quickstart, project structure, brand palette
- `NOTION_API_FIX.md` – Detailed Notion credential + schema guidance
- `docs/GLASS_NOIR_STYLE.md` – Styling tokens and glass noir design language
