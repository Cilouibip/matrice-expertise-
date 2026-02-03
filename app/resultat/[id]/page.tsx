'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface SousScore {
  score: number
  explication: string
}

interface Action {
  titre: string
  deadline: string
  contexte: string
  steps: string[]
  template: string
  resultat_attendu: string
}

interface DiagnosticData {
  archetype: string
  archetype_name: string
  archetype_emoji: string
  archetype_description: string
  score: number
  sous_scores: {
    clarte: SousScore
    confiance: SousScore
    execution: SousScore
    ressources: SousScore
  }
  forces: string[]
  angles_morts: string[]
  diagnostic_brutal: string
  piege_specifique: string
  actions: Action[]
  anti_conseil: string
}

// Composant Graphique Radar
function RadarChart({ sousScores }: { sousScores: DiagnosticData['sous_scores'] }) {
  const scores = [
    { label: 'Clarté', value: sousScores.clarte.score },
    { label: 'Confiance', value: sousScores.confiance.score },
    { label: 'Exécution', value: sousScores.execution.score },
    { label: 'Ressources', value: sousScores.ressources.score },
  ]
  
  const centerX = 150
  const centerY = 150
  const maxRadius = 100
  
  // Calcule les points du polygone
  const points = scores.map((s, i) => {
    const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2
    const radius = (s.value / 100) * maxRadius
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
      label: s.label,
      value: s.value,
      labelX: centerX + (maxRadius + 30) * Math.cos(angle),
      labelY: centerY + (maxRadius + 30) * Math.sin(angle),
    }
  })
  
  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')
  
  return (
    <div className="flex flex-col items-center">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Cercles de fond */}
        {[25, 50, 75, 100].map((percent) => (
          <circle
            key={percent}
            cx={centerX}
            cy={centerY}
            r={(percent / 100) * maxRadius}
            fill="none"
            stroke="#E5E5E5"
            strokeWidth="1"
          />
        ))}
        
        {/* Lignes vers les axes */}
        {scores.map((_, i) => {
          const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2
          return (
            <line
              key={i}
              x1={centerX}
              y1={centerY}
              x2={centerX + maxRadius * Math.cos(angle)}
              y2={centerY + maxRadius * Math.sin(angle)}
              stroke="#E5E5E5"
              strokeWidth="1"
            />
          )
        })}
        
        {/* Polygone des scores */}
        <polygon
          points={polygonPoints}
          fill="rgba(255, 155, 113, 0.3)"
          stroke="#FF9B71"
          strokeWidth="2"
        />
        
        {/* Points sur le polygone */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="6"
            fill="#FF9B71"
          />
        ))}
        
        {/* Labels */}
        {points.map((p, i) => (
          <text
            key={i}
            x={p.labelX}
            y={p.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-medium fill-[#112337]"
          >
            {p.label}
          </text>
        ))}
      </svg>
      <div className="flex justify-center gap-6 mt-2 text-xs text-[#9B8F85]">
        <span>Centre = 0</span>
        <span>Bord = 100</span>
      </div>
    </div>
  )
}

// Bouton copier
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <button
      onClick={handleCopy}
      className="text-sm bg-[#FF9B71] hover:bg-[#FF8A5C] text-white px-4 py-2 rounded-lg transition-all"
    >
      {copied ? '✓ Copié !' : 'Copier'}
    </button>
  )
}

export default function ResultatPage() {
  const params = useParams()
  const id = params?.id as string
  
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDiagnostic() {
      if (!id) {
        setError('ID manquant')
        setLoading(false)
        return
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('diagnostics')
          .select('diagnostic_json')
          .eq('id', id)
          .single()

        if (supabaseError) {
          setError('Diagnostic non trouvé')
          setLoading(false)
          return
        }

        if (data?.diagnostic_json) {
          setDiagnostic(data.diagnostic_json as DiagnosticData)
        } else {
          setError('Données du diagnostic manquantes')
        }
      } catch (err) {
        setError('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchDiagnostic()
  }, [id])

  // Initialiser Calendly embed
  useEffect(() => {
    // Réinitialiser Calendly quand le composant monte
    // @ts-ignore
    if (window.Calendly) {
      // @ts-ignore
      window.Calendly.initInlineWidget({
        url: 'https://calendly.com/mehdi-zen/appel-turbo?hide_gdpr_banner=1&background_color=faf9f6&primary_color=ff9b71',
        parentElement: document.querySelector('.calendly-inline-widget'),
      });
    }
  }, [diagnostic])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF9B71] mx-auto mb-4"></div>
          <p className="text-[#585e6a]">Chargement de ton diagnostic...</p>
        </div>
      </main>
    )
  }

  if (error || !diagnostic) {
    return (
      <main className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Diagnostic non trouvé'}</p>
          <a href="/quiz" className="text-[#FF9B71] underline">Refaire le quiz</a>
        </div>
      </main>
    )
  }

  const scoreGlobal = diagnostic.sous_scores 
    ? Math.round(
        (diagnostic.sous_scores.clarte.score + 
         diagnostic.sous_scores.confiance.score + 
         diagnostic.sous_scores.execution.score + 
         diagnostic.sous_scores.ressources.score) / 4
      )
    : diagnostic.score

  return (
    <main className="min-h-screen bg-[#FAF9F6] py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <section className="text-center mb-12">
          <span className="text-6xl mb-4 block">{diagnostic.archetype_emoji}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#112337] mb-4">
            {diagnostic.archetype_name}
          </h1>
          <p className="text-xl text-[#585e6a] max-w-2xl mx-auto">
            {diagnostic.archetype_description}
          </p>
        </section>

        {/* GRAPHIQUE RADAR + EXPLICATIONS */}
        {diagnostic.sous_scores && (
          <section className="bg-white rounded-3xl p-8 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-[#112337] mb-6 text-center">
              Ton profil en un coup d'œil
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <RadarChart sousScores={diagnostic.sous_scores} />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl">
                  <span className="font-medium text-[#112337]">Clarté</span>
                  <div className="text-right">
                    <span className={`font-bold ${
                      diagnostic.sous_scores.clarte.score >= 75 ? 'text-[#059669]' :
                      diagnostic.sous_scores.clarte.score >= 50 ? 'text-[#D97706]' :
                      diagnostic.sous_scores.clarte.score >= 25 ? 'text-[#EA580C]' :
                      'text-[#DC2626]'
                    }`}>{diagnostic.sous_scores.clarte.score}/100</span>
                    <p className="text-sm text-[#585e6a]">{diagnostic.sous_scores.clarte.explication}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl">
                  <span className="font-medium text-[#112337]">Confiance</span>
                  <div className="text-right">
                    <span className={`font-bold ${
                      diagnostic.sous_scores.confiance.score >= 75 ? 'text-[#059669]' :
                      diagnostic.sous_scores.confiance.score >= 50 ? 'text-[#D97706]' :
                      diagnostic.sous_scores.confiance.score >= 25 ? 'text-[#EA580C]' :
                      'text-[#DC2626]'
                    }`}>{diagnostic.sous_scores.confiance.score}/100</span>
                    <p className="text-sm text-[#585e6a]">{diagnostic.sous_scores.confiance.explication}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl">
                  <span className="font-medium text-[#112337]">Exécution</span>
                  <div className="text-right">
                    <span className={`font-bold ${
                      diagnostic.sous_scores.execution.score >= 75 ? 'text-[#059669]' :
                      diagnostic.sous_scores.execution.score >= 50 ? 'text-[#D97706]' :
                      diagnostic.sous_scores.execution.score >= 25 ? 'text-[#EA580C]' :
                      'text-[#DC2626]'
                    }`}>{diagnostic.sous_scores.execution.score}/100</span>
                    <p className="text-sm text-[#585e6a]">{diagnostic.sous_scores.execution.explication}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-[#FAF9F6] rounded-xl">
                  <span className="font-medium text-[#112337]">Ressources</span>
                  <div className="text-right">
                    <span className={`font-bold ${
                      diagnostic.sous_scores.ressources.score >= 75 ? 'text-[#059669]' :
                      diagnostic.sous_scores.ressources.score >= 50 ? 'text-[#D97706]' :
                      diagnostic.sous_scores.ressources.score >= 25 ? 'text-[#EA580C]' :
                      'text-[#DC2626]'
                    }`}>{diagnostic.sous_scores.ressources.score}/100</span>
                    <p className="text-sm text-[#585e6a]">{diagnostic.sous_scores.ressources.explication}</p>
                  </div>
                </div>
                
                <div className="mt-4 p-6 bg-[#FF9B71]/10 rounded-xl text-center">
                  <p className="text-sm text-[#585e6a] mb-2">Ta capacité à te lancer</p>
                  <span className="text-4xl font-bold text-[#FF9B71]">{scoreGlobal}</span>
                  <span className="text-xl text-[#585e6a]">/100</span>
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      scoreGlobal >= 75 ? 'bg-[#D1FAE5] text-[#065F46]' :
                      scoreGlobal >= 50 ? 'bg-[#FEF3C7] text-[#92400E]' :
                      scoreGlobal >= 25 ? 'bg-[#FFEDD5] text-[#9A3412]' :
                      'bg-[#FEE2E2] text-[#991B1B]'
                    }`}>
                      {scoreGlobal >= 75 ? 'Tu peux y aller' :
                       scoreGlobal >= 50 ? 'T\'as les bases, mais t\'es encore freiné' :
                       scoreGlobal >= 25 ? 'T\'es pas prêt \u2014 et c\'est normal' :
                       'Gros chantier avant de bouger'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FORCES + ANGLES MORTS */}
        {diagnostic.forces && diagnostic.angles_morts && (
          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-[#95E1D3]/20 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-[#112337] mb-4 flex items-center gap-2">
                <span>💪</span> Tes forces
              </h2>
              <ul className="space-y-3">
                {diagnostic.forces.map((force, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#112337]">
                    <span className="text-[#95E1D3]">✓</span>
                    {force}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-[#F4D35E]/20 rounded-3xl p-8">
              <h2 className="text-xl font-bold text-[#112337] mb-4 flex items-center gap-2">
                <span>👁️</span> Tes angles morts
              </h2>
              <ul className="space-y-3">
                {diagnostic.angles_morts.map((angle, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#112337]">
                    <span className="text-[#F4D35E]">⚠</span>
                    {angle}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* DIAGNOSTIC BRUTAL */}
        <section className="bg-white rounded-3xl p-8 shadow-sm mb-8">
          <h2 className="text-2xl font-bold text-[#112337] mb-4 flex items-center gap-2">
            <span>🎯</span> Diagnostic Brutal
          </h2>
          <p className="text-[#112337] text-lg leading-relaxed">
            {diagnostic.diagnostic_brutal}
          </p>
        </section>

        {/* TON PIÈGE */}
        <section className="bg-[#FA7268]/10 rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-[#112337] mb-4 flex items-center gap-2">
            <span>⚠️</span> Ton piège
          </h2>
          <p className="text-[#112337] text-lg leading-relaxed">
            {diagnostic.piege_specifique}
          </p>
        </section>

        {/* CTA SOFT - Après le diagnostic */}
        <div className="bg-gradient-to-r from-[#FF9B71]/10 to-[#FF9B71]/5 border border-[#FF9B71]/20 rounded-2xl p-6 md:p-8 my-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-[#112337] mb-2">
                Tu veux qu'on en parle ?
              </h3>
              <p className="text-gray-600">
                30 min pour débloquer ta situation. Gratuit, sans engagement.
              </p>
            </div>
            <button
              onClick={() => {
                // @ts-ignore
                Calendly.initPopupWidget({url: 'https://calendly.com/mehdi-zen/appel-turbo'});
                return false;
              }}
              className="bg-[#FF9B71] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#FF8A5C] transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Réserver un appel →
            </button>
          </div>
        </div>

        {/* ACTIONS PRIORITAIRES */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[#112337] mb-6 flex items-center gap-2">
            <span>🚀</span> Tes 3 actions prioritaires
          </h2>
          <div className="space-y-6">
            {diagnostic.actions?.map((action, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm">
                {/* Header action */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-[#FF9B71] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#112337]">{action.titre}</h3>
                    <span className="inline-block mt-1 bg-[#FF9B71]/10 text-[#FF9B71] text-sm font-medium px-3 py-1 rounded-full">
                      {action.deadline}
                    </span>
                  </div>
                </div>
                
                {/* Pourquoi */}
                <div className="mb-6">
                  <p className="font-semibold text-[#112337] mb-2">Pourquoi toi :</p>
                  <p className="text-[#585e6a]">{action.contexte}</p>
                </div>
                
                {/* Comment */}
                <div className="mb-6">
                  <p className="font-semibold text-[#112337] mb-3">Comment :</p>
                  <ul className="space-y-2">
                    {action.steps?.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3 text-[#585e6a]">
                        <span className="bg-[#95E1D3] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Message à copier */}
                {action.template && (
                  <div className="mb-6 bg-[#FAF9F6] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-[#112337]">💬 Message à copier-coller :</p>
                      <CopyButton text={action.template} />
                    </div>
                    <p className="text-[#585e6a] italic text-sm">"{action.template}"</p>
                  </div>
                )}
                
                {/* Résultat */}
                <div className="bg-[#95E1D3]/10 rounded-xl p-4">
                  <p className="text-[#112337]">
                    <span className="font-semibold">✅ Résultat attendu : </span>
                    {action.resultat_attendu}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ANTI-CONSEIL */}
        <section className="bg-[#112337] rounded-3xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <span>🚫</span> Ce que tu ne dois PAS faire
          </h2>
          <p className="text-lg leading-relaxed text-white/90">
            {diagnostic.anti_conseil}
          </p>
        </section>

        {/* CTA FINAL AVEC CALENDLY EMBED */}
        <div className="bg-white rounded-3xl p-8 md:p-12 mt-8 border border-gray-100">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#112337] mb-4">
              Prêt à passer à l'action ?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Tu as vu ton diagnostic. Tu connais tes blocages. 
              <span className="font-medium text-[#112337]"> Maintenant, on en parle ?</span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              30 min • Gratuit • Sans engagement
            </p>
          </div>
          
          {/* Calendly Embed */}
          <div 
            className="calendly-inline-widget rounded-2xl overflow-hidden" 
            data-url="https://calendly.com/mehdi-zen/appel-turbo?hide_gdpr_banner=1&background_color=faf9f6&primary_color=ff9b71"
            style={{ minWidth: '320px', height: '650px' }}
          />
          
        </div>

      </div>
    </main>
  )
}
