"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const badges = ["🚀 En formation", "⚡ Actif", "🎯 Motivé", "🔥 En progression", "💪 Déterminé", "⭐ Engagé"];

export default function Membres() {
  const [membres, setMembres] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [moiId, setMoiId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setMoiId(session.user.id);
    });
    supabase.from("profiles").select("*").eq("statut", "accepte").then(({ data }) => {
      if (!data) return;
      const avecBadge = data.map((m: any, i: number) => ({ ...m, badge: badges[i % badges.length] }));
      setAdmins(avecBadge.filter((m: any) => m.role === "admin"));
      setMembres(avecBadge.filter((m: any) => m.role !== "admin"));
      setLoading(false);
    });
  }, []);

  const Avatar = ({ m, size = "w-14 h-14" }: { m: any, size?: string }) => (
    <div className={`relative ${size} rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0`}>
      {m.avatar_url ? <img src={m.avatar_url} className={`${size} object-cover rounded-full`} alt="av" /> : 
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-full h-full" style={{marginTop:"4px"}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>}
      {m.id === moiId && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full" />}
    </div>
  );

  const enLigne = moiId ? [...admins, ...membres].filter(m => m.id === moiId) : [];

  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/membres" />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto flex gap-8">
          <div className="flex-1">
            <h2 className="text-5xl font-bold text-white mb-3 text-center">👥 Membres</h2>
            <p className="text-gray-400 mb-8 text-center">{membres.length + admins.length} membres dans la communauté</p>
            {loading ? <div className="text-center text-gray-400">Chargement...</div> : (
              <div className="flex flex-col gap-4">
                {membres.map((m, i) => (
                  <div key={m.id} className={`bg-gray-900 border rounded-2xl p-5 flex items-center gap-4 transition-all ${m.id === moiId ? "border-blue-500/40" : "border-gray-800"}`}>
                    <Avatar m={m} />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-lg mb-1">{m.nom || "Sans nom"}</p>
                      <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-1 rounded-full">{m.badge}</span>
                    </div>
                    <span className="text-gray-500 text-sm flex-shrink-0">#{i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-72 flex flex-col gap-4 flex-shrink-0 mt-24">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="font-bold text-white mb-4">👑 Administration</p>
              {admins.map(a => (
                <div key={a.id} className="flex items-center gap-3 mb-2">
                  <Avatar m={a} size="w-10 h-10" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{a.nom || "Admin"}</p>
                  </div>
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">👑 Admin</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <p className="font-bold text-white mb-3">🟢 En ligne ({enLigne.length})</p>
              {enLigne.length === 0 ? <p className="text-gray-500 text-sm">Personne en ligne</p> : (
                <div className="flex flex-col gap-2">
                  {enLigne.map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      <Avatar m={m} size="w-8 h-8" />
                      <p className="text-sm text-white truncate">{m.nom || "Sans nom"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}