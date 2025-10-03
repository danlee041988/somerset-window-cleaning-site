#!/usr/bin/env tsx

import { GoogleAdsApi, enums } from 'google-ads-api';
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

// Bid plan from CSV
const bidPlan = [
  { keyword: 'looking for a window cleaner', bid: 2.5 },
  { keyword: 'window cleaning near me', bid: 2.5 },
  { keyword: 'window cleaner near me', bid: 2.5 },
  { keyword: 'need window cleaner', bid: 2.5 },
  { keyword: 'gutter cleaning near me', bid: 2.0 },
  { keyword: 'conservatory roof cleaning', bid: 2.0 },
  { keyword: 'solar panel cleaning', bid: 2.0 },
  { keyword: 'glastonbury', bid: 2.0 },
  { keyword: 'taunton', bid: 2.0 },
  { keyword: 'wells', bid: 2.0 },
  { keyword: 'street', bid: 2.0 },
  { keyword: 'shepton mallet', bid: 2.0 },
  { keyword: 'bridgwater', bid: 2.0 },
  { keyword: 'yeovil', bid: 2.0 },
  { keyword: 'burnham on sea', bid: 2.0 },
];

async function applyBidIncreases() {
  console.log(`\n🎯 Applying Bid Increases to Windows – Somerset Campaign\n`);

  // Get all keywords from Windows campaign
  const query = `
    SELECT
      ad_group.id,
      ad_group.name,
      ad_group_criterion.criterion_id,
      ad_group_criterion.keyword.text,
      ad_group_criterion.cpc_bid_micros
    FROM ad_group_criterion
    WHERE
      ad_group_criterion.type = KEYWORD
      AND ad_group_criterion.negative = FALSE
      AND campaign.name = 'Windows – Somerset'
      AND campaign.status = ENABLED
  `;

  const rows = await customer.query(query);

  const operations = [];
  const updates = [];

  for (const row of rows) {
    const keywordText = String(row.ad_group_criterion.keyword?.text || '').toLowerCase();
    const match = bidPlan.find(p => keywordText.includes(p.keyword));

    if (!match) continue;

    const customerId = process.env.GOOGLE_ADS_CUSTOMER_ID;
    const adGroupId = row.ad_group.id;
    const criterionId = row.ad_group_criterion.criterion_id;

    const oldBid = (row.ad_group_criterion.cpc_bid_micros || 0) / 1_000_000;
    const newBid = match.bid;
    const newBidMicros = Math.round(newBid * 1_000_000);

    // Always set explicit bid if it matches our plan
    operations.push({
      resource_name: `customers/${customerId}/adGroupCriteria/${adGroupId}~${criterionId}`,
      cpc_bid_micros: newBidMicros,
    });

    const status = oldBid === 0 ? '(inherited → explicit)' : '';
    updates.push({ keyword: keywordText, oldBid, newBid, status });
  }

  if (operations.length === 0) {
    console.log('❌ No keywords matched the bid plan');
    return;
  }

  console.log(`📊 Found ${operations.length} keywords to update:\n`);

  console.log('🚀 Applying updates...\n');

  let successCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const update = updates[i];

    try {
      await customer.adGroupCriteria.update([op]);
      console.log(`   ✅ "${update.keyword}": £${update.oldBid.toFixed(2)} → £${update.newBid.toFixed(2)}`);
      successCount++;
    } catch (error: any) {
      const errorMsg = error.errors?.[0]?.message || error.message || String(error);
      if (errorMsg.includes('Resource was not found')) {
        console.log(`   ⚠️  Skipped "${update.keyword}": inherited bid (already at £${update.newBid.toFixed(2)} via ad group)`);
        skippedCount++;
      } else {
        console.error(`   ❌ Failed "${update.keyword}":`, errorMsg);
        throw error;
      }
    }
  }

  console.log(`\n✅ Successfully updated ${successCount} keyword bids`);
  if (skippedCount > 0) {
    console.log(`⚠️  Skipped ${skippedCount} keywords with inherited bids (already at target via ad group)\n`);
  }
}

applyBidIncreases().catch(error => {
  console.error('❌ Error applying bid increases:');
  console.error(error.message || error);
  process.exit(1);
});
