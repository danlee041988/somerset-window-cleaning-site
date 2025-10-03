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

async function getHistoricalData() {
  console.log('📊 Historical Campaign Performance (Old Campaigns)\n');

  // Get campaign-level data for last 90 days
  const campaignQuery = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign
    WHERE segments.date DURING LAST_90_DAYS
      AND (campaign.name LIKE '%Multi%' OR campaign.name = 'Somerset Window Cleaning')
  `;

  const campaigns = await customer.query(campaignQuery);

  campaigns.forEach(row => {
    if (!row.campaign) return;
    const costGBP = (row.metrics?.cost_micros || 0) / 1000000;
    const avgCPC = row.metrics?.clicks ? costGBP / row.metrics.clicks : 0;

    console.log(`Campaign: ${row.campaign.name || 'Unknown'}`);
    console.log(`  Status: ${row.campaign.status}`);
    console.log(`  Last 90 Days:`);
    console.log(`    Impressions: ${row.metrics?.impressions || 0}`);
    console.log(`    Clicks: ${row.metrics?.clicks || 0}`);
    console.log(`    Spend: £${costGBP.toFixed(2)}`);
    console.log(`    Avg CPC: £${avgCPC.toFixed(2)}`);
    console.log(`    Conversions: ${row.metrics?.conversions || 0}`);
    console.log('');
  });

  // Get daily breakdown for last 30 days
  const dailyQuery = `
    SELECT
      campaign.name,
      segments.date,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros
    FROM campaign
    WHERE segments.date DURING LAST_30_DAYS
      AND (campaign.name LIKE '%Multi%' OR campaign.name = 'Somerset Window Cleaning')
    ORDER BY segments.date DESC
    LIMIT 50
  `;

  console.log('\n📅 Daily Breakdown (Last 30 Days):');
  console.log('='.repeat(100));

  const daily = await customer.query(dailyQuery);
  daily.forEach(row => {
    if (!row.segments || !row.campaign || !row.campaign.name) return;
    const costGBP = (row.metrics?.cost_micros || 0) / 1000000;
    console.log(`${row.segments.date} | ${row.campaign.name.substring(0, 30).padEnd(30)} | Impr: ${String(row.metrics?.impressions || 0).padStart(5)} | Clicks: ${String(row.metrics?.clicks || 0).padStart(3)} | £${costGBP.toFixed(2)}`);
  });
}

getHistoricalData().catch(error => {
  console.error('❌ Error fetching historical data:');
  console.error(error.message);
  process.exit(1);
});
