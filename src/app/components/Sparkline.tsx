"use client"
import React from 'react'

type Props = { values: number[]; width?: number; height?: number; color?: string }

export default function Sparkline({ values, width = 200, height = 40, color = '#2563eb' }: Props) {
  if (!values || values.length === 0) return <svg width={width} height={height} />
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = width / (values.length - 1)
  const points = values
    .map((v, i) => {
      const x = i * step
      const y = height - ((v - min) / range) * height
      return `${x},${y}`
    })
    .join(' ')

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      <polygon points={`${points} ${width},${height} 0,${height}`} fill="url(#g1)" opacity="0.9" />
    </svg>
  )
}
