import { motion } from 'motion/react';
import { Zap, Hammer } from 'lucide-react';

export default function MovesBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-display font-semibold text-white mb-8">Vos Prochains Moves</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Move Commando */}
        <div className="group relative bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-neutral-300 text-xs font-mono uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Cette semaine
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Move Commando</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Contactez vos 3 meilleurs clients actuels. Proposez-leur de faire le travail "Done-For-You" gratuitement en échange d'une étude de cas vidéo irréfutable.
            </p>
          </div>
        </div>

        {/* Move Builder */}
        <div className="group relative bg-[#0a0a0a] border border-white/10 hover:border-white/20 rounded-2xl p-8 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Hammer className="w-24 h-24 text-white" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-white/5 text-neutral-300 text-xs font-mono uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Ce mois
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Move Builder</h3>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Restructurez votre offre principale. Passez d'un accès à vie à un programme de 90 jours axé sur un seul résultat mesurable, avec une garantie conditionnelle.
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
