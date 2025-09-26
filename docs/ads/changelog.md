# Google Ads Changelog

| Date | Update | Notes |
| --- | --- | --- |
| 2025-09-23 | Initial growth plan documented; directories created (`plan.md`, `checklist.md`, `negatives.csv`, `keywords-seed.csv`, `measurement.md`). | Tier-2 areas, budgets, and CPA targets confirmed (Balanced profile). Awaiting final sitelink copy approval. Account ID confirmed as 447-417-5960. Conversion actions created via API: Quote (7315784824), Contact (7316082381), Phone Click (7316082384). |
| 2025-09-25 | Keyword sync automation added. | `scripts/google-ads-sync-keywords.ts` reads `docs/ads/keywords-seed.csv` and creates any missing keywords per campaign/ad group. |
| 2025-09-25 | Added automation scripts for plan enforcement & budgets. | `scripts/google-ads-apply-plan.ts`, `...-daily-sync.ts`, and helpers now live in repo; schedule or run manually once credentials confirmed. |
| 2025-09-25 | Expanded 100-keyword negative list (docs/ads/negatives.csv). | Scripts will sync the list across all search campaigns; rerun after any edits. |
| 2025-09-25 | Prepared legacy campaign cleanup script. | `scripts/google-ads-remove-legacy.ts` pauses/deletes the auto-generated UK-wide campaigns when approved. |

| 2025-09-23 | Added GTM workspace import file (`gtm-import-lead-conversions.json`) containing data-layer variables, triggers, and Google Ads conversion tags. | Pending import into GTM-WX8SLXJV and publish. |
