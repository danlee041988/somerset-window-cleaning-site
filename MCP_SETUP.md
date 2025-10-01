# MCP Server Setup Complete ✅

## Installed MCP Servers

### 1. ✅ GitHub MCP Server
**Status:** Connected  
**Transport:** Docker (stdio)  
**Capabilities:**
- Read repository information
- Manage pull requests and issues
- Analyze commits and code changes
- Trigger CI/CD workflows
- Review PRs automatically

**Usage Example:**
```
Ask Claude: "Show me recent commits in this repository"
Ask Claude: "Create a PR for the current branch"
Ask Claude: "What issues are open in this repo?"
```

### 2. ✅ Sentry MCP Server  
**Status:** Configured (needs OAuth authentication on first use)  
**Transport:** HTTP (Remote)  
**Capabilities:**
- Access live error reports from production
- Analyze error patterns and stack traces
- Generate fix suggestions based on error context
- Query issues across your Sentry projects

**Usage Example:**
```
Ask Claude: "Show me recent errors from Sentry"
Ask Claude: "What's causing the most errors in production?"
Ask Claude: "Generate a fix for error ID #123"
```

---

## Configuration Files

### Environment Variables (`.env.local`)
```bash
# GitHub MCP
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here

# Sentry Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
NEXT_PUBLIC_SENTRY_ENABLED=true
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
```

### MCP Configuration (`~/.claude.json`)
Both servers are configured in your Claude Code config:
- **GitHub:** Local Docker container with PAT authentication
- **Sentry:** Remote HTTP server with Bearer token authentication

---

## Sentry Error Tracking

### Client-Side Monitoring
**File:** `sentry.client.config.ts`
- ✅ Tracks browser errors and performance
- ✅ 10% session replay sampling
- ✅ 100% replay on errors
- ✅ PII filtering (email, phone, address redacted)
- ✅ Ignores common browser extension errors

### Server-Side Monitoring
**File:** `sentry.server.config.ts`
- ✅ Tracks API route errors
- ✅ Server-side exceptions
- ✅ 10% trace sampling in production

### Edge Runtime Monitoring
**File:** `sentry.edge.config.ts`
- ✅ Tracks middleware errors
- ✅ Edge function exceptions

---

## Testing Your Setup

### Test Sentry Error Tracking
1. Deploy your site or run locally
2. Trigger a test error (e.g., throw error in a component)
3. Check Sentry dashboard: https://somerset-window-cleaning.sentry.io
4. Ask Claude: "Show me recent errors from Sentry"

### Test GitHub MCP
1. Ask Claude: "What's my GitHub repository URL?"
2. Ask Claude: "Show me recent commits"
3. Ask Claude: "List open pull requests"

---

## Next Steps

### 🎯 Production Deployment
1. Deploy to Vercel with Sentry enabled
2. Monitor errors in real-time
3. Use Claude to debug production issues

### 🔧 GitHub Workflow
1. Create feature branches
2. Ask Claude to create PRs
3. Review code changes with Claude's help

### 📊 Error Monitoring
1. Set up Sentry alerts for critical errors
2. Use Claude to analyze error patterns
3. Generate fixes automatically

---

## Security Notes

✅ **All secrets are protected:**
- `.env.local` is gitignored
- `git-secrets` pre-commit hooks active
- GitHub PAT and Sentry token never committed
- 4 layers of secret protection in place

---

## Troubleshooting

### GitHub MCP Not Connecting
```bash
# Check Docker is running
docker ps

# Test GitHub MCP manually
docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN=ghp_... ghcr.io/github/github-mcp-server
```

### Sentry Not Recording Errors
```bash
# Check environment variables
echo $NEXT_PUBLIC_SENTRY_DSN
echo $NEXT_PUBLIC_SENTRY_ENABLED

# Verify Sentry is initialized
# Look for "Sentry initialized" in browser console
```

### MCP Server Health Check
```bash
claude mcp list
```

---

## Resources

- **GitHub MCP Docs:** https://github.com/github/github-mcp-server
- **Sentry MCP Docs:** https://docs.sentry.io/product/sentry-mcp/
- **Sentry Dashboard:** https://somerset-window-cleaning.sentry.io
- **GitHub Repo:** https://github.com/danlee041988/somerset-window-cleaning-site

---

**Setup Date:** October 1, 2025  
**Claude Code Version:** Latest  
**Status:** ✅ Production Ready
