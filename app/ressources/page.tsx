"use client";
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const categories = ["Tout", "YouTube", "Montage", "IA", "Business", "Inspiration"];

const ressources = [
  {
    categorie: "YouTube",
    titre: "Faire exploser sa chaine YouTube en 2024",
    description: "Les strategies exactes pour passer de 0 a 10k abonnes rapidement.",
    lien: "https://www.youtube.com/results?search_query=faire+exploser+chaine+youtube+2024",
    emoji: "🚀",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "YouTube",
    titre: "Maitriser le SEO YouTube",
    description: "Optimise tes titres, descriptions et tags pour apparaitre en premier.",
    lien: "https://www.youtube.com/results?search_query=seo+youtube+tutorial+francais",
    emoji: "🔍",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "YouTube",
    titre: "Creer des thumbnails qui cliquent",
    description: "Design de miniatures accrocheuses avec Canva.",
    lien: "https://www.canva.com/fr_fr/creer/miniatures-youtube/",
    emoji: "🎨",
    tag: "Outil",
    tagColor: "bg-blue-500/20 text-blue-400",
  },
  {
    categorie: "Montage",
    titre: "CapCut - Montage video gratuit",
    description: "L outil de montage le plus utilise par les createurs. Effets, transitions, sous-titres auto.",
    lien: "https://www.capcut.com/fr-fr/",
    emoji: "✂️",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Montage",
    titre: "DaVinci Resolve - Montage Pro",
    description: "Le logiciel de montage professionnel 100% gratuit. Utilise par les pros.",
    lien: "https://www.blackmagicdesign.com/fr/products/davinciresolve",
    emoji: "🎬",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Montage",
    titre: "Epidemic Sound - Musique libre de droits",
    description: "Des milliers de sons et musiques sans risque de copyright strike.",
    lien: "https://www.epidemicsound.com/",
    emoji: "🎵",
    tag: "Payant",
    tagColor: "bg-orange-500/20 text-orange-400",
  },
  {
    categorie: "IA",
    titre: "ChatGPT - Idees de videos et scripts",
    description: "Genere des idees de contenu, scripts et titres accrocheurs en secondes.",
    lien: "https://chatgpt.com",
    emoji: "🤖",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "IA",
    titre: "ElevenLabs - Voix IA realistes",
    description: "Genere des voix off ultra-realistes pour tes videos avec l IA.",
    lien: "https://elevenlabs.io/",
    emoji: "🎙️",
    tag: "Freemium",
    tagColor: "bg-purple-500/20 text-purple-400",
  },
  {
    categorie: "IA",
    titre: "Runway ML - Videos generees par IA",
    description: "Cree et edite des videos avec l intelligence artificielle.",
    lien: "https://runwayml.com/",
    emoji: "✨",
    tag: "Freemium",
    tagColor: "bg-purple-500/20 text-purple-400",
  },
  {
    categorie: "Business",
    titre: "Monetiser sa chaine YouTube",
    description: "Toutes les facons de gagner de l argent : AdSense, sponsors, produits.",
    lien: "https://www.youtube.com/results?search_query=monetiser+chaine+youtube+francais",
    emoji: "💰",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Business",
    titre: "Gumroad - Vendre ses produits digitaux",
    description: "Cree et vends des formations, ebooks, presets en quelques clics.",
    lien: "https://gumroad.com/",
    emoji: "🛒",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Inspiration",
    titre: "MrBeast - Decryptage de sa strategie",
    description: "Analyse des videos les plus vues pour comprendre ce qui marche.",
    lien: "https://www.youtube.com/results?search_query=mreast+strategy+analyse",
    emoji: "👑",
    tag: "Gratuit",
    tagColor: "bg-green-500/20 text-green-400",
  },
  {
    categorie: "Inspiration",
    titre: "Top createurs YouTube France 2024",
    description: "Les createurs FR qui cartonnent et les techniques qu ils utilisent.",
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

        <input
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
          placeholder="🔍 Rechercher une ressource..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 mb-6"
        />

        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(c => (
            <button key={c} onClick={() => setCatActive(c)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${catActive === c ? "bg-blue-600 text-white" : "bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"}`}>
              {c}
            </button>
          ))}
        </div>

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
              <p className="text-xs text-blue-400 font-semibold">Acceder a la ressource</p>
            </a>
          ))}
        </div>

        {filtrees.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">🔍</p>
            <p>Aucune ressource trouvee</p>
          </div>
        )}
      </main>
    </div>
  );
}
