"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const modules = [
  { id: 1, titre: "Introduction", description: "Bienvenue dans la YouTube Money Academy !", image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600", chapitres: 1 },
  { id: 2, titre: "Module 1 — Clip Roblox", description: "Apprends à créer des clips Roblox qui cartonnent.", image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600", chapitres: 3 },
  { id: 3, titre: "Module 2 — Montage", description: "Maîtrise le montage vidéo comme un pro.", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600", chapitres: 3 },
  { id: 4, titre: "Module 3 — Intelligence Artificielle", description: "Utilise l'IA pour booster tes vidéos.", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600", chapitres: 3 },
  { id: 5, titre: "Module 4 — Importation", description: "Publie tes vidéos sur YouTube et TikTok.", image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=600", chapitres: 3 },
  { id: 6, titre: "Module 5 — Astuces", description: "Les astuces que j'utilise pour mes vidéos.", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600", chapitres: 3 },
  { id: 7, titre: "Module 6 — Conseils", description: "Mes meilleurs conseils pour réussir sur YouTube.", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600", chapitres: 3 },
];
export default function Programme() {
  const [pret, setPret] = useState(false);
  const [progression, setProgression] = useState<{[key:number]:number}>({});
  const [userId, setUserId] = useState("");
  const loadProgression = useCallback(async (uid: string) => {
    const { data } = await supabase.from("progression").select("*").eq("user_id", uid).eq("completed", true);
    if (!data) return;
    const prog: {[key:number]:number} = {};
    modules.forEach(m => {
      const completed = data.filter((p:any) => p.module_id === m.id).length;
      prog[m.id] = Math.round((completed / m.chapitres) * 100);
    });
    setProgression(prog);
  }, []);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      setPret(true);
      loadProgression(session.user.id);
    });
  }, []);
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => loadProgression(userId), 3000);
    return () => clearInterval(interval);
  }, [userId]);
  if (!pret) return <main className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-gray-400">Chargement...</p></main>;
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/programme" />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Programme YMA</h2>
        <p className="text-gray-400 mb-8">YouTube Money Academy</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {modules.map(mod => (
            <button key={mod.id} onClick={() => window.location.href=`/module/${mod.id}`}
              className="bg-gray-900 rounded-2xl border border-gray-800 hover:border-blue-500 transition-all text-left overflow-hidden group">
              <div className="relative">
                <img src={mod.image} alt={mod.titre} className="w-full h-40 object-cover group-hover:opacity-90 transition-all" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-base mb-1">{mod.titre}</h3>
                <p className="text-sm text-gray-400 mb-3">{mod.description}</p>
                <p className="text-xs text-gray-500 mb-2">{mod.chapitres} chapitre{mod.chapitres > 1 ? "s" : ""}</p>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{width:`${progression[mod.id]||0}%`}} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{progression[mod.id]||0}%</p>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
