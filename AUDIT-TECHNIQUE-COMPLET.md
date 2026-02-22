# AUDIT TECHNIQUE COMPLET — Matrice de l'Expertise 2026

**Date**: 22 février 2026
**Objectif**: Comprendre l'architecture complète avant toute modification de copywriting
**Status**: ✅ Aucune modification effectuée — Documentation pure

---

## 1. ARCHITECTURE GÉNÉRALE

### Stack Technique

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Framework Front** | Next.js (App Router) | 16.1.4 |
| **Runtime** | React | 19.2.3 |
| **Language** | TypeScript | ^5 |
| **Base de données** | Supabase (PostgreSQL) | SDK 2.91.0 |
| **IA** | Anthropic Claude | SDK 0.71.2 (Modèle: claude-sonnet-4-20250514) |
| **Styling** | Tailwind CSS | ^4 |
| **Animations** | Framer Motion | 12.28.1 |
| **Validation** | Zod | 4.3.5 |
| **Icônes** | Lucide React | 0.562.0 |
| **Hosting** | Vercel (implicite, Next.js déployé standard) | - |

### Arborescence des Fichiers Clés

```
matrice-expertise/
├── app/
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout + meta tags
│   ├── globals.css                       # Styles globaux
│   ├── quiz/
│   │   └── page.tsx                      # Quiz (7 questions core + 4 bonus)
│   ├── resultat/[id]/
│   │   ├── page.tsx                      # Server component (fetch data)
│   │   └── ResultPage.tsx                # Client component (affichage)
│   ├── retrouver/
│   │   └── page.tsx                      # Recherche par email
│   └── api/
│       ├── generate-diagnostic/route.ts  # Appel Claude + scoring
│       ├── save-result/route.ts          # Sauvegarde Supabase + Systeme.io
│       └── retrouver/route.ts            # API retrouver (non utilisée côté client)
├── components/
│   └── resultat/
│       ├── HeaderBlock.tsx               # Archetype + Score circulaire
│       ├── MatrixBlock.tsx               # Matrice 2×2 avec position
│       ├── ScoreBlock.tsx                # Variables de certitude
│       ├── DiagnosticBlock.tsx           # Diagnostic brutal (3 cartes)
│       ├── MovesBlock.tsx                # Move Commando + Builder
│       ├── MoatBlock.tsx                 # MOAT + Vulnérabilité IA
│       └── CtaBlock.tsx                  # CTA Calendly final
├── lib/
│   ├── matrix-types.ts                   # Types, noms quadrants, couleurs
│   └── matrix-scoring.ts                 # Logique de calcul scoring
├── supabase/
│   └── schema.sql                        # Schéma DB (2 tables)
├── .env.local                            # Variables d'environnement (secrets)
└── .env.example                          # Template variables env
```

### Hébergement & Environnement

- **Front + API**: Vercel (déployé automatiquement via Git push)
- **Base de données**: Supabase (cloud PostgreSQL)
- **IA**: Anthropic API (Claude Sonnet 4)
- **CRM**: Systeme.io (intégration via API)

**Variables d'environnement requises**:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
ANTHROPIC_API_KEY
SYSTEME_API_KEY (optionnel)
SYSTEME_TAG_MATRICE_ID (optionnel)
```

---

## 2. BASE DE DONNÉES (Supabase)

### Table `matrice_sessions`

**Fichier**: `supabase/schema.sql` (lignes 3-37)

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | UUID | Non | PK, auto-généré |
| `created_at` | TIMESTAMP WITH TIME ZONE | Non | Default NOW() |
| `user_email` | VARCHAR(255) | Non | Email capturé |
| `first_name` | VARCHAR(100) | Oui | Prénom optionnel |
| `diagnostic_depth` | VARCHAR(20) | Non | 'standard' ou 'advanced' |
| `core_answers` | JSONB | Non | Réponses Q1-Q7 |
| `bonus_answers` | JSONB | Oui | Réponses Q8-Q11 (si advanced) |
| `axis_x` | NUMERIC | Non | Position X sur matrice (1-4) |
| `axis_y` | NUMERIC | Non | Position Y sur matrice (1-4) |
| `certainty_score` | INTEGER | Non | Score /100 |
| `quadrant` | VARCHAR(50) | Non | Nom du quadrant |
| `revenue_proximity` | NUMERIC | Non | Variable 1 (Q3) |
| `speed_score` | NUMERIC | Non | Variable 2 (Q4) |
| `reliability_score` | NUMERIC | Non | Variable 3 (Q6) |
| `moat_tech` | NUMERIC | Oui | Q5 (si advanced) |
| `moat_data` | NUMERIC | Oui | Q8 (si advanced) |
| `moat_distribution` | NUMERIC | Oui | Q7 (si advanced) |
| `moat_global` | INTEGER | Oui | Moyenne MOAT |
| `ia_vulnerability` | INTEGER | Oui | 5 - Q9 (si advanced) |
| `pain_point` | VARCHAR(50) | Oui | Q11 (si advanced) |
| `diagnostic_json` | JSONB | Non | Réponse complète de Claude |
| `scoring_debug` | JSONB | Oui | Debug info (caps, etc.) |

**Index**:
- `idx_matrice_sessions_email` sur `user_email`

### Table `matrice_answer_events`

**Fichier**: `supabase/schema.sql` (lignes 39-46)

| Colonne | Type | Nullable | Description |
|---------|------|----------|-------------|
| `id` | UUID | Non | PK, auto-généré |
| `created_at` | TIMESTAMP WITH TIME ZONE | Non | Default NOW() |
| `session_id` | UUID | Non | FK → matrice_sessions(id) |
| `question_key` | VARCHAR(10) | Non | 'q1', 'q2', etc. |
| `answer_value` | VARCHAR(50) | Non | Valeur réponse (string) |
| `is_bonus` | BOOLEAN | Non | Default false |

**Index**:
- `idx_matrice_answer_events_session` sur `session_id`

**Relation**: ON DELETE CASCADE (si session supprimée, events aussi)

### Valeurs Hardcodées en Base ?

**NON**. Aucune valeur de copywriting n'est stockée en base de données.

Les seules valeurs stockées sont :
- Les réponses brutes (JSON q1-q11)
- Les scores calculés (numériques)
- Le nom du quadrant (string comme 'sage_fragile') — **⚠️ CRITIQUE**
- Le diagnostic généré par Claude (JSON complet)

**⚠️ POINT CRITIQUE**: Le champ `quadrant` stocke le **slug technique** du quadrant (ex: 'sage_fragile'), pas le nom affiché. Le mapping slug → nom affiché se fait dans `lib/matrix-types.ts`.

---

## 3. SYSTÈME DE SCORING

### Fichier Principal

**`lib/matrix-scoring.ts`** (96 lignes)

### 3.1. Calcul Axe X (DIY → DFY)

**Ligne 8**:
```typescript
let axis_x = (core.q2 + core.q5) / 2
```

| Variable | Question | Impact |
|----------|----------|--------|
| Q2 | Support post-prestation | 1-4 |
| Q5 | Ce qui reste chez le client | 1-4 |

**Formule**: Moyenne simple (1-4)

**Interprétation**:
- 1-2.49 = DIY (client se débrouille)
- 2.5-4 = DFY (expert fait pour le client)

### 3.2. Calcul Axe Y (Espoir → Certitude)

**Lignes 10-25**:
```typescript
let axis_y = (core.q1 + core.q3) / 2
```

| Variable | Question | Impact |
|----------|----------|--------|
| Q1 | % CA récurrent (rétention) | 1-4 |
| Q3 | Modèle de pricing | 1-4 |

**Formule**: Moyenne simple **AVEC CAPS** (règles business)

**Règles de CAP Y** (lignes 16-25):

1. **Si Q3 === 1 ET Q1 >= 3**:
   - `axis_y = Math.min(axis_y, 2.5)`
   - Raison: "TJM + haute récurrence → cap Y à 2.5"
   - **Logique**: Si tu factures au TJM (Q3=1), même avec haute récurrence, tu ne peux pas être en certitude pure.

2. **Si Q1 === 1**:
   - `axis_y = Math.min(axis_y, 2.0)`
   - Raison: "Récurrence < 10% → cap Y à 2.0"
   - **Logique**: Pas de récurrence = pas de certitude, même avec bon pricing.

**Interprétation**:
- 1-2.49 = Espoir (résultat incertain)
- 2.5-4 = Certitude (résultat prédictible)

### 3.3. Calcul des 3 Variables de Certitude

**Lignes 27-30**:

| Variable | Question | Nom Affiché | Signification |
|----------|----------|-------------|---------------|
| `revenue_proximity` | Q3 | "Proximité au revenu" | Modèle de pricing |
| `speed` | Q4 | "Vitesse de preuve" | Système de preuve |
| `reliability` | Q6 | "Fiabilité système" | Dépendance au résultat |

**IMPORTANT**: Ce sont des **références directes** aux questions, pas des calculs.

### 3.4. Calcul Score de Certitude /100

**Lignes 33-42**:

```typescript
const certainty_raw = revenue_proximity * speed * reliability
let certainty_score = Math.round((certainty_raw / 64) * 100)
```

**Formule**:
1. Multiplication des 3 variables (1-4 chacune) → max 64
2. Normalisation sur 100: `(raw / 64) * 100`
3. Arrondi

**Règle de CAP CERTITUDE**:
- **Si l'une des 3 variables === 1**:
  - `certainty_score = Math.min(certainty_score, 15)`
  - Raison: Une faiblesse critique plafonne le score à 15/100

**Exemples**:
- 4 × 4 × 4 = 64/64 = 100/100
- 3 × 3 × 3 = 27/64 = 42/100
- 1 × 4 × 4 = 16/64 = 25/100 → **cappé à 15/100**

### 3.5. Détermination du Quadrant

**Lignes 44-45 + fonction lignes 87-95**:

```typescript
const quadrant = determineQuadrant(axis_x, axis_y)

function determineQuadrant(x: number, y: number): Quadrant {
  const isRight = x >= 2.5
  const isTop = y >= 2.5

  if (!isRight && !isTop) return 'formateur_fantome'   // DIY + Espoir
  if (isRight && !isTop) return 'agence_commodite'     // DFY + Espoir
  if (!isRight && isTop) return 'sage_fragile'         // DIY + Certitude
  return 'operateur_certitude'                         // DFY + Certitude
}
```

**Carte des Quadrants**:

```
     Y (Certitude)
        ^
     4  |  sage_fragile  |  operateur_certitude
        |                |
   2.5  |----------------|--------------------
        |                |
     1  | formateur_     |  agence_
        | fantome        |  commodite
        |________________|____________________> X (DFY)
        1              2.5                  4
```

**Seuils critiques**: X=2.5 et Y=2.5 (exactement)

### 3.6. MOAT & IA Vulnerability (Mode Advanced)

**Lignes 47-64**:

Si `bonusAnswers !== null`:

| Métrique | Calcul | Questions |
|----------|--------|-----------|
| `moat_tech` | `core.q5` | Réutilisation Q5 (ce qui reste) |
| `moat_data` | `bonus.q8` | Données structurées clients |
| `moat_distribution` | `core.q7` | Réutilisation Q7 (fragilité acquisition) |
| `moat_global` | Moyenne des 3 MOAT | Arrondi 2 décimales |
| `ia_vulnerability` | `5 - bonus.q9` | Inverse de systématisation |
| `pain_point` | `bonus.q11` | Douleur principale (string) |

**Logique IA Vulnerability**:
- Q9 mesure la systématisation (1-4)
- Plus c'est systématisé (Q9 élevé), moins vulnérable à l'IA
- Donc: `ia_vulnerability = 5 - Q9`
  - Q9=1 → ia_vuln=4 (critique)
  - Q9=2 → ia_vuln=3 (critique)
  - Q9=3 → ia_vuln=2 (modérée)
  - Q9=4 → ia_vuln=1 (faible)

**Mapping niveau IA** (dans `app/api/generate-diagnostic/route.ts`, lignes 174-176):
```typescript
level: ia_vulnerability >= 3 ? 'critique' : ia_vulnerability === 2 ? 'modérée' : 'faible'
```

### 3.7. Impact des Changements de Questions

#### ❓ Si on réordonne les questions (Q4 devient Q1) ?

**RÉPONSE**: ✅ **AUCUN IMPACT** si on garde les IDs.

Le scoring utilise les **clés des réponses** (`q1`, `q2`, etc.), pas l'ordre d'affichage.

**Exemple**:
```typescript
// Dans quiz/page.tsx, on peut afficher dans n'importe quel ordre
const CORE_QUESTIONS = [
  { id: 'q7', text: "..." },  // Q7 en premier
  { id: 'q1', text: "..." },  // Q1 en second
  ...
]

// Le scoring marchera car il fait:
core.q1, core.q3, core.q5 // peu importe l'ordre d'affichage
```

**⚠️ ATTENTION**: Ne pas changer les IDs (q1→q8 par exemple), sinon scoring cassé.

#### ❓ Si on change le texte des questions/réponses ?

**RÉPONSE**: ✅ **AUCUN IMPACT** sur le scoring technique.

**MAIS**: ⚠️ Impact sémantique si le changement modifie la signification.

**Exemple safe**:
```typescript
// AVANT
text: "Comment vous facturez vos clients ?"
// APRÈS
text: "Quel est votre modèle de tarification ?"
// → OK, même sens
```

**Exemple DANGEREUX**:
```typescript
// AVANT Q3, option 1
label: "Au temps passé (TJM, taux horaire)"
value: 1
// APRÈS
label: "En partie variable indexée sur résultat"
value: 1
// → ❌❌❌ CATASTROPHE, le sens a changé, tous les anciens scores sont faux
```

**RÈGLE D'OR**:
- ✅ Changer la **formulation** sans changer le **sens** = OK
- ❌ Changer le **sens** d'une réponse existante = DANGER (incohérence historique)
- ✅ Ajouter/supprimer des options = voir section Risques

#### ❓ Où est la logique de scoring ?

**RÉPONSE**:
1. **Calcul initial**: `lib/matrix-scoring.ts` (côté serveur, dans API route)
2. **Appel depuis**: `app/api/generate-diagnostic/route.ts` (ligne 94)
3. **Pas de scoring côté client**: tout se passe côté API

**Flow**:
```
Client (quiz) → POST /api/generate-diagnostic → calculateMatrixScoring() → Résultat
```

---

## 4. QUESTIONS BONUS & UPSELL

### 4.1. Gestion Technique des Questions Bonus

**Fichier**: `app/quiz/page.tsx` (lignes 83-124)

**Questions Bonus** (4 questions):
- Q8: Données structurées clients (MOAT Data)
- Q9: Systématisation (IA Vulnerability)
- Q10: Scalabilité (nombre de clients simultanés)
- Q11: Pain Point (douleur principale)

**État React**:
```typescript
const [bonusAnswers, setBonusAnswers] = useState<Record<string, number | string>>({})
const [wantsAdvanced, setWantsAdvanced] = useState(false)
```

### 4.2. Flow Upsell

**Fichier**: `app/quiz/page.tsx` (lignes 284-324)

**Étapes**:
1. Utilisateur termine les 7 questions core
2. `setStep('upsell')` → Écran intermédiaire
3. Deux choix:
   - **Continuer** → `setWantsAdvanced(true)` + `setStep('bonus')`
   - **Skip** → `setWantsAdvanced(false)` + `setStep('email')`

**Texte Upsell** (lignes 297-301):
```
Titre: "Votre diagnostic de base est prêt."
Description: "4 questions de plus en 60 secondes pour débloquer votre score de
             vulnérabilité IA et votre niveau de MOAT."
CTA 1: "Continuer vers le diagnostic avancé (Recommandé)"
CTA 2: "Non merci, voir mon résultat de base"
```

### 4.3. Diagnostic Généré AVANT ou APRÈS Bonus ?

**RÉPONSE**: ⏳ **APRÈS** (tout à la fin)

**Flow technique**:
1. Quiz core (7 questions)
2. Upsell (choix)
3. Quiz bonus (4 questions) — **SI** choisi
4. Capture email
5. **Appel API `/api/generate-diagnostic`** → Claude génère le diagnostic
6. **Appel API `/api/save-result`** → Sauvegarde Supabase
7. Redirection `/resultat/[id]`

**Code** (`app/quiz/page.tsx`, lignes 178-236):
```typescript
const submitQuiz = async (e: React.FormEvent) => {
  // 1. Génération diagnostic (Claude)
  const diagRes = await fetch('/api/generate-diagnostic', {
    method: 'POST',
    body: JSON.stringify({ coreAnswers, bonusAnswers })
  })

  // 2. Sauvegarde (Supabase)
  const saveRes = await fetch('/api/save-result', {
    method: 'POST',
    body: JSON.stringify({ ... })
  })

  // 3. Redirection
  router.push(`/resultat/${sessionId}`)
}
```

**IMPORTANT**: Le diagnostic est généré **une seule fois** avec toutes les réponses disponibles.

### 4.4. Peut-on Revenir Faire les Bonus Plus Tard ?

**RÉPONSE**: ❌ **NON**, pas possible actuellement.

**Raisons**:
1. Le diagnostic est généré **immédiatement** après soumission email
2. Il n'y a pas de système de "compléter plus tard"
3. L'utilisateur peut seulement **retrouver** son résultat existant (page `/retrouver`)

**Pour implémenter cette feature**, il faudrait:
- Sauvegarder une session "partielle" (core only)
- Permettre de compléter via un lien unique
- Regénérer le diagnostic avec les nouvelles réponses

**Impact copywriting**: Si on promet "vous pourrez compléter plus tard", c'est actuellement faux.

---

## 5. GÉNÉRATION IA DU DIAGNOSTIC

### 5.1. Modèle IA Utilisé

**Fichier**: `app/api/generate-diagnostic/route.ts` (ligne 136)

```typescript
model: 'claude-sonnet-4-20250514'
```

**Provider**: Anthropic
**SDK**: `@anthropic-ai/sdk` v0.71.2
**Max tokens**: 4000 (ligne 138)

### 5.2. Localisation des Prompts

**SYSTÈME PROMPT**: `app/api/generate-diagnostic/route.ts` (lignes 23-87)

**USER PROMPT**: `app/api/generate-diagnostic/route.ts` (lignes 101-134)

**❌ PAS de fichiers séparés**, tout est dans le code de la route API.

### 5.3. Contenu Complet du Prompt Système

**Lignes 23-87**:

```
Tu es un stratège business spécialisé dans l'expertise et le consulting B2B.

Tu analyses la position d'un expert/consultant/coach sur la Matrice de Certitude 2026
et tu produis un diagnostic chirurgical, direct et actionnable.

## CONTEXTE DE LA MATRICE
La matrice a deux axes :
- Axe X : DIY (le client se débrouille) → DFY (l'expert fait pour/avec le client)
- Axe Y : Espoir (le résultat est incertain) → Certitude (le résultat est prédictible)

Les 4 cadrans :
- **L'Expert Fantôme** (bas-gauche, DIY+Espoir) : vend du savoir, zéro engagement
  résultat, zone de mort
- **L'Agence Commodité** (bas-droite, DFY+Espoir) : fait le boulot mais sans garantie,
  course vers le bas sur les prix
- **Le Sage Fragile** (haut-gauche, DIY+Certitude) : expert respecté mais business
  fragile, dépend de sa réputation personnelle
- **L'Opérateur de Certitude** (haut-droite, DFY+Certitude) : le Saint Graal, système
  qui produit des résultats prédictibles

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
- Pas de recommandation type "développe ta marque personnelle" ou "investis dans
  la formation continue"
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
    "description": "Explication en 2 phrases de pourquoi l'IA est ou n'est pas une menace
                   pour ce profil."
  },
  "axis_x": 0,
  "axis_y": 0,
  "variables": [
    {"name": "Proximité au revenu", "score": 0},
    {"name": "Vitesse de preuve", "score": 0},
    {"name": "Fiabilité système", "score": 0}
  ]
}

IMPORTANT : Renvoie UNIQUEMENT le JSON. Pas de texte avant ou après. Pas de backticks markdown.
```

### 5.4. Contenu Complet du Prompt User

**Template** (lignes 101-134):

```typescript
`Voici le profil d'un expert/consultant :

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

Génère le diagnostic complet en JSON.${scoring.advanced ? '' : ' Pour les champs MOAT et IA,
utilise les données des questions core disponibles (Q5 pour moat_tech, Q7 pour
moat_distribution) et mets moat_data à 0.'}`
```

**Données passées à Claude**:
- Position calculée (quadrant, axes, score)
- Variables de certitude
- **Scores bruts** des 7 questions core (1-4)
- **Scores bruts** des 4 questions bonus (si advanced)
- Mode (standard vs advanced)

**❌ PAS passé à Claude**:
- Les textes des questions
- Les textes des réponses
- L'email ou nom de l'utilisateur

**Conséquence**: Claude ne voit QUE les scores numériques. Il infère le profil uniquement depuis les chiffres.

### 5.5. Format de Réponse Claude (JSON)

**Champs générés par l'IA**:
- `situation` (string)
- `pourquoi_bloque` (string)
- `risque_concret` (string)
- `forces` (array de strings)
- `angles_morts` (array de strings)
- `move_commando` (object: title, description)
- `move_builder` (object: title, description)
- `ia_vulnerability.description` (string) — le niveau est calculé côté code

**Champs injectés côté serveur** (lignes 159-177):
- `axis_x`, `axis_y`
- `variables` (array de 3 objects)
- `moat_global`, `moats` (si advanced)
- `ia_vulnerability.level` (calculé depuis score)

**Parsing** (lignes 145-156):
- Tentative `JSON.parse(text)`
- Si échec, regex `\{[\s\S]*\}` pour extraire JSON
- Si encore échec, erreur

### 5.6. Cache ou Regénération ?

**RÉPONSE**: 💾 **Cache total** (pas de regénération)

**Explication**:
1. Le diagnostic est généré **une fois** lors de la soumission du quiz
2. Il est stocké dans `matrice_sessions.diagnostic_json` (JSONB)
3. Lors de visites futures (`/resultat/[id]`), on **lit depuis Supabase** (ligne 13-17, `app/resultat/[id]/page.tsx`)
4. **Aucun appel à Claude** lors de visites répétées

**Avantages**:
- ✅ Pas de coût API répété
- ✅ Résultat stable dans le temps
- ✅ Performance (lecture DB vs appel IA)

**Inconvénients**:
- ❌ Si le prompt change, anciens diagnostics ne bénéficient pas
- ❌ Impossible de "rafraîchir" un diagnostic sans refaire le quiz

---

## 6. COPYWRITING HARDCODÉ vs DYNAMIQUE

### 6.1. Landing Page (`app/page.tsx`)

| Élément | Type | Ligne | Localisation |
|---------|------|-------|--------------|
| **Titre principal** | Hardcodé | 22-24 | `<h1>` dans le composant |
| **Sous-titre** | Hardcodé | 25-27 | `<p>` dans le composant |
| **CTA principal** | Hardcodé | 36 | Texte du bouton |
| **Lien secondaire** | Hardcodé | 47 | Texte + href="/retrouver" |
| **Card 1 titre** | Hardcodé | 64 | "Matrice 2×2" |
| **Card 1 desc** | Hardcodé | 65 | "Découvre dans quel cadran..." |
| **Card 2 titre** | Hardcodé | 78 | "Score de Certitude" |
| **Card 2 desc** | Hardcodé | 79 | "Mesure mathématiquement..." |
| **Card 3 titre** | Hardcodé | 92 | "Plan d'Action" |
| **Card 3 desc** | Hardcodé | 93 | "Reçois les actions exactes..." |

**✅ Facilité de modification**: Très facile, tout dans un seul fichier composant.

**⚠️ Pas de fichier de config séparé**, il faut éditer le TSX directement.

### 6.2. Questions du Quiz (`app/quiz/page.tsx`)

**Questions Core** (lignes 10-81):

```typescript
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
  // ... 6 autres questions
]
```

**Questions Bonus** (lignes 83-124):

```typescript
const BONUS_QUESTIONS = [
  {
    id: 'q8',
    text: "Est-ce que vous avez des données structurées sur les résultats de vos clients passés ?",
    options: [...]
  },
  // ... 3 autres questions
]
```

**Type de stockage**: ✅ **Constantes dans le fichier**

**Facilité de modification**: Très facile, format array d'objets clair.

**⚠️ ATTENTION**: Les `value` (1-4) sont liés au scoring. Ne pas changer sans adapter `matrix-scoring.ts`.

### 6.3. Upsell (`app/quiz/page.tsx`)

| Élément | Ligne | Localisation |
|---------|-------|--------------|
| Icône checkmark | 292-295 | SVG dans JSX |
| **Titre** | 297-299 | "Votre diagnostic de base est prêt." |
| **Description** | 300-302 | "4 questions de plus en 60 secondes..." |
| **CTA principal** | 311-313 | "Continuer vers le diagnostic avancé (Recommandé)" |
| **CTA secondaire** | 320-322 | "Non merci, voir mon résultat de base" |

**Type**: Hardcodé dans le composant (step === 'upsell')

### 6.4. Capture Email (`app/quiz/page.tsx`)

| Élément | Ligne | Localisation |
|---------|-------|--------------|
| **Titre** | 372-374 | "Où envoyer votre diagnostic ?" |
| **Description** | 375-377 | "L'IA va générer votre position..." |
| **Label prénom** | 383 | "Prénom (Optionnel)" |
| **Placeholder prénom** | 390 | "Votre prénom" |
| **Label email** | 395 | "Email professionnel" |
| **Placeholder email** | 403 | "vous@entreprise.com" |
| **Message erreur** | 181 | "L'email est requis pour recevoir le diagnostic." |
| **CTA submit** | 416 | "Générer mon diagnostic →" |

**Type**: Hardcodé dans le formulaire

### 6.5. Loading State (`app/quiz/page.tsx`)

| Élément | Ligne | Localisation |
|---------|-------|--------------|
| **Titre** | 434-436 | "Analyse en cours..." |
| **Sous-titre** | 437-439 | "Génération du rapport par l'IA" |
| **Spinner** | 429-432 | SVG animé |

**Type**: Hardcodé (step === 'loading')

### 6.6. Page Résultats — Archétypes & Taglines

**Fichier**: `lib/matrix-types.ts`

**Noms des Quadrants** (lignes 142-147):

```typescript
export const QUADRANT_NAMES: Record<Quadrant, string> = {
  formateur_fantome: "L'Expert Fantôme",
  sage_fragile: 'Le Sage Fragile',
  operateur_certitude: "L'Opérateur de Certitude",
  agence_commodite: "L'Agence Commodité",
}
```

**Taglines** (lignes 149-154):

```typescript
export const QUADRANT_TAGLINES: Record<Quadrant, string> = {
  formateur_fantome: 'Zone de mort',
  sage_fragile: 'Expert respecté, business fragile',
  operateur_certitude: 'Le Saint Graal',
  agence_commodite: 'Course vers le bas',
}
```

**Badges de Statut** (lignes 102-139):

```typescript
export const ARCHETYPE_COLORS: Record<Quadrant, ArchetypeColors> = {
  formateur_fantome: {
    badge: 'Alerte Critique',
    // ...
  },
  sage_fragile: {
    badge: 'Attention Requise',
    // ...
  },
  operateur_certitude: {
    badge: 'Position Solide',
    // ...
  },
  agence_commodite: {
    badge: 'Zone de Risque',
    // ...
  },
}
```

**✅ Centralisation**: Tous les textes liés aux archétypes dans un seul fichier de config.

**Usage**: Importé dans `components/resultat/HeaderBlock.tsx` (ligne 4).

### 6.7. Page Résultats — Labels des Axes

**Fichier**: `components/resultat/MatrixBlock.tsx`

| Élément | Ligne | Texte |
|---------|-------|-------|
| **Axe X - Gauche** | 156 | "VOUS FAITES TOUT" |
| **Axe X - Droite** | 157 | "ON FAIT POUR VOUS" |
| **Axe Y - Bas** | 161 | "ESPOIR" |
| **Axe Y - Haut** | 162 | "CERTITUDE" |

**Type**: Hardcodé dans le JSX du composant

### 6.8. Page Résultats — Sections & Titres

**HeaderBlock** (`components/resultat/HeaderBlock.tsx`):
- Badge: Dynamique depuis `ARCHETYPE_COLORS[quadrant].badge` (ligne 61)
- Nom archetype: Dynamique depuis `QUADRANT_NAMES[quadrant]` (lignes 66-71)
- Tagline: Dynamique depuis `QUADRANT_TAGLINES[quadrant]` (ligne 73)
- Label "Score": Hardcodé (ligne 107)

**ScoreBlock** (`components/resultat/ScoreBlock.tsx`):
- Titre section: Hardcodé "Variables de Certitude" (ligne 29)
- Label "Point Faible": Hardcodé (ligne 44)
- Noms variables: Dynamiques depuis `diagnostic.variables[].name` (ligne 41)

**DiagnosticBlock** (`components/resultat/DiagnosticBlock.tsx`):
- Titre section: Hardcodé "Diagnostic Brutal" (ligne 20)
- Label "La Réalité": Hardcodé (ligne 30)
- Label "Le Vrai Problème": Hardcodé (ligne 41)
- Label "Risque à 6-12 mois": Hardcodé (ligne 58)
- Contenus: Dynamiques depuis Claude (`diagnostic.situation`, etc.)

**MovesBlock** (`components/resultat/MovesBlock.tsx`):
- Titre section: Hardcodé "Plan d'Action" (ligne 24)
- Badge "Move Commando": Hardcodé (ligne 42)
- Badge "Move Builder": Hardcodé (ligne 70)
- Label "Cette semaine": Hardcodé (ligne 43)
- Label "Ce mois": Hardcodé (ligne 71)
- Contenus moves: Dynamiques depuis Claude

**MoatBlock** (`components/resultat/MoatBlock.tsx`):
- Titre section: Hardcodé "Défensibilité (MOAT)" (ligne 16 ou 50)
- Message lock: Hardcodé (ligne 26-28)
- Label "Score Global": Hardcodé (ligne 58)
- Label "Vulnérabilité IA": Hardcodé (ligne 90)
- Noms MOAT: Dynamiques depuis `diagnostic.moats[].name` (ligne 66)

**CtaBlock** (`components/resultat/CtaBlock.tsx`):
- Titre: Hardcodé "Prêt à changer de cadran ?" (ligne 14)
- Description: Hardcodé (ligne 17)
- CTA: Hardcodé "Réserver mon appel stratégique →" (ligne 26)
- Lien Calendly: Hardcodé `https://calendly.com/mehdi-zen/appel-turbo` (ligne 21)
- Note réassurance: Hardcodé "100% gratuit..." (ligne 30)

### 6.9. Page Retrouver (`app/retrouver/page.tsx`)

| Élément | Ligne | Texte |
|---------|-------|-------|
| Titre | 70-72 | "Retrouver mon diagnostic" |
| Description | 73-75 | "Entrez l'adresse email..." |
| Label email | 80 | "Adresse email" |
| Placeholder | 88 | "vous@entreprise.com" |
| Erreur (aucun résultat) | 37 | "Aucun diagnostic trouvé pour cet email." |
| Erreur (générique) | 43 | "Une erreur s'est produite lors de la recherche." |
| CTA submit | 116 | "Retrouver mon diagnostic" |
| Loading | 113 | "Recherche..." |
| Lien quiz | 123-129 | "Vous n'avez pas encore passé le test ? Commencer l'évaluation →" |

**Type**: Hardcodé dans le composant

### 6.10. Meta Tags SEO (`app/layout.tsx`)

```typescript
export const metadata: Metadata = {
  title: 'Matrice de l\'Expertise 2026',
  description: 'Où es-tu sur la Matrice de l\'Expertise 2026 ? 7 questions. 2 minutes. Un diagnostic chirurgical.',
}
```

**Ligne**: 23-26

**Type**: Hardcodé dans le layout

**Visibilité**: Utilisé pour `<title>` et `<meta name="description">`

### 6.11. Lien Calendly

**Fichier**: `components/resultat/CtaBlock.tsx`

```typescript
<a
  href="https://calendly.com/mehdi-zen/appel-turbo"
  target="_blank"
  rel="noopener noreferrer"
  ...
>
```

**Ligne**: 21

**Type**: Hardcodé, pas de variable d'environnement

**⚠️ POINT D'ATTENTION**: Si on veut rendre ce lien dynamique (par archétype, par score, etc.), il faut:
1. Soit le passer comme prop depuis `ResultPage.tsx`
2. Soit créer une fonction de mapping `getCalendlyLink(quadrant)`
3. Soit le mettre en variable d'environnement `NEXT_PUBLIC_CALENDLY_URL`

---

## 7. FLOW UTILISATEUR — PARCOURS TECHNIQUE

### 7.1. Landing → Quiz

**Fichier**: `app/page.tsx` (ligne 32)

```tsx
<Link href="/quiz">
  Commencer le diagnostic
</Link>
```

**Technique**:
- Client-side navigation (Next.js Link)
- Pas d'appel API
- Pas de state persistence

### 7.2. Quiz — State Management

**Fichier**: `app/quiz/page.tsx`

**États React** (lignes 129-140):
```typescript
const [step, setStep] = useState<Step>('core')
const [coreIndex, setCoreIndex] = useState(0)
const [bonusIndex, setBonusIndex] = useState(0)

const [coreAnswers, setCoreAnswers] = useState<Record<string, number>>({})
const [bonusAnswers, setBonusAnswers] = useState<Record<string, number | string>>({})
const [wantsAdvanced, setWantsAdvanced] = useState(false)

const [firstName, setFirstName] = useState('')
const [email, setEmail] = useState('')
```

**Stockage**:
- ✅ **En mémoire** (React state local)
- ❌ **PAS en localStorage** (données perdues si refresh)
- ❌ **PAS en base** (sauvegarde seulement à la fin)

**Conséquence**: Si l'utilisateur ferme l'onglet, il doit tout refaire.

### 7.3. Sélection Réponse Core

**Handler** (lignes 142-158):

```typescript
const handleCoreSelect = (value: number) => {
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
```

**Flow**:
1. Click option → sauvegarde dans state
2. Transition 200ms
3. Question suivante (ou upsell si dernière)

**Protection**: `isTransitioning` empêche double-click

### 7.4. Upsell → Choix

**Choix "Continuer"** (lignes 306-309):
```typescript
onClick={() => {
  setWantsAdvanced(true)
  setStep('bonus')
}}
```

**Choix "Skip"** (lignes 315-318):
```typescript
onClick={() => {
  setWantsAdvanced(false)
  setStep('email')
}}
```

**Pas d'appel API**, juste update du state local.

### 7.5. Capture Email → Soumission

**Handler** (lignes 178-236):

```typescript
const submitQuiz = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!email) {
    setError("L'email est requis pour recevoir le diagnostic.")
    return
  }

  setStep('loading')

  const payload = {
    coreAnswers: coreAnswers as unknown as CoreAnswers,
    bonusAnswers: wantsAdvanced ? (bonusAnswers as unknown as BonusAnswers) : null
  }

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
```

**Étapes techniques**:
1. Validation email côté client
2. Transition vers `loading` state
3. **Appel 1**: `POST /api/generate-diagnostic`
   - Input: `{ coreAnswers, bonusAnswers }`
   - Output: `{ success, scoring, diagnosticJson }`
4. **Appel 2**: `POST /api/save-result`
   - Input: `{ userEmail, firstName, coreAnswers, bonusAnswers, scoring, diagnosticJson }`
   - Output: `{ success, sessionId }`
   - **Side-effect**: Création contact Systeme.io + tag
5. Redirection vers `/resultat/[sessionId]`

**Temps d'attente**:
- Génération Claude: ~5-15 secondes
- Sauvegarde Supabase: ~500ms
- Total: **~6-16 secondes** (loading state)

### 7.6. Page Résultats — Chargement Données

**Fichier**: `app/resultat/[id]/page.tsx` (Server Component)

```typescript
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data, error } = await supabase
    .from('matrice_sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!data) return notFound()

  return <ResultPage session={data} />
}
```

**Technique**:
- ✅ **Server-side fetch** (pas de loading client-side)
- ✅ **Données depuis Supabase** (pas de régénération IA)
- ✅ **404 automatique** si ID invalide

**Props passées à ResultPage**:
- `session`: object complet de la table `matrice_sessions`
- Contient: email, scores, diagnostic_json, etc.

### 7.7. "J'ai déjà passé le test" → Récupération

**Fichier**: `app/retrouver/page.tsx`

**Flow** (lignes 20-46):
```typescript
const handleSearch = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!email) return

  setLoading(true)
  setError('')

  try {
    const { data, error: fetchError } = await supabase
      .from('matrice_sessions')
      .select('id, created_at, quadrant, certainty_score')
      .eq('user_email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (fetchError || !data) {
      setError("Aucun diagnostic trouvé pour cet email.")
    } else {
      router.push(`/resultat/${data.id}`)
    }
  } catch (err) {
    console.error(err)
    setError("Une erreur s'est produite lors de la recherche.")
  } finally {
    setLoading(false)
  }
}
```

**Technique**:
- Recherche **directe en base** via email
- **Dernier diagnostic** (order by created_at DESC)
- **Côté client** (pas d'API route, Supabase client-side)
- Redirection vers `/resultat/[id]`

**⚠️ Note**: Il y a une API route `/api/retrouver` (fichier existe) mais elle n'est **PAS utilisée** par le front. La page `/retrouver` fait l'appel Supabase directement côté client.

**Sécurité**: Utilise la `ANON_KEY` (lecture publique sur `matrice_sessions` possible). Pas d'authentification requise.

---

## 8. EMAILS & INTÉGRATIONS

### 8.1. Email Automatique Post-Diagnostic

**RÉPONSE**: ❌ **AUCUN email envoyé** actuellement.

**Constat**:
- Pas de service email configuré (Resend, SendGrid, etc.)
- Pas de template email dans le code
- Pas d'appel API email dans `/api/save-result`

**Conséquence**: L'utilisateur ne reçoit PAS d'email avec son résultat.

**⚠️ ATTENTION COPYWRITING**: Si la landing ou le quiz dit "recevez votre diagnostic par email", c'est actuellement faux.

**Comment l'utilisateur accède à son résultat ?**
1. Redirection automatique après soumission (`router.push`)
2. Ou recherche par email sur `/retrouver`

### 8.2. CRM — Systeme.io

**Fichier**: `app/api/save-result/route.ts` (lignes 78-115)

**Flow**:
```typescript
try {
  if (process.env.SYSTEME_API_KEY && process.env.SYSTEME_TAG_MATRICE_ID) {
    // 1. Créer/Mettre à jour contact
    const systemeResponse = await fetch('https://api.systeme.io/api/contacts', {
      method: 'POST',
      headers: {
        'X-API-Key': process.env.SYSTEME_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userEmail,
        locale: 'fr',
        fields: [
          { slug: 'first_name', value: firstName || '' }
        ]
      })
    })

    const systemeData = await systemeResponse.json()
    const contactId = systemeData?.id

    // 2. Ajouter tag
    if (contactId) {
      const tagId = process.env.SYSTEME_TAG_MATRICE_ID
      await fetch(`https://api.systeme.io/api/contacts/${contactId}/tags`, {
        method: 'POST',
        headers: {
          'X-API-Key': process.env.SYSTEME_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tagId: parseInt(tagId, 10)
        })
      })
    }
  }
} catch (systemeError) {
  console.error('[save-result] Systeme.io error (non-blocking):', systemeError)
  // On ne bloque pas le flow si Systeme.io échoue
}
```

**Données envoyées**:
- Email
- Prénom (si fourni)
- Tag unique (ID configuré en env var)

**⚠️ Non-bloquant**: Si l'API Systeme.io échoue, le quiz continue (try/catch).

**Données NON envoyées à Systeme.io**:
- Scores
- Quadrant
- Diagnostic
- Réponses au quiz

**Conséquence**: Systeme.io sert uniquement de **lead capture**, pas de CRM analytique.

### 8.3. Analytics / Tracking

**RÉPONSE**: ❌ **AUCUN tracking configuré**.

**Constat**:
- Pas de Plausible, PostHog, Google Analytics, Mixpanel, Segment
- Pas de script de tracking dans `app/layout.tsx`
- Pas de `gtag()` ou événements custom

**Données analytiques disponibles**:
- ✅ Table `matrice_answer_events` (logs des réponses)
- ✅ Timestamps `created_at` dans `matrice_sessions`
- ✅ Logs serveur (console.log dans les API routes)

**Pour implémenter analytics**, il faudrait:
1. Ajouter un provider (ex: PostHog, Plausible)
2. Track événements:
   - Page view landing
   - Start quiz
   - Complete question [X]
   - Choose advanced/skip
   - Submit email
   - View results
   - Click CTA Calendly

### 8.4. Lien Calendly — Paramètres UTM

**Fichier**: `components/resultat/CtaBlock.tsx` (ligne 21)

```typescript
href="https://calendly.com/mehdi-zen/appel-turbo"
```

**Constat**: ❌ **Aucun paramètre UTM** ou données de quiz passées.

**Améliorations possibles**:
```typescript
// Exemple avec UTM + données
href={`https://calendly.com/mehdi-zen/appel-turbo?utm_source=matrice&utm_medium=result&utm_campaign=${quadrant}&score=${certaintyScore}`}
```

**Avantages**:
- Savoir d'où viennent les réservations
- Segmenter par archétype
- Préparer l'appel avec les données du quiz

---

## 9. RISQUES & DÉPENDANCES

### 9.1. Changer le Texte d'une Question

**Risque**: ⚠️ **Incohérence sémantique historique**

**Scénario**:
1. Aujourd'hui: Q3 option 1 = "Au temps passé (TJM)" → value: 1
2. 100 personnes répondent
3. Demain: On change Q3 option 1 = "Au forfait projet" → value: 1
4. **Résultat**: Les 100 anciens résultats sont maintenant incohérents

**Solutions**:
- ✅ **Reformulation safe**: Changer le wording sans changer le sens
  - Ex: "TJM/taux horaire" → "Facturation au temps passé"
- ✅ **Ajout de réponses**: Ajouter une option 5 sans toucher aux 4 existantes
- ⚠️ **Migration de données**: Si changement de sens, migrer les anciens scores
- ❌ **Ignorer**: Acceptable si peu de sessions historiques

**Impact base de données**:
- Le texte des questions N'EST PAS stocké en base
- Seules les réponses (1-4 ou strings) sont stockées
- Donc pas de "mise à jour" automatique

### 9.2. Réordonner les Questions

**Risque**: ✅ **AUCUN** (si on garde les IDs)

**Explication**:
```typescript
// Avant
const CORE_QUESTIONS = [
  { id: 'q1', text: "..." },
  { id: 'q2', text: "..." },
]

// Après (Q2 en premier)
const CORE_QUESTIONS = [
  { id: 'q2', text: "..." },
  { id: 'q1', text: "..." },
]

// Le scoring fait:
axis_y = (core.q1 + core.q3) / 2
// Peu importe l'ordre d'affichage, il cherche 'q1'
```

**Fichiers impactés**:
- ✅ `app/quiz/page.tsx` (ordre d'affichage)
- ❌ `lib/matrix-scoring.ts` (utilise les IDs, pas l'ordre)

**Action requise**: Juste modifier l'array `CORE_QUESTIONS`

### 9.3. Renommer les IDs de Questions

**Risque**: 🔴 **CRITIQUE** — Casse tout

**Scénario**:
```typescript
// Avant
{ id: 'q1', ... }

// Après
{ id: 'retention', ... }
```

**Impacts**:
1. `lib/matrix-scoring.ts` attend `core.q1` → **undefined** → crash
2. Anciens diagnostics en base ont `core_answers: { q1: 3 }` → incompatibles

**Solution**: ❌ **NE JAMAIS FAIRE**

Ou alors:
1. Créer un mapping `q1 → retention` dans le code
2. Migrer toutes les anciennes sessions en base
3. Tester exhaustivement

### 9.4. Changer les Noms de Quadrants

**Risque**: ⚠️ **MODÉRÉ** — Impact limité si bien fait

**Scénario**:
```typescript
// Avant (lib/matrix-types.ts)
QUADRANT_NAMES = {
  sage_fragile: 'Le Sage Fragile'
}

// Après
QUADRANT_NAMES = {
  sage_fragile: 'L'Expert Solitaire'
}
```

**Impacts**:
- ✅ Affichage front: Mis à jour automatiquement
- ❌ Prompt Claude: Toujours l'ancien nom (hardcodé dans `generate-diagnostic/route.ts`)
- ❌ Anciens diagnostics: Texte généré par Claude mentionne l'ancien nom

**Fichiers à modifier**:
1. `lib/matrix-types.ts` (ligne 142-147)
2. `app/api/generate-diagnostic/route.ts` (lignes 32-36)

**Anciens diagnostics**: Le texte généré par Claude (stocké en base) restera avec l'ancien nom.

### 9.5. Changer les Taglines

**Risque**: ✅ **AUCUN**

**Explication**: Les taglines sont purement affichage front, pas utilisées dans le scoring ou les prompts IA.

**Fichier**: `lib/matrix-types.ts` (lignes 149-154)

**Action**: Modifier directement, effet immédiat sur tous les résultats (anciens et nouveaux).

### 9.6. Tests Automatisés

**RÉPONSE**: ❌ **Aucun test** configuré

**Constat**:
- Pas de Jest, Vitest, Playwright, Cypress
- Pas de dossier `__tests__` ou `.test.ts`
- Script `test` absent de `package.json`

**Conséquence**: Tous les changements doivent être testés **manuellement**.

**Recommandation pour changements de copy**:
1. Test manuel complet du flow
2. Vérifier chaque archétype (4 scénarios)
3. Tester mode standard + advanced
4. Vérifier affichage sur mobile

### 9.7. SEO — Impact des Changements de Copy

**Meta tags** (fichier `app/layout.tsx`, lignes 23-26):

```typescript
title: 'Matrice de l\'Expertise 2026'
description: 'Où es-tu sur la Matrice de l\'Expertise 2026 ? 7 questions. 2 minutes. Un diagnostic chirurgical.'
```

**Risque**: ⚠️ **Perte de ranking** si changement du titre/description

**Éléments SEO à préserver**:
- Mot-clé principal: "Matrice de l'Expertise"
- Chiffres attractifs: "7 questions", "2 minutes"
- Bénéfice: "diagnostic chirurgical"

**Landing page H1** (ligne 22-24):
```
"Où es-tu sur la Matrice de l'Expertise 2026 ?"
```

**Risque**: Si on change ce titre, vérifier la cohérence avec:
- Meta title
- H1
- OG tags (actuellement absents !)

**⚠️ MANQUE ACTUEL**: Pas de Open Graph tags (og:title, og:description, og:image) pour partages sociaux.

---

## 10. QUICK WINS IDENTIFIÉS

### 10.1. Incohérences Tutoiement/Vouvoiement

**Constat**:
- Landing page: **Tutoiement** ("Où es-**tu**", "ton positionnement")
- Questions quiz: **Vouvoiement** ("**Votre** dernier client", "Comment **vous** facturez")
- Upsell: **Vouvoiement** ("**Votre** diagnostic")
- Page résultats (prompt Claude): **Tutoiement** ("**Tu** es dans le quadrant")

**Impact**: Rupture de ton, manque de cohérence.

**Recommandation**: Choisir une approche et l'uniformiser partout.

**Effort**: Faible (quelques heures de modifications textuelles).

### 10.2. Hardcodé → Devrait Être Configurable

**1. Lien Calendly**:
- Actuellement: Hardcodé dans `CtaBlock.tsx`
- Devrait: Variable d'env `NEXT_PUBLIC_CALENDLY_URL`
- Bénéfice: Changement sans redéploiement, multi-environnements

**2. Textes de questions**:
- Actuellement: Constantes dans `quiz/page.tsx`
- Devrait: Fichier JSON ou table Supabase
- Bénéfice: Modifications sans dev, A/B testing, traductions futures

**3. Prompts Claude**:
- Actuellement: Hardcodés dans API route
- Devrait: Fichier `.txt` ou table Supabase
- Bénéfice: Itérations rapides sans redéploiement

**4. Copy des composants**:
- Actuellement: Hardcodé dans JSX
- Devrait: Fichier de config `content.json` ou CMS headless
- Bénéfice: Gestion par copywriter sans toucher au code

### 10.3. Mal Structuré pour Changements Futurs

**1. Noms de variables dans `diagnostic_json`**:

Les noms affichés ("Proximité au revenu", "Vitesse de preuve") sont **hardcodés côté serveur** (ligne 162-164 de `generate-diagnostic/route.ts`):

```typescript
diagnosticJson.variables = [
  { name: 'Proximité au revenu', score: scoring.base.revenue_proximity },
  { name: 'Vitesse de preuve', score: scoring.base.speed },
  { name: 'Fiabilité système', score: scoring.base.reliability },
]
```

**Problème**: Si on veut changer ces labels, il faut:
1. Modifier le code serveur
2. Redéployer
3. Les anciens diagnostics gardent les anciens labels (stockés en JSONB)

**Solution**: Stocker seulement les scores, afficher les labels côté client depuis `matrix-types.ts`.

**2. Prompt système vs prompt user**:

Le prompt système contient:
- Les règles de ton
- Les interdits
- Le format JSON

**Problème**: Si on veut tester un nouveau ton, il faut modifier le code et redéployer.

**Solution**: Externaliser dans une variable d'env ou un fichier.

### 10.4. Documentation Obsolète

**Fichier**: `BACKEND_README.md`

**Contenu obsolète**:
- Parle de "6 archétypes" (actuellement 4 quadrants)
- Mentionne scraping LinkedIn (feature supprimée)
- Schéma SQL différent de `supabase/schema.sql`
- API routes mentionnées n'existent plus (`/api/scrape-linkedin`)

**Risque**: Confusion pour nouveaux dev.

**Action**: Supprimer ou mettre à jour.

### 10.5. Pas de TODO/FIXME

**Constat**: ✅ Aucun TODO ou FIXME laissé dans le code (grep effectué).

**Interprétation**: Code considéré comme "stable" par le dev.

### 10.6. Manques Fonctionnels

**1. Email de confirmation**:
- Promesse implicite: "Où envoyer votre diagnostic ?"
- Réalité: Aucun email envoyé
- **Action**: Soit implémenter, soit changer le wording

**2. Open Graph tags**:
- Pas de og:title, og:description, og:image
- **Impact**: Partages sociaux moches
- **Effort**: 10 min de config

**3. Analytics**:
- Impossible de mesurer:
  - Taux d'abandon par question
  - Choix advanced vs standard
  - Taux de clic CTA Calendly
- **Action**: Implémenter PostHog ou Plausible

**4. Récupération par lien magique**:
- Actuellement: Recherche manuelle par email
- **Mieux**: Email avec lien direct `/resultat/[id]`
- Nécessite: Service email

**5. Mode "compléter plus tard"**:
- Actuellement: Impossible de faire les bonus après coup
- **Feature request**: Lien pour "débloquer mode avancé"
- Nécessite: Système de sessions partielles

### 10.7. Optimisations UX

**1. Barre de progression bonus**:
- Questions bonus affichent "Bonus 1/4" avec barre verte (ligne 337)
- Mais l'utilisateur ne sait pas **avant** qu'il y aura 4 questions
- **Action**: Afficher "4 questions rapides" dans l'upsell

**2. Temps de loading**:
- 6-16 secondes sans feedback granulaire
- **Action**: Messages progressifs ("Analyse des réponses...", "Génération du diagnostic...", "Finalisation...")

**3. Gestion d'erreur**:
- Si Claude API down, message générique "Une erreur est survenue"
- **Action**: Messages d'erreur spécifiques + retry automatique

**4. Validation email**:
- Validation HTML basique (`type="email"`)
- **Action**: Validation Zod côté client + feedback en temps réel

### 10.8. Sécurité / Privacy

**1. Données personnelles**:
- Email stocké en clair
- Pas de consentement RGPD explicite
- **Action**: Ajouter checkbox "J'accepte de recevoir..." avec lien vers CGU

**2. Rate limiting**:
- Pas de protection contre spam de l'API
- **Action**: Implement rate limiting (Vercel Edge Config ou Upstash Redis)

**3. Validation serveur**:
- Schéma Zod présent dans `generate-diagnostic/route.ts` ✅
- **Bien fait**: Validation des inputs côté API

---

## SYNTHÈSE FINALE

### Points Critiques pour Modifications de Copy

| Élément | Localisation | Risque Changement | Notes |
|---------|--------------|-------------------|-------|
| **Questions Q1-Q7** | `app/quiz/page.tsx` L10-81 | ⚠️ MODÉRÉ | Ne pas changer le sens des réponses |
| **Questions Q8-Q11** | `app/quiz/page.tsx` L83-124 | ⚠️ MODÉRÉ | Idem |
| **Noms quadrants** | `lib/matrix-types.ts` L142-147 | ⚠️ MODÉRÉ | Mettre à jour aussi le prompt Claude |
| **Taglines quadrants** | `lib/matrix-types.ts` L149-154 | ✅ SAFE | Purement affichage |
| **Badges statut** | `lib/matrix-types.ts` L109,119,129,137 | ✅ SAFE | Purement affichage |
| **Labels axes** | `MatrixBlock.tsx` L156-162 | ✅ SAFE | Purement affichage |
| **Titres sections** | Composants `resultat/*` | ✅ SAFE | Purement affichage |
| **Prompt Claude** | `generate-diagnostic/route.ts` L23-87 | 🔴 CRITIQUE | Impact tous futurs diagnostics |
| **Meta SEO** | `app/layout.tsx` L23-26 | ⚠️ MODÉRÉ | Impact ranking Google |
| **Lien Calendly** | `CtaBlock.tsx` L21 | ✅ SAFE | Juste une URL |

### Dépendances Externes

- **Supabase**: Essentiel, pas de fallback
- **Anthropic Claude**: Essentiel, pas de fallback
- **Systeme.io**: Optionnel (non-bloquant)
- **Vercel**: Hébergement (peut migrer sur autre provider Next.js)

### Données Non Réversibles

**⚠️ Une fois qu'un diagnostic est généré**:
1. Le texte de Claude est **figé** (stocké en JSONB)
2. On ne peut pas "rafraîchir" sans refaire le quiz
3. Changements de prompt n'impactent QUE les futurs diagnostics

**Conséquence**: Si on améliore le prompt, les anciens utilisateurs ne bénéficient pas.

**Solutions**:
- Feature "Mettre à jour mon diagnostic" (regénération)
- Email marketing pour refaire le test
- Versioning des diagnostics (v1, v2, etc.)

---

## CHECKLIST DE VALIDATION POST-CHANGEMENT

Avant de merger des modifications de copywriting:

### Tests Manuels

- [ ] Parcours complet mode standard (skip bonus)
- [ ] Parcours complet mode advanced (faire les 4 bonus)
- [ ] Test des 4 quadrants possibles (modifier réponses)
- [ ] Vérification affichage mobile
- [ ] Test email invalide
- [ ] Test récupération via `/retrouver`
- [ ] Vérification SEO (Google Search Console)
- [ ] Test partage social (og tags si ajoutés)

### Vérifications Techniques

- [ ] Aucune erreur console browser
- [ ] Aucune erreur logs Vercel
- [ ] Aucune erreur Supabase logs
- [ ] Build Next.js réussit (`npm run build`)
- [ ] TypeScript compile sans erreur
- [ ] Données Supabase cohérentes

### Vérifications Marketing

- [ ] Ton cohérent (tu/vous) partout
- [ ] Promesses tenues (pas de "recevez par email" si pas d'email)
- [ ] CTA clairs et visibles
- [ ] Pas de fautes d'orthographe
- [ ] Cohérence avec le reste du funnel (emails, pages de vente)

---

**FIN DU RAPPORT D'AUDIT TECHNIQUE**

*Document généré le 22/02/2026 par analyse exhaustive du code source.*
