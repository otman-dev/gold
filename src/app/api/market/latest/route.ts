import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const symbol = url.searchParams.get('symbol') || ''
  const db = await getDb()
  const coll = db.collection('candles')
  const q: any = {}
  if (symbol) q.symbol = symbol
  const doc = await coll.find(q).sort({ OpenTime: -1 }).limit(1).toArray()
  return NextResponse.json(doc[0] || null)
}
