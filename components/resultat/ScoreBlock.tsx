'use client'

import { motion } from 'framer-motion'

interface Variable {
  name: string
  score: number
}

export default function ScoreBlock({ variables }: { variables: Variable[] }) {
  const getBarColor = (score: number) => {
    if (score < 2) return 'bg-red-500' // 1
    if (score < 3) return 'bg-amber-500' // 2
    if (score < 4) return 'bg-emerald-500' // 3
    return 'bg-emerald-400' // 4
  }

  // Find lowest score
  const minScore = Math.min(...variables.map(v => v.score))

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-8"
    >
      <div className="flex items-center gap-4 mb-6">
        <h3 className="text-2xl font-display font-medium text-white">Variables de Certitude</h3>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {variables.map((v, i) => {
          const isWeakest = v.score === minScore
          const pct = (v.score / 4) * 100

          return (
            <div key={i} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm font-mono text-neutral-400 uppercase tracking-wider">{v.name}</span>
                {isWeakest && (
                  <span className="text-[10px] font-mono uppercase tracking-widest text-red-500 bg-red-500/10 px-2 py-1 rounded-md">
                    Point Faible
                  </span>
                )}
              </div>
              
              <div className="flex items-end gap-2">
                <span className="text-3xl font-display font-medium text-white">{v.score}</span>
                <span className="text-neutral-600 mb-1">/4</span>
              </div>

              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${pct}%` }}
                  transition={{ duration: 1, delay: 0.2 * i }}
                  className={`h-full rounded-full ${getBarColor(v.score)}`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
