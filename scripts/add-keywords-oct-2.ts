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

const AD_GROUP_ID = '186804898798'; // Windows – Somerset Ad Group
const CUSTOMER_ID = process.env.GOOGLE_ADS_CUSTOMER_ID || '';

async function addKeywords() {
  console.log('\n📝 Adding keywords as per friend\'s instructions\n');

  const keywordsToAdd = [
    // High-intent PHRASE match
    { text: 'window cleaning near me', matchType: enums.KeywordMatchType.PHRASE, bid: 2.50 },

    // Town keywords (PHRASE match at £2.00)
    { text: 'window cleaning somerton', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaning langport', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaning cheddar', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaning frome', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaning radstock', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaning midsomer norton', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaning wincanton', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },

    // Alternative town formats (cleaner variants)
    { text: 'window cleaner somerton', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaner langport', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaner cheddar', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaner frome', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaner radstock', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaner midsomer norton', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
    { text: 'window cleaner wincanton', matchType: enums.KeywordMatchType.PHRASE, bid: 2.00 },
  ];

  console.log('Will add:\n');
  console.log('High-intent:');
  console.log('  "window cleaning near me" (PHRASE) → £2.50\n');
  console.log('Towns (PHRASE at £2.00):');
  console.log('  Somerton, Langport, Cheddar, Frome, Radstock, Midsomer Norton, Wincanton');
  console.log('  (Both "window cleaning [town]" and "window cleaner [town]" variants)\n');

  const operations = [];

  for (const kw of keywordsToAdd) {
    operations.push({
      ad_group: `customers/${CUSTOMER_ID}/adGroups/${AD_GROUP_ID}`,
      keyword: {
        text: kw.text,
        match_type: kw.matchType,
      },
      cpc_bid_micros: Math.round(kw.bid * 1_000_000),
      status: enums.AdGroupCriterionStatus.ENABLED,
    });
  }

  console.log(`🚀 Adding ${operations.length} keywords...\n`);

  try {
    const result = await customer.adGroupCriteria.create(operations);
    console.log(`✅ Successfully added ${result.length} keywords\n`);

    console.log('Summary:');
    console.log('  ✅ "window cleaning near me" (PHRASE) £2.50');
    console.log('  ✅ 14 town keywords (PHRASE) £2.00');
    console.log('\nNote: Will mirror to EXACT for top-performing towns after we see volume.\n');

  } catch (error: any) {
    if (error.message && error.message.includes('DUPLICATE')) {
      console.log('⚠️  Some keywords already exist. Checking which ones...\n');

      // Try adding one by one to identify duplicates
      let added = 0;
      let skipped = 0;

      for (const op of operations) {
        try {
          await customer.adGroupCriteria.create([op]);
          console.log(`  ✅ Added: ${op.keyword.text}`);
          added++;
        } catch (e: any) {
          if (e.message && e.message.includes('DUPLICATE')) {
            console.log(`  ⏭️  Skipped (exists): ${op.keyword.text}`);
            skipped++;
          } else {
            console.log(`  ❌ Error: ${op.keyword.text} - ${e.message}`);
          }
        }
      }

      console.log(`\n✅ Added ${added} new keywords`);
      console.log(`⏭️  Skipped ${skipped} existing keywords\n`);

    } else {
      throw error;
    }
  }
}

addKeywords().catch(console.error);
