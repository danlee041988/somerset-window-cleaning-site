# Notion API Integration Fix Guide

## Issues Found:

1. **Invalid API Token**: Your token `ntn_33378949239...` is not a valid Notion token
2. **API Breaking Change**: Notion API version 2025-09-03 requires using `data_source_id` instead of `database_id`

## Step-by-Step Fix:

### 1. Get the Correct Notion API Token

From the Notion integration page you showed:
1. Click "Show" next to "Internal Integration Secret"
2. Copy the ENTIRE token (it will start with `secret_`)
3. Update your `.env.local` file:

```bash
NOTION_API_KEY=secret_[YOUR_ACTUAL_TOKEN_HERE]
```

### 2. Share Your Database with the Integration

1. Open your Notion database
2. Click "Share" (top right)
3. Click "Invite"
4. Search for "Somerset Window Cleaning"
5. Add it with "Can edit" permissions

### 3. Get Your Data Source ID

Since Notion now uses data sources instead of databases directly, you need to:

1. In your Notion database, click the "..." menu
2. Go to "Manage data sources"
3. Click "Copy data source ID"
4. Update your `.env.local`:

```bash
NOTION_DATABASE_ID=2707c58a-5877-81af-9e26-ff0d9a5e0ae3
NOTION_DATA_SOURCE_ID=[YOUR_DATA_SOURCE_ID_HERE]
```

### 4. Update Vercel Environment Variables

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Update:
   - `NOTION_API_KEY` with the `secret_` token
   - Add `NOTION_DATA_SOURCE_ID` with the data source ID
3. Redeploy

## Quick Test

After updating everything, test with:
```bash
curl http://localhost:3000/api/notion-test
```

This should return success if everything is configured correctly.