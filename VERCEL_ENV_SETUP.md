# Fixing "Cannot initialize EmailJS - public key missing" Error

The error you're seeing is because the environment variables are not set in your Vercel deployment. The variables are only in your local `.env.local` file, but Vercel needs them too.

## Quick Fix Options

### Option 1: Use Vercel Dashboard (Easiest)

1. Go to your Vercel project dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production**, **Preview**, and **Development**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | `service_yfnr1a9` |
   | `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | `cbA_IhBfxEeDwbEx6` |
   | `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID` | `template_booking_form` |
   | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | `6LdwUDQrAAAAAJh5Z2V5paJn003OrFouc8KVdA0H` |
   | `NOTION_API_TOKEN` | `<< your Notion integration token >>` |
   | `NOTION_WEBSITE_CUSTOMERS_DB_ID` | `2707c58a587781af9e26ff0d9a5e0ae3` |

5. Click **Save** for each variable
6. **Redeploy** your project (Deployments → ... → Redeploy)

### Option 2: Use Vercel CLI

1. Install Vercel CLI if you haven't:
   ```bash
   npm i -g vercel
   ```

2. Run the setup script I created:
   ```bash
   ./scripts/set-vercel-env-vars.sh
   ```

3. Or manually add each variable:
   ```bash
   vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID production preview development
   # Enter value: service_yfnr1a9

   vercel env add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY production preview development
   # Enter value: cbA_IhBfxEeDwbEx6

   vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_ID production preview development
   # Enter value: template_booking_form

   vercel env add NEXT_PUBLIC_RECAPTCHA_SITE_KEY production preview development
   # Enter value: 6LdwUDQrAAAAAJh5Z2V5paJn003OrFouc8KVdA0H

   vercel env add NOTION_API_TOKEN production preview development
   # Enter value: (paste integration token starting with ntn_)

   vercel env add NOTION_WEBSITE_CUSTOMERS_DB_ID production preview development
   # Enter value: 2707c58a587781af9e26ff0d9a5e0ae3
   ```

4. Redeploy:
   ```bash
   vercel --prod
   ```

### Option 3: Create .env.production File (Alternative)

Create a `.env.production` file with the same variables:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_yfnr1a9
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=cbA_IhBfxEeDwbEx6
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_booking_form
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LdwUDQrAAAAAJh5Z2V5paJn003OrFouc8KVdA0H
NOTION_API_TOKEN=
NOTION_WEBSITE_CUSTOMERS_DB_ID=2707c58a587781af9e26ff0d9a5e0ae3
```

Then commit and push:
```bash
git add .env.production
git commit -m "Add production environment variables"
git push
```

**Note:** This is less secure as it puts your keys in the repository.

## Important Notes

- **NEXT_PUBLIC_** prefix is required for client-side variables in Next.js
- These are public keys meant to be exposed to the browser
- Your private EmailJS key should NOT be added to client-side code
- After adding variables, you MUST redeploy for changes to take effect

## Verification

After redeploying, check the browser console. You should see:
- 🔧 EmailJS Environment Variables: All showing "✓ Set"
- ✅ EmailJS initialized successfully

Instead of the current error about missing public key.
