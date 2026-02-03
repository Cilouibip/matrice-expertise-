'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Diagnostic, OBJECTIF_LABELS } from '../types'
import { countByKey } from '../utils'
import { DisplayMode } from './DisplayModeToggle'

interface ObjectifChartProps {
  diagnostics: Diagnostic[]
  displayMode: DisplayMode
}

const OBJECTIF_COLORS: Record<string, string> = {
  '3_5k': '#93C5FD',
  '5_10k': '#6EE7B7',
  '10k_plus': '#FDE047',
}

export default function ObjectifChart({ diagnostics, displayMode }: ObjectifChartProps) {
  const counts = countByKey(diagnostics, d => d.quiz_answers.objectif_revenus)
  const total = diagnostics.length
  
  const orderedKeys = ['3_5k', '5_10k', '10k_plus']
  
  const data = orderedKeys.map(key => {
    const count = counts[key] || 0
    return {
      name: OBJECTIF_LABELS[key] || key,
      value: count,
      count,
      key,
      color: OBJECTIF_COLORS[key] || '#D1D5DB',
    }
  })

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
      <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Objectifs de Revenus</h3>
      
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
