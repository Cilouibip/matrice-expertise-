import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function CtaBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 text-center space-y-8"
    >
      <div className="space-y-4">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
          Prêt à passer à l'action ?
        </h2>
        <p className="text-xl text-neutral-400 font-light">
          30 minutes. Pas de bullshit. Juste un plan.
        </p>
      </div>

      <button className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-medium text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95">
        <span className="relative z-10">Réserver mon appel stratégique</span>
        <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
        <div className="absolute inset-0 bg-neutral-200 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      </button>
      
      <p className="text-xs text-neutral-600 font-mono uppercase tracking-widest mt-8">
        Places limitées à 5 par semaine
      </p>
    </motion.section>
  );
}
