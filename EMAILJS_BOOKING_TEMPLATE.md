# EmailJS Booking Template Setup

## Template ID: `template_booking_form`

### Subject Line:
```
New Appointment Booking Request - {{service}} on {{booking_date}}
```

### Template Content:
```
New Appointment Booking Request

Customer Information:
- Name: {{name}}
- Email: {{email}}
- Phone: {{phone}}
- Customer Type: {{customer_type_field}}

Property Details:
- Address: {{address}}

Service Details:
- Service: {{service}}
- Preferred Date: {{booking_date}}
- Preferred Time: {{booking_time}}

Special Requirements:
{{requirements}}

Form Details:
- Submitted: {{submitted_at}}
- reCAPTCHA: Verified

---
This booking request was submitted through the Somerset Window Cleaning website booking form.
```

### Variables Used:
- `{{name}}` - Customer's full name
- `{{email}}` - Customer's email address  
- `{{phone}}` - Customer's phone number
- `{{address}}` - Property address
- `{{service}}` - Selected service type
- `{{booking_date}}` - Preferred appointment date
- `{{booking_time}}` - Preferred appointment time
- `{{requirements}}` - Special requirements (optional)
- `{{customer_type_field}}` - New Customer / Existing Customer
- `{{submitted_at}}` - Submission timestamp
- `{{recaptcha_token}}` - reCAPTCHA verification token

### Setup Instructions:

1. **Login to EmailJS Dashboard**: https://www.emailjs.com/
2. **Go to Email Templates**
3. **Create New Template** with ID: `template_booking_form`
4. **Set Subject**: `New Appointment Booking Request - {{service}} on {{booking_date}}`
5. **Add Template Content** (above)
6. **Test the template** with sample data
7. **Save the template**

### Current Configuration:
- Service ID: `service_yfnr1a9`
- Public Key: `cbA_IhBfxEeDwbEx6`
- Template ID: `template_booking_form`

The booking form will automatically send emails using this template when customers submit appointment requests.