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

async function setCampaignBudget(campaignName: string, dailyBudgetGBP: number) {
  console.log(`\n💰 Setting budget for "${campaignName}" to £${dailyBudgetGBP}/day\n`);

  // Find campaign
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign_budget.amount_micros,
      campaign_budget.resource_name
    FROM campaign
    WHERE
      campaign.name = '${campaignName}'
      AND campaign.status != REMOVED
  `;

  const rows = await customer.query(query);
  const campaign = Array.from(rows)[0];

  if (!campaign) {
    console.error(`❌ Campaign "${campaignName}" not found`);
    process.exit(1);
  }

  const oldBudgetGBP = (campaign.campaign_budget.amount_micros || 0) / 1_000_000;
  const newBudgetMicros = Math.round(dailyBudgetGBP * 1_000_000);

  console.log(`Current budget: £${oldBudgetGBP.toFixed(2)}/day`);
  console.log(`New budget: £${dailyBudgetGBP.toFixed(2)}/day\n`);

  // Update budget
  await customer.campaignBudgets.update([{
    resource_name: campaign.campaign_budget.resource_name,
    amount_micros: newBudgetMicros,
  }]);

  console.log(`✅ Budget updated successfully\n`);
}

const args = process.argv.slice(2);
const campaignIndex = args.indexOf('--campaign');
const dailyIndex = args.indexOf('--daily');

if (campaignIndex === -1 || dailyIndex === -1) {
  console.error('Usage: npx tsx scripts/set-campaign-budget.ts --campaign "Campaign Name" --daily 35');
  process.exit(1);
}

const campaignName = args[campaignIndex + 1];
const dailyBudget = parseFloat(args[dailyIndex + 1]);

setCampaignBudget(campaignName, dailyBudget).catch(console.error);
