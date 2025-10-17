import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request, { params }: any) {
  const strategy = params.strategy
  const db = await getDb()
  const coll = db.collection('strategy_logs')
  const doc = await coll.find({ strategy }).sort({ date: -1 }).limit(1).toArray()
  return NextResponse.json(doc[0] || null)
}
