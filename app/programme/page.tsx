"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const modules = [
  { id: 1, titre: "Module 1 — Les bases du web", description: "HTML, CSS, JavaScript : tout ce qu'il faut pour démarrer.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600", progression: 100 },
  { id: 2, titre: "Module 2 — React & Next.js", description: "Crée des applications modernes avec les meilleurs outils.", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600", progression: 0 },
  { id: 3, titre: "Module 3 — Intelligence Artificielle", description: "Intègre l'IA dans tes projets et automatise tout.", image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600", progression: 0 },
];

export default function Programme() {
  const [pret, setPret] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nom, setNom] = useState("");
  const [ripples, setRipples] = useState<{[key:number]:{x:number;y:number;id:number}[]}>({});

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      supabase.from("profiles").select("avatar_url,nom").eq("id", session.user.id).single().then(({ data }) => {
        setAvatarUrl(data?.avatar_url || "");
        setNom(data?.nom || "");
        setPret(true);
      });
    });
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, modId: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples(prev => ({ ...prev, [modId]: [...(prev[modId]||[]), {x,y,id}] }));
    setTimeout(() => setRipples(prev => ({ ...prev, [modId]: (prev[modId]||[]).filter(r => r.id !== id) })), 600);
  };

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
        <h2 className="text-2xl font-bold text-gray-900 mb-8">📚 Le Programme</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map(mod => (
            <button key={mod.id} onClick={e => handleClick(e, mod.id)} className="relative overflow-hidden bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left">
              {(ripples[mod.id]||[]).map(r => (
                <span key={r.id} className="absolute rounded-full bg-blue-400/30 pointer-events-none" style={{left:r.x-40,top:r.y-40,width:80,height:80,animation:"ripple 0.6s linear"}} />
              ))}
              <img src={mod.image} alt={mod.titre} className="w-full h-44 object-cover rounded-t-2xl" />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-base mb-1">{mod.titre}</h3>
                <p className="text-sm text-gray-500 mb-4">{mod.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width:`${mod.progression}%`}} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{mod.progression}%</p>
              </div>
            </button>
          ))}
        </div>
      </section>
      <style>{`@keyframes ripple{0%{transform:scale(0);opacity:1}100%{transform:scale(4);opacity:0}}`}</style>
    </main>
  );
}
