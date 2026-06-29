"use client";
import Sidebar from "../components/Sidebar";
export default function Ressources() {
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/ressources" />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold text-white mb-1">🛠️ Ressources</h2>
        <p className="text-gray-400 mb-8">Tous les outils pour réussir</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          {[{titre:"CapCut",desc:"Montage vidéo gratuit",lien:"https://capcut.com",emoji:"🎬"},{titre:"Canva",desc:"Créer des miniatures pro",lien:"https://canva.com",emoji:"🎨"},{titre:"ChatGPT",desc:"Générer des idées et titres",lien:"https://chat.openai.com",emoji:"🤖"},{titre:"TubeBuddy",desc:"Optimiser ta chaîne YouTube",lien:"https://tubebuddy.com",emoji:"📈"}].map(r => (
            <a key={r.titre} href={r.lien} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-blue-500 transition-all">
              <span className="text-3xl">{r.emoji}</span>
              <div>
                <p className="font-bold text-white">{r.titre}</p>
                <p className="text-sm text-gray-400">{r.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
