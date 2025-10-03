# 🚨 URGENT: Ad Serving Issue - Fix Plan

**Date:** October 3, 2025, 10:52 AM BST
**Issue:** Zero impressions today - Windows – Somerset campaign has only 2/20 ads enabled
**Root Cause:** 18 ads REMOVED (Status: 4), 2 ads ENABLED but APPROVED_LIMITED (Status: 2, Approval: 4)

---

## 1. DIAGNOSIS SUMMARY

### ✅ What's Working:
- Campaign: **ENABLED** (Status: 2)
- Ad Group: **ENABLED** (Status: 2)
- Keywords: **ENABLED & APPROVED** with proper bids (£1.50-£2.50)
- Budget: £35/day allocated
- Schedule: Mon-Fri 08:00-20:00 (currently within serving window)
- API Authentication: Working
- Account Status: Active, not test account

### ❌ What's Broken:
- **18 out of 20 ads are REMOVED** (Status: 4)
- **2 enabled ads are APPROVED_LIMITED** (Status: 2, Approval: 4)
- Result: **No fully-approved, enabled ads to serve**

### Data Points:
```
Time: 10:47 AM BST (within serving window)
Today's Performance: 0 impressions, £0 spend
Last 7 Days: £1.28 spend, 24 impressions, 1 click
Campaign ID: 23054482226
Ad Group ID: 186804898798
```

---

## 2. ROOT CAUSE ANALYSIS

**Why ads are removed:**
1. Likely manually paused/removed in Google Ads UI
2. Possible policy violations leading to disapproval
3. Could be automated system removing low-performing ads
4. May have been part of testing/optimization

**APPROVED_LIMITED explained:**
- Ads approved but with restrictions
- Common causes: trademark issues, policy limitations, geographic restrictions
- Still can serve but with reduced reach

---

## 3. FIX STRATEGY (Following Best Practices)

### Phase 1: INVESTIGATION (5 minutes)
**Objective:** Understand WHY ads were removed before re-enabling

**Actions:**
1. Query all ad details including policy issues
2. Check for disapprovals, policy violations
3. Identify which ads are safe to re-enable
4. Document current state for rollback

**Safety Check:**
- Don't blindly re-enable - verify approval status first
- Check policy_topic_entries for issues
- Review ad copy for compliance

### Phase 2: BACKUP (2 minutes)
**Objective:** Create snapshot before changes

**Actions:**
1. Export current ad status to JSON
2. Save to `docs/ads/history/2025-10-03-pre-fix-snapshot.json`
3. Document all ad IDs and their status

### Phase 3: SELECTIVE RE-ENABLEMENT (10 minutes)
**Objective:** Re-enable only fully-approved ads

**Strategy (from plan.md):**
- **Responsive Search Ads**: Need 2x per ad group minimum
- Each RSA should have 12-15 headlines, 4 descriptions
- Match ad copy to keyword themes
- Ensure landing page alignment

**Actions:**
1. Identify ads with:
   - `approval_status = 2` (APPROVED) or `4` (APPROVED_LIMITED is acceptable)
   - `status = 4` (REMOVED - candidates for re-enabling)
2. Re-enable top 3-5 best-performing ads first
3. Monitor for immediate serving
4. If still insufficient, create new RSA following plan.md template

### Phase 4: VERIFICATION (5 minutes)
**Objective:** Confirm ads are serving

**Actions:**
1. Wait 10 minutes for Google to process
2. Check impressions start flowing
3. Verify ad preview tool shows ads
4. Run diagnostic again

### Phase 5: DOCUMENTATION (3 minutes)
**Objective:** Track changes for audit trail

**Actions:**
1. Update `docs/ads/changelog.md`
2. Note which ads were re-enabled
3. Document approval statuses
4. Set monitoring alert for next 24 hours

---

## 4. IMPLEMENTATION SCRIPTS

### Script 1: Ad Status Audit
```typescript
// scripts/google-ads-audit-ads.ts
// Query all ads with full policy details
// Export to JSON for backup
```

### Script 2: Safe Ad Re-enablement
```typescript
// scripts/google-ads-reenable-ads.ts
// Re-enable only APPROVED or APPROVED_LIMITED ads
// Skip DISAPPROVED ads
// Safety checks before enable
```

### Script 3: Create New RSA (if needed)
```typescript
// scripts/google-ads-create-rsa.ts
// Follow plan.md template
// 12-15 headlines, 4 descriptions
// Location-aware with {LOCATION} insertion
```

---

## 5. SUCCESS CRITERIA

### Immediate (Within 30 minutes):
- [ ] At least 2-3 fully APPROVED ads ENABLED
- [ ] Impressions > 0 in next diagnostic check
- [ ] No policy violations flagged

### Short-term (By end of day):
- [ ] 10-50+ impressions showing
- [ ] Spend £5-15 (partial day within window)
- [ ] CTR ≥ 3%

### Tomorrow (Oct 4 checkpoint per plan.md):
- [ ] Spend ≥ £20
- [ ] Impressions ≥ 200
- [ ] CTR ≥ 5%
- [ ] CPC ≤ £2.20

---

## 6. ROLLBACK PLAN

**If fix fails:**
1. Restore from snapshot JSON
2. Manually check Google Ads UI for policy issues
3. Contact Google Ads support if systemic issue
4. Consider creating entirely new ad group with fresh RSAs

**Escalation:**
- If ads remain REMOVED after re-enabling → Check account-level restrictions
- If APPROVED_LIMITED persists → Review ad copy for policy compliance
- If no impressions after 2 hours → Check bid strategy/budget

---

## 7. PREVENTIVE MEASURES

**Going forward:**
1. Set up daily ad status monitoring
2. Alert if >50% of ads become disabled
3. Never manually remove ads without documentation
4. Use labels to track ad performance before removal
5. Follow plan.md cadence: daily checks, weekly optimizations

---

## 8. ALIGNMENT WITH PLAN.MD

**Following best practices:**
- ✅ Maintaining Manual CPC control during ramp-up
- ✅ Focusing on Windows campaign first (per consolidation strategy)
- ✅ High-intent keywords at £2.50, towns at £2.00 (already set)
- ✅ Mon-Fri 08:00-20:00 schedule (maintained)
- ✅ Documentation in changelog.md
- ✅ Automation remains in dry-run until stable

**Next phase (after fix):**
- Add town keywords (Somerton, Langport, Cheddar, etc.)
- Create location-aware RSA with {LOCATION} insertion
- Verify GA4 conversion tracking
- Monitor for Oct 4 checkpoint thresholds

---

## 9. EXECUTION ORDER

1. ✅ **READ** context from docs/ads/ (DONE)
2. 🔄 **AUDIT** current ad status with policy details (IN PROGRESS)
3. ⏳ **BACKUP** current state to JSON
4. ⏳ **ANALYZE** which ads are safe to re-enable
5. ⏳ **RE-ENABLE** approved ads in batches
6. ⏳ **VERIFY** serving starts
7. ⏳ **DOCUMENT** in changelog.md
8. ⏳ **MONITOR** for next 24 hours

---

## 10. QUESTIONS TO RESOLVE

- [ ] Were ads manually removed, or did system disable them?
- [ ] Are there specific policy violations we need to fix?
- [ ] Should we create new RSAs instead of re-enabling old ones?
- [ ] Are the 2 APPROVED_LIMITED ads performing adequately?

---

**Status:** Plan created. Ready to execute with approval.
**Estimated Fix Time:** 30-45 minutes
**Risk Level:** LOW (only re-enabling existing ads, fully reversible)

**Proceed with execution?**
