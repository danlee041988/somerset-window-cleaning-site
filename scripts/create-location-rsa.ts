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

async function createLocationRSA() {
  console.log('\n📝 Creating location-aware RSA for Windows ad group\n');

  const headlines = [
    { text: 'Window Cleaning in {LOCATION(City)}' },
    { text: '4-Weekly Rounds • Pure Water' },
    { text: 'Fully Insured • Local Team' },
    { text: 'Professional Window Cleaners' },
    { text: 'Streak-Free Results' },
    { text: 'Trusted in Somerset' },
    { text: 'Fast Quotes • Book Today' },
    { text: 'Residential & Commercial' },
    { text: 'Same-Day Quotes Available' },
    { text: 'Card & Cash Accepted' },
    { text: 'Conservatory Cleaning' },
    { text: 'Gutter Cleaning Available' },
  ];

  const descriptions = [
    { text: 'Reliable, streak-free results. Fast quotes. Card & cash accepted.' },
    { text: 'Trusted in Somerset. Text or call for today\'s quote.' },
    { text: 'Professional window cleaning with pure water. Frames & sills included.' },
    { text: 'Local family business. Fully insured. Regular 4-weekly service available.' },
  ];

  console.log('Headlines (12):');
  headlines.forEach((h, i) => console.log(`  ${i + 1}. ${h.text}`));

  console.log('\nDescriptions (4):');
  descriptions.forEach((d, i) => console.log(`  ${i + 1}. ${d.text}`));

  const responsiveSearchAd = {
    headlines: headlines.map(h => ({ text: h.text })),
    descriptions: descriptions.map(d => ({ text: d.text })),
    path1: 'book-now',
    path2: 'somerset',
    final_urls: ['https://somersetwindowcleaning.co.uk/book-now'],
  };

  const adOperation = {
    ad_group: `customers/${CUSTOMER_ID}/adGroups/${AD_GROUP_ID}`,
    ad: {
      responsive_search_ad: responsiveSearchAd,
      final_urls: ['https://somersetwindowcleaning.co.uk/book-now'],
    },
    status: enums.AdGroupAdStatus.ENABLED,
  };

  console.log('\n🚀 Creating RSA...\n');

  try {
    const result = await customer.adGroupAds.create([adOperation]);
    console.log('✅ Location-aware RSA created successfully!\n');

    console.log('Key features:');
    console.log('  ✅ {LOCATION(City)} dynamic insertion in headline 1');
    console.log('  ✅ 12 varied headlines (no pinning for high Ad Strength)');
    console.log('  ✅ 4 descriptions with value props');
    console.log('  ✅ Landing page: /book-now (ensure H1 matches keyword + town)');
    console.log('  ✅ Path: /book-now/somerset\n');

    return result;

  } catch (error: any) {
    console.error('❌ Error creating RSA:');
    console.error(error.errors?.[0]?.message || error.message || error);
    throw error;
  }
}

createLocationRSA().catch(console.error);
