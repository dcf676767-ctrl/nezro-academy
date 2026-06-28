"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Admin() {
  const [membres, setMembres] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("profiles").select("*").then(({ data }) => { if (data) setMembres(data); });
  }, []);
  const accepter = async (id: string) => {
    await supabase.from("profiles").update({ statut: "accepte" }).eq("id", id);
    setMembres((prev) => prev.map((m) => m.id === id ? { ...m, statut: "accepte" } : m));
  };
  const refuser = async (id: string) => {
    await supabase.from("profiles").update({ statut: "refuse" }).eq("id", id);
    setMembres((prev) => prev.map((m) => m.id === id ? { ...m, statut: "refuse" } : m));
  };
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Panel Admin</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {membres.length === 0 && <p className="p-6 text-gray-400">Aucun membre.</p>}
          {membres.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <p className="font-semibold">{m.nom || "Sans nom"}</p>
                <p className="text-sm text-gray-500">{m.email}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${m.statut === "accepte" ? "bg-green-100 text-green-700" : m.statut === "refuse" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {m.statut}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => accepter(m.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm">Accepter</button>
                <button onClick={() => refuser(m.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm">Refuser</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
