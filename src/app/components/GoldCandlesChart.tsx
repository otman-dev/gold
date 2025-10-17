import React from 'react'

function getCandleColor(open: number, close: number) {
  return close > open ? '#10b981' : '#ef4444'
}

export default function GoldCandlesChart({ candles }: { candles: any[] }) {
  if (!candles.length) return <div className="text-center text-sm muted">No candle data</div>
  const width = 600
  const height = 220
  const margin = 32
  const barWidth = Math.max(4, Math.floor((width - margin * 2) / candles.length))
  const maxHigh = Math.max(...candles.map(c => c.High))
  const minLow = Math.min(...candles.map(c => c.Low))
  const maxVol = Math.max(...candles.map(c => c.Volume))

  // Map candles to chart coordinates
  const y = (v: number) => margin + (height - margin * 2) * (1 - (v - minLow) / (maxHigh - minLow))
  const volY = (v: number) => height - margin - (height / 5) * (v / maxVol)

  return (
    <svg width={width} height={height} style={{ background: '#0e1629', borderRadius: 12 }}>
      {/* Volume bars */}
      {candles.map((c, i) => (
        <rect
          key={i}
          x={margin + i * barWidth}
          y={volY(c.Volume)}
          width={barWidth - 2}
          height={height - margin - volY(c.Volume)}
          fill="#3b82f6"
          opacity={0.18}
        />
      ))}
      {/* Candle wicks */}
      {candles.map((c, i) => (
        <line
          key={i}
          x1={margin + i * barWidth + barWidth / 2}
          x2={margin + i * barWidth + barWidth / 2}
          y1={y(c.High)}
          y2={y(c.Low)}
          stroke={getCandleColor(c.Open, c.Close)}
          strokeWidth={2}
        />
      ))}
      {/* Candle bodies */}
      {candles.map((c, i) => (
        <rect
          key={i}
          x={margin + i * barWidth + 1}
          y={Math.min(y(c.Open), y(c.Close))}
          width={barWidth - 2}
          height={Math.abs(y(c.Open) - y(c.Close)) || 2}
          fill={getCandleColor(c.Open, c.Close)}
          rx={2}
        />
      ))}
      {/* Axis labels */}
      <text x={8} y={margin} fill="#94a3b8" fontSize={12}>High: {maxHigh}</text>
      <text x={8} y={height - margin + 14} fill="#94a3b8" fontSize={12}>Low: {minLow}</text>
      <text x={width - margin} y={height - margin + 14} fill="#3b82f6" fontSize={12} textAnchor="end">Volume</text>
    </svg>
  )
}
