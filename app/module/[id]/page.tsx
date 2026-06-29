"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../../components/Sidebar";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const modulesData: {[key:number]:{titre:string;chapitres:{id:number;titre:string;duree:string;description:string}[]}} = {
  1:{titre:"Introduction",chapitres:[{id:1,titre:"Bienvenue dans la YMA !",duree:"5 min",description:"Bienvenue dans la YouTube Money Academy !"}]},
  2:{titre:"Module 1 — Clip Roblox",chapitres:[{id:1,titre:"Trouver les bons clips",duree:"10 min",description:"Comment trouver les meilleurs clips Roblox."},{id:2,titre:"Filmer comme un pro",duree:"15 min",description:"Les techniques pour filmer des clips de qualité."},{id:3,titre:"Rendre le clip viral",duree:"12 min",description:"Les secrets pour rendre tes clips viraux."}]},
  3:{titre:"Module 2 — Montage",chapitres:[{id:1,titre:"Les bases du montage",duree:"15 min",description:"Les bases du montage vidéo."},{id:2,titre:"Effets et transitions",duree:"20 min",description:"Comment ajouter des effets pro."},{id:3,titre:"Exporter sa vidéo",duree:"10 min",description:"Les bons réglages pour exporter."}]},
  4:{titre:"Module 3 — Intelligence Artificielle",chapitres:[{id:1,titre:"L'IA pour les miniatures",duree:"12 min",description:"Utilise l'IA pour tes miniatures."},{id:2,titre:"L'IA pour les titres",duree:"10 min",description:"Génère des titres avec l'IA."},{id:3,titre:"Automatiser avec l'IA",duree:"18 min",description:"Automatise ta chaîne avec l'IA."}]},
  5:{titre:"Module 4 — Importation",chapitres:[{id:1,titre:"Publier sur YouTube",duree:"15 min",description:"Comment publier sur YouTube."},{id:2,titre:"Publier sur TikTok",duree:"10 min",description:"Comment publier sur TikTok."},{id:3,titre:"Optimiser ses posts",duree:"12 min",description:"Optimise tes publications."}]},
  6:{titre:"Module 5 — Astuces",chapitres:[{id:1,titre:"Astuce miniatures",duree:"10 min",description:"Mes astuces miniatures."},{id:2,titre:"Astuce algorithme",duree:"15 min",description:"Joue avec l'algorithme."},{id:3,titre:"Astuce monétisation",duree:"12 min",description:"Monétise rapidement."}]},
  7:{titre:"Module 6 — Conseils",chapitres:[{id:1,titre:"Rester consistant",duree:"10 min",description:"Comment rester consistant."},{id:2,titre:"Gérer les haters",duree:"8 min",description:"Gérer les commentaires négatifs."},{id:3,titre:"Passer au niveau suivant",duree:"15 min",description:"Scaler ta chaîne."}]},
};
export default function Module() {
  const params = useParams();
  const moduleId = Number(params.id);
  const moduleData = modulesData[moduleId];
  const [completed, setCompleted] = useState<number[]>([]);
  const [userId, setUserId] = useState("");
  const [chapitreActif, setChapitreActif] = useState(0);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      supabase.from("progression").select("chapitre_id").eq("user_id",session.user.id).eq("module_id",moduleId).eq("completed",true).then(({ data }) => {
        if (data) setCompleted(data.map((p:any) => p.chapitre_id));
      });
    });
  }, []);
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
      <main className="flex-1 ml-64 p-8">
        <button onClick={() => window.location.href="/programme"} className="text-sm text-gray-400 hover:text-white mb-6 flex items-center gap-1">← Retour au programme</button>
        <h1 className="text-2xl font-bold text-white mb-2">{moduleData.titre}</h1>
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 bg-gray-800 rounded-full h-2">
            <div className="h-2 rounded-full transition-all" style={{width:`${progression}%`, background:progression===100?"#22c55e":progression>=50?"#f97316":"#ef4444"}} />
          </div>
          <span className="text-sm text-gray-400">{progression}%</span>
        </div>
        <div className="flex gap-8">
          <div className="flex-1">
            <div className="bg-gray-900 rounded-2xl aspect-video flex items-center justify-center mb-6 border border-gray-800">
              <p className="text-gray-500">Vidéo à venir — {chapitre.titre}</p>
            </div>
            <h2 className="text-xl font-bold text-white mb-3">{chapitre.titre}</h2>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-4">
              <p className="text-gray-300 text-sm leading-relaxed">{chapitre.description}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={suivant} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                {estDernier ? "🎉 Terminer le module" : "Chapitre suivant →"}
              </button>
            </div>
          </div>
          <div className="w-72 shrink-0">
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
                    <p className={`text-sm font-medium ${i===chapitreActif?"text-blue-400":"text-gray-300"}`}>{chap.titre}</p>
                    <p className="text-xs text-gray-500">{chap.duree}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
