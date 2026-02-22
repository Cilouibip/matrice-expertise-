# PLAN D'IMPLÉMENTATION — Copywriting Matrice 2026

**Date**: 22 février 2026
**Status**: 📋 Plan prêt à exécuter
**Durée estimée**: 2-3 heures
**Risque**: ⚠️ MODÉRÉ (modifications importantes du prompt IA)

---

## 🎯 OBJECTIF

Refondre tout le copywriting de l'application pour passer d'un ton professionnel/distant à un ton direct/tutoiement, tout en améliorant drastiquement le prompt IA pour des diagnostics plus spécifiques et actionnables.

**RÈGLE ABSOLUE**: Ne JAMAIS toucher aux `id` des questions (q1-q11) ni aux `value` (1-4) des options. Le scoring DOIT rester intact.

---

## 📊 ORDRE D'EXÉCUTION

### Phase 1 : Fichiers de Config (Faible risque)
1. `lib/matrix-types.ts` — Taglines des quadrants
2. `app/layout.tsx` — Meta SEO

### Phase 2 : Pages Principales (Risque modéré)
3. `app/page.tsx` — Landing page
4. `app/retrouver/page.tsx` — Page de récupération

### Phase 3 : Quiz (Risque modéré - ATTENTION à l'ordre)
5. `app/quiz/page.tsx` — Questions + Upsell + Email + Loading

### Phase 4 : Composants Résultats (Faible risque)
6. `components/resultat/HeaderBlock.tsx`
7. `components/resultat/MatrixBlock.tsx`
8. `components/resultat/ScoreBlock.tsx`
9. `components/resultat/DiagnosticBlock.tsx`
10. `components/resultat/MovesBlock.tsx`
11. `components/resultat/MoatBlock.tsx`
12. `components/resultat/CtaBlock.tsx`

### Phase 5 : Prompt IA (CRITIQUE - à faire en dernier)
13. `app/api/generate-diagnostic/route.ts` — Nouveau prompt système + user

---

## 📝 DÉTAIL PAR FICHIER

### 1. `lib/matrix-types.ts`

**Lignes à modifier**: 149-154

**Changement**: Remplacer le bloc `QUADRANT_TAGLINES`

**Avant**:
```typescript
export const QUADRANT_TAGLINES: Record<Quadrant, string> = {
  formateur_fantome: 'Zone de mort',
  sage_fragile: 'Expert respecté, business fragile',
  operateur_certitude: 'Le Saint Graal',
  agence_commodite: 'Course vers le bas',
}
```

**Après**:
```typescript
export const QUADRANT_TAGLINES: Record<Quadrant, string> = {
  formateur_fantome: "Tu vends du savoir. L'IA le donne gratuitement.",
  sage_fragile: "Tout le monde te respecte. Personne ne peut te remplacer. C'est le problème.",
  operateur_certitude: "Tu ne vends pas du service. Tu vends de la certitude.",
  agence_commodite: "Tu fais le boulot. Mais n'importe qui pourrait le faire à ta place.",
}
```

**Risque**: ✅ AUCUN (purement affichage)

---

### 2. `app/layout.tsx`

**Lignes à modifier**: 23-26

**Changements**:
- title: PAS DE CHANGEMENT
- description: Modifier

**Avant**:
```typescript
export const metadata: Metadata = {
  title: 'Matrice de l\'Expertise 2026',
  description: 'Où es-tu sur la Matrice de l\'Expertise 2026 ? 7 questions. 2 minutes. Un diagnostic chirurgical.',
}
```

**Après**:
```typescript
export const metadata: Metadata = {
  title: 'Matrice de l\'Expertise 2026',
  description: 'Tu vends de l\'expertise. La matrice te dit si ton business survit en 2026. 7 questions. 2 minutes. Diagnostic IA.',
}
```

**Risque**: ⚠️ MODÉRÉ (SEO - vérifier ranking après déploiement)

---

### 3. `app/page.tsx`

**Lignes à modifier**: Multiple

**Changements**:

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 22-24 | H1 | "Où es-tu sur la Matrice..." | "Tu vends de l'expertise. Mais tu vends quoi, exactement ?" |
| 25-27 | Sous-titre | "7 questions. 2 minutes..." | "7 questions. 2 minutes. La matrice te dit si ton business survit en 2026 — ou pas." |
| 36 | CTA | "Commencer le diagnostic →" | "Passer le diagnostic →" |
| 64 | Card 1 titre | "Matrice 2×2" | "Ta position sur la Matrice" |
| 65 | Card 1 desc | "Découvre dans quel cadran..." | "Information, Transformation ou Certitude — tu vois exactement où tu es." |
| 78 | Card 2 titre | PAS DE CHANGEMENT | |
| 79 | Card 2 desc | "Mesure mathématiquement..." | "Proximité au revenu, vitesse, fiabilité — tes 3 variables passées au scanner." |
| 92 | Card 3 titre | "Plan d'Action" | "Tes 2 Moves" |
| 93 | Card 3 desc | "Reçois les actions exactes..." | "Un Move Commando pour cette semaine. Un Move Builder pour ce mois. Générés par l'IA." |

**Risque**: ✅ SAFE (purement affichage)

---

### 4. `app/retrouver/page.tsx`

**Lignes à modifier**: 73-75, 88, 123-129

**Changements**:

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 73-75 | Description | "Entrez l'adresse email..." | "Entre l'email que tu as utilisé pour le diagnostic." |
| 88 | Placeholder | "vous@entreprise.com" | "ton@email.com" |
| 123-129 | Lien quiz | "Vous n'avez pas encore passé le test ? Commencer l'évaluation →" | "Tu n'as pas encore passé le test ? Passer le diagnostic →" |

**Risque**: ✅ SAFE

---

### 5. `app/quiz/page.tsx` ⚠️ FICHIER CRITIQUE

#### 5.1 RÉORDONNEMENT `CORE_QUESTIONS` (lignes 10-81)

**ACTION CRITIQUE**: Réorganiser l'array pour que l'ordre soit : Q4, Q5, Q3, Q6, Q1, Q2, Q7

**IMPORTANT**: Garder les objets INTACTS avec leurs `id` et `value`. Juste changer l'ORDRE dans l'array.

**Nouvel array complet** (remplacer lignes 10-81):

```typescript
const CORE_QUESTIONS = [
  {
    id: 'q4',
    text: "Un prospect te demande : 'Qu'est-ce qui me prouve que ça va marcher ?' — tu réponds quoi ?",
    options: [
      { value: 1, label: "Mon parcours, mes certifs, mes témoignages" },
      { value: 2, label: "Ma méthode pas à pas et pourquoi elle est différente" },
      { value: 3, label: "Des résultats chiffrés de clients dans une situation similaire" },
      { value: 4, label: "Un premier sprint court avec un objectif mesurable — avant tout engagement long" }
    ]
  },
  {
    id: 'q5',
    text: "Ta prestation est finie. Tu pars. Qu'est-ce qui reste chez ton client ?",
    options: [
      { value: 1, label: "Des notes, un PDF, un replay" },
      { value: 2, label: "Un plan d'action ou une méthode à suivre" },
      { value: 3, label: "Des templates et outils configurés qu'il utilise au quotidien" },
      { value: 4, label: "Un système qui tourne sans moi (dashboard, automations, data)" }
    ]
  },
  {
    id: 'q3',
    text: "Comment tu factures ?",
    options: [
      { value: 1, label: "Au temps passé (TJM, taux horaire)" },
      { value: 2, label: "Au forfait projet (périmètre fixé, prix fixé)" },
      { value: 3, label: "En abonnement (retainer, accompagnement continu)" },
      { value: 4, label: "En partie variable, indexée sur un résultat du client" }
    ]
  },
  {
    id: 'q6',
    text: "Le résultat que tu livres dépend principalement de quoi ?",
    options: [
      { value: 1, label: "De la motivation du client (s'il applique ou pas)" },
      { value: 2, label: "De ma propre exécution (si je suis bon ce jour-là)" },
      { value: 3, label: "Du marché du client (s'il y a des opportunités)" },
      { value: 4, label: "D'un système outillé avec de la data et des boucles de contrôle" }
    ]
  },
  {
    id: 'q1',
    text: "Quel pourcentage de ton CA vient de clients qui re-signent dans les 12 mois ?",
    options: [
      { value: 1, label: "Moins de 10%" },
      { value: 2, label: "10-30%" },
      { value: 3, label: "30-60%" },
      { value: 4, label: "Plus de 60%" }
    ]
  },
  {
    id: 'q2',
    text: "Ton dernier client a eu un problème après ta prestation. Qu'est-ce qui s'est passé ?",
    options: [
      { value: 1, label: "Il ne m'a pas recontacté — mission terminée, bonne chance" },
      { value: 2, label: "Il m'a envoyé un message, j'ai répondu au cas par cas" },
      { value: 3, label: "On avait un suivi planifié, on a réglé ça ensemble" },
      { value: 4, label: "Un système que j'avais installé a détecté le problème avant lui" }
    ]
  },
  {
    id: 'q7',
    text: "Demain, ton canal d'acquisition principal se coupe. Tu as quoi ?",
    options: [
      { value: 1, label: "Rien. Je reprends le téléphone" },
      { value: 2, label: "Mon réseau — je recontacte des gens un par un" },
      { value: 3, label: "Du contenu organique (YouTube, newsletter, LinkedIn) qui tourne sans moi" },
      { value: 4, label: "Plusieurs canaux actifs en parallèle, dont de l'organique qui scale" }
    ]
  }
]
```

**Risque**: ✅ AUCUN SI bien fait (scoring utilise les IDs, pas l'ordre)

#### 5.2 RÉÉCRITURE `BONUS_QUESTIONS` (lignes 83-124)

**Remplacer l'array complet**:

```typescript
const BONUS_QUESTIONS = [
  {
    id: 'q8',
    text: "Tu as de la data structurée sur les résultats de tes anciens clients ?",
    options: [
      { value: 1, label: "Non, j'ai pas vraiment suivi ça" },
      { value: 2, label: "Quelques témoignages et retours informels" },
      { value: 3, label: "Des métriques clés pour la plupart de mes clients" },
      { value: 4, label: "Une base de données avec benchmarks, patterns et résultats comparables" }
    ]
  },
  {
    id: 'q9',
    text: "Si une IA devait te remplacer demain, qu'est-ce qui l'en empêcherait ?",
    options: [
      { value: 1, label: "Honnêtement, pas grand-chose" },
      { value: 2, label: "Quelques process écrits et des templates" },
      { value: 3, label: "Des process documentés, des SOPs, des outils qui font une partie du boulot" },
      { value: 4, label: "Un système complet : process, data, automations, outils propriétaires" }
    ]
  },
  {
    id: 'q10',
    text: "Combien de clients tu peux gérer en même temps sans que la qualité baisse ?",
    options: [
      { value: 1, label: "1 à 3" },
      { value: 2, label: "4 à 8" },
      { value: 3, label: "9 à 15" },
      { value: 4, label: "Plus de 15" }
    ]
  },
  {
    id: 'q11',
    text: "C'est quoi le truc qui te bouffe le plus en ce moment ?",
    options: [
      { value: "acquisition", label: "L'acquisition — je sais pas d'où vient le prochain client" },
      { value: "marges", label: "Les marges — je bosse trop pour ce que je gagne" },
      { value: "resultats", label: "Les résultats — mes clients n'appliquent pas, ou c'est irrégulier" },
      { value: "remplacable", label: "La peur d'être remplaçable" }
    ]
  }
]
```

**Risque**: ⚠️ MODÉRÉ (Q11 value reste string, vérifier que Q8-Q10 restent 1-4)

#### 5.3 UPSELL (lignes 297-322)

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 297-299 | Titre | "Votre diagnostic de base est prêt." | "Ton diagnostic de base est prêt." |
| 300-302 | Description | "4 questions de plus en 60 secondes..." | "4 questions de plus. 60 secondes. Tu débloques deux trucs que les autres n'auront pas : ton score de vulnérabilité face à l'IA, et ton niveau de MOAT — tes avantages que personne ne peut copier." |
| 311-313 | CTA 1 | "Continuer vers le diagnostic avancé (Recommandé)" | "Débloquer le diagnostic complet (60 sec) →" |
| 320-322 | CTA 2 | "Non merci, voir mon résultat de base" | "Voir mon résultat de base →" |

#### 5.4 CAPTURE EMAIL (lignes 372-416)

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 372-374 | Titre | "Où envoyer votre diagnostic ?" | "Où on t'envoie ton diagnostic ?" |
| 375-377 | Description | "L'IA va générer votre position..." | "L'IA génère ta position sur la matrice, tes scores, et ton plan d'action personnalisé. Tu le reçois par email." |
| 390 | Placeholder prénom | "Votre prénom" | "Ton prénom" |
| 403 | Placeholder email | "vous@entreprise.com" | "ton@email.com" |
| 181 | Erreur | "L'email est requis pour recevoir le diagnostic." | "Il me faut ton email pour t'envoyer le diagnostic." |

#### 5.5 LOADING (lignes 437-439)

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 437-439 | Sous-titre | "Génération du rapport par l'IA" | "L'IA croise tes réponses avec la Matrice..." |

**Risque global fichier**: ⚠️ MODÉRÉ (beaucoup de changements, bien tester)

---

### 6. `components/resultat/HeaderBlock.tsx`

**Ligne à modifier**: 107

**Avant**: `<span>Score</span>`
**Après**: `<span>Score de Certitude</span>`

**Risque**: ✅ SAFE

---

### 7. `components/resultat/MatrixBlock.tsx`

**Lignes à modifier**: 156-162

**Changements**:

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 156 | Axe X Gauche | "VOUS FAITES TOUT" | "TU FAIS TOUT" |
| 157 | Axe X Droite | "ON FAIT POUR VOUS" | "ON OUVRE LE CAPOT" |

**Risque**: ✅ SAFE

---

### 8. `components/resultat/ScoreBlock.tsx`

**Ligne à modifier**: 29

**Avant**: "Variables de Certitude"
**Après**: "Les 3 Variables"

**Risque**: ✅ SAFE

---

### 9. `components/resultat/DiagnosticBlock.tsx`

**Lignes à modifier**: 30, 41, 58

**Changements**:

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 30 | Card 1 label | "La Réalité" | "Là où tu en es" |
| 41 | Card 2 label | "Le Vrai Problème" | "Le vrai problème" |
| 58 | Card 3 label | "Risque à 6-12 mois" | "Si tu ne bouges pas" |

**Risque**: ✅ SAFE

---

### 10. `components/resultat/MovesBlock.tsx`

**Ligne à modifier**: 24

**Avant**: "Plan d'Action"
**Après**: "Tes 2 Moves"

**Risque**: ✅ SAFE

---

### 11. `components/resultat/MoatBlock.tsx`

**Lignes à modifier**: 16 ou 50, 26-28, 90

**Changements**:

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 16 ou 50 | Titre section | "Défensibilité (MOAT)" | "Tes MOAT — ce qu'on ne peut pas te copier" |
| 26-28 | Message lock | "Données limitées — passez en mode avancé..." | "Diagnostic incomplet. Repasse le test avec les 4 questions bonus pour débloquer ton score MOAT et ta vulnérabilité IA." |
| 90 | Label | "Vulnérabilité IA" | "Vulnérabilité face à l'IA" |

**Risque**: ✅ SAFE

---

### 12. `components/resultat/CtaBlock.tsx`

**Lignes à modifier**: 14, 17, 26, 30

**Changements**:

| Ligne | Élément | Avant | Après |
|-------|---------|-------|-------|
| 14 | Titre | "Prêt à changer de cadran ?" | "Tu veux bouger sur la matrice ?" |
| 17 | Description | "Réserve un appel stratégique de 15 minutes..." | "15 minutes. On regarde ta situation. On identifie le premier move. Pas de pitch, pas de bullshit." |
| 26 | CTA | "Réserver mon appel stratégique →" | "Réserver mes 15 minutes →" |
| 30 | Réassurance | "100% gratuit. Pas de blabla, juste de la stratégie." | "Gratuit. Pas de blabla. Juste ton prochain move." |

**Risque**: ✅ SAFE

---

### 13. `app/api/generate-diagnostic/route.ts` 🔴 CRITIQUE

**Lignes à modifier**: 23-87 (SYSTÈME PROMPT) + 101-134 (USER PROMPT)

#### 13.1 SYSTÈME PROMPT (lignes 23-87)

**ACTION**: Remplacer L'INTÉGRALITÉ du prompt système par le nouveau (voir document source)

**Points clés du nouveau prompt**:
- Thèse des 3 ères (Information → Transformation → Certitude)
- Description détaillée des 4 quadrants avec exemples concrets
- Formule de certitude expliquée
- Définition des 2 Moves (Commando vs Builder)
- Les 3 MOAT (Tech, Distribution, Data)
- Ton direct et tutoiement
- Interdits spécifiques
- Règles de diagnostic PAR QUADRANT

**Longueur**: ~200 lignes (vs ~60 actuellement)

#### 13.2 USER PROMPT (lignes 101-134)

**ACTION**: Remplacer le template par le nouveau

**Changements clés**:
- Labels des axes en tutoiement
- Commentaires explicatifs pour chaque Q1-Q7
- Instructions finales plus détaillées
- Demande de croiser les réponses

**Risque**: 🔴 CRITIQUE
- Tous les futurs diagnostics seront impactés
- Les anciens diagnostics gardent leur texte (figé en base)
- Tester EXHAUSTIVEMENT sur les 4 quadrants

---

## ✅ CHECKLIST DE PRÉ-DÉPLOIEMENT

Avant de commencer les modifications :

- [ ] Créer une branche Git `feature/copywriting-refonte`
- [ ] Backup de la base Supabase (export sessions récentes pour tests)
- [ ] Lire l'intégralité du plan
- [ ] Identifier un collègue pour review

---

## ✅ CHECKLIST POST-MODIFICATIONS

Après avoir fait TOUS les changements :

### Tests Fonctionnels

- [ ] Build Next.js réussit (`npm run build`)
- [ ] TypeScript compile sans erreur (`npm run lint`)
- [ ] Aucune erreur console browser (F12)

### Tests Parcours Utilisateur

#### Parcours Standard (skip bonus)
- [ ] Landing → textes en tutoiement
- [ ] Quiz démarre avec Q4 (système de preuve)
- [ ] Ordre correct : Q4, Q5, Q3, Q6, Q1, Q2, Q7
- [ ] Upsell → nouveaux textes
- [ ] Skip bonus → Email capture
- [ ] Email capture → nouveaux textes + tutoiement
- [ ] Loading → nouveau sous-titre
- [ ] Redirection résultats → tout s'affiche

#### Parcours Advanced (avec bonus)
- [ ] Après Q7 → Upsell
- [ ] Continuer → Questions bonus (nouvel ordre : Q8, Q9, Q10, Q11)
- [ ] Email capture → soumission
- [ ] Résultats → tout s'affiche

### Tests Scoring (CRITIQUE)

Avec ces réponses : q1=2, q2=3, q3=2, q4=3, q5=2, q6=3, q7=3

**Résultats attendus**:
- [ ] axis_x = 2.5 (calculé depuis Q2=3 et Q5=2)
- [ ] axis_y = 2.0 (calculé depuis Q1=2 et Q3=2)
- [ ] Quadrant = agence_commodite
- [ ] revenue_proximity = 2 (Q3)
- [ ] speed = 3 (Q4)
- [ ] reliability = 3 (Q6)
- [ ] certainty_score = 28/100

Si ces valeurs sont correctes → scoring intact ✅

### Tests Affichage Résultats

- [ ] Header → Badge, nom archétype, nouvelle tagline
- [ ] Matrice → Nouveaux labels axes
- [ ] Score → "Les 3 Variables" (titre)
- [ ] Diagnostic → Nouveaux labels 3 cartes
- [ ] Moves → "Tes 2 Moves" (titre)
- [ ] MOAT → Nouveau titre, nouveau message lock
- [ ] CTA → Nouveaux textes

### Tests Prompt IA (CRITIQUE)

Pour chaque quadrant, générer un diagnostic et vérifier :

#### Expert Fantôme (axis_x < 2.5, axis_y < 2.5)
- [ ] Le diagnostic mentionne "zone de mort" ou "IA te remplace"
- [ ] Le Move Commando propose un test de réalité (sprint payant)
- [ ] Le Move Builder pousse vers du DFY
- [ ] Le risque est brutal et spécifique

#### Agence Commodité (axis_x >= 2.5, axis_y < 2.5)
- [ ] Le diagnostic parle d'absence de preuve
- [ ] Le Move Commando introduit un KPI mesurable
- [ ] Le Move Builder propose un dashboard/reporting

#### Sage Fragile (axis_x < 2.5, axis_y >= 2.5)
- [ ] Le diagnostic respecte l'expertise
- [ ] Le problème identifié = dépendance personnelle
- [ ] Le Move Commando = documenter/systématiser
- [ ] Le risque = burnout/plafond

#### Opérateur de Certitude (axis_x >= 2.5, axis_y >= 2.5)
- [ ] Pas de faux encouragements
- [ ] Angles morts identifiés
- [ ] Focus sur scalabilité/défensibilité

### Tests IA Spécificité

- [ ] Deux diagnostics du même quadrant MAIS avec scores différents sont DIFFÉRENTS
- [ ] Le diagnostic croise les réponses (ex: Q3=1 + Q5=4 = incohérence mentionnée)
- [ ] Variables à 1/4 sont traitées comme urgences
- [ ] Les Moves sont ACTIONNABLES (pas vagues)

### Tests Intégrations

- [ ] Email envoyé via Systeme.io (vérifier tag dans Systeme)
- [ ] Session sauvegardée en Supabase
- [ ] Récupération via `/retrouver` fonctionne
- [ ] Nouveaux textes page `/retrouver`

### Tests Mobile

- [ ] Landing responsive
- [ ] Quiz responsive (boutons pas tronqués)
- [ ] Résultats responsive (matrice lisible)
- [ ] Nouveaux textes longs pas tronqués

---

## 🚨 POINTS DE VIGILANCE

### 1. Réordonnement Questions ⚠️
- Vérifier que `id` et `value` sont INTACTS
- Tester le scoring avec les mêmes réponses avant/après
- Si le scoring change → ROLLBACK immédiat

### 2. Prompt IA 🔴
- Tester sur les 4 quadrants AVANT merge
- Comparer ancien vs nouveau diagnostic (qualité)
- Si le nouveau est moins bon → itérer sur le prompt
- Anciens diagnostics ne seront PAS regénérés

### 3. Tutoiement Partout
- Grep "vous" et "votre" dans tous les fichiers modifiés
- Vérifier cohérence (pas de mix tu/vous)

### 4. SEO
- Surveiller Google Search Console post-déploiement
- Si baisse trafic → ajuster meta description

---

## 📦 DÉPLOIEMENT

### Stratégie recommandée

1. **Local** : Faire TOUTES les modifications
2. **Tests** : Passer toute la checklist
3. **Git** : Commit avec message descriptif
4. **Vercel Preview** : Push branche → tester en preview
5. **Merge** : Si tout OK → merge vers main
6. **Production** : Vercel déploie auto
7. **Monitoring** : Surveiller logs Vercel 1h post-deploy

### Rollback si problème

1. Vercel : Revert vers déploiement précédent (1 clic)
2. Git : `git revert` si nécessaire
3. Ne PAS rollback si le seul problème est la qualité du prompt → itérer sur le prompt

---

## 📊 MÉTRIQUES DE SUCCÈS

### Immédiat (J+1)
- [ ] Aucune erreur dans logs Vercel
- [ ] Aucune erreur dans logs Supabase
- [ ] Scoring fonctionne (comparer sessions avant/après)
- [ ] Emails Systeme.io envoyés

### Court terme (J+7)
- [ ] Taux de complétion quiz maintenu ou amélioré
- [ ] Taux de clic "Diagnostic avancé" (upsell)
- [ ] Qualité perçue des diagnostics (feedback utilisateurs)
- [ ] Taux de clic CTA Calendly

### Moyen terme (J+30)
- [ ] Trafic organique maintenu (SEO)
- [ ] Nombre de sessions créées (tendance)
- [ ] Feedback utilisateurs (email, DM)

---

## 🎯 RÉSUMÉ EXÉCUTIF

**Fichiers impactés**: 15
**Risque global**: ⚠️ MODÉRÉ
**Point le plus critique**: Prompt IA (route.ts)
**Temps estimé**: 2-3 heures (modifs + tests)
**Rollback possible**: Oui (Vercel 1-clic ou git revert)

**Ordre recommandé**:
1. Config (types, layout) → Risque faible
2. Pages simples (landing, retrouver) → Risque faible
3. Quiz → Risque modéré (attention ordre)
4. Composants résultats → Risque faible
5. Prompt IA → Risque critique (faire en dernier, bien tester)

**Validation finale**: Faire le quiz 4 fois (1 pour chaque quadrant) et vérifier que les diagnostics sont spécifiques, actionnables, et différents les uns des autres.

---

**FIN DU PLAN — Prêt à exécuter**
