# Somerset Window Cleaning Website - Project Context

> **Purpose**: This file provides critical context for Claude Code when working on the Somerset Window Cleaning website project. It ensures consistency, prevents common errors, and maintains best practices across development sessions.

---

## 📋 Project Overview

**Type**: Next.js 14 (App Router) commercial website with booking system
**Purpose**: Window cleaning business website with quote requests and Notion CRM integration
**Working Directory**: `/Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE`
**Production URL**: https://somersetwindowcleaning.co.uk
**Deployment**: Vercel (automatic on push to `main`)

### Tech Stack
- **Framework**: Next.js 14.2.32 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.x
- **CRM**: Notion API (Website Customers database)
- **Email**: EmailJS (quote request notifications)
- **Forms**: React Hook Form + Zod validation
- **Security**: reCAPTCHA v2, rate limiting
- **Analytics**: Google Analytics 4, Google Tag Manager
- **Monitoring**: Sentry error tracking
- **Deployment**: Vercel

---

## 🚫 Protected Areas - DO NOT MODIFY

These files/areas are critical and should NOT be modified without explicit user approval:

### Security & Configuration
- `scripts/load-secrets.sh` - Keychain secrets management
- `lib/security/*` - reCAPTCHA, rate limiting, request validation
- `.env.local` - Environment variables (use keychain instead)
- `middleware.ts` - Security headers, redirects

### Database & Integrations
- `lib/server/notion.ts` - Notion client configuration
- `app/api/notion/simple-leads/route.ts` - Notion integration endpoint
- Keychain secrets (macOS Keychain) - Use provided commands only

### Critical Business Logic
- `components/BookingFormImproved.tsx` - Main booking form (modify carefully)
- EmailJS templates (referenced in user's EmailJS account)
- Notion database schema (must match field mappings)

---

## 🔴 CRITICAL: Environment Variables & Secrets Management

### Keychain-Based Secrets System
This project uses a **custom keychain-based secrets management system** (`scripts/load-secrets.sh`) that loads environment variables from macOS Keychain at dev server startup.

**⚠️ IMPORTANT**: The keychain takes precedence over `.env.local` files!

### How It Works
1. Dev server runs `scripts/dev-server.sh`
2. That script sources `scripts/load-secrets.sh`
3. `load-secrets.sh` fetches secrets from macOS Keychain using `security find-generic-password`
4. Secrets are exported as environment variables
5. These override any values in `.env.local`

### Keychain Secret Names
All secrets are stored with prefix `swc-` and account `danlee`:
- `swc-notion-api-token` → `NOTION_API_TOKEN`
- `swc-notion-customers-db-id` → `NOTION_WEBSITE_CUSTOMERS_DB_ID`
- `swc-emailjs-private-key` → `EMAILJS_PRIVATE_KEY`
- `swc-google-ads-*` → Various Google Ads credentials

### Managing Keychain Secrets

#### View a secret:
```bash
security find-generic-password -a danlee -s "swc-notion-api-token" -w
```

#### Delete a secret:
```bash
security delete-generic-password -a danlee -s "swc-notion-api-token"
```

#### Add/Update a secret:
```bash
security add-generic-password -a danlee -s "swc-notion-api-token" -w "YOUR_TOKEN_HERE"
```

### Current Notion Credentials (as of Oct 2025)
```
Token: [STORED_IN_KEYCHAIN]
Database ID: [STORED_IN_KEYCHAIN]
Database URL: [USE_KEYCHAIN_COMMAND]
```

### Troubleshooting Notion Integration

#### If Notion returns 503 "not configured":
1. **Check keychain secrets first** (not `.env.local`):
   ```bash
   security find-generic-password -a danlee -s "swc-notion-api-token" -w
   security find-generic-password -a danlee -s "swc-notion-customers-db-id" -w
   ```

2. **Verify token is correct** (should match above)

3. **If token is wrong, update keychain**:
   ```bash
   security delete-generic-password -a danlee -s "swc-notion-api-token"
   security add-generic-password -a danlee -s "swc-notion-api-token" -w "[STORED_IN_KEYCHAIN]"
   ```

4. **Kill all dev servers and restart**:
   ```bash
   pkill -9 -f "next dev"
   cd /Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE
   npm run dev
   ```

5. **Check Vercel production environment** (if production fails):
   ```bash
   npx vercel env ls
   # If missing or wrong:
   echo "y" | npx vercel env rm NOTION_API_TOKEN production
   npx vercel env add NOTION_API_TOKEN production <<< "[STORED_IN_KEYCHAIN]"
   git commit --allow-empty -m "Trigger redeploy" && git push origin main
   ```

#### Common Mistakes to Avoid:
- ❌ Only checking/updating `.env.local` (keychain overrides it)
- ❌ Not killing all dev server processes before restarting
- ❌ Forgetting to update Vercel environment variables
- ❌ Not triggering Vercel redeploy after updating env vars

---

## 📁 Project Structure

### Working Directory
```
/Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE
```

### Key Files
- `app/api/notion/simple-leads/route.ts` - Notion integration API endpoint
- `components/BookingFormImproved.tsx` - Main booking form component
- `lib/server/notion.ts` - Notion client and database helpers
- `scripts/load-secrets.sh` - Keychain secrets loader
- `scripts/dev-server.sh` - Dev server startup script
- `.env.local` - Local environment variables (overridden by keychain)

---

## 🎯 BookingFormImproved Features

### Form Structure (3 Steps)
1. **Property Details**: Category (residential/commercial), type, bedrooms, extension, conservatory
2. **Services & Frequency**: Service selection, frequency (only when windows selected)
3. **Contact Details**: Name, email, phone, address, postcode, notes

### Key Features
- Tab-style buttons for property type and bedrooms (better UX than dropdowns)
- Conditional commercial property type selector
- Extension and conservatory checkboxes with visual highlighting
- Frequency only shows when windows service selected
- No monthly frequency option
- No services pre-selected by default
- Success screen with cascading animations
- EmailJS integration with reCAPTCHA
- Notion database sync

### EmailJS Template
Subject format: `Name - Postcode - Services - Frequency`
Includes all form fields including extension, conservatory, commercial type

---

## 🚀 Deployment Checklist

### Before Declaring "Fixed":
1. ✅ Verify keychain secrets are correct (not just `.env.local`)
2. ✅ Kill ALL dev server processes and restart fresh
3. ✅ Check Vercel environment variables match keychain
4. ✅ Trigger Vercel redeploy if env vars changed
5. ✅ Wait for deployment to complete (check `npx vercel ls`)
6. ✅ Test form submission on both local and production
7. ✅ Verify lead appears in Notion database with all fields

### Never Say "Fixed" Until:
- User has tested form submission
- Lead appears in Notion database
- All form fields are correctly mapped
- Both local AND production are working

---

## 📝 Historical Issues

### Oct 2025 - Notion Integration "Keeps Reverting Back"
**Problem**: Notion integration failed repeatedly with 503 "not configured" error despite multiple "fixes"

**Root Cause**: Keychain had old Notion API token (`ntn_...fM09...`) that was overriding correct token in `.env.local` (`ntn_...aG73...`)

**Solution**: Updated keychain secrets, updated Vercel env vars, restarted dev server, triggered redeploy

**Lesson**: Always check keychain secrets FIRST when troubleshooting environment variables in this project!

---

## 🔍 Debugging Commands

### Check what's running:
```bash
lsof -i :3000
ps aux | grep "next dev"
```

### Kill all dev servers:
```bash
pkill -9 -f "next dev"
```

### Check Vercel deployment status:
```bash
npx vercel ls | head -10
```

### Test Notion API connection:
```bash
TOKEN="[STORED_IN_KEYCHAIN]"
DB_ID="[STORED_IN_KEYCHAIN]"
curl -H "Authorization: Bearer $TOKEN" \
     -H "Notion-Version: 2022-06-28" \
     "https://api.notion.com/v1/databases/$DB_ID"
```

---

## 📌 Remember
- **Keychain > .env.local** for environment variables
- **Multiple dev servers** can run simultaneously from background processes
- **Vercel needs redeploy** after environment variable changes
- **Check Vercel after every push** (user requirement)

---

## 🔄 Development Workflow

### Making Changes
1. **Always read files before editing** - Never edit blindly
2. **Check Vercel deployment after every push** - User requirement
3. **Test locally before pushing** - Run dev server and verify changes
4. **Kill stale dev servers** - Use `pkill -9 -f "next dev"` before restarting
5. **Verify environment variables** - Check keychain, not just `.env.local`

### Vercel Deployment Flow
```bash
# 1. Make changes and commit
git add .
git commit -m "Description"

# 2. Push to trigger deployment
git push origin main

# 3. ALWAYS check deployment status
npx vercel ls | head -10

# 4. Wait for "Ready" status before declaring done
```

### Testing Notion Integration
```bash
# 1. Test API connection first
TOKEN="[STORED_IN_KEYCHAIN]"
DB_ID="[STORED_IN_KEYCHAIN]"
curl -H "Authorization: Bearer $TOKEN" \
     -H "Notion-Version: 2022-06-28" \
     "https://api.notion.com/v1/databases/$DB_ID"

# 2. Submit test form (local)
# Visit: http://localhost:3000/book-appointment

# 3. Verify in Notion database
# Check: [USE_KEYCHAIN_COMMAND]
```

### Common Tasks

#### Update Environment Variable
```bash
# 1. Update keychain (local)
security delete-generic-password -a danlee -s "swc-VARIABLE-NAME"
security add-generic-password -a danlee -s "swc-VARIABLE-NAME" -w "NEW_VALUE"

# 2. Update Vercel (production)
echo "y" | npx vercel env rm VARIABLE_NAME production
npx vercel env add VARIABLE_NAME production <<< "NEW_VALUE"

# 3. Restart local dev server
pkill -9 -f "next dev"
cd /Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE
npm run dev

# 4. Trigger Vercel redeploy
git commit --allow-empty -m "Update env vars" && git push origin main
```

#### Debug Form Submission Issues
1. Check browser console for errors
2. Verify reCAPTCHA token is being generated
3. Check EmailJS service ID and template ID
4. Test Notion API connection separately
5. Check Vercel function logs if production issue

---

## 🎯 User Expectations

### Communication Style
- **Be concise** - User prefers direct answers without preamble
- **Check Vercel after EVERY push** - Non-negotiable requirement
- **Never say "fixed" until user confirms** - Wait for testing results
- **Explain WHY things failed** - User wants to understand root causes

### Quality Standards
- **Test both local AND production** - Not just one
- **Verify in Notion database** - Don't trust API response alone
- **Kill background processes** - Prevent stale server issues
- **Use correct credentials** - Check keychain, not assumptions

### What NOT to Do
- ❌ Only check `.env.local` when troubleshooting
- ❌ Forget to check Vercel deployment status
- ❌ Leave multiple dev servers running
- ❌ Declare something "fixed" without user testing
- ❌ Modify protected files without approval
