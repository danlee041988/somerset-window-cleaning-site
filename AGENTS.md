# Repository Guidelines

## Project Structure & Module Organization
- `app/(marketing)` contains all public-facing routes; `app/(internal)` holds operational tooling; `app/api` exposes server routes (EmailJS, analytics, Google Ads, Notion sync).
- `components/ui` and `components/features` provide reusable primitives and feature blocks; keep shared logic in `lib/` (analytics, config, server helpers).
- Static content lives in `public/` and `content/`; automated scripts reside in `scripts/`; tests are split into `tests/unit` (Jest) and `tests/e2e` (Playwright).

## Build, Test, and Development Commands
- `npm run dev` – Next.js dev server with live reload.
- `npm run build` / `npm run start` – production build and server.
- `npm run lint` – ESLint + Next.js rules; run before commit.
- `npm test -- --watch=false` – Jest unit suite.
- `npx playwright test` – E2E smoke tests (headed/CI configs available).

## Coding Style & Naming Conventions
- TypeScript throughout; prefer named exports for utilities. Two-space indentation, Prettier defaults.
- React components in PascalCase; test files use `<feature>.spec.ts`.
- Tailwind for styling; order classes layout → spacing → color; use `clsx` helpers when composing.

## Testing Guidelines
- Jest covers validation, components, and booking logic; place fixtures under `tests/mocks` when needed.
- Playwright specs target booking/contact flows; capture artifacts in `test-results/` when failures occur.
- Add regression tests for bug fixes; keep CI green by running unit + relevant e2e specs locally.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`feat:`, `fix:`, `chore:`). Group related changes and include screenshots for UI adjustments.
- PRs should describe scope, list affected routes/components, link issues, and note manual test steps.

## Security & Configuration Tips
- Sensitive secrets (Notion, EmailJS private key, Google Ads, WhatsApp, etc.) live in the macOS Keychain under the `swc-<name>` convention. Run `source scripts/load-secrets.sh` at the start of every shell session to populate `process.env` before touching APIs; the script is already sourced automatically by `npm run dev`.
- To migrate an existing `.env.local` into Keychain, execute `./scripts/import-env-to-keychain.sh .env.local` once, then clear the file. All tracked `.env*` files contain placeholders only.
- Never commit API keys. For CI/Vercel, rely on managed secrets (`vercel env pull`) and keep Keychain entries in sync.
- Run `npx lighthouse <url>` (desktop + mobile) or `scripts/performance-audit.cjs` to monitor Core Web Vitals.

## Google Ads Daily Workflow (Codex default)
- Before taking any Ads action, review `docs/ads/daily-review.md` so the current cadence (daily sync, health check, Tag Assistant runs, changelog updates) is understood.
- Run `npx tsx scripts/google-ads-daily-sync.ts` and `npx tsx scripts/google-ads-health-check.ts` at the start of a session; they enforce budgets/negatives and catch “no active keywords/URL rule” issues Google Ads Editor flags.
- Use Context7 (`/websites/developers_google_com-google-ads-api-docs`) and REF searches for best-practice validation whenever diagnosing warnings or planning changes.
- Log every Ads recommendation review or change in `docs/ads/changelog.md` so subsequent chats inherit the exact state and outstanding tasks.

## Memory Server Workflow
- Codex loads the local knowledge graph via the `memory` MCP server defined in `~/.codex/config.toml`; data persists at `~/.codex/memory/memory.jsonl`.
- Begin each session by saying `Remembering...` and calling `search_nodes` or `open_nodes` for the feature area (e.g., `SWC_Project_Website`, `SWC_Process_GoogleAds`) so only relevant context is injected.
- When new facts land, prefer the MCP tools (`create_entities`, `create_relations`, `add_observations`) instead of editing the JSONL by hand; capture one fact per observation and keep entity names stable with the `SWC_` prefix.
- After major decisions, immediately add observations linking them to the right entities or relations (example prompt: `memory.add_observations -> { entityName: "SWC_Policy_QuoteSLA", contents: ["Quote requests must receive a human response within 2 business hours (set 2025-09-30)."] }`).
- Run a quick hygiene pass monthly: `read_graph` to scan for stale placeholders, prune with `delete_observations`, and archive anything older than 90 days unless it is policy-level guidance.
- If Codex cannot find a concept in memory, fall back to AGENTS.md / docs, then write the distilled decision back into memory so future chats skip the search.

