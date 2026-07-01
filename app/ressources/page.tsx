"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const _sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
function useAuth() {
  const router = useRouter();
  useEffect(() => {
    _sb.auth.getSession().then(({data:{session}}) => {
      if (!session) { router.push("/auth"); return; }
      _sb.from("profiles").select("statut").eq("id", session.user.id).single().then(({data}) => {
        if (!data || data.statut !== "accepte") router.push("/bloque");
      });
    });
  }, []);
}
import { useState } from "react";
import Sidebar from "../components/Sidebar";

const categories = ["Tout", "IA & Outils", "Montage", "Croissance", "Monétisation", "Inspiration", "Design", "Audio", "Analytics", "Formation"];

const ressources = [
  // IA & Outils
  { titre: "ChatGPT", desc: "Génère des scripts, titres, descriptions et idées de vidéos en secondes.", lien: "https://chat.openai.com", emoji: "🤖", cat: "IA & Outils", badge: "Gratuit" },
  { titre: "Claude AI", desc: "IA puissante pour écrire des scripts longs et détaillés.", lien: "https://claude.ai", emoji: "🧠", cat: "IA & Outils", badge: "Gratuit" },
  { titre: "Runway ML", desc: "Génère et édite des vidéos avec l'IA.", lien: "https://runwayml.com", emoji: "🎬", cat: "IA & Outils", badge: "Freemium" },
  { titre: "ElevenLabs", desc: "Voix off ultra-réalistes générées par IA.", lien: "https://elevenlabs.io", emoji: "🎙️", cat: "IA & Outils", badge: "Freemium" },
  { titre: "Sora (OpenAI)", desc: "Génère des vidéos à partir de texte.", lien: "https://sora.com", emoji: "✨", cat: "IA & Outils", badge: "Payant" },
  { titre: "Kling AI", desc: "Génère des vidéos réalistes avec l'IA.", lien: "https://klingai.com", emoji: "🎥", cat: "IA & Outils", badge: "Freemium" },
  { titre: "Pika Labs", desc: "Crée des vidéos courtes avec l'IA.", lien: "https://pika.art", emoji: "⚡", cat: "IA & Outils", badge: "Freemium" },
  { titre: "Descript", desc: "Édite ta vidéo en éditant le texte de la transcription.", lien: "https://descript.com", emoji: "📝", cat: "IA & Outils", badge: "Freemium" },
  { titre: "Captions.ai", desc: "Sous-titres automatiques stylés pour tes vidéos.", lien: "https://captions.ai", emoji: "💬", cat: "IA & Outils", badge: "Freemium" },
  { titre: "OpusClip", desc: "Transforme tes longues vidéos en clips viraux automatiquement.", lien: "https://opus.pro", emoji: "✂️", cat: "IA & Outils", badge: "Freemium" },
  { titre: "VidIQ AI", desc: "Idées de vidéos et analyse de chaîne par IA.", lien: "https://vidiq.com", emoji: "📊", cat: "IA & Outils", badge: "Freemium" },
  { titre: "TubeBuddy AI", desc: "Optimise tes titres et tags avec l'IA.", lien: "https://tubebuddy.com", emoji: "🔧", cat: "IA & Outils", badge: "Freemium" },
  { titre: "Murf AI", desc: "Voix off professionnelles en français.", lien: "https://murf.ai", emoji: "🔊", cat: "IA & Outils", badge: "Freemium" },
  { titre: "Lumen5", desc: "Transforme tes articles en vidéos automatiquement.", lien: "https://lumen5.com", emoji: "🔄", cat: "IA & Outils", badge: "Freemium" },
  { titre: "Synthesia", desc: "Crée des vidéos avec un avatar IA qui parle.", lien: "https://synthesia.io", emoji: "👤", cat: "IA & Outils", badge: "Payant" },

  // Montage
  { titre: "CapCut", desc: "Montage vidéo gratuit et très puissant, parfait pour débuter.", lien: "https://capcut.com", emoji: "🎞️", cat: "Montage", badge: "Gratuit" },
  { titre: "DaVinci Resolve", desc: "Logiciel de montage pro gratuit utilisé par Hollywood.", lien: "https://blackmagicdesign.com/products/davinciresolve", emoji: "🎬", cat: "Montage", badge: "Gratuit" },
  { titre: "Premiere Pro", desc: "Le standard de l'industrie pour le montage vidéo.", lien: "https://adobe.com/premiere", emoji: "🎭", cat: "Montage", badge: "Payant" },
  { titre: "Final Cut Pro", desc: "Montage pro sur Mac, ultra rapide.", lien: "https://apple.com/final-cut-pro", emoji: "🍎", cat: "Montage", badge: "Payant" },
  { titre: "After Effects", desc: "Effets visuels et motion design professionnels.", lien: "https://adobe.com/after-effects", emoji: "✨", cat: "Montage", badge: "Payant" },
  { titre: "Kdenlive", desc: "Logiciel de montage open source et gratuit.", lien: "https://kdenlive.org", emoji: "🖥️", cat: "Montage", badge: "Gratuit" },
  { titre: "Canva Video", desc: "Crée des vidéos simples et des intros facilement.", lien: "https://canva.com", emoji: "🎨", cat: "Montage", badge: "Freemium" },
  { titre: "Veed.io", desc: "Montage vidéo en ligne avec sous-titres auto.", lien: "https://veed.io", emoji: "🌐", cat: "Montage", badge: "Freemium" },
  { titre: "Premiere Rush", desc: "Montage rapide sur mobile et desktop.", lien: "https://adobe.com/rush", emoji: "📱", cat: "Montage", badge: "Freemium" },
  { titre: "Filmora", desc: "Montage simple avec effets tendance intégrés.", lien: "https://filmora.wondershare.com", emoji: "🎪", cat: "Montage", badge: "Payant" },

  // Croissance
  { titre: "VidIQ", desc: "Analyse ta chaîne et trouve des mots-clés qui cartonnent.", lien: "https://vidiq.com", emoji: "📈", cat: "Croissance", badge: "Freemium" },
  { titre: "TubeBuddy", desc: "Extension Chrome pour optimiser chaque vidéo.", lien: "https://tubebuddy.com", emoji: "🔍", cat: "Croissance", badge: "Freemium" },
  { titre: "Google Trends", desc: "Trouve les sujets tendance avant tout le monde.", lien: "https://trends.google.com", emoji: "📊", cat: "Croissance", badge: "Gratuit" },
  { titre: "Answer The Public", desc: "Trouve les questions que les gens posent sur ton sujet.", lien: "https://answerthepublic.com", emoji: "❓", cat: "Croissance", badge: "Freemium" },
  { titre: "Social Blade", desc: "Analyse les stats de n'importe quelle chaîne YouTube.", lien: "https://socialblade.com", emoji: "⚔️", cat: "Croissance", badge: "Gratuit" },
  { titre: "Morningfame", desc: "Outil d'analyse et de croissance pour YouTubeurs.", lien: "https://morningfame.com", emoji: "🌅", cat: "Croissance", badge: "Payant" },
  { titre: "YouTube Studio", desc: "Ton tableau de bord officiel YouTube.", lien: "https://studio.youtube.com", emoji: "📺", cat: "Croissance", badge: "Gratuit" },
  { titre: "Keyword Tool", desc: "Trouve les meilleurs mots-clés YouTube.", lien: "https://keywordtool.io", emoji: "🔑", cat: "Croissance", badge: "Freemium" },
  { titre: "SpyFu", desc: "Espionne les mots-clés de tes concurrents.", lien: "https://spyfu.com", emoji: "🕵️", cat: "Croissance", badge: "Payant" },
  { titre: "Semrush", desc: "SEO complet pour dominer les recherches.", lien: "https://semrush.com", emoji: "🎯", cat: "Croissance", badge: "Payant" },

  // Monétisation
  { titre: "Gumroad", desc: "Vends tes formations, presets et ebooks facilement.", lien: "https://gumroad.com", emoji: "💰", cat: "Monétisation", badge: "Gratuit" },
  { titre: "Beacons.ai", desc: "Crée ta page de liens et vends tes produits.", lien: "https://beacons.ai", emoji: "🔗", cat: "Monétisation", badge: "Freemium" },
  { titre: "Patreon", desc: "Crée un abonnement pour tes fans les plus fidèles.", lien: "https://patreon.com", emoji: "❤️", cat: "Monétisation", badge: "Gratuit" },
  { titre: "Ko-fi", desc: "Reçois des dons et vends des produits numériques.", lien: "https://ko-fi.com", emoji: "☕", cat: "Monétisation", badge: "Gratuit" },
  { titre: "Teachable", desc: "Crée et vends ta propre formation en ligne.", lien: "https://teachable.com", emoji: "🎓", cat: "Monétisation", badge: "Freemium" },
  { titre: "Podia", desc: "Plateforme tout-en-un pour vendre des formations.", lien: "https://podia.com", emoji: "🏪", cat: "Monétisation", badge: "Payant" },
  { titre: "Skool", desc: "Crée ta communauté payante avec formation intégrée.", lien: "https://skool.com", emoji: "🏫", cat: "Monétisation", badge: "Payant" },
  { titre: "Stan Store", desc: "Vends tes produits directement depuis tes réseaux.", lien: "https://stanstore.com", emoji: "⭐", cat: "Monétisation", badge: "Payant" },
  { titre: "Stripe", desc: "Accepte les paiements en ligne facilement.", lien: "https://stripe.com", emoji: "💳", cat: "Monétisation", badge: "Gratuit" },
  { titre: "YouTube BrandConnect", desc: "Connecte-toi avec des marques pour des sponsors.", lien: "https://youtube.com/brandconnect", emoji: "🤝", cat: "Monétisation", badge: "Gratuit" },

  // Design
  { titre: "Canva", desc: "Crée des miniatures professionnelles en quelques clics.", lien: "https://canva.com", emoji: "🎨", cat: "Design", badge: "Freemium" },
  { titre: "Adobe Express", desc: "Miniatures et visuels pro avec templates YouTube.", lien: "https://express.adobe.com", emoji: "✏️", cat: "Design", badge: "Freemium" },
  { titre: "Figma", desc: "Design professionnel de miniatures et visuels.", lien: "https://figma.com", emoji: "🖌️", cat: "Design", badge: "Freemium" },
  { titre: "Photoshop", desc: "Le standard pour créer des miniatures qui cliquent.", lien: "https://adobe.com/photoshop", emoji: "🖼️", cat: "Design", badge: "Payant" },
  { titre: "Midjourney", desc: "Génère des images IA époustouflantes pour tes miniatures.", lien: "https://midjourney.com", emoji: "🌄", cat: "Design", badge: "Payant" },
  { titre: "DALL-E 3", desc: "Génère des images réalistes avec ChatGPT.", lien: "https://openai.com/dall-e-3", emoji: "🎭", cat: "Design", badge: "Freemium" },
  { titre: "Stable Diffusion", desc: "IA image open source à installer localement.", lien: "https://stability.ai", emoji: "🌊", cat: "Design", badge: "Gratuit" },
  { titre: "Remove.bg", desc: "Supprime l'arrière-plan de tes photos instantanément.", lien: "https://remove.bg", emoji: "✂️", cat: "Design", badge: "Freemium" },
  { titre: "Unsplash", desc: "Photos gratuites haute qualité libres de droits.", lien: "https://unsplash.com", emoji: "📸", cat: "Design", badge: "Gratuit" },
  { titre: "Pexels", desc: "Photos et vidéos gratuites libres de droits.", lien: "https://pexels.com", emoji: "📷", cat: "Design", badge: "Gratuit" },
  { titre: "Flaticon", desc: "Des millions d'icônes gratuites pour tes créations.", lien: "https://flaticon.com", emoji: "🔷", cat: "Design", badge: "Freemium" },
  { titre: "Font Awesome", desc: "Bibliothèque d'icônes incontournable.", lien: "https://fontawesome.com", emoji: "🔤", cat: "Design", badge: "Freemium" },

  // Audio
  { titre: "Epidemic Sound", desc: "Musique libre de droits pour tes vidéos YouTube.", lien: "https://epidemicsound.com", emoji: "🎵", cat: "Audio", badge: "Payant" },
  { titre: "Artlist", desc: "Musique et effets sonores premium illimités.", lien: "https://artlist.io", emoji: "🎶", cat: "Audio", badge: "Payant" },
  { titre: "YouTube Audio Library", desc: "Musique et sons gratuits fournis par YouTube.", lien: "https://studio.youtube.com/channel/music", emoji: "🎼", cat: "Audio", badge: "Gratuit" },
  { titre: "Pixabay Music", desc: "Musique gratuite sans attribution requise.", lien: "https://pixabay.com/music", emoji: "🎹", cat: "Audio", badge: "Gratuit" },
  { titre: "Uppbeat", desc: "Musique gratuite pour YouTubeurs.", lien: "https://uppbeat.io", emoji: "🎸", cat: "Audio", badge: "Freemium" },
  { titre: "Suno AI", desc: "Génère de la musique originale avec l'IA.", lien: "https://suno.com", emoji: "🎤", cat: "Audio", badge: "Freemium" },
  { titre: "Audacity", desc: "Logiciel d'édition audio gratuit et puissant.", lien: "https://audacityteam.org", emoji: "🎚️", cat: "Audio", badge: "Gratuit" },
  { titre: "Adobe Audition", desc: "Edition audio professionnelle.", lien: "https://adobe.com/audition", emoji: "🎛️", cat: "Audio", badge: "Payant" },
  { titre: "Krisp", desc: "Supprime le bruit de fond de ton micro en temps réel.", lien: "https://krisp.ai", emoji: "🔇", cat: "Audio", badge: "Freemium" },
  { titre: "Soundraw", desc: "Génère de la musique IA personnalisée.", lien: "https://soundraw.io", emoji: "🎻", cat: "Audio", badge: "Payant" },

  // Analytics
  { titre: "YouTube Analytics", desc: "Tes statistiques officielles YouTube en détail.", lien: "https://studio.youtube.com/analytics", emoji: "📊", cat: "Analytics", badge: "Gratuit" },
  { titre: "Social Blade", desc: "Compare ta chaîne avec les concurrents.", lien: "https://socialblade.com", emoji: "📉", cat: "Analytics", badge: "Gratuit" },
  { titre: "Chartmetric", desc: "Analytics avancés pour créateurs de contenu.", lien: "https://chartmetric.com", emoji: "📈", cat: "Analytics", badge: "Freemium" },
  { titre: "Sprout Social", desc: "Analyse complète de tes réseaux sociaux.", lien: "https://sproutsocial.com", emoji: "🌱", cat: "Analytics", badge: "Payant" },
  { titre: "Hootsuite Analytics", desc: "Suivi des performances sur tous tes réseaux.", lien: "https://hootsuite.com", emoji: "🦉", cat: "Analytics", badge: "Payant" },
  { titre: "Later", desc: "Programme tes posts et analyse les résultats.", lien: "https://later.com", emoji: "⏰", cat: "Analytics", badge: "Freemium" },
  { titre: "NotJustAnalytics", desc: "Analytics YouTube avancés et prédictifs.", lien: "https://notjustanalytics.com", emoji: "🔮", cat: "Analytics", badge: "Payant" },

  // Inspiration
  { titre: "MrBeast - Analyse", desc: "Décryptage de la stratégie du plus grand YouTubeur.", lien: "https://youtube.com/results?search_query=mrbeast+strategy", emoji: "👑", cat: "Inspiration", badge: "Gratuit" },
  { titre: "Think Media", desc: "Chaîne sur comment grandir sur YouTube.", lien: "https://youtube.com/@ThinkMedia", emoji: "💡", cat: "Inspiration", badge: "Gratuit" },
  { titre: "Roberto Blake", desc: "Conseils pro pour créateurs de contenu.", lien: "https://youtube.com/@robertoblake", emoji: "🎯", cat: "Inspiration", badge: "Gratuit" },
  { titre: "Paddy Galloway", desc: "Analyse des stratégies des plus grandes chaînes.", lien: "https://youtube.com/@PaddyGalloway", emoji: "🔬", cat: "Inspiration", badge: "Gratuit" },
  { titre: "Ali Abdaal", desc: "Productivité et croissance pour créateurs.", lien: "https://youtube.com/@aliabdaal", emoji: "📚", cat: "Inspiration", badge: "Gratuit" },
  { titre: "Creator Fundamentals", desc: "Les bases pour réussir sur YouTube.", lien: "https://youtube.com/results?search_query=youtube+growth+tips+2024", emoji: "🏗️", cat: "Inspiration", badge: "Gratuit" },
  { titre: "Checkmark (Newsletter)", desc: "Newsletter hebdo sur la croissance YouTube.", lien: "https://newsletter.vidiq.com", emoji: "✉️", cat: "Inspiration", badge: "Gratuit" },
  { titre: "Creator Economy Report", desc: "Les dernières tendances de la creator economy.", lien: "https://creatoreconomy.so", emoji: "🌍", cat: "Inspiration", badge: "Gratuit" },

  // Formation
  { titre: "YouTube Creator Academy", desc: "Formation officielle YouTube pour créateurs.", lien: "https://creatoracademy.youtube.com", emoji: "🎓", cat: "Formation", badge: "Gratuit" },
  { titre: "Skillshare", desc: "Des milliers de cours sur la vidéo et le montage.", lien: "https://skillshare.com", emoji: "📖", cat: "Formation", badge: "Payant" },
  { titre: "Udemy - YouTube Marketing", desc: "Cours complets sur la croissance YouTube.", lien: "https://udemy.com/courses/search/?q=youtube", emoji: "🎯", cat: "Formation", badge: "Payant" },
  { titre: "Coursera", desc: "Cours certifiés sur le marketing digital.", lien: "https://coursera.org", emoji: "🏫", cat: "Formation", badge: "Freemium" },
  { titre: "HubSpot Academy", desc: "Certifications gratuites en marketing.", lien: "https://academy.hubspot.com", emoji: "🏆", cat: "Formation", badge: "Gratuit" },
];

const badgeColor: any = {
  "Gratuit": "bg-green-500/20 text-green-400 border border-green-500/30",
  "Freemium": "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  "Payant": "bg-purple-500/20 text-purple-400 border border-purple-500/30",
};

export default function Ressources() {
  useAuth();
  const [catActive, setCatActive] = useState("Tout");
  const [search, setSearch] = useState("");

  const filtrees = ressources.filter(r => {
    const matchCat = catActive === "Tout" || r.cat === catActive;
    const matchSearch = r.titre.toLowerCase().includes(search.toLowerCase()) || r.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/ressources" />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-5xl font-bold text-white mb-2 text-center">🛠️ Ressources</h1>
        <p className="text-gray-400 mb-8 text-center">{ressources.length} outils sélectionnés pour faire exploser ta chaîne</p>

        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Rechercher un outil..."
          className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 mb-6" />

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCatActive(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${catActive === cat ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filtrees.map((r, i) => (
            <a key={i} href={r.lien} target="_blank" rel="noopener noreferrer"
              className="bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-2xl p-5 transition-all group block">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{r.emoji}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor[r.badge]}`}>{r.badge}</span>
              </div>
              <h3 className="font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{r.titre}</h3>
              <p className="text-sm text-gray-400 mb-3">{r.desc}</p>
              <p className="text-xs text-blue-400 font-semibold">Accéder →</p>
            </a>
          ))}
        </div>

        {filtrees.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            <p className="text-4xl mb-4">🔍</p>
            <p>Aucune ressource trouvée pour "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
