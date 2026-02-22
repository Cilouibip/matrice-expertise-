'use client'

import { motion } from 'framer-motion'

interface DiagnosticJson {
  situation: string
  pourquoi_bloque: string
  risque_concret: string
}

export default function DiagnosticBlock({ diagnostic }: { diagnostic: DiagnosticJson }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-2xl font-display font-medium text-white">Diagnostic Brutal</h3>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Situation */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 space-y-4">
            <h4 className="text-sm font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-neutral-600 rounded-full" />
              Là où tu en es
            </h4>
            <p className="text-lg text-neutral-300 leading-relaxed">
              {diagnostic.situation}
            </p>
          </div>

          {/* Root Cause */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 space-y-4">
            <h4 className="text-sm font-mono text-amber-500 uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
              Le vrai problème
            </h4>
            <p className="text-lg text-neutral-300 leading-relaxed">
              {diagnostic.pourquoi_bloque}
            </p>
          </div>
        </div>

        {/* Risk (Red Warning) */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-8 space-y-4 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <svg className="w-32 h-32 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h4 className="text-sm font-mono text-red-500 uppercase tracking-widest flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Si tu ne bouges pas
          </h4>
          <p className="text-xl md:text-2xl font-display font-medium text-red-200 leading-tight relative z-10">
            "{diagnostic.risque_concret}"
          </p>
        </div>
      </div>
    </motion.div>
  )
}
