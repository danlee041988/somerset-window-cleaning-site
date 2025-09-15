import type { MetadataRoute } from 'next'

const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/services`, lastModified },
    { url: `${base}/get-in-touch`, lastModified },
    { url: `${base}/gallery`, lastModified },
    { url: `${base}/about`, lastModified },
    { url: `${base}/team`, lastModified },
    { url: `${base}/privacy`, lastModified },
  ]
}
