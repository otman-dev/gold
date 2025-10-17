import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET() {
  const db = await getDb()
  const coll = db.collection('strategy_logs')
  const strategies = await coll.distinct('strategy')
  return NextResponse.json(strategies)
}
