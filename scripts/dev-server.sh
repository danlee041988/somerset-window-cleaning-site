#!/bin/bash

set -euo pipefail

PORT=${DEV_PORT:-3000}
HOST=${DEV_HOST:-localhost}
NEXT_BIN="./node_modules/.bin/next"

if [ -f "./scripts/load-secrets.sh" ]; then
  # shellcheck disable=SC1091
  source "./scripts/load-secrets.sh"
fi

if [ ! -x "$NEXT_BIN" ]; then
  echo "❌ Could not find Next.js binary at $NEXT_BIN"
  echo "   Run 'npm install' and try again."
  exit 1
fi

echo "\n🚀 Somerset Window Cleaning – Dev Server"

EXISTING_PIDS=$(lsof -ti tcp:${PORT} || true)
if [ -n "$EXISTING_PIDS" ]; then
  echo "⚠️  Port ${PORT} is in use. Terminating existing process(es): $EXISTING_PIDS"
  kill $EXISTING_PIDS 2>/dev/null || true
  sleep 1
  STILL_RUNNING=$(lsof -ti tcp:${PORT} || true)
  if [ -n "$STILL_RUNNING" ]; then
    echo "⚠️  Processes still running on ${PORT}. Forcing termination."
    kill -9 $STILL_RUNNING 2>/dev/null || true
    sleep 1
  fi
else
  echo "✅ Port ${PORT} is free."
fi

DEV_CMD=("$NEXT_BIN" dev -H "$HOST" -p "$PORT")

echo "▶️  Starting dev server: ${DEV_CMD[*]}"
"${DEV_CMD[@]}" &
DEV_PID=$!

cleanup() {
  echo "\n🛑 Stopping dev server (pid $DEV_PID)..."
  kill $DEV_PID 2>/dev/null || true
  wait $DEV_PID 2>/dev/null || true
  exit 0
}

trap cleanup INT TERM

echo "⏳ Waiting for http://${HOST}:${PORT} to respond..."
READY=false
for i in {1..30}; do
  if nc -z "$HOST" "$PORT" 2>/dev/null; then
    READY=true
    break
  fi
  sleep 1
  if ! kill -0 $DEV_PID 2>/dev/null; then
    echo "\n❌ Dev server exited unexpectedly."
    wait $DEV_PID
    exit 1
  fi
  printf '.'
  if [ $((i % 10)) -eq 0 ]; then
    printf ' '
  fi
done

echo

if [ "$READY" = true ]; then
  echo "✅ Dev server ready at http://${HOST}:${PORT}"
  if command -v open >/dev/null 2>&1; then
    open "http://${HOST}:${PORT}" >/dev/null 2>&1 || true
  fi
else
  echo "⚠️  Server did not respond within 30 seconds, but process is running (pid $DEV_PID)."
fi

echo "📡 Hot reload active – press Ctrl+C to stop."

wait $DEV_PID
