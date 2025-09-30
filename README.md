# Somerset Window Cleaning Website

TypeScript Next.js site for Somerset Window Cleaning. Black-first theme with bright red accents, white text, and a single EmailJS-powered booking form.

## Tech
- Next.js 14 (App Router)
- Tailwind CSS
- React Hook Form
- EmailJS (client SDK)

## Getting Started
1. Install deps:
   npm install

2. Configure environment:
   - Copy `.env.example` to `.env.local`
   - Add `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`, `NEXT_PUBLIC_EMAILJS_SERVICE_ID`, `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - Add `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` (production) and optionally `NEXT_PUBLIC_RECAPTCHA_SITE_KEY_LOCAL` for localhost runs
   - Add Notion integration secrets: `NOTION_API_TOKEN` and `NOTION_WEBSITE_CUSTOMERS_DB_ID` (see [Notion authorization best practices](https://developers.notion.com/docs/authorization))
   - Optional: store the same values in `~/.secrets/notion_token` and run `source scripts/load-notion-token.sh` for each new shell session so the API client can sync bookings automatically

3. Run dev server:
   npm run dev

### Secrets via macOS Keychain
- Store sensitive values in the macOS Keychain so they never live in plaintext `.env` files. The project script expects entries named `swc-<secret-name>`.
  ```sh
  security add-generic-password -a "$USER" -s swc-emailjs-private-key -w "YOUR_VALUE" -U
  security add-generic-password -a "$USER" -s swc-google-ads-client-secret -w "YOUR_VALUE" -U
  security add-generic-password -a "$USER" -s swc-pagespeed-api-key -w "YOUR_PAGESPEED_API_KEY" -U
  ```
- The helper `scripts/load-secrets.sh` pulls those values into environment variables; it runs automatically from `npm run dev`. You can also source it manually for ad-hoc scripts:
  ```sh
  source scripts/load-secrets.sh
  npm run build
  ```
- Adjust the account with `export SWC_KEYCHAIN_ACCOUNT="service-user"` or the prefix with `export SWC_KEYCHAIN_PREFIX="swc-prod"` before sourcing if you maintain multiple keychains.
- Migrating an existing `.env.local`? Run `./scripts/import-env-to-keychain.sh .env.local` once to populate the Keychain, then empty or delete the file.
- CI requires the same secrets. In GitHub, add `PAGE_SPEED_API_KEY` (and the Google Ads/Notion keys you use locally) to the repository secrets so automation workflows run.

### Local Dev Troubleshooting

- If you see “Cannot find module './682.js'” or “missing required error components”:
  - Stop any running dev servers (kill Node on ports 3000/3001)
  - Remove the build cache: `rm -rf .next`
  - Start fresh: `npm run dev:3000` (or `npm run dev:clean`)

- If port 3000 is blocked:
  - `npm run dev -- -p 3001` and open http://localhost:3001

- Fonts: We removed remote Google Fonts to avoid network dependency locally. We can switch to self‑hosted fonts later.

- reCAPTCHA disabled locally:
  - Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY_LOCAL` in `.env.local` to the Booking Form key, or rely on the built-in Google test key for development only.

## Alternate Preview (No Dev Server)
If localhost ports are blocked, build a static export and serve it on a different port:

1) Build static files:
   npm run build:static

2) Serve the `out/` directory:
   npm run preview:static

Then open:
   http://localhost:4321

## EmailJS Template
Map your template variables to the following keys:
- name, email, phone, postcode, service, message, submitted_at

## Deploy (Vercel)
- Project root: `CODEX_SWC_WEBSITE`
- Build command: `next build`
- Output: `.next`
- Set env vars in Vercel for Production and Preview.

## Pages
- `/` Home (hero, services preview, CTA)
- `/services` Services
- `/book-appointment` Booking + enquiry form (EmailJS)
- Auto-generated: `/robots.txt`, `/sitemap.xml`

## Structure

- `app/(marketing)/` – public pages (home, services, booking, etc.)
- `app/(internal)/` – admin dashboards and operational tooling
- `app/api/` – API routes for EmailJS helpers, GA, Google Ads, etc.
- `components/ui/` – reusable UI primitives (buttons, layouts, logo, etc.)
- `components/features/` – feature modules (contact/quote flow, etc.)
- `content/` – structured content & data (images, services, etc.)
- `lib/` – utilities (analytics, pricing, integrations, config helpers)
- `public/` – static assets
- `scripts/` – automation tasks
- `tests/unit` – component/unit tests (Jest/Vitest-compatible)
- `tests/e2e` – Playwright end-to-end specs

## Brand
- Black: `#0B0B0B`
- Red: `#E11D2A`
- White: `#FFFFFF`
