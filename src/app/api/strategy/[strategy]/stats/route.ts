import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: Request, { params }: any) {
  const strategy = await params.strategy
  const url = new URL(req.url)
  const from = url.searchParams.get('from')
  const to = url.searchParams.get('to')

  const db = await getDb()
  const coll = db.collection('strategy_logs')
  const match: any = { strategy }
  if (from || to) match.date = {}
  if (from) match.date.$gte = new Date(from)
  if (to) match.date.$lte = new Date(to)

  const agg = [
    { $match: match },
    {
      $project: {
        pnl: '$trade_result.pnl',
        result: '$trade_result.result',
        trade_executed: 1
      }
    },
    {
      $group: {
        _id: null,
        total_signals: { $sum: 1 },
        trades_executed: { $sum: { $cond: [{ $ne: ['$result', 'no-trade'] }, 1, 0] } },
        wins: { $sum: { $cond: [{ $gt: ['$pnl', 0] }, 1, 0] } },
        losses: { $sum: { $cond: [{ $lt: ['$pnl', 0] }, 1, 0] } },
        avg_pnl: { $avg: '$pnl' }
      }
    }
  ]

  const res = await coll.aggregate(agg).toArray()
  return NextResponse.json(res[0] || { total_signals: 0, trades_executed: 0, wins: 0, losses: 0, avg_pnl: 0 })
}
