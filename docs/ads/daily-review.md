# Daily Google Ads & Analytics Review

1. **Prepare environment**
   - `source scripts/load-secrets.sh`
   - Launch GA Tag Assistant (spot-check a live form submission if time allows).

2. **Sync Google Ads account**
   - `npm exec tsx scripts/google-ads-daily-sync.ts`
   - Script now performs:
     - campaign plan enforcement
     - negative keyword sync
     - extension audit
     - automation adjustments
     - GA4 snapshot (`docs/ads/history/<date>-ga4.json`)
     - Google Ads snapshot (`docs/ads/history/<date>-snapshot.json`)

3. **Check outputs**
 - Review `docs/ads/history/<date>-run.log` for:
     - ❗️ GA4 focus metrics (form_start, form_submit, quote_request, recaptcha_complete, conversion)
     - campaign spend, impressions, and automation notes
  - Compare GA4 `form_submit` + `conversion` counts vs Google Ads conversions last 7 days; investigate gaps >10%.
  - Optional deep-dives:
    - `npm exec tsx scripts/google-ads-report-search-terms.ts` → top queries from the last 7 days
    - `npm exec tsx scripts/google-ads-report-auction-share.ts` → impression share & lost IS by campaign
    - `npm exec tsx scripts/google-ads-report-cpc-trends.ts` → daily CPC & cost trend for the last 30 days

4. **Health checks**
   - `npm exec tsx scripts/google-ads-health-check.ts`
   - Note blockers (keyword coverage, ad approvals) in `docs/ads/changelog.md`.

5. **UI pass**
   - Clear Google Ads UI recommendations or document deferrals.
   - Verify disapprovals / limited issues resolved.

6. **Changelog update**
   - Append summary to `docs/ads/changelog.md` (spend, leads, issues, actions).
   - Flag follow-ups (e.g., GA4 <> Ads deltas, seasonal bid recs) for next session.

7. **Weekly cross-check** (every Monday)
 - Run GAQL performance snapshot comparing imported conversions vs GA4 counts.
  - Record findings in changelog.

8. **Forecast experiments (ad-hoc)**
  - Evaluate new services/keywords with `npm exec tsx scripts/google-ads-forecast-keywords.ts "keyword 1" "keyword 2"`
  - Pull current Google recommendations when needed: `npm exec tsx scripts/google-ads-fetch-recommendations.ts`

> Tip: `docs/ads/history/` retains JSON snapshots for Ads and GA4—use them for troubleshooting anomalies.
