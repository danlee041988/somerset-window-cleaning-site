# Manual Contact Form Test Protocol

## Quick Manual Test (5 minutes)

**URL**: http://localhost:3000/get-in-touch

### Test Data (Copy & Paste)
```
Customer Type: New Customer
First Name: Sarah
Last Name: Johnson  
Email: sarah.johnson@example.com
Phone: 07415 123456
Postcode: BA5 2SG
Contact Method: Email
Property: Terraced/Semi-detached house - 3 bedrooms
Services: ✓ Window Cleaning
Message: Please provide a quote for monthly window cleaning. Ground floor and first floor windows, Victorian terraced house.
```

### Test Steps
1. **Open Browser**: Navigate to http://localhost:3000/get-in-touch
2. **Fill Form**: Use the data above
3. **Complete reCAPTCHA**: Click the "I'm not a robot" checkbox
4. **Submit**: Click "Send" button
5. **Verify Success**: Look for success message
6. **Check Email**: Verify EmailJS delivery (if configured)

### Expected Results
- ✅ Form accepts all data
- ✅ reCAPTCHA completes successfully  
- ✅ Form submits without errors
- ✅ Success message displays
- ✅ Email sent via EmailJS (if configured)

### Troubleshooting
If reCAPTCHA fails: Check that site key `6LdI3MsrAAAAAHeRjnpkC8eduRG_tpHe_3msPbot` is configured correctly.

If EmailJS fails: Verify environment variables in `.env.local`:
- EmailJS service ID
- EmailJS public key  
- EmailJS template ID