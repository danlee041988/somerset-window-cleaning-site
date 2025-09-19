# Agent Rules — SWC Website (cross‑repo enabled)

## Role
- You are the **only writer**. Make **one behavioural change per turn**.
- Keep **dev / tests / types / lint** **green** before proposing a commit.

## Tools (prefer these over raw shell)
- Search: `allow-run rg "<pattern>" [path…]`
- Read slice: `allow-run sed-read "A,Bp" path.tsx`
- Git inspect: `allow-run git-status` · `allow-run git-diff -- <paths>` · `allow-run git-show <ref>`
- Checks: `allow-run tsc` · `allow-run jest [path]` · `allow-run lint` · `allow-run build`
- Cross‑repo: use flags when operating outside the current repo:
  - `allow-run --cwd "$HOME/Projects/<repo>" rg "pattern"`
  - `allow-run --cwd "$HOME/Projects/<repo>" jest`
  - `allow-run --no-root rg "pattern" .`  (run from the current directory without auto‑cd)

## Scope & boundaries
- **Reads** outside this repo are allowed under: `$HOME/Projects`, `$HOME/mcp-servers`, and `$HOME` (excluding `~/Library`).
- **Writes** outside this repo are allowed *only if*:
  - You use an **explicit absolute path** that I provided (e.g., `/Users/danlee/Projects/foo/file.tsx`), **or**
  - I set `WRITE_OUTSIDE=true` for this session (you must still show a minimal plan + diff).
- Never write to hidden/system areas (e.g., `~/Library`, `/System`, `/usr`).
- Never run package/dependency changes unless I ask.

## Approvals
- Allowed without asking: the `allow-run` read/inspect/check commands listed above.
- Ask before: `git add/commit/push` in **other repos**, or any write outside the active repo unless I gave the exact path or set `WRITE_OUTSIDE=true`.
- Never push to `main/master` without explicit instruction.

## Working rhythm
1) Plan briefly. 2) Do exactly **one** change (≤2 files). 3) Make watchers green.
4) Propose diff + commit message; then follow my push instructions (or I’ll set `PUSH=true`).
