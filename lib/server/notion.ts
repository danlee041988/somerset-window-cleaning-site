import { Client } from '@notionhq/client'

declare global {
  // eslint-disable-next-line no-var
  var __notionClient: Client | null | undefined
}

export const getNotionClient = (): Client | null => {
  const token = process.env.NOTION_API_TOKEN
  if (!token) {
    return null
  }

  if (!global.__notionClient) {
    global.__notionClient = new Client({ auth: token })
  }

  return global.__notionClient
}

export const getWebsiteCustomersDatabaseId = (): string => {
  return (process.env.NOTION_WEBSITE_CUSTOMERS_DB_ID || '').trim()
}
