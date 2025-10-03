# Bid Adjustment Rules - Somerset Window Cleaning

**Created:** October 2, 2025
**Strategy:** Temporary aggressive bidding to rebuild Quality Score, then optimize down

---

## Current Bid Structure (Oct 2, 2025)

| Keyword Type | Max Bid | Rationale |
|--------------|---------|-----------|
| High-intent ("near me", "looking for", "need") | £2.50 | Premium ceiling for conversion-likely searches |
| Town keywords (glastonbury, street, wells, etc.) | £2.00 | Local intent, moderate competition |
| Ad group default | £2.00 | Baseline for secondary/generic terms |

---

## Why £2.50 When Historical Was £1.46?

### Key Principle: Max Bid ≠ Actual CPC

**£2.50 is a ceiling, not the price.** We only pay what's needed to win the auction.

**Evidence:**
- Yesterday (Oct 2): Actual CPC was **£1.28** even with £2.50 max bids
- Historical: Old campaign achieved £1.46 CPC **after** QS and CTR history established

### Three Strategic Reasons:

1. **Quality Score Reset**
   - Old campaign: QS 8-10 → could win at £1.46
   - New campaign: QS 5-7 → needs higher bid for same Ad Rank
   - Formula: `Ad Rank ≈ Bid × QS × expected impact`

2. **Auction Pressure Changes**
   - Competitors and seasonality shift between campaigns
   - Higher max bid ensures we re-enter same auctions quickly
   - Prevents under-delivery during learning phase

3. **Targeted, Not Blanket**
   - £2.50 only on high-intent conversion terms
   - Towns and secondary at £2.00
   - Stepped approach maintains efficiency

---

## Guardrails in Place

✅ **Manual CPC** - Full bid control
✅ **100 negative keywords** - Synced across campaigns
✅ **Extensions verified** - Sitelinks, callouts, call assets
✅ **Weekday hours only** - Mon-Fri 08:00-20:00
✅ **Budget focused** - £35/day on Windows campaign only

---

## Rollback/Adjust Rules

### Rule 1: Volume + Healthy CPC → Reduce Bids

**Trigger:**
- Daily impressions ≥ 200 **AND**
- CPC sits at £1.80-£2.20 for **2 consecutive weekdays**

**Action:**
- Trim high-intent bids: £2.50 → £2.00
- Document in changelog with performance data

**Check:** Fridays (weekly review)

---

### Rule 2: Low Volume After Learning Phase → Increase Bids

**Trigger:**
- Daily spend < £20 **AND**
- Impressions < 200 **AND**
- Day 5+ (after Oct 4)

**Action:**
- Bump high-intent by +20%: £2.50 → £3.00 (short-term)
- Force eligibility to enter auctions
- Review auction insights to understand competition

**Check:** Oct 4 checkpoint, then weekly

---

### Rule 3: High CPC Without Results → Pull Back Non-Performers

**Trigger:**
- CPC > £3.00 for **2 consecutive days**
- Zero leads/conversions during that period

**Action:**
- Pull town/generic terms: £2.00 → £1.80
- Keep only top intent keywords at £2.50
- Review search terms for wasted spend

**Check:** Daily during high-spend periods

---

## Expected Bid Evolution

### Phase 1: Learning (Oct 2-14, Days 3-14)
- **Bids:** £2.50 high-intent, £2.00 towns
- **Actual CPC:** £1.50-£2.20 expected
- **Goal:** Build impressions (200+/day), clicks, QS
- **Spend:** £20-35/day

### Phase 2: Optimization (Oct 15-30, Weeks 3-4)
- **Bids:** Reduce to £2.00-£2.20 high-intent, £1.80 towns
- **Actual CPC:** £1.40-£1.80 expected
- **Goal:** Maintain QS 7-8, improve conversion rate
- **Spend:** £25-35/day with better efficiency

### Phase 3: Steady State (Nov+, Month 2+)
- **Bids:** Optimize to £1.80-£2.00 high-intent, £1.60 towns
- **Actual CPC:** £1.30-£1.60 expected (near historical)
- **Goal:** CPA ≤£25, stable QS 8-10
- **Spend:** £30-35/day, predictable results

---

## Monitoring Schedule

### Daily (9am)
- Run: `npx tsx scripts/google-ads-campaign-diagnostics.ts`
- Check: Impressions trending up? CPC in range? Any policy issues?
- Alert if: Zero spend 2 consecutive days

### Wednesday & Friday
- Review search terms: `npx tsx scripts/google-ads-report-search-terms.ts`
- Add negatives for irrelevant/wasted searches
- Check Rule 3 trigger (CPC > £3.00 without leads)

### Weekly (Fridays)
- Review Rule 1 trigger (volume + healthy CPC → reduce bids)
- Check weekly totals: spend, conversions, CPA
- Adjust strategy for next week

### Bi-weekly
- Review Rule 2 trigger (low volume → increase bids)
- Auction insights analysis
- Keyword performance: pause 0-conv + ≥£75 spend

---

## Bottom Line

**We raised max bids temporarily to regain auction share while QS rebuilds.**

✅ Still paying near old CPC (£1.28 actual vs £1.46 historical)
✅ Clear thresholds to bring bids down once volume is healthy
✅ Guardrails prevent runaway spend
✅ Expected to return to £1.50-£1.80 CPC by November

---

## Decision Log

| Date | Decision | Trigger | Result |
|------|----------|---------|--------|
| 2025-10-02 | Set high-intent to £2.50, towns to £2.00 | New campaign launch, QS rebuild needed | In progress - Day 3 |
| | | | |

---

**Next Review:** October 4, 2025 (Day 5 checkpoint)
