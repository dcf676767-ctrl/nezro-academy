"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Membres() {
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
    supabase.from("profiles").select("*").eq("statut", "accepte").then(({ data }) => {
      if (data) setMembres(data);
    });
  }, []);

  const admins = membres.filter(m => m.role === "admin");
  const logout = async () => { await supabase.auth.signOut(); window.location.replace("/auth"); };

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
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Membres</button>
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
      <section className="max-w-6xl mx-auto px-8 py-10 flex gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">👥 Les Membres</h2>
          <div className="grid grid-cols-1 gap-3">
            {membres.map((m) => (
              <div key={m.id} className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {m.avatar_url ? <img src={m.avatar_url} className="w-12 h-12 object-cover rounded-full" alt="avatar" /> : <span className="text-blue-600 font-bold text-lg">{(m.nom?.[0]||"?").toUpperCase()}</span>}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{m.nom || "Membre"}</p>
                  <p className="text-sm text-gray-400">{m.bio || ""}</p>
                </div>
              </div>
            ))}
            {membres.length === 0 && <p className="text-gray-400">Aucun membre pour l'instant.</p>}
          </div>
        </div>
        <div className="w-72 shrink-0">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-8">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3">N</div>
            <h3 className="font-bold text-gray-900 text-lg">Nezro Academy</h3>
            <p className="text-sm text-gray-500 mt-1 mb-4">La formation pour apprendre à créer et vendre en ligne.</p>
            <div className="flex gap-6 border-t border-gray-100 pt-4 mb-4">
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{membres.length}</p>
                <p className="text-xs text-gray-400">Membres</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-900">{admins.length || 1}</p>
                <p className="text-xs text-gray-400">Admins</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {membres.slice(0, 8).map(m => (
                <div key={m.id} className="w-9 h-9 rounded-full bg-blue-100 overflow-hidden flex items-center justify-center">
                  {m.avatar_url ? <img src={m.avatar_url} className="w-9 h-9 object-cover rounded-full" alt="avatar" /> : <span className="text-blue-600 font-bold text-sm">{(m.nom?.[0]||"?").toUpperCase()}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
