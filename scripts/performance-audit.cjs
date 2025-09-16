const fs = require('fs');

/**
 * Performance Audit Script for Somerset Window Cleaning
 * Uses PageSpeed Insights API to analyze site performance
 */

const PAGESPEED_API_KEY = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY;
const PAGESPEED_API_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

const MONITORED_PAGES = [
  'https://somersetwindowcleaning.co.uk',
  'https://somersetwindowcleaning.co.uk/get-in-touch',
  'https://somersetwindowcleaning.co.uk/services',
  'https://somersetwindowcleaning.co.uk/services/window-cleaning',
  'https://somersetwindowcleaning.co.uk/services/gutter-clearing'
];

class PerformanceAuditor {
  constructor() {
    if (!PAGESPEED_API_KEY) {
      console.error('❌ NEXT_PUBLIC_PAGESPEED_API_KEY not found in environment variables');
      console.log('🔧 Please add your PageSpeed Insights API key to .env.local');
      process.exit(1);
    }
  }

  async analyzeUrl(url, strategy = 'mobile') {
    console.log(`🔍 Analyzing ${url} (${strategy})...`);
    
    try {
      const apiUrl = new URL(PAGESPEED_API_BASE);
      apiUrl.searchParams.set('url', url);
      apiUrl.searchParams.set('key', PAGESPEED_API_KEY);
      apiUrl.searchParams.set('strategy', strategy);
      apiUrl.searchParams.set('category', 'performance');
      apiUrl.searchParams.set('category', 'accessibility');
      apiUrl.searchParams.set('category', 'best-practices');
      apiUrl.searchParams.set('category', 'seo');

      const response = await fetch(apiUrl.toString());
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseResults(data, url, strategy);
    } catch (error) {
      console.error(`❌ Error analyzing ${url}:`, error.message);
      return null;
    }
  }

  parseResults(data, url, strategy) {
    const lighthouse = data.lighthouseResult;
    const audits = lighthouse.audits;
    const categories = lighthouse.categories;

    // Core Web Vitals
    const performance = {
      score: Math.round(categories.performance.score * 100),
      accessibility: Math.round(categories.accessibility.score * 100),
      bestPractices: Math.round(categories['best-practices'].score * 100),
      seo: Math.round(categories.seo.score * 100),
      fcp: Math.round(audits['first-contentful-paint']?.numericValue || 0),
      lcp: Math.round(audits['largest-contentful-paint']?.numericValue || 0),
      cls: parseFloat((audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
      fid: Math.round(audits['max-potential-fid']?.numericValue || 0),
      ttfb: Math.round(audits['server-response-time']?.numericValue || 0)
    };

    // Extract top opportunities
    const opportunities = Object.entries(audits)
      .filter(([_, audit]) => audit.details?.type === 'opportunity' && audit.numericValue > 0)
      .map(([id, audit]) => ({
        id,
        title: audit.title,
        savings: Math.round(audit.numericValue),
        impact: audit.numericValue > 1000 ? 'HIGH' : 
                audit.numericValue > 500 ? 'MEDIUM' : 'LOW'
      }))
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 5);

    return {
      url,
      strategy,
      timestamp: new Date().toISOString(),
      performance,
      opportunities
    };
  }

  async auditAllPages() {
    console.log('🚀 Starting performance audit for Somerset Window Cleaning...\n');
    
    const results = {};

    for (const url of MONITORED_PAGES) {
      // Analyze both mobile and desktop
      const [mobile, desktop] = await Promise.all([
        this.analyzeUrl(url, 'mobile'),
        this.analyzeUrl(url, 'desktop')
      ]);

      results[url] = { mobile, desktop };

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return results;
  }

  generateReport(results) {
    let report = '# Somerset Window Cleaning - Performance Audit Report\n\n';
    report += `**Generated:** ${new Date().toLocaleString()}\n\n`;

    let totalScore = 0;
    let pageCount = 0;

    for (const [url, data] of Object.entries(results)) {
      if (!data.mobile || !data.desktop) continue;

      const mobile = data.mobile;
      const desktop = data.desktop;
      const avgScore = Math.round((mobile.performance.score + desktop.performance.score) / 2);
      
      totalScore += avgScore;
      pageCount++;

      report += `## 📊 ${url}\n\n`;
      report += `**Overall Performance:** ${avgScore}/100\n\n`;

      // Performance scores table
      report += `| Metric | Mobile | Desktop |\n`;
      report += `|--------|--------|--------|\n`;
      report += `| Performance | ${mobile.performance.score}/100 | ${desktop.performance.score}/100 |\n`;
      report += `| Accessibility | ${mobile.performance.accessibility}/100 | ${desktop.performance.accessibility}/100 |\n`;
      report += `| Best Practices | ${mobile.performance.bestPractices}/100 | ${desktop.performance.bestPractices}/100 |\n`;
      report += `| SEO | ${mobile.performance.seo}/100 | ${desktop.performance.seo}/100 |\n\n`;

      // Core Web Vitals
      report += `### 🎯 Core Web Vitals\n\n`;
      report += `| Metric | Mobile | Desktop | Status |\n`;
      report += `|--------|--------|---------|--------|\n`;
      report += `| LCP (ms) | ${mobile.performance.lcp} | ${desktop.performance.lcp} | ${mobile.performance.lcp <= 2500 ? '✅' : '❌'} |\n`;
      report += `| FID (ms) | ${mobile.performance.fid} | ${desktop.performance.fid} | ${mobile.performance.fid <= 100 ? '✅' : '❌'} |\n`;
      report += `| CLS | ${mobile.performance.cls} | ${desktop.performance.cls} | ${mobile.performance.cls <= 0.1 ? '✅' : '❌'} |\n`;
      report += `| FCP (ms) | ${mobile.performance.fcp} | ${desktop.performance.fcp} | ${mobile.performance.fcp <= 1800 ? '✅' : '❌'} |\n\n`;

      // Top opportunities
      if (mobile.opportunities.length > 0) {
        report += `### 🔧 Top Optimization Opportunities (Mobile)\n\n`;
        mobile.opportunities.forEach((opp, i) => {
          report += `${i + 1}. **${opp.title}** (${opp.impact} impact, ${opp.savings}ms savings)\n`;
        });
        report += '\n';
      }

      report += '---\n\n';
    }

    // Summary
    const avgSiteScore = Math.round(totalScore / pageCount);
    report += `## 📈 Summary\n\n`;
    report += `**Average Site Performance:** ${avgSiteScore}/100\n`;
    report += `**Pages Analyzed:** ${pageCount}\n`;
    report += `**Audit Date:** ${new Date().toLocaleDateString()}\n\n`;

    // Recommendations
    report += `## 🎯 Priority Recommendations\n\n`;
    if (avgSiteScore >= 90) {
      report += `✅ **Excellent Performance** - Your site is performing very well!\n\n`;
      report += `**Maintenance Items:**\n`;
      report += `- Monitor performance monthly\n`;
      report += `- Optimize new images before upload\n`;
      report += `- Review third-party scripts quarterly\n`;
    } else if (avgSiteScore >= 75) {
      report += `⚠️ **Good Performance** - Some optimization opportunities available\n\n`;
      report += `**Quick Wins:**\n`;
      report += `- Compress and optimize images\n`;
      report += `- Enable browser caching\n`;
      report += `- Defer non-critical JavaScript\n`;
    } else {
      report += `❌ **Performance Issues Detected** - Immediate optimization needed\n\n`;
      report += `**Critical Actions:**\n`;
      report += `- Optimize large images immediately\n`;
      report += `- Review and minimize JavaScript\n`;
      report += `- Enable compression and caching\n`;
      report += `- Consider image CDN implementation\n`;
    }

    return report;
  }

  async run() {
    try {
      const results = await this.auditAllPages();
      const report = this.generateReport(results);

      // Save results
      const timestamp = new Date().toISOString().split('T')[0];
      const reportPath = `performance-report-${timestamp}.md`;
      const jsonPath = `performance-data-${timestamp}.json`;

      fs.writeFileSync(reportPath, report);
      fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

      console.log('✅ Performance audit completed!');
      console.log(`📊 Report saved: ${reportPath}`);
      console.log(`📁 Raw data: ${jsonPath}`);
      
      // Quick summary
      const totalPages = Object.keys(results).length;
      const avgMobileScore = Object.values(results)
        .filter(r => r.mobile)
        .reduce((sum, r) => sum + r.mobile.performance.score, 0) / totalPages;
      
      console.log(`\n📈 Quick Summary:`);
      console.log(`   Average Mobile Score: ${Math.round(avgMobileScore)}/100`);
      console.log(`   Pages Analyzed: ${totalPages}`);

    } catch (error) {
      console.error('❌ Audit failed:', error.message);
      process.exit(1);
    }
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new PerformanceAuditor();
  auditor.run().catch(console.error);
}

module.exports = PerformanceAuditor;