"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Admin() {
  const [membres, setMembres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    console.log("Chargement des membres...");
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    console.log("Membres chargés:", data, "Erreur:", error);
    if (data) setMembres(data);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  const updateStatut = async (id: string, statut: string) => {
    console.log("Tentative update id:", id, "vers statut:", statut);
    const { data, error } = await supabase.from("profiles").update({ statut }).eq("id", id).select();
    console.log("Résultat update -> data:", data, "error:", error);
    await load();
  };
  const statutColor: any = {
    accepte: "bg-green-500/20 text-green-400 border border-green-500/30",
    en_attente: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    refuse: "bg-red-500/20 text-red-400 border border-red-500/30",
  };
  const statutLabel: any = { accepte: "✅ Accepté", en_attente: "⏳ En attente", refuse: "❌ Refusé" };
  return (
    <main className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg shadow-blue-600/30">N</div>
          <h1 className="text-3xl font-bold text-white">Panel Admin</h1>
          <p className="text-gray-400 mt-1">Nezro Academy</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-white">{membres.length}</p>
            <p className="text-gray-400 text-sm mt-1">Total membres</p>
          </div>
          <div className="bg-gray-900 border border-green-500/20 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-green-400">{membres.filter(m=>m.statut==="accepte").length}</p>
            <p className="text-gray-400 text-sm mt-1">Acceptés</p>
          </div>
          <div className="bg-gray-900 border border-yellow-500/20 rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-yellow-400">{membres.filter(m=>m.statut==="en_attente").length}</p>
            <p className="text-gray-400 text-sm mt-1">En attente</p>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-bold text-white">👥 Membres ({membres.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-400">Chargement...</div>
          ) : (
            <div className="divide-y divide-gray-800">
              {membres.map(m => (
                <div key={m.id} className="flex items-center gap-4 p-5 hover:bg-gray-800/50 transition-all">
                  <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {m.avatar_url ? <img src={m.avatar_url} className="w-11 h-11 object-cover rounded-full" alt="av" /> : <span className="text-white font-bold">{m.nom?.[0]?.toUpperCase()||"?"}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-white">{m.nom||"Sans nom"}</p>
                      {m.role==="admin" && <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">👑 Admin</span>}
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{m.email}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statutColor[m.statut]||statutColor.refuse}`}>{statutLabel[m.statut]||"Inconnu"}</span>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    {m.statut === "en_attente" && (
                      <button onClick={() => updateStatut(m.id, "accepte")}
                        className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all">
                        ✓ Accepter
                      </button>
                    )}
                    {m.statut === "accepte" && (
                      <button onClick={() => updateStatut(m.id, "en_attente")}
                        className="bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-xs font-bold px-3 py-2 rounded-xl border border-yellow-500/30 transition-all">
                        ↩ Suspendre
                      </button>
                    )}
                    {m.statut === "refuse" && (
                      <button onClick={() => updateStatut(m.id, "en_attente")}
                        className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 text-xs font-bold px-3 py-2 rounded-xl border border-blue-500/30 transition-all">
                        ↩ Réintégrer
                      </button>
                    )}
                    <button onClick={() => updateStatut(m.id, "refuse")}
                      className="bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-bold px-3 py-2 rounded-xl border border-red-500/30 transition-all">
                      🚫 Expulser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
