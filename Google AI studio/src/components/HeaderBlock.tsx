import { motion } from 'motion/react';
import { AlertTriangle } from 'lucide-react';

export default function HeaderBlock() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center space-y-8"
    >
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono uppercase tracking-widest">
        <AlertTriangle className="w-3 h-3" />
        <span>Alerte Critique</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight text-white">
          Le Formateur <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600">
            Fantôme
          </span>
        </h1>
        <p className="text-xl text-neutral-400 font-light tracking-wide uppercase">
          Zone de mort
        </p>
      </div>

      <div className="relative mt-12">
        <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full" />
        <div className="relative flex flex-col items-center justify-center w-48 h-48 rounded-full border border-red-500/30 bg-[#0a0a0a] shadow-[inset_0_0_40px_rgba(239,68,68,0.1)]">
          <span className="text-6xl font-display font-bold text-white">13</span>
          <span className="text-sm text-neutral-500 font-mono">/ 100</span>
          <span className="absolute -bottom-3 bg-[#050505] px-4 text-xs font-mono text-neutral-400 border border-neutral-800 rounded-full py-1">
            CERTITUDE
          </span>
        </div>
      </div>
    </motion.section>
  );
}
