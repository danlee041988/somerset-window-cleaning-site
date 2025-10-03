#!/usr/bin/env tsx

import { GoogleAdsApi } from 'google-ads-api';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = new GoogleAdsApi({
  client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
});

const customer = client.Customer({
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
});

async function fixDuplicate() {
  console.log('\n🔍 Duplicate keyword issue: "window cleaning near me"\n');

  const query = `
    SELECT
      ad_group.id,
      ad_group_criterion.criterion_id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.cpc_bid_micros,
      ad_group_criterion.status
    FROM ad_group_criterion
    WHERE
      campaign.name = 'Windows – Somerset'
      AND ad_group_criterion.keyword.text = 'window cleaning near me'
      AND ad_group_criterion.type = KEYWORD
      AND ad_group_criterion.negative = FALSE
  `;

  const rows = await customer.query(query);

  console.log('Found variants:');

  let exactKeyword = null;
  let broadKeyword = null;

  for (const row of rows) {
    const matchType = row.ad_group_criterion.keyword.match_type === 4 ? 'EXACT' :
                     row.ad_group_criterion.keyword.match_type === 5 ? 'PHRASE' :
                     row.ad_group_criterion.keyword.match_type === 3 ? 'BROAD' : 'UNKNOWN';
    const currentBid = (row.ad_group_criterion.cpc_bid_micros || 0) / 1_000_000;
    const status = row.ad_group_criterion.status === 2 ? 'ENABLED' : row.ad_group_criterion.status === 3 ? 'PAUSED' : 'REMOVED';

    console.log(`  ${matchType}: £${currentBid.toFixed(2)} (${status})`);

    if (matchType === 'EXACT') exactKeyword = row;
    if (matchType === 'BROAD') broadKeyword = row;
  }

  console.log('\n📋 Decision: Campaign is on Manual CPC\n');

  // Option A (recommended): Remove BROAD duplicate, keep EXACT
  console.log('Recommended fix: Remove BROAD duplicate, keep EXACT at £2.50');
  console.log('Rationale: Cleaner, more predictable bidding. EXACT captures high-intent.\n');

  if (broadKeyword) {
    console.log('🔧 Pausing BROAD match duplicate...\n');

    await customer.adGroupCriteria.update([{
      resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroupCriteria/${broadKeyword.ad_group.id}~${broadKeyword.ad_group_criterion.criterion_id}`,
      status: 3, // PAUSED
    }]);

    console.log('✅ BROAD match paused');
    console.log('✅ EXACT match remains active at £2.50\n');
  }

  console.log('Alternative (if you want broader coverage later):');
  console.log('  - Keep both matches');
  console.log('  - Set BROAD at £1.50 for broader queries');
  console.log('  - EXACT at £2.50 captures high-intent');
  console.log('  - Use ad-group negatives to prevent self-competition\n');
}

fixDuplicate().catch(console.error);
