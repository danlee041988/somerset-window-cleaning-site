# Security Policy

## 🔒 Never Commit Secrets

This repository uses **multiple layers of protection** to prevent secrets from being committed:

### Layer 1: .gitignore
All sensitive files are automatically ignored:
- `.env*` files
- `*-credentials.json`
- `*-key.json`
- `service-account*.json`
- And many more patterns

### Layer 2: git-secrets Pre-Commit Hooks
Automatically scans commits for:
- Google API keys (`AIza...`)
- AWS credentials
- Private keys
- Service account JSON
- OAuth tokens
- Client secrets

**If you try to commit a secret, the commit will be BLOCKED automatically.**

---

## ✅ Proper Secret Management

### Environment Variables
**Always use environment variables** for secrets:

```bash
# .env.local (NEVER commit this file!)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=AIza...
GOOGLE_CLOUD_CREDENTIALS=/path/to/service-account.json
GOOGLE_ADS_CLIENT_SECRET=GOCSPX-...
```

### Service Account Files
**Never commit service account JSON files!**

Store them outside the repository:
```bash
# ✅ GOOD
/Users/danlee/.config/google-cloud/swc-service-account.json

# ❌ BAD
/Users/danlee/Projects/SWC/CODEX_SWC_WEBSITE/config/service-account.json
```

### API Keys
**Always add restrictions** to API keys in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Edit the API key
3. Add **HTTP referrer restrictions**:
   - `https://somersetwindowcleaning.co.uk/*`
   - `http://localhost:3000/*`
4. Add **API restrictions**: Only enable the APIs you need

---

## 🚨 If a Secret Is Leaked

If you accidentally commit a secret:

### 1. Regenerate Immediately
- **Google API Key**: Go to Cloud Console → Credentials → Edit → "Regenerate Key"
- **Service Account**: Create a new service account, delete the old one
- **OAuth Tokens**: Revoke the refresh token

### 2. Remove from Git History
```bash
# Remove the file from ALL commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret-file.json" \
  --prune-empty --tag-name-filter cat -- --all

# Clean up
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (WARNING: This rewrites history!)
git push origin --force --all
```

### 3. Notify the Team
Let everyone know what happened and what was regenerated.

---

## 🛡️ Security Tools Installed

### git-secrets
Prevents commits containing secrets.

**Installed automatically via:**
```bash
brew install git-secrets
git secrets --install
git secrets --register-aws
git secrets --add 'AIza[0-9A-Za-z_-]{35}'  # Google API keys
```

**To test:**
```bash
git secrets --scan  # Scan repository for secrets
```

### GitHub Secret Scanning
GitHub automatically scans for leaked secrets and sends alerts.

**Enable push protection:**
1. Go to: https://github.com/danlee041988/somerset-window-cleaning-site/settings/security_analysis
2. Enable "Secret scanning push protection"

---

## 📋 Security Checklist

Before every commit, ensure:

- [ ] No `.env` files are staged
- [ ] No `*-credentials.json` files are staged
- [ ] No API keys in code (use `process.env.VARIABLE_NAME`)
- [ ] No hardcoded tokens or passwords
- [ ] All secrets are in `.env.local` (which is gitignored)

---

## 🔍 Regular Security Audits

### Monthly
- Review all API keys in Google Cloud Console
- Check for unused service accounts
- Audit GitHub access logs

### After Any Incident
- Regenerate ALL affected credentials
- Update `.env.local` with new values
- Review and update this security policy

---

## 📞 Questions?

If you're unsure whether something is sensitive:
- **When in doubt, don't commit it!**
- Ask in Slack/Teams first
- Use environment variables instead

---

## ⚠️ Remember

**A secret committed to Git is compromised forever**, even if you delete it later. Git history preserves everything. Always regenerate secrets if they've been committed, even for a moment.
