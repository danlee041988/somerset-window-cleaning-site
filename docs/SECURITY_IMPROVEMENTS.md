# Security Improvements

This document describes the security enhancements implemented to protect the Somerset Window Cleaning website from spam, abuse, and unauthorized access.

## Overview

The following security measures have been implemented:

1. **Server-side reCAPTCHA verification** - Prevents spam form submissions
2. **Webhook signature verification** - Validates WhatsApp webhook authenticity
3. **Rate limiting** - Prevents abuse and DoS attacks
4. **Request ID tracking** - Enables request tracing and debugging

---

## 1. Server-Side reCAPTCHA Verification

### What It Does
Validates reCAPTCHA tokens on the server to prevent bots from bypassing client-side checks.

### Implementation
- **Location**: `lib/security/recaptcha.ts`
- **Used in**: `app/api/notion/leads/route.ts`

### Configuration
Add to your environment variables:
```bash
RECAPTCHA_SECRET_KEY=your-secret-key-here
```

Or store in macOS Keychain:
```bash
security add-generic-password -a "$USER" -s swc-recaptcha-secret -w "YOUR_SECRET_KEY" -U
```

### How It Works
1. Client completes reCAPTCHA and gets a token
2. Token is sent to `/api/notion/leads` with form data
3. Server verifies token with Google's API
4. Only valid tokens (score ≥ 0.5) are accepted
5. Invalid tokens return 403 Forbidden

### Testing
```bash
npm test -- tests/unit/security/recaptcha.test.ts
```

---

## 2. Webhook Signature Verification

### What It Does
Validates that incoming WhatsApp webhooks are genuinely from Meta/WhatsApp using HMAC-SHA256 signatures.

### Implementation
- **Location**: `lib/security/webhook-verification.ts`
- **Used in**: `app/api/whatsapp/webhook/route.ts`

### Configuration
Add to your environment variables:
```bash
WHATSAPP_APP_SECRET=your-app-secret-here
```

Or store in macOS Keychain:
```bash
security add-generic-password -a "$USER" -s swc-whatsapp-secret -w "YOUR_APP_SECRET" -U
```

### How It Works
1. WhatsApp sends webhook with `x-hub-signature-256` header
2. Server computes expected signature using app secret
3. Uses timing-safe comparison to prevent timing attacks
4. Invalid signatures return 401 Unauthorized

### Security Benefits
- Prevents webhook spoofing
- Ensures messages are from WhatsApp
- Protects against replay attacks (when combined with timestamp checking)

### Testing
```bash
npm test -- tests/unit/security/webhook-verification.test.ts
```

---

## 3. Rate Limiting

### What It Does
Limits the number of requests from a single IP address to prevent abuse and DoS attacks.

### Implementation
- **Location**: `lib/security/rate-limit.ts`
- **Used in**: `app/api/notion/leads/route.ts`

### Configuration
Current limits:
- **Notion leads endpoint**: 5 requests per minute per IP
- **Configurable** per endpoint

### How It Works
1. Tracks requests by IP address in memory
2. Allows up to N requests per time window
3. Returns 429 Too Many Requests when limit exceeded
4. Includes `Retry-After` header with wait time
5. Automatically cleans up expired entries

### Response Headers
```
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 2025-09-30T14:00:00.000Z
Retry-After: 45
```

### Limitations
- **In-memory storage**: Resets on server restart
- **Single instance**: Not shared across multiple servers
- **Future improvement**: Use Redis/Upstash for distributed rate limiting

### Testing
```bash
npm test -- tests/unit/security/rate-limit.test.ts
```

---

## 4. Request ID Tracking

### What It Does
Assigns a unique ID to every request for tracing and debugging.

### Implementation
- **Location**: `lib/security/request-id.ts`
- **Used in**: `middleware.ts`, all API routes

### How It Works
1. Middleware generates UUID for each request
2. ID is added to response headers: `X-Request-ID`
3. API routes log events with request ID
4. Easy to grep logs: `[abc-123-def] Error occurred`

### Benefits
- Correlate logs across services
- Debug specific user issues
- Track request flow through system
- Essential for production debugging

### Example Logs
```
[f47ac10b-58cc-4372-a567-0e02b2c3d479] Verifying reCAPTCHA token
[f47ac10b-58cc-4372-a567-0e02b2c3d479] reCAPTCHA verified successfully (score: 0.9)
[f47ac10b-58cc-4372-a567-0e02b2c3d479] Creating Notion page
[f47ac10b-58cc-4372-a567-0e02b2c3d479] Lead successfully synced to Notion
```

---

## API Route Security Checklist

When creating new API routes, ensure:

- [ ] Request ID tracking enabled
- [ ] Rate limiting implemented (if public endpoint)
- [ ] Input validation with Zod schemas
- [ ] Error messages don't leak sensitive info
- [ ] Proper HTTP status codes used
- [ ] Security headers included
- [ ] Logging includes request context
- [ ] Webhook signatures verified (if applicable)

### Example Secure API Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { getOrCreateRequestId, formatLogWithRequestId } from '@/lib/security/request-id'

export async function POST(request: NextRequest) {
  const requestId = getOrCreateRequestId(request.headers)
  const log = (msg: string) => console.log(formatLogWithRequestId(requestId, msg))
  const logError = (msg: string) => console.error(formatLogWithRequestId(requestId, msg))

  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    const rateLimit = checkRateLimit(`my-endpoint:${ip}`, { limit: 10, windowMs: 60000 })

    if (!rateLimit.allowed) {
      logError(`Rate limit exceeded for IP: ${ip}`)
      return NextResponse.json(
        { error: 'rate_limit_exceeded' },
        { 
          status: 429,
          headers: {
            'X-Request-ID': requestId,
            'Retry-After': String(rateLimit.retryAfter || 60),
          },
        }
      )
    }

    // Your logic here
    log('Processing request')

    return NextResponse.json(
      { success: true },
      { headers: { 'X-Request-ID': requestId } }
    )
  } catch (error) {
    logError('Error: ' + (error instanceof Error ? error.message : String(error)))
    return NextResponse.json(
      { error: 'internal_error' },
      { status: 500, headers: { 'X-Request-ID': requestId } }
    )
  }
}
```

---

## Testing Security Features

### Run All Security Tests
```bash
npm test -- tests/unit/security/
```

### Run Individual Test Suites
```bash
npm test -- tests/unit/security/recaptcha.test.ts
npm test -- tests/unit/security/webhook-verification.test.ts
npm test -- tests/unit/security/rate-limit.test.ts
```

### Manual Testing

#### Test reCAPTCHA Verification
1. Submit booking form with valid reCAPTCHA
2. Check server logs for verification success
3. Try submitting without reCAPTCHA (should fail)

#### Test Rate Limiting
```bash
# Send 6 requests rapidly (limit is 5)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/notion/leads \
    -H "Content-Type: application/json" \
    -d '{"test":"data"}'
done
```

Expected: First 5 succeed, 6th returns 429

#### Test Webhook Signature
```bash
# Valid signature
PAYLOAD='{"test":"data"}'
SECRET="your-secret"
SIGNATURE="sha256=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" | cut -d' ' -f2)"

curl -X POST http://localhost:3000/api/whatsapp/webhook \
  -H "Content-Type: application/json" \
  -H "x-hub-signature-256: $SIGNATURE" \
  -d "$PAYLOAD"
```

---

## Security Best Practices

### Environment Variables
- Never commit secrets to git
- Use macOS Keychain for local development
- Use Vercel environment variables for production
- Rotate secrets regularly

### Error Handling
- Don't expose internal errors to users
- Log detailed errors server-side
- Return generic error messages to clients
- Include request IDs in error responses

### Logging
- Log security events (failed verifications, rate limits)
- Include request IDs in all logs
- Don't log sensitive data (passwords, tokens, PII)
- Use structured logging for easy parsing

### Rate Limiting
- Set appropriate limits per endpoint
- Consider different limits for authenticated users
- Monitor for abuse patterns
- Implement exponential backoff for repeated violations

---

## Future Enhancements

### Short-term
- [ ] Add Sentry for error tracking
- [ ] Implement distributed rate limiting with Redis
- [ ] Add IP-based blocking for repeat offenders
- [ ] Implement CAPTCHA challenge for suspicious requests

### Long-term
- [ ] Add API key authentication for internal services
- [ ] Implement OAuth for customer portal
- [ ] Add anomaly detection for abuse patterns
- [ ] Implement request signing for sensitive operations

---

## Troubleshooting

### reCAPTCHA Verification Failing
1. Check `RECAPTCHA_SECRET_KEY` is set correctly
2. Verify secret key matches site key
3. Check Google reCAPTCHA admin console for errors
4. Ensure server can reach `www.google.com`

### Rate Limiting Too Aggressive
1. Adjust limits in API route: `{ limit: 10, windowMs: 60000 }`
2. Consider per-user limits instead of per-IP
3. Whitelist known IPs if needed

### Webhook Signature Verification Failing
1. Verify `WHATSAPP_APP_SECRET` matches Meta dashboard
2. Check webhook payload isn't modified before verification
3. Ensure using raw body (not parsed JSON)
4. Verify signature header format: `sha256=...`

### Request IDs Not Appearing
1. Check middleware is running
2. Verify `X-Request-ID` header in response
3. Check logs include request ID prefix

---

## Support

For security issues or questions:
1. Check this documentation
2. Review test files for examples
3. Check server logs with request IDs
4. Contact development team

**Never share secrets or tokens in support requests!**
