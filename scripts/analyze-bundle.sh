#!/bin/bash
# Bundle size analysis script

echo "🔍 Analyzing bundle size..."

# Set environment variable to enable bundle analyzer
ANALYZE=true npm run build

echo ""
echo "✅ Analysis complete!"
echo "📊 Open .next/analyze/client.html in your browser to view the report"
