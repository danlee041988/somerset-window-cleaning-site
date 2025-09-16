const fs = require('fs');
const path = require('path');

/**
 * CleanShot Screenshot Monitor for Somerset Window Cleaning
 * Automatically processes screenshots for business insights
 */

const CLEANSHOT_PATH = '/Users/danlee/Library/Application Support/CleanShot/media';

class CleanShotMonitor {
  constructor() {
    this.lastProcessed = this.loadLastProcessed();
    this.screenshotPatterns = {
      googleBusiness: /business\.google\.com|Google.*Business/i,
      analytics: /analytics\.google\.com|Analytics/i,
      reviews: /review|rating|star/i,
      customerInquiry: /contact|inquiry|quote|message/i,
      competitors: /window.*clean|Somerset.*Window/i,
      socialMedia: /facebook|instagram|twitter/i
    };
  }

  loadLastProcessed() {
    try {
      const data = fs.readFileSync('./.cleanshot-state.json', 'utf8');
      return JSON.parse(data).lastProcessed || 0;
    } catch {
      return 0;
    }
  }

  saveLastProcessed(timestamp) {
    fs.writeFileSync('./.cleanshot-state.json', JSON.stringify({
      lastProcessed: timestamp,
      updatedAt: new Date().toISOString()
    }));
  }

  async scanForNewScreenshots() {
    console.log('📸 Scanning CleanShot folder for new screenshots...');

    try {
      if (!fs.existsSync(CLEANSHOT_PATH)) {
        console.log('❌ CleanShot folder not found');
        return [];
      }

      const mediaFolders = fs.readdirSync(CLEANSHOT_PATH)
        .filter(name => name.startsWith('media_'))
        .map(name => path.join(CLEANSHOT_PATH, name));

      const newScreenshots = [];

      for (const folder of mediaFolders) {
        try {
          const stats = fs.statSync(folder);
          const folderTime = stats.mtime.getTime();

          if (folderTime > this.lastProcessed) {
            const files = fs.readdirSync(folder)
              .filter(file => file.toLowerCase().includes('cleanshot'))
              .map(file => ({
                path: path.join(folder, file),
                timestamp: folderTime,
                folder: path.basename(folder)
              }));

            newScreenshots.push(...files);
          }
        } catch (error) {
          // Skip inaccessible folders
          continue;
        }
      }

      console.log(`📊 Found ${newScreenshots.length} new screenshots`);
      return newScreenshots.sort((a, b) => b.timestamp - a.timestamp);

    } catch (error) {
      console.error('❌ Error scanning screenshots:', error.message);
      return [];
    }
  }

  categorizeScreenshot(filename, folderName) {
    const categories = [];

    for (const [category, pattern] of Object.entries(this.screenshotPatterns)) {
      if (pattern.test(filename) || pattern.test(folderName)) {
        categories.push(category);
      }
    }

    return categories.length > 0 ? categories : ['general'];
  }

  generateBusinessInsights(screenshots) {
    console.log('🧠 Generating business insights from screenshots...');

    const insights = {
      totalScreenshots: screenshots.length,
      categories: {},
      timeRange: {
        oldest: null,
        newest: null
      },
      businessActivities: [],
      recommendations: []
    };

    screenshots.forEach(screenshot => {
      const categories = this.categorizeScreenshot(screenshot.path, screenshot.folder);
      
      categories.forEach(category => {
        insights.categories[category] = (insights.categories[category] || 0) + 1;
      });

      if (!insights.timeRange.oldest || screenshot.timestamp < insights.timeRange.oldest) {
        insights.timeRange.oldest = screenshot.timestamp;
      }
      if (!insights.timeRange.newest || screenshot.timestamp > insights.timeRange.newest) {
        insights.timeRange.newest = screenshot.timestamp;
      }

      // Generate business activity insights
      if (categories.includes('googleBusiness')) {
        insights.businessActivities.push({
          type: 'Google Business Profile Management',
          timestamp: screenshot.timestamp,
          screenshot: screenshot.path
        });
      }

      if (categories.includes('reviews')) {
        insights.businessActivities.push({
          type: 'Customer Review Monitoring',
          timestamp: screenshot.timestamp,
          screenshot: screenshot.path
        });
      }

      if (categories.includes('analytics')) {
        insights.businessActivities.push({
          type: 'Analytics Review',
          timestamp: screenshot.timestamp,
          screenshot: screenshot.path
        });
      }
    });

    // Generate recommendations
    if (insights.categories.googleBusiness > 5) {
      insights.recommendations.push('High Google Business activity detected - consider automating profile management');
    }

    if (insights.categories.reviews > 3) {
      insights.recommendations.push('Frequent review monitoring - implement automated review response system');
    }

    if (insights.categories.customerInquiry > 2) {
      insights.recommendations.push('Multiple customer inquiries - optimize contact form and response times');
    }

    return insights;
  }

  async createProcessingReport(screenshots) {
    const insights = this.generateBusinessInsights(screenshots);
    
    let report = '# CleanShot Screenshot Analysis Report\n\n';
    report += `**Generated**: ${new Date().toLocaleString()}\n`;
    report += `**Analysis Period**: ${new Date(insights.timeRange.oldest).toLocaleDateString()} - ${new Date(insights.timeRange.newest).toLocaleDateString()}\n\n`;

    report += '## 📊 Screenshot Categories\n\n';
    Object.entries(insights.categories).forEach(([category, count]) => {
      report += `- **${category.charAt(0).toUpperCase() + category.slice(1)}**: ${count} screenshots\n`;
    });

    report += '\n## 🎯 Business Activities Detected\n\n';
    insights.businessActivities.forEach((activity, index) => {
      report += `${index + 1}. **${activity.type}** - ${new Date(activity.timestamp).toLocaleString()}\n`;
    });

    report += '\n## 💡 Automation Recommendations\n\n';
    insights.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });

    if (insights.recommendations.length === 0) {
      report += 'No specific automation opportunities detected from current screenshot patterns.\n';
    }

    report += '\n## 📱 CleanShot Integration Status\n\n';
    report += `- **Monitoring**: Active\n`;
    report += `- **Screenshots Processed**: ${insights.totalScreenshots}\n`;
    report += `- **Auto-categorization**: Enabled\n`;
    report += `- **Business Insights**: Generated\n`;

    return report;
  }

  async run() {
    console.log('🚀 Starting CleanShot monitoring for Somerset Window Cleaning...\n');

    try {
      const newScreenshots = await this.scanForNewScreenshots();

      if (newScreenshots.length === 0) {
        console.log('✅ No new screenshots to process');
        return;
      }

      console.log(`📸 Processing ${newScreenshots.length} new screenshots...`);

      const report = await this.createProcessingReport(newScreenshots);
      
      // Save report
      const timestamp = new Date().toISOString().split('T')[0];
      const reportPath = `cleanshot-analysis-${timestamp}.md`;
      fs.writeFileSync(reportPath, report);

      // Update last processed timestamp
      const latestTimestamp = Math.max(...newScreenshots.map(s => s.timestamp));
      this.saveLastProcessed(latestTimestamp);

      console.log(`✅ CleanShot analysis complete!`);
      console.log(`📊 Report saved: ${reportPath}`);
      console.log(`📸 Screenshots processed: ${newScreenshots.length}`);

      // Show quick insights
      const insights = this.generateBusinessInsights(newScreenshots);
      if (insights.businessActivities.length > 0) {
        console.log('\n🎯 Recent Business Activities:');
        insights.businessActivities.slice(0, 3).forEach(activity => {
          console.log(`   • ${activity.type}`);
        });
      }

      if (insights.recommendations.length > 0) {
        console.log('\n💡 Top Recommendations:');
        insights.recommendations.slice(0, 2).forEach(rec => {
          console.log(`   • ${rec}`);
        });
      }

    } catch (error) {
      console.error('❌ CleanShot monitoring failed:', error.message);
    }
  }
}

// Set up automatic monitoring
if (require.main === module) {
  const monitor = new CleanShotMonitor();
  monitor.run().catch(console.error);
}

module.exports = CleanShotMonitor;