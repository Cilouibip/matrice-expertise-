'use client'

import { motion } from 'framer-motion'
import { ARCHETYPE_COLORS, QUADRANT_NAMES, Quadrant } from '@/lib/matrix-types'
import { Ghost, ArrowDownToLine, Zap, CheckCircle2 } from 'lucide-react'

const ICONS = {
  sage_fragile: Zap,
  operateur_certitude: CheckCircle2,
  formateur_fantome: Ghost,
  agence_commodite: ArrowDownToLine,
}

export default function MatrixBlock({ x, y, quadrant }: { x: number; y: number; quadrant: Quadrant }) {
  const activeColor = ARCHETYPE_COLORS[quadrant]

  // Conversion 1-4 scale to percentage (0-100%)
  const px = ((x - 1) / 3) * 100
  const py = ((y - 1) / 3) * 100

  const QuadrantPanel = ({ q, label, className }: { q: Quadrant, label: string, className: string }) => {
    const isActive = q === quadrant
    const color = ARCHETYPE_COLORS[q]
    const Icon = ICONS[q]
    
    return (
      <div 
        className={`absolute flex flex-col items-center justify-center p-6 transition-all duration-700
          ${className}
          ${isActive ? 'z-10' : 'hover:z-20 group'}
        `}
      >
        {/* Subtil fond coloré pour chaque cadran (même inactif) */}
        <div 
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
          style={{ backgroundColor: color.primaryHex }}
        />
        
        {/* Effets actifs */}
        {isActive && (
          <>
            <div 
              className="absolute inset-0 blur-3xl opacity-20"
              style={{ backgroundColor: color.primaryHex }}
            />
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen"
              style={{ backgroundColor: color.primaryHex }}
            />
            {/* Bordure subtile colorée pour le cadran actif */}
            <div 
              className="absolute inset-0 border-2 pointer-events-none opacity-20"
              style={{ borderColor: color.primaryHex }}
            />
          </>
        )}

        <div className={`relative z-10 flex flex-col items-center gap-3 transition-transform duration-500 ${isActive ? 'scale-105' : 'scale-100 group-hover:scale-105'}`}>
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md"
            style={{ 
              backgroundColor: isActive ? `${color.primaryHex}20` : `${color.primaryHex}10`,
              boxShadow: isActive ? `0 0 20px ${color.glow}` : 'none'
            }}
          >
            <Icon 
              className={`w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`} 
              style={{ color: color.primaryHex, filter: isActive ? `drop-shadow(0 0 8px ${color.glow})` : 'none' }}
              strokeWidth={isActive ? 2.5 : 2}
            />
          </div>
          <span className={`text-sm md:text-base font-mono uppercase tracking-widest text-center max-w-[140px] leading-tight
            ${isActive ? 'text-white font-bold' : 'text-neutral-500 group-hover:text-white'}
          `}>
            {label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="relative aspect-square bg-[#050505] rounded-3xl p-8 shadow-2xl shadow-black">
        {/* Glow du container */}
        <div className="absolute inset-0 rounded-3xl border border-white/5 pointer-events-none" />
        
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#080808]">
          
          {/* Grid Background discret */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

          {/* Quadrants */}
          <QuadrantPanel q="sage_fragile" label={QUADRANT_NAMES.sage_fragile} className="top-0 left-0 w-1/2 h-1/2" />
          <QuadrantPanel q="operateur_certitude" label={QUADRANT_NAMES.operateur_certitude} className="top-0 right-0 w-1/2 h-1/2" />
          <QuadrantPanel q="formateur_fantome" label={QUADRANT_NAMES.formateur_fantome} className="bottom-0 left-0 w-1/2 h-1/2" />
          <QuadrantPanel q="agence_commodite" label={QUADRANT_NAMES.agence_commodite} className="bottom-0 right-0 w-1/2 h-1/2" />

          {/* Axes Néon (Violet/Fuchsia) */}
          {/* Axe X - Horizontal */}
          <div className="absolute top-1/2 left-0 w-full h-px z-20"
               style={{ 
                 background: 'linear-gradient(90deg, rgba(139,92,246,0) 0%, rgba(139,92,246,0.5) 10%, rgba(217,70,239,0.5) 90%, rgba(217,70,239,0) 100%)',
                 boxShadow: '0 0 10px rgba(139,92,246,0.3), 0 0 20px rgba(217,70,239,0.3)'
               }} />
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 z-20" /> {/* Core line */}

          {/* Axe Y - Vertical */}
          <div className="absolute top-0 left-1/2 w-px h-full z-20"
               style={{ 
                 background: 'linear-gradient(180deg, rgba(139,92,246,0) 0%, rgba(139,92,246,0.5) 10%, rgba(217,70,239,0.5) 90%, rgba(217,70,239,0) 100%)',
                 boxShadow: '0 0 10px rgba(139,92,246,0.3), 0 0 20px rgba(217,70,239,0.3)'
               }} />
          <div className="absolute top-0 left-1/2 w-[1px] h-full bg-white/20 z-20" /> {/* Core line */}

          {/* Point d'intersection lumineux (Flare) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white z-30"
               style={{ boxShadow: '0 0 15px 5px rgba(217,70,239,0.5)' }} />

          {/* User Dot */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, type: 'spring', stiffness: 200, damping: 15 }}
            className="absolute w-8 h-8 -ml-4 -mb-4 rounded-full border-2 border-white z-40 flex items-center justify-center shadow-xl backdrop-blur-sm"
            style={{ 
              left: `${px}%`, 
              bottom: `${py}%`,
              backgroundColor: `${activeColor.primaryHex}dd`,
              boxShadow: `0 0 30px 10px ${activeColor.glow}`
            }}
          >
            {/* LED effect inside dot */}
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]" />
            
            {/* Ripple effect */}
            <motion.div 
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2"
              style={{ borderColor: activeColor.primaryHex }}
            />
          </motion.div>

        </div>
      </div>

      {/* Labels des Axes (Exterieurs) */}
      <div className="absolute -bottom-8 left-0 w-full flex justify-between px-8 text-[11px] font-mono text-neutral-500 uppercase tracking-widest font-semibold">
        <span>VOUS FAITES TOUT</span>
        <span>ON FAIT POUR VOUS</span>
      </div>
      
      <div className="absolute top-0 -left-12 h-full flex flex-col justify-between py-8 text-[11px] font-mono text-neutral-500 uppercase tracking-widest font-semibold" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
        <span>ESPOIR</span>
        <span>CERTITUDE</span>
      </div>

    </motion.div>
  )
}
