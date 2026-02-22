'use client'

import { motion } from 'framer-motion'
import { ARCHETYPE_COLORS } from '@/lib/matrix-types'
import HeaderBlock from '@/components/resultat/HeaderBlock'
import MatrixBlock from '@/components/resultat/MatrixBlock'
import ScoreBlock from '@/components/resultat/ScoreBlock'
import DiagnosticBlock from '@/components/resultat/DiagnosticBlock'
import MovesBlock from '@/components/resultat/MovesBlock'
import MoatBlock from '@/components/resultat/MoatBlock'
import CtaBlock from '@/components/resultat/CtaBlock'

export default function ResultPage({ session }: { session: any }) {
  const colorScheme = ARCHETYPE_COLORS[session.quadrant as keyof typeof ARCHETYPE_COLORS]
  const diagnostic = session.diagnostic_json

  // Reconstruct scoring object for components
  const scoring = {
    base: {
      quadrant: session.quadrant,
      certainty_score: session.certainty_score,
      axis_x: session.axis_x,
      axis_y: session.axis_y,
    },
    advanced: session.diagnostic_depth === 'advanced' ? {
      moat_global: session.moat_global
    } : null
  } as any

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 selection:bg-red-500/30">
      {/* Glow background dynamique */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] blur-[120px] rounded-full opacity-30"
          style={{ backgroundColor: colorScheme.glow }}
        />
      </div>
      
      <main className="relative z-10 max-w-4xl mx-auto px-6 py-24 space-y-32">
        <HeaderBlock scoring={scoring} />
        <MatrixBlock x={session.axis_x} y={session.axis_y} quadrant={session.quadrant} />
        <ScoreBlock variables={diagnostic.variables} />
        <DiagnosticBlock diagnostic={diagnostic} />
        <MovesBlock diagnostic={diagnostic} />
        <MoatBlock scoring={scoring} diagnostic={diagnostic} />
        <CtaBlock />
      </main>
    </div>
  )
}
