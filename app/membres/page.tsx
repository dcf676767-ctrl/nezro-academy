"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Membres() {
  const [membres, setMembres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    const { data } = await supabase.from("profiles").select("*").eq("statut", "accepte");
    if (!data) return;
    const now = new Date();
    const avecStatut = data.map((m:any) => ({
      ...m,
      enligne: m.last_seen ? (now.getTime() - new Date(m.last_seen).getTime()) < 5*60*1000 : false
    })).sort((a:any,b:any) => (b.enligne?1:0) - (a.enligne?1:0));
    setMembres(avecStatut);
    setLoading(false);
  };
  useEffect(() => {
    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);
  const Avatar = ({ m }: { m: any }) => (
    <div className="relative w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
      {m.avatar_url ? <img src={m.avatar_url} className="w-14 h-14 object-cover rounded-full" alt="av" /> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#9ca3af" className="w-full h-full" style={{marginTop:"4px"}}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>}
      {m.enligne && <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full" />}
    </div>
  );
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar active="/membres" />
      <main className="flex-1 ml-64 p-8">
        <h2 className="text-5xl font-bold text-white mb-3 text-center">Membres</h2>
        <p className="text-gray-400 mb-8 text-center">{membres.filter(m=>m.enligne).length} en ligne sur {membres.length}</p>
        {loading ? (
          <div className="text-center text-gray-400">Chargement...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {membres.map(m => (
              <div key={m.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex items-center gap-4">
                <Avatar m={m} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-white truncate">{m.nom||"Sans nom"}</p>
                    {m.role==="admin" && <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full flex-shrink-0">👑</span>}
                  </div>
                  <p className={`text-xs font-medium ${m.enligne?"text-green-400":"text-gray-500"}`}>
                    {m.enligne ? "🟢 En ligne" : "⚫ Hors ligne"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
