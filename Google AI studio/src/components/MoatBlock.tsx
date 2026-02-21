import { motion } from 'motion/react';
import { Cpu } from 'lucide-react';

export default function MoatBlock() {
  const dimensions = [
    { name: "Tech", value: 1.0 },
    { name: "Data", value: 0.5 },
    { name: "Distribution", value: 2.0 },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-10"
    >
      <div className="flex flex-col md:flex-row gap-12">
        {/* Global Score */}
        <div className="flex-shrink-0 space-y-6">
          <div>
            <h2 className="text-xl font-display font-semibold text-white mb-1">Avantages Défensifs</h2>
            <p className="text-neutral-500 text-sm font-mono uppercase tracking-wider">Analyse MOAT</p>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-display font-bold text-white">1.1</span>
            <span className="text-xl text-neutral-600">/ 4</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
            <Cpu className="w-4 h-4 text-red-400" />
            <span className="text-xs font-medium text-red-400">Vulnérabilité IA : Critique</span>
          </div>
        </div>

        {/* Dimensions */}
        <div className="flex-1 space-y-6">
          {dimensions.map((dim, i) => (
            <div key={dim.name} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-300">{dim.name}</span>
                <span className="text-neutral-500 font-mono">{dim.value.toFixed(1)}</span>
              </div>
              <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(dim.value / 4) * 100}%` }}
                  transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                  className="h-full bg-neutral-400"
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-neutral-500 leading-relaxed mt-6 pt-6 border-t border-white/5">
            Votre contenu peut être généré par un LLM en quelques secondes. Sans data propriétaire ni infrastructure technique complexe, vos barrières à l'entrée sont quasi-inexistantes.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
