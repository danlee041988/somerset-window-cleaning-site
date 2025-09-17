# EmailJS Template Variables Reference

## Complete List of Available Variables for Advanced Template

### Customer Information
- `{{name}}` - Full customer name (first + last)
- `{{first_name}}` - Customer's first name
- `{{last_name}}` - Customer's last name
- `{{email}}` - Customer email address
- `{{phone}}` - Mobile number
- `{{mobile}}` - Alternative mobile field
- `{{postcode}}` - Property postcode
- `{{property_address}}` - Full property address
- `{{preferred_contact}}` - Email or Phone preference
- `{{customer_type}}` - new or existing (raw value)
- `{{customer_type_field}}` - "New Customer" or "Existing Customer" (formatted)

### Property Details
- `{{property_type}}` - Raw property type value
- `{{property_type_field}}` - Formatted property type (Detached, Semi-detached, etc.)
- `{{property_bedrooms}}` - Number of bedrooms
- `{{bedrooms}}` - Alternative bedrooms field
- `{{property_extension}}` - "Yes" or "No"
- `{{has_extension}}` - true/false boolean
- `{{property_conservatory}}` - "Yes" or "No"
- `{{has_conservatory}}` - true/false boolean
- `{{property_notes}}` - Additional property information/access notes

### Service Information
- `{{services}}` - Array of selected services
- `{{services_list}}` - Comma-separated list of services
- `{{services_array}}` - Array for template iteration
- `{{frequency}}` - Raw frequency value (4-weeks, 8-weeks, etc.)
- `{{cleaning_frequency}}` - Formatted frequency (Every 4 weeks, Every 8 weeks, etc.)
- `{{estimated_price}}` - Calculated window cleaning price estimate

### Customer Photos
- `{{customer_photos_count}}` - Number of photos uploaded
- `{{has_photos}}` - true/false if photos were uploaded

### Message
- `{{message}}` - Customer's additional message/requirements

### Timestamp Information
- `{{submitted_at}}` - Full timestamp (e.g., "17-09-2025 14:30:45")
- `{{submitted_date}}` - Date only (e.g., "17-09-2025")
- `{{submitted_time}}` - Time only (e.g., "14:30:45")
- `{{submission_date}}` - Alternative date field
- `{{submission_time}}` - Alternative time field
- `{{form_id}}` - Unique form submission ID

### Security & System
- `{{recaptcha_token}}` - reCAPTCHA verification token
- `{{recaptcha_score}}` - reCAPTCHA score (if using v3)
- `{{recaptcha_verified}}` - "Verified" or verification status
- `{{notion_status}}` - "Synced" or Notion submission status
- `{{notion_id}}` - Notion database record ID (if created)

### Calculated/Derived Fields
- `{{address_validated}}` - "Yes"/"No" if address was validated
- `{{in_service_area}}` - "Yes"/"No" if in service area
- `{{priority_indicator}}` - "HIGH" for new customers, "NORMAL" for existing

## Usage Examples in Template

### Conditional Display
```html
{{#message}}
<div class="message-section">
    {{message}}
</div>
{{/message}}

{{#if (eq customer_type_field "New Customer")}}
<div class="new-customer-alert">NEW LEAD - Priority Response Required</div>
{{/if}}
```

### Iterating Arrays
```html
{{#each services_array}}
<span class="service-pill">{{this}}</span>
{{/each}}
```

### Default Values
```html
{{cleaning_frequency|default:"Not specified"}}
{{estimated_price|default:"Quote required"}}
```

## Notes for Implementation

1. **Form Mapping**: Ensure your ContactForm component maps these field names correctly
2. **Data Formatting**: Format dates, prices, and booleans before sending to EmailJS
3. **Array Handling**: Convert service arrays to both comma-separated strings and arrays for flexibility
4. **Validation**: Always include reCAPTCHA token for security verification
5. **Photos**: Photo count is sent, but actual photos are stored in Notion (not emailed)

## Example Data Payload
```javascript
const templateParams = {
    // Customer
    name: `${values.first_name} ${values.last_name}`,
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email,
    phone: values.mobile,
    postcode: values.property_address,
    customer_type_field: customerType === 'new' ? 'New Customer' : 'Existing Customer',
    preferred_contact: values.preferred_contact,
    
    // Property
    property_type_field: values.property_type,
    property_bedrooms: values.bedrooms,
    property_extension: values.has_extension ? 'Yes' : 'No',
    property_conservatory: values.has_conservatory ? 'Yes' : 'No',
    property_notes: values.property_notes,
    
    // Services
    services_list: values.services.join(', '),
    services_array: values.services,
    cleaning_frequency: formatFrequency(values.frequency),
    estimated_price: calculatePrice(values),
    
    // Photos
    customer_photos_count: values.customer_photos?.length || 0,
    has_photos: values.customer_photos?.length > 0,
    
    // Message
    message: values.message,
    
    // Timestamps
    submitted_at: new Date().toLocaleString('en-GB'),
    submitted_date: new Date().toLocaleDateString('en-GB'),
    submitted_time: new Date().toLocaleTimeString('en-GB'),
    form_id: generateFormId(),
    
    // Security
    recaptcha_token: recaptchaToken,
    recaptcha_verified: 'Verified',
    notion_status: 'Synced'
}
```