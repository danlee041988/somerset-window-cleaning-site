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

async function checkAdGroupBids() {
  const query = `
    SELECT
      ad_group.id,
      ad_group.name,
      ad_group.cpc_bid_micros,
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

  console.log('\n📊 Ad Group & Keyword Bid Structure:\n');

  const adGroups = new Map();

  for (const row of rows) {
    const agId = row.ad_group.id;
    const agName = row.ad_group.name;
    const agBid = (row.ad_group.cpc_bid_micros || 0) / 1_000_000;

    if (!adGroups.has(agId)) {
      adGroups.set(agId, {
        name: agName,
        bid: agBid,
        keywords: []
      });
    }

    const kw = row.ad_group_criterion.keyword?.text || '';
    const kwBid = (row.ad_group_criterion.cpc_bid_micros || 0) / 1_000_000;

    adGroups.get(agId).keywords.push({
      text: kw,
      bid: kwBid,
      inherits: kwBid === 0
    });
  }

  for (const [agId, data] of adGroups) {
    console.log(`\n📁 Ad Group: "${data.name}" (ID: ${agId})`);
    console.log(`   Ad Group CPC: £${data.bid.toFixed(2)}`);
    console.log(`   Keywords:`);

    for (const kw of data.keywords) {
      const status = kw.inherits ? '⬆️  inherits £' + data.bid.toFixed(2) : '✅ explicit';
      console.log(`     • "${kw.text}": £${kw.bid.toFixed(2)} ${status}`);
    }
  }
}

checkAdGroupBids().catch(console.error);
