#!/bin/bash

# Somerset Window Cleaning - Enhanced Development Server
echo "🚀 Starting Somerset Window Cleaning Development Environment"

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Port 3000 is busy. Trying port 3001..."
    npm run dev:fallback &
    DEV_PID=$!
    echo "✅ Server starting on http://localhost:3001"
else
    npm run dev &
    DEV_PID=$!
    echo "✅ Server starting on http://localhost:3000"
fi

# Wait for server to be ready
sleep 3

# Open browser automatically
if command -v open >/dev/null 2>&1; then
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo "🌐 Opening http://localhost:3000"
        open http://localhost:3000
    else
        echo "🌐 Opening http://localhost:3001" 
        open http://localhost:3001
    fi
else
    echo "🌐 Manual: Open http://localhost:3000 in your browser"
fi

# Cleanup function
cleanup() {
    echo "🛑 Stopping development server..."
    kill $DEV_PID 2>/dev/null
    exit 0
}

# Handle Ctrl+C
trap cleanup INT

echo "📡 Development server is running..."
echo "🔥 Hot reloading enabled - changes will reflect instantly"
echo "🛑 Press Ctrl+C to stop"

# Keep script running
wait $DEV_PID