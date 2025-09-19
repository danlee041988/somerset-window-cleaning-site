/**
 * PageSpeed Insights API Integration
 * Monitors website performance and provides optimization insights
 */

// PageSpeed Insights API configuration
const PAGESPEED_API_KEY = process.env.NEXT_PUBLIC_PAGESPEED_API_KEY;
const PAGESPEED_API_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export interface PageSpeedMetrics {
  url: string;
  timestamp: string;
  strategy: 'mobile' | 'desktop';
  performance: {
    score: number;
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    cls: number; // Cumulative Layout Shift
    fid: number; // First Input Delay
    ttfb: number; // Time to First Byte
  };
  opportunities: Array<{
    id: string;
    title: string;
    description: string;
    savings: number;
    impact: 'high' | 'medium' | 'low';
  }>;
  diagnostics: Array<{
    id: string;
    title: string;
    description: string;
    value: string;
  }>;
}

export interface PageSpeedReport {
  mobile: PageSpeedMetrics;
  desktop: PageSpeedMetrics;
  summary: {
    overallScore: number;
    criticalIssues: number;
    recommendations: string[];
  };
}

/**
 * Run PageSpeed analysis for a URL
 */
export async function analyzePageSpeed(
  url: string, 
  strategy: 'mobile' | 'desktop' = 'mobile'
): Promise<PageSpeedMetrics | null> {
  if (!PAGESPEED_API_KEY) {
    console.warn('PageSpeed API key not configured');
    return null;
  }

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
      throw new Error(`PageSpeed API error: ${response.status}`);
    }

    const data = await response.json();
    return parsePageSpeedData(data, url, strategy);
  } catch (error) {
    console.error('PageSpeed analysis failed:', error);
    return null;
  }
}

/**
 * Analyze both mobile and desktop performance
 */
export async function analyzeFullPageSpeed(url: string): Promise<PageSpeedReport | null> {
  try {
    const [mobile, desktop] = await Promise.all([
      analyzePageSpeed(url, 'mobile'),
      analyzePageSpeed(url, 'desktop')
    ]);

    if (!mobile || !desktop) {
      return null;
    }

    const overallScore = Math.round((mobile.performance.score + desktop.performance.score) / 2);
    const criticalIssues = [
      ...mobile.opportunities.filter(o => o.impact === 'high'),
      ...desktop.opportunities.filter(o => o.impact === 'high')
    ].length;

    const recommendations = generateRecommendations(mobile, desktop);

    return {
      mobile,
      desktop,
      summary: {
        overallScore,
        criticalIssues,
        recommendations
      }
    };
  } catch (error) {
    console.error('Full PageSpeed analysis failed:', error);
    return null;
  }
}

/**
 * Parse PageSpeed API response
 */
function parsePageSpeedData(
  data: any, 
  url: string, 
  strategy: 'mobile' | 'desktop'
): PageSpeedMetrics {
  const lighthouse = data.lighthouseResult;
  const audits = lighthouse.audits;

  // Extract core web vitals
  const performance = {
    score: Math.round(lighthouse.categories.performance.score * 100),
    fcp: audits['first-contentful-paint']?.numericValue || 0,
    lcp: audits['largest-contentful-paint']?.numericValue || 0,
    cls: audits['cumulative-layout-shift']?.numericValue || 0,
    fid: audits['max-potential-fid']?.numericValue || 0,
    ttfb: audits['server-response-time']?.numericValue || 0
  };

  // Extract optimization opportunities
  const opportunities = Object.entries(audits)
    .filter(([_, audit]: [string, any]) => 
      audit.details?.type === 'opportunity' && audit.numericValue > 0
    )
    .map(([id, audit]: [string, any]) => ({
      id,
      title: audit.title,
      description: audit.description,
      savings: Math.round(audit.numericValue),
      impact: audit.numericValue > 1000 ? 'high' as const : 
              audit.numericValue > 500 ? 'medium' as const : 'low' as const
    }))
    .sort((a, b) => b.savings - a.savings);

  // Extract diagnostics
  const diagnostics = Object.entries(audits)
    .filter(([_, audit]: [string, any]) => 
      audit.scoreDisplayMode === 'informative' && audit.displayValue
    )
    .map(([id, audit]: [string, any]) => ({
      id,
      title: audit.title,
      description: audit.description,
      value: audit.displayValue
    }));

  return {
    url,
    timestamp: new Date().toISOString(),
    strategy,
    performance,
    opportunities: opportunities.slice(0, 10), // Top 10 opportunities
    diagnostics: diagnostics.slice(0, 5) // Top 5 diagnostics
  };
}

/**
 * Generate actionable recommendations
 */
function generateRecommendations(mobile: PageSpeedMetrics, desktop: PageSpeedMetrics): string[] {
  const recommendations: string[] = [];

  // Performance score recommendations
  if (mobile.performance.score < 90 || desktop.performance.score < 90) {
    recommendations.push('Optimize images and enable next-gen formats (WebP/AVIF)');
  }

  // Core Web Vitals recommendations
  if (mobile.performance.lcp > 2500 || desktop.performance.lcp > 2500) {
    recommendations.push('Improve Largest Contentful Paint by optimizing critical resources');
  }

  if (mobile.performance.cls > 0.1 || desktop.performance.cls > 0.1) {
    recommendations.push('Fix Cumulative Layout Shift by adding size attributes to images');
  }

  if (mobile.performance.fid > 100 || desktop.performance.fid > 100) {
    recommendations.push('Reduce JavaScript execution time and defer non-critical scripts');
  }

  // Opportunity-based recommendations
  const allOpportunities = [...mobile.opportunities, ...desktop.opportunities];
  const highImpactOps = allOpportunities.filter(op => op.impact === 'high');

  if (highImpactOps.some(op => op.id.includes('image'))) {
    recommendations.push('Compress and optimize images using modern formats');
  }

  if (highImpactOps.some(op => op.id.includes('javascript'))) {
    recommendations.push('Remove unused JavaScript and defer non-critical scripts');
  }

  if (highImpactOps.some(op => op.id.includes('css'))) {
    recommendations.push('Eliminate unused CSS and inline critical styles');
  }

  return recommendations.slice(0, 5); // Top 5 recommendations
}

/**
 * Monitor key pages
 */
export const MONITORED_PAGES = [
  'https://somersetwindowcleaning.co.uk',
  'https://somersetwindowcleaning.co.uk/book-appointment',
  'https://somersetwindowcleaning.co.uk/services',
  'https://somersetwindowcleaning.co.uk/services/window-cleaning',
  'https://somersetwindowcleaning.co.uk/services/gutter-clearing'
] as const;

/**
 * Run performance audit on all key pages
 */
export async function auditSitePerformance(): Promise<Record<string, PageSpeedReport | null>> {
  const results: Record<string, PageSpeedReport | null> = {};

  for (const url of MONITORED_PAGES) {
    console.log(`🔍 Analyzing ${url}...`);
    results[url] = await analyzeFullPageSpeed(url);
    
    // Rate limiting - wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  return results;
}

/**
 * Generate performance report
 */
export function generatePerformanceReport(
  results: Record<string, PageSpeedReport | null>
): string {
  let report = '# Somerset Window Cleaning - Performance Report\n\n';
  report += `Generated: ${new Date().toISOString()}\n\n`;

  for (const [url, result] of Object.entries(results)) {
    if (!result) {
      report += `## ❌ ${url}\nAnalysis failed\n\n`;
      continue;
    }

    const { mobile, desktop, summary } = result;
    
    report += `## 📊 ${url}\n`;
    report += `**Overall Score:** ${summary.overallScore}/100\n`;
    report += `**Critical Issues:** ${summary.criticalIssues}\n\n`;
    
    report += `### Mobile Performance\n`;
    report += `- **Score:** ${mobile.performance.score}/100\n`;
    report += `- **LCP:** ${Math.round(mobile.performance.lcp)}ms\n`;
    report += `- **FID:** ${Math.round(mobile.performance.fid)}ms\n`;
    report += `- **CLS:** ${mobile.performance.cls.toFixed(3)}\n\n`;
    
    report += `### Desktop Performance\n`;
    report += `- **Score:** ${desktop.performance.score}/100\n`;
    report += `- **LCP:** ${Math.round(desktop.performance.lcp)}ms\n`;
    report += `- **FID:** ${Math.round(desktop.performance.fid)}ms\n`;
    report += `- **CLS:** ${desktop.performance.cls.toFixed(3)}\n\n`;
    
    if (summary.recommendations.length > 0) {
      report += `### 🎯 Priority Recommendations\n`;
      summary.recommendations.forEach((rec, i) => {
        report += `${i + 1}. ${rec}\n`;
      });
      report += '\n';
    }
    
    report += '---\n\n';
  }

  return report;
}
