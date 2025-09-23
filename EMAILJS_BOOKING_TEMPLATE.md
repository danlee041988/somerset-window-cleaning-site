# EmailJS Booking Template Setup

Use this checklist alongside `EMAILJS_SETUP.md` to keep the EmailJS side of the booking flow in sync with the codebase.

## Template Metadata
- **Template ID:** `template_booking_form`
- **Service ID:** `service_yfnr1a9`
- **Public Key:** `cbA_IhBfxEeDwbEx6`
- **Recipient:** Gmail account connected to EmailJS (`info@somersetwindowcleaning.co.uk`)

## Recommended Subject
```
New Quote Request – {{name}} ({{intent_label}})
```

## Core Variables to Surface
These fields now focus on preparing a manual quote rather than surfacing live pricing:

| Variable | Purpose |
| --- | --- |
| `{{summary_plaintext}}` | One string covering customer, property, services, and metadata |
| `{{services_list}}` / `{{services_json}}` | Comma list and JSON array of chosen services |
| `{{service_frequency}}` | Requested visit cadence |
| `{{manual_quote_required}}`, `{{manual_review_reason}}` | Highlights whether a follow-up quote call is needed and why |
| `{{property_extras}}` | Notes on extensions, conservatories, bespoke layouts |
| `{{commercial_type}}`, `{{commercial_services}}`, `{{commercial_notes}}` | Commercial context when relevant |
| `{{raw_payload_json}}` | Full JSON payload for CRM or audit use |
| `{{submitted_at}}`, `{{recaptcha_token}}` | Submission audit trail |

Standard contact fields (`{{customer_email}}`, `{{customer_phone}}`, etc.) remain available for the header of the email template.

## Template Body (Copy/Paste)

```html
Subject: New Quote Request – {{name}} ({{intent_label}})

<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #111; }
      .header { background:#E11D2A; color:#fff; padding:20px; text-align:center; }
      .content { padding:20px; }
      .panel { margin-bottom:20px; border:1px solid #eee; border-radius:8px; }
      .panel h3 { margin:0; padding:12px 16px; background:#fafafa; border-bottom:1px solid #eee; color:#E11D2A; }
      .panel div { padding:16px; }
      .muted { color:#666; font-size:12px; }
      pre { background:#f5f5f5; padding:16px; border-radius:6px; overflow:auto; font-size:12px; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Somerset Window Cleaning</h1>
      <p>New quote request received</p>
    </div>
    <div class="content">
      <div class="panel">
        <h3>Summary</h3>
        <div>
          <pre>{{summary_plaintext}}</pre>
        </div>
      </div>
      <div class="panel">
        <h3>Service Preferences</h3>
        <div>
          <p><strong>Frequency:</strong> {{service_frequency}}</p>
          <p><strong>Services requested:</strong> {{services_list}}</p>
          <p><strong>Manual quote required?</strong> {{manual_quote_required}}</p>
          <p><strong>Reason:</strong> {{manual_review_reason}}</p>
          <p><strong>Extras / notes:</strong> {{property_extras}}</p>
        </div>
      </div>
      <div class="panel">
        <h3>Raw submission (for CRM / debugging)</h3>
        <div>
          <pre>{{raw_payload_json}}</pre>
        </div>
      </div>
      <p class="muted">Submitted {{submitted_at}} · reCAPTCHA token: {{recaptcha_token}}</p>
    </div>
  </body>
</html>
```

Keep this template in sync with `components/BookingForm.tsx`. If you add or rename fields, update both the EmailJS template and this reference so the internal notification always reflects the live form.
