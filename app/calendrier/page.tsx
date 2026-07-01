"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Sidebar from "../components/Sidebar";
const MOIS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const JOURS = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const TYPES: any = {
  event: { label: "Événement", emoji: "📌", color: "bg-blue-500" },
  live: { label: "Live coaching", emoji: "🔴", color: "bg-red-500" },
  deadline: { label: "Deadline", emoji: "⏰", color: "bg-orange-500" },
  ressource: { label: "Nouvelle ressource", emoji: "🎁", color: "bg-green-500" },
};

export default function Calendrier() {
  const [date, setDate] = useState(new Date());
  const [evenements, setEvenements] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titre: "", description: "", heure: "", type: "event" });
  const [userId, setUserId] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { window.location.replace("/auth"); return; }
      setUserId(session.user.id);
      supabase.from("profiles").select("role").eq("id", session.user.id).single().then(({ data }) => {
        setIsAdmin(data?.role === "admin");
      });
    });
    chargerEvenements();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from("calendrier_vu").upsert({ user_id: session.user.id, derniere_visite: new Date().toISOString() }, { onConflict: "user_id" }).then(() => {
          sessionStorage.setItem("badge_calendrier", "0");
          window.dispatchEvent(new Event("badge_calendrier_update"));
        });
      }
    });
  }, []);

  const chargerEvenements = async () => {
    const { data } = await supabase.from("evenements").select("*").order("date", { ascending: true });
    if (data) setEvenements(data);
  };

  const annee = date.getFullYear();
  const moisIdx = date.getMonth();
  const premierJour = new Date(annee, moisIdx, 1);
  const dernierJour = new Date(annee, moisIdx + 1, 0);
  const joursDansMois = dernierJour.getDate();
  let decalage = premierJour.getDay() - 1;
  if (decalage < 0) decalage = 6;

  const cases: (number|null)[] = [];
  for (let i = 0; i < decalage; i++) cases.push(null);
  for (let d = 1; d <= joursDansMois; d++) cases.push(d);

  const formatDate = (d: number) => `${annee}-${String(moisIdx+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const todayStr = new Date().toISOString().split("T")[0];

  const evenementsDuJour = (d: number) => evenements.filter(e => e.date === formatDate(d));

  const changerMois = (delta: number) => {
    setDate(new Date(annee, moisIdx + delta, 1));
    setSelectedDay(null);
  };

  const ouvrirJour = (d: number) => {
    setSelectedDay(formatDate(d));
    setShowForm(false);
  };

  const creerEvenement = async () => {
    if (!form.titre.trim() || !selectedDay) return;
    await supabase.from("evenements").insert({
      titre: form.titre, description: form.description, date: selectedDay,
      heure: form.heure, type: form.type, created_by: userId,
    });
    setForm({ titre: "", description: "", heure: "", type: "event" });
    setShowForm(false);
    chargerEvenements();
  };

  const supprimerEvenement = async (id: string) => {
    await supabase.from("evenements").delete().eq("id", id);
    chargerEvenements();
  };

  const prochains = evenements.filter(e => e.date >= todayStr).slice(0, 5);
  const evenementsJourSelectionne = selectedDay ? evenements.filter(e => e.date === selectedDay) : [];

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar active="/calendrier" />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-4xl font-bold text-white mb-2 text-center">📅 Calendrier</h1>
        <p className="text-gray-400 mb-8 text-center">Lives, deadlines et événements de la communauté</p>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => changerMois(-1)} className="text-gray-400 hover:text-white text-xl px-3 py-1 rounded-lg hover:bg-gray-800 transition-all">←</button>
              <h2 className="text-xl font-bold text-white">{MOIS[moisIdx]} {annee}</h2>
              <button onClick={() => changerMois(1)} className="text-gray-400 hover:text-white text-xl px-3 py-1 rounded-lg hover:bg-gray-800 transition-all">→</button>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2">
              {JOURS.map(j => <p key={j} className="text-center text-xs font-semibold text-gray-500 uppercase">{j}</p>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {cases.map((d, i) => {
                if (d === null) return <div key={i} />;
                const evs = evenementsDuJour(d);
                const estAujourdhui = formatDate(d) === todayStr;
                const estSelectionne = formatDate(d) === selectedDay;
                return (
                  <button key={i} onClick={() => ouvrirJour(d)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all relative ${estSelectionne ? "bg-blue-600 text-white" : estAujourdhui ? "bg-gray-800 text-blue-400 border border-blue-500" : "text-gray-300 hover:bg-gray-800"}`}>
                    {d}
                    {evs.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {evs.slice(0,3).map((e,idx) => <span key={idx} className={`w-1.5 h-1.5 rounded-full ${TYPES[e.type]?.color||"bg-blue-500"}`} />)}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-4">🔥 Prochains événements</h3>
              {prochains.length === 0 && <p className="text-sm text-gray-500">Aucun événement à venir.</p>}
              <div className="flex flex-col gap-3">
                {prochains.map(e => (
                  <div key={e.id} className="bg-gray-800 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{TYPES[e.type]?.emoji||"📌"}</span>
                      <p className="text-sm font-semibold text-white">{e.titre}</p>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(e.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long"})}{e.heure ? ` à ${e.heure}` : ""}</p>
                  </div>
                ))}
              </div>
            </div>

            {selectedDay && (
              <div className="bg-gray-900 border border-blue-500/30 rounded-2xl p-5">
                <h3 className="font-bold text-white mb-3">{new Date(selectedDay).toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"})}</h3>
                {evenementsJourSelectionne.length === 0 && <p className="text-sm text-gray-500 mb-3">Aucun événement ce jour.</p>}
                <div className="flex flex-col gap-2 mb-3">
                  {evenementsJourSelectionne.map(e => (
                    <div key={e.id} className="bg-gray-800 rounded-xl p-3 flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{TYPES[e.type]?.emoji} {e.titre}</p>
                        {e.heure && <p className="text-xs text-gray-400">🕐 {e.heure}</p>}
                        {e.description && <p className="text-xs text-gray-400 mt-1">{e.description}</p>}
                      </div>
                      {isAdmin && <button onClick={() => supprimerEvenement(e.id)} className="text-red-400 hover:text-red-300 text-xs flex-shrink-0">🗑️</button>}
                    </div>
                  ))}
                </div>
                {isAdmin && !showForm && (
                  <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">+ Ajouter un événement</button>
                )}
                {isAdmin && showForm && (
                  <div className="flex flex-col gap-2 mt-2">
                    <input value={form.titre} onChange={e => setForm(p => ({...p, titre: e.target.value}))} placeholder="Titre" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                    <input value={form.heure} onChange={e => setForm(p => ({...p, heure: e.target.value}))} placeholder="Heure (ex: 18h00)" className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
                    <textarea value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} placeholder="Description (optionnel)" rows={2} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 resize-none" />
                    <select value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                      {Object.entries(TYPES).map(([key, t]: any) => <option key={key} value={key}>{t.emoji} {t.label}</option>)}
                    </select>
                    <div className="flex gap-2">
                      <button onClick={creerEvenement} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition-colors">Créer</button>
                      <button onClick={() => setShowForm(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors">Annuler</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
