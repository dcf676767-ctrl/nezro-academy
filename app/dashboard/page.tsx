"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const MODULES = [
  { id: 1, titre: "Introduction", chapitres: 1 },
  { id: 2, titre: "Module 1 — Clip Roblox", chapitres: 3 },
  { id: 3, titre: "Module 2 — Montage", chapitres: 3 },
  { id: 4, titre: "Module 3 — IA", chapitres: 3 },
  { id: 5, titre: "Module 4 — Importation", chapitres: 3 },
  { id: 6, titre: "Module 5 — Astuces", chapitres: 3 },
  { id: 7, titre: "Module 6 — Conseils", chapitres: 3 },
];
const TOTAL_CHAPITRES = 19;

export default function Dashboard() {
  const [nom, setNom] = useState("");
  const [progressionGlobale, setProgressionGlobale] = useState(0);
  const [progressionParModule, setProgressionParModule] = useState<{[key:number]:number}>({});
  const [modulesTermines, setModulesTermines] = useState(0);
  const [chapitresFaits, setChapitresFaits] = useState(0);
  const [dernierChapitre, setDernierChapitre] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      supabase.from("profiles").select("nom").eq("id", session.user.id).single().then(({ data }) => {
        if (data) setNom(data.nom||"");
      });
      supabase.from("progression").select("*").eq("user_id", session.user.id).eq("completed", true).order("created_at", { ascending: false }).then(({ data }) => {
        if (!data) return;
        setChapitresFaits(data.length);
        setProgressionGlobale(Math.round((data.length / TOTAL_CHAPITRES) * 100));
        if (data.length > 0) setDernierChapitre(data[0]);
        const parMod: {[key:number]:number} = {};
        let termines = 0;
        MODULES.forEach(m => {
          const done = data.filter((p:any) => p.module_id === m.id).length;
          parMod[m.id] = Math.round((done / m.chapitres) * 100);
          if (done >= m.chapitres) termines++;
        });
        setProgressionParModule(parMod);
        setModulesTermines(termines);
      });
    });
  }, []);

  const prochainModule = MODULES.find(m => (progressionParModule[m.id]||0) < 100);
  const getColor = (pct: number) => pct === 100 ? "#22c55e" : pct >= 50 ? "#f97316" : pct > 0 ? "#ef4444" : "#374151";

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/dashboard" />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Dashboard</h1>
        <p className="text-gray-400 mb-8">Bienvenue {nom} — suis ta progression dans la formation</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">🎯 Progression globale</p>
            <p className="text-4xl font-bold text-blue-400 mb-3">{progressionGlobale}%</p>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div className="h-2 rounded-full transition-all" style={{width:`${progressionGlobale}%`, background: getColor(progressionGlobale)}} />
            </div>
            <p className="text-xs text-gray-500 mt-2">{chapitresFaits}/{TOTAL_CHAPITRES} chapitres terminés</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">✅ Modules terminés</p>
            <p className="text-4xl font-bold text-green-400 mb-3">{modulesTermines}/7</p>
            <div className="flex gap-1">
              {MODULES.map(m => (
                <div key={m.id} className="flex-1 h-2 rounded-full" style={{ background: getColor(progressionParModule[m.id]||0) }} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Vue d'ensemble des 7 modules</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">🚀 Prochaine étape</p>
            {prochainModule ? (
              <>
                <p className="text-lg font-bold text-white mb-1">{prochainModule.titre}</p>
                <p className="text-xs text-gray-500 mb-3">{progressionParModule[prochainModule.id]||0}% complété</p>
                <a href={`/module/${prochainModule.id}`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">Continuer →</a>
              </>
            ) : (
              <p className="text-lg font-bold text-green-400">🎉 Formation terminée !</p>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-white mb-6">📈 Progression par module</h2>
          <div className="flex flex-col gap-4">
            {MODULES.map(m => {
              const pct = progressionParModule[m.id] || 0;
              return (
                <div key={m.id}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-300 font-medium">{m.titre}</span>
                    <span className="text-gray-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: getColor(pct) }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {dernierChapitre && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-bold text-white mb-2">🕐 Dernière activité</h2>
            <p className="text-sm text-gray-400">
              Dernier chapitre terminé le {new Date(dernierChapitre.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
