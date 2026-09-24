"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const modules = [
  { id: 10, titre: "Introduction", label: "Intro", description: "Bienvenue dans le programme.", image: "/introduction.jpg", chapitres: 1, customThumb: true },
  { id: 11, titre: "Mind-set et organisation", label: "Mindset", description: "Développe le mindset et l'organisation d'un créateur qui réussit.", image: "/module-mindset.jpg", chapitres: 2, customThumb: true },
  { id: 12, titre: "Comprendre les réseaux et comment être monétisé", label: "Réseaux", description: "Comprends les réseaux sociaux et les critères de monétisation.", image: "", chapitres: 3, customThumb: false },
  { id: 13, titre: "Contenu 100% anonyme", label: "Anonyme", description: "Apprends à créer du contenu sans montrer ton visage ni ta voix.", image: "", chapitres: 9, customThumb: false },
  { id: 18, titre: "Outils pour faire plus d'argent et être plus productif", label: "Outils", description: "Les meilleurs outils pour être plus productif et rentable.", image: "", chapitres: 1, customThumb: false },
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
            <button key={mod.id} id={`module-${mod.id}`} onClick={(e) => { if ((mod as any).locked) return; handleClick(e, mod.id); }}
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
                      <div style={{position:"absolute", top:"14px", left:"18px", display:"flex", alignItems:"flex-end", gap:"10px", zIndex:2}}>
                        <span className="glow-num" style={{fontSize:"2.6rem", fontWeight:"900", color:"#ffffff", lineHeight:"1"}}>{String(modIndex + 1).padStart(2,"0")}</span>
                        <span className="glow-sub" style={{fontSize:"0.6rem", fontWeight:"800", color:"#93c5fd", letterSpacing:"5px", marginBottom:"5px"}}>MODULE</span>
                      </div>
                      <svg style={{position:"absolute", top:"-10px", right:"-10px", width:"110px", height:"110px", opacity: 0}} viewBox="0 0 100 100">
                        {mod.id === 10 ? <path d="M50 20 L80 80 L20 80 Z" fill="white"/> :
                         mod.id === 11 ? <g>
                           <defs>
                             <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
                               <stop offset="0%" stopColor="#60a5fa"/>
                               <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                             </radialGradient>
                             <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                               <stop offset="0%" stopColor="#93c5fd"/>
                               <stop offset="50%" stopColor="#3b82f6"/>
                               <stop offset="100%" stopColor="#1d4ed8"/>
                             </linearGradient>
                           </defs>
                           <ellipse cx="50" cy="52" rx="45" ry="30" fill="url(#brainGlow)" opacity="0.5"/>
                           <path d="M50 22 C38 22 28 30 26 40 C22 42 18 46 18 52 C18 60 25 66 34 66 C36 70 40 73 44 73 L56 73 C60 73 64 70 66 66 C75 66 82 60 82 52 C82 46 78 42 74 40 C72 30 62 22 50 22Z" fill="url(#brainGrad)" stroke="#93c5fd" strokeWidth="1.5"/>
                           <path d="M50 22 C50 22 50 45 50 73" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0.6"/>
                           <path d="M30 38 C34 42 34 50 30 54" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                           <path d="M70 38 C66 42 66 50 70 54" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                           <path d="M36 30 C40 26 45 25 50 25" fill="none" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                           <path d="M64 30 C60 26 55 25 50 25" fill="none" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round" opacity="0.8"/>
                         </g> :
                         mod.id === 12 ? <rect x="25" y="15" width="50" height="70" rx="8" fill="white"/> :
                         mod.id === 13 ? <path d="M50 10 C30 10 15 25 15 45 C15 65 30 75 50 90 C70 75 85 65 85 45 C85 25 70 10 50 10Z" fill="white"/> :
                         mod.id === 14 ? <circle cx="50" cy="50" r="35" fill="none" stroke="white" strokeWidth="8"/> :
                         mod.id === 15 ? <path d="M50 15 L60 40 L85 40 L65 57 L73 82 L50 67 L27 82 L35 57 L15 40 L40 40Z" fill="white"/> :
                         mod.id === 16 ? <path d="M20 30 L50 70 L80 30" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round"/> :
                         mod.id === 17 ? <path d="M20 50 L45 75 L80 25" fill="none" stroke="white" strokeWidth="10" strokeLinecap="round"/> :
                         mod.id === 18 ? <rect x="20" y="20" width="60" height="60" rx="6" fill="white"/> :
                         mod.id === 19 ? <path d="M50 15 C30 15 15 30 15 50 C15 70 30 85 50 85 C70 85 85 70 85 50 C85 30 70 15 50 15ZM50 30 L50 55 M50 65 L50 70" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"/> :
                         mod.id === 20 ? <path d="M15 70 L35 45 L55 55 L85 20" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"/> :
                         mod.id === 21 ? <path d="M55 15 L25 55 L50 55 L45 85 L75 45 L50 45Z" fill="white"/> :
                         mod.id === 22 ? <rect x="15" y="30" width="70" height="45" rx="6" fill="white"/> :
                         mod.id === 23 ? <rect x="15" y="20" width="70" height="50" rx="4" fill="white"/> :
                         mod.id === 24 ? <path d="M35 25 L75 50 L35 75Z" fill="white"/> :
                         mod.id === 25 ? <><circle cx="42" cy="42" r="25" fill="none" stroke="white" strokeWidth="8"/><path d="M60 60 L80 80" stroke="white" strokeWidth="8" strokeLinecap="round"/></> :
                         <circle cx="50" cy="50" r="30" fill="white"/>}
                      </svg>


                    </div>
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
