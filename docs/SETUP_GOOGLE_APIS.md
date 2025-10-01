# Google APIs Setup Guide
**Somerset Window Cleaning - Complete Implementation**

---

## 🎯 What You're Getting

### 1. Google Business Profile API
- ✅ Auto-post weekly updates with photos
- ✅ Respond to reviews automatically
- ✅ Track local search insights
- ✅ Update business hours programmatically

### 2. Google Places API
- ✅ Address autocomplete on booking form
- ✅ Auto-fill postcode, city, county
- ✅ Validate customer addresses
- ✅ Better UX = higher conversion rates

---

## 📋 Setup Steps (30 Minutes Total)

### **Step 1: Enable APIs (10 minutes)**

```bash
cd /Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE
./scripts/enable-gmb-and-places-apis.sh
```

This script will:
1. Authenticate with Google Cloud
2. Create/select project
3. Enable both APIs
4. Create service account
5. Generate credentials
6. Create API key for Places

---

### **Step 2: Update .env.local (5 minutes)**

Add these to `/Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE/.env.local`:

```bash
# Google Cloud APIs
GOOGLE_CLOUD_PROJECT_ID=somerset-window-cleaning
GOOGLE_CLOUD_CREDENTIALS=/Users/danlee/.config/google-cloud/swc-service-account.json

# Google Places API (for booking form)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIza...your-key-here
```

---

### **Step 3: Link GMB Account (5 minutes)**

1. Go to: https://business.google.com/settings
2. Click **"Users"** → **"Add user"**
3. Add email: `swc-automation@somerset-window-cleaning.iam.gserviceaccount.com`
4. Grant **"Manager"** permissions
5. Click **"Invite"**

---

### **Step 4: Install Dependencies (2 minutes)**

```bash
npm install googleapis @googlemaps/js-api-loader
```

---

### **Step 5: Update Booking Form (5 minutes)**

Replace the address input in `components/BookingForm.tsx`:

**Before:**
```tsx
<SimpleAddressInput
  value={customer.address}
  onChange={(val) => setCustomerField('address', val)}
/>
```

**After:**
```tsx
<GooglePlacesAutocomplete
  value={customer.address}
  onChange={(val) => setCustomerField('address', val)}
  onPlaceSelected={(place) => {
    setCustomerField('address', place.address)
    setCustomerField('postcode', place.postcode)
  }}
  placeholder="Start typing your address..."
  error={!!errors.address}
/>
```

Don't forget to import:
```tsx
import GooglePlacesAutocomplete from '@/components/features/contact/GooglePlacesAutocomplete'
```

---

### **Step 6: Test (3 minutes)**

**Test Places Autocomplete:**
1. `npm run dev`
2. Go to: http://localhost:3000/book-appointment
3. Start typing address in form
4. See autocomplete suggestions appear ✅

**Test GMB Connection:**
```bash
npx tsx scripts/auto-post-gmb.ts --template=serviceHighlight --service="Window Cleaning"
```

Should output: `✅ Post created successfully!`

---

## 🚀 Usage Examples

### **Auto-Post to GMB Weekly**

**Example 1: Before/After Photos**
```bash
npx tsx scripts/auto-post-gmb.ts \
  --template=beforeAfter \
  --location="Glastonbury" \
  --photo="/path/to/after-photo.jpg"
```

**Example 2: Highlight Service**
```bash
npx tsx scripts/auto-post-gmb.ts \
  --template=serviceHighlight \
  --service="Gutter Clearing"
```

**Example 3: Customer Testimonial**
```bash
npx tsx scripts/auto-post-gmb.ts \
  --template=testimonial
```

**Example 4: Seasonal Offer**
```bash
npx tsx scripts/auto-post-gmb.ts \
  --template=seasonalOffer
```

---

### **Automate Weekly Posts**

Set up a cron job or scheduled task:

**macOS/Linux (crontab):**
```bash
# Post to GMB every Monday at 9am
0 9 * * 1 cd /Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE && npx tsx scripts/auto-post-gmb.ts --template=serviceHighlight --service="Window Cleaning"
```

**Or use Vercel Cron (in production):**

Create `app/api/cron/gmb-post/route.ts`:
```typescript
import { postToGMB, postTemplates } from '@/lib/google-business-profile'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Post weekly update
  const services = ['Window Cleaning', 'Gutter Clearing', 'Conservatory Cleaning']
  const randomService = services[Math.floor(Math.random() * services.length)]

  const post = postTemplates.serviceHighlight(
    randomService,
    'keeps your property looking its best year-round'
  )

  await postToGMB(post)

  return new Response('Posted to GMB', { status: 200 })
}
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/gmb-post",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

---

## 📊 Expected Results

### **Google Business Profile:**
- **Week 1:** First automated post goes live
- **Week 2:** Start tracking post impressions
- **Week 4:** See increase in Google Business profile views
- **Month 2:** More "direction requests" and phone calls from GMB
- **Month 3:** Noticeable local SEO improvement

### **Places Autocomplete:**
- **Immediate:** Better UX on booking form
- **Week 1:** Fewer typos in addresses
- **Month 1:** 10-15% reduction in failed form submissions
- **Month 2:** Higher booking conversion rate

---

## 💰 Costs

| API | Free Tier | Your Usage | Monthly Cost |
|-----|-----------|------------|--------------|
| **GMB API** | Unlimited | 4-8 posts/month | **£0** |
| **Places Autocomplete** | 1,000 calls | ~500 calls/month | **£0** |
| **Total** | | | **£0** |

**Both APIs stay within free tier! 🎉**

---

## 🔧 Troubleshooting

### **Issue: "credentials not found"**
**Fix:**
```bash
# Check credentials exist
ls -la ~/.config/google-cloud/swc-service-account.json

# If missing, re-run setup
./scripts/enable-gmb-and-places-apis.sh
```

### **Issue: "Permission denied" when posting to GMB**
**Fix:**
1. Verify service account added to GMB users
2. Check it has "Manager" role (not "Owner")
3. Wait 5-10 minutes for permissions to propagate

### **Issue: Places autocomplete not showing**
**Fix:**
1. Check API key in .env.local
2. Verify API key restrictions allow your domain
3. Check browser console for errors

### **Issue: "API not enabled"**
**Fix:**
```bash
# Re-enable APIs
gcloud services enable mybusinessbusinessinformation.googleapis.com
gcloud services enable places-backend.googleapis.com
```

---

## 📚 Resources

- **Google Cloud Console:** https://console.cloud.google.com
- **GMB API Docs:** https://developers.google.com/my-business
- **Places API Docs:** https://developers.google.com/maps/documentation/places/web-service
- **Business Profile Settings:** https://business.google.com/settings

---

## ✅ Checklist

Before going live:

- [ ] APIs enabled via setup script
- [ ] Credentials added to .env.local
- [ ] Service account added to GMB users
- [ ] Places API key created & restricted
- [ ] Booking form updated with GooglePlacesAutocomplete
- [ ] Test post to GMB successful
- [ ] Test address autocomplete working
- [ ] Weekly automation scheduled (cron or Vercel)

---

## 🎯 Next Steps

**This Week:**
1. Run setup script
2. Test both integrations
3. Deploy booking form update

**Next Week:**
4. Schedule first automated GMB post
5. Monitor booking form conversion rate
6. Track GMB insights

**Month 2:**
7. Set up automated review responses
8. Create before/after photo pipeline
9. Analyze local SEO improvements

---

**Questions? Run: `npx tsx scripts/test-gmb-connection.ts`**
