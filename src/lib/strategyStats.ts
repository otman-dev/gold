export function computeStats(logs: Array<any>) {
  const total_signals = logs.length
  const trades_executed = logs.filter((l) => l.trade_executed).length
  const wins = logs.filter((l) => typeof l.trade_result === 'number' && l.trade_result > 0).length
  const losses = logs.filter((l) => typeof l.trade_result === 'number' && l.trade_result < 0).length
  const avg_return = logs.filter((l) => typeof l.trade_result === 'number').reduce((a, b) => a + (b.trade_result ?? 0), 0) / Math.max(1, logs.filter((l) => typeof l.trade_result === 'number').length)
  return { total_signals, trades_executed, wins, losses, avg_return }
}
