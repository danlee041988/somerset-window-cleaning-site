# Google Ads Growth Plan — Somerset Window Cleaning

_Last updated: 23 Sept 2025_

## 1. Objectives
- Generate qualified **window cleaning** leads (primary), with **gutter**, **conservatory roof**, and **solar panel cleaning** as secondary services.
- Bias to **mobile** conversions (historically ~90% of spend) while capturing form leads outside call hours.
- Maintain clear measurement (Ads conversions + Enhanced Conversions) and run weekly optimisation loops.

## 2. Measurement & Tracking
- Full setup & mapping in [`docs/ads/measurement.md`](./measurement.md).
- Conversions in Google Ads (created via GTM `GT-WF6J3RVS`):
  - `Form - Quote` → Quote request success confirmation.
  - `Form - Contact` → General enquiry success page.
  - `Click to call` → tap-to-call button (mobile only).
  - Optional (phase 2): lead-form extension submissions, call extension longer than 45s.
- **Enhanced Conversions**: hash email/phone on both forms; send to Ads.
- **Call asset schedule**: Mon–Fri 09:00–16:00 only (aligned with phone support hours).
- Validate tags in preview → record one real test conversion before go-live.

## 3. Account Configuration
- **Ad account (customer)**: `447-417-5960`
- **Manager / login**: _n/a (same account)_
- `.env.local` already stores credentials for automation.
- Auto-tagging on, call reporting on.
- Sitelink disapprovals to be resolved with compliant copy.

## 4. Locations
- **Tier 1 (launch)**: BA16 Street, BA6 Glastonbury, BA5 Wells, BA4 Shepton Mallet, TA11 Somerton, TA10 Langport.
- **Tier 2 (expand once CPA stable)**: BA11 Frome, BA7 Castle Cary, BA10 Bruton, BS27 Cheddar, BS26 Axbridge, BS28 Wedmore, TA8 Burnham-on-Sea, TA9 Highbridge, TA6 & TA7 Bridgwater, TA1 & TA2 Taunton, BA20 & BA21 Yeovil.
- Exclude out-of-area postcodes, Bristol, Bath, Devon, national/geographic irrelevant searches.

## 5. Campaign Structure (Search first)
| Campaign | Goal | Daily Budget (confirmed) | Bid Strategy |
| --- | --- | --- | --- |
| **Windows – Somerset** | Core window cleans | **£25** | Start Maximise Conversions → tCPA when ≥30 conv | 
| **Gutter – Somerset** | Upsell gutter clears | **£12** | Maximise Conversions | 
| **Conservatory – Somerset** | Specialist upsell | **£8** | Maximise Conversions | 
| **Solar Panels – Somerset** | Specialist upsell | **£5** | Maximise Conversions |
| **Brand Protection** | Capture brand traffic | **£2** | Manual CPC (cap ≤£0.40 CPC) |

- Ad schedule: campaigns run **08:00–20:00**; call assets only 09:00–16:00.
- Optional: Smart bidding uses historical conversions—switch to tCPA per campaign once sample size hits 30 conversions (~2–3 weeks).
- Shared budgets can be used per service if preferred; start with individual budgets above.

## 6. Keyword Strategy
- Match types: **Exact** + **Phrase** at launch. Introduce Broad once negatives solid.
- Seed keyword themes (details in `keywords-seed.csv`):
  - Window cleaning near me, local window cleaner, four-weekly window cleaning, exterior window cleaning.
  - Gutter cleaning, gutter clearing, downpipe cleaning.
  - Conservatory roof cleaning, conservatory window cleaning.
  - Solar panel cleaning service.
  - Brand: Somerset Window Cleaning, Dan Lee window cleaning.
- Add hero combinations with service + town (e.g., “window cleaner Glastonbury”).

## 7. Negative Keyword Framework
- Categories (full list in `negatives.csv`):
  - Jobs/careers: job, vacancy, apprentice, course, training.
  - DIY / supplies: equipment, tds meter, pure water system, wholesale, second hand.
  - Unqualified intent: inside only, car window, double glazing repair, wiper blades.
  - Out-of-area towns (once finalised).
  - Competitor/trade networks to exclude if not wanted (e.g., franchise searches).

## 8. Ads & Assets
- **Responsive Search Ads**: 2x per ad group.
  - 12–15 headlines covering service, location, selling points (4,000+ customers, fully insured, four-week cycle).
  - 4 descriptions: convenience, eco-friendly pure water poles, insured + DBS checked (if true), fast quotes.
  - Duplicate RSA with neutral CTA (“Request a quote”) for off-hours; ensure pinned headline for “Call” only present in business-hours variant.
- **Extensions**: 
  - Sitelinks: Services, Areas We Cover, Request a Quote, Contact Us (neutral copy to pass policy).
  - Callouts: Fully insured cleaners, 4,000+ happy customers, Free quick quotes, Pure water poles reach 3 stories.
  - Structured snippets: Services = Windows, Gutter, Conservatory, Solar.
  - Call extension: schedule Mon–Fri 09:00–16:00.

## 9. Landing Experience
- `/book-appointment` for primary conversions, auto-scroll to form.
- `/get-in-touch` as secondary.
- Mobile first: sticky CTA, call button suppressed outside business hours (already handled in app).
- Persona: residential focus; mention commercial separately if applicable.

## 10. Optimisation Cadence
- **Daily**: pacing (spend vs conv), disapprovals, search terms quick scan, ensure no unexpected pausing.
- **Weekly**:
  - Shift budget (+/−20%) between campaigns based on CPA & volume.
  - Pause keywords with cost ≥ 3× target CPA and ≥ 15 clicks, zero conv.
  - Add negative keywords from search term insights.
  - Export weekly report for window vs gutter vs conservatory performance.
- **Monthly**:
  - Review geo heatmap; add/remove Tier‑2 locations.
  - Seasonality adjustments (Autumn gutter boost 20–30%, Spring window boost 15–25%).
  - Consider PMax test with limited budget once Search stable.

## 11. Targets & Guardrails
- Soft CPA targets (confirmed): Window **£25**, Gutter **£30**, Conservatory **£30**, Solar **£35**.
- Window conversions: ramp to ≥4 per week within first month.
- Automation guardrails (scripts):
  - Pause keywords hitting cost ≥ 3×CPA target with zero conv (threshold 15 clicks).
  - Recommend +10% bid on keywords with CPA ≤ 70% target & ≥2 conv.
  - Recommend −10% on CPA ≥ 150% target & ≥3 conv.
  - Flag zero-spend days / policy disapprovals.

## 12. Reporting & Automation
- Admin dashboard: `/admin/google-ads` (campaign metrics, recommendations).
- API endpoints: `GET /api/google-ads?action=campaigns`, `...=recommendations`.
- Automation script: `npx tsx scripts/google-ads-automation.ts` (dry-run by default). Set `GOOGLE_ADS_AUTOMATION_DRY_RUN=false` to enable actions once approved.
- `scripts/list-accessible-customers.ts` to verify account IDs.

## 13. Next Steps (Implementation Checklist)
1. Configure Ads conversions + Enhanced Conversions in GTM.
2. Fix sitelink copy to pass policy; confirm final URLs.
3. Build new campaigns following structure above.
4. Upload starter negative list and keyword seeds.
5. Launch with daily monitoring; keep automation in dry-run for first two weeks.
6. Transition to tCPA once each campaign gathers ~30 conversions.
7. Document optimisation actions in `docs/ads/changelog.md` weekly.

## 14. Open Questions
- Final confirmation of Tier‑2 towns to include/exclude.
- Confirm CPA targets per service (window £25 assumed).
- Approve sitelink wording (to rewrite disapproved ones).
- Any claims (DBS-checked, 4,000+ customers) require proof on landing page? ensure present.
