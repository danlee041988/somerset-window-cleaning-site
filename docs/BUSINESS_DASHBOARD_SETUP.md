# Business Health Dashboard Setup Guide

## Overview

The Business Health Dashboard provides **real-time financial insights** for Somerset Window Cleaning by integrating with your live Monzo Business Transactions Google Sheet. It automatically calculates key business metrics, tracks expenses, monitors receipt collection, and provides actionable insights into business health.

## Features

### 📊 Real-Time Metrics
- **Net Cash Flow**: Total income minus expenses
- **Total Income/Expenses**: Comprehensive financial tracking
- **Profit Margin**: Percentage-based profitability indicator
- **Daily Burn Rate**: Average daily expense calculation

### 📅 Period Comparisons
- Current month vs last month income/expenses
- Trend analysis and growth tracking
- Month-over-month performance insights

### 💰 Expense Analysis
- Top 10 vendors by spending
- Expenses broken down by category
- Transaction count and patterns
- Vendor relationship insights

### 🧾 Receipt Tracking
- Automatic detection of missing receipts
- Priority-based receipt collection alerts
- Compliance coverage percentage
- Smart exclusion of non-receipt items (wages, taxes, loans)

### 🎯 Business Health Indicators
- Overall health status (Excellent/Good/Fair/Concerning)
- Cash runway calculations
- Profitability trends
- Financial warning system

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Monzo Business Account → Google Sheets (Live Feed)         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  lib/monzo-integration.ts                                    │
│  - Fetches live transaction data via Google Sheets API      │
│  - Parses and validates Monzo CSV format                     │
│  - Calculates business metrics and KPIs                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  app/api/business-health/route.ts                           │
│  - REST API endpoint for dashboard data                      │
│  - Supports filtering by date, category, type               │
│  - Returns comprehensive metrics JSON                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  components/BusinessHealthDashboard.tsx                      │
│  - Interactive React dashboard UI                           │
│  - Auto-refresh every 5 minutes                             │
│  - Real-time metric visualization                           │
└─────────────────────────────────────────────────────────────┘
```

## Setup Instructions

### 1. Create Google Cloud Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing: **"Somerset Window Cleaning"**
3. Enable **Google Sheets API**:
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create Service Account:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: `swc-business-dashboard`
   - Role: None needed (we'll grant sheet-specific access)
   - Click "Done"

5. Generate Key:
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create New Key"
   - Choose "JSON" format
   - Download the key file (keep it secure!)

### 2. Share Google Sheet with Service Account

1. Open your **Monzo Business Transactions** Google Sheet
2. Click "Share" button
3. Add the service account email (from the JSON key file):
   - Email format: `swc-business-dashboard@your-project.iam.gserviceaccount.com`
4. Set permission to **Viewer** (read-only access)
5. Click "Send"

### 3. Configure Environment Variables

Add to `.env.local`:

```bash
# Google Sheets API for Business Dashboard
GOOGLE_SHEETS_CLIENT_EMAIL="swc-business-dashboard@your-project.iam.gserviceaccount.com"
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- The private key must include `\n` characters for line breaks
- Keep the quotes around the private key
- Never commit these credentials to version control

### 4. Verify Sheet Structure

Ensure your Monzo Business Transactions sheet has these columns (A-N):

| Column | Field Name | Description |
|--------|------------|-------------|
| A | Transaction ID | Unique Monzo transaction ID |
| B | Date | Format: DD/MM/YYYY |
| C | Time | Format: HH:MM:SS |
| D | Type | Transaction type (Card payment, Direct Debit, etc.) |
| E | Name | Merchant/vendor name |
| F | Category | Expense category |
| G | Amount | Transaction amount |
| H | Notes and #tags | Additional notes |
| I | Address | Merchant address |
| J | Receipt | Receipt URL (if attached) |
| K | Description | Transaction description |
| L | Category split | Split category if applicable |
| M | Money Out | Expense amount (negative) |
| N | Money In | Income amount (positive) |

### 5. Deploy to Vercel

Add environment variables to Vercel:

```bash
vercel env add GOOGLE_SHEETS_CLIENT_EMAIL
vercel env add GOOGLE_SHEETS_PRIVATE_KEY
```

Or via Vercel Dashboard:
1. Go to your project → Settings → Environment Variables
2. Add both variables for Production, Preview, and Development
3. Redeploy your application

## Usage

### Access the Dashboard

**Local Development:**
```bash
npm run dev
# Navigate to: http://localhost:3000/business-dashboard
```

**Production:**
```
https://www.somersetwindowcleaning.co.uk/business-dashboard
```

### API Endpoints

#### Get Business Metrics
```bash
GET /api/business-health

Response:
{
  "success": true,
  "data": {
    "totalIncome": 50000.00,
    "totalExpenses": 35000.00,
    "netCashFlow": 15000.00,
    "profitMargin": 30.0,
    "burnRate": 1166.67,
    ...
  },
  "lastUpdated": "2025-09-30T12:00:00.000Z"
}
```

#### Get Filtered Transactions
```bash
POST /api/business-health
Content-Type: application/json

{
  "startDate": "2025-08-01",
  "endDate": "2025-08-31",
  "category": "Equipment",
  "type": "Card payment"
}

Response:
{
  "success": true,
  "data": [...transactions],
  "count": 45,
  "lastUpdated": "2025-09-30T12:00:00.000Z"
}
```

## Dashboard Features Explained

### Health Status Algorithm

The dashboard automatically assigns a health status based on:

- **Excellent** ✅: Positive cash flow + profit margin > 20%
- **Good** 🟢: Positive cash flow + profit margin > 10%
- **Fair** 🟡: Positive cash flow but low margin
- **Concerning** 🔴: Negative cash flow

### Receipt Priority System

Missing receipts are prioritized:

- **HIGH** 🔴: Transactions > £100
- **MEDIUM** 🟡: Transactions £50-£100
- **LOW** 🟢: Transactions < £50

### Auto-Excluded Expense Categories

These expense types **do not** require receipts:
- Pension contributions
- Van finance payments
- Bounce back loan payments
- Liability insurance
- DVLA fees
- Wages and payroll
- Bank transfers between accounts
- Tax payments

## Customization Options

### Change Refresh Interval

Edit `app/(internal)/business-dashboard/page.tsx`:

```typescript
<BusinessHealthDashboard refreshInterval={180000} /> // 3 minutes
```

### Modify Excluded Categories

Edit `lib/monzo-integration.ts`:

```typescript
const excludedCategories = [
  'Pension',
  'Van Finance',
  'Your Custom Category',
  // Add more as needed
];
```

### Update Sheet ID

If you move to a different Google Sheet, update:

```typescript
// lib/monzo-integration.ts
const SHEET_ID = 'YOUR_NEW_SHEET_ID';
```

## Troubleshooting

### Error: "Failed to fetch transaction data"

**Possible causes:**
1. Service account doesn't have access to the sheet
2. Sheet ID is incorrect
3. Environment variables not set correctly
4. Google Sheets API not enabled

**Solution:**
```bash
# Verify environment variables are set
echo $GOOGLE_SHEETS_CLIENT_EMAIL
echo $GOOGLE_SHEETS_PRIVATE_KEY

# Check Next.js can read them
npm run dev
# Check browser console for detailed error messages
```

### Dashboard shows zero values

**Possible causes:**
1. Sheet is empty
2. Sheet structure doesn't match expected format
3. Date parsing issues

**Solution:**
- Verify sheet has data
- Check column order matches documentation
- Ensure dates are in DD/MM/YYYY format

### "Permission denied" errors

**Solution:**
1. Open Google Sheet
2. Click "Share"
3. Ensure service account email is listed with Viewer access
4. Wait 5-10 minutes for permissions to propagate

## Security Best Practices

1. **Never commit credentials** to version control
2. Use environment variables for all secrets
3. Set dashboard route to `(internal)` group for access control
4. Consider adding authentication middleware
5. Use read-only Google Sheets API permissions
6. Rotate service account keys periodically

## Performance Considerations

- Dashboard auto-refreshes every 5 minutes (configurable)
- API responses are not cached (always live data)
- Google Sheets API has rate limits: 100 requests per 100 seconds
- Consider implementing Redis caching for high-traffic scenarios

## Future Enhancements

Potential improvements to consider:

1. **Chart Visualizations**: Add Chart.js for trend graphs
2. **Export Functionality**: Download reports as PDF/Excel
3. **Email Alerts**: Automated alerts for missing receipts
4. **Budget Tracking**: Set and monitor category budgets
5. **Forecasting**: Predict future cash flow based on trends
6. **Mobile App**: Native mobile dashboard application
7. **Integration with Accounting Software**: Xero/QuickBooks sync
8. **AI Insights**: LLM-powered financial advice

## Support

For issues or questions:
- Check [Next.js Documentation](https://nextjs.org/docs)
- Review [Google Sheets API Docs](https://developers.google.com/sheets/api)
- Contact: info@somersetwindowcleaning.co.uk

## Version History

- **v1.0.0** (2025-09-30): Initial release
  - Real-time Monzo transaction integration
  - Comprehensive business metrics
  - Receipt tracking system
  - Interactive dashboard UI