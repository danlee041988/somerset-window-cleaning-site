# EmailJS Booking Template Setup

Use this checklist alongside `EMAILJS_SETUP.md` to keep the EmailJS side of the booking flow in sync with the codebase.

## Template Metadata
- **Template ID:** `template_booking_form`
- **Service ID:** `service_yfnr1a9`
- **Public Key:** `cbA_IhBfxEeDwbEx6`
- **Recipient:** Gmail account connected to EmailJS (`info@somersetwindowcleaning.co.uk`)

## Recommended Subject
```
New Booking – {{name}} ({{customer_type_field}})
```

## Core Variables to Surface
These variables give you a complete view of every submission:

| Variable | Purpose |
| --- | --- |
| `{{summary_plaintext}}` | Single string summarising customer, property, services, pricing, and metadata |
| `{{services_list}}` / `{{services_json}}` | Comma list and raw JSON array of chosen services |
| `{{service_frequency}}` | Requested visit cadence |
| `{{preferred_date_label}}` | Human readable slot or "Manual scheduling required" |
| `{{pricing_total}}`, `{{pricing_breakdown}}`, `{{pricing_discount_note}}` | Pricing insights assembled in the UI |
| `{{frequency_match}}`, `{{frequency_service_days}}`, `{{coverage_label}}` | Route coverage diagnostics |
| `{{raw_payload_json}}` | Full JSON snapshot if you need every raw field |
| `{{submitted_at}}`, `{{recaptcha_token}}` | Audit trail | 

> The template also receives the basic contact details (`{{name}}`, `{{email}}`, `{{phone}}`, `{{customer_type_field}}`, etc.) so you can display them anywhere you prefer.

## Template Body (Copy/Paste)

```html
Subject: New Booking – {{name}} ({{customer_type_field}})

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
      <p>New booking request received</p>
    </div>
    <div class="content">
      <div class="panel">
        <h3>Summary</h3>
        <div>
          <pre>{{summary_plaintext}}</pre>
        </div>
      </div>
      <div class="panel">
        <h3>Pricing</h3>
        <div>
          <p><strong>Total:</strong> {{pricing_total}}</p>
          <p><strong>Breakdown:</strong><br/>{{pricing_breakdown}}</p>
          {{#pricing_discount_note}}
            <p><strong>Discounts:</strong> {{pricing_discount_note}}</p>
          {{/pricing_discount_note}}
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

Update the template in EmailJS whenever you change the fields inside `components/BookingForm.tsx`. Keep the subject and summary aligned with the live form so every internal email surfaces the data you expect.
