import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(req: Request) {
  const session: any = await getServerSession(authOptions as any)
  if (!session) return new NextResponse('Unauthorized', { status: 401 })
  if (session.user?.role !== 'admin') return new NextResponse('Forbidden', { status: 403 })

  const db = await getDb()
  const coll = db.collection('users')
  const docs = await coll.find({}).toArray()
  return NextResponse.json(docs)
}
