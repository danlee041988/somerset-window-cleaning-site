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

async function getAllCampaignsHistory() {
  console.log('📊 ALL Campaigns - Historical Performance (Last 90 Days)\n');

  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign
    WHERE segments.date >= '2024-07-01' AND segments.date <= '2025-10-02'
  `;

  const results = await customer.query(query);

  // Group by campaign
  const campaignMap = new Map();

  results.forEach(row => {
    if (!row.campaign) return;
    const id = row.campaign.id;
    if (!campaignMap.has(id)) {
      campaignMap.set(id, {
        name: row.campaign.name || 'Unknown',
        status: row.campaign.status,
        impressions: 0,
        clicks: 0,
        cost: 0,
        conversions: 0
      });
    }

    const campaign = campaignMap.get(id);
    campaign.impressions += row.metrics?.impressions || 0;
    campaign.clicks += row.metrics?.clicks || 0;
    campaign.cost += (row.metrics?.cost_micros || 0) / 1000000;
    campaign.conversions += row.metrics?.conversions || 0;
  });

  // Sort by spend (highest first)
  const sorted = Array.from(campaignMap.values()).sort((a, b) => b.cost - a.cost);

  console.log('Campaign Performance (Last 90 Days) - Sorted by Spend:\n');
  console.log('='.repeat(100));

  sorted.forEach(campaign => {
    const avgCPC = campaign.clicks > 0 ? campaign.cost / campaign.clicks : 0;
    const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions * 100) : 0;

    console.log(`📌 ${campaign.name}`);
    console.log(`   Status: ${campaign.status}`);
    console.log(`   Impressions: ${campaign.impressions.toLocaleString()}`);
    console.log(`   Clicks: ${campaign.clicks.toLocaleString()}`);
    console.log(`   Spend: £${campaign.cost.toFixed(2)}`);
    console.log(`   Avg CPC: £${avgCPC.toFixed(2)}`);
    console.log(`   CTR: ${ctr.toFixed(2)}%`);
    console.log(`   Conversions: ${campaign.conversions}`);
    console.log('');
  });

  console.log(`\n📊 Total Campaigns: ${sorted.length}`);
  const totalSpend = sorted.reduce((sum, c) => sum + c.cost, 0);
  const totalClicks = sorted.reduce((sum, c) => sum + c.clicks, 0);
  console.log(`💰 Total Spend (90 days): £${totalSpend.toFixed(2)}`);
  console.log(`🖱️  Total Clicks (90 days): ${totalClicks.toLocaleString()}`);
}

getAllCampaignsHistory().catch(error => {
  console.error('❌ Error:');
  console.error(error);
  process.exit(1);
});
