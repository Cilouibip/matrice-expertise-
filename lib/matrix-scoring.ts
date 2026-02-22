import { CoreAnswers, BonusAnswers, MatrixScoringResult, Quadrant, Score } from './matrix-types'

export function calculateMatrixScoring(
  core: CoreAnswers,
  bonus: BonusAnswers | null
): MatrixScoringResult {
  // --- AXE X (DIY → DFY) ---
  let axis_x = (core.q2 + core.q5) / 2

  // --- AXE Y (Espoir → Certitude) ---
  let axis_y = (core.q1 + core.q3) / 2
  let axis_y_cap_applied = false
  let axis_y_cap_reason: string | null = null

  // Règle de CAP Y
  if (core.q3 === 1 && core.q1 >= 3) {
    axis_y = Math.min(axis_y, 2.5)
    axis_y_cap_applied = true
    axis_y_cap_reason = 'TJM + haute récurrence → cap Y à 2.5'
  }
  if (core.q1 === 1) {
    axis_y = Math.min(axis_y, 2.0)
    axis_y_cap_applied = true
    axis_y_cap_reason = 'Récurrence < 10% → cap Y à 2.0'
  }

  // --- VARIABLES ---
  const revenue_proximity: Score = core.q3
  const speed: Score = core.q4
  const reliability: Score = core.q6

  // --- CERTITUDE ---
  const certainty_raw = revenue_proximity * speed * reliability
  let certainty_score = Math.round((certainty_raw / 64) * 100)
  let cap_applied = false
  let cap_reason: string | null = null

  if (revenue_proximity === 1 || speed === 1 || reliability === 1) {
    certainty_score = Math.min(certainty_score, 15)
    cap_applied = true
    cap_reason = `Variable à 1 détectée (rev:${revenue_proximity}, spd:${speed}, rel:${reliability})` 
  }

  // --- QUADRANT ---
  const quadrant = determineQuadrant(axis_x, axis_y)

  // --- MOAT (si advanced) ---
  let advanced = null
  if (bonus) {
    const moat_tech: Score = core.q5  // réutilisation Q5
    const moat_data: Score = bonus.q8
    const moat_distribution: Score = core.q7  // réutilisation Q7
    const moat_global = (moat_tech + moat_data + moat_distribution) / 3
    const ia_vulnerability = (5 - bonus.q9) as Score

    advanced = {
      moat_tech,
      moat_data,
      moat_distribution,
      moat_global: Math.round(moat_global * 100) / 100,
      ia_vulnerability,
      pain_point: bonus.q11,
    }
  }

  return {
    base: {
      axis_x: Math.round(axis_x * 100) / 100,
      axis_y: Math.round(axis_y * 100) / 100,
      revenue_proximity,
      speed,
      reliability,
      certainty_score,
      quadrant,
    },
    advanced,
    debug: {
      raw_certainty: certainty_raw,
      cap_applied,
      cap_reason,
      axis_y_cap_applied,
      axis_y_cap_reason,
    },
  }
}

function determineQuadrant(x: number, y: number): Quadrant {
  const isRight = x >= 2.5
  const isTop = y >= 2.5

  if (!isRight && !isTop) return 'formateur_fantome'
  if (isRight && !isTop) return 'agence_commodite'
  if (!isRight && isTop) return 'sage_fragile'
  return 'operateur_certitude'
}
