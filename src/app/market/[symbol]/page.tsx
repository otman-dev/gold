import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export default async function MarketPage({ params }: any) {
  const session = await getServerSession(authOptions as any)
  if (!session) return <div className="p-8">Unauthorized</div>
  const symbol = await params.symbol
  const db = await getDb()
  const candles = await db.collection('candles').find({ symbol }).sort({ OpenTime: -1 }).limit(200).toArray()

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Market: {symbol}</h1>
      <ul>
        {candles.map((c: any) => <li key={c._id}>{new Date(c.OpenTime).toLocaleString()} {c.Close}</li>)}
      </ul>
    </div>
  )
}
