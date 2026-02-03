'use client'

import { Diagnostic, ARCHETYPE_CONFIG, BLOCAGE_LABELS, SITUATION_LABELS, ArchetypeKey } from '../types'
import { countByKey, average } from '../utils'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface InsightsSectionProps {
  diagnostics: Diagnostic[]
}

export default function InsightsSection({ diagnostics }: InsightsSectionProps) {
  const blocages = ['confiance', 'execution', 'temps', 'clarte']
  const situations = ['en_poste', 'transition', 'entrepreneur', 'freelance']

  const matrix: Record<string, Record<string, number>> = {}
  situations.forEach(sit => {
    matrix[sit] = {}
    blocages.forEach(bloc => {
      matrix[sit][bloc] = diagnostics.filter(
        d => d.quiz_answers.situation === sit && d.quiz_answers.blocage === bloc
      ).length
    })
  })

  const archetypeScores = Object.keys(ARCHETYPE_CONFIG).map(key => {
    const filtered = diagnostics.filter(d => d.archetype === key)
    return {
      name: ARCHETYPE_CONFIG[key as ArchetypeKey].name,
      emoji: ARCHETYPE_CONFIG[key as ArchetypeKey].emoji,
      color: ARCHETYPE_CONFIG[key as ArchetypeKey].color,
      avgScore: filtered.length > 0 ? average(filtered.map(d => d.score)) : 0,
      count: filtered.length,
    }
  }).filter(a => a.count > 0).sort((a, b) => a.avgScore - b.avgScore)

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; avgScore: number; count: number; emoji: string } }> }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload
      return (
        <div className="bg-white px-4 py-2 rounded-xl shadow-lg border border-[#E8E4DF]">
          <p className="font-medium text-[#2D2A26]">{item.emoji} {item.name}</p>
          <p className="text-[#6B6560]">Score moyen: {item.avgScore.toFixed(1)}</p>
          <p className="text-[#9B8F85] text-sm">{item.count} lead{item.count > 1 ? 's' : ''}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-[#2D2A26]">📊 Insights — Croisements</h2>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Matrice Blocage × Situation</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-2 px-2 text-[#6B6560]"></th>
                  {blocages.map(b => (
                    <th key={b} className="text-center py-2 px-2 text-[#6B6560] font-medium">
                      {BLOCAGE_LABELS[b]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {situations.map(sit => (
                  <tr key={sit} className="border-t border-[#E8E4DF]">
                    <td className="py-2 px-2 text-[#6B6560] font-medium">
                      {SITUATION_LABELS[sit]}
                    </td>
                    {blocages.map(bloc => {
                      const count = matrix[sit][bloc]
                      const maxCount = Math.max(...Object.values(matrix).flatMap(m => Object.values(m)))
                      const intensity = maxCount > 0 ? count / maxCount : 0
                      return (
                        <td key={bloc} className="text-center py-2 px-2">
                          <span 
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium"
                            style={{ 
                              backgroundColor: count > 0 ? `rgba(255, 155, 113, ${0.2 + intensity * 0.6})` : '#F5F3EF',
                              color: count > 0 ? '#2D2A26' : '#9B8F85'
                            }}
                          >
                            {count}
                          </span>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[#9B8F85] mt-4">
            Plus la cellule est foncée, plus la combinaison est fréquente.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">Score moyen par archétype</h3>
          <p className="text-sm text-[#6B6560] mb-4">
            Les archétypes avec le score le plus bas sont les plus "en difficulté".
          </p>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={archetypeScores} 
                layout="vertical"
                margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DF" horizontal={false} />
                <XAxis 
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: '#6B6560', fontSize: 12 }}
                  axisLine={{ stroke: '#E8E4DF' }}
                  tickLine={false}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#6B6560', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="avgScore" radius={[0, 8, 8, 0]}>
                  {archetypeScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">🚨 Alertes</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(() => {
            const lowRunway = diagnostics.filter(d => d.quiz_answers.runway === 'moins_6_mois')
            const highGoal = diagnostics.filter(d => d.quiz_answers.objectif_revenus === '10k_plus')
            const dangerZone = diagnostics.filter(
              d => d.quiz_answers.runway === 'moins_6_mois' && d.quiz_answers.objectif_revenus === '10k_plus'
            )
            
            return (
              <>
                <div className="bg-red-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-red-600">{lowRunway.length}</p>
                  <p className="text-sm text-red-700">Runway &lt; 6 mois</p>
                  <p className="text-xs text-red-500 mt-1">
                    {((lowRunway.length / diagnostics.length) * 100).toFixed(0)}% des leads
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-yellow-600">{highGoal.length}</p>
                  <p className="text-sm text-yellow-700">Objectif 10k€+</p>
                  <p className="text-xs text-yellow-500 mt-1">
                    {((highGoal.length / diagnostics.length) * 100).toFixed(0)}% des leads
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-4">
                  <p className="text-2xl font-bold text-orange-600">{dangerZone.length}</p>
                  <p className="text-sm text-orange-700">Zone de danger</p>
                  <p className="text-xs text-orange-500 mt-1">
                    Runway court + objectif élevé
                  </p>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
