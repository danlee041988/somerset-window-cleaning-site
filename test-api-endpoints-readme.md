# Test API Endpoints

## How to Use

Before running the test script, you need to update it with your actual API credentials from `.env.local`:

1. Open `test-api-endpoints.cjs`
2. Replace the placeholder values:
   - `YOUR_SERVICE_ID` → Your EmailJS service ID
   - `YOUR_TEMPLATE_ID` → Your EmailJS template ID
   - `YOUR_PUBLIC_KEY` → Your EmailJS public key
   - `YOUR_PRIVATE_KEY` → Your EmailJS private key
   - `YOUR_NOTION_API_KEY` → Your Notion API key

3. Run the test:
   ```bash
   node test-api-endpoints.cjs
   ```

## Security Note

Never commit real API keys to version control. Always use environment variables in production code.