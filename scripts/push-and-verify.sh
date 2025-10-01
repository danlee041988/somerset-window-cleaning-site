#!/bin/bash
# Push to git and verify Vercel deployment
# Usage: ./scripts/push-and-verify.sh [branch-name]

set -e

BRANCH=${1:-$(git branch --show-current)}
CYAN='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}  Git Push + Vercel Verification${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo

# Step 1: Push to git
echo -e "${CYAN}📤 Pushing to git...${NC}"
git push origin "$BRANCH"
echo -e "${GREEN}✓ Pushed to origin/$BRANCH${NC}"
echo

# Step 2: Wait a moment for Vercel webhook to trigger
echo -e "${CYAN}⏳ Waiting for Vercel deployment to start (10s)...${NC}"
sleep 10
echo

# Step 3: Get the latest deployment
echo -e "${CYAN}🔍 Checking latest Vercel deployment...${NC}"
LATEST_DEPLOYMENT=$(npx vercel ls --yes 2>/dev/null | grep -E "https://" | head -1 | awk '{print $1}')

if [ -z "$LATEST_DEPLOYMENT" ]; then
  echo -e "${RED}❌ Could not find latest deployment${NC}"
  exit 1
fi

echo -e "   Latest: ${LATEST_DEPLOYMENT}"
echo

# Step 4: Monitor deployment status
echo -e "${CYAN}👀 Monitoring deployment status...${NC}"
MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
  ATTEMPT=$((ATTEMPT + 1))

  # Get deployment status from the table output
  DEPLOYMENT_LINE=$(npx vercel ls --yes 2>&1 | grep -A 50 "Deployments for" | grep "$LATEST_DEPLOYMENT")

  if [[ "$DEPLOYMENT_LINE" == *"● Ready"* ]]; then
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Live at: ${LATEST_DEPLOYMENT}${NC}"
    exit 0
  elif [[ "$DEPLOYMENT_LINE" == *"● Error"* ]]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo
    echo -e "${YELLOW}To see logs, run:${NC}"
    echo -e "  npx vercel inspect ${LATEST_DEPLOYMENT}"
    exit 1
  elif [[ "$DEPLOYMENT_LINE" == *"● Building"* ]] || [[ "$DEPLOYMENT_LINE" == *"● Queued"* ]]; then
    echo -e "   ⏳ Building... (attempt ${ATTEMPT}/${MAX_ATTEMPTS})"
    sleep 10
  else
    echo -e "   ⏳ Waiting for deployment... (attempt ${ATTEMPT}/${MAX_ATTEMPTS})"
    sleep 10
  fi
done

echo -e "${YELLOW}⚠️  Deployment taking longer than expected${NC}"
echo -e "   Check status at: https://vercel.com"
exit 1
