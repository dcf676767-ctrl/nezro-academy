"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Classement() {
  const [membres, setMembres] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nom, setNom] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      supabase.from("profiles").select("avatar_url,nom").eq("id", session.user.id).single().then(({ data }) => {
        setAvatarUrl(data?.avatar_url || "");
        setNom(data?.nom || "");
      });
    });
    supabase.from("profiles").select("*").eq("statut", "accepte").then(async ({ data: membresData }) => {
      if (!membresData) return;
      const { data: progData } = await supabase.from("progression").select("*").eq("completed", true);
      const totalChapitres = 19;
      const membresAvecProg = membresData.map(m => {
        const completed = progData?.filter(p => p.user_id === m.id).length || 0;
        return { ...m, progression: Math.round((completed / totalChapitres) * 100) };
      }).sort((a, b) => b.progression - a.progression);
      setMembres(membresAvecProg);
    });
  }, []);

  const logout = async () => { await supabase.auth.signOut(); window.location.replace("/auth"); };
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">N</div>
            <span className="font-bold text-lg text-gray-900">Nezro Academy</span>
          </div>
          <nav className="flex gap-1">
            <button onClick={() => window.location.href="/programme"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Programme</button>
            <button onClick={() => window.location.href="/membres"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Membres</button>
            <button onClick={() => window.location.href="/ressources"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Ressources</button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Classement</button>
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
      <section className="max-w-2xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">🏆 Classement</h2>
        <div className="flex flex-col gap-3">
          {membres.map((m, i) => (
            <div key={m.id} className={`flex items-center gap-4 bg-white border rounded-2xl p-4 ${i === 0 ? "border-yellow-300 shadow-md" : "border-gray-200"}`}>
              <span className="text-2xl w-8 text-center">{medals[i] || <span className="text-gray-400 font-bold">{i+1}</span>}</span>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                {m.avatar_url ? <img src={m.avatar_url} className="w-10 h-10 object-cover rounded-full" alt="avatar" /> : <span className="text-blue-600 font-bold">{(m.nom?.[0]||"?").toUpperCase()}</span>}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{m.nom || "Membre"}</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{width:`${m.progression}%`}} />
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-blue-600">{m.progression}%</p>
                <p className="text-xs text-gray-400">progression</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
