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
