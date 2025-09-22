import { getSiteOrigin } from '@/lib/site-url'

const normalise = (value?: string | null) => (value ? value.trim() : '')

const DEFAULT_EMAILJS_PUBLIC_KEY = 'cbA_IhBfxEeDwbEx6'
const DEFAULT_EMAILJS_SERVICE_ID = 'service_yfnr1a9'
const DEFAULT_EMAILJS_TEMPLATE_ID = 'template_booking_form'
const DEFAULT_EMAILJS_CONTACT_TEMPLATE_ID = 'template_1l08p9m'
const DEFAULT_RECAPTCHA_SITE_KEY = '6LeI-6YpAAAAALBBD4YZoBgTInHAqspiaMaAQz7f'

export const emailJsConfig = {
  publicKey: normalise(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) || DEFAULT_EMAILJS_PUBLIC_KEY,
  serviceId: normalise(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID) || DEFAULT_EMAILJS_SERVICE_ID,
  templateId: normalise(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) || DEFAULT_EMAILJS_TEMPLATE_ID,
  contactTemplateId:
    normalise(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT) || DEFAULT_EMAILJS_CONTACT_TEMPLATE_ID,
}

export const recaptchaConfig = {
  siteKey: normalise(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) || DEFAULT_RECAPTCHA_SITE_KEY,
}

export const siteConfig = {
  siteUrl: getSiteOrigin(),
  caseStudyUrl: process.env.NEXT_PUBLIC_CASE_STUDY_URL ?? ''
}
