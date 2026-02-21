import { motion } from 'motion/react';
import { AlertOctagon } from 'lucide-react';

export default function DiagnosticBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      <div className="max-w-none">
        <div className="mb-8">
          <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-wider mb-4">Votre situation</h3>
          <p className="text-lg text-neutral-300 leading-relaxed">
            Vous vendez de l'information, pas de la transformation. Votre modèle repose sur l'espoir que vos clients appliqueront vos conseils. Le marché a évolué : l'information est devenue une commodité gratuite. Vos prospects le savent, et c'est pour cela que vos taux de conversion s'effondrent.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-mono text-neutral-500 uppercase tracking-wider mb-4">Pourquoi vous êtes bloqué</h3>
          <p className="text-lg text-neutral-300 leading-relaxed">
            Votre offre manque de "Done-For-You" (DFY) ou de "Done-With-You" (DWY) structuré. Sans garantie de résultat ni système de delivery qui force le succès du client, vous êtes perçu comme un coût optionnel, pas comme un investissement certain.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/5 p-6 md:p-8">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <div className="flex items-start gap-4">
            <AlertOctagon className="w-6 h-6 text-red-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-sm font-mono text-red-400 uppercase tracking-wider mb-2">Le risque concret</h3>
              <p className="text-red-200/80 leading-relaxed">
                Si vous ne pivotez pas vers un modèle à haute certitude dans les 6 prochains mois, votre coût d'acquisition dépassera votre Life-Time Value (LTV). Votre business modèle est mathématiquement programmé pour mourir face à l'augmentation des coûts publicitaires et à l'exigence croissante du marché.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
