"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import GoldCandlesChart from './components/GoldCandlesChart'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [candles, setCandles] = useState<any[]>([])
  const [signals, setSignals] = useState<any[]>([])
  // Remove symbol/interval controls for gold-only dashboard

  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.replace('/home')
      return
    }
    const user: any = session.user
    if (!user.approved) {
      router.replace('/auth/pending')
      return
    }
    // Only require user to be approved, not admin
    let es: EventSource | null = null
    let es2: EventSource | null = null
    // Fallback: fetch latest 50 candles on mount
    fetch('/api/candles?limit=50')
      .then((r) => r.json())
      .then((data) => setCandles(data || []))
      .catch(() => {})
    es = new EventSource('/api/live/candles')
    es.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data)
        setCandles((s) => [d, ...s].slice(0, 50))
      } catch (err) {
        console.error(err)
      }
    }
    es.onerror = (e) => {
      console.error('candles SSE error', e)
      es?.close()
    }

    es2 = new EventSource('/api/live/signals')
    es2.onmessage = (e) => {
      try {
        const d = JSON.parse(e.data)
        setSignals((s) => [d, ...s].slice(0, 50))
      } catch (err) {
        console.error(err)
      }
    }
    es2.onerror = () => es2?.close()

    return () => {
      es?.close()
      es2?.close()
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="p-8 text-center">Loading...</div>
  }

  // Only show dashboard if authorized
  // Use the same user variable from above
  const user: any = session?.user
  if (!user || !user.approved || user.role !== 'admin') {
    return null
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Gold Dashboard</h1>
        <p className="text-sm muted">Live 15-minute gold candles and signals</p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="col-span-2 card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Gold — Live 15m candles</h2>
            <div className="flex items-center gap-2 text-sm muted">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">Live</span>
              <span>15m</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-80 p-3 card-compact rounded">
              <GoldCandlesChart candles={candles.slice(0, 50)} />
            </div>
            <div className="h-48 p-3 card-compact rounded">
              <div className="text-sm muted">Latest</div>
              {candles[0] ? (
                <div className="mt-2">
                  <div className="text-lg font-mono">{candles[0].Close}</div>
                  <div className="text-xs muted">{new Date(candles[0].OpenTime).toLocaleString()}</div>
                </div>
              ) : (
                <div className="text-sm muted">No data</div>
              )}
            </div>
          </div>

          <div className="mt-4 h-48 overflow-auto">
            <ul className="divide-y divide-gray-700">
              {candles.map((c, i) => (
                <li key={i} className="py-2 flex justify-between">
                  <div className="text-sm">Gold</div>
                  <div className="text-xs muted">{new Date(c.OpenTime).toLocaleString()}</div>
                  <div className="font-mono">{c.Close}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="card">
          <h3 className="font-semibold mb-2">Signals & Health</h3>
          <div className="space-y-3">
            <div className="p-2 card-compact rounded">
              <div className="text-xs muted">Recent signals</div>
              <div className="text-lg font-semibold">{signals.length}</div>
            </div>
            <div className="p-2 card-compact rounded">
              <div className="text-xs muted">DB status</div>
              <div className="text-sm text-green-600">Connected</div>
            </div>
            <div className="p-2 card-compact rounded">
              <div className="text-xs muted">Server</div>
              <div className="text-sm">OK</div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-medium">Recent signals</h4>
            <div className="mt-2 h-48 overflow-auto">
              <ul className="space-y-2">
                {signals.map((s, i) => (
                  <li key={i} className="text-sm">
                    <div className="flex justify-between">
                      <div>{s.strategy || s.signal}</div>
                      <div className="text-xs muted">{new Date(s.date).toLocaleString()}</div>
                    </div>
                    <div className="text-xs muted">{s.reason}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
