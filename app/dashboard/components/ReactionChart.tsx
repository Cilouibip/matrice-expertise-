'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Diagnostic, REACTION_LABELS } from '../types'
import { countByKey } from '../utils'
import { DisplayMode } from './DisplayModeToggle'

interface ReactionChartProps {
  diagnostics: Diagnostic[]
  displayMode: DisplayMode
}

const REACTION_COLORS: Record<string, string> = {
  analyse: '#93C5FD',
  procrastine: '#FDBA74',
  panique: '#FCA5A5',
  fonce: '#6EE7B7',
}

export default function ReactionChart({ diagnostics, displayMode }: ReactionChartProps) {
  const counts = countByKey(diagnostics, d => d.quiz_answers.reaction_incertitude)
  const total = diagnostics.length
  
  const data = Object.entries(counts)
    .map(([key, count]) => {
      return {
        name: REACTION_LABELS[key] || key,
        value: count,
        count,
        key,
        color: REACTION_COLORS[key] || '#D1D5DB',
      }
    })
    .sort((a, b) => b.count - a.count)

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; count: number } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      const percent = total > 0 ? (item.count / total) * 100 : 0
      return (
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-[#E8E4DF]">
          <p className="font-medium text-[#2D2A26]">{item.name}</p>
          <p className="text-[#6B6560]">{percent.toFixed(1)}% ({item.count} lead{item.count > 1 ? 's' : ''})</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Réaction à l'Incertitude</h3>
      
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DF" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6B6560', fontSize: 12 }}
              axisLine={{ stroke: '#E8E4DF' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6B6560', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={displayMode === 'percent'}
              tickFormatter={displayMode === 'percent' ? (value: number) => `${(value / total * 100).toFixed(1)}%` : undefined}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
