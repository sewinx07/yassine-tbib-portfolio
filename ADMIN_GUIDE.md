# Guide d’administration (français)

Ce site est modifiable sans toucher au code. Le panneau se trouve sur **`https://portfolio-yassine.vercel.app/admin/`** (ou sur `http://localhost:5173/admin/` en local). Il n’est pas lié depuis le site public et il est exclu de `robots.txt` et du sitemap.

## Se connecter

1. Ouvrez `/admin/`.
2. Cliquez sur **Se connecter avec GitHub**.
3. Autorisez l’application GitHub. Vous devez avoir accès en écriture au dépôt du portfolio.

En local, lancez deux terminaux :

```bash
npm run dev        # site + panneau sur http://localhost:5173
npm run cms        # serveur local Decap sur le port 8081
```

Ouvrez ensuite `http://localhost:5173/admin/`. Le mode local ne demande pas GitHub.

## Fonctionnement des brouillons

Le panneau utilise le flux éditorial :

1. **Enregistrer un brouillon** crée une pull request sur GitHub.
2. Chaque pull request déclenche un déploiement Vercel de prévisualisation. Vous pouvez y vérifier vos modifications avant publication.
3. **Publier** fusionne la pull request dans `main` et met à jour le site public.

Un projet marqué **Brouillon** est visible en prévisualisation et en local, mais pas sur le site public. C’est pratique pour préparer une fiche sans la rendre visible tout de suite.

## Les sections du panneau

| Section | Ce que vous pouvez modifier |
|---|---|
| **Réglages du site → Page d’accueil** | Langue par défaut, textes du hero, bandeau du haut, titres des sections, badge de disponibilité. |
| **Réglages du site → Coordonnées** | Email public, téléphone affiché, localisation, CV, liens sociaux. Le lien `tel:` est généré automatiquement à partir du numéro. |
| **Réglages du site → SEO et partage** | Titre, description et image affichés dans les moteurs de recherche et les partages. |
| **Citation** | La citation affichée entre la méthode et le contact. |
| **Projets** | Toutes les fiches projet, avec filtres, galerie, vidéo et ordre d’affichage. |
| **Compétences / Formation / Expériences / Langues / Chiffres clés / Méthode** | Les listes et les textes des sections correspondantes. |

Chaque texte bilingual possède un champ **Français** et un champ **English**. Renseignez toujours les deux : l’anglais est traduit et le site bascule complètement d’une langue à l’autre. Le champ arabe est prévu dans le modèle mais l’interface publique n’est pas encore finalisée en arabe.

## Projets à la une

Trois projets maximum doivent être marqués **À la une**. Utilisez **Ordre à la une** avec `1`, `2`, `3` pour choisir leur ordre sur la page d’accueil. Les autres projets doivent avoir `0`. Un avertissement s’affiche pendant la compilation si vous en marquez plus de trois.

**Ordre dans l’archive** contrôle la position dans la page « Tous les projets » : plus le nombre est petit, plus le projet apparaît tôt.

Les champs **Numéro d’affichage**, **Année**, **Catégorie** et **Outils utilisés** alimentent les filtres et les cartes. N’inventez pas d’outil ou de client : ne mentionnez que ce qui a réellement été fait.

## Fichiers et médias

- Formats recommandés : **WebP**, 2400 px maximum sur le grand côté.
- N’uploadez pas de grosses vidéos dans Git. Utilisez le champ **Lien vidéo YouTube ou Vimeo**, ou un petit MP4/WebM de moins de **10 Mo**.
- Les fichiers **GLB** doivent rester sous **15 Mo**.
- Les fichiers uploadés sont enregistrés dans `public/assets/uploads/`.
- Le champ **Fichier CV** doit toujours rester le PDF **sans date de naissance**. Ne remplacez jamais le CV public par l’original non anonymisé.

## Contact

Le formulaire envoie le message **par email** ; rien n’est stocké dans le site ni dans une base de données. Si le service d’envoi n’est pas configuré, le formulaire ouvre automatiquement l’application email avec le message prérempli.

N’ajoutez un lien social que s’il a été vérifié. Laissez la liste vide tant que les profils ne sont pas confirmés.

## Bonnes pratiques

- Rédigez des titres courts et des descriptions factuelles.
- Vérifiez le rendu dans les deux langues avant de publier.
- Testez toujours la prévisualisation d’un brouillon avant de cliquer sur **Publier**.
- Si un changement pose problème, reverted la commit de contenu sur `main` ou restaurez un déploiement Vercel précédent.
- Si la connexion GitHub échoue, vérifiez que l’URL de callback de l’OAuth App est bien `https://portfolio-yassine.vercel.app/api/callback` et que les variables `OAUTH_GITHUB_CLIENT_ID` / `OAUTH_GITHUB_CLIENT_SECRET` sont définies sur Vercel.
