#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

type GTMEntity = { name?: string; path?: string }

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const clientId = process.env.GTM_CLIENT_ID
const clientSecret = process.env.GTM_CLIENT_SECRET
const refreshToken = process.env.GTM_REFRESH_TOKEN
const accountId = process.env.GTM_ACCOUNT_ID
const containerId = process.env.GTM_CONTAINER_ID
const workspaceId = process.env.GTM_WORKSPACE_ID

if (!clientId || !clientSecret || !refreshToken || !accountId || !containerId || !workspaceId) {
  throw new Error('Missing GTM_* env vars. Ensure Keychain exports are loaded.')
}

const apiBase = `https://www.googleapis.com/tagmanager/v2/accounts/${accountId}/containers/${containerId}`

async function getAccessToken(): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId!,
      client_secret: clientSecret!,
      refresh_token: refreshToken!,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to refresh GTM access token: ${response.status} ${response.statusText}`)
  }

  const json = (await response.json()) as { access_token?: string }
  if (!json.access_token) throw new Error('No access_token in refresh response')
  return json.access_token
}

async function gtmFetch<T>(token: string, url: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`GTM API ${response.status} ${response.statusText}: ${body}`)
  }

  if (response.status === 204) {
    return {} as T
  }

  return (await response.json()) as T
}

async function listEntities<T extends GTMEntity>(
  token: string,
  resource: 'tags' | 'triggers' | 'variables',
): Promise<T[]> {
  const url = `${apiBase}/workspaces/${workspaceId}/${resource}`
  const data = await gtmFetch<{ [key: string]: T[] }>(token, url)
  const key = resource.slice(0, -1) // tag, trigger, variable
  return (data[resource] || data[key] || []) as T[]
}

async function createEntity<T extends Record<string, unknown>>(
  token: string,
  resource: 'tags' | 'triggers' | 'variables',
  payload: T,
) {
  const url = `${apiBase}/workspaces/${workspaceId}/${resource}`
  const response = await gtmFetch<Record<string, unknown>>(token, url, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
  return response
}

async function updateEntity<T extends Record<string, unknown>>(
  token: string,
  entityPath: string,
  payload: T,
) {
  const url = `https://www.googleapis.com/tagmanager/v2/${entityPath}`
  return gtmFetch<Record<string, unknown>>(token, url, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

async function createVersion(token: string, name: string, notes: string) {
  const url = `${apiBase}/workspaces/${workspaceId}:create_version`
  const body = {
    name,
    notes,
  }
  const response = await gtmFetch<any>(token, url, {
    method: 'POST',
    body: JSON.stringify({
      name,
      notes,
    }),
  })

  return response?.containerVersion?.containerVersionId as string | undefined
}

async function publishVersion(token: string, versionId: string) {
  const url = `${apiBase}/versions/${versionId}:publish`
  await gtmFetch(token, url, { method: 'POST' })
}

function loadContainerTemplate() {
  const filePath = path.join(__dirname, '..', 'docs', 'ads', 'gtm-import-lead-conversions.json')
  const raw = fs.readFileSync(filePath, 'utf8')
  const parsed = JSON.parse(raw)
  if (!parsed.containerVersion) {
    throw new Error('containerVersion missing from template JSON')
  }
  return parsed.containerVersion as {
    tag?: any[]
    trigger?: any[]
    variable?: any[]
  }
}

function sanitize<T extends Record<string, unknown>>(obj: T, omit: string[]): T {
  const clone: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (omit.includes(key)) continue
    clone[key] = value
  }
  return clone as T
}

async function syncWorkspace(token: string) {
  const template = loadContainerTemplate()
  const [existingVariables, existingTriggers, existingTags] = await Promise.all([
    listEntities(token, 'variables'),
    listEntities(token, 'triggers'),
    listEntities(token, 'tags'),
  ])
  const existingVariableByName = new Map<string, any>()
  existingVariables.forEach((variable) => {
    if (variable.name) existingVariableByName.set(variable.name, variable)
  })

  const existingTriggerByName = new Map<string, any>()
  existingTriggers.forEach((trigger) => {
    if (trigger.name) existingTriggerByName.set(trigger.name, trigger)
  })

  const existingTagByName = new Map<string, any>()
  existingTags.forEach((tag) => {
    if (tag.name) existingTagByName.set(tag.name, tag)
  })

  const variableIdMap = new Map<string, string>()
  for (const variable of template.variable || []) {
    const payload = sanitize(variable, ['variableId', 'accountId', 'containerId', 'workspaceId', 'path'])
    const existing = variable.name ? existingVariableByName.get(variable.name) : null
    if (existing?.path) {
      console.log(`   Updating variable ${variable.name}`)
      await updateEntity(token, existing.path, { ...payload, fingerprint: existing.fingerprint })
      if (variable.variableId && existing.variableId) {
        variableIdMap.set(String(variable.variableId), String(existing.variableId))
      }
    } else {
      console.log(`   Creating variable ${variable.name}`)
      const created = await createEntity(token, 'variables', payload)
      if (variable.variableId && created.variableId) {
        variableIdMap.set(String(variable.variableId), String(created.variableId))
      }
    }
  }

  const triggerIdMap = new Map<string, string>()
  for (const trigger of template.trigger || []) {
    const payload = sanitize(trigger, ['triggerId', 'accountId', 'containerId', 'workspaceId', 'path'])
    const existing = trigger.name ? existingTriggerByName.get(trigger.name) : null
    if (existing?.path) {
      console.log(`   Updating trigger ${trigger.name}`)
      await updateEntity(token, existing.path, { ...payload, fingerprint: existing.fingerprint })
      if (trigger.triggerId && existing.triggerId) {
        triggerIdMap.set(String(trigger.triggerId), String(existing.triggerId))
      }
    } else {
      console.log(`   Creating trigger ${trigger.name}`)
      const created = await createEntity(token, 'triggers', payload)
      if (trigger.triggerId && created.triggerId) {
        triggerIdMap.set(String(trigger.triggerId), String(created.triggerId))
      }
    }
  }

  for (const rawTag of template.tag || []) {
    const payload = sanitize(rawTag, [
      'tagId',
      'accountId',
      'containerId',
      'workspaceId',
      'path',
      'tagManagerUrl',
      'accountId',
      'fingerprint',
      'scheduleEndMs',
      'scheduleStartMs',
    ])

    if (Array.isArray(payload.firingTriggerId)) {
      payload.firingTriggerId = payload.firingTriggerId.map((original: string) =>
        triggerIdMap.get(String(original)) || original,
      )
    }

    const existing = payload.name ? existingTagByName.get(payload.name) : null
    if (existing?.path) {
      console.log(`   Updating tag ${payload.name}`)
      await updateEntity(token, existing.path, { ...payload, fingerprint: existing.fingerprint })
    } else {
      console.log(`   Creating tag ${payload.name}`)
      await createEntity(token, 'tags', payload)
    }
  }
}

async function main() {
  const token = await getAccessToken()

  await syncWorkspace(token)

  const versionName = `Automated sync ${new Date().toISOString()}`
  console.log('Creating container version...')
  const versionId = await createVersion(token, versionName, 'Synced via scripts/gtm-sync-container.ts')
  if (!versionId) {
    throw new Error('Failed to create GTM container version')
  }

  console.log(`Publishing version ${versionId}...`)
  await publishVersion(token, versionId)

  console.log(`✅ GTM container synced and published (version ${versionId}).`)
}

main().catch((error) => {
  console.error('❌ GTM sync failed:')
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
