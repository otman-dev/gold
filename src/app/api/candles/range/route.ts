import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const symbol = url.searchParams.get('symbol') || ''
  const interval = url.searchParams.get('interval') || ''
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')

  const db = await getDb()
  const coll = db.collection('candles')
  const q: any = {}
  if (symbol) q.symbol = symbol
  if (interval) q.interval = interval
  if (from || to) q.OpenTime = {}
  if (from) q.OpenTime.$gte = new Date(from)
  if (to) q.OpenTime.$lte = new Date(to)

  const docs = await coll.find(q).sort({ OpenTime: 1 }).toArray()
  return NextResponse.json(docs)
}
