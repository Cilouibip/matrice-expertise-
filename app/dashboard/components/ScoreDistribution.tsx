'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { Diagnostic } from '../types'
import { average } from '../utils'

interface ScoreDistributionProps {
  diagnostics: Diagnostic[]
}

export default function ScoreDistribution({ diagnostics }: ScoreDistributionProps) {
  const bins = [
    { range: '0-20', min: 0, max: 20, count: 0, color: '#FCA5A5' },
    { range: '21-40', min: 21, max: 40, count: 0, color: '#FDBA74' },
    { range: '41-60', min: 41, max: 60, count: 0, color: '#FDE047' },
    { range: '61-80', min: 61, max: 80, count: 0, color: '#86EFAC' },
    { range: '81-100', min: 81, max: 100, count: 0, color: '#6EE7B7' },
  ]

  diagnostics.forEach(d => {
    const bin = bins.find(b => d.score >= b.min && d.score <= b.max)
    if (bin) bin.count++
  })

  const avgScore = average(diagnostics.map(d => d.score))
  const avgBinIndex = bins.findIndex(b => avgScore >= b.min && avgScore <= b.max)

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { range: string; count: number } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-[#E8E4DF]">
          <p className="font-medium text-[#2D2A26]">Score {item.range}</p>
          <p className="text-[#6B6560]">{item.count} lead{item.count > 1 ? 's' : ''}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#2D2A26]">Distribution des Scores</h3>
        <span className="text-sm text-[#6B6560]">
          Moyenne: <span className="font-medium text-[#2D2A26]">{avgScore.toFixed(1)}</span>
        </span>
      </div>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DF" vertical={false} />
            <XAxis 
              dataKey="range" 
              tick={{ fill: '#6B6560', fontSize: 12 }}
              axisLine={{ stroke: '#E8E4DF' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6B6560', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {bins.map((entry, index) => (
                <rect key={`bar-${index}`} fill={entry.color} />
              ))}
            </Bar>
            {avgBinIndex >= 0 && (
              <ReferenceLine 
                x={bins[avgBinIndex].range} 
                stroke="#FF9B71" 
                strokeWidth={2}
                strokeDasharray="5 5"
                label={{ value: 'Moy.', fill: '#FF9B71', fontSize: 10 }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
