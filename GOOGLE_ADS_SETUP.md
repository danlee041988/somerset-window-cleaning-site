# Google Ads API Integration Setup Guide

## Setup Status: ✅ **Automation scripts ready (manual run required)**

Google Ads API access is configured and the automation scripts now live in the repo. Run the new tasks manually (or add a cron) to enforce the campaign plan, sync negatives and extensions, apply budgets, and write daily snapshots. Update `GOOGLE_ADS_AUTOMATION_DRY_RUN` if you need to revert to test mode.

**Authentication Checklist**
- [x] OAuth 2.0 client JSON saved to `config/google-ads/web-client.json`
- [x] Refresh token generated with `node scripts/google-ads-auth.cjs`
- [x] Google Ads developer token + customer IDs added to environment variables
- [x] Connection test passes (`node scripts/test-google-ads-api.cjs`)
- [ ] Tag Assistant preview + GA4 verification (booking, contact, phone conversions)

## Overview
Complete setup guide for integrating Google Ads API with Somerset Window Cleaning website, including automated optimization, performance monitoring, and GA4-driven analytics.

## Features Included
- ✅ **Campaign Management**: View and manage all Google Ads campaigns
- ✅ **Keyword Optimization**: Automated bid adjustments based on performance
- ✅ **Performance Monitoring**: Real-time dashboard with key metrics
- ✅ **GA4 Integration**: Use analytics data for ad optimization
- ✅ **Automated Reporting**: Weekly performance reports
- ✅ **Seasonal Optimization**: Automatic adjustments for cleaning seasons

## Prerequisites

### 1. Google Ads Account Setup
1. **Google Ads Account**: Must have an active Google Ads account
2. **API Access**: Request Google Ads API access (usually approved within 24-48 hours)
3. **Developer Token**: Obtain from Google Ads Account → Tools & Settings → API Center

### 2. Google Cloud Project
1. Create a Google Cloud Project
2. Enable the Google Ads API
3. Create OAuth 2.0 credentials (Web application type)

## Step-by-Step Setup

### Step 1: Google Ads API Credentials

1. **Get Developer Token**:
   - Go to Google Ads → Tools & Settings → Setup → API Center
   - Apply for basic access or standard access
   - Note down your developer token

2. **Create OAuth Credentials**:
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Set authorized redirect URIs to include your domain
   - Download the credentials JSON

3. **Get Customer ID**:
   - In Google Ads, go to Settings → Account Settings
   - Copy your Customer ID (format: 123-456-7890)
   - _Somerset Window Cleaning_: use **429-956-3613** as the primary customer ID (the MCC **447-417-5960** stays blank in `.env.local` unless you switch to manager-auth calls)

### Step 2: Environment Variables

Add these variables to your `.env.local` file (replace the placeholders with your live values):

```bash
# Google Ads API Configuration
GOOGLE_ADS_CUSTOMER_ID=1234567890
GOOGLE_ADS_DEVELOPER_TOKEN=your_developer_token_here
GOOGLE_ADS_CLIENT_ID=your_client_id.googleusercontent.com
GOOGLE_ADS_CLIENT_SECRET=your_client_secret
GOOGLE_ADS_REFRESH_TOKEN=your_refresh_token
GOOGLE_ADS_LOGIN_CUSTOMER_ID=your_manager_account_id # optional, only for MCC setups

# Optional: Test Account (for development)
GOOGLE_ADS_TEST_CUSTOMER_ID=1234567890

# Automation tuning
GOOGLE_ADS_AUTOMATION_TARGET_CPA=80
GOOGLE_ADS_AUTOMATION_ADJUSTMENT_RATIO=0.1
GOOGLE_ADS_AUTOMATION_DRY_RUN=true
```

### Step 3: Generate Refresh Token

Run the authentication script to generate (or rotate) your refresh token. The script now checks both the new config path and the legacy fallback:

```bash
node scripts/google-ads-auth.cjs
```

Test your connection:
```bash
node scripts/test-google-ads-api.cjs
```

### Step 4: Verify Installation

Test your Google Ads API connection:

```bash
# Test basic connectivity
curl "http://localhost:3000/api/google-ads?action=campaigns"

# Test optimization features
curl "http://localhost:3000/api/google-ads?action=recommendations"

```

### Step 5: Configure Automation (Optional)

Set up automated optimizations with cron jobs (leave `GOOGLE_ADS_AUTOMATION_DRY_RUN=true` until you are happy with the adjustments):

```bash
# Edit crontab
crontab -e

# Add these lines for automation:
# Daily sync at 7 AM (plan → negatives → automation → snapshot)
0 7 * * 1-6 /usr/bin/node /path/to/your/project/scripts/google-ads-daily-sync.ts

# Weekly automation summary on Mondays at 8 AM
0 8 * * 1 /usr/bin/node /path/to/your/project/scripts/google-ads-automation.ts weekly
```

## API Endpoints

### Campaign Management
```bash
# Get all campaigns
GET /api/google-ads?action=campaigns

# Get keywords for specific campaign
GET /api/google-ads?action=keywords&campaignId=12345

# Get performance report
GET /api/google-ads?action=performance&dateRange=LAST_30_DAYS

# Update campaign budget
POST /api/google-ads?action=update-budget
{
  "campaignId": "12345",
  "budgetMicros": 50000000
}
```

### Optimization Features
```bash
# Get optimization recommendations
GET /api/google-ads?action=recommendations

# Run automated optimization
GET /api/google-ads?action=auto-optimize

# Generate weekly report
GET /api/google-ads?action=weekly-report
```

## Dashboard Access

Access the Google Ads dashboard at:
```
https://yourdomain.com/admin/google-ads
```

Dashboard features:
- **Campaign Overview**: Performance metrics and status
- **Keyword Analysis**: Top performing keywords and opportunities
- **Optimization Recommendations**: AI-powered suggestions
- **Automated Actions**: One-click optimization execution

## Somerset Window Cleaning Specific Optimizations

### Seasonal Adjustments
The system automatically detects and optimizes for:

- **Spring Cleaning Season** (March-May):
  - Increases bids for "spring cleaning" keywords by 25%
  - Focuses on residential window cleaning services
  
- **Autumn Maintenance** (September-November):
  - Increases bids for "gutter clearing" keywords by 30%
  - Promotes preventative maintenance services

### Service-Based Optimization
Focus on high-value services within Google Ads and GA4 reports:

- **Window Cleaning**: Most popular service, gets priority bidding
- **Gutter Clearing**: Seasonal demand, automated bid adjustments
- **Conservatory Cleaning**: Specialist service, targeted ad copy
- **Solar Panel Cleaning**: High-value service, premium targeting

### Location Targeting
Optimizes based on your service areas:
- Wells (BA5) area gets priority
- Somerset region targeting
- Excludes areas outside service radius

## Troubleshooting

### Common Issues

1. **"Invalid customer ID" error**:
   - Ensure customer ID is in format `1234567890` (no dashes)
   - Verify you have access to the account

2. **"Developer token not approved" error**:
   - Apply for API access in Google Ads
   - Wait for approval (24-48 hours)

3. **"Authentication failed" error**:
   - Regenerate refresh token
   - Check OAuth credentials are correct

4. **"No campaigns found" error**:
   - Ensure account has active campaigns
   - Check if using test account vs production

### Debug Mode

Enable debug logging by adding to `.env.local`:
```bash
GOOGLE_ADS_DEBUG=true
```

This will log all API requests and responses to help diagnose issues.

### Support Resources

- **Google Ads API Documentation**: https://developers.google.com/google-ads/api/docs
- **API Status Page**: https://status.developers.google.com/
- **Community Support**: https://groups.google.com/forum/#!forum/adwords-api

## Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for all credentials
- Rotate refresh tokens periodically
- Restrict OAuth client to specific domains

### Access Control
- The admin dashboard should be password protected
- Consider implementing user authentication
- Limit API access to trusted IP addresses

### Data Privacy
- Customer data integration respects GDPR compliance
- No personal customer information is sent to Google Ads
- Only aggregated performance data is used for optimization

## Performance Optimization

### Automation Schedule
- **Daily**: Keyword bid optimization (9 AM)
- **Weekly**: Performance reports (Monday 8 AM)
- **Monthly**: Campaign structure review
- **Seasonal**: Automatic seasonal adjustments

### Budget Management
- Set maximum daily budgets to prevent overspend
- Configure automated bid adjustments based on performance
- Monitor cost-per-acquisition targets

### Quality Score Optimization
- Automatically pause low quality score keywords (< 5)
- Increase bids for high quality score keywords (> 7)
- Generate ad copy suggestions based on top performers

## Integration Benefits

### GA4 Analytics Integration
- Use website conversion data for bid optimization
- Optimize landing page targeting
- Improve ad relevance based on user behavior

### Combined Intelligence
- Cross-reference GA4 conversion data with ad performance
- Identify high-converting landing pages
- Optimize entire funnel from ad click to customer conversion

## Cost Management

### Expected Costs
- **Google Ads API**: Free (with limits)
- **Automation Benefits**: 15-25% reduction in wasted spend
- **Time Savings**: ~10 hours/week manual optimization

### ROI Tracking
The system tracks:
- Cost per lead improvement
- Conversion rate optimization
- Customer lifetime value correlation
- Seasonal performance variations

## Maintenance

### Monthly Tasks
- Review optimization recommendations
- Update seasonal keyword lists
- Check integration health status
- Review and adjust automation rules

### Quarterly Tasks
- Audit campaign structure
- Review competitor analysis
- Update conversion tracking
- Optimize landing page alignment

This integration provides Somerset Window Cleaning with enterprise-level Google Ads management capabilities, ensuring optimal ad spend and maximum lead generation efficiency.
