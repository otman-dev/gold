import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export default async function StrategyPage({ params }: any) {
  const session = await getServerSession(authOptions as any)
  if (!session) return <div className="p-8">Unauthorized</div>

  const strategy = params.strategy
  const db = await getDb()
  const stats = await fetch(`${process.env.NEXTAUTH_URL || ''}/api/strategy/${strategy}/stats`).then((r) => r.json())
  const trades = await db.collection('strategy_logs').find({ strategy }).sort({ date: -1 }).limit(200).toArray()

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">Strategy: {strategy}</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
      <h2 className="mt-4">Recent Trades</h2>
      <ul>
        {trades.map((t: any) => <li key={t._id}>{new Date(t.date).toLocaleString()} {t.signal} {t.trade_result}</li>)}
      </ul>
    </div>
  )
}
