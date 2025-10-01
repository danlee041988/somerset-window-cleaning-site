#!/bin/bash

# Enable Google Business Profile & Places APIs
# Somerset Window Cleaning

echo "🚀 Enabling Google Business Profile & Places APIs"
echo "=================================================="
echo ""

# Step 1: Authenticate
echo "📋 Step 1: Authenticate with Google Cloud"
echo ""
echo "Run this command in your terminal:"
echo ""
echo "  gcloud auth login"
echo ""
read -p "Press Enter after you've authenticated..."
echo ""

# Step 2: Set project
echo "📋 Step 2: Set your Google Cloud project"
echo ""
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo "No project set. Let's create one:"
    read -p "Enter project ID (e.g., somerset-window-cleaning): " PROJECT_ID
    gcloud projects create $PROJECT_ID --name="Somerset Window Cleaning" 2>&1
    gcloud config set project $PROJECT_ID
else
    echo "Using existing project: $PROJECT_ID"
fi

echo ""

# Step 3: Enable billing check
echo "📋 Step 3: Enable billing (if not already done)"
echo ""
echo "⚠️  These APIs require billing enabled:"
echo "   1. Go to: https://console.cloud.google.com/billing"
echo "   2. Link project '$PROJECT_ID' to billing account"
echo ""
read -p "Press Enter when billing is enabled..."
echo ""

# Step 4: Enable APIs
echo "📋 Step 4: Enabling APIs..."
echo ""

echo "1️⃣  Enabling Google Business Profile API..."
gcloud services enable mybusinessbusinessinformation.googleapis.com
gcloud services enable mybusinessplaceactions.googleapis.com
gcloud services enable mybusinessaccountmanagement.googleapis.com
gcloud services enable mybusinessverifications.googleapis.com
echo "   ✅ Google Business Profile API enabled"
echo ""

echo "2️⃣  Enabling Google Places API..."
gcloud services enable places-backend.googleapis.com
gcloud services enable places.googleapis.com
gcloud services enable geocoding-backend.googleapis.com
echo "   ✅ Google Places API enabled"
echo ""

# Step 5: Create service account
echo "📋 Step 5: Creating service account..."
echo ""

SERVICE_ACCOUNT_NAME="swc-automation"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

# Check if service account exists
if gcloud iam service-accounts describe $SERVICE_ACCOUNT_EMAIL &>/dev/null; then
    echo "Service account already exists: $SERVICE_ACCOUNT_EMAIL"
else
    gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
        --display-name="Somerset Window Cleaning Automation" \
        --description="Automates GMB posts, Places API, and other Google services"
    echo "   ✅ Service account created: $SERVICE_ACCOUNT_EMAIL"
fi
echo ""

# Step 6: Grant permissions
echo "📋 Step 6: Granting permissions..."
echo ""

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/editor"

echo "   ✅ Permissions granted"
echo ""

# Step 7: Create API key for Places (client-side)
echo "📋 Step 7: Creating API key for Google Places..."
echo ""

API_KEY=$(gcloud alpha services api-keys create \
    --display-name="SWC Places API Key" \
    --api-target=service=places-backend.googleapis.com \
    --api-target=service=places.googleapis.com \
    --format="value(keyString)" 2>&1)

if [ $? -eq 0 ]; then
    echo "   ✅ API Key created: $API_KEY"
    echo ""
    echo "   ⚠️  Add this to your .env.local:"
    echo "   NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=$API_KEY"
else
    echo "   ⚠️  Manual creation required:"
    echo "   1. Go to: https://console.cloud.google.com/apis/credentials"
    echo "   2. Click 'Create Credentials' → 'API Key'"
    echo "   3. Restrict to: Places API"
    echo "   4. Add to .env.local as NEXT_PUBLIC_GOOGLE_PLACES_API_KEY"
fi
echo ""

# Step 8: Download service account key
echo "📋 Step 8: Downloading service account credentials..."
echo ""

CREDS_FILE="$HOME/.config/google-cloud/swc-service-account.json"
mkdir -p "$HOME/.config/google-cloud"

gcloud iam service-accounts keys create "$CREDS_FILE" \
    --iam-account="$SERVICE_ACCOUNT_EMAIL"

echo "   ✅ Credentials saved to: $CREDS_FILE"
echo ""

# Step 9: Update .env.local
echo "📋 Step 9: Update environment variables"
echo ""
echo "Add these to your .env.local file:"
echo ""
echo "# Google Cloud APIs"
echo "GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID"
echo "GOOGLE_CLOUD_CREDENTIALS=$CREDS_FILE"
echo "NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=[YOUR_API_KEY_FROM_STEP_7]"
echo ""

# Step 10: Link Google Business Profile
echo "📋 Step 10: Link your Google Business Profile"
echo ""
echo "⚠️  IMPORTANT: You need to authorize the service account to manage your GMB:"
echo ""
echo "1. Go to: https://business.google.com/settings"
echo "2. Click 'Users' → 'Add user'"
echo "3. Add: $SERVICE_ACCOUNT_EMAIL"
echo "4. Grant 'Manager' permissions"
echo ""
read -p "Press Enter when done..."
echo ""

# Success!
echo "=================================================="
echo "✅ SETUP COMPLETE!"
echo "=================================================="
echo ""
echo "📊 What's enabled:"
echo "   ✅ Google Business Profile API"
echo "   ✅ Google Places API"
echo "   ✅ Service account created"
echo "   ✅ Credentials downloaded"
echo ""
echo "📋 Next steps:"
echo "   1. Update .env.local with credentials"
echo "   2. Add service account to Google Business Profile"
echo "   3. Test with: npx tsx scripts/test-gmb-connection.ts"
echo ""
echo "📚 Documentation:"
echo "   • APIs Dashboard: https://console.cloud.google.com/apis/dashboard?project=$PROJECT_ID"
echo "   • Service Accounts: https://console.cloud.google.com/iam-admin/serviceaccounts?project=$PROJECT_ID"
echo "   • GMB Settings: https://business.google.com/settings"
echo ""
