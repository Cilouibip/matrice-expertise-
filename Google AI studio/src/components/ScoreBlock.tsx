import { motion } from 'motion/react';

export default function ScoreBlock() {
  const scores = [
    { name: "Clarté de l'offre", value: 25, status: "low" },
    { name: "Preuve de résultat", value: 10, status: "critical" },
    { name: "Système de delivery", value: 4, status: "critical" },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="md:col-span-1 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
        <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-wider mb-8">Score Global</h3>
        <div>
          <div className="text-5xl font-display font-bold text-white mb-2">13<span className="text-2xl text-neutral-600">/100</span></div>
          <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "13%" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-red-500" 
            />
          </div>
        </div>
      </div>

      <div className="md:col-span-2 bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 space-y-6">
        <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-wider">Décomposition</h3>
        <div className="space-y-4">
          {scores.map((score, i) => (
            <div key={score.name} className="flex items-center gap-4">
              <div className="w-40 text-xs font-medium text-neutral-300">{score.name}</div>
              <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden relative">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${score.value}%` }}
                  transition={{ duration: 1, delay: 0.3 + (i * 0.1) }}
                  className={`absolute top-0 left-0 h-full rounded-full ${score.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'}`}
                />
              </div>
              <div className={`w-8 text-right text-xs font-mono ${score.status === 'critical' ? 'text-red-400' : 'text-orange-400'}`}>
                {score.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
