export interface User {
  id: string
  email: string
  first_name: string | null
  linkedin_url: string | null
  created_at: string
}

export interface QuizAnswers {
  situation: 'en_poste' | 'transition' | 'entrepreneur' | 'freelance'
  blocage: 'confiance' | 'execution' | 'temps' | 'clarte'
  motivation: 'liberte' | 'argent' | 'impact' | 'challenge'
  runway: 'moins_6_mois' | '6_12_mois' | 'plus_12_mois' | 'ne_sait_pas'
  objectif_revenus: '3_5k' | '5_10k' | '10k_plus'
  reaction_incertitude: 'analyse' | 'procrastine' | 'panique' | 'fonce'
  force: 'vision' | 'relation' | 'execution' | 'expertise'
  decision: 'data' | 'test' | 'conseil' | 'intuition'
}

export interface SousScores {
  clarte: { score: number; explication: string }
  confiance: { score: number; explication: string }
  execution: { score: number; explication: string }
  ressources: { score: number; explication: string }
}

export interface DiagnosticJson {
  score: number
  archetype: string
  archetype_name: string
  archetype_emoji: string
  archetype_description: string
  diagnostic_brutal: string
  forces: string[]
  angles_morts: string[]
  actions: Array<{
    titre: string
    contexte: string
    steps: string[]
    deadline: string
    template: string
    resultat_attendu: string
  }>
  anti_conseil: string
  piege_specifique: string
  sous_scores: SousScores
  score_breakdown: ScoreBreakdown
  variables_utilisees: string[]
}

export interface ScoreBreakdown {
  clarity: number
  confidence: number
  urgency: number
  resources: number
}

export interface Diagnostic {
  id: string
  user_id: string
  linkedin_data: Record<string, unknown> | null
  quiz_answers: QuizAnswers
  archetype: ArchetypeKey
  score: number
  score_breakdown: ScoreBreakdown
  diagnostic_json: DiagnosticJson
  created_at: string
  users?: User
}

export type ArchetypeKey = 
  | 'expert_technique'
  | 'batisseur_silencieux'
  | 'opportuniste_agile'
  | 'stratege_prudent'
  | 'connecteur'
  | 'createur_impact'

export const ARCHETYPE_CONFIG: Record<ArchetypeKey, { name: string; color: string; emoji: string }> = {
  expert_technique: { name: 'Expert Technique', color: '#C4B5FD', emoji: '🎯' },
  batisseur_silencieux: { name: 'Bâtisseur Silencieux', color: '#94A3B8', emoji: '🏗️' },
  opportuniste_agile: { name: 'Opportuniste Agile', color: '#FDE047', emoji: '⚡' },
  stratege_prudent: { name: 'Stratège Prudent', color: '#7DD3FC', emoji: '🧠' },
  connecteur: { name: 'Connecteur', color: '#FDBA74', emoji: '🤝' },
  createur_impact: { name: 'Créateur d\'Impact', color: '#6EE7B7', emoji: '🚀' },
}

export const BLOCAGE_LABELS: Record<string, string> = {
  confiance: 'Confiance',
  execution: 'Exécution',
  temps: 'Temps',
  clarte: 'Clarté',
}

export const MOTIVATION_LABELS: Record<string, string> = {
  liberte: 'Liberté',
  argent: 'Argent',
  impact: 'Impact',
  challenge: 'Challenge',
}

export const SITUATION_LABELS: Record<string, string> = {
  en_poste: 'En poste',
  transition: 'En transition',
  entrepreneur: 'Entrepreneur',
  freelance: 'Freelance',
}

export const RUNWAY_LABELS: Record<string, string> = {
  moins_6_mois: '< 6 mois',
  '6_12_mois': '6-12 mois',
  plus_12_mois: '> 12 mois',
  ne_sait_pas: 'Ne sait pas',
}

export const RUNWAY_COLORS: Record<string, string> = {
  moins_6_mois: '#FCA5A5',
  '6_12_mois': '#FDBA74',
  plus_12_mois: '#86EFAC',
  ne_sait_pas: '#D1D5DB',
}

export const OBJECTIF_LABELS: Record<string, string> = {
  '3_5k': '3-5k€',
  '5_10k': '5-10k€',
  '10k_plus': '10k€+',
}

export const REACTION_LABELS: Record<string, string> = {
  analyse: 'Analyse',
  procrastine: 'Procrastine',
  panique: 'Panique',
  fonce: 'Fonce',
}

export const TEST_EMAILS = ['mehdi.benchaffi@gmail.com', 'sbitimaria@gmail.com']
