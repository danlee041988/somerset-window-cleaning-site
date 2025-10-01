# Quick Start - Google APIs Setup
**5 Simple Steps to Get Running**

---

## ✅ **Good News: APIs Already Enabled!**

Your project `somerset-window-cleaning-api` already has:
- ✅ Google Business Profile API enabled
- ✅ Google Places API enabled
- ✅ Project ready to use

**Now we just need to:**
1. Create API credentials
2. Update .env.local
3. Link to your GMB account

---

## 📋 **Step 1: Create Google Places API Key (2 minutes)**

1. Go to: https://console.cloud.google.com/apis/credentials?project=somerset-window-cleaning-api

2. Click **"Create Credentials"** → **"API Key"**

3. Copy the API key (looks like: `AIzaSy...`)

4. Click **"Restrict Key"**:
   - **Name:** "Places API - Website"
   - **API restrictions:** Select "Places API"
   - **Website restrictions:** Add `somersetwindowcleaning.co.uk` and `localhost`
   - Click **"Save"**

5. **Copy this key** - you'll need it in Step 3

---

## 📋 **Step 2: Create Service Account for GMB (3 minutes)**

1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts?project=somerset-window-cleaning-api

2. Click **"Create Service Account"**

3. Fill in:
   - **Name:** `swc-automation`
   - **Description:** `Automates Google Business Profile posts`
   - Click **"Create and Continue"**

4. **Grant role:** Select **"Editor"**
   - Click **"Continue"**
   - Click **"Done"**

5. Click on the new service account email

6. Go to **"Keys"** tab → **"Add Key"** → **"Create new key"**

7. Choose **JSON** → Click **"Create"**

8. **Save the JSON file** to:
   ```
   /Users/danlee/.config/google-cloud/swc-service-account.json
   ```

9. **Copy the service account email** (looks like: `swc-automation@somerset-window-cleaning-api.iam.gserviceaccount.com`)

---

## 📋 **Step 3: Update .env.local (1 minute)**

Open `/Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE/.env.local` and add:

```bash
# Google Cloud APIs
GOOGLE_CLOUD_PROJECT_ID=somerset-window-cleaning-api
GOOGLE_CLOUD_CREDENTIALS=/Users/danlee/.config/google-cloud/swc-service-account.json
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIza...YOUR-KEY-FROM-STEP-1
```

---

## 📋 **Step 4: Link Service Account to Google Business Profile (2 minutes)**

1. Go to: https://business.google.com/settings

2. Click **"Users"** → **"Add user"**

3. Paste service account email from Step 2:
   ```
   swc-automation@somerset-window-cleaning-api.iam.gserviceaccount.com
   ```

4. Grant **"Manager"** permissions

5. Click **"Invite"**

⚠️ **Important:** Use "Manager" not "Owner" role

---

## 📋 **Step 5: Test Everything (2 minutes)**

### **Test Places API:**
```bash
cd /Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE
npm run dev
```

Go to: http://localhost:3000/book-appointment

Start typing an address → see autocomplete suggestions ✅

### **Test GMB API:**
```bash
npx tsx scripts/auto-post-gmb.ts --template=serviceHighlight --service="Window Cleaning"
```

Should see: `✅ Post created successfully!`

---

## 🎉 **That's It! You're Done!**

### **What You Can Do Now:**

**1. Post to GMB Weekly:**
```bash
npx tsx scripts/auto-post-gmb.ts --template=beforeAfter --location="Glastonbury"
```

**2. Use Address Autocomplete:**
- Already works on your booking form
- Customers see instant address suggestions

**3. Automate Posts:**
Set up weekly automation (see main docs)

---

## 🔧 **Troubleshooting**

### **Issue: "Places API key not configured"**
**Fix:** Check .env.local has `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`

### **Issue: "Permission denied" for GMB**
**Fix:**
1. Verify service account added to GMB users
2. Check it has "Manager" role
3. Wait 5 minutes for permissions to sync

### **Issue: "Credentials not found"**
**Fix:** Check JSON file exists at:
```bash
ls -la /Users/danlee/.config/google-cloud/swc-service-account.json
```

---

## 📚 **Next Steps**

- Read full docs: `docs/SETUP_GOOGLE_APIS.md`
- Try different post templates
- Schedule weekly automation
- Monitor GMB insights

---

## ✅ **Quick Checklist**

- [ ] Created Places API key
- [ ] Created service account
- [ ] Downloaded JSON credentials
- [ ] Updated .env.local (3 new lines)
- [ ] Added service account to GMB users
- [ ] Tested Places autocomplete
- [ ] Tested GMB post

**Total time: ~10 minutes** 🚀
