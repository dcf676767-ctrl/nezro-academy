"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Admin() {
  const router = useRouter();
  const [membres, setMembres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autorise, setAutorise] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      const { data } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
      if (!data || data.role !== "admin") { router.push("/programme"); return; }
      setAutorise(true);
      supabase.from("profiles").select("*").then(({ data }) => {
        if (data) setMembres(data);
        setLoading(false);
      });
    });
  }, []);

  const accepter = async (id: string) => {
    await supabase.from("profiles").update({ statut: "accepte" }).eq("id", id);
    setMembres((prev) => prev.map((m) => m.id === id ? { ...m, statut: "accepte" } : m));
  };

  const refuser = async (id: string) => {
    await supabase.from("profiles").update({ statut: "refuse" }).eq("id", id);
    setMembres((prev) => prev.map((m) => m.id === id ? { ...m, statut: "refuse" } : m));
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Vérification...</div>;
  if (!autorise) return null;

  return (
    <main className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">N</div>
          <h1 className="text-2xl font-bold text-white">👑 Panel Admin — Nezro Academy</h1>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="font-bold text-white">👥 Membres ({membres.length})</h2>
          </div>
          {membres.length === 0 && <p className="p-6 text-gray-400">Aucun membre.</p>}
          {membres.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-4 border-b border-gray-800 hover:bg-gray-800/50">
              <div>
                <p className="font-semibold text-white">{m.nom || "Sans nom"}</p>
                <p className="text-sm text-gray-400">{m.email}</p>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block ${
                  m.statut === "accepte" ? "bg-green-500/20 text-green-400" :
                  m.statut === "refuse" ? "bg-red-500/20 text-red-400" :
                  "bg-yellow-500/20 text-yellow-400"
                }`}>
                  {m.statut === "accepte" ? "✅ Accepté" : m.statut === "refuse" ? "❌ Refusé" : "⏳ En attente"}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => accepter(m.id)} className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600">Accepter</button>
                <button onClick={() => refuser(m.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">Refuser</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
