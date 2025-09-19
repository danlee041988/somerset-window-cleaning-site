# EmailJS Template Setup Guide

## Booking Template Configuration

The Somerset Window Cleaning booking form sends its data to EmailJS using the template ID `template_booking_form`. Make sure this template exists in your EmailJS dashboard before testing the live form.

1. Sign in to [EmailJS](https://dashboard.emailjs.com/)
2. Navigate to **Email Templates**
3. Create or edit a template with the ID `template_booking_form`
4. Paste in the recommended template below (or adapt it) so every field we send is visible
5. Save the template and run the EmailJS test preview to confirm the output

## Key Template Variables

The form now transmits a comprehensive payload. The variables most teams surface in the email body are:

- `{{summary_plaintext}}` – human-readable overview of every field (customer, property, services, pricing, metadata)
- `{{name}}`, `{{first_name}}`, `{{last_name}}`
- `{{email}}`, `{{phone}}`, `{{preferred_contact_method}}`
- `{{address}}`, `{{postcode}}`
- `{{customer_type_field}}` – "New Customer" / "Existing Customer"
- `{{services_list}}` – comma separated list, and `{{services_json}}` for raw JSON
- `{{service_frequency}}`
- `{{preferred_date_label}}` and `{{preferred_date}}`
- `{{intent_label}}`
- `{{bedroom_label}}`, `{{property_type_label}}`, `{{has_extension_label}}`, `{{has_conservatory_label}}`
- `{{frequency_match}}`, `{{frequency_service_days}}`, `{{coverage_label}}`
- `{{pricing_total}}`, `{{pricing_breakdown}}`, `{{pricing_discount_note}}`, `{{pricing_lines_json}}`
- `{{special_requirements}}`
- `{{submitted_at}}`, `{{submitted_date}}`, `{{submitted_time}}`
- `{{recaptcha_token}}`
- `{{raw_payload_json}}` – complete JSON snapshot of the submission (good for archiving/debugging)

Anything else you add to the template will inherit values from the payload we send.

## Recommended Template Markup

```html
Subject: New Booking - {{name}} ({{customer_type_field}})

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
        <h3>At a glance</h3>
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
        <h3>Raw submission</h3>
        <div>
          <pre>{{raw_payload_json}}</pre>
        </div>
      </div>
      <p class="muted">Submitted at {{submitted_at}} · reCAPTCHA token: {{recaptcha_token}}</p>
    </div>
  </body>
</html>
```

Feel free to expand the template with additional sections using any of the variables listed above.

## Environment Variables

Ensure the following are defined locally (`.env.local`) and in your hosting platform (Vercel):

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_yfnr1a9
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=cbA_IhBfxEeDwbEx6
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_booking_form
```

## Testing Checklist

1. Save the template in EmailJS and use their **Send test email** button to check formatting
2. Run `npm run dev`, complete the booking form, and submit a test entry
3. Confirm the email arrives at `info@somersetwindowcleaning.co.uk` with every section populated
4. Review the raw JSON block if you need to double-check any missing fields

## Security Notes

- The frontend still includes honeypot, submission timing, and reCAPTCHA checks before an email is sent
- Keep the EmailJS public key, service ID, and template ID out of source control by using environment variables
- Rotate the EmailJS secret/private key via the dashboard if you suspect it has been exposed
