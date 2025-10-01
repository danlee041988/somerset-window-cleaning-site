# Test Sentry Error Tracking

## Quick Test (Do This Now):

1. **Open your browser to:** http://localhost:3000
2. **Open Developer Console:**
   - Mac: `Cmd + Option + I`
   - Windows: `F12`
3. **Paste this code and press Enter:**

```javascript
// Import Sentry
import('https://browser.sentry-cdn.com/8.46.0/bundle.tracing.min.js').then(() => {
  Sentry.captureException(new Error('Test error from Somerset Window Cleaning - Browser Console'));
  console.log('✅ Error sent to Sentry!');
});
```

OR simpler:

```javascript
throw new Error('Test error from Somerset Window Cleaning');
```

4. **Refresh Sentry dashboard** and look for the error!

---

## Alternative: Use the Test Page

Visit: **http://localhost:3000/sentry-test**

Click the **red button** "Trigger Caught Error (try/catch)"

This will send an error that Sentry will definitely catch.

---

## What You Should See in Sentry:

- Error message: "Test error from Somerset Window Cleaning"
- Browser info (Chrome/Safari)
- Timestamp
- Stack trace
- Environment: development

---

## Sentry Dashboard:
https://somerset-window-cleaning.sentry.io/issues/
