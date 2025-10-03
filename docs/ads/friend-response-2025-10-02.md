# Response to Friend's Feedback - October 2, 2025

## Duplicate Keyword Fix

**Issue identified:** "window cleaning near me" has EXACT at £2.50 + second variant with no keyword-level bid.

**Current status:** Second variant shows as REMOVED. Duplicate already cleaned up.

**If it resurfaces:** On Manual CPC, we can set explicit keyword-level bids via API. Will either:
- **Option A (clean):** Pause/remove the duplicate, keep EXACT £2.50
- **Option B (controlled coverage):** Keep both; set second variant at £1.50 for broader queries, EXACT £2.50 for high-intent, use ad-group negatives to prevent self-competition

---

## Answers to Questions

### 1. Should other campaigns switch to Manual CPC?

**No, not yet.** Focus stays on Windows until it hits Day 5 thresholds (≥£20 spend, ≥200 impressions/day). When we re-enable the next campaign (Gutter), we'll launch it on Manual CPC to maintain control during its learning phase.

### 2. Add more town keywords at £2.00?

**Yes.** Proposed additions (all within service area):
- Somerton
- Langport
- Cheddar
- Frome
- Radstock
- Midsomer Norton
- Wincanton

**Structure:**
- Start as Phrase match first
- Mirror Exact for top-performing towns as data accumulates
- Group by intent theme (window cleaning / gutter / conservatory) not SKAGs
- Add ad-group negatives to keep themes clean

### 3. Review ad copy while QS is building?

**Yes.** Will create additional RSA per ad group with:
- **Headlines:**
  - "Window Cleaning in {LOCATION(City)}"
  - 8-12 varied headlines covering service, USP, offer
  - {KeyCity/Town} insertion for location relevance
- **Descriptions:**
  - "4-weekly rounds • Pure water • Insured" style value props
  - Transparent pricing, frames & sills included
  - Free window clean when booking gutter + fascia/soffit (if applicable)
- **Pinning:** Minimal (only where legally/brand-mandated) to keep Ad Strength high
- **Landing page alignment:** H1/title matches exact keyword + town for QS

### 4. Consider BMM if volume stays low after Day 5?

**BMM is deprecated.** If volume stays low on Day 5, will:
- **First:** Lift high-intent bids +20% to ~£3.00 (per rollback rule)
- **Then:** Add Phrase expansions (safer under Manual CPC)
- **Last resort:** Add carefully chosen Broad terms ONLY if we can police search terms daily with negatives

### 5. Budget ceiling at £60/day total?

**Fine for now.** Only Windows is actively spending. To tighten control:
- Consider shared budget that only Windows uses, OR
- Keep other campaigns paused until Windows consistently hits ≥£20/day spend + ≥200 impressions/day
- Re-allocate when Windows proves stable

### 6. Conversion tracking concerns?

**Will verify:**
- ✅ Primary conversions set to "Include in Conversions" (Form Submit, Call from Ads, Call from Website)
- ✅ Auto-tagging enabled (GCLID)
- ✅ GA4 linked, imported conversions not marked as Secondary (unless intentional)
- ✅ Call asset conversion configured: sensible count window + call length threshold
- ✅ Tag Assistant verification: events fire on form submit and call click
- ✅ Pass conversion values (window vs gutter vs fascia) so Smart Bidding can optimize by revenue when we switch

---

## Quick Wins to Implement

### 1. Call Asset Schedule
**Action:** Mirror campaign's weekday hours (Mon-Fri 08:00-20:00) so calls don't route outside coverage.

### 2. Keyword Deduplication
**Action:** Keep one Exact + one Phrase per core term; remove duplicates by match type.

**Current duplicates to clean:**
- "window cleaning near me" (already handled - second variant removed)
- Will audit full keyword list for other duplicates

### 3. Landing Page QS Optimization
**Actions:**
- Ensure page titles/H1s say "Window Cleaning in [Town]"
- CTA above the fold
- Add trust elements: reviews, insurance badges, photos
- Align hero/H1 with exact keyword + town for QS boost

---

## Implementation Timeline

### Today (Oct 2)
- ✅ Duplicate keyword cleaned (already removed)
- ⏳ Add town keywords (Somerton, Langport, Cheddar, Frome, Radstock, Midsomer Norton, Wincanton)
- ⏳ Create location-aware RSA with {LOCATION} insertion
- ⏳ Update call asset schedule to weekday hours

### Oct 3 (Tomorrow 9am)
- Diagnostics check: expect 50-100+ impressions as £2.50 bids activate
- Sanity-check: ensure 100 negatives aren't blocking legit "near me"/town variants
- Search terms review if any activity

### Oct 4 (Checkpoint)
**Scenario A: Success metrics met (spend ≥£20, impr ≥200, CTR ≥5%)**
- Begin trimming top bids to £2.00 (keep winners at £2.50 if needed)
- Document performance data in changelog

**Scenario B: Success metrics NOT met (spend <£20 or impr <200)**
- Execute Rule 2: Lift high-intent bids +20% (£2.50 → £3.00)
- Run Auction Insights to see competitive landscape
- Review search terms for blocking issues

### Week 2 (Oct 7-11)
- Daily morning checks
- Wed/Fri search term reviews
- If Windows stable (CPA ≤£25 for 7 days): prepare to re-enable Gutter on Manual CPC

---

## Technical Notes

### Match Type Strategy (Manual CPC)
- **Exact:** High-intent, precise control (£2.50)
- **Phrase:** Town + service expansions (£2.00)
- **Broad:** Use sparingly with robust negatives (£1.50-£1.80) only after volume proves healthy

### Geo Targeting Confirmation
- Set to **Presence** (people in your areas)
- NOT "presence or interest" (for local services, this is critical)
- 40 postcode sectors confirmed (BS, BA, TA)

### Conversion Values
Once tracking is verified, will pass conversion values:
- Window cleaning: [base value]
- Gutter cleaning: [base value]
- Conservatory: [base value]
- Fascia/soffit: [base value]

This enables revenue-based optimization when we eventually test Smart Bidding.

---

## Verdict from Friend

✅ **Implementation is strong**
✅ **Numbers are healthy (low CPC £1.28, good CTR 4.17%)**
✅ **Strategy is working - just needs volume to catch up**

**Fixes needed:**
1. Duplicate keyword (already handled)
2. Add town coverage (in progress)
3. Location RSA (in progress)
4. Conversion tracking verification (next)

**Next 1-2 weekdays should show if volume catches up as bids take effect.**

---

## Files Created/Updated
- ✅ `scripts/fix-keyword-duplicate.ts` - Duplicate resolution
- ⏳ `scripts/add-town-keywords.ts` - Town expansion (next)
- ⏳ Location RSA creation (next)
- ⏳ Conversion tracking audit (next)

---

**Status:** Implementing friend's feedback systematically. Expected completion: Oct 3 morning before daily check.
