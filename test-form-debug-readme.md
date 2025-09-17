# Test Form Debug

## How to Use

This HTML file provides an isolated test environment for the EmailJS integration.

1. Open `test-form-debug.html` in a text editor
2. Replace the CONFIG values with your actual credentials from `.env.local`:
   - `YOUR_SERVICE_ID` → Value from `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
   - `YOUR_TEMPLATE_ID` → Value from `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
   - `YOUR_PUBLIC_KEY` → Value from `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`
   - `YOUR_RECAPTCHA_SITE_KEY` → Value from `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`

3. Also update the reCAPTCHA div `data-sitekey` attribute with your actual key

4. Open the file in a web browser (file:// URL is fine)

5. Open the browser console (F12) to see debug output

6. Fill out the form, complete reCAPTCHA, and submit

## Security Note

This file is for local testing only. Never deploy it with real API keys to a public server.