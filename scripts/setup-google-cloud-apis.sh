#!/bin/bash

# Setup Google Cloud APIs for Somerset Window Cleaning
# Run this after: gcloud auth login

echo "🚀 Somerset Window Cleaning - Google Cloud API Setup"
echo "======================================================="
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI not found. Install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
    echo "❌ Not authenticated. Run: gcloud auth login"
    exit 1
fi

echo "✅ gcloud CLI found and authenticated"
echo ""

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
    echo "⚠️  No project set. Creating new project..."
    echo ""
    read -p "Enter project ID (e.g., somerset-window-cleaning): " PROJECT_ID
    gcloud projects create $PROJECT_ID --name="Somerset Window Cleaning"
    gcloud config set project $PROJECT_ID
fi

echo "📊 Using project: $PROJECT_ID"
echo ""

# Enable billing warning
echo "⚠️  IMPORTANT: These APIs require billing to be enabled"
echo "   Go to: https://console.cloud.google.com/billing"
echo "   Link your project to a billing account"
echo ""
read -p "Press Enter when billing is enabled..."

echo ""
echo "🔧 Enabling Google Cloud APIs..."
echo ""

# Priority 1: Business Profile API
echo "1️⃣  Enabling Google Business Profile API..."
gcloud services enable mybusinessbusinessinformation.googleapis.com
gcloud services enable mybusinessplaceactions.googleapis.com
gcloud services enable mybusiness.googleapis.com
echo "   ✅ Google Business Profile API enabled"

# Priority 2: Distance Matrix API
echo "2️⃣  Enabling Distance Matrix API..."
gcloud services enable distancematrix.googleapis.com
gcloud services enable directions.googleapis.com
echo "   ✅ Distance Matrix API enabled"

# Priority 3: Cloud Tasks API
echo "3️⃣  Enabling Cloud Tasks & Scheduler..."
gcloud services enable cloudtasks.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
echo "   ✅ Cloud Tasks API enabled"

# Priority 4: Vision API
echo "4️⃣  Enabling Cloud Vision API..."
gcloud services enable vision.googleapis.com
echo "   ✅ Cloud Vision API enabled"

# Priority 5: Sheets API
echo "5️⃣  Enabling Google Sheets API..."
gcloud services enable sheets.googleapis.com
gcloud services enable drive.googleapis.com
echo "   ✅ Google Sheets API enabled"

# Bonus: Natural Language API
echo "6️⃣  Enabling Natural Language API..."
gcloud services enable language.googleapis.com
echo "   ✅ Natural Language API enabled"

# Bonus: Speech-to-Text API
echo "7️⃣  Enabling Speech-to-Text API..."
gcloud services enable speech.googleapis.com
echo "   ✅ Speech-to-Text API enabled"

echo ""
echo "======================================================="
echo "✅ All APIs enabled successfully!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create Service Account:"
echo "   gcloud iam service-accounts create swc-automation \\"
echo "     --display-name='Somerset Window Cleaning Automation'"
echo ""
echo "2. Grant Permissions:"
echo "   gcloud projects add-iam-policy-binding $PROJECT_ID \\"
echo "     --member='serviceAccount:swc-automation@$PROJECT_ID.iam.gserviceaccount.com' \\"
echo "     --role='roles/owner'"
echo ""
echo "3. Create & Download Key:"
echo "   gcloud iam service-accounts keys create ~/swc-service-account.json \\"
echo "     --iam-account=swc-automation@$PROJECT_ID.iam.gserviceaccount.com"
echo ""
echo "4. Add to .env.local:"
echo "   GOOGLE_CLOUD_PROJECT_ID=$PROJECT_ID"
echo "   GOOGLE_CLOUD_CREDENTIALS=/path/to/swc-service-account.json"
echo ""
echo "5. View APIs:"
echo "   https://console.cloud.google.com/apis/dashboard?project=$PROJECT_ID"
echo ""
echo "======================================================="
