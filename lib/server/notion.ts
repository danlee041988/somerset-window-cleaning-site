import { Client } from '@notionhq/client'

declare global {
  // eslint-disable-next-line no-var
  var __notionClient: Client | null | undefined
  // eslint-disable-next-line no-var
  var __notionDataSourceId: string | null | undefined
}

export const getNotionClient = (): Client | null => {
  const token = process.env.NOTION_API_TOKEN
  if (!token) {
    return null
  }

  if (!global.__notionClient) {
    global.__notionClient = new Client({
      auth: token,
      // Use stable API version
      notionVersion: '2022-06-28'
    })
  }

  return global.__notionClient
}

export const getWebsiteCustomersDatabaseId = (): string => {
  return (process.env.NOTION_WEBSITE_CUSTOMERS_DB_ID || '').trim()
}

/**
 * Get the data source ID for the website customers database.
 * Required for Notion API version 2025-09-03+
 * Caches the result globally to avoid repeated API calls.
 */
export const getWebsiteCustomersDataSourceId = async (): Promise<string | null> => {
  const notion = getNotionClient()
  const databaseId = getWebsiteCustomersDatabaseId()

  if (!notion || !databaseId) {
    return null
  }

  // Return cached data source ID if available
  if (global.__notionDataSourceId) {
    return global.__notionDataSourceId ?? null
  }

  try {
    // Fetch database to get data sources
    const database = await notion.databases.retrieve({ database_id: databaseId })

    // Get first data source (most databases have only one)
    // @ts-ignore - data_sources property exists at runtime but not in types
    if (database.data_sources && database.data_sources.length > 0) {
      // @ts-ignore
      global.__notionDataSourceId = database.data_sources[0].id || null
      return global.__notionDataSourceId ?? null
    }

    return null
  } catch (error) {
    console.error('Failed to get Notion data source ID:', error)
    return null
  }
}
