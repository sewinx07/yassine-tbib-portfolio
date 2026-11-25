/**
 * SINGLE SOURCE OF TRUTH FOR ALL COPY.
 * French is the default. English is complete. Arabic (RTL) is type-ready.
 * TODO markers are surfaced in development and listed in README / final report.
 *
 * NEVER add a date of birth here. The public CV is a redacted copy.
 */

export type Locale = 'fr' | 'en' | 'ar'
export type Category = 'graphic' | 'motion' | '3d' | 'xr' | 'web'

export interface Localized {
  fr: string
  en: string
  /** Reserved for the future RTL locale. Falls back to English until translated. */
  ar?: string
}

export interface Project {
  slug: string
  number: string
  category: Category
  year: string
  tools: string[]
  role: Localized
  title: Localized
  excerpt: Localized
  description: Localized
  thumbnail: string
  gallery: string[]
  video?: { webm: string; mp4: string; poster: string }
  featured: boolean
  /** Copy inferred from source files; confirm with Yassine. */
  todo?: boolean
  liveUrl?: string
}

export interface TimelineItem {
  period: string
  title: Localized
  place: string
  detail: Localized
}

export interface SkillGroup {
  label: Localized
  items: string[]
}

export interface ProcessStep {
  number: string
  icon: 'briefcase' | 'sparkles' | 'pen' | 'code' | 'send'
  title: Localized
  detail: Localized
}

export interface LocaleContent {
  meta: { description: string; ogTitle: string; ogDescription: string }
  nav: { home: string; projects: string; lab: string; about: string; contact: string }
  topbar: { role: string; availability: string; menu: string; close: string }
  hero: {
    greeting: string
    firstName: string
    lastName: string
    title: string
    bio: string
    word: string
    tagline: string
    scroll: string
    location: string
    statsLabel: [string, string, string]
  }
  sections: {
    selected: { eyebrow: string; title: string; viewAll: string; note: string }
    lab: { eyebrow: string; title: string; description: string; drag: string; frames: string }
    education: { eyebrow: string; title: string; timeline: string; training: string }
    experience: { eyebrow: string; title: string; note: string }
    process: { eyebrow: string; title: string }
    quote: { eyebrow: string; text: string; signature: string }
    contact: {
      eyebrow: string
      title: string
      intro: string
      email: string
      phone: string
      location: string
      formName: string
      formEmail: string
      formMessage: string
      formSend: string
      formNote: string
      download: string
      socialTitle: string
      socialNote: string
      beyond: string
      beyondDetail: string
    }
  }
  projectsPage: {
    eyebrow: string
    title: string
    intro: string
    filters: Record<Category | 'all', string>
    count: string
    empty: string
    back: string
    tools: string
    year: string
    role: string
    next: string
  }
  footer: { made: string; rights: string; top: string }
  notFound: { title: string; text: string; back: string }
  todoBadge: string
}

/* ------------------------------------------------------------------ */
/* FRENCH — default                                                    */
/* ------------------------------------------------------------------ */

const fr: LocaleContent = {
  meta: {
    description:
      'Portfolio de Yassine Tbib, étudiant en multimédia à Gabès. Design graphique, motion, 3D, jeux et développement web.',
    ogTitle: 'Yassine Tbib — Multimedia Designer & Web Creator',
    ogDescription: 'Étudiant multimédia, créateur web et designer graphique. Gabès, Tunisie.',
  },
  nav: {
    home: 'Accueil',
    projects: 'Projets',
    lab: 'Lab 3D',
    about: 'Parcours',
    contact: 'Contact',
  },
  topbar: {
    role: 'Multimedia Designer',
    availability: 'Ouvert aux stages et opportunités',
    menu: 'Ouvrir le menu',
    close: 'Fermer le menu',
  },
  hero: {
    greeting: 'Bonjour, je suis',
    firstName: 'YASSINE',
    lastName: 'TBIB',
    title: 'Multimedia Designer & Web Creator',
    bio: "Étudiant en multimédia à Gabès, passionné par l'informatique, le développement web et le design graphique. Sérieux, autonome et curieux, je transforme les idées en expériences numériques qui ont du caractère.",
    word: 'PORTFOLIO',
    tagline: 'Transformer les idées en expériences numériques immersives.',
    scroll: 'Défiler pour explorer',
    location: 'Gabès, Tunisie',
    statsLabel: ["Années d'études", 'Outils maîtrisés', 'Langues parlées'],
  },
  sections: {
    selected: {
      eyebrow: '01 / Sélection',
      title: 'Projets choisis',
      viewAll: 'Voir tous les projets',
      note: 'Trois univers, une même exigence : du jeu au graphisme, jusqu’à la 3D.',
    },
    lab: {
      eyebrow: '02 / Laboratoire',
      title: 'Lab 3D',
      description:
        'Des scènes construites sous Blender et SketchUp. Une fenêtre sur des mondes encore en mouvement.',
      drag: 'Faites glisser pour explorer',
      frames: 'Images réelles extraites du rendu',
    },
    education: {
      eyebrow: '03 / Parcours',
      title: 'Formation & compétences',
      timeline: 'Formation',
      training: 'Formations complémentaires',
    },
    experience: {
      eyebrow: '04 / Terrain',
      title: 'Expériences',
      note: "Du graphisme en imprimerie au diagnostic automobile : la même attention aux détails.",
    },
    process: {
      eyebrow: '05 / Méthode',
      title: 'Comment je travaille',
    },
    quote: {
      eyebrow: '06 / Pensée',
      text: 'Le design est une discipline silencieuse : transformer une demande en quelque chose que l’on ressent avant même de le comprendre.',
      signature: 'Yassine',
    },
    contact: {
      eyebrow: '07 / Contact',
      title: 'Travaillons ensemble',
      intro:
        "Une idée, un stage, un projet à construire ? Écrivez-moi, je serai heureux d'en discuter.",
      email: 'Email',
      phone: 'Téléphone',
      location: 'Localisation',
      formName: 'Votre nom',
      formEmail: 'Votre email',
      formMessage: 'Votre message',
      formSend: 'Envoyer le message',
      formNote: 'Le formulaire ouvre votre application email.',
      download: 'Télécharger le CV',
      socialTitle: 'Réseaux',
      socialNote: 'TODO: confirm — aucun lien social vérifié trouvé dans les dossiers.',
      beyond: 'Au-delà de l’écran',
      beyondDetail: 'Musique, camping et électricité du bâtiment.',
    },
  },
  projectsPage: {
    eyebrow: 'Archive / 2025 — 2026',
    title: 'Tous les projets',
    intro:
      'Projets d’études, travaux de stage et explorations personnelles. Chaque fiche indique les outils réellement utilisés.',
    filters: {
      all: 'Tout',
      graphic: 'Graphisme',
      motion: 'Motion',
      '3d': '3D',
      xr: 'XR & Jeux',
      web: 'Web',
    },
    count: 'projets',
    empty: 'Aucun projet dans cette catégorie pour le moment.',
    back: 'Retour aux projets',
    tools: 'Outils',
    year: 'Année',
    role: 'Rôle',
    next: 'Projet suivant',
  },
  footer: {
    made: 'Conçu et développé par Yassine Tbib',
    rights: 'Tous droits réservés.',
    top: 'Retour en haut',
  },
  notFound: {
    title: 'Page introuvable',
    text: 'Cette page n’existe pas ou a été déplacée.',
    back: 'Retour à l’accueil',
  },
  todoBadge: 'TODO: confirm',
}

/* ------------------------------------------------------------------ */
/* ENGLISH                                                             */
/* ------------------------------------------------------------------ */

const en: LocaleContent = {
  meta: {
    description:
      'Portfolio of Yassine Tbib, multimedia student in Gabès. Graphic design, motion, 3D, games and web development.',
    ogTitle: 'Yassine Tbib — Multimedia Designer & Web Creator',
    ogDescription: 'Multimedia student, web creator and graphic designer. Gabès, Tunisia.',
  },
  nav: {
    home: 'Home',
    projects: 'Projects',
    lab: '3D Lab',
    about: 'Background',
    contact: 'Contact',
  },
  topbar: {
    role: 'Multimedia Designer',
    availability: 'Open to internships & opportunities',
    menu: 'Open menu',
    close: 'Close menu',
  },
  hero: {
    greeting: "Hello, I'm",
    firstName: 'YASSINE',
    lastName: 'TBIB',
    title: 'Multimedia Designer & Web Creator',
    bio: "A multimedia student based in Gabès, passionate about computer science, web development and graphic design. Serious, self-reliant and curious — I turn ideas into digital experiences with character.",
    word: 'PORTFOLIO',
    tagline: 'Turning ideas into immersive digital experiences.',
    scroll: 'Scroll to explore',
    location: 'Gabès, Tunisia',
    statsLabel: ['Years of study', 'Tools mastered', 'Languages spoken'],
  },
  sections: {
    selected: {
      eyebrow: '01 / Selected',
      title: 'Selected projects',
      viewAll: 'View all projects',
      note: 'Three worlds, one standard of care: from games to graphics to 3D.',
    },
    lab: {
      eyebrow: '02 / Laboratory',
      title: '3D Lab',
      description:
        'Scenes built in Blender and SketchUp. A window into worlds that are still in motion.',
      drag: 'Drag to explore',
      frames: 'Real frames extracted from the render',
    },
    education: {
      eyebrow: '03 / Background',
      title: 'Education & skills',
      timeline: 'Education',
      training: 'Complementary training',
    },
    experience: {
      eyebrow: '04 / Field',
      title: 'Experience',
      note: 'From print-shop graphics to automotive diagnostics: the same eye for detail.',
    },
    process: {
      eyebrow: '05 / Method',
      title: 'How I work',
    },
    quote: {
      eyebrow: '06 / Thought',
      text: 'Design is a quiet discipline: turning a brief into something people feel before they understand it.',
      signature: 'Yassine',
    },
    contact: {
      eyebrow: '07 / Contact',
      title: "Let's work together",
      intro: 'An idea, an internship, a project to build? Write to me — I would love to talk.',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      formName: 'Your name',
      formEmail: 'Your email',
      formMessage: 'Your message',
      formSend: 'Send message',
      formNote: 'The form opens your email app.',
      download: 'Download CV',
      socialTitle: 'Social',
      socialNote: 'TODO: confirm — no verified social links found in the folders.',
      beyond: 'Beyond the screen',
      beyondDetail: 'Music, camping and building electricity.',
    },
  },
  projectsPage: {
    eyebrow: 'Archive / 2025 — 2026',
    title: 'All projects',
    intro:
      'Coursework, internship work and personal explorations. Every card lists the tools actually used.',
    filters: {
      all: 'All',
      graphic: 'Graphic',
      motion: 'Motion',
      '3d': '3D',
      xr: 'XR & Games',
      web: 'Web',
    },
    count: 'projects',
    empty: 'No projects in this category yet.',
    back: 'Back to projects',
    tools: 'Tools',
    year: 'Year',
    role: 'Role',
    next: 'Next project',
  },
  footer: {
    made: 'Designed and built by Yassine Tbib',
    rights: 'All rights reserved.',
    top: 'Back to top',
  },
  notFound: {
    title: 'Page not found',
    text: 'This page does not exist or has moved.',
    back: 'Back home',
  },
  todoBadge: 'TODO: confirm',
}

export const i18n: Record<'fr' | 'en', LocaleContent> = { fr, en }

/** Resolve localized copy with an English fallback until Arabic is authored. */
export function t(value: Localized, locale: Locale): string {
  if (locale === 'fr') return value.fr
  return value.ar ?? value.en
}

export function localeContent(locale: Locale): LocaleContent {
  return locale === 'fr' ? fr : en
}

/* ------------------------------------------------------------------ */
/* PROJECTS — only facts visible in the source folder / CV             */
/* ------------------------------------------------------------------ */

export const projects: Project[] = [
  {
    slug: 'kelma-216',
    number: '01',
    category: 'xr',
    year: '2026',
    tools: ['Kotlin', 'Jetpack Compose', 'Android Studio', 'Material 3'],
    role: { fr: 'Concepteur et développeur', en: 'Designer & developer' },
    title: { fr: 'KELMA 216 — Le jeu des mots tunisiens', en: 'KELMA 216 — The Tunisian word game' },
    excerpt: {
      fr: 'Un jeu de mots android : 24 gouvernorats, 216 mots à découvrir à partir de photos.',
      en: 'An Android word game: 24 governorates, 216 words to uncover from photographs.',
    },
    description: {
      fr: "Le jouer compose chaque réponse avec des tuiles de lettres, gagne des pièces, achète des indices et débloque progressivement la carte de la Tunisie. La progression est sauvegardée localement. 216 énigmes sont intégrées ; 134 photos d'indice sont présentes, les autres proposent une devinette texte.",
      en: 'Players build each answer from letter tiles, earn coins, buy hints and progressively unlock the map of Tunisia. Progress is saved locally. All 216 puzzles are integrated; 134 photo hints are included and the rest use a text riddle.',
    },
    thumbnail: '/assets/projects/kelma-home.webp',
    gallery: [
      '/assets/projects/kelma-home.webp',
      '/assets/projects/kelma-map.webp',
      '/assets/projects/kelma-puzzle.webp',
      '/assets/projects/kelma-profile.webp',
    ],
    featured: true,
    todo: true,
  },
  {
    slug: 'aljazira-brand',
    number: '02',
    category: 'graphic',
    year: '2025',
    tools: ['Adobe Illustrator'],
    role: { fr: 'Designer graphique', en: 'Graphic designer' },
    title: { fr: 'AL Jazira — Charte graphique', en: 'AL Jazira — Brand guidelines' },
    excerpt: {
      fr: 'Refonte d’identité visuelle : logo, construction, couleurs, typographie et applications.',
      en: 'Visual identity redesign: logo, construction, colours, typography and applications.',
    },
    description: {
      fr: 'Une charte de 16 pages qui documente l’ancien logo, la refonte, la zone de protection, les tailles, les déclinaisons, la colorimétrie, la typographie, les interdits et la papeterie administrative.',
      en: 'A 16-page guideline documenting the former logo, the redesign, clear space, sizing, variants, colour palette, typography, misuse examples and stationery.',
    },
    thumbnail: '/assets/projects/aljazira-charter.webp',
    gallery: [
      '/assets/projects/aljazira-charter.webp',
      '/assets/projects/aljazira-logo.webp',
      '/assets/projects/aljazira-palette.webp',
    ],
    featured: true,
    todo: true,
  },
  {
    slug: 'jazira-3d',
    number: '03',
    category: '3d',
    year: '2026',
    tools: ['Blender', 'SketchUp'],
    role: { fr: 'Artiste 3D', en: '3D artist' },
    title: { fr: 'Jazira — Monde 3D', en: 'Jazira — 3D world' },
    excerpt: {
      fr: 'Scènes et modèles 3D explorés sous Blender et SketchUp, puis rendus en animation.',
      en: '3D scenes and models explored in Blender and SketchUp, then rendered as an animation.',
    },
    description: {
      fr: 'Deux scènes Blender et un modèle SketchUp, accompagnés d’un rendu de 60 secondes en 1920 × 1080 à 60 images par seconde.',
      en: 'Two Blender scenes and a SketchUp model, accompanied by a 60-second 1920 × 1080 render at 60 frames per second.',
    },
    thumbnail: '/assets/projects/jazira-3d-01.webp',
    gallery: [
      '/assets/projects/jazira-3d-01.webp',
      '/assets/projects/jazira-3d-02.webp',
      '/assets/projects/jazira-3d-03.webp',
      '/assets/projects/jazira-3d-04.webp',
    ],
    video: {
      webm: '/assets/video/jazira-preview.webm',
      mp4: '/assets/video/jazira-preview.mp4',
      poster: '/assets/projects/jazira-3d-01.webp',
    },
    featured: true,
    todo: true,
  },
  {
    slug: 'rajah-print',
    number: '04',
    category: 'graphic',
    year: '2026',
    tools: ['Adobe Photoshop', 'Adobe Illustrator'],
    role: { fr: 'Stagiaire en design graphique', en: 'Graphic design intern' },
    title: {
      fr: 'Rajah d’Impression — Supports imprimés',
      en: 'Rajah Printing — Print collateral',
    },
    excerpt: {
      fr: 'Affiches, badges, cartes de visite et flyers préparés pendant le stage à Gabès.',
      en: 'Posters, badges, business cards and flyers produced during the internship in Gabès.',
    },
    description: {
      fr: 'Travaux réalisés au sein de Société Rajah d’Impression : affiches de la Foire internationale de Gabès, badges, billets, cartes de visite et flyers. Chaque support a demandé une attention particulière aux marges, au contraste et aux fichiers prêts pour l’impression.',
      en: 'Work produced at Société Rajah d’Impression: posters for the Gabès International Fair, badges, tickets, business cards and flyers. Each format required care with margins, contrast and print-ready files.',
    },
    thumbnail: '/assets/projects/rajah-poster.webp',
    gallery: [
      '/assets/projects/rajah-poster.webp',
      '/assets/projects/rajah-badges.webp',
      '/assets/projects/rajah-cards.webp',
      '/assets/projects/rajah-flyer.webp',
    ],
    featured: false,
    todo: true,
  },
  {
    slug: 'aljazira-web',
    number: '05',
    category: 'web',
    year: '2026',
    tools: ['Angular', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
    role: { fr: 'Développeur', en: 'Developer' },
    title: { fr: 'AL Jazira — Boutique en ligne', en: 'AL Jazira — Online store' },
    excerpt: {
      fr: 'Une boutique d’huile d’olive avec catalogue, panier, commandes et espace administrateur.',
      en: 'An olive-oil store with catalogue, cart, orders and an admin area.',
    },
    description: {
      fr: 'Application Angular côté client et API Node/Express côté serveur : catalogue produits, panier, commandes, contact et tableau de bord administrateur.',
      en: 'Angular front end with a Node/Express API: product catalogue, cart, orders, contact and an admin dashboard.',
    },
    thumbnail: '/assets/projects/aljazira-web.webp',
    gallery: ['/assets/projects/aljazira-web.webp'],
    featured: false,
    todo: true,
  },
  {
    slug: 'symfony-shop',
    number: '06',
    category: 'web',
    year: '2026',
    tools: ['PHP', 'Symfony', 'Doctrine', 'Twig'],
    role: { fr: 'Développeur', en: 'Developer' },
    title: {
      fr: 'Boutique de matériel de camping',
      en: 'Camping equipment store',
    },
    excerpt: {
      fr: 'Catalogue, panier, commandes et administration d’une boutique PHP/Symfony.',
      en: 'Catalogue, cart, orders and admin for a PHP/Symfony store.',
    },
    description: {
      fr: 'Projet Symfony complet avec entités Doctrine, formulaires, gestion des commandes et interface d’administration.',
      en: 'A complete Symfony project with Doctrine entities, forms, order management and an administration interface.',
    },
    thumbnail: '/assets/projects/symfony-shop.webp',
    gallery: ['/assets/projects/symfony-shop.webp'],
    featured: false,
    todo: true,
  },
  {
    slug: 'illustrator-identities',
    number: '07',
    category: 'graphic',
    year: '2025',
    tools: ['Adobe Illustrator'],
    role: { fr: 'Designer graphique', en: 'Graphic designer' },
    title: { fr: 'Logos & affiches', en: 'Logos & posters' },
    excerpt: {
      fr: 'Identités et affiches vectorielles : Le Fondant Ba7cha, Kross et une affiche finale.',
      en: 'Vector identities and posters: Le Fondant Ba7cha, Kross and a final poster.',
    },
    description: {
      fr: 'Plusieurs fichiers Illustrator vectoriels, dont deux versions du logo Le Fondant Ba7cha, deux versions du logo Kross et une affiche finale.',
      en: 'Several vector Illustrator files, including two versions of the Le Fondant Ba7cha logo, two Kross logo versions and a final poster.',
    },
    thumbnail: '/assets/projects/logo-kross.webp',
    gallery: [
      '/assets/projects/logo-kross.webp',
      '/assets/projects/logo-fondant.webp',
      '/assets/projects/affiche.webp',
    ],
    featured: false,
    todo: true,
  },
  {
    slug: 'motion-studies',
    number: '08',
    category: 'motion',
    year: '2025 — 2026',
    tools: ['Adobe After Effects'],
    role: { fr: 'Motion designer', en: 'Motion designer' },
    title: { fr: 'Études motion', en: 'Motion studies' },
    excerpt: {
      fr: 'Dix projets After Effects explorant le rythme, le texte et les effets.',
      en: 'Ten After Effects projects exploring rhythm, typography and effects.',
    },
    description: {
      fr: 'Dix fichiers projet After Effects (dont motion.aep, flache.aep et Sur ma route 1 ily a eu.aep). Les rendus vidéo ne sont pas encore disponibles.',
      en: 'Ten After Effects project files (including motion.aep, flache.aep and Sur ma route 1 ily a eu.aep). Video exports are not available yet.',
    },
    thumbnail: '/assets/projects/motion-placeholder.webp',
    gallery: [],
    featured: false,
    todo: true,
  },
  {
    slug: 'photo-retouch',
    number: '09',
    category: 'graphic',
    year: '2025',
    tools: ['Adobe Photoshop', 'Canon EOS 4000D'],
    role: {
      fr: 'Membre d’une équipe de quatre étudiants',
      en: 'Member of a four-student team',
    },
    title: { fr: 'Prise de vue & retouche', en: 'Photography & retouching' },
    excerpt: {
      fr: 'Séance photo au reflex, retouche sous Photoshop et présentation du sud tunisien.',
      en: 'DSLR photo shoot, Photoshop retouching and a presentation of southern Tunisia.',
    },
    description: {
      fr: 'Travail d’équipe en cours de prise de vue : réglages Canon EOS 4000D, retouche Photoshop / Camera Raw et une présentation sur Gabès et le sud tunisien.',
      en: 'Teamwork for a photography class: Canon EOS 4000D settings, Photoshop / Camera Raw retouching and a presentation about Gabès and southern Tunisia.',
    },
    thumbnail: '/assets/projects/photo-retouch.webp',
    gallery: ['/assets/projects/photo-retouch.webp', '/assets/projects/gabes-city.webp'],
    featured: false,
    todo: true,
  },
  {
    slug: 'lam2-portfolio',
    number: '10',
    category: 'web',
    year: '2025',
    tools: ['HTML', 'CSS', 'JavaScript'],
    role: { fr: 'Développeur', en: 'Developer' },
    title: { fr: 'Site vitrine HTML/CSS', en: 'HTML/CSS portfolio site' },
    excerpt: {
      fr: 'Un site statique en HTML, CSS et JavaScript avec pages accueil, à propos et contact.',
      en: 'A static HTML, CSS and JavaScript site with home, about and contact pages.',
    },
    description: {
      fr: 'Site statique réalisé en HTML, CSS et JavaScript, avec une présentation accompagnante au format PDF.',
      en: 'Static site built with HTML, CSS and JavaScript, with an accompanying PDF presentation.',
    },
    thumbnail: '/assets/projects/lam2-portfolio.webp',
    gallery: ['/assets/projects/lam2-portfolio.webp'],
    featured: false,
    todo: true,
  },
]

/* ------------------------------------------------------------------ */
/* TIMELINES & SKILLS                                                  */
/* ------------------------------------------------------------------ */

export const education: TimelineItem[] = [
  {
    period: '2025 — 2026',
    title: { fr: 'Licence 2 — Art et Médiation', en: 'BA 2nd year — Art & Mediation' },
    place: 'ISIMG — Institut Supérieur d’Informatique et de Multimédia de Gabès',
    detail: { fr: 'Deuxième année de licence.', en: 'Second year of the bachelor degree.' },
  },
  {
    period: '2024 — 2025',
    title: { fr: 'Licence 1 — Art et Médiation', en: 'BA 1st year — Art & Mediation' },
    place: 'ISIMG — Institut Supérieur d’Informatique et de Multimédia de Gabès',
    detail: { fr: 'Première année de licence.', en: 'First year of the bachelor degree.' },
  },
  {
    period: '2023 — 2024',
    title: {
      fr: 'Licence 1 — Ingénierie des Systèmes Informatiques',
      en: 'BA 1st year — Computer Systems Engineering',
    },
    place: 'ISIMG — Institut Supérieur d’Informatique et de Multimédia de Gabès',
    detail: { fr: 'Première année de licence.', en: 'First year of the bachelor degree.' },
  },
  {
    period: '2023',
    title: { fr: 'Baccalauréat Informatique', en: 'Baccalauréat in Computer Science' },
    place: 'Tunisie',
    detail: { fr: 'Baccalauréat informatique.', en: 'Computer science baccalauréat.' },
  },
]

export const trainings: TimelineItem[] = [
  {
    period: '2024',
    title: { fr: 'Techniques de communication', en: 'Communication techniques' },
    place: '',
    detail: { fr: 'Formation complémentaire.', en: 'Complementary training.' },
  },
  {
    period: '2023',
    title: { fr: 'Entrepreneuriat', en: 'Entrepreneurship' },
    place: '',
    detail: { fr: 'Formation complémentaire.', en: 'Complementary training.' },
  },
  {
    period: '2024',
    title: {
      fr: 'Mécanique et diagnostic automobile',
      en: 'Mechanics & automotive diagnostics',
    },
    place: '',
    detail: { fr: 'Formation complémentaire.', en: 'Complementary training.' },
  },
]

export const experience: TimelineItem[] = [
  {
    period: '2026 · 2 mois',
    title: { fr: 'Stagiaire en design graphique', en: 'Graphic design intern' },
    place: 'Société Rajah d’Impression — Gabès',
    detail: {
      fr: 'Supports de communication visuelle, création et retouche sous Photoshop et Illustrator, préparation des fichiers pour l’impression.',
      en: 'Visual communication material, creating and retouching visuals in Photoshop and Illustrator, preparing print-ready files.',
    },
  },
  {
    period: '2024 · 1 mois',
    title: {
      fr: 'Stagiaire en diagnostic et maintenance automobile',
      en: 'Automotive diagnostics & maintenance intern',
    },
    place: 'Gabès Motors — agence Mercedes, Gabès',
    detail: {
      fr: 'Participation aux diagnostics, assistance aux travaux de maintenance et utilisation des outils sous supervision des techniciens.',
      en: 'Vehicle diagnostics, maintenance support and use of diagnostic tools under technician supervision.',
    },
  },
  {
    period: '2024',
    title: { fr: 'Bénévole', en: 'Volunteer' },
    place: '18e Festival du Cinéma Méditerranéen de Chenini',
    detail: {
      fr: 'Accueil et orientation des visiteurs, participation à l’organisation des activités.',
      en: 'Visitor welcome and guidance, help organising festival activities.',
    },
  },
]

export const skillGroups: SkillGroup[] = [
  { label: { fr: 'Web', en: 'Web' }, items: ['HTML', 'CSS', 'JavaScript', 'PHP'] },
  { label: { fr: 'Graphisme', en: 'Graphic' }, items: ['Adobe Photoshop', 'Adobe Illustrator'] },
  {
    label: { fr: 'Motion', en: 'Motion' },
    items: ['Adobe Premiere Pro', 'Adobe After Effects'],
  },
  { label: { fr: '3D', en: '3D' }, items: ['Autodesk 3ds Max', 'SketchUp'] },
  {
    label: { fr: 'XR & Jeux', en: 'XR & Games' },
    items: ['Unity (VR, AR, jeux 2D / 2D games)'],
  },
]

export const languages = [
  { name: { fr: 'Arabe', en: 'Arabic' }, level: { fr: 'Langue maternelle', en: 'Native' }, value: 100 },
  { name: { fr: 'Allemand', en: 'German' }, level: { fr: 'Niveau B1', en: 'B1' }, value: 62 },
  { name: { fr: 'Français', en: 'French' }, level: { fr: 'Intermédiaire', en: 'Intermediate' }, value: 55 },
  { name: { fr: 'Anglais', en: 'English' }, level: { fr: 'Intermédiaire', en: 'Intermediate' }, value: 55 },
]

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    icon: 'briefcase',
    title: { fr: 'Brief', en: 'Brief' },
    detail: { fr: 'Comprendre le besoin et le contexte.', en: 'Understand the need and the context.' },
  },
  {
    number: '02',
    icon: 'sparkles',
    title: { fr: 'Concept', en: 'Concept' },
    detail: { fr: 'Esquisses, moodboard et direction visuelle.', en: 'Sketches, moodboard and visual direction.' },
  },
  {
    number: '03',
    icon: 'pen',
    title: { fr: 'Design', en: 'Design' },
    detail: {
      fr: 'Photoshop, Illustrator et explorations 3D.',
      en: 'Photoshop, Illustrator and 3D explorations.',
    },
  },
  {
    number: '04',
    icon: 'code',
    title: { fr: 'Production', en: 'Produce' },
    detail: {
      fr: 'Code, motion et builds Unity.',
      en: 'Code, motion and Unity builds.',
    },
  },
  {
    number: '05',
    icon: 'send',
    title: { fr: 'Livraison', en: 'Deliver' },
    detail: {
      fr: 'Fichiers prêts pour l’impression et exports optimisés.',
      en: 'Print-ready files and optimized exports.',
    },
  },
]

export const contact = {
  email: 'tbibyassine03@gmail.com',
  phone: '+216 93 178 458',
  phoneHref: 'tel:+21693178458',
  location: 'Gabès, Tunisie',
  cv: '/assets/cv-yassine-tbib.pdf',
}

export const stats = [
  { value: 3, labelIndex: 0 as const },
  { value: 11, labelIndex: 1 as const },
  { value: 4, labelIndex: 2 as const },
]

/** Things Yassine must confirm before publishing. */
export const todos = [
  'A high-resolution portrait is needed — the current image is a 598×798 copy of the low-res CV photo.',
  'Project descriptions and role wording were inferred from filenames, README files and reports.',
  'No rendered MP4s exist for the ten After Effects projects; placeholder cards are used.',
  'No verified social links or live project URLs were found in the folder.',
  'The quote panel text is an original draft and needs his approval.',
  'The downloadable CV is a redacted copy: the date of birth was removed from the public PDF.',
]
