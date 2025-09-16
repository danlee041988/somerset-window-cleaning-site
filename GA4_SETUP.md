# Google Analytics 4 Setup Guide for Somerset Window Cleaning

## Quick Setup (5 minutes)

### 1. Create GA4 Property
1. Go to https://analytics.google.com
2. Click "Admin" (gear icon bottom left)
3. Click "Create Property"
4. Enter property name: **Somerset Window Cleaning**
5. Select country: **United Kingdom**
6. Select currency: **Pound Sterling (£)**
7. Choose business objectives: **Get baseline reports**

### 2. Set Up Data Stream
1. Click "Data Streams" in the property column
2. Click "Add stream" → "Web"
3. Enter website URL: `https://somersetwindowcleaning.co.uk`
4. Enter stream name: **Somerset Window Cleaning Website**
5. Click "Create stream"
6. **Copy the Measurement ID** (looks like `G-XXXXXXXXXX`)

### 3. Update Environment Variables

#### Local Development (.env.local)
```bash
# Replace G-PLACEHOLDER with your actual Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GA_TRACKING_ENABLED=true
```

#### Vercel Production
```bash
# Add to Vercel environment variables
npx vercel env add NEXT_PUBLIC_GA_MEASUREMENT_ID production
# Enter your Measurement ID when prompted

npx vercel env add NEXT_PUBLIC_GA_TRACKING_ENABLED production
# Enter: true
```

### 4. Deploy Changes
```bash
npm run build
npx vercel --prod
```

## What You'll Get

### Form Analytics
- **Form Started**: Users who begin filling the contact form
- **Form Completed**: Successful form submissions
- **reCAPTCHA Completion**: Users who complete reCAPTCHA verification
- **Form Errors**: Submission failures and validation issues

### Service Analytics
- **Most Requested Services**: Which services generate most inquiries
- **Property Size Distribution**: Breakdown by property size
- **Customer Type**: New vs existing customer ratio
- **Conversion Rates**: Form views vs completions

### User Behavior
- **Page Views**: Most visited service pages
- **Geographic Data**: Where inquiries come from
- **Peak Times**: When customers are most active
- **Device Usage**: Mobile vs desktop usage

## Advanced Configuration

### Custom Events Tracked
```typescript
// Form interactions
form_start         // User begins filling form
form_submit        // Successful submission
form_error         // Submission failures
recaptcha_complete // reCAPTCHA verification

// Service pages
service_page_view  // Individual service page visits
area_page_view     // Location-specific page visits
quote_request      // Phone/email clicks
```

### Conversion Goals
Set up these goals in GA4:
1. **Contact Form Submission** (form_submit event)
2. **Quote Request** (quote_request event)
3. **reCAPTCHA Completion** (recaptcha_complete event)

### Data Retention
- Standard: 14 months
- Can be extended to 26 months in GA4 settings

## Verification

After setup, verify tracking by:
1. Visit your website
2. Fill out contact form
3. Check GA4 Realtime reports (within 5 minutes)
4. Look for events: `form_start`, `form_submit`, `page_view`

## Privacy Compliance

The implementation includes:
- **IP Anonymization**: `anonymize_ip: true`
- **No Ad Tracking**: `allow_ad_personalization_signals: false`
- **No Google Signals**: `allow_google_signals: false`
- **GDPR Compliant**: Minimal data collection

## Support

If tracking isn't working:
1. Check browser console for errors
2. Verify Measurement ID is correct
3. Ensure `NEXT_PUBLIC_GA_TRACKING_ENABLED=true`
4. Test in production (not localhost)

## Alternative API Setup

If you prefer automated setup via Google Cloud APIs:
1. Enable APIs: https://console.developers.google.com/apis/api/analyticsadmin.googleapis.com/overview?project=874485656128
2. Run: `node scripts/setup-ga4.cjs`

---

**Next Steps After Setup:**
1. Create custom dashboards for form metrics
2. Set up conversion goals
3. Configure automated reports
4. Monitor performance for 2-4 weeks to establish baselines