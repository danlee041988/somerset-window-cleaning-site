#!/bin/bash

echo "🚀 Setting Vercel Environment Variables"
echo "======================================"
echo ""
echo "This script will help you set the required environment variables in Vercel."
echo "Make sure you have the Vercel CLI installed and are logged in."
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "   npm i -g vercel"
    exit 1
fi

echo "📋 Setting environment variables for production, preview, and development..."
echo ""

# EmailJS Configuration
echo "Setting EmailJS variables..."
vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID production preview development < /dev/tty
vercel env add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY production preview development < /dev/tty
vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_ID production preview development < /dev/tty

# reCAPTCHA Configuration
echo ""
echo "Setting reCAPTCHA variable..."
vercel env add NEXT_PUBLIC_RECAPTCHA_SITE_KEY production preview development < /dev/tty

echo ""
echo "✅ Environment variables set!"
echo ""
echo "📝 Next steps:"
echo "1. Redeploy your project: vercel --prod"
echo "2. Check that all variables are set: vercel env ls"
echo ""
echo "🔐 Required values from your .env.local:"
echo "- NEXT_PUBLIC_EMAILJS_SERVICE_ID: service_yfnr1a9"
echo "- NEXT_PUBLIC_EMAILJS_PUBLIC_KEY: cbA_IhBfxEeDwbEx6"
echo "- NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: template_booking_form"
echo "- NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 6LdwUDQrAAAAAM0HwqssAwwiFgCZ_ZrSA7gZciWC"
