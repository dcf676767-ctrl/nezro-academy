"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nom, setNom] = useState("");
  const [progression, setProgression] = useState<{[key:number]:number}>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      supabase.from("profiles").select("avatar_url,nom").eq("id", session.user.id).single().then(({ data }) => {
        setAvatarUrl(data?.avatar_url || "");
        setNom(data?.nom || "");
        setPret(true);
      });
      supabase.from("progression").select("*").eq("user_id", session.user.id).then(({ data }) => {
        if (!data) return;
        const prog: {[key:number]:number} = {};
        modules.forEach(m => {
          const completed = data.filter(p => p.module_id === m.id && p.completed).length;
          prog[m.id] = Math.round((completed / m.chapitres) * 100);
        });
        setProgression(prog);
      });
    });
  }, []);

  const logout = async () => { await supabase.auth.signOut(); window.location.replace("/auth"); };

  if (!pret) return <main className="min-h-screen bg-white flex items-center justify-center"><p className="text-gray-400">Chargement...</p></main>;

  return (
    <main className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">N</div>
            <span className="font-bold text-lg text-gray-900">Nezro Academy</span>
          </div>
          <nav className="flex gap-1">
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Programme</button>
            <button onClick={() => window.location.href="/membres"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Membres</button>
            <button onClick={() => window.location.href="/ressources"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Ressources</button>
            <button onClick={() => window.location.href="/classement"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Classement</button>
          </nav>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border-2 border-blue-300">
            {avatarUrl ? <img src={avatarUrl} className="w-10 h-10 object-cover rounded-full" alt="avatar" /> : <span className="text-blue-600 font-bold">{nom?.[0]?.toUpperCase()||"?"}</span>}
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
              <button onClick={() => window.location.href="/profil"} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-t-xl font-medium">👤 Mon profil</button>
              <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-b-xl font-medium">🚪 Se déconnecter</button>
            </div>
          )}
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📚 Programme YMA</h2>
        <p className="text-gray-500 mb-8">YouTube Money Academy</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map(mod => (
            <button key={mod.id} onClick={() => window.location.href=`/module/${mod.id}`}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-left overflow-hidden">
              <img src={mod.image} alt={mod.titre} className="w-full h-44 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-base mb-1">{mod.titre}</h3>
                <p className="text-sm text-gray-500 mb-3">{mod.description}</p>
                <p className="text-xs text-gray-400 mb-2">{mod.chapitres} chapitre{mod.chapitres > 1 ? "s" : ""}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full transition-all" style={{width:`${progression[mod.id]||0}%`}} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{progression[mod.id]||0}%</p>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
