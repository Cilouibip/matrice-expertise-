import { motion } from 'motion/react';
import { BookOpen, ShieldCheck, Ghost, Briefcase } from 'lucide-react';

export default function MatrixBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold text-white">Matrice de Positionnement</h2>
        <p className="text-neutral-400 text-sm">Où vous vous situez sur le marché actuel.</p>
      </div>

      <div className="relative aspect-square md:aspect-[3/2] w-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 overflow-hidden">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-px bg-white/10" />
          <div className="absolute h-full w-px bg-white/10" />
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-[#0a0a0a] px-2">Certitude</div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-[#0a0a0a] px-2">Espoir</div>
        <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-[#0a0a0a] px-2">DIY (Vous faites)</div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-[10px] font-mono text-neutral-500 uppercase tracking-widest bg-[#0a0a0a] px-2">DFY (On fait)</div>

        {/* Quadrants */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 p-12 gap-4">
          {/* Top Left: Sage Fragile */}
          <div className="relative flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
            <BookOpen className="w-6 h-6 text-blue-400 mb-2" />
            <span className="text-xs font-medium text-neutral-300">Sage Fragile</span>
          </div>
          
          {/* Top Right: Opérateur de Certitude */}
          <div className="relative flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
            <div className="absolute inset-0 bg-emerald-500/5 rounded-xl blur-xl" />
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
            <span className="text-xs font-medium text-emerald-300">Opérateur de Certitude</span>
          </div>

          {/* Bottom Left: Formateur Fantôme (Active) */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-red-500/10 rounded-xl blur-xl" />
            <Ghost className="w-6 h-6 text-red-500 mb-2" />
            <span className="text-xs font-medium text-red-400">Formateur Fantôme</span>
            
            {/* User Position Marker */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute left-[30%] bottom-[30%] w-4 h-4 bg-red-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.8)] ring-4 ring-red-500/20"
            />
          </div>

          {/* Bottom Right: Agence Commodité */}
          <div className="relative flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
            <Briefcase className="w-6 h-6 text-orange-400 mb-2" />
            <span className="text-xs font-medium text-neutral-300">Agence Commodité</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
