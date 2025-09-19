export const emailJsConfig = {
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? '',
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''
}

export const recaptchaConfig = {
  siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? ''
}

export const notionConfig = {
  apiKey: process.env.NOTION_API_KEY ?? '',
  databaseId: process.env.NOTION_DATABASE_ID ?? '',
  dataSourceId: process.env.NOTION_DATA_SOURCE_ID ?? ''
}

export const siteConfig = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  caseStudyUrl: process.env.NEXT_PUBLIC_CASE_STUDY_URL ?? ''
}
