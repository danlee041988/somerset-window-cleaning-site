# Measurement & Tagging Notes

## DataLayer Events (site already emits)
| Event | Description | Payload keys |
| --- | --- | --- |
| `booking_form_submit` | Quote request form submitted | `service_list`, `property_size`, `frequency_label`, `customer_type`, `intent`, `manual_review`, `property_category`, `first_name`, `last_name`, `email`, `phone`, `postcode` |
| `contact_form_submit` | Get In Touch form submitted successfully | `service_interest`, `customer_type`, `first_name`, `last_name`, `email`, `phone`, `message_length` |
| `phone_click` | Tel link click (source tracked across site) | `source` |

## Google Ads Conversion Setup via GTM (`GTM-WX8SLXJV`)
### Google Ads Conversion IDs
| Name | ID | Notes |
| --- | --- | --- |
| Lead - Quote Form | 7315784824 | Triggered by `booking_form_submit` |
| Lead - Contact Form | 7316082381 | Triggered by `contact_form_submit` |
| Lead - Phone Click (Website) | 7316082384 | Triggered by `phone_click` |


1. **Quote Form Lead**
   - Trigger: Custom Event `booking_form_submit`
   - Conversion value: defaults to 0 (adjust in Ads if you want to assign a monetary lead value).
   - Enhanced Conversions: map `email`, `phone`, `first_name`, `last_name`, `postcode` (pull from the form or add new data layer variables if required).
2. **Contact Form Lead**
   - Trigger: Custom Event `contact_form_submit`
   - Value: static (e.g. £0) or set in Ads.
   - Enhanced Conversions: same fields as above.
3. **Phone Click (site)**
   - Trigger: Custom Event `phone_click` (optionally filter sources if needed).
   - No value or set custom value (e.g. £0).
4. **Call extension (Ads UI)**
   - Minimum duration: 45s.
   - Schedule: Mon–Fri 09:00–16:00.

## Enhanced Conversions Mapping
| Form field | Ads EC field |
| --- | --- |
| `email` | `user_data.email_address` |
| `phone` | `user_data.phone_number` |
| `first_name` | `user_data.first_name` |
| `last_name` | `user_data.last_name` |
| `postcode` | `user_data.address.postal_code` |

## Testing Checklist
- Tag Assistant preview → submit test form → confirm dataLayer events and GA conversions fire.
- Clear test conversions from Ads once validated.
- Confirm GA4 still records events (optional but recommended for analytics).

Use this doc when configuring GTM and Google Ads conversions.

### Workspace Import
- After import, open each conversion tag and tick “Send enhanced conversions” if desired (map fields to the data layer variables).

- Download `docs/ads/gtm-import-lead-conversions.json`.
- In GTM (`GTM-WX8SLXJV`), go to Admin → Import Container.
- Choose the JSON, select *Merge* → *Overwrite conflicting*, import into Default Workspace (or a staging workspace).
- Check that six data layer variables, three triggers, and three Google Ads tags are added.
- Preview, test (forms + phone), then Submit/Publish.
