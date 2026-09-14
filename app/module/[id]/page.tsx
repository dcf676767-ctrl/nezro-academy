"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Sidebar from "../../components/Sidebar";
const modulesData: {[key:number]:{titre:string;chapitres:{id:number;titre:string;duree:string;description:string;lien?:string;lienlabel?:string}[]}} = {
  1:{titre:"Introduction",chapitres:[{id:1,titre:"Bienvenue dans la YMA !",duree:"1 min",description:"Programme Exclusive : La Niche YouTube qui m'a Rapporté +5000€ et 10 Millions de Vues\n\n📚 Ce que contient ce programme :\n\n✅ La Niche Révélée : Ma niche secrète qui génère des millions de vues\n✅ Montage Viral : Les techniques exactes demontage pour maximiser la rétention (durée optimale, rythme, hooks)\n✅ Intelligence Artificielle : Comment j'utilise l'IA pour produire du contenu de qualitéen un temps record\n✅ YouTube Studio Décrypté : Tous les réglages et astuces pour monétiser et optimiser vos vidéos comme unpro\n✅ Importation 4K + TikTok : La méthode pour exporter en4K sur YouTube ET recycler sur TikTok pour multiplier votre trafic\n✅ Astuces Avancées : Mes secrets sur la monétisation, l'algorithme YouTube, et les pièges à éviter absolument"}]},
  2:{titre:"Module 1 — Clips",chapitres:[{id:1,titre:"Clips Roblox",duree:"3 min",description:"Comment trouver les meilleurs clips Roblox.",lien:"https://www.roblox.com/share?code=2e18c279d8ce9e4dadb9cace848fbff3&type=ExperienceDetails&stamp=1783802571761",lienlabel:"🎮 LIEN DU JEU"}]},
  3:{titre:"Module 2 — Montage",chapitres:[{id:1,titre:"Montage",duree:"15 min",description:"Les bases du montage vidéo."}]},
  4:{titre:"Module 3 — Intelligence Artificielle",chapitres:[{id:1,titre:"IA",duree:"10 min",description:"Utilise l'IA pour tes miniatures."}]},
  5:{titre:"Module 4 — Importation",chapitres:[{id:1,titre:"Importation sur Tiktok et Youtube",duree:"5 min",description:"Comment publier sur YouTube."}]},
  6:{titre:"Module 5 — Astuces",chapitres:[{id:1,titre:"Astuces",duree:"2 min",description:"Mes astuces miniatures."}]},
  7:{titre:"Module 6 — Conseils",chapitres:[{id:1,titre:"Conseils",duree:"4 min",description:"Comment rester consistant."}]},
};
export default function Module() {
  const params = useParams();
  const moduleId = Number(params.id);
  const moduleData = modulesData[moduleId];
  const [completed, setCompleted] = useState<number[]>([]);
  const [userId, setUserId] = useState("");
  const [chapitreActif, setChapitreActif] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) =>{
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      supabase.from("progression").select("chapitre_id").eq("user_id",session.user.id).eq("module_id",moduleId).eq("completed",true).then(({ data }) => {
        if (data) setCompleted(data.map((p:any) => p.chapitre_id));
      });
    });
  }, []);
  useEffect(() => {
    if (moduleId !== 1 || !playerRef.current) return;
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
    (window as any).onYouTubeIframeAPIReady = () => {
      new (window as any).YT.Player(playerRef.current, {
        videoId: "_3JxXTY34mM",
        playerVars: {
          rel: 0,
          modestbranding: 1,
          showinfo: 0,
          iv_load_policy: 3,
          disablekb: 0,
          fs: 1,
          vq: "hd2160",
        },
        height: "100%",
        width: "100%",
      });
    };
  }, [moduleId]);
  const toggleCompleted = async (chapId: number) => {
    if (completed.includes(chapId)) {
      await supabase.from("progression").delete().eq("user_id",userId).eq("module_id",moduleId).eq("chapitre_id",chapId);
      setCompleted(prev => prev.filter(id => id !== chapId));
    } else {
      await supabase.from("progression").upsert({user_id:userId,module_id:moduleId,chapitre_id:chapId,completed:true});
      setCompleted(prev => [...prev, chapId]);
    }
  };
  const suivant = async () => {
    const chapitre = moduleData.chapitres[chapitreActif];
    if (!completed.includes(chapitre.id)) {
      await supabase.from("progression").upsert({user_id:userId,module_id:moduleId,chapitre_id:chapitre.id,completed:true});
      setCompleted(prev => [...prev, chapitre.id]);
    }
    if (chapitreActif < moduleData.chapitres.length - 1) { setChapitreActif(chapitreActif+1); }
    else { window.location.href="/programme"; }
  };
  if (!moduleData) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Module introuvable</div>;
  const progression = Math.round((completed.length/moduleData.chapitres.length)*100);
  const chapitre = moduleData.chapitres[chapitreActif];
  const estDernier = chapitreActif === moduleData.chapitres.length-1;
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/programme" />
      <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 module-enter-page">
        <button onClick={() => window.location.href="/programme"} className="text-sm text-gray-400 hover:text-white mb-6 flexitems-center gap-1 transition-colors">← Retour au programme</button>
        <h1 className="text-2xl font-bold text-white mb-2">{moduleData.titre}</h1>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div className="h-2 rounded-full transition-all" style={{width:`${progression}%`, background:progression===100?"#22c55e":progression>=50?"#f97316":"#ef4444"}} />
          </div>
          <span className="text-sm text-gray-400">{progression}%</span>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="rounded-2xl aspect-video mb-6 overflow-hidden">
              {moduleId === 1 || moduleId === 2 || moduleId === 3 || moduleId === 4 || moduleId === 5 || moduleId === 6 || moduleId === 7 ? (
                <iframe
                  src={moduleId === 2 ? "https://www.youtube.com/embed/lUCpFxP9NSo?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3" : moduleId === 3 ? "https://www.youtube.com/embed/9jG1_0eL1aU?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3" : moduleId === 4 ? "https://www.youtube.com/embed/yS_9RaC-hBc?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3" : moduleId === 5 ? "https://www.youtube.com/embed/FiLeCdNQHZw?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3" : moduleId === 6 ? "https://www.youtube.com/embed/tdnIDErJaqo?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3" : moduleId === 7 ? "https://www.youtube.com/embed/DZuGYMerKRI?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3" : "https://www.youtube.com/embed/_3JxXTY34mM?rel=0&modestbranding=1&showinfo=0&iv_load_policy=3&vq=hd2160"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="bg-gray-900 rounded-2xl w-fullh-full flex items-center justify-center border border-gray-800">
                  <p className="text-gray-500">Vidéo à venir —{chapitre.titre}</p>
                </div>
              )}
            </div>
<h2 className="text-xl font-bold text-white mb-3">{chapitre.titre}</h2>
            {moduleId === 1 && (
            <div className="flex flex-col gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{chapitre.description}</p>
                {chapitre.lien && (
                  <a href={chapitre.lien} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                    {chapitre.lienlabel || "🔗 Lien"}
                  </a>
                )}
              </div>
            </div>
            )}
            {moduleId === 2 && (
            <div className="flex flex-col gap-4 mb-6">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <h3 className="text-white font-bold mb-3">🔗 Lien du jeu ⬇️</h3>
                {chapitre.lien && (
                  <a href={chapitre.lien} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                    {chapitre.lienlabel || "🔗 Lien"}
                  </a>
                )}
              </div>
            </div>
            )}
            {moduleId > 2 && (
            <div className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl p-5 mt-4">
              <h3 className="text-white font-bold mb-3">📝 Mes notes</h3>
              <textarea
                placeholder="Écris tes notes ici..."
                onChange={e => localStorage.setItem(`note-main-${moduleId}-${chapitre.id}`, e.target.value)}
                defaultValue={typeof window !== "undefined" ? localStorage.getItem(`note-main-${moduleId}-${chapitre.id}`) || "" : ""}
                className="w-full min-h-[200px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">Tes notes sont sauvegardées automatiquement sur cet appareil</p>
            </div>
            )}
            <div className="flex justify-end">

            </div>
          </div>
          <div className="w-full md:w-72 shrink-0 flex flex-col gap-6">
            <div>
              <h3 className="font-bold text-white mb-4">Chapitres</h3>
              <div className="flex flex-col gap-2">
                {moduleData.chapitres.map((chap,i) => (
                  <div key={chap.id} onClick={() => setChapitreActif(i)}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${i===chapitreActif?"bg-blue-600/20 border border-blue-500":"bg-gray-900 border border-gray-800 hover:border-gray-600"}`}>
                    <button onClick={(e) => {e.stopPropagation();toggleCompleted(chap.id);}}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${completed.includes(chap.id)?"bg-green-500 border-green-500":"border-gray-600"}`}>
                      {completed.includes(chap.id) && <span className="text-xs text-white">✓</span>}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm font-medium ${i===chapitreActif?"text-blue-400":"text-gray-300"}`}>{chap.titre}</p>
                        {i===chapitreActif && <button onClick={(e) => { e.stopPropagation(); suivant(); }} className="shrink-0 bg-blue-600 text-white px-2.5 py-1 rounded-lg text-xs font-boldhover:bg-blue-700 transition-all">{estDernier?"🎉 Terminer":"Suivant →"}</button>}
                      </div>
                      <p className="text-xs text-gray-500">{chap.duree}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex-1 flex flex-col">
              <h3 className="text-white font-bold mb-3">📝 Mes notes</h3>
              <textarea
                placeholder="Écris tes notes ici..."
                onChange={e => localStorage.setItem(`note-${moduleId}-${chapitre.id}`, e.target.value)}
                defaultValue={typeof window !== "undefined" ? localStorage.getItem(`note-${moduleId}-${chapitre.id}`) || "": ""}
                className="w-full flex-1 min-h-[300px] bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
              />
              <p className="text-xs text-gray-600 mt-1">Tes notes sont sauvegardées automatiquement sur cet appareil</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
