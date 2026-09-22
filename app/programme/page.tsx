"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const modules = [
  { id: 10, titre: "Introduction", label: "Intro", description: "Bienvenue dans le programme.", image: "/introduction.jpg", chapitres: 1, customThumb: true },
  { id: 11, titre: "Mind-set et organisation", label: "Mindset", description: "Développe le mindset et l'organisation d'un créateur qui réussit.", image: "", chapitres: 2, customThumb: false },
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
          {modules.map(mod => (
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
                  {!mod.image ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <span style={{fontSize:"5rem", fontWeight:"900", color:"rgba(255,255,255,0.25)", lineHeight:"1"}}>?</span>
                    </div>
                  ) : mod.customThumb ? (
                    <div className="w-full h-full relative overflow-hidden">
                      {mod.id === 10 ? (<><img src="/introduction-mobile.jpg" alt={mod.titre} className="absolute inset-0 w-full h-full object-cover block md:hidden" /><img src={mod.image} alt={mod.titre} className="absolute inset-0 w-full h-full object-cover hidden md:block" /></>) : (<img src={mod.image} alt={mod.titre} className="absolute inset-0 w-full h-full object-cover" style={{objectPosition: mod.id !== 1 ? "center center" : "initial", filter: (mod as any).locked ? "grayscale(80%) brightness(0.4)" : "none"}} />)}{(mod as any).locked && <div className="absolute inset-0 flex items-center justify-center"><span style={{fontSize:"7rem", fontWeight:"900", color:"rgba(255,255,255,0.9)", textShadow:"0 4px 30px rgba(0,0,0,0.9)", lineHeight:"1"}}>?</span></div>}
                    </div>
                  ) : (
                    <div className="absolute inset-0" style={{backgroundImage:`url(${mod.image})`, backgroundSize:"cover", backgroundPosition:"center center"}} />
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
