"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Sidebar from "../components/Sidebar";
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
const TOTAL_CHAPITRES = 19;
export default function Dashboard() {
  const [userId, setUserId] = useState("");
  const [nom, setNom] = useState("");
  const [progression, setProgression] = useState(0);
  const [modulesTermines, setModulesTermines] = useState(0);
  const [stats, setStats] = useState({ abonnes: 0, vues: 0, videos: 0 });
  const [form, setForm] = useState({ abonnes: "", vues: "", videos: "" });
  const [saved, setSaved] = useState(false);
  const [historique, setHistorique] = useState<any[]>([]);
  const modules = [
    { id: 1, chapitres: 1 }, { id: 2, chapitres: 3 }, { id: 3, chapitres: 3 },
    { id: 4, chapitres: 3 }, { id: 5, chapitres: 3 }, { id: 6, chapitres: 3 }, { id: 7, chapitres: 3 },
  ];
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      supabase.from("profiles").select("nom").eq("id", session.user.id).single().then(({ data }) => {
        if (data) setNom(data.nom||"");
      });
      supabase.from("progression").select("*").eq("user_id", session.user.id).eq("completed", true).then(({ data }) => {
        if (!data) return;
        const prog = Math.round((data.length / TOTAL_CHAPITRES) * 100);
        setProgression(prog);
        let termines = 0;
        modules.forEach(m => { if (data.filter((p:any) => p.module_id === m.id).length >= m.chapitres) termines++; });
        setModulesTermines(termines);
      });
      supabase.from("stats_youtube").select("*").eq("user_id", session.user.id).order("date", { ascending: false }).then(({ data }) => {
        if (data && data.length > 0) {
          setStats({ abonnes: data[0].abonnes, vues: data[0].vues, videos: data[0].videos });
          setHistorique(data.slice(0,8).reverse());
        }
      });
    });
  }, []);
  const sauvegarder = async () => {
    const today = new Date().toISOString().split("T")[0];
    await supabase.from("stats_youtube").upsert({
      user_id: userId,
      abonnes: parseInt(form.abonnes)||stats.abonnes,
      vues: parseInt(form.vues)||stats.vues,
      videos: parseInt(form.videos)||stats.videos,
      date: today,
    }, { onConflict: "user_id,date" });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    setForm({ abonnes: "", vues: "", videos: "" });
  };
  const maxAbonnes = Math.max(...historique.map(h => h.abonnes), 1);
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/dashboard" />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold text-white mb-2">📊 Dashboard</h1>
        <p className="text-gray-400 mb-8">Bienvenue {nom} — suis ta progression</p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-2">🎓 Progression formation</p>
            <p className="text-4xl font-bold text-blue-400 mb-3">{progression}%</p>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{width:`${progression}%`}} />
            </div>
            <p className="text-xs text-gray-500">{modulesTermines}/7 modules terminés</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <p className="text-sm text-gray-400 mb-4">📈 Mes stats YouTube</p>
            <div className="flex justify-between">
              <div className="text-center"><p className="text-2xl font-bold text-blue-400">{stats.abonnes.toLocaleString()}</p><p className="text-xs text-gray-400">Abonnés</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-purple-400">{stats.vues.toLocaleString()}</p><p className="text-xs text-gray-400">Vues</p></div>
              <div className="text-center"><p className="text-2xl font-bold text-green-400">{stats.videos}</p><p className="text-xs text-gray-400">Vidéos</p></div>
            </div>
          </div>
        </div>
        {historique.length > 1 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8">
            <h2 className="font-bold text-white mb-6">📈 Évolution abonnés</h2>
            <div className="flex items-end gap-3 h-32">
              {historique.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <p className="text-xs text-gray-400">{h.abonnes}</p>
                  <div className="w-full bg-blue-500 rounded-t-lg" style={{height:`${Math.max((h.abonnes/maxAbonnes)*100, 4)}px`}} />
                  <p className="text-xs text-gray-500">{new Date(h.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-bold text-white mb-2">✏️ Mettre à jour mes stats</h2>
          <p className="text-sm text-gray-400 mb-4">Entre tes stats depuis YouTube Studio</p>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[{label:"Abonnés",key:"abonnes"},{label:"Vues",key:"vues"},{label:"Vidéos",key:"videos"}].map(f => (
              <div key={f.key}>
                <label className="text-sm text-gray-400 mb-1 block">{f.label}</label>
                <input type="number" value={form[f.key as keyof typeof form]} onChange={e => setForm(prev => ({...prev,[f.key]:e.target.value}))}
                  placeholder={stats[f.key as keyof typeof stats].toString()}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500" />
              </div>
            ))}
          </div>
          <button onClick={sauvegarder} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            {saved ? "✅ Sauvegardé !" : "💾 Sauvegarder"}
          </button>
        </div>
      </main>
    </div>
  );
}
