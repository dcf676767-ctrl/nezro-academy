"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";

const _sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const ADMIN_ID = "cc055cc7-0c49-44e4-a81b-bd3f7dc74f55";

const roadmapItems = [
  { emoji: "🎮", titre: "Module GTA 6", desc: "Créer des vidéos virales sur GTA 6 dès sa sortie.", statut: "Bientôt", couleur: "blue" },
  { emoji: "📱", titre: "Module Shorts & Reels", desc: "Maîtriser le format court pour exploser sur YouTube Shorts.", statut: "En cours", couleur: "yellow" },
  { emoji: "🤖", titre: "Module IA & YouTube", desc: "Utiliser l'IA pour créer du contenu 10x plus vite.", statut: "Prévu", couleur: "purple" },
  { emoji: "💰", titre: "Module Monétisation avancée", desc: "Sponsoring, affiliation, produits digitaux — toutes les sources de revenus.", statut: "Prévu", couleur: "green" },
];

const couleurs: any = {
  blue: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  yellow: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
  purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
  green: "bg-green-500/20 text-green-400 border border-green-500/30",
};

export default function Roadmap() {
  const router = useRouter();

  useEffect(() => {
    _sb.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push("/auth"); return; }
      _sb.from("profiles").select("statut").eq("id", session.user.id).single().then(({ data }) => {
        if (!data || data.statut !== "accepte") router.push("/bloque");
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <Sidebar active="roadmap" />
      <main className="flex-1 md:ml-64 px-6 py-8 pt-20 md:pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🗺️ Roadmap</h1>
          <p className="text-gray-400">Les prochains modules et nouveautés qui arrivent sur la plateforme.</p>
        </div>
        <div className="flex flex-col gap-4">
          {roadmapItems.map((item, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex gap-4 items-start">
              <div className="text-3xl">{item.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h2 className="font-bold text-lg">{item.titre}</h2>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${couleurs[item.couleur]}`}>{item.statut}</span>
                </div>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-sm mt-10">La roadmap est mise à jour régulièrement 🚀</p>
      </main>
    </div>
  );
}
