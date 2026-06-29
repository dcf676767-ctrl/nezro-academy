"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const ressources = [
  { id: 1, titre: "Preset Lightroom", description: "Le preset que j'utilise dans toutes mes vidéos.", emoji: "🎨", lien: "#" },
  { id: 2, titre: "Template Miniature", description: "Template Photoshop pour tes miniatures YouTube.", emoji: "🖼️", lien: "#" },
  { id: 3, titre: "Guide Algorithme YouTube", description: "Tout ce que tu dois savoir sur l'algorithme.", emoji: "📈", lien: "#" },
  { id: 4, titre: "Pack Musiques Libres", description: "Les musiques que j'utilise dans mes vidéos.", emoji: "🎵", lien: "#" },
  { id: 5, titre: "Checklist Vidéo", description: "La checklist complète avant de publier une vidéo.", emoji: "✅", lien: "#" },
];

export default function Ressources() {
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
  }, []);

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
            <button onClick={() => window.location.href="/membres"} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">Membres</button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white">Ressources</button>
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
      <section className="max-w-4xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">🛠️ Ressources</h2>
        <div className="grid grid-cols-1 gap-4">
          {ressources.map(r => (
            <div key={r.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{r.emoji}</span>
                <div>
                  <h3 className="font-bold text-gray-900">{r.titre}</h3>
                  <p className="text-sm text-gray-500">{r.description}</p>
                </div>
              </div>
              <a href={r.lien} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all">Télécharger</a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
