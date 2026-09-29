"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const modules = [
  { id: 10, titre: "Introduction", label: "Intro", description: "Bienvenue dans le programme.", image: "/introduction.jpg", chapitres: 1, customThumb: true },
  { id: 11, titre: "Mind-set et organisation", label: "Mindset", description: "Développe le mindset et l'organisation d'un créateur qui réussit.", image: "/module-mindset.png", chapitres: 2, customThumb: true },
  { id: 12, titre: "Comprendre les réseaux et comment être monétisé", label: "Réseaux", description: "Comprends les réseaux sociaux et les critères de monétisation.", image: "", chapitres: 3, customThumb: false },
  { id: 18, titre: "Outils pour faire plus d'argent et être plus productif", label: "Outils", description: "Les meilleurs outils pour être plus productif et rentable.", image: "", chapitres: 1, customThumb: false },
  { id: 13, titre: "Contenu 100% anonyme", label: "Anonyme", description: "Apprends à créer du contenu sans montrer ton visage ni ta voix.", image: "", chapitres: 9, customThumb: false },
  { id: 14, titre: "Trouver sa niche, être efficace et monétiser", label: "Niche", description: "Trouve ta niche et apprends à être efficace et monétisé.", image: "", chapitres: 8, customThumb: false },
  { id: 15, titre: "30 exemples de niches à faire", label: "Exemples", description: "30 exemples concrets de niches à exploiter.", image: "", chapitres: 1, customThumb: false },
  { id: 16, titre: "Exemple de montage sur CapCut téléphone", label: "Montage", description: "Un exemple complet de montage sur CapCut, sur téléphone.", image: "", chapitres: 1, customThumb: false },
  { id: 23, titre: "Présentation du montage CapCut sur PC", label: "CapCut PC", description: "Présentation complète du montage sur CapCut version PC.", image: "", chapitres: 1, customThumb: false },
  { id: 17, titre: "Commencer à poster", label: "Poster", description: "Chauffe ton compte et importe tes premières vidéos.", image: "", chapitres: 3, customThumb: false },
  { id: 24, titre: "Bien maîtriser sa chaîne YouTube", label: "YouTube", description: "Personnalise ta chaîne et construis ta communauté sur YouTube.", image: "", chapitres: 3, customThumb: false },
  { id: 25, titre: "Analyser pourquoi une vidéo a percé", label: "Analyse", description: "Comprends ce qui fait vraiment percer une vidéo.", image: "", chapitres: 3, customThumb: false },
  { id: 19, titre: "Problèmes de monétisation", label: "Monétisation", description: "Résous les problèmes de monétisation sur TikTok et YouTube.", image: "", chapitres: 3, customThumb: false },
  { id: 20, titre: "Augmenter son RPM", label: "RPM", description: "Comment augmenter son RPM sur les réseaux.", image: "", chapitres: 1, customThumb: false },
  { id: 21, titre: "Astuces", label: "Astuces", description: "Toutes les astuces pour aller plus vite et plus loin.", image: "", chapitres: 8, customThumb: false },
  { id: 22, titre: "Déclaration et compte AdSense", label: "AdSense", description: "Comment gérer son compte AdSense et retirer son argent.", image: "", chapitres: 2, customThumb: false },
  { id: 1, titre: "Niche Roblox", label: "Roblox", description: "Le programme complet pour percer sur la niche Roblox.", image: "/roblox.jpg", chapitres: 7, customThumb: true },
  { id: 8, titre: "Niche GTA 6", label: "???", description: "Contenu secret en cours de préparation...", image: "/gta6.jpg", chapitres: 1, customThumb: true, locked: true },
];
const getColor = (pct: number) => pct === 100 ? "#22c55e" : pct >= 50 ? "#f97316" : "#ef4444";
const glowStyle = `
@keyframes glowPulse {
  0%, 100% { text-shadow: 0 0 10px rgba(96,165,250,0.6), 0 0 25px rgba(59,130,246,0.4), 0 0 50px rgba(37,99,235,0.2); }
  50% { text-shadow: 0 0 25px rgba(147,197,253,1), 0 0 50px rgba(96,165,250,0.9), 0 0 100px rgba(59,130,246,0.6), 0 0 150px rgba(37,99,235,0.3); }
}
@keyframes glowPulseSub {
  0%, 100% { text-shadow: 0 0 6px rgba(147,197,253,0.4); }
  50% { text-shadow: 0 0 14px rgba(147,197,253,0.9), 0 0 28px rgba(96,165,250,0.5); }
}
.glow-num { animation: glowPulse 2.5s ease-in-out infinite; }
.glow-sub { animation: glowPulseSub 2.5s ease-in-out infinite; }
`;

export default function Programme() {
  const router = useRouter();
  // inject glow style
  if (typeof document !== "undefined" && !document.getElementById("glow-style")) { const s = document.createElement("style"); s.id = "glow-style"; s.textContent = glowStyle; document.head.appendChild(s); }
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
  useEffect(() => {
    if (!pret) return;
    if (typeof window === "undefined" || !window.location.hash) return;
    const el = document.querySelector(window.location.hash);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 100);
  }, [pret]);

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
          {modules.map((mod, modIndex) => (
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
                  {(mod.id === 1 || mod.id === 8) ? (
                    <div className="w-full h-full relative overflow-hidden">
                      <img src={mod.image} alt={mod.titre} className="absolute inset-0 w-full h-full object-cover" style={{objectPosition:"center center", filter: (mod as any).locked ? "grayscale(80%) brightness(0.4)" : "none"}} />
                      {(mod as any).locked && <div className="absolute inset-0 flex items-center justify-center"><span style={{fontSize:"7rem", fontWeight:"900", color:"rgba(255,255,255,0.9)", textShadow:"0 4px 30px rgba(0,0,0,0.9)", lineHeight:"1"}}>?</span></div>}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col justify-between" style={{background:"linear-gradient(135deg,#1a3a6b 0%,#1e4fad 60%,#2563eb 100%)", backgroundImage:"linear-gradient(135deg,#1a3a6b 0%,#1e4fad 60%,#2563eb 100%), linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize:"cover, 28px 28px, 28px 28px"}}>
                      <div style={{position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.07) 1px,transparent 1px)", backgroundSize:"28px 28px"}} />
                      {mod.id === 11 && <img src="/module-mindset.png" alt="mindset" className="mindset-img" />}
                      {mod.id === 12 && <img src="/module-reseaux.png" alt="reseaux" className="reseaux-img" />}
                      {mod.id === 18 && <img src="/module-outils.png" alt="outils" className="mindset-img" />}
                      {mod.id === 13 && <img src="/module-anonyme.png" alt="anonyme" className="anonyme-img" />}
                      {mod.id === 14 && <img src="/module-niche.png" alt="niche" className="niche-img" />}
                      {mod.id === 10 && <img src="/module-intro.png" alt="intro" className="intro-img" />}
                      <div style={{position:"absolute", top:"14px", left:"18px", display:"flex", alignItems:"flex-end", gap:"10px", zIndex:999}}>
                        <span className="glow-num" style={{fontSize:"2.6rem", fontWeight:"900", color:"#ffffff", lineHeight:"1"}}>{String(modIndex + 1).padStart(2,"0")}</span>
                        <span className="glow-sub" style={{fontSize:"0.6rem", fontWeight:"800", color:"#93c5fd", letterSpacing:"5px", marginBottom:"5px"}}>MODULE</span>
                      </div>

                      


                    </div>
                  )}
                  {progression[mod.id] === 100 && (
                    <div style={{position:"absolute", bottom:"12px", left:"12px", background:"#22c55e", color:"white", fontSize:"0.75rem", fontWeight:"700", padding:"4px 10px", borderRadius:"999px", zIndex:999, pointerEvents:"none"}}>✓ Terminé</div>
                  )}
                  {!(mod.id === 1 || mod.id === 8) && (
                    <div style={{position:"absolute", top:"12px", right:"12px", width:"32px", height:"32px", borderRadius:"8px", background:"linear-gradient(135deg,#6366f1,#3b82f6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 12px rgba(99,102,241,0.6)", zIndex:3}}>
                      <span style={{color:"#fff", fontWeight:"900", fontSize:"1rem", lineHeight:1}}>N</span>
                    </div>
                  )}
                  
                  {mod.id === 10 && (
                    <div style={{position:"absolute", inset:0, overflow:"hidden", zIndex:1, pointerEvents:"none"}}>
                      {[...Array(28)].map((_,i) => {
                        const colors = ["#f472b6","#facc15","#34d399","#60a5fa","#f87171","#a78bfa","#fb923c","#ffffff"];
                        const col = colors[i % colors.length];
                        const left = (i * 37 + 5) % 95;
                        const delay = (i * 0.18) % 2.5;
                        const size = 6 + (i % 5) * 2;
                        const dur = 2 + (i % 4) * 0.4;
                        const rotate = i * 47;
                        return (
                          <div key={i} style={{position:"absolute",left:`${left}%`,top:"-10px",width:`${size}px`,height:`${size*0.5}px`,background:col,borderRadius:i%3===0?"50%":"2px",transform:`rotate(${rotate}deg)`,animation:`cFall${i%4} ${dur}s ${delay}s infinite linear`,opacity:0.9}}/>
                        );
                      })}
                      <style>{`@keyframes cFall0{0%{transform:translateY(-10px) rotate(0deg);opacity:1}100%{transform:translateY(250px) rotate(360deg);opacity:0}}@keyframes cFall1{0%{transform:translateY(-10px) rotate(45deg);opacity:1}100%{transform:translateY(250px) rotate(180deg);opacity:0}}@keyframes cFall2{0%{transform:translateY(-10px) rotate(90deg);opacity:1}100%{transform:translateY(250px) rotate(270deg);opacity:0}}@keyframes cFall3{0%{transform:translateY(-10px) rotate(20deg);opacity:1}100%{transform:translateY(250px) rotate(400deg);opacity:0}}`}</style>
                    </div>
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
