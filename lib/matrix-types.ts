// Score brut d'une question (1-4)
export type Score = 1 | 2 | 3 | 4

// Douleur (Q11 — pas de score numérique)
export type PainPoint = 'acquisition' | 'marges' | 'resultats' | 'remplacable'

// Réponses core (Q1-Q7)
export interface CoreAnswers {
  q1: Score  // Rétention
  q2: Score  // Comportement post-presta
  q3: Score  // Modèle de pricing
  q4: Score  // Système de preuve
  q5: Score  // Ce qui reste (Builder)
  q6: Score  // Dépendance au résultat
  q7: Score  // Fragilité acquisition
}

// Réponses bonus (Q8-Q11)
export interface BonusAnswers {
  q8: Score      // MOAT Data
  q9: Score      // Vulnérabilité IA
  q10: Score     // Scalabilité
  q11: PainPoint // Douleur
}

// Quadrants possibles
export type Quadrant = 
  | 'formateur_fantome'      // bas-gauche (DIY + Espoir) — ROUGE
  | 'agence_commodite'       // bas-droite (DFY + Espoir) — JAUNE/AMBER
  | 'sage_fragile'           // haut-gauche (DIY + Certitude) — VIOLET
  | 'operateur_certitude'    // haut-droite (DFY + Certitude) — VERT

// Scoring de base (toujours calculé)
export interface MatrixBaseScoring {
  axis_x: number              // 1-4 (DIY → DFY)
  axis_y: number              // 1-4 (Espoir → Certitude)
  revenue_proximity: Score    // Q3
  speed: Score                // Q4
  reliability: Score          // Q6
  certainty_score: number     // 0-100
  quadrant: Quadrant
}

// Scoring avancé (si advanced)
export interface MatrixAdvancedScoring {
  moat_tech: Score           // Q5
  moat_data: Score           // Q8
  moat_distribution: Score   // Q7
  moat_global: number        // moyenne
  ia_vulnerability: Score    // 5 - Q9
  pain_point: PainPoint      // Q11
}

// Résultat complet du scoring
export interface MatrixScoringResult {
  base: MatrixBaseScoring
  advanced: MatrixAdvancedScoring | null
  debug: {
    raw_certainty: number
    cap_applied: boolean
    cap_reason: string | null
    axis_y_cap_applied: boolean
    axis_y_cap_reason: string | null
  }
}

// Session complète pour Supabase
export interface MatriceSessionInsert {
  user_email: string
  first_name: string | null
  diagnostic_depth: 'standard' | 'advanced'
  core_answers: CoreAnswers
  bonus_answers: BonusAnswers | null
  axis_x: number
  axis_y: number
  certainty_score: number
  revenue_proximity: number
  speed_score: number
  reliability_score: number
  moat_tech: number | null
  moat_data: number | null
  moat_distribution: number | null
  moat_global: number | null
  ia_vulnerability: number | null
  pain_point: string | null
  quadrant: string
  diagnostic_json: Record<string, unknown>
  scoring_debug: Record<string, unknown> | null
}

// Couleurs par archétype (pour le design)
export interface ArchetypeColors {
  primary: string
  primaryHex: string
  tailwind: string
  gradient: string
  glow: string
  badge: string
  badgeIcon: 'alert' | 'sparkle' | 'shield' | 'trending-down'
}

export const ARCHETYPE_COLORS: Record<Quadrant, ArchetypeColors> = {
  formateur_fantome: {
    primary: 'rgb(239, 68, 68)',
    primaryHex: '#EF4444',
    tailwind: 'red',
    gradient: 'from-red-400 to-red-600',
    glow: 'rgba(239, 68, 68, 0.2)',
    badge: 'Alerte Critique',
    badgeIcon: 'alert',
  },
  sage_fragile: {
    primary: 'rgb(139, 92, 246)',
    primaryHex: '#8B5CF6',
    tailwind: 'violet',
    gradient: 'from-violet-400 to-violet-600',
    glow: 'rgba(139, 92, 246, 0.2)',
    badge: 'Attention Requise',
    badgeIcon: 'trending-down',
  },
  operateur_certitude: {
    primary: 'rgb(16, 185, 129)',
    primaryHex: '#10B981',
    tailwind: 'emerald',
    gradient: 'from-emerald-400 to-emerald-600',
    glow: 'rgba(16, 185, 129, 0.2)',
    badge: 'Position Solide',
    badgeIcon: 'shield',
  },
  agence_commodite: {
    primary: 'rgb(245, 158, 11)',
    primaryHex: '#F59E0B',
    tailwind: 'amber',
    gradient: 'from-amber-400 to-amber-600',
    glow: 'rgba(245, 158, 11, 0.2)',
    badge: 'Zone de Risque',
    badgeIcon: 'trending-down',
  },
}

// Noms et taglines
export const QUADRANT_NAMES: Record<Quadrant, string> = {
  formateur_fantome: "L'Expert Fantôme",
  sage_fragile: 'Le Sage Fragile',
  operateur_certitude: "L'Opérateur de Certitude",
  agence_commodite: "L'Agence Commodité",
}

export const QUADRANT_TAGLINES: Record<Quadrant, string> = {
  formateur_fantome: 'Zone de mort',
  sage_fragile: 'Expert respecté, business fragile',
  operateur_certitude: 'Le Saint Graal',
  agence_commodite: 'Course vers le bas',
}
