import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const symbol = url.searchParams.get('symbol') || ''
  const interval = url.searchParams.get('interval') || ''
  const limit = parseInt(url.searchParams.get('limit') || '100', 10)

  const db = await getDb()
  const coll = db.collection('candles')
  const q: any = {}
  if (symbol) q.symbol = symbol
  if (interval) q.interval = interval
  const docs = await coll.find(q).sort({ OpenTime: -1 }).limit(limit).toArray()
  return NextResponse.json(docs)
}
