# Memory Playbook

## Overview
- MCP server `memory` runs via `npx @modelcontextprotocol/server-memory` (configured in `~/.codex/config.toml`).
- Persistent store lives at `~/.codex/memory/memory.jsonl` and uses newline-delimited JSON for entities and relations.
- Use the MCP tools, not manual edits, once the store is bootstrapped to preserve dedupe and validation behavior.

## Schema
- **Entity naming**: `SWC_<Domain>_<Subject>` (e.g., `SWC_Project_Website`, `SWC_Process_GoogleAds`). Keep names stable so relations remain valid.
- **Entity types**: `project`, `service`, `process`, `policy`, `environment`, `person`, etc. Align with Context7 docs for consistent search.
- **Observations**: One fact per string; include effective dates in parentheses where helpful; avoid chained statements.
- **Relations**: Active-voice verb phrase (`deploys_to`, `supports`, `governs`, `hosted_on`). Directed edges only; add both directions only when needed semantically.

## Session Ritual
1. Start with `Remembering...` so Codex knows to pull memory before acting.
2. Call `memory.search_nodes` or `memory.open_nodes` for the target scope (e.g., `SWC_Project_Website`, `SWC_Service_Vercel`).
3. Summarize what came back, confirm relevance, then proceed with coding or ops tasks.
4. When decisions or discoveries occur, log them immediately with `memory.add_observations` (or `create_entities` / `create_relations` if new nodes are needed).

## Updating Memory
- **New entity**: `memory.create_entities -> { entities: [{ name: "SWC_Service_NewTool", entityType: "service", observations: ["Short factual note."] }] }`.
- **New relation**: `memory.create_relations -> { relations: [{ from: "SWC_Project_Website", to: "SWC_Service_NewTool", relationType: "uses" }] }`.
- **Add fact**: `memory.add_observations -> { observations: [{ entityName: "SWC_Process_GoogleAds", contents: ["Daily sync skipped when spend < £20 (noted 2025-09-30)."] }] }`.
- Capture context right after it is confirmed; include timestamps or owners in the observation text when they matter.

## Hygiene (Monthly)
- Run `memory.read_graph` to review placeholders and stale items.
- Trim outdated facts with `memory.delete_observations` and remove unused nodes via `memory.delete_entities`.
- For living processes, prefer appending superseding observations rather than rewriting history.
- Keep a changelog entry (e.g., in `docs/ads/changelog.md`) whenever substantial pruning or schema adjustments occur.

## Tool Cheat Sheet
- `memory.search_nodes -> { query: "Google Ads" }` – fuzzy search across names, types, and observation text.
- `memory.open_nodes -> { names: ["SWC_Project_Website", "SWC_Env_Prod"] }` – load a precise slice with related edges.
- `memory.read_graph` – export the full graph when you need a holistic audit.
- `memory.delete_observations` / `memory.delete_relations` – clean up superseded facts or links.
