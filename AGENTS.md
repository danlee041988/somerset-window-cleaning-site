# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router entrypoints, route segments, and server components that drive public pages.
- `components/`: Reusable React UI blocks; colocated styles live alongside their TSX implementation.
- `lib/`: Shared utilities (validation, API clients, analytics) used by both server and client modules.
- `content/` and `public/`: Marketing copy, images, and data consumed at build time; update in tandem with design changes.
- `tests/` and `test-results/`: Jest unit specs and captured regression artifacts; Playwright specs reside in the repo root.
- `scripts/`: Shell and Node helpers for local workflows (`scripts/dev-server.sh`, `scripts/build-image-manifest.mjs`).

## Build, Test, and Development Commands
- `npm run dev`: Starts the enhanced dev server proxying to Next on port 3000 with static previews.
- `npm run dev:3000` / `npm run dev:fallback`: Raw Next.js dev servers for quick isolates.
- `npm run build` then `npm run start`: Compile and serve the production bundle.
- `npm run lint`: ESLint + Next.js rules; run before pushing UI changes.
- `npm test`, `npm run test:watch`, `npm run test:coverage`: Jest suites for forms, validation, and utilities.
- `npm run test:e2e` (or `:headed`): Playwright smoke tests around the contact and booking flows.

## Coding Style & Naming Conventions
- TypeScript with strict exports; prefer named exports from utilities (`lib/`) to aid tree-shaking.
- Favor functional React components with hooks; keep server logic in `app/api` or `lib/server` helpers.
- Tailwind CSS drives styling; compose classes via `clsx`. Keep class sequences logical (layout → spacing → typography).
- Two-space indentation, Prettier-compatible formatting, and ESLint autofix (`npm run lint -- --fix`) encouraged.
- Name test files `<feature>.spec.ts` and React components in PascalCase.

## Testing Guidelines
- Co-locate unit specs under `tests/` mirroring source structure; mock external services via fixtures in `tests/mocks`.
- Keep Playwright specs deterministic; record failures into `test-results/` for review before re-running.
- Maintain meaningful coverage on form validation and API handlers; add regression tests for bug fixes.

## Commit & Pull Request Guidelines
- Follow Conventional Commits (`fix:`, `refactor:`, `chore:`) as seen in recent history (e.g., `fix: tighten mobile header...`).
- Limit commits to a focused change-set with accompanying tests or screenshots for UI updates.
- PRs should summarize impact, list affected routes/components, link tracking issues, and note any follow-up tasks.
- Verify `npm run lint` and relevant tests locally before requesting review.

## Agent Rules — SWC (Lite)
- You are the only writer. One behavioural change per turn (≤2 files, ≤80 LOC).
- Keep dev/tests/types/lint green before proposing a commit.
- Prefer: `rg`, `sed -n`, `git status/diff/show`, npm scripts. Minimal direct edits.
- No renames/moves or dependency changes unless requested.
- You may work outside this repo when asked (full filesystem allowed).
- Show diff plus a concise commit message when green.

## Secrets & Environment Handling
- Per Notion security guidance (Context7 `/websites/developers_notion`, *Securely Handling Integration Tokens*), keep tokens out of source control and load them from environment variables or a secrets manager.
- Store `NOTION_API_TOKEN` and `NOTION_WEBSITE_CUSTOMERS_DB_ID` in a gitignored `.env.local` **or** in `~/.secrets/notion_token` and source via `scripts/load-notion-token.sh` before running the app.
- Continue keeping `VERCEL_TOKEN` (and any additional API keys) outside the repo. macOS Keychain is fine, but prefer the same env var pattern for consistency.
- Never echo secrets into the terminal logs; scrub command history when pasting tokens.

## Context7 Usage
- Before adopting or changing implementation patterns, consult Context7 docs relevant to the framework/library and prefer their recommended components/APIs (e.g. `<GoogleTagManager>` for GTM in Next.js).
- Link the specific snippet/ID in commits touching those areas so reviewers know which guidance was followed.
