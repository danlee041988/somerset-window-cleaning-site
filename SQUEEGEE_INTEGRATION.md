# Squeegee Integration Enhancement

## Overview
Enhanced the Somerset Window Cleaning website's Notion integration to include Squeegee workflow tracking with Customer Reference Numbers and precise date/time tracking.

## New Features Added

### 1. Customer Reference Number Field
- **Purpose**: Manual entry field for Squeegee system reference numbers
- **Type**: Rich text field in Notion
- **Default**: Empty (ready for manual input)
- **Usage**: Staff manually enters the Squeegee number after processing

### 2. Date & Time Submitted (UK Format)
- **Purpose**: Precise timestamp of when customer submitted the form
- **Type**: Rich text field in Notion
- **Format**: UK format DD-MM-YYYY HH:MM (e.g., 17-09-2025 01:37)
- **Auto-populated**: Automatically filled when form is submitted

### 3. Squeegee Status Tracking
- **Purpose**: Workflow tracking through Squeegee processing stages
- **Type**: Select field with predefined options
- **Options**:
  - 🔴 **Not Processed** (Default - newly submitted)
  - 🔵 **In Squeegee** (Being processed in Squeegee system)
  - 🟢 **Filed in Squeegee** (Completed and filed)

### 4. Services & Agreed Prices
- **Purpose**: Track agreed pricing for each customer's services
- **Type**: Rich text field in Notion
- **Default**: Empty (ready for manual entry after quoting)
- **Usage**: Staff enters agreed prices after providing customer quote

## Database Schema Enhancement

### Before Enhancement
- Name, Email, Phone, Postcode
- Property Type, Services, Customer Type
- Status, Date Added, Notes

### After Enhancement
- ✅ All previous fields retained
- ➕ **Customer Reference Number** (Rich text)
- ➕ **Date & Time Submitted (UK Format)** (Date/time with UK format)
- ➕ **Squeegee Status** (Select with workflow options)
- ➕ **Services & Agreed Prices** (Rich text for manual pricing entry)

## Business Workflow

### 1. Customer Submits Form
- Website form captures all customer data
- **Date & Time Submitted (UK Format)**: Auto-populated with UK format timestamp (DD-MM-YYYY HH:MM)
- **Squeegee Status**: Set to "Not Processed"
- **Customer Reference Number**: Empty (ready for manual entry)

### 2. Staff Processing & Quoting
- Review new leads in Notion database
- Filter by "Squeegee Status = Not Processed"
- Review customer requirements and property details
- Calculate and provide quote to customer
- **Action**: Enter agreed pricing in "Services & Agreed Prices" field
  - Format: Service Name: £Price (e.g., "Window Cleaning: £25, Gutter Clearing: £80")
- **Action**: Enter Squeegee reference number in "Customer Reference Number" field
- **Action**: Update "Squeegee Status" to "In Squeegee"

### 3. Squeegee Filing Complete
- Once fully processed and filed in Squeegee
- **Action**: Update "Squeegee Status" to "Filed in Squeegee"
- Customer record now fully tracked from inquiry to completion

## Technical Implementation

### Database Changes
```javascript
// New properties added to Notion database
'Customer Reference Number': {
  rich_text: {}
},
'Date & Time Submitted (UK Format)': {
  rich_text: {}
},
'Squeegee Status': {
  select: {
    options: [
      { name: 'Not Processed', color: 'red' },
      { name: 'In Squeegee', color: 'blue' },
      { name: 'Filed in Squeegee', color: 'green' }
    ]
  }
},
'Services & Agreed Prices': {
  rich_text: {}
}
```

### API Route Updates
```javascript
// Auto-populated fields in API route
'Date & Time Submitted (UK Format)': {
  rich_text: [
    {
      text: {
        content: (() => {
          const now = new Date()
          const day = now.getDate().toString().padStart(2, '0')
          const month = (now.getMonth() + 1).toString().padStart(2, '0')
          const year = now.getFullYear()
          const hours = now.getHours().toString().padStart(2, '0')
          const minutes = now.getMinutes().toString().padStart(2, '0')
          return `${day}-${month}-${year} ${hours}:${minutes}` // UK format
        })()
      }
    }
  ]
},
'Customer Reference Number': {
  rich_text: [
    {
      text: {
        content: '' // Empty by default
      }
    }
  ]
},
'Squeegee Status': {
  select: {
    name: 'Not Processed' // Default status
  }
},
'Services & Agreed Prices': {
  rich_text: [
    {
      text: {
        content: '' // Empty by default - filled manually after quoting
      }
    }
  ]
}
```

## Benefits

### 1. Complete Audit Trail
- Exact timestamp of customer inquiry
- Clear workflow status tracking
- Reference number linking to Squeegee system

### 2. Improved Workflow Management
- Easy identification of unprocessed leads
- Clear status progression through workflow
- No lost or forgotten customer inquiries

### 3. Enhanced Customer Service
- Quick lookup by Squeegee reference number
- Complete history from initial inquiry to completion
- Better follow-up and status tracking

### 4. Business Intelligence
- Time-based analytics on inquiry patterns
- Workflow efficiency tracking
- Processing time measurements

### 5. Pricing Management & Profitability
- Track agreed pricing for each customer and service
- Monitor pricing trends and profitability analysis
- Quick reference for repeat customer pricing
- Accurate invoicing with agreed service prices
- Identify most profitable services and customer types

## Usage Instructions

### For Staff Processing New Inquiries:
1. **View New Leads**: Filter Notion database by "Squeegee Status = Not Processed"
2. **Review Requirements**: Check customer details, property size, and requested services
3. **Calculate Quote**: Provide quote based on property specifics and service requirements
4. **Enter Agreed Pricing**: Add pricing to "Services & Agreed Prices" field:
   - Format: "Window Cleaning: £25, Gutter Clearing: £80, Total: £105"
5. **Enter Reference**: Add Squeegee number to "Customer Reference Number" field
6. **Update Status**: Change "Squeegee Status" to "In Squeegee"
7. **Complete Processing**: When filed, change status to "Filed in Squeegee"

### For Customer Lookup:
1. **By Name/Email**: Search using customer contact details
2. **By Reference**: Search using "Customer Reference Number" field
3. **By Status**: Filter by current Squeegee status
4. **By Date**: Sort by "Date & Time Submitted (UK Format)" for chronological view
5. **By Pricing**: Review "Services & Agreed Prices" for quote history and profitability

## Verification

The enhancement has been fully tested and verified:
- ✅ Database fields successfully added
- ✅ API route updated to populate new fields
- ✅ Form submissions create complete records
- ✅ Workflow tracking operational
- ✅ Manual reference number entry ready

## Files Modified

- `scripts/add-squeegee-fields.cjs` - Database enhancement script
- `app/api/notion-direct/route.ts` - API route updates
- `scripts/test-squeegee-integration.cjs` - Comprehensive testing

## Result

Somerset Window Cleaning now has a complete customer management system that tracks every inquiry from initial website submission through to final Squeegee filing, with precise timestamps, reference number tracking, and comprehensive pricing management for full business workflow integration and profitability analysis.