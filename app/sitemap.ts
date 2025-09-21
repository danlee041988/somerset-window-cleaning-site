import type { MetadataRoute } from 'next'
import { buildAbsoluteUrl, getSiteUrl } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const lastModified = new Date()
  const toEntry = (path: string) => ({ url: buildAbsoluteUrl(path, base), lastModified })

  return [
    toEntry('/'),
    toEntry('/services'),
    toEntry('/areas'),
    toEntry('/book-appointment'),
    toEntry('/gallery'),
    toEntry('/about'),
    toEntry('/team'),
    toEntry('/privacy'),
  ]
}
