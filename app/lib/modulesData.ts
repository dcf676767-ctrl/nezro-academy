export const MODULES = [
  { id: 10, titre: "Introduction", chapitres: 1 },
  { id: 11, titre: "Mind-set et organisation", chapitres: 2 },
  { id: 12, titre: "Comprendre les réseaux et comment être monétisé", chapitres: 4 },
  { id: 13, titre: "Contenu 100% anonyme", chapitres: 9 },
  { id: 18, titre: "Outils pour faire plus d'argent et être plus productif", chapitres: 1 },
  { id: 14, titre: "Trouver sa niche, être efficace et monétiser", chapitres: 8 },
  { id: 15, titre: "30 exemples de niches à faire", chapitres: 1 },
  { id: 16, titre: "Exemple de montage sur CapCut téléphone", chapitres: 1 },
  { id: 23, titre: "Présentation du montage CapCut sur PC", chapitres: 1 },
  { id: 24, titre: "Bien maîtriser sa chaîne YouTube", chapitres: 3 },
  { id: 17, titre: "Commencer à poster", chapitres: 3 },
  { id: 25, titre: "Analyser pourquoi une vidéo a percé", chapitres: 3 },
  { id: 19, titre: "Problèmes de monétisation", chapitres: 3 },
  { id: 20, titre: "Augmenter son RPM", chapitres: 1 },
  { id: 21, titre: "Astuces", chapitres: 7 },
  { id: 1, titre: "Niche Roblox", chapitres: 7 },
  { id: 22, titre: "Déclaration et compte AdSense", chapitres: 2 },
];

export const TOTAL_CHAPITRES = MODULES.reduce((sum, m) => sum + m.chapitres, 0);
