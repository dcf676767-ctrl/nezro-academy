"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar"; import { useRouter } from "next/navigation";
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
const getColor = (pct: number) => pct === 100 ? "#22c55e" : pct >= 50 ? "#f97316" : "#ef4444";
export default function Programme() {
  const router = useRouter(); const [pret, setPret] = useState(false);
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
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    const btn = e.currentTarget;
    const inner = btn.querySelector(".card-inner") as HTMLElement;
    const rect = inner.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.5;
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute;
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:rgba(99,179,255,0.35);
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY - rect.top - size/2}px;
      transform:scale(0);
      animation:ripple 0.8s ease-out forwards;
      pointer-events:none;
      z-index:99;
    `;
    inner.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800); router.push(`/module/${id}`);
  };
  if (!pret) return <main className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-gray-400">Chargement...</p></main>;
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/programme" />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-5xl font-bold text-white mb-3 text-center">Programme YMA</h2>
        <p className="text-gray-400 mb-8 text-center">YouTube Money Academy</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map(mod => (
            <button key={mod.id} onClick={(e) => handleClick(e, mod.id)}
              className="relative group text-left rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-95"
              style={{
                padding:"2px",
                background:"linear-gradient(135deg,#60a5fa,#1d4ed8)",
                boxShadow:"0 0 25px rgba(59,130,246,0.6), 0 0 60px rgba(59,130,246,0.2)",
                borderRadius:"16px"
              }}>
              <div className="card-inner relative bg-gray-900 rounded-2xl overflow-hidden w-full h-full transition-all duration-300">
                <div className="relative">
                  <img src={mod.image} alt={mod.titre} className="w-full h-40 object-cover group-hover:opacity-90 transition-all duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
                  {progression[mod.id] === 100 && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">✓ Terminé</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-white text-base mb-1">{mod.titre}</h3>
                  <p className="text-sm text-gray-400 mb-3">{mod.description}</p>
                  <p className="text-xs text-gray-500 mb-2">{mod.chapitres} chapitre{mod.chapitres > 1 ? "s" : ""}</p>
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full transition-all duration-500" style={{width:`${progression[mod.id]||0}%`,background:getColor(progression[mod.id]||0)}} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progression[mod.id]||0}%</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
