"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const modules = [
  { id: 1, titre: "Niche Roblox", label: "Roblox", description: "Le programme complet pour percer sur la niche Roblox.", image: "/roblox.jpg", chapitres: 7, customThumb: true },
  { id: 8, titre: "Module 7 — Niche GTA 6", label: "???", description: "Contenu secret en cours de préparation...", image: "/gta6.jpg", chapitres: 1, customThumb: true, locked: true },
];
const getColor = (pct: number) => pct === 100 ? "#22c55e" : pct >= 50 ? "#f97316" : "#ef4444";
export default function Programme() {
  const router = useRouter();
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
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    const btn = e.currentTarget;
    const inner = btn.querySelector(".card-inner") as HTMLElement;
    const rect = inner.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.5;
    const ripple = document.createElement("span");
    ripple.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:rgba(99,179,255,0.35);left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;transform:scale(0);animation:ripple 0.8s ease-out forwards;pointer-events:none;z-index:99;`;
    inner.appendChild(ripple);
    setTimeout(() => ripple.remove(), 800);
    router.push(`/module/${id}`);
  };
  if (!pret) return <main className="min-h-screen bg-gray-950 flex items-center justify-center"><p className="text-gray-400">Chargement...</p></main>;
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <main className="flex-1 md:ml-64 p-8 pt-20 md:pt-8 module-enter-page">
        <div className="flex flex-col items-center mb-8">
          <div className="glow-title-wrap">
            <div className="glow-title-inner px-10 py-6">
              <h2 className="text-6xl font-bold text-white text-center">YMA</h2>
              <p className="text-gray-400 text-center mt-2">YouTube Money Academy</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map(mod => (
            <button key={mod.id} onClick={(e) => { if ((mod as any).locked) return; handleClick(e, mod.id); }}
              className="relative group text-left rounded-2xl transition-all duration-300 hover:-translate-y-2 hover:scale-105 active:scale-95"
              style={{
                padding:"2px",
                background:"linear-gradient(135deg,#60a5fa,#1d4ed8)",
                boxShadow:"0 0 25px rgba(59,130,246,0.6), 0 0 60px rgba(59,130,246,0.2)",
                borderRadius:"16px"
              }}>
              <div className="card-inner relative bg-gray-900 rounded-2xl overflow-hidden w-full h-full transition-all duration-300">
                <div className="relative h-72 md:h-60">
                  {mod.customThumb ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <img src={mod.image} alt={mod.titre} className="absolute inset-0 w-full h-full object-cover" style={{objectPosition: mod.id !== 1 ? "center center" : "initial", filter: (mod as any).locked ? "grayscale(80%) brightness(0.4)" : "none"}} />{(mod as any).locked && <div className="absolute inset-0 flex items-center justify-center"><span style={{fontSize:"7rem", fontWeight:"900", color:"rgba(255,255,255,0.9)", textShadow:"0 4px 30px rgba(0,0,0,0.9)", lineHeight:"1"}}>?</span></div>}
                
                      
                    </div>
                  ) : (
                    <>
                      <div className="absolute inset-0" style={{backgroundImage:`url(${mod.image})`, backgroundSize:"cover", backgroundPosition:"center center"}} />
                      
                    </>
                  )}
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
