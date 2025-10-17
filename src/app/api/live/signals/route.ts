import { getMongoClient } from '@/lib/mongodb'

export async function GET(req: Request) {
  const client = await getMongoClient()
  const db = client.db('trading')
  const coll = db.collection('strategy_logs')

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const pipeline = [{ $match: { operationType: 'insert' } }]
        const changeStream = coll.watch(pipeline, { fullDocument: 'updateLookup' })
        for await (const change of changeStream) {
          // Use 'any' to avoid TS error for fullDocument
          const doc = (change as any).fullDocument
          if (doc) {
            controller.enqueue(`data: ${JSON.stringify(doc)}\n\n`)
          }
        }
      } catch (e) {
        controller.enqueue(`event: error\ndata: ${JSON.stringify({ error: String(e) })}\n\n`)
        controller.close()
      }
    }
  })

  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream' } })
}
