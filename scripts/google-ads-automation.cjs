#!/usr/bin/env node

/**
 * Google Ads Automation Script for Somerset Window Cleaning
 * 
 * Runs automated optimizations and generates reports
 * Can be run via cron job for regular optimization
 */

const fs = require('fs').promises
const path = require('path')

// Environment configuration
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const GOOGLE_ADS_CONFIG = {
  customerId: process.env.GOOGLE_ADS_CUSTOMER_ID,
  developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  clientId: process.env.GOOGLE_ADS_CLIENT_ID,
  clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET,
  refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN
}

// Check if all required environment variables are set
function validateConfig() {
  const missing = Object.entries(GOOGLE_ADS_CONFIG)
    .filter(([key, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:')
    missing.forEach(key => console.error(`   - ${key}`))
    console.error('\nPlease check your .env.local file and ensure all Google Ads API credentials are configured.')
    process.exit(1)
  }

  console.log('✅ Google Ads configuration validated')
}

// Automated optimization functions
async function runDailyOptimization() {
  console.log('🚀 Starting daily Google Ads optimization...')
  
  try {
    // Make API call to our optimization endpoint
    const response = await fetch('http://localhost:3000/api/google-ads?action=auto-optimize')
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log(`✅ Generated ${data.optimizations?.length || 0} optimization recommendations`)
    
    if (data.optimizations && data.optimizations.length > 0) {
      // Log optimizations to file for review
      const timestamp = new Date().toISOString()
      const logEntry = {
        timestamp,
        optimizations: data.optimizations,
        summary: {
          total: data.optimizations.length,
          bidIncreases: data.optimizations.filter(o => o.type === 'INCREASE_BID').length,
          keywordPauses: data.optimizations.filter(o => o.type === 'PAUSE_KEYWORD').length
        }
      }

      const logPath = path.join(__dirname, '..', 'logs', 'google-ads-optimizations.json')
      await fs.mkdir(path.dirname(logPath), { recursive: true })
      
      let existingLogs = []
      try {
        const existingData = await fs.readFile(logPath, 'utf8')
        existingLogs = JSON.parse(existingData)
      } catch (err) {
        // File doesn't exist yet, that's fine
      }

      existingLogs.push(logEntry)
      
      // Keep only last 30 days of logs
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      existingLogs = existingLogs.filter(log => new Date(log.timestamp) > thirtyDaysAgo)
      
      await fs.writeFile(logPath, JSON.stringify(existingLogs, null, 2))
      console.log(`📝 Logged optimizations to ${logPath}`)
    }

    return data
  } catch (error) {
    console.error('❌ Daily optimization failed:', error.message)
    throw error
  }
}

async function generateWeeklyReport() {
  console.log('📊 Generating weekly Google Ads report...')
  
  try {
    const response = await fetch('http://localhost:3000/api/google-ads?action=weekly-report')
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const report = data.report

    // Generate HTML report
    const htmlReport = generateHTMLReport(report)
    
    const timestamp = new Date().toISOString().split('T')[0]
    const reportPath = path.join(__dirname, '..', 'reports', `google-ads-weekly-${timestamp}.html`)
    await fs.mkdir(path.dirname(reportPath), { recursive: true })
    await fs.writeFile(reportPath, htmlReport)
    
    console.log(`✅ Weekly report generated: ${reportPath}`)
    console.log(`📈 Summary:`)
    console.log(`   Total Spend: ${report.summary.totalSpend}`)
    console.log(`   Conversions: ${report.summary.totalConversions}`)
    console.log(`   Avg Cost/Conversion: ${report.summary.avgCostPerConversion}`)
    console.log(`   High Priority Recommendations: ${report.recommendations.length}`)

    return report
  } catch (error) {
    console.error('❌ Weekly report generation failed:', error.message)
    throw error
  }
}

function generateHTMLReport(report) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Somerset Window Cleaning - Google Ads Weekly Report</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px; 
            background-color: #1a1a1a; 
            color: #ffffff;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            padding: 20px; 
            background: linear-gradient(135deg, #E11D2A, #B91420);
            border-radius: 10px;
        }
        .summary { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .card { 
            background: rgba(255,255,255,0.1); 
            padding: 20px; 
            border-radius: 10px; 
            border: 1px solid rgba(255,255,255,0.1);
        }
        .card h3 { 
            margin: 0 0 10px 0; 
            color: #E11D2A; 
        }
        .metric { 
            font-size: 24px; 
            font-weight: bold; 
            margin: 5px 0; 
        }
        .campaigns, .recommendations { 
            margin-bottom: 30px; 
        }
        .campaign-item, .rec-item { 
            background: rgba(255,255,255,0.05); 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 8px; 
            border-left: 4px solid #E11D2A;
        }
        .status-enabled { color: #4CAF50; }
        .status-paused { color: #FF9800; }
        .priority-high { color: #F44336; }
        .priority-medium { color: #FF9800; }
        .priority-low { color: #4CAF50; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
        th { background: rgba(255,255,255,0.1); color: #E11D2A; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Somerset Window Cleaning</h1>
        <h2>Google Ads Weekly Performance Report</h2>
        <p>Generated: ${new Date().toLocaleDateString('en-GB', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
    </div>

    <div class="summary">
        <div class="card">
            <h3>Total Spend</h3>
            <div class="metric">${report.summary.totalSpend}</div>
        </div>
        <div class="card">
            <h3>Conversions</h3>
            <div class="metric">${report.summary.totalConversions}</div>
        </div>
        <div class="card">
            <h3>Cost per Conversion</h3>
            <div class="metric">${report.summary.avgCostPerConversion}</div>
        </div>
        <div class="card">
            <h3>Active Campaigns</h3>
            <div class="metric">${report.summary.activeCampaigns}</div>
        </div>
    </div>

    <div class="campaigns">
        <h2>Top Performing Campaigns</h2>
        ${report.topPerformingCampaigns.map(campaign => `
            <div class="campaign-item">
                <h3>${campaign.name} <span class="status-${campaign.status.toLowerCase()}">(${campaign.status})</span></h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-top: 10px;">
                    <div><strong>Spend:</strong> £${campaign.cost.toFixed(2)}</div>
                    <div><strong>Conversions:</strong> ${campaign.conversions}</div>
                    <div><strong>CTR:</strong> ${(campaign.ctr * 100).toFixed(2)}%</div>
                    <div><strong>CPC:</strong> £${campaign.cpc.toFixed(2)}</div>
                </div>
            </div>
        `).join('')}
    </div>

    <div class="recommendations">
        <h2>High Priority Recommendations</h2>
        ${report.recommendations.map(rec => `
            <div class="rec-item">
                <h3 class="priority-${rec.priority.toLowerCase()}">${rec.type.replace('_', ' ')} - ${rec.priority} Priority</h3>
                <p><strong>Issue:</strong> ${rec.description}</p>
                <p><strong>Expected Impact:</strong> ${rec.expectedImpact}</p>
                <p><strong>Action Required:</strong> ${rec.actionRequired}</p>
            </div>
        `).join('')}
    </div>

    <div class="keywords">
        <h2>Top Performing Keywords</h2>
        <table>
            <thead>
                <tr>
                    <th>Keyword</th>
                    <th>Conversions</th>
                    <th>CPC</th>
                    <th>Clicks</th>
                    <th>Impressions</th>
                </tr>
            </thead>
            <tbody>
                ${report.keywordOpportunities.map(keyword => `
                    <tr>
                        <td>${keyword.text}</td>
                        <td>${keyword.conversions}</td>
                        <td>£${keyword.cpc.toFixed(2)}</td>
                        <td>${keyword.clicks}</td>
                        <td>${keyword.impressions.toLocaleString()}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>
  `.trim()
}

async function integrateWithNotionData() {
  console.log('🔗 Integrating Google Ads optimization with Notion customer data...')
  
  try {
    // Fetch customer data from Notion (this would use your existing Notion API)
    const notionResponse = await fetch('http://localhost:3000/api/notion-customers')
    
    if (!notionResponse.ok) {
      console.log('⚠️  Notion data not available, skipping integration')
      return
    }

    const notionData = await notionResponse.json()
    const customerData = notionData.customers || []

    if (customerData.length === 0) {
      console.log('ℹ️  No customer data available for optimization')
      return
    }

    // Send customer data to Google Ads for optimization
    const optimizeResponse = await fetch('http://localhost:3000/api/google-ads?action=optimize-with-notion-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerData })
    })

    if (!optimizeResponse.ok) {
      throw new Error('Failed to optimize with Notion data')
    }

    const optimizationData = await optimizeResponse.json()
    
    console.log(`✅ Generated ${optimizationData.recommendations.length} Notion-based recommendations`)
    optimizationData.recommendations.forEach((rec, i) => {
      console.log(`   ${i + 1}. ${rec.description}`)
    })

    return optimizationData
  } catch (error) {
    console.error('❌ Notion integration failed:', error.message)
  }
}

// Main execution function
async function main() {
  const command = process.argv[2]
  
  console.log('🏠 Somerset Window Cleaning - Google Ads Automation')
  console.log('=' .repeat(50))
  
  validateConfig()

  try {
    switch (command) {
      case 'daily':
        await runDailyOptimization()
        await integrateWithNotionData()
        break
        
      case 'weekly':
        await generateWeeklyReport()
        break
        
      case 'optimize':
        await runDailyOptimization()
        break
        
      case 'report':
        await generateWeeklyReport()
        break
        
      case 'notion':
        await integrateWithNotionData()
        break
        
      default:
        console.log('Usage: node google-ads-automation.cjs <command>')
        console.log('Commands:')
        console.log('  daily    - Run daily optimization (includes Notion integration)')
        console.log('  weekly   - Generate weekly report')
        console.log('  optimize - Run optimization only')
        console.log('  report   - Generate report only')
        console.log('  notion   - Run Notion integration only')
        console.log('')
        console.log('Example cron jobs:')
        console.log('  # Daily optimization at 9 AM')
        console.log('  0 9 * * * /usr/bin/node /path/to/google-ads-automation.cjs daily')
        console.log('  # Weekly report on Mondays at 8 AM')
        console.log('  0 8 * * 1 /usr/bin/node /path/to/google-ads-automation.cjs weekly')
        process.exit(1)
    }
    
    console.log('✅ Automation completed successfully')
  } catch (error) {
    console.error('❌ Automation failed:', error.message)
    process.exit(1)
  }
}

// Run the script
if (require.main === module) {
  main()
}