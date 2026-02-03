'use client'

import { X } from 'lucide-react'
import { Diagnostic, ARCHETYPE_CONFIG, ArchetypeKey, BLOCAGE_LABELS, MOTIVATION_LABELS, SITUATION_LABELS, RUNWAY_LABELS, OBJECTIF_LABELS, REACTION_LABELS } from '../types'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'

interface DiagnosticModalProps {
  diagnostic: Diagnostic | null
  onClose: () => void
}

export default function DiagnosticModal({ diagnostic, onClose }: DiagnosticModalProps) {
  if (!diagnostic) return null

  const d = diagnostic
  const dj = d.diagnostic_json
  const archetype = ARCHETYPE_CONFIG[d.archetype as ArchetypeKey]

  const radarData = [
    { subject: 'Clarté', value: dj.sous_scores?.clarte?.score || 0, fullMark: 100 },
    { subject: 'Confiance', value: dj.sous_scores?.confiance?.score || 0, fullMark: 100 },
    { subject: 'Exécution', value: dj.sous_scores?.execution?.score || 0, fullMark: 100 },
    { subject: 'Ressources', value: dj.sous_scores?.ressources?.score || 0, fullMark: 100 },
  ]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div 
        className="bg-[#FAF9F6] rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#FAF9F6] border-b border-[#E8E4DF] p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#2D2A26]">
              {d.users?.first_name || 'Lead'} — Diagnostic complet
            </h2>
            <p className="text-sm text-[#6B6560]">{d.users?.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#E8E4DF] transition-colors"
          >
            <X className="w-5 h-5 text-[#6B6560]" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div 
            className="p-6 rounded-2xl text-center"
            style={{ backgroundColor: `${archetype?.color}40` }}
          >
            <span className="text-4xl mb-2 block">{archetype?.emoji}</span>
            <h3 className="text-2xl font-bold text-[#2D2A26]">{archetype?.name}</h3>
            <p className="text-[#6B6560] mt-2">{dj.archetype_description}</p>
            <div className="mt-4">
              <span className="text-4xl font-bold text-[#2D2A26]">{d.score}</span>
              <span className="text-[#6B6560]">/100</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-[#2D2A26] mb-4">Sous-scores</h4>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E8E4DF" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B6560', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9B8F85', fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="value"
                      stroke="#FF9B71"
                      fill="#FF9B71"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {radarData.map(item => (
                  <div key={item.subject} className="flex justify-between text-sm">
                    <span className="text-[#6B6560]">{item.subject}</span>
                    <span className="font-medium text-[#2D2A26]">{item.value}/100</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-[#2D2A26] mb-4">Réponses au quiz</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Situation</span>
                  <span className="text-[#2D2A26]">{SITUATION_LABELS[d.quiz_answers.situation]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Blocage</span>
                  <span className="text-[#2D2A26]">{BLOCAGE_LABELS[d.quiz_answers.blocage]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Motivation</span>
                  <span className="text-[#2D2A26]">{MOTIVATION_LABELS[d.quiz_answers.motivation]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Runway</span>
                  <span className="text-[#2D2A26]">{RUNWAY_LABELS[d.quiz_answers.runway]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Objectif revenus</span>
                  <span className="text-[#2D2A26]">{OBJECTIF_LABELS[d.quiz_answers.objectif_revenus]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B6560]">Réaction incertitude</span>
                  <span className="text-[#2D2A26]">{REACTION_LABELS[d.quiz_answers.reaction_incertitude]}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="font-semibold text-[#2D2A26] mb-4">💪 Forces identifiées</h4>
            <ul className="space-y-2">
              {dj.forces?.map((force, i) => (
                <li key={i} className="text-sm text-[#6B6560] flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  {force}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="font-semibold text-[#2D2A26] mb-4">👁️ Angles morts</h4>
            <ul className="space-y-2">
              {dj.angles_morts?.map((angle, i) => (
                <li key={i} className="text-sm text-[#6B6560] flex items-start gap-2">
                  <span className="text-orange-500">⚠</span>
                  {angle}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="font-semibold text-[#2D2A26] mb-4">🎯 Actions prioritaires</h4>
            <div className="space-y-4">
              {dj.actions?.map((action, i) => (
                <div key={i} className="border-l-4 border-[#FF9B71] pl-4">
                  <h5 className="font-medium text-[#2D2A26]">{i + 1}. {action.titre}</h5>
                  <p className="text-sm text-[#6B6560] mt-1">{action.contexte}</p>
                  <p className="text-xs text-[#9B8F85] mt-2">Deadline: {action.deadline}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50 rounded-2xl p-6">
            <h4 className="font-semibold text-red-700 mb-2">⛔ Anti-conseil</h4>
            <p className="text-sm text-red-600">{dj.anti_conseil}</p>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-6">
            <h4 className="font-semibold text-yellow-700 mb-2">⚠️ Piège spécifique</h4>
            <p className="text-sm text-yellow-600">{dj.piege_specifique}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h4 className="font-semibold text-[#2D2A26] mb-4">🔥 Diagnostic brutal</h4>
            <p className="text-sm text-[#6B6560] leading-relaxed">{dj.diagnostic_brutal}</p>
          </div>

          {d.linkedin_data && Object.keys(d.linkedin_data).length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h4 className="font-semibold text-[#2D2A26] mb-4">🔗 Données LinkedIn</h4>
              <pre className="text-xs text-[#6B6560] bg-[#FAF9F6] p-4 rounded-xl overflow-x-auto">
                {JSON.stringify(d.linkedin_data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
