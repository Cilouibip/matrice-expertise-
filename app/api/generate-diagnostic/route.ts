import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { z } from 'zod'
import { calculateMatrixScoring } from '@/lib/matrix-scoring'
import { CoreAnswers, BonusAnswers, Score, PainPoint } from '@/lib/matrix-types'

const ScoreSchema = z.preprocess(
  (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
  z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
)
const PainSchema = z.enum(['acquisition', 'marges', 'resultats', 'remplacable'])

const RequestSchema = z.object({
  coreAnswers: z.object({
    q1: ScoreSchema, q2: ScoreSchema, q3: ScoreSchema, q4: ScoreSchema,
    q5: ScoreSchema, q6: ScoreSchema, q7: ScoreSchema,
  }),
  bonusAnswers: z.object({
    q8: ScoreSchema, q9: ScoreSchema, q10: ScoreSchema, q11: PainSchema,
  }).nullable(),
})

const SYSTEM_PROMPT = `Tu es un stratège business spécialisé dans l'expertise et le consulting B2B.

Tu analyses la position d'un expert/consultant/coach sur la Matrice de Certitude 2026 et tu produis un diagnostic chirurgical, direct et actionnable.

## CONTEXTE DE LA MATRICE
La matrice a deux axes :
- Axe X : DIY (le client se débrouille) → DFY (l'expert fait pour/avec le client)
- Axe Y : Espoir (le résultat est incertain) → Certitude (le résultat est prédictible)

Les 4 cadrans :
- **L'Expert Fantôme** (bas-gauche, DIY+Espoir) : vend du savoir, zéro engagement résultat, zone de mort
- **L'Agence Commodité** (bas-droite, DFY+Espoir) : fait le boulot mais sans garantie, course vers le bas sur les prix
- **Le Sage Fragile** (haut-gauche, DIY+Certitude) : expert respecté mais business fragile, dépend de sa réputation personnelle
- **L'Opérateur de Certitude** (haut-droite, DFY+Certitude) : le Saint Graal, système qui produit des résultats prédictibles

## TON ET STYLE
- Direct, brutal mais bienveillant — comme un associé qui te dit la vérité
- Pas de langue de bois, pas de "c'est un bon début"
- Utilise le tutoiement
- Phrases courtes, percutantes
- Diagnostique le VRAI problème, pas le symptôme
- Chaque recommandation doit être faisable en 7-30 jours, pas en 6 mois

## INTERDITS
- Pas de "il est important de noter que"
- Pas de "dans un premier temps"
- Pas de bullet points génériques qui marchent pour tout le monde
- Pas de recommandation type "développe ta marque personnelle" ou "investis dans la formation continue"
- Pas de faux encouragements

## FORMAT DE RÉPONSE (JSON strict)
{
  "situation": "Analyse de la situation actuelle en 3-4 phrases maximum. Direct et factuel.",
  "pourquoi_bloque": "Le blocage principal en 2-3 phrases. Le VRAI problème, pas le symptôme.",
  "risque_concret": "Ce qui va se passer dans 6-12 mois si rien ne change. Spécifique et daté.",
  "forces": ["Force 1 spécifique", "Force 2 spécifique"],
  "angles_morts": ["Angle mort 1 spécifique", "Angle mort 2 spécifique"],
  "move_commando": {
    "title": "Titre action immédiate (cette semaine)",
    "description": "Description précise de ce qu'il doit faire, comment, et le résultat attendu. 3-5 phrases."
  },
  "move_builder": {
    "title": "Titre action structurante (ce mois)",
    "description": "Description précise de l'infrastructure à poser. 3-5 phrases."
  },
  "moat_global": 0,
  "moats": [
    {"name": "Tech", "score": 0},
    {"name": "Data", "score": 0},
    {"name": "Distribution", "score": 0}
  ],
  "ia_vulnerability": {
    "level": "critique|modérée|faible",
    "description": "Explication en 2 phrases de pourquoi l'IA est ou n'est pas une menace pour ce profil."
  },
  "axis_x": 0,
  "axis_y": 0,
  "variables": [
    {"name": "Proximité au revenu", "score": 0},
    {"name": "Vitesse de preuve", "score": 0},
    {"name": "Fiabilité système", "score": 0}
  ]
}

IMPORTANT : Renvoie UNIQUEMENT le JSON. Pas de texte avant ou après. Pas de backticks markdown.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = RequestSchema.parse(body)

    const scoring = calculateMatrixScoring(
      parsed.coreAnswers as CoreAnswers,
      parsed.bonusAnswers as BonusAnswers | null
    )

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const userPrompt = `Voici le profil d'un expert/consultant :

## POSITION SUR LA MATRICE
- Cadran : ${scoring.base.quadrant}
- Axe X (DIY→DFY) : ${scoring.base.axis_x}/4
- Axe Y (Espoir→Certitude) : ${scoring.base.axis_y}/4
- Score de certitude : ${scoring.base.certainty_score}/100

## VARIABLES
- Proximité au revenu : ${scoring.base.revenue_proximity}/4
- Vitesse de preuve : ${scoring.base.speed}/4
- Fiabilité système : ${scoring.base.reliability}/4

## RÉPONSES AU QUIZ
- Rétention (% CA clients fidèles) : ${parsed.coreAnswers.q1}/4
- Comportement post-presta : ${parsed.coreAnswers.q2}/4
- Modèle de pricing : ${parsed.coreAnswers.q3}/4
- Système de preuve : ${parsed.coreAnswers.q4}/4
- Ce qui reste chez le client : ${parsed.coreAnswers.q5}/4
- Dépendance au résultat : ${parsed.coreAnswers.q6}/4
- Fragilité acquisition : ${parsed.coreAnswers.q7}/4
${scoring.advanced ? `
## DONNÉES AVANCÉES (MOAT + IA)
- MOAT Tech : ${scoring.advanced.moat_tech}/4
- MOAT Data : ${scoring.advanced.moat_data}/4
- MOAT Distribution : ${scoring.advanced.moat_distribution}/4
- MOAT Global : ${scoring.advanced.moat_global}/4
- Vulnérabilité IA : ${scoring.advanced.ia_vulnerability}/4
- Douleur principale : ${scoring.advanced.pain_point}
` : ''}
## PROFONDEUR
Mode : ${parsed.bonusAnswers ? 'advanced' : 'standard'}

Génère le diagnostic complet en JSON.${scoring.advanced ? '' : ' Pour les champs MOAT et IA, utilise les données des questions core disponibles (Q5 pour moat_tech, Q7 pour moat_distribution) et mets moat_data à 0.'}`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userPrompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    
    // Parse JSON — gestion robuste
    let diagnosticJson
    try {
      diagnosticJson = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) {
        diagnosticJson = JSON.parse(match[0])
      } else {
        throw new Error('Claude response is not valid JSON')
      }
    }

    // Injecter les scores calculés dans le diagnostic
    diagnosticJson.axis_x = scoring.base.axis_x
    diagnosticJson.axis_y = scoring.base.axis_y
    diagnosticJson.variables = [
      { name: 'Proximité au revenu', score: scoring.base.revenue_proximity },
      { name: 'Vitesse de preuve', score: scoring.base.speed },
      { name: 'Fiabilité système', score: scoring.base.reliability },
    ]
    if (scoring.advanced) {
      diagnosticJson.moat_global = scoring.advanced.moat_global
      diagnosticJson.moats = [
        { name: 'Tech', score: scoring.advanced.moat_tech },
        { name: 'Data', score: scoring.advanced.moat_data },
        { name: 'Distribution', score: scoring.advanced.moat_distribution },
      ]
      diagnosticJson.ia_vulnerability = {
        level: scoring.advanced.ia_vulnerability >= 3 ? 'critique' : scoring.advanced.ia_vulnerability === 2 ? 'modérée' : 'faible',
        description: diagnosticJson.ia_vulnerability?.description || '',
      }
    }

    return NextResponse.json({
      success: true,
      scoring,
      diagnosticJson,
    })
  } catch (err: unknown) {
    console.error('[generate-diagnostic] Error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
