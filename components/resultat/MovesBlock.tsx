'use client'

import { motion } from 'framer-motion'

interface Move {
  title: string
  description: string
}

interface DiagnosticJson {
  move_commando: Move
  move_builder: Move
}

export default function MovesBlock({ diagnostic }: { diagnostic: DiagnosticJson }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-2xl font-display font-medium text-white">Plan d'Action</h3>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Move Commando */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">Move Commando</span>
              <span className="text-xs text-neutral-500 ml-2">Cette semaine</span>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-display font-medium text-white">
                {diagnostic.move_commando.title}
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                {diagnostic.move_commando.description}
              </p>
            </div>
          </div>
        </div>

        {/* Move Builder */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-300">Move Builder</span>
              <span className="text-xs text-neutral-500 ml-2">Ce mois</span>
            </div>

            <div className="space-y-4">
              <h4 className="text-2xl font-display font-medium text-white">
                {diagnostic.move_builder.title}
              </h4>
              <p className="text-neutral-400 leading-relaxed">
                {diagnostic.move_builder.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
