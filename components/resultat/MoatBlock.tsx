'use client'

import { motion } from 'framer-motion'
import { MatrixScoringResult } from '@/lib/matrix-types'

export default function MoatBlock({ scoring, diagnostic }: { scoring: MatrixScoringResult, diagnostic: any }) {
  if (!scoring.advanced) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="space-y-6 opacity-50"
      >
        <div className="flex items-center gap-4 mb-8">
          <h3 className="text-2xl font-display font-medium text-white">Avantage Injuste (MOAT)</h3>
          <div className="flex-1 h-px bg-white/10" />
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/5 border-dashed rounded-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-neutral-400">
            Données limitées — passez en mode avancé pour débloquer votre score MOAT et votre vulnérabilité IA.
          </p>
        </div>
      </motion.div>
    )
  }

  const moats = diagnostic.moats || []
  
  const getIaColor = (level: string) => {
    if (level === 'critique') return 'text-red-500 bg-red-500/10 border-red-500/20'
    if (level === 'modérée') return 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-2xl font-display font-medium text-white">Défensibilité (MOAT)</h3>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MOAT Global & Breakdowns */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 space-y-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-neutral-400 uppercase tracking-widest">Score Global</span>
            <span className="text-4xl font-display font-medium text-white">{scoring.advanced.moat_global}</span>
          </div>

          <div className="space-y-6">
            {moats.map((m: any, i: number) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-mono text-neutral-500 uppercase">{m.name}</span>
                  <span className="text-neutral-300">{m.score}/4</span>
                </div>
                <div className="w-full h-1 bg-neutral-900 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(m.score / 4) * 100}%` }}
                    transition={{ duration: 1, delay: 0.1 * i }}
                    className="h-full bg-neutral-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* IA Vulnerability */}
        {diagnostic.ia_vulnerability && (
          <div className={`border rounded-xl p-8 flex flex-col justify-center space-y-6 ${getIaColor(diagnostic.ia_vulnerability.level)}`}>
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest opacity-80 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Vulnérabilité IA
              </span>
              <h4 className="text-3xl font-display font-medium capitalize">
                Niveau {diagnostic.ia_vulnerability.level}
              </h4>
            </div>
            
            <p className="text-lg opacity-90 leading-relaxed">
              {diagnostic.ia_vulnerability.description}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
