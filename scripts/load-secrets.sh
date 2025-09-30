#!/usr/bin/env bash
set -euo pipefail

SWC_KEYCHAIN_ACCOUNT="${SWC_KEYCHAIN_ACCOUNT:-$USER}"
SWC_KEYCHAIN_PREFIX="${SWC_KEYCHAIN_PREFIX:-swc}"

log() {
  printf "[load-secrets] %s\n" "$1" >&2
}

fetch_secret() {
  local service="$1"
  security find-generic-password -a "$SWC_KEYCHAIN_ACCOUNT" -s "$service" -w 2>/dev/null
}

load_secret() {
  local var_name="$1"
  local key_name="$2"
  local service="${SWC_KEYCHAIN_PREFIX}-${key_name}"

  if [ -n "${!var_name-}" ]; then
    return
  fi

  local value
  if value=$(fetch_secret "$service"); then
    export "${var_name}=${value}"
  else
    log "Missing keychain item '${service}' for ${var_name}."
  fi
}

load_secret "NOTION_API_TOKEN" "notion-api-token"
load_secret "NOTION_WEBSITE_CUSTOMERS_DB_ID" "notion-customers-db-id"
load_secret "EMAILJS_PRIVATE_KEY" "emailjs-private-key"
load_secret "GOOGLE_ADS_DEVELOPER_TOKEN" "google-ads-developer-token"
load_secret "GOOGLE_ADS_CLIENT_ID" "google-ads-client-id"
load_secret "GOOGLE_ADS_CLIENT_SECRET" "google-ads-client-secret"
load_secret "GOOGLE_ADS_REFRESH_TOKEN" "google-ads-refresh-token"
load_secret "GOOGLE_ADS_CUSTOMER_ID" "google-ads-customer-id"
load_secret "GOOGLE_ADS_LOGIN_CUSTOMER_ID" "google-ads-login-customer-id"
load_secret "NEXT_PUBLIC_GTM_CONTAINER_ID" "gtm-container-id"
load_secret "NEXT_PUBLIC_PAGESPEED_API_KEY" "pagespeed-api-key"
load_secret "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY" "google-maps-api-key"
load_secret "NEXT_PUBLIC_GOOGLE_CALENDAR_API_KEY" "google-calendar-api-key"
load_secret "WHATSAPP_ACCESS_TOKEN" "whatsapp-access-token"
load_secret "WHATSAPP_PHONE_NUMBER_ID" "whatsapp-phone-number-id"
load_secret "WHATSAPP_BUSINESS_ACCOUNT_ID" "whatsapp-business-account-id"
load_secret "WHATSAPP_WEBHOOK_VERIFY_TOKEN" "whatsapp-webhook-verify-token"

log "Loaded secrets for account '${SWC_KEYCHAIN_ACCOUNT}' with prefix '${SWC_KEYCHAIN_PREFIX}'."
