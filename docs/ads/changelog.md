# Google Ads Changelog

| Date | Update | Notes |
| 2025-09-29 | Added GA4 snapshot + key events to daily sync. | GA4 property 485470042 now tracks form_start/form_submit/quote_request/recaptcha_complete as key events. `scripts/ga4-daily-snapshot.ts` runs inside the daily sync to log 7/30 day counts in `docs/ads/history/*-ga4.json`; awaiting GA4↔Ads link to import conversions. |
| 2025-09-29 | Added GAQL reporting + keyword forecast utilities. | New scripts: `google-ads-report-search-terms.ts`, `google-ads-report-auction-share.ts`, `google-ads-report-cpc-trends.ts`, `google-ads-fetch-recommendations.ts`, and `google-ads-forecast-keywords.ts` for search-term/auction/CPC insights, pulling Google Ads recommendations, and estimating keyword bids. Daily review doc updated with optional steps. |
| 2025-09-29 | Automation running live with presence-aware postcode enforcement. | Enabled non-dry-run daily sync, guarded geo targeting for Search campaigns only, and confirmed 40 postcode sectors remain aligned across site + config. |
| 2025-09-28 | Declined Google “Add broad match keywords” recommendation. | Kept campaigns on current exact/phrase structure until conversion tracking is verified. Plan: verify tags, then run controlled broad-match test with tight negatives if needed. |
| 2025-09-23 | Initial growth plan documented; directories created (`plan.md`, `checklist.md`, `negatives.csv`, `keywords-seed.csv`, `measurement.md`). | Tier-2 areas, budgets, and CPA targets confirmed (Balanced profile). Awaiting final sitelink copy approval. Account ID confirmed as 447-417-5960. Conversion actions created via API: Quote (7315784824), Contact (7316082381), Phone Click (7316082384). |
| 2025-09-25 | Keyword sync automation added. | `scripts/google-ads-sync-keywords.ts` reads `docs/ads/keywords-seed.csv` and creates any missing keywords per campaign/ad group. |
| 2025-09-25 | Added automation scripts for plan enforcement & budgets. | `scripts/google-ads-apply-plan.ts`, `...-daily-sync.ts`, and helpers now live in repo; schedule or run manually once credentials confirmed. |
| 2025-09-25 | Expanded 100-keyword negative list (docs/ads/negatives.csv). | Scripts will sync the list across all search campaigns; rerun after any edits. |
| 2025-09-25 | Prepared legacy campaign cleanup script. | `scripts/google-ads-remove-legacy.ts` pauses/deletes the auto-generated UK-wide campaigns when approved. |
| 2025-09-26 | Refined negative keywords to avoid conflicts with downpipe service terms. | Replaced generic `downpipe` negatives with supply-focused phrases and re-synced to campaigns. |
| 2025-09-26 | Updated sitelink assets with dual-line descriptions and correct URLs. | Script now patches existing assets so Google Ads sees full text (`scripts/google-ads-ensure-extensions.ts`). |
| 2025-09-26 | Added health-check script to flag ad groups without serving assets. | `scripts/google-ads-health-check.ts` verifies enabled keywords/URL rules and ads during daily review. |
| 2025-09-27 | Attached "All visitors (AdWords)" audience list to every active ad group. | `scripts/google-ads-ensure-audiences.ts` keeps the observation list enabled so Google Ads Editor no longer warns about missing audience segments. |
| 2025-09-27 | Adjusted CPC bids for weekend test. | `scripts/google-ads-set-manual-cpc.ts` now sets Gutter £1.80, Conservatory £1.70, Solar £1.70 with Windows & Brand remaining at £2.00 to stimulate impressions. |
| 2025-09-27 | Created dedicated lead conversion actions (Quote, Contact, Phone). | `scripts/google-ads-create-conversions.ts` now provisions the GTM-linked Google Ads conversions (IDs 7320683703/7320683706/7320683709). |
| 2025-09-27 | Added Wedmore (BS28) to Tier-1 service area targeting. | Updated `config/google-ads/service-areas.json` and reran the daily sync so Wedmore is enforced for every search campaign. |

| 2025-09-23 | Added GTM workspace import file (`gtm-import-lead-conversions.json`) containing data-layer variables, triggers, and Google Ads conversion tags. | Pending import into GTM-WX8SLXJV and publish. |
