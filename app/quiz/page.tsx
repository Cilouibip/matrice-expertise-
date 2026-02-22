'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { CoreAnswers, BonusAnswers, Score, PainPoint } from '@/lib/matrix-types'

type Step = 'core' | 'upsell' | 'bonus' | 'email' | 'loading'

const CORE_QUESTIONS = [
  {
    id: 'q1',
    text: "Quel pourcentage de votre CA vient de clients qui re-signent dans les 12 mois ?",
    options: [
      { value: 1, label: "Moins de 10%" },
      { value: 2, label: "10-30%" },
      { value: 3, label: "30-60%" },
      { value: 4, label: "Plus de 60%" }
    ]
  },
  {
    id: 'q2',
    text: "Votre dernier client a eu un problème après votre prestation. Concrètement, qu'est-ce qui s'est passé ?",
    options: [
      { value: 1, label: "Il ne m'a pas recontacté, notre mission était terminée" },
      { value: 2, label: "Il m'a envoyé un message, j'ai répondu par email/vocal" },
      { value: 3, label: "On avait un point de suivi planifié, on a traité le problème ensemble" },
      { value: 4, label: "Un outil ou un process que j'avais mis en place a détecté le problème automatiquement" }
    ]
  },
  {
    id: 'q3',
    text: "Comment vous facturez vos clients ?",
    options: [
      { value: 1, label: "Au temps passé (TJM, taux horaire)" },
      { value: 2, label: "Au forfait projet (périmètre et prix fixés à l'avance)" },
      { value: 3, label: "En abonnement mensuel (retainer, accompagnement continu)" },
      { value: 4, label: "En partie variable, indexée sur un KPI ou un résultat du client" }
    ]
  },
  {
    id: 'q4',
    text: "Un prospect vous demande : 'Qu'est-ce qui me prouve que ça va marcher ?' — vous répondez quoi ?",
    options: [
      { value: 1, label: "Je lui montre mon parcours, mes certifications, mes témoignages" },
      { value: 2, label: "Je lui explique ma méthode pas à pas et pourquoi elle est différente" },
      { value: 3, label: "Je lui montre des résultats chiffrés de clients dans une situation similaire" },
      { value: 4, label: "Je lui propose un premier sprint court avec un objectif mesurable avant tout engagement long" }
    ]
  },
  {
    id: 'q5',
    text: "Quand votre prestation est terminée, qu'est-ce qui reste concrètement chez votre client ?",
    options: [
      { value: 1, label: "Des notes, un PDF, un replay ou un document" },
      { value: 2, label: "Un plan d'action ou une méthode qu'il peut suivre" },
      { value: 3, label: "Des templates ou outils configurés qu'il utilise au quotidien" },
      { value: 4, label: "Un système automatisé (dashboard, CRM, automations) qui tourne sans moi" }
    ]
  },
  {
    id: 'q6',
    text: "Le résultat que vous livrez dépend principalement de quoi ?",
    options: [
      { value: 1, label: "De la motivation et de l'implication du client" },
      { value: 2, label: "De la qualité de mon exécution personnelle" },
      { value: 3, label: "Du volume d'opportunités disponibles sur le marché du client" },
      { value: 4, label: "D'un process outillé avec des données et des boucles de contrôle" }
    ]
  },
  {
    id: 'q7',
    text: "Si demain votre canal d'acquisition principal se coupe, vous avez quoi en backup ?",
    options: [
      { value: 1, label: "Rien, je recommence à prospecter de zéro" },
      { value: 2, label: "Mon réseau personnel, je recontacte des gens un par un" },
      { value: 3, label: "J'ai du contenu organique (YouTube, newsletter, LinkedIn) qui génère des leads sans moi" },
      { value: 4, label: "J'ai plusieurs canaux actifs en parallèle dont de l'organique qui scale" }
    ]
  }
]

const BONUS_QUESTIONS = [
  {
    id: 'q8',
    text: "Est-ce que vous avez des données structurées sur les résultats de vos clients passés ?",
    options: [
      { value: 1, label: "Non, je n'ai pas vraiment suivi ça" },
      { value: 2, label: "J'ai quelques témoignages et retours informels" },
      { value: 3, label: "J'ai des métriques clés pour la plupart de mes clients" },
      { value: 4, label: "J'ai une base de données avec des benchmarks, des patterns et des résultats comparables" }
    ]
  },
  {
    id: 'q9',
    text: "Qu'est-ce qui est documenté et systématisé dans votre activité aujourd'hui ?",
    options: [
      { value: 1, label: "Presque rien, tout est dans ma tête" },
      { value: 2, label: "J'ai quelques process écrits et des templates" },
      { value: 3, label: "J'ai des process documentés, des SOPs, et des outils qui font une partie du travail" },
      { value: 4, label: "J'ai un système complet : process, data, automations, outils propriétaires" }
    ]
  },
  {
    id: 'q10',
    text: "Combien de clients pouvez-vous gérer simultanément sans que la qualité baisse ?",
    options: [
      { value: 1, label: "1 à 3" },
      { value: 2, label: "4 à 8" },
      { value: 3, label: "9 à 15" },
      { value: 4, label: "Plus de 15" }
    ]
  },
  {
    id: 'q11',
    text: "Qu'est-ce qui vous met le plus sous pression en ce moment ?",
    options: [
      { value: "acquisition", label: "Mon acquisition est instable, je ne sais pas d'où vient le prochain client" },
      { value: "marges", label: "Mes marges sont trop basses, je travaille trop pour ce que je gagne" },
      { value: "resultats", label: "Mes clients n'appliquent pas ou les résultats sont irréguliers" },
      { value: "remplacable", label: "Je sens que ce que je fais est remplaçable" }
    ]
  }
]

export default function QuizPage() {
  const router = useRouter()
  
  const [step, setStep] = useState<Step>('core')
  const [coreIndex, setCoreIndex] = useState(0)
  const [bonusIndex, setBonusIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const [coreAnswers, setCoreAnswers] = useState<Record<string, number>>({})
  const [bonusAnswers, setBonusAnswers] = useState<Record<string, number | string>>({})
  const [wantsAdvanced, setWantsAdvanced] = useState(false)
  
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleCoreSelect = (value: number) => {
    // Prevent out of bounds and double-clicks
    if (isTransitioning || coreIndex >= CORE_QUESTIONS.length) return
    setIsTransitioning(true)
    
    const qId = CORE_QUESTIONS[coreIndex].id
    setCoreAnswers(prev => ({ ...prev, [qId]: value }))
    
    setTimeout(() => {
      if (coreIndex < CORE_QUESTIONS.length - 1) {
        setCoreIndex(prev => prev + 1)
      } else {
        setStep('upsell')
      }
      setIsTransitioning(false)
    }, 200)
  }

  const handleBonusSelect = (value: number | string) => {
    // Prevent out of bounds and double-clicks
    if (isTransitioning || bonusIndex >= BONUS_QUESTIONS.length) return
    setIsTransitioning(true)
    
    const qId = BONUS_QUESTIONS[bonusIndex].id
    setBonusAnswers(prev => ({ ...prev, [qId]: value }))
    
    setTimeout(() => {
      if (bonusIndex < BONUS_QUESTIONS.length - 1) {
        setBonusIndex(prev => prev + 1)
      } else {
        setStep('email')
      }
      setIsTransitioning(false)
    }, 200)
  }

  const submitQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError("L'email est requis pour recevoir le diagnostic.")
      return
    }
    
    setStep('loading')
    
    // Format payload cleanly ensuring types are correct
    const payload = {
      coreAnswers: coreAnswers as unknown as CoreAnswers,
      bonusAnswers: wantsAdvanced ? (bonusAnswers as unknown as BonusAnswers) : null
    }

    // Temporary debug log as requested
    console.log('SUBMIT PAYLOAD:', JSON.stringify(payload, null, 2))
    
    try {
      // 1. Generate Diagnostic
      const diagRes = await fetch('/api/generate-diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      
      const diagData = await diagRes.json()
      
      if (!diagData.success) {
        throw new Error(diagData.error || "Erreur lors du diagnostic")
      }
      
      // 2. Save Session
      const saveRes = await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: email,
          firstName,
          coreAnswers: payload.coreAnswers,
          bonusAnswers: payload.bonusAnswers,
          scoring: diagData.scoring,
          diagnosticJson: diagData.diagnosticJson
        })
      })
      
      const saveData = await saveRes.json()
      
      if (!saveData.success) {
        throw new Error(saveData.error || "Erreur lors de la sauvegarde")
      }
      
      router.push(`/resultat/${saveData.sessionId}`)
      
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Une erreur est survenue.")
      setStep('email') // Go back to email step on error
    }
  }

  // --- RENDERS ---

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-200 selection:bg-white/30 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <AnimatePresence mode="wait">

          {step === 'core' && coreIndex < CORE_QUESTIONS.length && (
            <motion.div
              key={`core-${coreIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 text-sm font-mono text-neutral-500">
                <span>{coreIndex + 1} / {CORE_QUESTIONS.length}</span>
                <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${((coreIndex + 1) / CORE_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-medium text-white leading-tight">
                {CORE_QUESTIONS[coreIndex].text}
              </h2>

              <div className="space-y-3">
                {CORE_QUESTIONS[coreIndex].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleCoreSelect(opt.value as number)}
                    disabled={isTransitioning}
                    className="w-full text-left p-5 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-white/20 hover:bg-white/5 active:scale-[0.98] transition-all focus:border-white/40 focus:bg-white/10 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'upsell' && (
            <motion.div
              key="upsell"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="text-center space-y-8 bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-2xl"
            >
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-display font-bold text-white">
                Votre diagnostic de base est prêt.
              </h2>
              <p className="text-lg text-neutral-400 max-w-lg mx-auto">
                4 questions de plus en 60 secondes pour débloquer votre score de vulnérabilité IA et votre niveau de MOAT.
              </p>
              
              <div className="flex flex-col gap-4 pt-4">
                <button
                  onClick={() => {
                    setWantsAdvanced(true)
                    setStep('bonus')
                  }}
                  className="w-full bg-white text-black px-6 py-4 rounded-xl font-medium hover:bg-neutral-200 transition-colors"
                >
                  Continuer vers le diagnostic avancé (Recommandé)
                </button>
                <button
                  onClick={() => {
                    setWantsAdvanced(false)
                    setStep('email')
                  }}
                  className="w-full px-6 py-4 rounded-xl font-medium text-neutral-400 hover:text-white transition-colors"
                >
                  Non merci, voir mon résultat de base
                </button>
              </div>
            </motion.div>
          )}

          {step === 'bonus' && bonusIndex < BONUS_QUESTIONS.length && (
            <motion.div
              key={`bonus-${bonusIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4 text-sm font-mono text-neutral-500">
                <span className="text-emerald-500">Bonus {bonusIndex + 1} / {BONUS_QUESTIONS.length}</span>
                <div className="flex-1 h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${((bonusIndex + 1) / BONUS_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-display font-medium text-white leading-tight">
                {BONUS_QUESTIONS[bonusIndex].text}
              </h2>

              <div className="space-y-3">
                {BONUS_QUESTIONS[bonusIndex].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleBonusSelect(opt.value)}
                    disabled={isTransitioning}
                    className="w-full text-left p-5 rounded-xl border border-white/10 bg-[#0a0a0a] hover:border-white/20 hover:bg-white/5 active:scale-[0.98] transition-all focus:border-white/40 focus:bg-white/10 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-white/10 p-8 md:p-12 rounded-2xl"
            >
              <h2 className="text-3xl font-display font-bold text-white mb-2">
                Où envoyer votre diagnostic ?
              </h2>
              <p className="text-neutral-400 mb-8">
                L'IA va générer votre position sur la matrice et vos recommandations.
              </p>
              
              <form onSubmit={submitQuiz} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Prénom (Optionnel)
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-400 mb-2">
                      Email professionnel
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="vous@entreprise.com"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-white text-black px-6 py-4 rounded-xl font-medium hover:bg-neutral-200 transition-colors mt-8"
                >
                  Générer mon diagnostic →
                </button>
              </form>
            </motion.div>
          )}

          {step === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="w-16 h-16 mx-auto relative">
                <div className="absolute inset-0 rounded-full border-4 border-white/10" />
                <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-medium text-white">
                  Analyse en cours...
                </h2>
                <p className="text-neutral-500 font-mono text-sm">
                  Génération du rapport par l'IA
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
