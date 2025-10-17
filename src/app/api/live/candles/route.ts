import { NextResponse } from 'next/server'
import { getDb, getMongoClient } from '@/lib/mongodb'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const symbol = url.searchParams.get('symbol')
  const interval = url.searchParams.get('interval')

  const client = await getMongoClient()
  // Use DB name from env or fallback to trading_sim
  const dbName = process.env.MONGO_DB || (process.env.MONGO_URI?.split('/').pop()?.split('?')[0] || 'trading_sim')
  const db = client.db(dbName)
  const coll = db.collection('candles')

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Always attempt change stream first
        const match: any = { operationType: 'insert' }
        if (symbol) match['fullDocument.symbol'] = symbol
        if (interval) match['fullDocument.interval'] = interval
        const pipeline: any[] = [{ $match: match }]
        const changeStream = coll.watch(pipeline, { fullDocument: 'updateLookup' })
        for await (const change of changeStream) {
          const doc = (change as any).fullDocument
          if (doc) {
            controller.enqueue(`data: ${JSON.stringify(doc)}\n\n`)
          }
        }
      } catch (e) {
        // fallback polling
        try {
          let last = Date.now()
          while (true) {
            const q: any = {}
            if (symbol) q.symbol = symbol
            if (interval) q.interval = interval
            // If neither symbol nor interval, stream all candles
            const docs = await coll.find(Object.keys(q).length ? q : {}).sort({ ingest_time: -1 }).limit(10).toArray()
            for (const d of docs) controller.enqueue(`data: ${JSON.stringify(d)}\n\n`)
            await new Promise((r) => setTimeout(r, 2000))
          }
        } catch (err) {
          controller.enqueue(`event: error\ndata: ${JSON.stringify({ error: String(err) })}\n\n`)
          controller.close()
        }
      }
    }
  })

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
}
