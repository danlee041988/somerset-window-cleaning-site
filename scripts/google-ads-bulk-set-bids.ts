#!/usr/bin/env tsx
// scripts/google-ads-bulk-set-bids.ts
import { GoogleAdsApi } from 'google-ads-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

type PlanRow = { keyword: string; bid_gbp: number };

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.findIndex(a => a.startsWith(`--${flag}=`));
    if (i >= 0) return args[i].split('=')[1];
    const j = args.indexOf(`--${flag}`);
    return j >= 0 ? true : undefined;
  };
  return {
    campaign: (get('campaign') as string) || 'Windows – Somerset',
    planPath: (get('plan') as string) || './docs/ads/bid-plan-2025-10-02.csv',
    dryRun: Boolean(get('dry-run')),
  };
}

function loadPlan(p: string): PlanRow[] {
  const csv = fs.readFileSync(path.resolve(p), 'utf8').trim();
  const lines = csv.split(/\r?\n/).slice(1); // skip header
  return lines.map(line => {
    const [keyword, bid] = line.split(',');
    return { keyword: keyword.trim().toLowerCase(), bid_gbp: Number(bid) };
  }).filter(r => r.keyword && !Number.isNaN(r.bid_gbp));
}

function gbpToMicros(g: number) { return Math.round(g * 1_000_000); }

async function main() {
  const { campaign, planPath, dryRun } = parseArgs();
  const plan = loadPlan(planPath);

  console.log(`\n🎯 Google Ads Bulk Bid Setter`);
  console.log(`   Campaign: ${campaign}`);
  console.log(`   Plan: ${planPath}`);
  console.log(`   Mode: ${dryRun ? 'DRY-RUN (validate only)' : 'LIVE (will apply changes)'}\n`);

  const client = new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
  });

  const customer = client.Customer({
    customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
    refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
  });

  // 1) Pull all non-negative keywords for the target campaign
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      ad_group.id,
      ad_group.name,
      ad_group_criterion.criterion_id,
      ad_group_criterion.status,
      ad_group_criterion.keyword.text,
      ad_group_criterion.keyword.match_type,
      ad_group_criterion.cpc_bid_micros
    FROM ad_group_criterion
    WHERE
      ad_group_criterion.type = KEYWORD
      AND ad_group_criterion.negative = FALSE
      AND campaign.name = '${campaign.replace(/'/g, "\\'")}'
      AND campaign.status IN (ENABLED, PAUSED)
  `;

  const rows = await customer.query(query);

  // 2) Build update operations from plan
  const ops: any[] = [];
  const updates: Array<{keyword: string, oldBid: number, newBid: number}> = [];

  for (const row of rows) {
    const text = String(row.ad_group_criterion.keyword?.text || '').toLowerCase();
    const match = plan.find(p => text.includes(p.keyword));
    if (!match) continue;

    const resourceName = `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/adGroupCriteria/${row.ad_group.id}~${row.ad_group_criterion.criterion_id}`;

    const oldMicros = row.ad_group_criterion.cpc_bid_micros || 0;
    const newMicros = gbpToMicros(match.bid_gbp);

    updates.push({
      keyword: text,
      oldBid: oldMicros / 1_000_000,
      newBid: match.bid_gbp
    });

    ops.push({
      resource_name: resourceName,
      cpc_bid_micros: newMicros,
    });
  }

  if (ops.length === 0) {
    console.log(`❌ No keywords matched the plan for campaign: ${campaign}`);
    return;
  }

  console.log(`📊 Prepared ${ops.length} bid updates:\n`);
  updates.forEach(u => {
    console.log(`   "${u.keyword}": £${u.oldBid.toFixed(2)} → £${u.newBid.toFixed(2)}`);
  });
  console.log('');

  if (dryRun) {
    console.log(`✅ DRY-RUN complete. No changes applied. Ready to run live.`);
    return;
  }

  const resp = await customer.adGroupCriteria.update(ops);
  console.log(`✅ LIVE update complete. ${resp.length} keywords updated.\n`);
}

main().catch(e => {
  console.error('❌ Bid update failed:', e?.message || e);
  process.exit(1);
});
