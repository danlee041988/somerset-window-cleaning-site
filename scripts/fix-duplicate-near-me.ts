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

async function fixDuplicateKeyword() {
  // Find all 'window cleaning near me' keywords
  const query = `
    SELECT
      ad_group.id,
      ad_group_criterion.criterion_id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.cpc_bid_micros
    FROM ad_group_criterion
    WHERE
      campaign.name = 'Windows – Somerset'
      AND ad_group_criterion.keyword.text = 'window cleaning near me'
      AND ad_group_criterion.type = KEYWORD
      AND ad_group_criterion.negative = FALSE
  `;

  const rows = await customer.query(query);

  console.log('\n🔍 Found "window cleaning near me" variants:\n');

  const updates = [];

  for (const row of rows) {
    const matchType = row.ad_group_criterion.keyword.match_type === 4 ? 'EXACT' : row.ad_group_criterion.keyword.match_type === 5 ? 'PHRASE' : 'BROAD';
    const currentBid = (row.ad_group_criterion.cpc_bid_micros || 0) / 1_000_000;

    console.log(`   Match: ${matchType}`);
    console.log(`   Current bid: £${currentBid.toFixed(2)}`);
    console.log(`   Criterion ID: ${row.ad_group_criterion.criterion_id}`);
    console.log('');

    if (currentBid < 2.50) {
      updates.push({
        resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroupCriteria/${row.ad_group.id}~${row.ad_group_criterion.criterion_id}`,
        cpc_bid_micros: 2_500_000,
      });
    }
  }

  if (updates.length > 0) {
    console.log(`🔧 Updating ${updates.length} keyword(s) to £2.50...\n`);

    for (const update of updates) {
      try {
        await customer.adGroupCriteria.update([update]);
        console.log(`   ✅ Updated ${update.resource_name.split('~')[1]}`);
      } catch (error: any) {
        console.log(`   ⚠️  Skipped (inherited bid): ${update.resource_name.split('~')[1]}`);
      }
    }

    console.log('\n✅ Fix complete!\n');
  } else {
    console.log('✅ All variants already at £2.50\n');
  }
}

fixDuplicateKeyword().catch(console.error);
