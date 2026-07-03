# AIMC — AI Makers Club

> **Ceux qui font.**
>
> 3 missions, 1 seul terrain.

**🌐 [aimc-site.vercel.app](https://aimc-site.vercel.app)**

---

Association loi 1901 des builders IA francophones. Démos, benchmarks, retours terrain. Pas un cabinet de conseil déguisé. Pas un lobby. Pas là pour vendre du rêve.

## Le site

9 pages statiques HTML/CSS/JS vanilla — pas de framework, pas de build step, pas de dépendance.

| Page | Contenu |
|---|---|
| `index.html` | Hero + 3 piliers + bandeau négatif + partenaires |
| `manifeste.html` | Manifeste long-form dark, assertions négatives |
| `bureau.html` | 6 membres fondateurs, statuts, transparence |
| `lab.html` | Demo Day, benchmarks, cartographie, calendrier |
| `adherer.html` | 4 formules (20€ étudiant/DE, 60€ individuelle, 1 200€ entreprise) |
| `contenu.html` | Blog avec filtres + newsletter |
| `jobs.html` | Job board builders IA |
| `partenaires.html` | Logos + 4 types de partenariat |
| `contact.html` | Formulaire Resend + 5 canaux |

## Stack

- **HTML/CSS** statique pur — ouvrable direct dans un navigateur
- **Design system V3 hybride** : 2 régimes (sombre machine + clair atelier), 9 couleurs, Space Grotesk / Inter / IBM Plex Mono
- **JavaScript vanilla** (`assets/partials.js`) : header/footer injectés, cascade scroll bandeau négatif, filtres, FAQ accordion, boot log rotatif
- **API serverless** (`api/contact.js`) : Vercel Function → Resend (zéro dépendance npm)
- **Hébergement** : Vercel (statique + 1 fonction), déploiement automatique sur push `main`
- **Paiement** : HelloAsso (iframe/lien externe)

## Design system V3

| Régime | Fond | Usage |
|---|---|---|
| **Machine** (sombre) | `#0C0C0A` | Header, footer, hero, manifeste, bandeaux, CTAs |
| **Atelier** (clair) | `#FAF7F2` | Corps de page, cartes, formulaires, FAQ |

| Couleur | Hex | Rôle |
|---|---|---|
| Papier | `#FAF7F2` | Fond clair |
| Encre | `#0C0C0A` | Fond sombre |
| Beige | `#EBE4D3` | Sections alternées |
| Lime | `#B6FF00` | Accent principal, liens actifs, CRT |
| Orange | `#E8590C` | Boutons, tags, accents atelier |
| Bleu | `#1E5A8A` | Tags secondaires |
| Rouge | `#E63946` | Glitch, erreurs |
| Texte | `#1C1B18` | Corps de texte |
| Gris carton | `#B8B2A7` | Éléments inactifs, mute |

## Contribuer

```bash
git clone https://github.com/bdeaks/aimc-site.git
cd aimc-site
open index.html  # ça marche direct, pas de npm install
```

Les pages sont en HTML statique pur. Le header/footer partagé est injecté par `assets/partials.js`. Toute PR qui casse l'ouverture directe dans un navigateur sera refusée.

## Déploiement

```bash
vercel --prod
```

Push sur `main` = déploiement automatique.

## Licence

Projet associatif — contenu sous licence ouverte. Les logos partenaires (INOWI, Maîtrise Avenir, Clever Cloud) restent la propriété de leurs marques respectives.
