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
- Store secrets in `.env.local` (gitignored) or `~/.secrets`; load Notion credentials via `source scripts/load-notion-token.sh`.
- Keep Vercel, GA, and Google Ads tokens in the macOS Keychain or CI secret store; never commit API keys.
- Run `npx lighthouse <url>` (desktop + mobile) or `scripts/performance-audit.cjs` to monitor Core Web Vitals.
