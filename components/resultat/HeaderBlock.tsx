'use client'

import { motion } from 'framer-motion'
import { ARCHETYPE_COLORS, QUADRANT_NAMES, QUADRANT_TAGLINES, MatrixScoringResult } from '@/lib/matrix-types'
import { useEffect, useState } from 'react'

export default function HeaderBlock({ scoring }: { scoring: MatrixScoringResult }) {
  const colorScheme = ARCHETYPE_COLORS[scoring.base.quadrant]
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    const duration = 1500
    const steps = 60
    const stepTime = duration / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep === steps) {
        setDisplayScore(scoring.base.certainty_score)
        clearInterval(timer)
      } else {
        const progress = currentStep / steps
        // Ease out expo
        const ease = 1 - Math.pow(1 - progress, 3)
        setDisplayScore(Math.round(scoring.base.certainty_score * ease))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [scoring.base.certainty_score])

  // Split name for two-tone styling (e.g., "Le Sage" + "Fragile")
  const words = QUADRANT_NAMES[scoring.base.quadrant].split(' ')
  const firstPart = words.slice(0, words.length - 1).join(' ')
  const lastPart = words[words.length - 1]

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative text-center space-y-8"
    >
      {/* Halo lumineux en background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full blur-[100px] opacity-20 pointer-events-none z-[-1]"
           style={{ backgroundColor: colorScheme.glow }} />

      <div 
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white/5 backdrop-blur-md"
        style={{ borderColor: `${colorScheme.primaryHex}40` }} // 25% opacity
      >
        <div 
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: colorScheme.primaryHex, boxShadow: `0 0 10px ${colorScheme.glow}` }}
        />
        <span 
          className="text-sm font-mono tracking-wide uppercase font-semibold"
          style={{ color: colorScheme.primaryHex }}
        >
          {colorScheme.badge}
        </span>
      </div>

      <div className="space-y-4">
        <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight">
          <span className="text-white">{firstPart} </span>
          <span style={{ color: colorScheme.primaryHex, textShadow: `0 0 40px ${colorScheme.glow}` }}>
            {lastPart}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto">
          {QUADRANT_TAGLINES[scoring.base.quadrant]}
        </p>
      </div>

      <div className="relative w-48 h-48 mx-auto mt-12 group">
        <div className="absolute inset-0 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-700"
             style={{ backgroundColor: colorScheme.primaryHex }} />
             
        <svg className="relative z-10 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-neutral-800"
            strokeWidth="2"
            fill="none"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            stroke={colorScheme.primaryHex}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * scoring.base.certainty_score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${colorScheme.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <span className="text-5xl font-display font-bold text-white tracking-tighter drop-shadow-lg">{displayScore}</span>
          <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest mt-1 text-center leading-tight px-2">Score<br/>de Certitude</span>
        </div>
      </div>
    </motion.div>
  )
}
