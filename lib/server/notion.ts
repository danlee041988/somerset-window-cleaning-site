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
      // Use latest API version for data_source support
      notionVersion: '2025-09-03'
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
    return global.__notionDataSourceId
  }

  try {
    // Fetch database to get data sources
    const database = await notion.databases.retrieve({ database_id: databaseId })

    // Get first data source (most databases have only one)
    if (database.data_sources && database.data_sources.length > 0) {
      global.__notionDataSourceId = database.data_sources[0].id
      return global.__notionDataSourceId
    }

    return null
  } catch (error) {
    console.error('Failed to get Notion data source ID:', error)
    return null
  }
}
