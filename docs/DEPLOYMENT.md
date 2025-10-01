# Deployment Guide

## Automated Push & Verify

The project includes an automated script that pushes to git and verifies the Vercel deployment succeeds.

### Usage

**Option 1: NPM Script (Recommended)**
```bash
npm run push
```

**Option 2: Git Alias**
```bash
git push-verify
```

**Option 3: Direct Script**
```bash
./scripts/push-and-verify.sh [branch-name]
```

### What it does

1. **Pushes to git** - Commits are pushed to the specified branch (defaults to current branch)
2. **Waits for Vercel** - Gives Vercel 10 seconds to start building
3. **Monitors deployment** - Checks status every 10 seconds for up to 5 minutes
4. **Reports result** - Shows success ✓ or failure ❌ with colored output

### Output

**Success:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Git Push + Vercel Verification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📤 Pushing to git...
✓ Pushed to origin/feature/booking-form-redesign

⏳ Waiting for Vercel deployment to start (10s)...

🔍 Checking latest Vercel deployment...
   Latest: https://somerset-window-cleaning-nextjs-xxxxx.vercel.app

👀 Monitoring deployment status...
   ⏳ Building... (attempt 1/30)
   ⏳ Building... (attempt 2/30)
✓ Deployment successful!
🌐 Live at: https://somerset-window-cleaning-nextjs-xxxxx.vercel.app
```

**Failure:**
```
❌ Deployment failed!

To see logs, run:
  npx vercel inspect https://somerset-window-cleaning-nextjs-xxxxx.vercel.app
```

## Manual Deployment Check

To manually check deployment status:

```bash
# List recent deployments
npx vercel ls

# Inspect specific deployment
npx vercel inspect <deployment-url>

# View logs for a deployment
npx vercel logs <deployment-url>
```

## Vercel Dashboard

View all deployments at: https://vercel.com/dan-lees-projects-358360f4/somerset-window-cleaning-nextjs

## Deployment Status Indicators

- **● Ready** - Deployment successful and live
- **● Building** - Currently building
- **● Queued** - Waiting to build
- **● Error** - Build or deployment failed
- **● Canceled** - Deployment was canceled

## Troubleshooting

### Build fails on Vercel but works locally

1. Check environment variables are set in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Check Node.js version compatibility (project requires >=18.17.0)
4. Review build logs: `npx vercel inspect <deployment-url>`

### Push-verify script times out

The script waits up to 5 minutes (30 attempts × 10 seconds). If your build takes longer:

1. Check Vercel dashboard for actual status
2. Builds typically take 1-2 minutes
3. If consistently timing out, may indicate build issue

### Script shows "Unknown" status

This can happen if:
- Vercel webhook hasn't triggered yet (wait longer)
- Deployment URL format changed
- Network connectivity issues

Try running `npx vercel ls` manually to see actual status.
