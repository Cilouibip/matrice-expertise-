'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Diagnostic, ARCHETYPE_CONFIG, ArchetypeKey } from '../types'
import { countByKey } from '../utils'
import { DisplayMode } from './DisplayModeToggle'

interface ArchetypeChartProps {
  diagnostics: Diagnostic[]
  displayMode: DisplayMode
}

export default function ArchetypeChart({ diagnostics, displayMode }: ArchetypeChartProps) {
  const counts = countByKey(diagnostics, d => d.archetype)
  
  const allArchetypes: ArchetypeKey[] = [
    'expert_technique',
    'batisseur_silencieux',
    'opportuniste_agile',
    'stratege_prudent',
    'connecteur',
    'createur_impact',
  ]

  const total = diagnostics.length

  const data = allArchetypes.map(key => {
    const count = counts[key] || 0
    return {
      name: ARCHETYPE_CONFIG[key].name,
      value: count,
      count,
      color: ARCHETYPE_CONFIG[key].color,
      emoji: ARCHETYPE_CONFIG[key].emoji,
    }
  })

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; count: number; emoji: string }; percent?: number }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      const percent = payload[0].percent ?? 0
      return (
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-[#E8E4DF]">
          <p className="font-medium text-[#2D2A26]">
            {item.emoji} {item.name}
          </p>
          <p className="text-[#6B6560]">
            {(percent * 100).toFixed(1)}% ({item.count} lead{item.count > 1 ? 's' : ''})
          </p>
        </div>
      )
    }
    return null
  }

  const renderLegend = () => (
    <div className="flex flex-col gap-2 text-sm">
      {data.map((entry) => {
        const percent = total > 0 ? (entry.count / total) * 100 : 0
        const displayValue = displayMode === 'percent' ? `${percent.toFixed(1)}%` : entry.count
        return (
          <div key={entry.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#6B6560]">
              {entry.emoji} {entry.name}: <span className="font-medium text-[#2D2A26]">{displayValue}</span>
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Répartition des Archétypes</h3>
      
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:w-1/2 h-[250px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#2D2A26]">{total}</p>
              <p className="text-sm text-[#6B6560]">leads</p>
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-1/2">
          {renderLegend()}
        </div>
      </div>
    </div>
  )
}
