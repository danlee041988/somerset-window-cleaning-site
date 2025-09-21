export const DEFAULT_SITE_URL = 'https://somersetwindowcleaning.co.uk'

const isLocalHostname = (hostname: string) => {
  const value = hostname.toLowerCase()
  return (
    value === 'localhost' ||
    value === '127.0.0.1' ||
    value.endsWith('.local')
  )
}

const normaliseUrl = (raw?: string | null): URL => {
  if (!raw) {
    return new URL(DEFAULT_SITE_URL)
  }

  try {
    const url = new URL(raw)
    if (isLocalHostname(url.hostname)) {
      return new URL(DEFAULT_SITE_URL)
    }

    if (url.protocol !== 'https:') {
      url.protocol = 'https:'
    }

    url.hash = ''
    url.search = ''

    if (!url.pathname || url.pathname === '/') {
      url.pathname = '/'
    }

    return url
  } catch (error) {
    return new URL(DEFAULT_SITE_URL)
  }
}

export const getSiteUrl = (raw?: string | null): URL => normaliseUrl(raw ?? process.env.NEXT_PUBLIC_SITE_URL)

export const getSiteOrigin = (): string => {
  const url = getSiteUrl()
  return url.origin
}

export const buildAbsoluteUrl = (path = '/', baseUrl?: URL): string => {
  const base = baseUrl ?? getSiteUrl()
  const normalisedPath = path.startsWith('/') ? path : `/${path}`
  return new URL(normalisedPath, base).toString()
}
