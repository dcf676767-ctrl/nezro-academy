"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Membres() {
  const [membres, setMembres] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [enligne, setEnligne] = useState<string[]>([]);
  useEffect(() => {
    supabase.from("profiles").select("*").eq("statut","accepte").then(({ data }) => {
      if (!data) return;
      const now = new Date();
      setAdmins(data.filter((p:any) => p.role === "admin"));
      setMembres(data.filter((p:any) => p.role !== "admin"));
      setEnligne(data.filter((p:any) => p.last_seen && (now.getTime() - new Date(p.last_seen).getTime()) < 5*60*1000).map((p:any) => p.id));
    });
  }, []);
  const badges = ["🚀 En formation","⚡ Actif","🎯 Motivé","🔥 En progression","💪 Déterminé"];
  const MemberCard = ({ m, i }: { m: any, i: number }) => (
    <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-blue-500 transition-all">
      <div className="relative">
        <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
          {m.avatar_url ? <img src={m.avatar_url} className="w-11 h-11 object-cover rounded-full" alt="avatar" /> : <span className="text-white font-bold">{m.nom?.[0]?.toUpperCase()||"?"}</span>}
        </div>
        {enligne.includes(m.id) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-white mb-1">{m.nom || "Membre"}</p>
        <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">{badges[i % badges.length]}</span>
      </div>
      <div className="text-xs text-gray-500">#{i+1}</div>
    </div>
  );
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/membres" />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-3xl font-bold text-white mb-1">👥 Membres</h2>
        <p className="text-gray-400 mb-8">{membres.length + admins.length} membres dans la communauté</p>
        <div className="flex gap-6 items-start">
          <div className="flex-1 flex flex-col gap-3">
            {membres.map((m,i) => <MemberCard key={m.id} m={m} i={i} />)}
          </div>
          <div className="w-72 shrink-0 flex flex-col gap-4">
            <div className="bg-gray-900 border border-yellow-500/40 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">👑 Administration</h3>
              <div className="flex flex-col gap-3">
                {admins.map((m) => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-full bg-yellow-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {m.avatar_url ? <img src={m.avatar_url} className="w-11 h-11 object-cover rounded-full" alt="avatar" /> : <span className="text-white font-bold">{m.nom?.[0]?.toUpperCase()||"?"}</span>}
                      </div>
                      {enligne.includes(m.id) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{m.nom}</p>
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">👑 Admin</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">🟢 En ligne ({enligne.length})</h3>
              <div className="flex flex-col gap-3">
                {[...admins,...membres].filter(m => enligne.includes(m.id)).map(m => (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
                        {m.avatar_url ? <img src={m.avatar_url} className="w-9 h-9 object-cover rounded-full" alt="av" /> : <span className="text-white font-bold text-sm">{m.nom?.[0]?.toUpperCase()||"?"}</span>}
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-gray-900" />
                    </div>
                    <p className="text-sm text-white">{m.nom}</p>
                  </div>
                ))}
                {enligne.length === 0 && <p className="text-xs text-gray-500">Personne en ligne pour l'instant</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
