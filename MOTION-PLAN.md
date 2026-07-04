# AIMC Motion Plan — Grammaire signature + Top 5 zones

## Manifeste

> **Chaque animation trace le geste d'un builder qui écrit du code : terminal, précis, jamais gratuit.**

## Grille timing (signature unique)

| Durée | Nom | Usage |
|-------|-----|-------|
| 200ms | `--t-short` | Hover, focus, feedback immédiat |
| 500ms | `--t-med` | Reveal cards, fade contents |
| 600ms | `--t-long` | Path draw, underline, cursor sweep |
| 800ms | `--t-hero` | Hero draw, scan CRT bandeau négatif |

**Easing signature partout** : `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo)
**Blink binaire** : `steps(1)` uniquement pour curseur

## 4 primitives (assets/motion.css)

### A — `terminal-line`
Trait lime 40px qui se dessine gauche→droite. Kickers, séparateurs, sous-titres.
Stack : CSS pur (`stroke-dasharray` OU `width` transition).

### B — `cursor-blink`
Bloc lime 10×18px qui bat. Tagline header, loaders, "processing".
Stack : CSS pur, `animation: blink 1.06s step-end infinite`.

### C — `content-reveal`
translateY(20px) → 0 + fade + border-left lime au reveal. Stagger 150ms via `nth-child`.
Stack : CSS pur + IntersectionObserver (déjà en place dans `partials.js`).

### D — `neg-cascade`
Scan CRT lime qui traverse chaque `.neg-line` une seule fois. Extension du bandeau négatif existant.
Stack : CSS pur, pseudo-élément `::before` + `linear-gradient` + `animation`.

## Top 5 zones à animer

### N°1 — Hero logo AIMC draw-in
- **Fichier** : `index.html`, `.hero` (logo actuellement PNG)
- **Pattern** : convertir logo PNG → SVG path, animer `stroke-dashoffset` au load
- **Stack** : CSS pur si SVG dispo, sinon vectoriser le PNG au potrace
- **LOC** : ~15 CSS + 1 SVG
- **Inspiration** : Vercel og-images, Rauno logo transitions
- **⚠️ Bloqueur** : logo actuellement bitmap tracé. À vectoriser proprement d'abord.

### N°2 — Header boot log console bar
- **Fichier** : `assets/partials.js` (boot log rotator existant) + CSS
- **Pattern** : ajouter `cursor-blink` (primitive B) à la fin du texte tagline `$ BOOT: aimc.dev v0.1.0 · READY.`
- **Stack** : CSS pur, 8 lignes
- **LOC** : ~8 CSS + 1 ligne HTML
- **Inspiration** : terminal CRT physique
- **Impact/effort** : 5/1 — quick win maximal

### N°3 — Partenaires "Ce qu'on ne fait pas" rule accent
- **Fichier** : `partenaires.html`, section `<section class="beige">`, dernier `<p>` avec border-left orange
- **Pattern** : la barre `border-left` pulse doucement à l'entrée dans le viewport (glow lime intermittent), puis les lignes se révèlent en cascade.
- **Stack** : CSS pur, `::before` + `@keyframes glow-pulse`
- **LOC** : ~15 CSS + 1 classe HTML
- **Inspiration** : Emil Kowalski cursor blink borders, Aceternity border glow

### N°4 — Manifeste titres de section — underline draw
- **Fichier** : `manifeste.html` + tous les `.sec-head h2` du site (application globale)
- **Pattern** : un trait lime 1.5px sous chaque `<h2>` qui se dessine (`transform: scaleX(0)` → `scaleX(1)`) au reveal via l'IntersectionObserver existant
- **Stack** : CSS pur + hook sur observer existant dans `partials.js`
- **LOC** : ~10 CSS + 5 JS
- **Inspiration** : Vercel landing headings, Rauno text reveal

### N°5 — Lab calendar timeline SVG
- **Fichier** : `lab.html`, section `<section class="beige">` bloc calendrier 5 entrées
- **Pattern** : timeline SVG verticale/horizontale, `stroke-dashoffset` reveal au scroll, dots progressifs pour chaque entrée
- **Stack** : SVG inline + CSS pur (`stroke-dasharray`)
- **LOC** : ~40 SVG + 20 CSS
- **Inspiration** : Linear roadmap timeline, Vercel changelog

## Anti-patterns interdits

1. ❌ Particles/starfield/blob morphing (générique, cheap)
2. ❌ `hue-rotate infinite` sur des accents (nauséeux)
3. ❌ Parallax fort au scroll (cheap Awwwards)
4. ❌ Auto-play vidéo/gif décoratif
5. ❌ Loops perpétuels (le lime doit "pulser" à l'action, pas en permanence)
6. ❌ Animation ignorant `prefers-reduced-motion`
7. ❌ Ease-in générique (utiliser easing signature partout)
8. ❌ Micro-interactions Bootstrap-like (rebond, spring, bounce)

## Reco stack

**CSS pur > Motion One > tout le reste.**
- CSS pur suffit pour les 4 primitives + les 5 zones du top
- Motion One (11KB gzipped) seulement si stagger complexes ou timing scroll-driven
- **GSAP interdit** — trop lourd, overkill, cassera la philo Ponytail
- **Ponytail rung 4 (native)** : IntersectionObserver déjà instancié dans `partials.js`, à réutiliser

## Accessibility

Chaque primitive doit inclure :
```css
@media (prefers-reduced-motion: reduce) {
  /* Animation off, état final visible immédiatement */
}
```

## Ordre d'implémentation recommandé

1. **`assets/motion.css`** — 4 primitives + variables timing (1 commit)
2. **N°2 (cursor-blink header)** — quick win visible partout (1 commit)
3. **N°4 (underline h2 global)** — impact esthétique max, 1 fichier CSS (1 commit)
4. **N°3 (partenaires rule)** — micro-interaction éditoriale (1 commit)
5. **N°1 (hero logo draw)** — nécessite vectorisation logo AVANT (1 commit + 1 asset)
6. **N°5 (timeline lab)** — SVG inline substantial, à faire proprement (1 commit)

## Risques identifiés

1. Logo AIMC en bitmap tracé → vectorisation propre requise avant N°1
2. Cumul avec `.reveal` existant → réutiliser observer, pas créer un 2e
3. `prefers-reduced-motion` doit être testé sur chaque primitive
4. Boot log rotator déjà en JS → attention à ne pas casser la logique existante en ajoutant le cursor
5. Perf mobile : garder `will-change: transform` sur les éléments animés, retirer après
6. Cohérence : ne PAS mixer les easings — un seul partout
7. Sur-animation : max 3 animations visibles simultanément sur un même viewport
8. Motion.css doit être chargé AVANT partials.js pour éviter FOUC
