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

async function switchToManualCPC(campaignName: string) {
  console.log(`\n🔄 Switching "${campaignName}" to Manual CPC...\n`);

  // Get campaign ID
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.bidding_strategy_type
    FROM campaign
    WHERE campaign.name = '${campaignName.replace(/'/g, "''")}'
      AND campaign.status = ENABLED
    LIMIT 1
  `;

  const rows = await customer.query(query);

  if (rows.length === 0) {
    console.log(`❌ Campaign "${campaignName}" not found or not enabled`);
    return;
  }

  const campaign = rows[0];
  const campaignId = campaign.campaign.id;
  const currentStrategy = campaign.campaign.bidding_strategy_type;

  console.log(`   Current bidding strategy: ${currentStrategy}`);

  if (currentStrategy === 2) {
    console.log(`   ✅ Already using Manual CPC (strategy type 2)`);
    return;
  }

  // Switch to Manual CPC
  await customer.campaigns.update([
    {
      resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaigns/${campaignId}`,
      bidding_strategy_type: enums.BiddingStrategyType.MANUAL_CPC,
      manual_cpc: {
        enhanced_cpc_enabled: false, // Pure manual, no enhanced CPC
      },
    },
  ]);

  console.log(`   ✅ Successfully switched to Manual CPC\n`);
}

const args = process.argv.slice(2);
const campaignArg = args.find(a => a.startsWith('--campaign='));
const campaignName = campaignArg ? campaignArg.split('=')[1] : 'Windows – Somerset';

switchToManualCPC(campaignName).catch(error => {
  console.error('❌ Error switching to Manual CPC:');
  console.error(error.message || error);
  process.exit(1);
});
