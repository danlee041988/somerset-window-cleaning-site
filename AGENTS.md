# Somerset Window Cleaning – Agent Guide

This document gives agents working on this repository the guardrails, tech context, and conventions to follow. Its scope is the entire repository.

## Tech Stack
- Next.js 14 (App Router) + React 18 + TypeScript
- Tailwind CSS
- EmailJS for form submissions (`@emailjs/browser`)
- Node.js >= 18.17 (see `package.json#engines`)
- Path alias: `@/*` → project root (see `tsconfig.json`)

## Commands
- Dev: `npm run dev` (or `npm run dev:3000`)
- Build: `npm run build`
- Generate image manifest: `npm run gen:images`
- E2E tests (Playwright): `npm run test:e2e` (headed: `npm run test:e2e:headed`)

## Environment Variables
Set these for local dev and on Vercel:
- `NEXT_PUBLIC_SITE_URL` – absolute site URL (used in structured data/metadata)
- `NEXT_PUBLIC_CASE_STUDY_URL` – council case study link
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` – EmailJS public key
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID` – EmailJS service ID
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` – EmailJS template ID
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` – reCAPTCHA v2 (checkbox) site key (optional; UI loads only on Step 4)

Server-side integrations also expect:
- `NOTION_API_KEY` and `NOTION_DATABASE_ID` – required for `/api/notion` and `/api/notion-direct`
- `GOOGLE_ADS_CUSTOMER_ID`, `GOOGLE_ADS_DEVELOPER_TOKEN`, `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN` – Google Ads API access
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` plus `NEXT_PUBLIC_GA_TRACKING_ENABLED=true` – enable GA4 analytics hooks
- `NEXT_PUBLIC_PAGESPEED_API_KEY` – PageSpeed Insights monitoring (`lib/pagespeed.ts`)
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` – required for `/api/whatsapp/webhook` verification callbacks

## Branding & Content
- Theme: black/red/white.
- Logos: `public/Codex SWC Photos/SWC Logo.png` used in header/footer; keep header/footer logos prominent.
- Photos: keep all provided photos; use `next/image` with meaningful `alt` text.
- Contact details (live):
  - Address: 13 Rockhaven Business Centre, Gravenchon Way, BA16 0HW, UK
  - Phone: `01458 860 339`
  - Email: `info@somersetwindowcleaning.co.uk`
  - WhatsApp: `447415526331` (via `components/WhatsAppButton.tsx`)
- Case study: include Somerset Council case study with council logo from local photos (see `components/CaseStudy.tsx`).

## SEO & Accessibility
- Metadata base URL comes from `NEXT_PUBLIC_SITE_URL`.
- JSON‑LD: `components/StructuredData.tsx` defines a LocalBusiness schema. Keep contact/address in sync with Footer.
- Sitemap/robots present under `app/sitemap.ts` and `app/robots.ts`.
- Use `next/image` everywhere possible; provide descriptive `alt` and sensible `sizes`.

## Quote Flow (Source of Truth)
- The quote journey is intentionally 4 steps:
  1) Property
  2) Prices & Services
  3) Contact & Schedule
  4) T&Cs & Book
- Implemented in `components/QuoteForm.tsx` with React Hook Form.
- Avoid dropdowns where possible; use pills/cards/matrix selectors.
- Show “from” prices inside the controls themselves.

### Pricing Rules
Pricing logic is centralized in `lib/pricing.ts`. Do not duplicate pricing rules in components.
- Window Cleaning: exterior only; bedrooms-based base price.
  - Detached: +£5
  - Conservatory: +£5 (if present)
  - Extension: +£5 (if present)
  - Frequency: 4‑/8‑weekly same; ad‑hoc +£10
  - 6+ bedrooms: POA
- Gutter Clearing: bedrooms-based base price (+ detached + extensions as above)
- Fascias & Soffits Cleaning: `gutter price + £15`
- Offer: Windows are FREE when BOTH Gutter Clearing AND Fascias & Soffits are selected.
- Conservatory Roof Cleaning / Solar Panel Cleaning / External Commercial Cleaning: POA.

If pricing changes, edit only `lib/pricing.ts` and adjust UI labels accordingly.

### Forms & Anti‑spam
- Quote form uses EmailJS `sendForm`.
- Anti‑spam: hidden honeypot `website`, time‑trap (>= ~1.2s), optional reCAPTCHA v2 checkbox on Step 4.
- Photos: allow up to 5 images, each ≤ 10MB.
- First clean date must be a weekday (Mon–Fri).

## Images
- Image manifest lives in `content/image-manifest.ts`; generator in `scripts/build-image-manifest.mjs`.
- Photos are under `public/images/photos/` and mapped into components where needed.

## Code Style & Conventions
- Keep changes minimal and scoped; prefer refactors over hacks.
- Use TypeScript types from `lib/pricing.ts` for services, bedrooms, property types, and frequency.
- Prefer `next/image`, semantic HTML, and accessible labels/aria.
- Maintain consistent Tailwind classes; avoid inline styles unless necessary.
- Do not add licenses/headers.

## Deployment & Repo Policy
- Do NOT push to GitHub unless explicitly approved by the user.
- Deploy to Vercel only when requested.
- Keep env vars in Vercel in sync with `.env.example` (do not commit real keys).

## Testing (Playwright)
- We use Playwright for E2E checks of the quote flow and pricing.
- First-time setup locally:
  - `npm i -D @playwright/test`
  - `npx playwright install --with-deps`
- Run: `npm run test:e2e` (or `npm run test:e2e:headed`). The config launches `npm run dev:3000` and hits `http://localhost:3000`.
- Tests stub EmailJS requests; reCAPTCHA is not required unless the site key is set.
- Prefer `data-testid` selectors for stability; key hooks exist on steps, nav buttons, and summary.

## Context7 Docs Policy
- Use Context7 to fetch up‑to‑date docs for libraries used here (Next.js, Tailwind, Playwright) when APIs or best practices are unclear.
- Prefer packages declared in `package.json`. If a Context7 ID is provided (e.g., `/vercel/next.js`), use it directly.
- Flow: resolve library → fetch docs (optionally scoped by topic like `routing`, `images`, `app-router`) → apply changes.
- Match versions where practical (e.g., Next 14). Keep fetch size small and focused; expand only when needed.
- If multiple matches appear or intent is ambiguous, ask for brief clarification before proceeding.

## Playwright MCP Snapshot Policy
- After a change affecting UI output, take a quick visual snapshot via the Playwright MCP `page_snapshot` tool.
- Defaults: `url = http://localhost:3000`, `fullPage = false`, `width = 1440`, `height = 900`.
- Store output under `~/.playwright-mcp/` (or use `PLAYWRIGHT_SNAPSHOT_DIR`).
- Example tool args: `{ "url": "http://localhost:3000", "fullPage": true }`.
- Purpose: verify visuals locally without exposing the site or relying on public URLs.

## API Reference
- `/api/notion-direct` is the primary Notion writer; expects the customer payload in the “Somerset Window Cleaning API” doc (includes `addressValidation`, `customerPhotos`, pricing hints). Missing required fields return `400` with an `error` string (no `success` flag); successful requests return `{ success, customerId, url }`.
- `/api/notion` remains as the typed wrapper around `lib/notion.ts#createNotionCustomer` using the same core fields; the Notion data model lives in `lib/notion.ts` (`NotionCustomerData`).
- `/api/upload-photo` accepts multipart uploads (`file`, `filename`), enforces ≤10 MB and JPEG/PNG/WebP/HEIC types, and responds with `{ success, fileUploadId, filename, size, type }` on success.
- `/api/google-ads` wraps `lib/google-ads.ts` with `GET ?action=` handlers (`campaigns`, `keywords`, `performance`, `recommendations`, `weekly-report`, `auto-optimize`) and `POST ?action=` handlers (`update-budget`, `update-keyword-bid`, `add-negative-keyword`, `optimize-with-notion-data`, `execute-optimizations`). Auth is OAuth2 via the Google Ads refresh token.
- `/api/google-ads-integration` combines Notion and GA4 data for recommendations. Its `integration-status` check currently looks for `NOTION_TOKEN`; make sure to set that or update the code to use `NOTION_API_KEY` before relying on it.
- `/api/whatsapp/webhook` handles the Business API challenge/response using `WHATSAPP_WEBHOOK_VERIFY_TOKEN` and processes inbound messages (tracking hooks live in `lib/analytics.ts`). `/api/debug-env` is a lightweight Notion credential validator.
- Supporting analytics utilities live in `lib/analytics.ts` (GA4 events require `NEXT_PUBLIC_GA_TRACKING_ENABLED=true`) and `lib/pagespeed.ts` (needs `NEXT_PUBLIC_PAGESPEED_API_KEY`).

## Open Items / Nice‑to‑haves
- Add small tooltips/modifiers under the Window card (Detached +£5, etc.).
- Optional: sticky summary on desktop for Step 2.
- Review “6+” handling for gutter if business prefers POA there as well.

## Troubleshooting
- If builds fail locally due to environment permissions, try running outside restricted sandboxes.
- Common Next.js issues: image domains/sizes, missing env during build (ensure public vars set), TS path alias.
