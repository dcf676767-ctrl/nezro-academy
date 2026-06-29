"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Admin() {
  const router = useRouter();
  const [membres, setMembres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autorise, setAutorise] = useState(false);
  const [recherche, setRecherche] = useState("");
  const [filtre, setFiltre] = useState("tous");

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      const { data } = await supabase.from("profiles").select("role,email").eq("id", session.user.id).single();
      if (!data || data.email !== "dcf676767@gmail.com") { router.push("/programme"); return; }
      setAutorise(true);
      chargerMembres();
    });
  }, []);

  const chargerMembres = async () => {
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setMembres(data);
    setLoading(false);
  };

  const changerStatut = async (id: string, statut: string) => {
    await supabase.from("profiles").update({ statut }).eq("id", id);
    setMembres(prev => prev.map(m => m.id === id ? { ...m, statut } : m));
  };

  const bannir = async (id: string, nom: string) => {
    if (!confirm(`⛔ Bannir ${nom || "ce membre"} ? Il ne pourra plus accéder au site.`)) return;
    await supabase.from("profiles").update({ statut: "banni" }).eq("id", id);
    setMembres(prev => prev.map(m => m.id === id ? { ...m, statut: "banni" } : m));
  };

  const supprimer = async (id: string, nom: string) => {
    if (!confirm(`🗑️ Supprimer définitivement ${nom || "ce membre"} ?`)) return;
    await supabase.from("profiles").delete().eq("id", id);
    setMembres(prev => prev.filter(m => m.id !== id));
  };

  const filtres = ["tous", "accepte", "en_attente", "refuse", "banni"];
  const membresFiltres = membres.filter(m => {
    const matchRecherche = (m.nom || "").toLowerCase().includes(recherche.toLowerCase()) || (m.email || "").toLowerCase().includes(recherche.toLowerCase());
    const matchFiltre = filtre === "tous" || m.statut === filtre;
    return matchRecherche && matchFiltre;
  });

  const badgeStatut = (s: string) => {
    const map: any = {
      accepte: "bg-green-500/20 text-green-400",
      en_attente: "bg-yellow-500/20 text-yellow-400",
      refuse: "bg-red-500/20 text-red-400",
      banni: "bg-purple-500/20 text-purple-400",
    };
    const labels: any = { accepte: "✅ Accepté", en_attente: "⏳ En attente", refuse: "❌ Refusé", banni: "⛔ Banni" };
    return <span className={`text-xs font-semibold px-2 py-1 rounded-full ${map[s] || "bg-gray-500/20 text-gray-400"}`}>{labels[s] || s}</span>;
  };

  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Vérification...</div>;
  if (!autorise) return null;

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/admin" />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">👑 Panel Admin</h1>
        <p className="text-gray-400 mb-6">Nezro Academy — {membres.length} membres au total</p>

        {/* Stats rapides */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total", val: membres.length, color: "text-white", bg: "bg-gray-800" },
            { label: "Acceptés", val: membres.filter(m => m.statut === "accepte").length, color: "text-green-400", bg: "bg-green-500/10" },
            { label: "En attente", val: membres.filter(m => m.statut === "en_attente" || !m.statut).length, color: "text-yellow-400", bg: "bg-yellow-500/10" },
            { label: "Bannis", val: membres.filter(m => m.statut === "banni").length, color: "text-purple-400", bg: "bg-purple-500/10" },
          ].map((s, i) => (
            <div key={i} className={`${s.bg} border border-gray-800 rounded-2xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Barre de recherche + filtres */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <input value={recherche} onChange={e => setRecherche(e.target.value)} placeholder="🔍 Rechercher un membre..." className="flex-1 min-w-48 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500" />
          <div className="flex gap-2 flex-wrap">
            {filtres.map(f => (
              <button key={f} onClick={() => setFiltre(f)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${filtre === f ? "bg-blue-600 text-white" : "bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"}`}>
                {f === "tous" ? "Tous" : f === "accepte" ? "✅ Acceptés" : f === "en_attente" ? "⏳ Attente" : f === "refuse" ? "❌ Refusés" : "⛔ Bannis"}
              </button>
            ))}
          </div>
        </div>

        {/* Liste membres */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-bold text-white">👥 Membres ({membresFiltres.length})</h2>
          </div>
          {membresFiltres.length === 0 && <p className="p-6 text-gray-400 text-center">Aucun membre trouvé.</p>}
          {membresFiltres.map((m) => (
            <div key={m.id} className={`flex items-center justify-between p-4 border-b border-gray-800 hover:bg-gray-800/30 transition-colors ${m.statut === "banni" ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {m.avatar_url ? <img src={m.avatar_url} className="w-10 h-10 object-cover rounded-full" alt="" /> : <span className="text-white text-sm font-bold">{(m.nom || "?")[0].toUpperCase()}</span>}
                </div>
                <div>
                  <p className="font-semibold text-white">{m.nom || "Sans nom"}</p>
                  <p className="text-xs text-gray-400">{m.email}</p>
                  <div className="mt-1">{badgeStatut(m.statut || "en_attente")}</div>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {m.statut !== "accepte" && <button onClick={() => changerStatut(m.id, "accepte")} className="bg-green-500/20 hover:bg-green-500/40 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">✅ Accepter</button>}
                {m.statut !== "refuse" && m.statut !== "banni" && <button onClick={() => changerStatut(m.id, "refuse")} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">❌ Refuser</button>}
                {m.statut !== "banni" && m.email !== "dcf676767@gmail.com" && <button onClick={() => bannir(m.id, m.nom)} className="bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">⛔ Bannir</button>}
                {m.statut === "banni" && <button onClick={() => changerStatut(m.id, "accepte")} className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">🔓 Débannir</button>}
                {m.email !== "dcf676767@gmail.com" && <button onClick={() => supprimer(m.id, m.nom)} className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">🗑️</button>}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
