# Google Ads Launch & Optimisation Checklist

## Pre-Launch
- [ ] Confirm Tier-1 and Tier-2 service areas with Dan.
- [ ] Set CPA targets per service (window default £25).
- [ ] Create conversion actions in Google Ads (Quote form, Contact form, Phone click).
- [ ] Implement tags via GTM (`GT-WF6J3RVS`) and enable Enhanced Conversions.
- [ ] Verify tag firing with Tag Assistant and live test conversions.
- [ ] Draft RSA copy (business-hours + off-hours variants) and ensure landing pages contain proof points used in ads.
- [ ] Rewrite sitelinks to comply with policy; map to relevant URLs.
- [ ] Upload starter negative list (`negatives.csv`) and seed keywords (`keywords-seed.csv`).
- [ ] Build Search campaigns per service + Brand; set budgets, ad schedules (08:00–20:00), call asset schedule (09:00–16:00).
- [ ] Load ad extensions (callouts, structured snippets, call asset, sitelinks).
- [ ] QA the account (location targeting, conversion column, attribution model Data-driven).

## Launch Week (Days 1–7)
- [ ] Monitor spend vs. daily caps twice per day.
- [ ] Review search terms daily; add negatives, promote strong phrases to exact.
- [ ] Check for disapprovals or limited learning issues.
- [ ] Confirm call asset only active 09:00–16:00.
- [ ] Keep automation script in dry-run; review output.

## Daily Cadence (Ongoing)
- [ ] Follow the playbook in `docs/ads/daily-review.md` (sync scripts, health check, Tag Assistant tests, UI recommendation audit, changelog update).
- [ ] Record conversion test results and any outstanding warnings in `docs/ads/changelog.md`.
- [ ] Ping Codex if automation needs approval to switch out of dry-run.

## Weekly Cadence
- [ ] Export campaign/keyword performance (last 7 days) to `docs/ads/changelog.md` entry.
- [ ] Adjust budgets ±20% based on CPA/volume.
- [ ] Pause under-performing keywords (cost ≥3× CPA target, ≥15 clicks, 0 conv).
- [ ] Add top converting search terms to exact lists.
- [ ] Extend negatives for irrelevant terms/locations.
- [ ] Update changelog with actions taken and rationale.

## Monthly Cadence
- [ ] Review geo performance—expand/restrict Tier-2 areas.
- [ ] Evaluate device/day-part performance; tighten schedule if evenings weak.
- [ ] Seasonal adjustments (Autumn gutter +20–30%, Spring windows +15–25%).
- [ ] Consider PMax test if Search stable and budget available.
- [ ] Evaluate moving campaigns to tCPA if conversion volume sufficient.

## Continuous
- [ ] Maintain documentation (plan, checklist, changelog, negatives, keywords).
- [ ] Inspect automation recommendations; switch `GOOGLE_ADS_AUTOMATION_DRY_RUN` to `false` only after review cycle agreed.
- [ ] Share highlights with Dan (weekly summary).
