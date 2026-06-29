"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Sidebar({ active }: { active: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [nom, setNom] = useState("");
  const [stats, setStats] = useState({ membres: 0, admins: 0, enligne: 0, avatars: [] as string[] });
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      supabase.from("profiles").select("avatar_url,nom").eq("id", session.user.id).single().then(({ data }) => {
        setAvatarUrl(data?.avatar_url || "");
        setNom(data?.nom || "");
      });
      supabase.from("profiles").upsert({ id: session.user.id, last_seen: new Date().toISOString() }, { onConflict: "id" });
    });
    supabase.from("profiles").select("avatar_url,role,statut,last_seen").then(({ data }) => {
      if (!data) return;
      const membres = data.filter((p:any) => p.statut === "accepte");
      const admins = data.filter((p:any) => p.role === "admin").length;
      const now = new Date();
      const enligne = membres.filter((p:any) => p.last_seen && (now.getTime() - new Date(p.last_seen).getTime()) < 5*60*1000).length;
      const avatars = membres.slice(0,4).map((p:any) => p.avatar_url || "");
      setStats({ membres: membres.length, admins, enligne, avatars });
    });
  }, []);
  const logout = async () => { await supabase.auth.signOut(); window.location.replace("/auth"); };
  const links = [
    { href: "/programme", label: "Programme", emoji: "📚" },
    { href: "/membres", label: "Membres", emoji: "👥" },
    { href: "/ressources", label: "Ressources", emoji: "🛠️" },
    { href: "/classement", label: "Classement", emoji: "🏆" },
  ];
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-40">
      <div className="p-5 border-b border-gray-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <h1 className="text-base font-bold text-white">Nezro Academy</h1>
      </div>
      <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 px-3">Principal</p>
        {links.map(l => (
          <button key={l.href} onClick={() => window.location.href=l.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active===l.href ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
            {l.emoji} {l.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800 flex flex-col gap-3">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-4">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">La communauté</p>
          <div className="flex gap-1 mb-3">
            {stats.avatars.map((av,i) => (
              <div key={i} className="w-7 h-7 rounded-full bg-blue-600 border-2 border-gray-800 flex items-center justify-center overflow-hidden -ml-1 first:ml-0">
                {av ? <img src={av} className="w-7 h-7 object-cover rounded-full" alt="m" /> : <span className="text-white text-xs font-bold">?</span>}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-center">
            <div>
              <p className="text-lg font-bold text-white">{stats.membres}</p>
              <p className="text-xs text-gray-400">Membres</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-400">{stats.enligne}</p>
              <p className="text-xs text-gray-400">En ligne</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-400">{stats.admins}</p>
              <p className="text-xs text-gray-400">Admins</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
            {avatarUrl ? <img src={avatarUrl} className="w-9 h-9 object-cover rounded-full" alt="avatar" /> : <span className="text-white font-bold text-sm">{nom?.[0]?.toUpperCase()||"?"}</span>}
          </div>
          <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-white truncate">{nom||"Membre"}</p></div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-400 hover:text-white">⚙️</button>
        </div>
        {menuOpen && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            <button onClick={() => window.location.href="/profil"} className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700">👤 Mon profil</button>
            <button onClick={logout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-700">🚪 Se déconnecter</button>
          </div>
        )}
      </div>
    </aside>
  );
}
