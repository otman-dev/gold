import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  const session: any = await getServerSession(authOptions as any)
  if (!session) return new NextResponse('Unauthorized', { status: 401 })
  if (session.user?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

  const body = await req.json()
  const userId = body.user_id
  if (!userId) return new NextResponse('Bad Request', { status: 400 })

  const db = await getDb()
  const coll = db.collection('users')
  const res = await coll.updateOne({ _id: typeof userId === 'string' ? new (require('mongodb').ObjectId)(userId) : userId }, { $set: { approved: true, approved_at: new Date(), approved_by: session.user?.email } })
  return NextResponse.json({ matched: res.matchedCount, modified: res.modifiedCount })
}
