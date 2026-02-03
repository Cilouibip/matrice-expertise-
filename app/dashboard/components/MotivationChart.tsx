'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Diagnostic, MOTIVATION_LABELS } from '../types'
import { countByKey } from '../utils'
import { DisplayMode } from './DisplayModeToggle'

interface MotivationChartProps {
  diagnostics: Diagnostic[]
  displayMode: DisplayMode
}

const MOTIVATION_COLORS: Record<string, string> = {
  liberte: '#7DD3FC',
  argent: '#FDE047',
  impact: '#6EE7B7',
  challenge: '#C4B5FD',
}

export default function MotivationChart({ diagnostics, displayMode }: MotivationChartProps) {
  const counts = countByKey(diagnostics, d => d.quiz_answers.motivation)
  const total = diagnostics.length
  
  const data = Object.entries(counts).map(([key, count]) => {
    return {
      name: MOTIVATION_LABELS[key] || key,
      value: count,
      count,
      color: MOTIVATION_COLORS[key] || '#D1D5DB',
    }
  })

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; count: number }; percent?: number }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      const percent = payload[0].percent ?? 0
      return (
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-[#E8E4DF]">
          <p className="font-medium text-[#2D2A26]">{item.name}</p>
          <p className="text-[#6B6560]">{(percent * 100).toFixed(1)}% ({item.count} lead{item.count > 1 ? 's' : ''})</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Motivations</h3>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
