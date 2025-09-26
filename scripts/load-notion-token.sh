#!/usr/bin/env bash
# Load Notion credentials from ~/.secrets/notion_token (or override via NOTION_TOKEN_FILE).
# Usage: source scripts/load-notion-token.sh [--quiet]

set -euo pipefail

TOKEN_FILE=${NOTION_TOKEN_FILE:-"$HOME/.secrets/notion_token"}

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "Notion secret file not found at $TOKEN_FILE" >&2
  return 1 2>/dev/null || exit 1
fi

set -a
# shellcheck disable=SC1090
source "$TOKEN_FILE"
set +a

if [[ "${1:-}" != "--quiet" ]]; then
  echo "Loaded Notion credentials from $TOKEN_FILE" >&2
fi
