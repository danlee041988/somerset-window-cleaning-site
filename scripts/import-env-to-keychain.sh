#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${1:-.env.local}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Usage: $0 [env-file]" >&2
  echo "Provided env file '$ENV_FILE' was not found." >&2
  exit 1
fi

SWC_KEYCHAIN_ACCOUNT="${SWC_KEYCHAIN_ACCOUNT:-$USER}"
SWC_KEYCHAIN_PREFIX="${SWC_KEYCHAIN_PREFIX:-swc}"

SECRET_VARS=(
  "NOTION_API_TOKEN:notion-api-token"
  "NOTION_WEBSITE_CUSTOMERS_DB_ID:notion-customers-db-id"
  "EMAILJS_PRIVATE_KEY:emailjs-private-key"
  "NEXT_PUBLIC_GTM_CONTAINER_ID:gtm-container-id"
  "GOOGLE_ADS_CUSTOMER_ID:google-ads-customer-id"
  "GOOGLE_ADS_LOGIN_CUSTOMER_ID:google-ads-login-customer-id"
  "GOOGLE_ADS_DEVELOPER_TOKEN:google-ads-developer-token"
  "GOOGLE_ADS_CLIENT_ID:google-ads-client-id"
  "GOOGLE_ADS_CLIENT_SECRET:google-ads-client-secret"
  "GOOGLE_ADS_REFRESH_TOKEN:google-ads-refresh-token"
  "WHATSAPP_ACCESS_TOKEN:whatsapp-access-token"
  "WHATSAPP_PHONE_NUMBER_ID:whatsapp-phone-number-id"
  "WHATSAPP_BUSINESS_ACCOUNT_ID:whatsapp-business-account-id"
  "WHATSAPP_WEBHOOK_VERIFY_TOKEN:whatsapp-webhook-verify-token"
)

# shellcheck disable=SC1090
source "$ENV_FILE"

for entry in "${SECRET_VARS[@]}"; do
  var=${entry%%:*}
  key=${entry#*:}
  value="${!var-}"
  if [ -z "${value}" ]; then
    continue
  fi
  if [[ "$value" == YOUR_* ]]; then
    continue
  fi

  service="${SWC_KEYCHAIN_PREFIX}-${key}"
  security add-generic-password \
    -a "$SWC_KEYCHAIN_ACCOUNT" \
    -s "$service" \
    -w "$value" \
    -U >/dev/null
  echo "Stored $var in Keychain service '$service' for account '$SWC_KEYCHAIN_ACCOUNT'"
done

echo "Import completed from $ENV_FILE"
