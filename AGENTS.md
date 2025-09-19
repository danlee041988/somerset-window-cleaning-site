# Somerset Window Cleaning – Agent Operations Guide

This document keeps AI agents and contributors aligned on the current production setup for `Projects/active/CODEX_SWC_WEBSITE`. Treat it as the source of truth before making code or configuration changes.

## Additional References
- `PROJECT_REFERENCE.md` – architecture + feature overview, module cheat sheet, and command quick reference

## Stack Overview
- Node.js ≥ 18.17, Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- React Hook Form for complex form state, EmailJS browser SDK for outbound email
- Testing: Jest (unit) and Playwright (E2E) with project configs in `jest.config.js` and `playwright.config.ts`
- Path alias `@/*` resolves to repo root (see `tsconfig.json`)

## Core Customer Journeys
- **Marketing Site** (`app/(marketing)/**`): hero with postcode coverage checker, service previews, case study, reviews, and gallery.
- **Get in Touch** (`/get-in-touch`): renders `components/features/contact/ContactForm.tsx`. Captures full lead details, optional property notes, and photo uploads. Includes honeypot + time trap, reCAPTCHA v2, dynamic pricing hints, and analytics hooks.
- **Booking Flow** (`/book-appointment`): `components/BookingForm.tsx` provides a lighter EmailJS-backed booking request with honeypot/time trap and reCAPTCHA gating.
- **Postcode Coverage**: `components/features/contact/PostcodeChecker.tsx` normalizes user input, validates against predefined Somerset areas, and deep-links to `/get-in-touch` with query params.

## Integrations & Automations
- **EmailJS**
  - Public keys loaded via `NEXT_PUBLIC_EMAILJS_*`; templates expect hidden inputs populated inside the React forms.
  - Contact and booking forms both call `emailjs.sendForm(...)`; failures bubble up and block success messaging.
- **Notion CRM**
  - Form submissions hit `/api/notion-direct-v2`; request payload mirrors `FormValues` and attaches uploaded photo IDs.
  - `/api/upload-photo` performs the Notion file upload handshake (`file_uploads` create + send`). Limit 5 files ≤10 MB each.
  - Config reads `NOTION_API_KEY`, `NOTION_DATABASE_ID`, and optional `NOTION_DATA_SOURCE_ID`. Missing credentials return `{ success: false, skipError: true }` so email delivery still succeeds.
- **Google Ads Automation**
  - `/api/google-ads` exposes campaign, keyword, performance, recommendation, and optimization endpoints using `lib/google-ads.ts` (`GoogleAdsClient`).
  - `/api/google-ads-integration` layers in Notion + GA4 data via `lib/google-ads-integration.ts` to propose combined optimizations; relies on mock fetchers when local.
  - Internal admin UI lives at `app/(internal)/admin/google-ads/page.tsx` (currently renders the disabled dashboard component).
- **Analytics**
  - `lib/analytics.ts` wraps GA4 tracking and conversion events. Enabled when `NEXT_PUBLIC_GA_TRACKING_ENABLED=true` and `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set.
  - Components should call `analytics.*` utilities rather than touching `gtag` directly.
- **PageSpeed + Monitoring**
  - `lib/pagespeed.ts` hits Google PageSpeed Insights when `NEXT_PUBLIC_PAGESPEED_API_KEY` is configured, returning actionable metrics for automation scripts.
- **WhatsApp Business API**
  - `lib/whatsapp-business.ts` and `/api/whatsapp/webhook` expect the `WHATSAPP_*` credential set. Route handles verify token challenge and inbound message logging.

## API Surface (Next.js App Router)
- `POST /api/upload-photo` – Notion file upload pipeline.
- `POST /api/notion-direct-v2` – Main CRM writer; validates required lead fields, constructs Notion properties, and handles data-source vs legacy parent.
- `GET|POST /api/google-ads` – Campaign management + keyword/optimisation actions.
- `GET /api/google-ads-integration` – GA4/Notion driven automation helpers (multiple `action` query modes).
- `GET /api/debug-env` – Quick Notion credential probe.
- `POST /api/whatsapp/webhook` – WhatsApp Business verification + inbound hook.
- Legacy routes under `app/api/notion` and `app/api/notion-direct` remain for backwards compatibility—prefer the `-v2` endpoint.

## Scripts & Tooling (`scripts/`)
Key helpers live here—invoke with `node`/`bash` as appropriate:
- Notion schema + diagnostics: `create-database*.cjs`, `test-notion*.cjs`, `debug-env.cjs`
- Google Ads utilities: `google-ads-automation.cjs`, `check-google-apis.cjs`, `enable-ga4-api.cjs`
- Dev ergonomics: `dev-server.sh`, `compress-images.sh`, `set-vercel-env-vars.sh`
Use these instead of reinventing CLI tasks; most scripts expect the env vars defined below.

## Environment Variables
Define in `.env.local` (never commit secrets) and keep Vercel in sync.

**Public:**
- `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CASE_STUDY_URL`
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GA_TRACKING_ENABLED`
- `NEXT_PUBLIC_PAGESPEED_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY`

**Server-only:**
- `NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NOTION_DATA_SOURCE_ID` (optional), `NOTION_PARENT_PAGE_ID` (legacy scripts)
- `EMAILJS_PRIVATE_KEY` (if using secured EmailJS features)
- Google Ads suite: `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`
- WhatsApp: `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

Missing credentials should be stubbed with placeholders locally but never shipped to git.

## Local Development Workflow
- Install deps: `npm install`
- Start dev server: `npm run dev` (or `./scripts/dev-server.sh` for smart port handling + auto-open)
- Build: `npm run build`
- Lint: `npm run lint`
- Playwright E2E: `npm run test:e2e` (`npm run test:e2e:headed` for debugging)
- Jest unit tests: `npm test`, coverage via `npm run test:coverage`

The Playwright config boots the dev server on port 3001 automatically; ensure nothing else locks that port.

## Testing & QA Expectations
- Contact form changes require rerunning relevant specs in `tests/e2e/contact-form-submission.spec.ts` and `tests/e2e/form-validation-comprehensive.spec.ts`.
- ReCAPTCHA modifications should validate against `tests/e2e/recaptcha-debug.spec.ts`.
- Keep Jest component tests under `tests/unit` or co-located `*.test.tsx` files—`jest.config.js` includes `app/`, `components/`, and `lib/` globs.
- When UI output shifts, capture a Playwright MCP snapshot per internal policy (defaults: 1440×900, `http://localhost:3000`).

## Brand & Content Guardrails
- Primary palette: black background, accent red `#E11D2A`, white text.
- Logos and photography live under `public/` and `content/image-manifest.ts`. Use `next/image` with descriptive `alt` text.
- Contact details must stay consistent with the footer (address, phone `01458 860 339`, email `info@somersetwindowcleaning.co.uk`).
- Structured data lives in `components/StructuredData.tsx`; keep metadata synchronized when editing business info.

## Repo Conduct
- Do not push to remote or trigger Vercel deploys without explicit user approval.
- Prefer updating existing utilities/components over creating divergent implementations.
- If unexpected filesystem changes appear that you did not make, stop and ask the user how to proceed.
