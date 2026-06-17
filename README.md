# Conteneurs Maritimes — Site multi-pages (vente, location & aménagement)

Site vitrine **multi-pages** pour la vente, la location et l'aménagement de conteneurs maritimes.
Architecture et code couleur alignés sur **conteneurdumetal.fr** : thème clair, accent vert
**`#507817`**, titres serif **Merriweather**, texte **Lato**. Exécution premium et moderne.

Statique 100% client (HTML / CSS / Vanilla JS) + Tailwind CDN — **aucun build**. Déployable sur
Vercel, Netlify ou GitHub Pages.

---

## Structure

```
conteneurs-maritimes/
├── index.html         # Accueil — hero vidéo + aperçus
├── modeles.html       # Nos Modèles — grille conteneurs + aménagement
├── location.html      # Location de Conteneurs
├── devis.html         # Devis Personnalisé (formulaire 4 étapes)
├── a-propos.html      # À Propos
├── contact.html       # Contact (coordonnées + formulaire)
├── style.css          # Charte claire / verte + composants
├── main.js            # Header + footer partagés (injectés), menu mobile
├── form.js            # Logique du formulaire de devis → webhook + GA4
└── assets/
    └── hero-conteneurs.mp4   # Vidéo de la hero (accueil)
```

> Le **header et le footer** sont définis une seule fois dans `main.js` et injectés sur chaque page
> (zones `<div id="site-header">` / `<div id="site-footer">`). Pour modifier le menu ou les
> coordonnées du pied de page, éditez les constantes `NAV` et `CONTACT` en haut de [main.js](main.js).

## Démarrage local

```powershell
python -m http.server 8080
```
Puis http://localhost:8080.

---

## ⚙️ Configuration avant mise en ligne

### 1. Webhook (réception des leads)
Le formulaire de devis envoie le lead en JSON via `fetch`. Dans [form.js](form.js) :
```js
const WEBHOOK_URL = 'https://hook.eu1.make.com/votre-endpoint';
```
Faites de même dans le script inline de [contact.html](contact.html) (constante `WEBHOOK_URL`).
Sans webhook, les deux formulaires basculent sur un `mailto:` de secours.

### 2. Google Analytics 4
Remplacez `G-XXXXXXXXXX` par votre ID de mesure dans **chaque page HTML** (en-tête).
À chaque envoi de formulaire, l'événement `generate_lead_container` est poussé dans le `dataLayer`.
Créez un déclencheur GA4/GTM sur cet événement et marquez-le comme **conversion**.

### 3. Coordonnées & menu
Email, téléphone et libellés du menu se configurent dans `NAV` / `CONTACT` en haut de [main.js](main.js).
Pensez aussi à `FALLBACK_EMAIL` dans [form.js](form.js) et [contact.html](contact.html).

### 4. Visuels
Les images sont des placeholders Unsplash (`alt` descriptifs renseignés). Remplacez-les par vos
photos réelles (parc de conteneurs, réalisations d'aménagement, livraison camion grue).

---

## 🚀 Déploiement
- **Vercel** : `npx vercel` (statique auto-détecté).
- **Netlify** : drag & drop du dossier sur app.netlify.com/drop.
- **GitHub Pages** : push + Settings → Pages → `main` / `/root`.

## Pages & navigation

| Page        | Fichier         | Contenu |
|-------------|-----------------|---------|
| Accueil     | `index.html`    | Hero vidéo, réassurance, aperçu modèles/aménagement/livraison, CTA |
| Nos Modèles | `modeles.html`  | Conteneurs 10'/20'/40'/HC + conteneurs aménagés par usage |
| Location    | `location.html` | Location vs achat, avantages, cas d'usage |
| Devis       | `devis.html`    | Formulaire 4 étapes → webhook + GA4 |
| À Propos    | `a-propos.html` | Histoire, chiffres, engagements |
| Contact     | `contact.html`  | Coordonnées + formulaire de contact |

## ✅ Checklist mise en ligne
- [ ] `WEBHOOK_URL` dans `form.js` **et** `contact.html`
- [ ] ID GA4 `G-XXXXXXXXXX` dans les 6 pages
- [ ] Email / téléphone / menu dans `main.js`
- [ ] Remplacer les images Unsplash par les vraies photos
- [ ] Tester les 2 formulaires de bout en bout
- [ ] Vérifier l'événement `generate_lead_container` (GA4 DebugView)
- [ ] Tester sur mobile (menu burger + autoplay vidéo iOS/Android)
