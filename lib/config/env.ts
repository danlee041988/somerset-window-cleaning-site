export const emailJsConfig = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
  contactTemplateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID_CONTACT ?? ''
}

export const recaptchaConfig = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
}

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  caseStudyUrl: process.env.NEXT_PUBLIC_CASE_STUDY_URL ?? ''
}
