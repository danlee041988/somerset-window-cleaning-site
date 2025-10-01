# Google Cloud APIs - Setup Guide

## 🎯 Priority APIs to Enable

### 1. Google Business Profile API (Highest Priority)

**Enable:**
```bash
gcloud services enable mybusinessbusinessinformation.googleapis.com
gcloud services enable mybusinessplaceactions.googleapis.com
```

**Setup:**
1. Go to: https://console.cloud.google.com/apis/library
2. Search "Business Profile API"
3. Click "Enable"
4. Create service account with permissions
5. Download credentials JSON

**Use Cases:**
- Auto-post weekly updates with job photos
- Respond to reviews within 1 hour
- Update hours/services automatically
- Track insights (views, clicks, calls)

**Monthly Cost:** FREE
**ROI:** 🔥🔥🔥🔥🔥 Massive local SEO boost

---

### 2. Distance Matrix API (High Priority)

**Enable:**
```bash
gcloud services enable distancematrix.googleapis.com
```

**Setup:**
1. Go to: https://console.cloud.google.com/apis/library
2. Search "Distance Matrix API"
3. Click "Enable"
4. Use existing Google Maps API key

**Use Cases:**
- Calculate travel time/distance for quotes
- Optimize daily job routes
- Group nearby jobs together
- Show ETA to customers

**Monthly Cost:** ~£5-10/month (1,000 free calls/month)
**ROI:** 🔥🔥🔥🔥 2-3 hours saved per week

---

### 3. Cloud Tasks API (High Priority)

**Enable:**
```bash
gcloud services enable cloudtasks.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
```

**Setup:**
1. Go to: https://console.cloud.google.com/apis/library
2. Search "Cloud Tasks API"
3. Click "Enable"
4. Create task queue

**Use Cases:**
- Send quote follow-ups (Day 2, 5, 10)
- Job reminder texts (24 hours before)
- Monthly customer summaries
- Weekly performance reports

**Monthly Cost:** FREE (generous free tier)
**ROI:** 🔥🔥🔥🔥🔥 30% more quote conversions

---

### 4. Cloud Vision API (Medium Priority)

**Enable:**
```bash
gcloud services enable vision.googleapis.com
```

**Setup:**
1. Go to: https://console.cloud.google.com/apis/library
2. Search "Cloud Vision API"
3. Click "Enable"
4. Use service account credentials

**Use Cases:**
- Analyze before/after photos automatically
- Extract text from receipts/invoices
- Verify job completion photos
- Detect window types from customer uploads

**Monthly Cost:** ~£2-5/month (1,000 free calls/month)
**ROI:** 🔥🔥🔥 Great for automation

---

### 5. Sheets API (Medium Priority)

**Enable:**
```bash
gcloud services enable sheets.googleapis.com
```

**Setup:**
1. Already enabled (you use Google Drive)
2. Create service account
3. Share sheets with service account email

**Use Cases:**
- Sync Google Ads data to Sheets
- Customer database in Sheets
- Job scheduling spreadsheet
- Automated weekly reports

**Monthly Cost:** FREE
**ROI:** 🔥🔥🔥🔥 If you use Sheets already

---

## 🚀 Quick Setup Script

Run this to enable all priority APIs:

```bash
#!/bin/bash

# Enable priority Google Cloud APIs
echo "🚀 Enabling Google Cloud APIs..."

gcloud services enable mybusinessbusinessinformation.googleapis.com
gcloud services enable mybusinessplaceactions.googleapis.com
gcloud services enable distancematrix.googleapis.com
gcloud services enable cloudtasks.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable vision.googleapis.com
gcloud services enable sheets.googleapis.com
gcloud services enable language.googleapis.com
gcloud services enable speech.googleapis.com

echo "✅ All APIs enabled!"
echo ""
echo "📋 Next steps:"
echo "1. Create service account: https://console.cloud.google.com/iam-admin/serviceaccounts"
echo "2. Download credentials JSON"
echo "3. Add to .env.local: GOOGLE_CLOUD_CREDENTIALS=/path/to/creds.json"
```

---

## 💰 Cost Estimate

**Monthly costs for small business:**

| API | Free Tier | Typical Usage | Monthly Cost |
|-----|-----------|---------------|--------------|
| Business Profile | Unlimited | N/A | **£0** |
| Distance Matrix | 1,000 calls | 2,000 calls | **£5** |
| Cloud Tasks | 1M operations | 50K operations | **£0** |
| Cloud Vision | 1,000 calls | 500 calls | **£0** |
| Sheets | Unlimited | N/A | **£0** |
| Natural Language | 5,000 units | 1,000 units | **£0** |
| Speech-to-Text | 60 min | 30 min | **£0** |

**Total estimated monthly cost: £5** 🎉

---

## 🎯 Implementation Priority

### Week 1: Enable Core APIs
- ✅ Enable all APIs (30 minutes)
- ✅ Create service account
- ✅ Download credentials

### Week 2: Distance Matrix
- Build quote calculator with distance
- Add travel time to booking flow
- Show ETA on job dashboard

### Week 3: Cloud Tasks
- Set up quote follow-up automation
- Job reminder system
- Monthly summary emails

### Week 4: Google Business Profile
- Auto-post weekly updates
- Review response automation
- Insight tracking dashboard

---

## 📚 Resources

- **Google Cloud Console:** https://console.cloud.google.com
- **API Library:** https://console.cloud.google.com/apis/library
- **Pricing Calculator:** https://cloud.google.com/products/calculator
- **Documentation:** https://cloud.google.com/apis/docs/overview

---

**Questions? Run: `npx tsx scripts/check-google-cloud-setup.ts`**
