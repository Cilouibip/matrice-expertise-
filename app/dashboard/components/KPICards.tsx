'use client'

import { Users, BarChart3, AlertTriangle, Trophy } from 'lucide-react'
import { Diagnostic, ARCHETYPE_CONFIG, BLOCAGE_LABELS, ArchetypeKey } from '../types'
import { getMode, average } from '../utils'

interface KPICardsProps {
  diagnostics: Diagnostic[]
}

export default function KPICards({ diagnostics }: KPICardsProps) {
  const totalLeads = diagnostics.length
  const avgScore = average(diagnostics.map(d => d.score)).toFixed(1)
  const topBlocage = getMode(diagnostics, d => d.quiz_answers.blocage)
  const topArchetype = getMode(diagnostics, d => d.archetype)

  const kpis = [
    {
      label: 'Total Leads',
      value: totalLeads,
      icon: Users,
      color: '#5BC0EB',
    },
    {
      label: 'Score Moyen',
      value: avgScore,
      icon: BarChart3,
      color: '#FF9B71',
    },
    {
      label: 'Blocage #1',
      value: topBlocage ? BLOCAGE_LABELS[topBlocage] : '-',
      icon: AlertTriangle,
      color: '#FA7268',
    },
    {
      label: 'Archétype dominant',
      value: topArchetype ? ARCHETYPE_CONFIG[topArchetype as ArchetypeKey]?.name : '-',
      icon: Trophy,
      color: '#95E1D3',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className="bg-white rounded-2xl p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${kpi.color}20` }}
            >
              <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2D2A26] mb-1">{kpi.value}</p>
          <p className="text-sm text-[#6B6560]">{kpi.label}</p>
        </div>
      ))}
    </div>
  )
}
