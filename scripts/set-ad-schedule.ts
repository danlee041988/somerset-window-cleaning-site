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

async function setAdSchedule(campaignName: string) {
  console.log(`\n📅 Setting ad schedule for "${campaignName}"\n`);
  console.log(`Schedule: Mon-Fri 08:00-20:00 (matching historical success pattern)\n`);

  // Find campaign
  const campaignQuery = `
    SELECT campaign.id, campaign.name
    FROM campaign
    WHERE campaign.name = '${campaignName}'
      AND campaign.status != REMOVED
  `;

  const campaignRows = await customer.query(campaignQuery);
  const campaign = Array.from(campaignRows)[0];

  if (!campaign) {
    console.error(`❌ Campaign "${campaignName}" not found`);
    process.exit(1);
  }

  const campaignId = campaign.campaign.id;

  // Get existing ad schedules
  const scheduleQuery = `
    SELECT
      campaign_criterion.criterion_id,
      campaign_criterion.ad_schedule.day_of_week,
      campaign_criterion.ad_schedule.start_hour,
      campaign_criterion.ad_schedule.end_hour
    FROM campaign_criterion
    WHERE
      campaign.id = ${campaignId}
      AND campaign_criterion.type = AD_SCHEDULE
  `;

  const existingSchedules = await customer.query(scheduleQuery);
  const scheduleCount = Array.from(existingSchedules).length;

  if (scheduleCount > 0) {
    console.log(`⚠️  Found ${scheduleCount} existing ad schedules. Removing them first...\n`);

    const removeOps = [];
    for (const row of existingSchedules) {
      const criterionId = row.campaign_criterion.criterion_id;
      removeOps.push({
        resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaignCriteria/${campaignId}~${criterionId}`,
      });
    }

    if (removeOps.length > 0) {
      await customer.campaignCriteria.remove(removeOps);
      console.log(`✅ Removed ${removeOps.length} existing schedules\n`);
    }
  }

  // Create new schedule: Mon-Fri 08:00-20:00
  const weekdays = [
    enums.DayOfWeek.MONDAY,
    enums.DayOfWeek.TUESDAY,
    enums.DayOfWeek.WEDNESDAY,
    enums.DayOfWeek.THURSDAY,
    enums.DayOfWeek.FRIDAY,
  ];

  const createOps = weekdays.map(day => ({
    campaign: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaigns/${campaignId}`,
    ad_schedule: {
      day_of_week: day,
      start_hour: 8,
      start_minute: enums.MinuteOfHour.ZERO,
      end_hour: 20,
      end_minute: enums.MinuteOfHour.ZERO,
    },
  }));

  await customer.campaignCriteria.create(createOps);

  console.log(`✅ Ad schedule set successfully:`);
  console.log(`   Monday-Friday: 08:00-20:00`);
  console.log(`   Weekend: No ads (budget saved for weekday conversions)\n`);
}

const args = process.argv.slice(2);
const campaignIndex = args.indexOf('--campaign');

if (campaignIndex === -1) {
  console.error('Usage: npx tsx scripts/set-ad-schedule.ts --campaign "Campaign Name"');
  process.exit(1);
}

const campaignName = args[campaignIndex + 1];
setAdSchedule(campaignName).catch(console.error);
