"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";

const categories = ["Tout", "YouTube", "Montage", "IA", "Business", "Inspiration"];

const ressources = [
  {
    categorie: "YouTube",
    titre: "Comment faire exploser sa chaîne YouTube en 2024",
    description: "Les stratégies exactes pour passer de 0 à 10k abonnés rapidement.",
    lien: "https://www.youtube.com/results?search_query=faire+exploser+chaine+youtube+2024",
    emoji: "🚀",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "YouTube",
    titre: "Maîtriser le SEO YouTube",
    description: "Apprends à optimiser tes titres, descriptions et tags pour apparaître en premier.",
    lien: "https://www.youtube.com/results?search_query=seo+youtube+tutorial+francais",
    emoji: "🔍",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "YouTube",
    titre: "Créer des thumbnails qui cliquent",
    description: "Design de miniatures accrocheuses avec Canva — guide complet.",
    lien: "https://www.canva.com/fr_fr/creer/miniatures-youtube/",
    emoji: "🎨",
    tag: "Outil",
    tagColor: "bg-blue-500/20 text-blue-400",
  },
  {
    categorie: "Montage",
    titre: "CapCut — Montage vidéo gratuit",
    description: "L'outil de montage le plus utilisé par les créateurs. Effets, transitions, sous-titres auto.",
    lien: "https://www.capcut.com/fr-fr/",
    emoji: "✂️",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Montage",
    titre: "DaVinci Resolve — Montage Pro",
    description: "Le logiciel de montage professionnel 100% gratuit. Utilisé par les pros d'Hollywood.",
    lien: "https://www.blackmagicdesign.com/fr/products/davinciresolve",
    emoji: "🎬",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Montage",
    titre: "Epidemic Sound — Musique libre de droits",
    description: "Des milliers de sons et musiques pour tes vidéos sans risque de copyright strike.",
    lien: "https://www.epidemicsound.com/",
    emoji: "🎵",
    tag: "Payant",
    tagColor: "bg-orange-500/20 text-orange-400",
  },
  {
    categorie: "IA",
    titre: "ChatGPT — Idées de vidéos & scripts",
    description: "Génère des idées de contenu, scripts et titres accrocheurs en quelques secondes.",
    lien: "https://chatgpt.com",
    emoji: "🤖",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "IA",
    titre: "ElevenLabs — Voix IA réalistes",
    description: "Génère des voix off ultra-réalistes pour tes vidéos avec l'IA.",
    lien: "https://elevenlabs.io/",
    emoji: "🎙️",
    tag: "Freemium",
    tagColor: "bg-purple-500/20 text-purple-400",
  },
  {
    categorie: "IA",
    titre: "Runway ML — Vidéos générées par IA",
    description: "Crée et édite des vidéos avec l'intelligence artificielle. Le futur du montage.",
    lien: "https://runwayml.com/",
    emoji: "✨",
    tag: "Freemium",
    tagColor: "bg-purple-500/20 text-purple-400",
  },
  {
    categorie: "Business",
    titre: "Comment monétiser sa chaîne YouTube",
    description: "Toutes les façons de gagner de l'argent sur YouTube : AdSense, sponsors, produits.",
    lien: "https://www.youtube.com/results?search_query=monetiser+chaine+youtube+francais",
    emoji: "💰",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Business",
    titre: "Gumroad — Vendre ses produits
mkdir -p app/ressources && cat > app/ressources/page.tsx << 'MYEOF'
"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";

const categories = ["Tout", "YouTube", "Montage", "IA", "Business", "Inspiration"];

const ressources = [
  {
    categorie: "YouTube",
    titre: "Comment faire exploser sa chaîne YouTube en 2024",
    description: "Les stratégies exactes pour passer de 0 à 10k abonnés rapidement.",
    lien: "https://www.youtube.com/results?search_query=faire+exploser+chaine+youtube+2024",
    emoji: "🚀",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "YouTube",
    titre: "Maîtriser le SEO YouTube",
    description: "Apprends à optimiser tes titres, descriptions et tags pour apparaître en premier.",
    lien: "https://www.youtube.com/results?search_query=seo+youtube+tutorial+francais",
    emoji: "🔍",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "YouTube",
    titre: "Créer des thumbnails qui cliquent",
    description: "Design de miniatures accrocheuses avec Canva — guide complet.",
    lien: "https://www.canva.com/fr_fr/creer/miniatures-youtube/",
    emoji: "🎨",
    tag: "Outil",
    tagColor: "bg-blue-500/20 text-blue-400",
  },
  {
    categorie: "Montage",
    titre: "CapCut — Montage vidéo gratuit",
    description: "L'outil de montage le plus utilisé par les créateurs. Effets, transitions, sous-titres auto.",
    lien: "https://www.capcut.com/fr-fr/",
    emoji: "✂️",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Montage",
    titre: "DaVinci Resolve — Montage Pro",
    description: "Le logiciel de montage professionnel 100% gratuit. Utilisé par les pros d'Hollywood.",
    lien: "https://www.blackmagicdesign.com/fr/products/davinciresolve",
    emoji: "🎬",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Montage",
    titre: "Epidemic Sound — Musique libre de droits",
    description: "Des milliers de sons et musiques pour tes vidéos sans risque de copyright strike.",
    lien: "https://www.epidemicsound.com/",
    emoji: "🎵",
    tag: "Payant",
    tagColor: "bg-orange-500/20 text-orange-400",
  },
  {
    categorie: "IA",
    titre: "ChatGPT — Idées de vidéos & scripts",
    description: "Génère des idées de contenu, scripts et titres accrocheurs en quelques secondes.",
    lien: "https://chatgpt.com",
    emoji: "🤖",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "IA",
    titre: "ElevenLabs — Voix IA réalistes",
    description: "Génère des voix off ultra-réalistes pour tes vidéos avec l'IA.",
    lien: "https://elevenlabs.io/",
    emoji: "🎙️",
    tag: "Freemium",
    tagColor: "bg-purple-500/20 text-purple-400",
  },
  {
    categorie: "IA",
    titre: "Runway ML — Vidéos générées par IA",
    description: "Crée et édite des vidéos avec l'intelligence artificielle. Le futur du montage.",
    lien: "https://runwayml.com/",
    emoji: "✨",
    tag: "Freemium",
    tagColor: "bg-purple-500/20 text-purple-400",
  },
  {
    categorie: "Business",
    titre: "Comment monétiser sa chaîne YouTube",
    description: "Toutes les façons de gagner de l'argent sur YouTube : AdSense, sponsors, produits.",
    lien: "https://www.youtube.com/results?search_query=monetiser+chaine+youtube+francais",
    emoji: "💰",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Business",
    titre: "Gumroad — Vendre ses produits digitaux",
    description: "Crée et vends des formations, ebooks, presets en quelques clics.",
    lien: "https://gumroad.com/",
    emoji: "🛒",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Inspiration",
    titre: "Mr Beast — Décryptage de sa stratégie",
    description: "Analyse des vidéos les plus vues de MrBeast pour comprendre ce qui marche.",
    lien: "https://www.youtube.com/results?search_query=mrbeat+strategy+analyse",
    emoji: "👑",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Inspiration",
    titre: "Top créateurs YouTube France 2024",
    description: "Les créateurs FR qui cartonnent et les techniques qu'ils utilisent.",
    lien: "https://www.youtube.com/results?search_query=top+youtubeur+france+2024",
    emoji: "🇫🇷",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
];

export default function Ressources() {
  const [catActive, setCatActive] = useState("Tout");
  const [recherche, setRecherche] = useState("");

  const filtrees = ressources.filter(r => {
    const matchCat = catActive === "Tout" || r.categorie === catActive;
    const matchSearch = r.titre.toLowerCase().includes(recherche.toLowerCase()) || r.description.toLowerCase().includes(recherche.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/ressources" />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">🛠️ Ressources</h1>
        <p className="text-gray-400 mb-8">Tous les outils et liens pour exploser sur YouTube</p>

        {/* Recherche */}
        <input
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="🔍 Rechercher une ressource..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 mb-6"
        />

        {/* Catégories */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setCatActive(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${catActive === c ? "bg-blue-600 text-white" : "bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Grille ressources */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtrees.map((r, i) => (
            <a key={i} href={r.lien} target="_blank" rel="noopener noreferrer"
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-blue-500/50 hover:bg-gray-800/50 transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{r.emoji}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.tagColor}`}>{r.tag}</span>
              </div>
              <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{r.titre}</h3>
              <p className="text-sm text-gray-400 mb-3 leading-relaxed">{r.description}</p>
              <p className="text-xs text-blue-400 font-semibold">→ Accéder à la ressource</p>
            </a>
          ))}
        </div>

        {filtrees.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">🔍</p>
            <p>Aucune ressource trouvée pour "{recherche}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
