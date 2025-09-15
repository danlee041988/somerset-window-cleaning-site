# EmailJS Template Setup Guide

## Email Template Configuration

To complete your EmailJS setup, you need to create an email template in your EmailJS dashboard with the template ID: `template_contact_form`

### Template Variables

Your contact form sends the following variables that should be included in your email template:

#### Customer Information
- `{{name}}` - Full name (first + last name)
- `{{email}}` - Customer email address
- `{{phone}}` - Mobile number
- `{{postcode}}` - Property postcode
- `{{preferred_contact}}` - Email or Phone

#### Property Details
- `{{property_type_field}}` - Type of property (detached, semi-detached, etc.)
- `{{property_bedrooms}}` - Number of bedrooms
- `{{property_extension}}` - Has extension (Yes/No)
- `{{property_conservatory}}` - Has conservatory (Yes/No)
- `{{property_notes}}` - Additional property information

#### Service Requirements
- `{{services_list}}` - Comma-separated list of requested services
- `{{cleaning_frequency}}` - How often for window cleaning (if selected)

#### Additional Information
- `{{message}}` - Customer's additional message/requirements
- `{{customer_type_field}}` - New Customer or Existing Customer
- `{{submitted_at}}` - Full timestamp of submission
- `{{submitted_date}}` - Date of submission
- `{{submitted_time}}` - Time of submission
- `{{recaptcha_token}}` - reCAPTCHA verification token (for security)

## Recommended Email Template

```html
Subject: New Customer Enquiry - {{name}} ({{customer_type_field}})

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #E11D2A; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #E11D2A; border-bottom: 2px solid #E11D2A; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .footer { background-color: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Somerset Window Cleaning</h1>
        <p>New Customer Enquiry Received</p>
    </div>
    
    <div class="content">
        <div class="section">
            <h3>Customer Information</h3>
            <div class="info-grid">
                <p><strong>Name:</strong> {{name}}</p>
                <p><strong>Email:</strong> {{email}}</p>
                <p><strong>Phone:</strong> {{phone}}</p>
                <p><strong>Postcode:</strong> {{postcode}}</p>
                <p><strong>Customer Type:</strong> {{customer_type_field}}</p>
                <p><strong>Preferred Contact:</strong> {{preferred_contact}}</p>
            </div>
        </div>

        <div class="section">
            <h3>Property Details</h3>
            <div class="info-grid">
                <p><strong>Property Type:</strong> {{property_type_field}}</p>
                <p><strong>Bedrooms:</strong> {{property_bedrooms}}</p>
                <p><strong>Has Extension:</strong> {{property_extension}}</p>
                <p><strong>Has Conservatory:</strong> {{property_conservatory}}</p>
            </div>
            {{#property_notes}}
            <p><strong>Property Notes:</strong> {{property_notes}}</p>
            {{/property_notes}}
        </div>

        <div class="section">
            <h3>Service Requirements</h3>
            <p><strong>Requested Services:</strong> {{services_list}}</p>
            {{#cleaning_frequency}}
            <p><strong>Window Cleaning Frequency:</strong> {{cleaning_frequency}}</p>
            {{/cleaning_frequency}}
        </div>

        {{#message}}
        <div class="section">
            <h3>Additional Message</h3>
            <p>{{message}}</p>
        </div>
        {{/message}}
    </div>

    <div class="footer">
        <p>Submitted: {{submitted_at}}</p>
        <p>reCAPTCHA Verified: {{recaptcha_token}}</p>
        <p>Please respond within 1 working day as promised on the website.</p>
    </div>
</body>
</html>
```

## Setup Steps

1. **Login to EmailJS Dashboard** at https://www.emailjs.com/
2. **Go to Email Templates** section
3. **Create New Template** with ID: `template_contact_form`
4. **Copy the HTML template** above into the template editor
5. **Test the template** using EmailJS test feature
6. **Save the template**

## Email Service Configuration

Make sure your email service (Gmail, Outlook, etc.) is properly configured in EmailJS with the service ID: `service_yfnr1a9`

## Environment Variables

Your `.env.local` file has been configured with:
- `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=cbA_IhBfxEeDwbEx6`
- `NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_yfnr1a9`
- `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_contact_form`

## Testing

After setting up the template:
1. Fill out the contact form on your website
2. Submit the form
3. Check your email for the formatted enquiry
4. Verify all form fields are populated correctly

## Security Features

The form includes several security measures:
- **Honeypot field** to catch bots
- **Time-based validation** to prevent rapid submissions
- **Client-side validation** for all required fields
- **CSRF protection** through form referrer checking