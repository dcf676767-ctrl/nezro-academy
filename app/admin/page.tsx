"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Admin() {
  const [membres, setMembres] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (data) setMembres(data);
    });
  }, []);

  const updateStatut = async (id: string, statut: string) => {
    await supabase.from("profiles").update({ statut }).eq("id", id);
    setMembres((prev) => prev.map((m) => m.id === id ? { ...m, statut } : m));
  };

  const badgeColor = (statut: string) => {
    if (statut === "accepte") return "bg-green-100 text-green-700";
    if (statut === "refuse") return "bg-red-100 text-red-700";
    if (statut === "expulse") return "bg-gray-100 text-gray-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const badgeLabel = (statut: string) => {
    if (statut === "accepte") return "✅ Accepté";
    if (statut === "refuse") return "❌ Refusé";
    if (statut === "expulse") return "🚫 Expulsé";
    return "⏳ En attente";
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">N</div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Admin — Nezro Academy</h1>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">👥 Membres ({membres.length})</h2>
          </div>
          {membres.length === 0 && <p className="p-6 text-gray-400">Aucun membre pour l'instant.</p>}
          {membres.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50">
              <div>
                <p className="font-semibold text-gray-900">{m.nom || "Sans nom"}</p>
                <p className="text-sm text-gray-500">{m.email}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block ${badgeColor(m.statut)}`}>
                  {badgeLabel(m.statut)}
                </span>
              </div>
              <div className="flex gap-2">
                {m.statut !== "accepte" && (
                  <button onClick={() => updateStatut(m.id, "accepte")} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600">✅ Accepter</button>
                )}
                {m.statut !== "refuse" && m.statut !== "expulse" && (
                  <button onClick={() => updateStatut(m.id, "refuse")} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">❌ Refuser</button>
                )}
                {m.statut === "accepte" && (
                  <button onClick={() => updateStatut(m.id, "expulse")} className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900">🚫 Expulser</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
