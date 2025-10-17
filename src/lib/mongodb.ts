import { MongoClient } from 'mongodb'

let client: MongoClient | null = null

export async function getMongoClient() {
  if (client) return client
  const uri = process.env.MONGO_URI
  if (!uri) throw new Error('MONGO_URI not set')
  client = new MongoClient(uri)
  await client.connect()
  return client
}

function parseDbNameFromUri(uri: string) {
  try {
    const parts = uri.split('/')
    const last = parts[parts.length - 1]
    if (!last) return null
    // strip query params
    return last.split('?')[0]
  } catch (e) {
    return null
  }
}

export async function getDb(dbName?: string) {
  const c = await getMongoClient()
  let name = dbName || process.env.MONGO_DB
  if (!name) {
    const uri = process.env.MONGO_URI || ''
    name = parseDbNameFromUri(uri) || 'trading_sim'
  }
  return c.db(name)
}
