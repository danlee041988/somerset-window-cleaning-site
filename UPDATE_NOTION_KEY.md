# Notion Integration Setup Instructions

## The Issue
Your current Notion API key is invalid. The key starting with `ntn_` is not a valid Notion integration token.

## How to Fix

### 1. Get Your Notion Integration Token

1. Visit: https://www.notion.so/my-integrations
2. Find your integration or create a new one:
   - Click "New integration"
   - Name it "Somerset Window Cleaning"
   - Select the workspace
   - Click "Submit"
3. Copy the **"Internal Integration Token"** (starts with `secret_`)

### 2. Update .env.local

Replace the current invalid key:
```
NOTION_API_KEY=ntn_YOUR_TOKEN_HERE
```

With the correct token:
```
NOTION_API_KEY=secret_YOUR_ACTUAL_TOKEN_HERE
```

### 3. Share Your Database with the Integration

1. Open your Notion database
2. Click "Share" button (top right)
3. Click "Invite"
4. Search for your integration name (e.g., "Somerset Window Cleaning")
5. Click on the integration to add it
6. The integration needs at least "Can edit" permissions

### 4. Update Vercel Environment Variables

1. Go to your Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Update `NOTION_API_KEY` with the new token
4. Redeploy your application

### 5. Test the Connection

After updating, visit: `/api/notion-test` to verify the connection works.

## Important Notes

- Notion integration tokens ALWAYS start with `secret_`
- The token you have (starting with `ntn_`) appears to be from a different service
- Make sure to keep the token secure and never commit it to Git