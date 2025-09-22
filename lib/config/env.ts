import { getSiteOrigin } from '@/lib/site-url'

const normalise = (value?: string | null) => (value ? value.trim() : '')

export const emailJsConfig = {
  publicKey: normalise(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY),
  serviceId: normalise(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID),
  templateId: normalise(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID),
  contactTemplateId: normalise(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT),
}

export const recaptchaConfig = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
}

export const siteConfig = {
  siteUrl: getSiteOrigin(),
  caseStudyUrl: process.env.NEXT_PUBLIC_CASE_STUDY_URL ?? ''
}
