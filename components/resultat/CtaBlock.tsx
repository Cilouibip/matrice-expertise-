'use client'

import { motion } from 'framer-motion'

export default function CtaBlock() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center space-y-8 py-12"
    >
      <h3 className="text-3xl md:text-4xl font-display font-bold text-white">
        Tu veux bouger sur la matrice ?
      </h3>
      <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
        15 minutes. On regarde ta situation. On identifie le premier move. Pas de pitch, pas de bullshit.
      </p>
      
      <a 
        href="https://calendly.com/mehdi-zen/appel-turbo" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-xl font-medium text-lg hover:bg-neutral-200 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        Réserver mes 15 minutes →
      </a>
      
      <p className="text-sm text-neutral-600">
        Gratuit. Pas de blabla. Juste ton prochain move.
      </p>
    </motion.div>
  )
}
