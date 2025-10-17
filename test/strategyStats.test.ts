import { describe, it, expect } from 'vitest'
import { computeStats } from '../src/lib/strategyStats'

describe('computeStats', () => {
  it('computes basic aggregates', () => {
    const logs = [
      { trade_executed: true, trade_result: 10 },
      { trade_executed: false, trade_result: -5 },
      { trade_executed: true, trade_result: 0 }
    ]
    const s = computeStats(logs)
    expect(s.total_signals).toBe(3)
    expect(s.trades_executed).toBe(2)
    expect(s.wins).toBe(1)
    expect(s.losses).toBe(1)
    expect(typeof s.avg_return).toBe('number')
  })
})
